'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useProfile, useUpdateProfile, useResumes, useDeleteResume, useSetDefaultResume, useUploadResume } from '@/hooks/useProfile'
import { toast } from 'react-toastify'
import { CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

import ProfileHero from '@/components/profile/ProfileHero'
import PersonalInfoCard from '@/components/profile/PersonalInfoCard'
import ProfessionalLinksCard from '@/components/profile/ProfessionalLinksCard'
import ResumesSection from '@/components/profile/ResumesSection'
import JobPreferencesCard from '@/components/profile/JobPreferencesCard'
import SkillsCard from '@/components/profile/SkillsCard'
import VisaCard from '@/components/profile/VisaCard'
import { SectionLabel } from '@/components/profile/shared'
import type { ProfileData } from '@/components/profile/types'

export default function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.replace('/login')
  }, [isAuthenticated, authLoading, router])

  // ── Data ───────────────────────────────────────────────
  const { data: profile, isLoading: profileLoading } = useProfile()
  const { data: resumes = [], isLoading: resumesLoading } = useResumes()

  // ── Mutations ──────────────────────────────────────────
  const updateProfile = useUpdateProfile()
  const deleteResume = useDeleteResume()
  const setDefault = useSetDefaultResume()
  const uploadResume = useUploadResume()

  // Local form state — seeded from query data once loaded
  const [form, setForm] = useState<ProfileData>({
    headline: '', location: '', linkedinUrl: '', githubUrl: '', portfolioUrl: '',
  })
  const [skills, setSkills] = useState<string[]>([])
  const [visaType, setVisaType] = useState<string | null>(null)

  useEffect(() => {
    if (profile) {
      setForm({
        headline: profile.headline ?? '',
        location: profile.location ?? '',
        linkedinUrl: profile.linkedinUrl ?? '',
        githubUrl: profile.githubUrl ?? '',
        portfolioUrl: profile.portfolioUrl ?? '',
      })
      setSkills(profile.skills ?? [])
      setVisaType(profile.visaType ?? null)
    }
  }, [profile])

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-section-alt">
        <div className="w-7 h-7 border-2 border-navy border-t-blue-accent rounded-full animate-spin" />
      </div>
    )
  }

  const initials = ((user.firstName?.[0] ?? '') + (user.lastName?.[0] ?? '')).toUpperCase() || user.email[0].toUpperCase()
  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email
  const onChange = (k: keyof ProfileData) => (v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = async () => {
    // URL fields: send null explicitly when cleared so backend actually clears them.
    // Other string fields: drop empties (backend ignores missing optional fields).
    const urlFields = ['linkedinUrl', 'githubUrl', 'portfolioUrl'] as const
    const isBarePrefixOnly = (url: string) =>
      /^https?:\/\/(www\.)?(linkedin\.com\/in|github\.com)\/?$/i.test(url)

    const nonUrlEntries = Object.entries(form)
      .filter(([k, v]) => !urlFields.includes(k as typeof urlFields[number]) && v !== '')
    const urlEntries = urlFields.map((k) => {
      const v = form[k]
      const cleared = !v || isBarePrefixOnly(v)
      return [k, cleared ? null : v]
    })
    const payload = { ...Object.fromEntries([...nonUrlEntries, ...urlEntries]), skills, visaType: visaType ?? null }
    try {
      await updateProfile.mutateAsync(payload as Partial<ProfileData>)
      toast.success('Profile saved!')
    } catch {
      toast.error('Failed to save profile')
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      await setDefault.mutateAsync(id)
      toast.success('Default resume updated')
    } catch {
      toast.error('Failed to set default')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteResume.mutateAsync(id)
      toast.success('Resume deleted')
    } catch {
      toast.error('Failed to delete resume')
    }
  }

  const handleUpload = async (file: File, label?: string) => {
    try {
      await uploadResume.mutateAsync({ file, label })
      toast.success('Resume uploaded!')
    } catch {
      toast.error('Upload failed')
    }
  }

  const saving = updateProfile.isPending

  return (
    <div className="min-h-screen bg-section-alt flex flex-col">

      {/* Topbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer">
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <div className="h-5 w-px bg-slate-200" />
            <Link href="/" className="cursor-pointer">
              <span className="text-xl font-bold text-navy">JobsFoundry</span>
            </Link>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || profileLoading}
            className="inline-flex items-center gap-2 bg-blue-accent hover:bg-blue-accent-hover disabled:opacity-50 active:scale-[0.98] text-navy text-sm font-bold px-6 py-2.5 rounded-xl transition-all duration-150 cursor-pointer shadow-lg"
          >
            {saving
              ? <span className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" />
              : <CheckCircleIcon className="w-4 h-4" />}
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </header>

      {/* Hero */}
      <ProfileHero
        initials={initials}
        displayName={displayName}
        email={user.email}
        headline={form.headline}
        location={form.location}
      />

      {/* Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-12 space-y-12">

        <div>
          <SectionLabel>Profile Details</SectionLabel>
          <div className="grid lg:grid-cols-2 gap-6">
            <PersonalInfoCard
              user={user}
              form={form}
              loaded={!profileLoading}
              onChange={onChange}
            />
            <ProfessionalLinksCard
              form={form}
              loaded={!profileLoading}
              onChange={onChange}
            />
          </div>
        </div>

        <div>
          <SectionLabel>Skills</SectionLabel>
          <SkillsCard skills={skills} onChange={setSkills} />
        </div>

        <div>
          <SectionLabel>Work Authorization</SectionLabel>
          <VisaCard value={visaType} onChange={setVisaType} />
        </div>

        <ResumesSection
          resumes={resumes}
          loaded={!resumesLoading}
          uploading={uploadResume.isPending}
          busyResumeId={
            deleteResume.isPending ? (deleteResume.variables as string) :
            setDefault.isPending ? (setDefault.variables as string) : null
          }
          onUpload={handleUpload}
          onSetDefault={handleSetDefault}
          onDelete={handleDelete}
        />

        <JobPreferencesCard />

      </main>
    </div>
  )
}
