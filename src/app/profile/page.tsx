'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/api'
import { toast } from 'react-toastify'
import {
  ArrowLeftIcon,
  CloudArrowUpIcon,
  DocumentTextIcon,
  LinkIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  UserCircleIcon,
  StarIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  MapPinIcon,
  BriefcaseIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'

/* ─── Types ──────────────────────────────────────────────── */
interface ProfileData {
  headline: string
  location: string
  linkedinUrl: string
  githubUrl: string
  portfolioUrl: string
}
interface Resume {
  id: string
  originalName: string
  label: string | null
  contentType: string
  isDefault: boolean
  createdAt: string
  downloadUrl: string
}

const ALLOWED_TYPES: Record<string, boolean> = {
  'application/pdf': true,
  'application/msword': true,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': true,
}
const MAX_SIZE_MB = 10
const MAX_SIZE = MAX_SIZE_MB * 1024 * 1024

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/* ─── Input ──────────────────────────────────────────────── */
function Field({
  label, value, onChange, placeholder, type = 'text', readOnly = false, hint,
}: {
  label: string; value: string; onChange?: (v: string) => void
  placeholder?: string; type?: string; readOnly?: boolean; hint?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">{label}</label>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-lg text-[15px] transition-all outline-none border
          ${readOnly
            ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-default'
            : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/8'
          }`}
      />
      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    </div>
  )
}

/* ─── Card ───────────────────────────────────────────────── */
function Card({ label, icon: Icon, children }: { label: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-7 py-5 border-b border-slate-100">
        <Icon className="w-4.5 h-4.5 text-slate-400 flex-shrink-0" style={{ width: 18, height: 18 }} />
        <span className="text-[13px] font-semibold text-slate-700 tracking-wide">{label}</span>
      </div>
      <div className="px-7 py-6">{children}</div>
    </div>
  )
}

/* ─── Resume row ─────────────────────────────────────────── */
function ResumeRow({ resume, onSetDefault, onDelete, busy }: {
  resume: Resume; onSetDefault: (id: string) => void; onDelete: (id: string) => void; busy: string | null
}) {
  const isBusy = busy === resume.id
  return (
    <div className={`flex items-center gap-4 rounded-xl border p-4 transition-all duration-150
      ${resume.isDefault ? 'border-blue-200 bg-blue-50/60' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'}`}>

      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
        ${resume.isDefault ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
        <DocumentTextIcon className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[14px] font-semibold text-slate-800 truncate">
            {resume.label || resume.originalName}
          </span>
          {resume.isDefault && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full uppercase tracking-wide flex-shrink-0">
              <StarSolid className="w-2.5 h-2.5" /> Default
            </span>
          )}
        </div>
        {resume.label && <p className="text-[12px] text-slate-400 truncate mt-0.5">{resume.originalName}</p>}
        <p className="text-[12px] text-slate-400 mt-0.5">Uploaded {fmtDate(resume.createdAt)}</p>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <a href={resume.downloadUrl} target="_blank" rel="noreferrer" title="Download"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
          <ArrowDownTrayIcon className="w-4 h-4" />
        </a>
        {!resume.isDefault && (
          <button onClick={() => onSetDefault(resume.id)} disabled={isBusy} title="Set as default"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 disabled:opacity-40 transition-colors cursor-pointer">
            <StarIcon className="w-4 h-4" />
          </button>
        )}
        <button onClick={() => onDelete(resume.id)} disabled={isBusy} title="Delete"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-40 transition-colors cursor-pointer">
          {isBusy
            ? <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            : <TrashIcon className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────── */
export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  const [form, setForm] = useState<ProfileData>({ headline: '', location: '', linkedinUrl: '', githubUrl: '', portfolioUrl: '' })
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [saving, setSaving] = useState(false)
  const [resumes, setResumes] = useState<Resume[]>([])
  const [resumesLoaded, setResumesLoaded] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadLabel, setUploadLabel] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [busyResumeId, setBusyResumeId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace('/login')
  }, [isAuthenticated, loading, router])

  const loadProfile = useCallback(async () => {
    try {
      const data = await api.get<ProfileData>('/profile')
      setForm({ headline: data.headline ?? '', location: data.location ?? '', linkedinUrl: data.linkedinUrl ?? '', githubUrl: data.githubUrl ?? '', portfolioUrl: data.portfolioUrl ?? '' })
    } catch { toast.error('Failed to load profile') }
    finally { setProfileLoaded(true) }
  }, [])

  const loadResumes = useCallback(async () => {
    try { setResumes(await api.get<Resume[]>('/profile/resumes')) }
    catch { toast.error('Failed to load resumes') }
    finally { setResumesLoaded(true) }
  }, [])

  useEffect(() => {
    if (isAuthenticated) { loadProfile(); loadResumes() }
  }, [isAuthenticated, loadProfile, loadResumes])

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const initials = ((user.firstName?.[0] ?? '') + (user.lastName?.[0] ?? '')).toUpperCase() || user.email[0].toUpperCase()
  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email
  const completionFields = [user.firstName, user.lastName, form.headline, form.location, form.linkedinUrl, resumes.length ? 'yes' : '']
  const completion = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100)
  const set = (k: keyof ProfileData) => (v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = Object.fromEntries(Object.entries(form).filter(([, v]) => v !== ''))
      await api.patch('/profile', payload)
      toast.success('Profile saved!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save profile')
    } finally { setSaving(false) }
  }

  const handleResumeUpload = async (file: File) => {
    if (!ALLOWED_TYPES[file.type]) { toast.error('Only PDF, DOC, and DOCX files are accepted.'); return }
    if (file.size > MAX_SIZE) { toast.error(`File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max is ${MAX_SIZE_MB} MB.`); return }

    setUploading(true)
    const toastId = toast.loading('Preparing upload…')
    try {
      const { resumeId, uploadUrl } = await api.post<{ resumeId: string; key: string; uploadUrl: string }>(
        '/profile/resumes/initiate-upload',
        { originalName: file.name, contentType: file.type, fileSize: file.size },
      )
      toast.update(toastId, { render: 'Uploading…', type: 'default', isLoading: true })
      await axios.put(uploadUrl, file, { headers: { 'Content-Type': file.type } })
      toast.update(toastId, { render: 'Saving…', type: 'default', isLoading: true })
      await api.post('/profile/resumes/confirm-upload', {
        resumeId, originalName: file.name, contentType: file.type,
        ...(uploadLabel.trim() && { label: uploadLabel.trim() }),
      })
      toast.update(toastId, { render: 'Resume uploaded!', type: 'success', isLoading: false, autoClose: 4000 })
      setUploadLabel('')
      if (fileRef.current) fileRef.current.value = ''
      await loadResumes()
    } catch (err: unknown) {
      toast.update(toastId, { render: err instanceof Error ? err.message : 'Upload failed', type: 'error', isLoading: false, autoClose: 5000 })
    } finally { setUploading(false) }
  }

  const handleSetDefault = async (resumeId: string) => {
    setBusyResumeId(resumeId)
    try { await api.patch(`/profile/resumes/${resumeId}/default`); toast.success('Default resume updated'); await loadResumes() }
    catch (err: unknown) { toast.error(err instanceof Error ? err.message : 'Failed') }
    finally { setBusyResumeId(null) }
  }

  const handleDelete = async (resumeId: string) => {
    setBusyResumeId(resumeId)
    try { await api.delete(`/profile/resumes/${resumeId}`); toast.success('Resume deleted'); setResumes(p => p.filter(r => r.id !== resumeId)) }
    catch (err: unknown) { toast.error(err instanceof Error ? err.message : 'Failed') }
    finally { setBusyResumeId(null) }
  }

  return (
    <div className="min-h-screen bg-[#f4f6f9]">

      {/* ── Top nav ── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-[60px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer">
              <ArrowLeftIcon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
            </Link>
            <div className="h-5 w-px bg-slate-200" />
            <Link href="/" className="cursor-pointer">
              <span className="text-[18px] font-bold tracking-tight">
                <span className="text-[#1e3a5f]">Job</span><span className="text-blue-600">Blitz</span>
              </span>
            </Link>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !profileLoaded}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 active:scale-[0.98] text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg transition-all duration-150 cursor-pointer shadow-sm"
          >
            {saving ? <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircleIcon className="w-4 h-4" />}
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </header>

      {/* ── Profile hero ── */}
      <div className="bg-gradient-to-br from-[#0f2744] via-[#1a3a6b] to-[#1d4ed8] px-6 pt-10 pb-24">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-end gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-[88px] h-[88px] rounded-2xl bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-xl ring-4 ring-white/10">
              <span className="text-[28px] font-black text-white select-none tracking-tight">{initials}</span>
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-emerald-500 border-2 border-[#0f2744] rounded-full" />
          </div>

          <div className="flex-1 min-w-0 pb-1">
            <h1 className="text-[26px] font-extrabold text-white tracking-tight leading-tight">{displayName}</h1>
            <p className="text-blue-300 text-[13px] mt-0.5">{user.email}</p>
            <div className="flex flex-wrap items-center gap-4 mt-2.5">
              {form.headline && (
                <span className="flex items-center gap-1.5 text-[13px] text-blue-100 font-medium">
                  <BriefcaseIcon className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  {form.headline}
                </span>
              )}
              {form.location && (
                <span className="flex items-center gap-1.5 text-[13px] text-blue-200">
                  <MapPinIcon className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  {form.location}
                </span>
              )}
            </div>
          </div>

          {/* Completion */}
          <div className="flex-shrink-0 bg-white/8 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-4 min-w-[140px] text-center">
            <p className={`text-[36px] font-black leading-none ${completion === 100 ? 'text-emerald-400' : 'text-white'}`}>{completion}%</p>
            <p className="text-[11px] text-blue-300 font-semibold mt-1 uppercase tracking-widest">Complete</p>
            <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${completion}%`, background: completion === 100 ? '#34d399' : '#60a5fa' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <main className="max-w-5xl mx-auto px-6 -mt-12 pb-16 space-y-5">

        <div className="grid lg:grid-cols-2 gap-5">

          {/* Personal Info */}
          <Card label="Personal Information" icon={UserCircleIcon}>
            {!profileLoaded ? (
              <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="h-11 bg-slate-100 rounded-lg animate-pulse" />)}</div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="First name" value={user.firstName ?? ''} readOnly hint="Set by Google" />
                  <Field label="Last name" value={user.lastName ?? ''} readOnly hint="Set by Google" />
                </div>
                <Field label="Email" value={user.email} readOnly hint="Connected via Google OAuth" />
                <Field label="Headline" value={form.headline} onChange={set('headline')} placeholder="e.g. Senior Software Engineer · 5 YOE" />
                <Field label="Location" value={form.location} onChange={set('location')} placeholder="e.g. San Francisco, CA" />
              </div>
            )}
          </Card>

          {/* Professional Links */}
          <Card label="Professional Links" icon={LinkIcon}>
            {!profileLoaded ? (
              <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-11 bg-slate-100 rounded-lg animate-pulse" />)}</div>
            ) : (
              <div className="space-y-5">
                {/* LinkedIn */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">LinkedIn</label>
                  <div className="flex border border-slate-300 rounded-lg overflow-hidden focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-600/8 transition-all bg-white">
                    <span className="px-3 py-3 bg-slate-50 border-r border-slate-200 text-[12px] font-semibold text-slate-400 whitespace-nowrap">linkedin.com/in/</span>
                    <input type="text"
                      value={form.linkedinUrl.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, '')}
                      onChange={e => set('linkedinUrl')(`https://linkedin.com/in/${e.target.value}`)}
                      placeholder="your-handle"
                      className="flex-1 px-3 py-3 text-[15px] text-slate-900 outline-none bg-white placeholder:text-slate-300" />
                  </div>
                </div>
                {/* GitHub */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">GitHub</label>
                  <div className="flex border border-slate-300 rounded-lg overflow-hidden focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-600/8 transition-all bg-white">
                    <span className="px-3 py-3 bg-slate-50 border-r border-slate-200 text-[12px] font-semibold text-slate-400 whitespace-nowrap">github.com/</span>
                    <input type="text"
                      value={form.githubUrl.replace(/^https?:\/\/(www\.)?github\.com\//i, '')}
                      onChange={e => set('githubUrl')(`https://github.com/${e.target.value}`)}
                      placeholder="your-handle"
                      className="flex-1 px-3 py-3 text-[15px] text-slate-900 outline-none bg-white placeholder:text-slate-300" />
                  </div>
                </div>
                <Field label="Portfolio / Website" value={form.portfolioUrl} onChange={set('portfolioUrl')} placeholder="https://yoursite.com" type="url" />

                {(form.linkedinUrl || form.githubUrl || form.portfolioUrl) && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                    {form.linkedinUrl && (
                      <a href={form.linkedinUrl} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                        LinkedIn ↗
                      </a>
                    )}
                    {form.githubUrl && (
                      <a href={form.githubUrl} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer">
                        GitHub ↗
                      </a>
                    )}
                    {form.portfolioUrl && (
                      <a href={form.portfolioUrl} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-violet-700 bg-violet-50 border border-violet-200 px-3 py-1.5 rounded-lg hover:bg-violet-100 transition-colors cursor-pointer">
                        Portfolio ↗
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Resumes */}
        <Card label="Resumes" icon={DocumentTextIcon}>
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-5 items-start">
              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleResumeUpload(f) }}
                onClick={() => !uploading && fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 select-none
                  ${uploading ? 'opacity-60 cursor-default' : 'cursor-pointer'}
                  ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'}`}
              >
                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleResumeUpload(f) }} />
                {uploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-9 h-9 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-[13px] font-semibold text-blue-600">Uploading…</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                      <CloudArrowUpIcon className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-slate-700">Drop your resume here</p>
                      <p className="text-[12px] text-slate-400 mt-1">or click to browse · PDF, DOC, DOCX · max {MAX_SIZE_MB} MB</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                    Label <span className="normal-case font-normal text-slate-400">(optional)</span>
                  </label>
                  <input type="text" value={uploadLabel} onChange={e => setUploadLabel(e.target.value)} maxLength={100}
                    placeholder="e.g. Senior Engineer Resume"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 text-[15px] text-slate-900 placeholder:text-slate-300 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/8 transition-all" />
                  <p className="text-[11px] text-slate-400">Give this version a name to tell them apart.</p>
                </div>
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Resume tips</p>
                  {['Use ATS-friendly formatting', 'Keep it to 1–2 pages', 'Quantify your achievements', 'Tailor keywords to target roles'].map(tip => (
                    <div key={tip} className="flex items-center gap-2">
                      <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span className="text-[12px] text-slate-500">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-3">Your resumes</p>
              {!resumesLoaded ? (
                <div className="space-y-3">{[...Array(2)].map((_, i) => <div key={i} className="h-[68px] bg-slate-100 rounded-xl animate-pulse" />)}</div>
              ) : resumes.length === 0 ? (
                <div className="flex items-center gap-3 border border-dashed border-slate-200 rounded-xl p-5 bg-slate-50">
                  <DocumentTextIcon className="w-5 h-5 text-slate-300 flex-shrink-0" />
                  <div>
                    <p className="text-[13px] font-semibold text-slate-400">No resumes yet</p>
                    <p className="text-[12px] text-slate-400 mt-0.5">Upload your first resume above to get started</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {resumes.map(r => (
                    <ResumeRow key={r.id} resume={r} onSetDefault={handleSetDefault} onDelete={handleDelete} busy={busyResumeId} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Job Preferences */}
        <Card label="Job Preferences" icon={Cog6ToothIcon}>
          <div className="flex items-center gap-4 py-2">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
              <PencilSquareIcon className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-slate-700">Coming soon</p>
              <p className="text-[13px] text-slate-400 mt-0.5 max-w-md">
                Set your target roles, preferred locations, salary range, and work type. JobBlitz uses these to auto-apply to your best-matched jobs.
              </p>
            </div>
          </div>
        </Card>

      </main>
    </div>
  )
}
