import Link from 'next/link'
import { CalendarDaysIcon, DocumentIcon } from '@heroicons/react/24/outline'
import { JobApplication, ApplicationStatus } from '@/hooks/useApplications'

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; pill: string }> = {
  APPLIED:   { label: 'Applied',   pill: 'bg-blue-muted text-navy font-bold' },
  INTERVIEW: { label: 'Interview', pill: 'bg-amber-50 text-amber-700 font-bold border border-amber-200' },
  OFFER:     { label: 'Offer',     pill: 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200' },
  REJECTED:  { label: 'Rejected',  pill: 'bg-peach-muted text-peach font-bold' },
  WITHDRAWN: { label: 'Withdrawn', pill: 'bg-slate-100 text-slate-500' },
}

const WORK_MODE_LABEL: Record<string, string> = { ONSITE: 'On-site', REMOTE: 'Remote', HYBRID: 'Hybrid' }
const JOB_TYPE_LABEL: Record<string, string>  = { FULL_TIME: 'Full-time', PART_TIME: 'Part-time', CONTRACT: 'Contract', INTERNSHIP: 'Internship', FREELANCE: 'Freelance' }

export default function ApplicationCard({ app }: { app: JobApplication }) {
  const cfg = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.APPLIED
  const job = app.job!

  const nextInterview = app.status === 'INTERVIEW' && app.interviewAt
    ? new Date(app.interviewAt)
    : null

  const isPast = nextInterview ? nextInterview < new Date() : false

  return (
    <Link
      href={`/applications/${app.id}`}
      className="block bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-start gap-4 hover:border-navy/30 hover:shadow-md transition-all duration-150 cursor-pointer"
    >
      {/* Company logo / initial */}
      <div className="shrink-0">
        {app.companyLogoUrl ? (
          <img
            src={app.companyLogoUrl}
            alt={job.company}
            className="w-12 h-12 rounded-xl object-contain border border-slate-100 bg-white p-1"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-blue-muted border border-blue-accent/20 flex items-center justify-center text-lg font-bold text-navy">
            {job.company[0]?.toUpperCase()}
          </div>
        )}
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="font-bold text-navy text-base leading-tight">{job.title}</p>
            <p className="text-sm text-slate-600 mt-0.5">
              {job.company}
              {job.location ? ` · ${job.location}` : ''}
              {' · '}{WORK_MODE_LABEL[job.workMode] ?? job.workMode}
              {' · '}{JOB_TYPE_LABEL[job.type] ?? job.type}
            </p>
          </div>
          <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full ${cfg.pill}`}>
            {cfg.label}
          </span>
        </div>

        {/* Interview date + time */}
        {nextInterview && (
          <div className={`mt-3 flex items-start gap-2.5 px-3 py-2.5 rounded-xl ${isPast ? 'bg-slate-50 border border-slate-200' : 'bg-amber-50 border border-amber-200'}`}>
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

        {/* Offer */}
        {app.status === 'OFFER' && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-base">🎉</span>
            <p className="text-sm font-bold text-emerald-700">Offer received — congratulations!</p>
          </div>
        )}

        {/* Notes from team */}
        {app.notes && (
          <div className="mt-3 flex items-start gap-2 px-3 py-2.5 rounded-xl bg-blue-muted border border-blue-accent/20">
            <span className="text-navy/50 text-xs mt-0.5 font-bold shrink-0">Note</span>
            <p className="text-sm font-medium text-navy leading-snug">{app.notes}</p>
          </div>
        )}

        <div className="flex items-center gap-3 mt-3 flex-wrap">
          {/* Resume used */}
          {app.resume && (
            <div className="flex items-center gap-1.5">
              {app.resumeThumbnailUrl ? (
                <img
                  src={app.resumeThumbnailUrl}
                  alt="Resume"
                  className="w-5 h-7 rounded object-cover border border-slate-200"
                />
              ) : (
                <DocumentIcon className="w-4 h-4 text-slate-400" />
              )}
              <span className="text-xs font-medium text-slate-600 truncate max-w-[160px]">
                {app.resume.label || app.resume.originalName}
              </span>
            </div>
          )}
          <span className="text-xs font-medium text-slate-400">
            Applied {new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>
    </Link>
  )
}
