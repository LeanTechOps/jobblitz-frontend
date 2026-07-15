'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useRecruiterUser, useRecruiterResumeUrl } from '@/hooks/useRecruiter'
import { toast } from 'react-toastify'
import {
  ChevronLeftIcon,
  DocumentTextIcon,
  LinkIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  StarIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline'

const PLAN_PILL: Record<string, string> = {
  FORGE: 'bg-slate-200 text-slate-800 font-semibold',
  FORGE_FREE: 'bg-amber-50 text-amber-700 font-bold border border-amber-200',
  CRAFT: 'bg-blue-muted text-navy font-bold',
  LAUNCH: 'bg-blue-accent text-navy font-bold',
  MOMENTUM: 'bg-navy text-white font-bold',
}

const VISA_LABELS: Record<string, string> = {
  US_CITIZEN: 'US Citizen', GREEN_CARD: 'Green Card', H1B: 'H-1B',
  H4_EAD: 'H-4 EAD', L1: 'L-1', O1: 'O-1', TN: 'TN',
  F1_OPT: 'F-1 OPT', F1_CPT: 'F-1 CPT', EAD: 'EAD', OTHER: 'Other',
}

// Every label is solid navy. Every value is solid navy. No opacity tricks.
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3 border-b border-slate-100 last:border-0">
      <span className="text-xs font-bold text-navy uppercase tracking-widest w-28 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm font-semibold text-navy">{value ?? <span className="text-slate-400">—</span>}</span>
    </div>
  )
}

function ResumeDownloadButton({ resumeId, fileName }: { resumeId: string; fileName: string }) {
  const { refetch, isFetching } = useRecruiterResumeUrl(resumeId)

  const handleDownload = async () => {
    const { data, error } = await refetch()
    if (error || !data?.downloadUrl) {
      toast.error('Failed to get download link')
      return
    }
    const a = document.createElement('a')
    a.href = data.downloadUrl
    a.download = data.fileName ?? fileName
    a.target = '_blank'
    a.rel = 'noreferrer'
    a.click()
  }

  return (
    <button
      onClick={handleDownload}
      disabled={isFetching}
      className="p-1.5 rounded-lg hover:bg-blue-muted text-navy hover:text-navy-dark transition-colors cursor-pointer disabled:opacity-50"
      title="Download resume"
    >
      {isFetching
        ? <span className="w-4 h-4 border-2 border-slate-300 border-t-navy rounded-full animate-spin inline-block" />
        : <ArrowDownTrayIcon className="w-4 h-4" />}
    </button>
  )
}

export default function RecruiterUserProfilePage() {
  const { id } = useParams<{ id: string }>()
  const { data: user, isLoading } = useRecruiterUser(id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 rounded-full border-2 border-navy border-t-blue-accent animate-spin" />
      </div>
    )
  }

  if (!user) return <div className="p-8 font-semibold text-navy">User not found.</div>

  const p = user.profile
  const fullAddress = [p?.address, p?.city, p?.state, p?.zipCode, p?.country].filter(Boolean).join(', ')

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/recruiter/users"
          className="p-1.5 rounded-xl hover:bg-blue-muted text-navy hover:text-navy-dark transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-semibold text-navy">User Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left col */}
        <div className="space-y-4">
          {/* Identity card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
            {user.avatar ? (
              <img src={user.avatar} alt="" referrerPolicy="no-referrer" className="w-16 h-16 rounded-full object-cover mx-auto mb-3 ring-2 ring-blue-accent" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-navy flex items-center justify-center text-2xl font-extrabold text-blue-accent mx-auto mb-3">
                {(user.firstName?.[0] ?? user.email[0]).toUpperCase()}
              </div>
            )}
            <p className="font-bold text-navy text-lg">{user.firstName} {user.lastName}</p>
            {p?.headline && <p className="text-sm font-medium text-slate-600 mt-1">{p.headline}</p>}
            {p?.location && (
              <p className="text-sm text-slate-600 flex items-center justify-center gap-1 mt-1.5">
                <MapPinIcon className="w-3.5 h-3.5 text-peach" /> {p.location}
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${user.role === 'ADMIN' ? 'bg-blue-accent text-navy' : 'bg-slate-200 text-slate-700'}`}>
                {user.role}
              </span>
              {user.subscription && (
                <span className={`text-xs px-2.5 py-1 rounded-full ${PLAN_PILL[user.subscription.plan] ?? 'bg-slate-200 text-slate-700 font-semibold'}`}>
                  {user.subscription.plan.replace('_', ' ')}
                </span>
              )}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-navy uppercase tracking-widest">Contact</h3>
            <div className="flex items-center gap-2 text-sm font-semibold text-navy">
              <EnvelopeIcon className="w-4 h-4 shrink-0 text-slate-500" />
              <span className="truncate">{user.email}</span>
            </div>
            {p?.phoneNumber && (
              <div className="flex items-center gap-2 text-sm font-semibold text-navy">
                <PhoneIcon className="w-4 h-4 shrink-0 text-slate-500" />
                {p.phoneNumber}
              </div>
            )}
          </div>

          {/* Links */}
          {(p?.linkedinUrl || p?.githubUrl || p?.portfolioUrl) && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
              <h3 className="text-xs font-bold text-navy uppercase tracking-widest mb-3">Links</h3>
              {p?.linkedinUrl && (
                <a href={p.linkedinUrl} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-navy hover:text-navy-light transition-colors">
                  <LinkIcon className="w-4 h-4 text-slate-500" /> LinkedIn
                </a>
              )}
              {p?.githubUrl && (
                <a href={p.githubUrl} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-navy hover:text-navy-light transition-colors">
                  <LinkIcon className="w-4 h-4 text-slate-500" /> GitHub
                </a>
              )}
              {p?.portfolioUrl && (
                <a href={p.portfolioUrl} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-navy hover:text-navy-light transition-colors">
                  <LinkIcon className="w-4 h-4 text-slate-500" /> Portfolio
                </a>
              )}
            </div>
          )}

          {/* Subscription */}
          {user.subscription && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="text-xs font-bold text-navy uppercase tracking-widest mb-1">Subscription</h3>
              <Row label="Plan" value={user.subscription.plan.replace('_', ' ')} />
              <Row label="Status" value={user.subscription.status} />
              <Row label="Billing" value={user.subscription.billingCycle} />
              {user.subscription.currentPeriodEnd && (
                <Row label="Renews" value={new Date(user.subscription.currentPeriodEnd).toLocaleDateString()} />
              )}
            </div>
          )}
        </div>

        {/* Right col */}
        <div className="lg:col-span-2 space-y-4">
          {/* Bio */}
          {p?.bio && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="border-l-2 border-blue-accent pl-3 mb-3">
                <h3 className="text-sm font-bold text-navy">About</h3>
              </div>
              <p className="text-sm font-medium text-slate-700 whitespace-pre-wrap leading-relaxed">{p.bio}</p>
            </div>
          )}

          {/* Address & Visa */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="border-l-2 border-blue-accent pl-3 mb-2">
              <h3 className="text-sm font-bold text-navy">Address & Work Authorization</h3>
            </div>
            <Row label="Address" value={fullAddress || null} />
            <Row label="Visa Type" value={p?.visaType ? (VISA_LABELS[p.visaType] ?? p.visaType) : null} />
          </div>

          {/* Skills */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="border-l-2 border-blue-accent pl-3 mb-3">
              <h3 className="text-sm font-bold text-navy">Skills</h3>
            </div>
            {(p?.skills?.length ?? 0) > 0 ? (
              <div className="flex flex-wrap gap-2">
                {p!.skills.map((s) => (
                  <span key={s} className="text-xs bg-navy text-blue-accent font-bold px-3 py-1.5 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm font-semibold text-slate-600">No skills listed</p>
            )}
          </div>

          {/* Resumes */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="border-l-2 border-blue-accent pl-3 mb-3">
              <h3 className="text-sm font-bold text-navy">Resumes ({p?.resumes.length ?? 0})</h3>
            </div>
            {(p?.resumes.length ?? 0) > 0 ? (
              <div className="space-y-2">
                {p!.resumes.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 p-3 bg-section-alt rounded-xl border border-slate-200">
                    <DocumentTextIcon className="w-5 h-5 text-slate-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-navy truncate">{r.label || r.originalName}</p>
                      <p className="text-xs font-medium text-slate-600">Uploaded {new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                    {r.isDefault && (
                      <span className="flex items-center gap-1 text-xs font-bold text-navy bg-blue-accent px-2.5 py-0.5 rounded-full shrink-0">
                        <StarIcon className="w-3 h-3" /> Default
                      </span>
                    )}
                    <ResumeDownloadButton resumeId={r.id} fileName={r.originalName} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm font-semibold text-slate-600">No resumes uploaded</p>
            )}
          </div>

          {/* Account */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="border-l-2 border-blue-accent pl-3 mb-2">
              <h3 className="text-sm font-bold text-navy">Account</h3>
            </div>
            <Row label="Joined" value={new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
          </div>
        </div>
      </div>
    </div>
  )
}
