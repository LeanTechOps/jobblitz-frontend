'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronLeftIcon, PencilSquareIcon, MapPinIcon, BriefcaseIcon,
  CurrencyDollarIcon, CalendarDaysIcon, CheckBadgeIcon, GlobeAltIcon, UserPlusIcon, UsersIcon,
} from '@heroicons/react/24/outline'
import { useJob } from '@/hooks/useJobs'
import ApplyUserModal from '@/components/admin/ApplyUserModal'

const STATUS_PILL: Record<string, string> = {
  ACTIVE: 'bg-blue-accent text-navy font-bold',
  DRAFT:  'bg-navy/10 text-navy/60',
  PAUSED: 'bg-peach-muted text-peach font-semibold',
  CLOSED: 'bg-navy/10 text-navy/40',
}

const WORK_MODE_LABEL: Record<string, string> = { ONSITE: 'On-site', REMOTE: 'Remote', HYBRID: 'Hybrid' }
const JOB_TYPE_LABEL: Record<string, string> = {
  FULL_TIME: 'Full-time', PART_TIME: 'Part-time', CONTRACT: 'Contract',
  INTERNSHIP: 'Internship', FREELANCE: 'Freelance',
}
const EXP_LABEL: Record<string, string> = {
  ENTRY: 'Entry Level', MID: 'Mid Level', SENIOR: 'Senior', LEAD: 'Lead', EXECUTIVE: 'Executive',
}
const PERIOD_LABEL: Record<string, string> = {
  HOURLY: 'per hour', WEEKLY: 'per week', BIWEEKLY: 'every 15 days', MONTHLY: 'per month',
}

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

export default function ViewJobPage() {
  const { id } = useParams<{ id: string }>()
  const { data: job, isLoading } = useJob(id)
  const [showApplyModal, setShowApplyModal] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 rounded-full border-2 border-navy border-t-blue-accent animate-spin" />
      </div>
    )
  }

  if (!job) return <div className="p-8 text-slate-500">Job not found.</div>

  const salary = (() => {
    if (job.salaryNegotiable) return 'Negotiable'
    if (!job.salaryMin && !job.salaryMax) return null
    const range = [job.salaryMin, job.salaryMax].filter(Boolean).map((n) =>
      Number(n).toLocaleString()
    ).join(' – ')
    const period = PERIOD_LABEL[job.salaryPeriod as string] ?? ''
    return `${job.salaryCurrency} ${range} ${period}`.trim()
  })()

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/recruiter/jobs"
            className="p-1.5 rounded-xl hover:bg-blue-muted text-navy/40 hover:text-navy transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </Link>
          {/* Company logo */}
          {job.companyLogoUrl ? (
            <div className="w-12 h-12 rounded-xl border border-slate-200 bg-white p-1 flex items-center justify-center shrink-0 overflow-hidden">
              <img src={job.companyLogoUrl} alt={job.company} className="w-full h-full object-contain" />
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
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <Link
            href={`/recruiter/jobs/${job.id}/applications`}
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#4a7c59]/30 text-[#1a2e1a] hover:bg-[#eef7ee] font-bold text-sm rounded-xl transition-colors cursor-pointer"
          >
            <UsersIcon className="w-4 h-4" />
            Applicants
          </Link>
          <button
            onClick={() => setShowApplyModal(true)}
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#4a7c59] hover:bg-[#3d6b4a] text-white font-bold text-sm rounded-xl transition-colors"
          >
            <UserPlusIcon className="w-4 h-4" />
            Apply User
          </button>
          <Link
            href={`/recruiter/jobs/${job.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-accent hover:bg-blue-accent-hover text-navy font-bold text-sm rounded-xl transition-colors cursor-pointer"
          >
            <PencilSquareIcon className="w-4 h-4" />
            Edit
          </Link>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid sm:grid-cols-2 gap-5">

        <Section title="Job Details">
          <Row label="Work Mode"   value={WORK_MODE_LABEL[job.workMode] ?? job.workMode} />
          <Row label="Type"        value={JOB_TYPE_LABEL[job.type] ?? job.type} />
          <Row label="Experience"  value={EXP_LABEL[job.experienceLevel] ?? job.experienceLevel} />
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

      {/* Skills */}
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

      {/* Description */}
      {job.description && (
        <Section title="Description">
          <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{job.description}</p>
        </Section>
      )}

      {/* Responsibilities */}
      {job.responsibilities && (
        <Section title="Responsibilities">
          <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{job.responsibilities}</p>
        </Section>
      )}

      {/* Requirements */}
      {job.requirements && (
        <Section title="Requirements">
          <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{job.requirements}</p>
        </Section>
      )}

      {/* Benefits */}
      {job.benefits && (
        <Section title="Benefits">
          <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{job.benefits}</p>
        </Section>
      )}

      {/* Meta */}
      <Section title="Listing Info">
        {job.postedBy && (
          <Row label="Posted by" value={`${[job.postedBy.firstName, job.postedBy.lastName].filter(Boolean).join(' ') || job.postedBy.email}`} />
        )}
        <Row label="Created" value={new Date(job.createdAt).toLocaleDateString()} />
        <Row label="Listing ID" value={<span className="font-mono text-xs text-slate-500">{job.id}</span>} />
      </Section>

      {showApplyModal && (
        <ApplyUserModal
          jobId={job.id}
          jobTitle={`${job.title} — ${job.company}`}
          onClose={() => setShowApplyModal(false)}
        />
      )}
    </div>
  )
}
