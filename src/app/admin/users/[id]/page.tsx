'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import {
  ChevronLeftIcon,
  DocumentTextIcon,
  LinkIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  StarIcon,
} from '@heroicons/react/24/outline'

interface AdminUserProfile {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  avatar: string | null
  role: string
  createdAt: string
  subscription: {
    plan: string
    status: string
    currentPeriodEnd: string | null
    billingCycle: string | null
  } | null
  profile: {
    headline: string | null
    bio: string | null
    location: string | null
    phoneNumber: string | null
    linkedinUrl: string | null
    githubUrl: string | null
    portfolioUrl: string | null
    address: string | null
    city: string | null
    state: string | null
    country: string | null
    zipCode: string | null
    visaType: string | null
    skills: string[]
    resumes: {
      id: string
      originalName: string
      label: string | null
      isDefault: boolean
      createdAt: string
    }[]
  } | null
}

const PLAN_PILL: Record<string, string> = {
  FREE: 'bg-slate-100 text-slate-500',
  PRO_FREE: 'bg-blue-muted text-navy',
  PRO: 'bg-blue-accent/20 text-navy font-semibold',
  BUSINESS: 'bg-peach-muted text-peach font-semibold',
}

const VISA_LABELS: Record<string, string> = {
  US_CITIZEN: 'US Citizen', GREEN_CARD: 'Green Card', H1B: 'H-1B',
  H4_EAD: 'H-4 EAD', L1: 'L-1', O1: 'O-1', TN: 'TN',
  F1_OPT: 'F-1 OPT', F1_CPT: 'F-1 CPT', EAD: 'EAD', OTHER: 'Other',
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3 border-b border-slate-50 last:border-0">
      <span className="text-xs font-bold text-slate-300 uppercase tracking-widest w-28 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-slate-700">{value ?? <span className="text-slate-200">—</span>}</span>
    </div>
  )
}

export default function AdminUserProfilePage() {
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<AdminUserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<AdminUserProfile>(`/admin/users/${id}`).then(setUser).finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 rounded-full border-2 border-navy border-t-blue-accent animate-spin" />
      </div>
    )
  }

  if (!user) return <div className="p-8 text-slate-400">User not found.</div>

  const p = user.profile
  const fullAddress = [p?.address, p?.city, p?.state, p?.zipCode, p?.country].filter(Boolean).join(', ')

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Back */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/users"
          className="p-1.5 rounded-xl hover:bg-blue-muted text-slate-400 hover:text-navy transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </Link>
        <div>
          <p className="text-xs font-bold tracking-widest text-blue-accent/70 uppercase">Users</p>
          <h1 className="text-2xl font-bold text-navy">User Profile</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left col */}
        <div className="space-y-4">
          {/* Identity card */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 text-center">
            {user.avatar ? (
              <img src={user.avatar} alt="" className="w-16 h-16 rounded-full object-cover mx-auto mb-3 ring-2 ring-blue-accent/30" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-muted border-2 border-blue-accent/20 flex items-center justify-center text-2xl font-extrabold text-navy mx-auto mb-3">
                {(user.firstName?.[0] ?? user.email[0]).toUpperCase()}
              </div>
            )}
            <p className="font-bold text-navy text-lg">
              {user.firstName} {user.lastName}
            </p>
            {p?.headline && <p className="text-sm text-slate-500 mt-1">{p.headline}</p>}
            {p?.location && (
              <p className="text-xs text-slate-400 flex items-center justify-center gap-1 mt-1.5">
                <MapPinIcon className="w-3.5 h-3.5 text-peach" /> {p.location}
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${user.role === 'ADMIN' ? 'bg-blue-accent text-navy' : 'bg-slate-100 text-slate-500'}`}>
                {user.role}
              </span>
              {user.subscription && (
                <span className={`text-xs px-2.5 py-1 rounded-full ${PLAN_PILL[user.subscription.plan] ?? 'bg-slate-100 text-slate-500'}`}>
                  {user.subscription.plan.replace('_', ' ')}
                </span>
              )}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Contact</h3>
            <a href={`mailto:${user.email}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-navy transition-colors">
              <EnvelopeIcon className="w-4 h-4 shrink-0 text-slate-300" />
              <span className="truncate">{user.email}</span>
            </a>
            {p?.phoneNumber && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <PhoneIcon className="w-4 h-4 shrink-0 text-slate-300" />
                {p.phoneNumber}
              </div>
            )}
          </div>

          {/* Links */}
          {(p?.linkedinUrl || p?.githubUrl || p?.portfolioUrl) && (
            <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Links</h3>
              {p?.linkedinUrl && (
                <a href={p.linkedinUrl} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-navy hover:text-blue-accent transition-colors">
                  <LinkIcon className="w-4 h-4 text-slate-300" /> LinkedIn
                </a>
              )}
              {p?.githubUrl && (
                <a href={p.githubUrl} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-navy hover:text-blue-accent transition-colors">
                  <LinkIcon className="w-4 h-4 text-slate-300" /> GitHub
                </a>
              )}
              {p?.portfolioUrl && (
                <a href={p.portfolioUrl} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-navy hover:text-blue-accent transition-colors">
                  <LinkIcon className="w-4 h-4 text-slate-300" /> Portfolio
                </a>
              )}
            </div>
          )}

          {/* Subscription */}
          {user.subscription && (
            <div className="bg-white border border-slate-100 rounded-2xl p-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Subscription</h3>
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
            <div className="bg-white border border-slate-100 rounded-2xl p-6">
              <div className="border-l-2 border-blue-accent pl-3 mb-3">
                <h3 className="text-sm font-bold text-navy">About</h3>
              </div>
              <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{p.bio}</p>
            </div>
          )}

          {/* Address & Visa */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6">
            <div className="border-l-2 border-blue-accent pl-3 mb-2">
              <h3 className="text-sm font-bold text-navy">Address & Work Authorization</h3>
            </div>
            <Row label="Address" value={fullAddress || null} />
            <Row label="Visa Type" value={p?.visaType ? (VISA_LABELS[p.visaType] ?? p.visaType) : null} />
          </div>

          {/* Skills */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6">
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
              <p className="text-sm text-slate-200">No skills listed</p>
            )}
          </div>

          {/* Resumes */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6">
            <div className="border-l-2 border-blue-accent pl-3 mb-3">
              <h3 className="text-sm font-bold text-navy">Resumes ({p?.resumes.length ?? 0})</h3>
            </div>
            {(p?.resumes.length ?? 0) > 0 ? (
              <div className="space-y-2">
                {p!.resumes.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 p-3 bg-section-alt rounded-xl border border-slate-100">
                    <DocumentTextIcon className="w-5 h-5 text-slate-300 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-navy truncate">{r.label || r.originalName}</p>
                      <p className="text-xs text-slate-400">Uploaded {new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                    {r.isDefault && (
                      <span className="flex items-center gap-1 text-xs font-bold text-navy bg-blue-accent px-2.5 py-0.5 rounded-full shrink-0">
                        <StarIcon className="w-3 h-3" /> Default
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-200">No resumes uploaded</p>
            )}
          </div>

          {/* Account meta */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6">
            <div className="border-l-2 border-blue-accent pl-3 mb-2">
              <h3 className="text-sm font-bold text-navy">Account</h3>
            </div>
            <Row label="User ID" value={<span className="font-mono text-xs bg-section-alt px-2 py-0.5 rounded">{user.id}</span>} />
            <Row label="Joined" value={new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
          </div>
        </div>
      </div>
    </div>
  )
}
