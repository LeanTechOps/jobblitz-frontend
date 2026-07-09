'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useMyApplications, ApplicationStatus } from '@/hooks/useApplications'
import {
  ChevronLeftIcon, MapPinIcon, CurrencyDollarIcon,
  CalendarDaysIcon, CheckBadgeIcon, GlobeAltIcon, DocumentIcon,
} from '@heroicons/react/24/outline'

// ── Identical maps/components to admin job view ───────────────

const STATUS_PILL: Record<string, string> = {
  ACTIVE: 'bg-blue-accent text-navy font-bold',
  DRAFT:  'bg-navy/10 text-navy/60',
  PAUSED: 'bg-peach-muted text-peach font-semibold',
  CLOSED: 'bg-navy/10 text-navy/40',
}

const APP_STATUS_CONFIG: Record<ApplicationStatus, { label: string; pill: string }> = {
  APPLIED:   { label: 'Applied',   pill: 'bg-blue-muted text-navy font-bold' },
  INTERVIEW: { label: 'Interview', pill: 'bg-amber-50 text-amber-700 font-bold border border-amber-200' },
  OFFER:     { label: 'Offer',     pill: 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200' },
  REJECTED:  { label: 'Rejected',  pill: 'bg-peach-muted text-peach font-bold' },
  WITHDRAWN: { label: 'Withdrawn', pill: 'bg-slate-100 text-slate-500' },
}

const WORK_MODE_LABEL: Record<string, string> = { ONSITE: 'On-site', REMOTE: 'Remote', HYBRID: 'Hybrid' }
const JOB_TYPE_LABEL: Record<string, string>  = { FULL_TIME: 'Full-time', PART_TIME: 'Part-time', CONTRACT: 'Contract', INTERNSHIP: 'Internship', FREELANCE: 'Freelance' }
const EXP_LABEL: Record<string, string>       = { ENTRY: 'Entry Level', MID: 'Mid Level', SENIOR: 'Senior', LEAD: 'Lead', EXECUTIVE: 'Executive' }
const PERIOD_LABEL: Record<string, string>    = { HOURLY: 'per hour', WEEKLY: 'per week', BIWEEKLY: 'every 15 days', MONTHLY: 'per month' }

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
      <div className="border-l-2 border-blue-accent pl-3">
        <h2 className="text-base font-bold text-navy">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-sm text-slate-500 w-36 shrink-0">{label}</span>
      <span className="text-sm font-semibold text-navy">{value ?? <span className="text-slate-400">—</span>}</span>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const { data: applications = [], isLoading } = useMyApplications()

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace('/login')
  }, [isAuthenticated, loading, router])

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 rounded-full border-2 border-navy border-t-blue-accent animate-spin" />
      </div>
    )
  }

  const app = applications.find((a) => a.id === id)
  const job = app?.job

  if (!app || !job) {
    return (
      <div className="p-8 text-slate-500">
        Application not found.{' '}
        <Link href="/applications" className="text-navy underline">Back to applications</Link>
      </div>
    )
  }

  const appCfg = APP_STATUS_CONFIG[app.status] ?? APP_STATUS_CONFIG.APPLIED

  const nextInterview = app.status === 'INTERVIEW' && app.interviewAt ? new Date(app.interviewAt) : null
  const isPast = nextInterview ? nextInterview < new Date() : false

  const salary = (() => {
    if (job.salaryNegotiable) return 'Negotiable'
    if (!job.salaryMin && !job.salaryMax) return null
    const range = [job.salaryMin, job.salaryMax].filter(Boolean).map((n) => Number(n).toLocaleString()).join(' – ')
    const period = PERIOD_LABEL[job.salaryPeriod] ?? ''
    return `${job.salaryCurrency} ${range} ${period}`.trim()
  })()

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-5">

      {/* Header — same as admin, minus the action buttons */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/applications" className="p-1.5 rounded-xl hover:bg-blue-muted text-navy/40 hover:text-navy transition-colors">
            <ChevronLeftIcon className="w-5 h-5" />
          </Link>
          {app.companyLogoUrl ? (
            <div className="w-12 h-12 rounded-xl border border-slate-200 bg-white p-1 flex items-center justify-center shrink-0 overflow-hidden">
              <img src={app.companyLogoUrl} alt={job.company} className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-xl bg-blue-muted border border-blue-accent/20 flex items-center justify-center text-lg font-bold text-navy shrink-0">
              {job.company[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-semibold text-navy">{job.title}</h1>
              <span className={`text-xs px-2.5 py-1 rounded-full ${STATUS_PILL[job.status] ?? 'bg-slate-100 text-slate-500'}`}>
                {job.status}
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-0.5">{job.company}{job.location ? ` · ${job.location}` : ''}</p>
          </div>
        </div>
      </div>

      {/* Application status — injected here, nothing like this on admin page */}
      <Section title="My Application">
        <Row label="Status" value={<span className={`text-xs px-2.5 py-1 rounded-full ${appCfg.pill}`}>{appCfg.label}</span>} />
        <Row label="Applied" value={new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })} />
        {app.resume && (
          <Row label="Resume used" value={
            <span className="flex items-center gap-1.5">
              <DocumentIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {app.resume.label || app.resume.originalName}
            </span>
          } />
        )}
        {nextInterview && (
          <div className={`mt-1 flex items-start gap-2.5 px-3 py-2.5 rounded-xl ${isPast ? 'bg-slate-50 border border-slate-200' : 'bg-amber-50 border border-amber-200'}`}>
            <CalendarDaysIcon className={`w-4 h-4 mt-0.5 shrink-0 ${isPast ? 'text-slate-400' : 'text-amber-600'}`} />
            <div>
              <p className={`text-xs font-bold ${isPast ? 'text-slate-500' : 'text-amber-700'}`}>
                Interview {isPast ? 'was scheduled for' : 'scheduled for'}
              </p>
              <p className={`text-sm font-bold mt-0.5 ${isPast ? 'text-slate-600' : 'text-amber-800'}`}>
                {nextInterview.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                {' at '}
                {nextInterview.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        )}
        {app.status === 'OFFER' && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-base">🎉</span>
            <p className="text-sm font-bold text-emerald-700">Offer received — congratulations!</p>
          </div>
        )}
        {app.notes && (
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-blue-muted border border-blue-accent/20">
            <span className="text-navy/50 text-xs mt-0.5 font-bold shrink-0">Note</span>
            <p className="text-sm font-medium text-navy leading-snug">{app.notes}</p>
          </div>
        )}
      </Section>

      {/* Everything below is identical to admin job view */}
      <div className="grid sm:grid-cols-2 gap-5">
        <Section title="Job Details">
          <Row label="Work Mode"  value={WORK_MODE_LABEL[job.workMode] ?? job.workMode} />
          <Row label="Type"       value={JOB_TYPE_LABEL[job.type] ?? job.type} />
          <Row label="Experience" value={EXP_LABEL[job.experienceLevel] ?? job.experienceLevel} />
          {job.location && (
            <Row label="Location" value={
              <span className="flex items-center gap-1"><MapPinIcon className="w-3.5 h-3.5 text-slate-400" />{job.location}</span>
            } />
          )}
        </Section>

        <Section title="Compensation">
          {salary
            ? <Row label="Salary" value={<span className="flex items-center gap-1"><CurrencyDollarIcon className="w-3.5 h-3.5 text-slate-400" />{salary}</span>} />
            : <p className="text-sm text-slate-400">No salary info provided.</p>
          }
          <Row label="Visa Sponsorship" value={job.visaSponsorship ? '✓ Offered' : 'Not offered'} />
          {job.closesAt && (
            <Row label="Closes" value={
              <span className="flex items-center gap-1">
                <CalendarDaysIcon className="w-3.5 h-3.5 text-slate-400" />
                {new Date(job.closesAt).toLocaleDateString()}
              </span>
            } />
          )}
          {job.applicationUrl && (
            <Row label="Apply URL" value={
              <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:underline break-all">
                <GlobeAltIcon className="w-3.5 h-3.5 shrink-0" />
                {job.applicationUrl}
              </a>
            } />
          )}
        </Section>
      </div>

      {job.skills.length > 0 && (
        <Section title="Required Skills">
          <div className="flex flex-wrap gap-2">
            {job.skills.map((s) => (
              <span key={s} className="inline-flex items-center gap-1 text-xs font-bold bg-navy text-blue-accent px-3 py-1.5 rounded-full">
                <CheckBadgeIcon className="w-3.5 h-3.5" />{s}
              </span>
            ))}
          </div>
        </Section>
      )}

      {job.description && (
        <Section title="Description">
          <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{job.description}</p>
        </Section>
      )}

      {job.responsibilities && (
        <Section title="Responsibilities">
          <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{job.responsibilities}</p>
        </Section>
      )}

      {job.requirements && (
        <Section title="Requirements">
          <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{job.requirements}</p>
        </Section>
      )}

      {job.benefits && (
        <Section title="Benefits">
          <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{job.benefits}</p>
        </Section>
      )}

      <Section title="Listing Info">
        {job.postedBy && (
          <Row label="Posted by" value={[job.postedBy.firstName, job.postedBy.lastName].filter(Boolean).join(' ') || job.postedBy.email} />
        )}
        <Row label="Created"    value={new Date(job.createdAt).toLocaleDateString()} />
        <Row label="Listing ID" value={<span className="font-mono text-xs text-slate-500">{job.id}</span>} />
      </Section>

    </div>
  )
}
