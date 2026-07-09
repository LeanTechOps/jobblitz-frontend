'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronLeftIcon, DocumentIcon, CalendarDaysIcon,
  PencilSquareIcon, CheckIcon, XMarkIcon,
} from '@heroicons/react/24/outline'
import { useJob } from '@/hooks/useJobs'
import {
  useJobApplications, useUpdateApplication, useDeleteApplication,
  JobApplication, ApplicationStatus,
} from '@/hooks/useApplications'
import { toast } from 'react-toastify'
import DeleteConfirmModal from '@/components/ui/DeleteConfirmModal'

// ── Config ───────────────────────────────────────────────────

const STATUS_OPTIONS: { value: ApplicationStatus; label: string; pill: string }[] = [
  { value: 'APPLIED',   label: 'Applied',   pill: 'bg-blue-muted text-navy font-bold' },
  { value: 'INTERVIEW', label: 'Interview', pill: 'bg-amber-50 text-amber-700 font-bold border border-amber-200' },
  { value: 'OFFER',     label: 'Offer',     pill: 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200' },
  { value: 'REJECTED',  label: 'Rejected',  pill: 'bg-peach-muted text-peach font-bold' },
  { value: 'WITHDRAWN', label: 'Withdrawn', pill: 'bg-slate-100 text-slate-500' },
]

const STATUS_MAP = Object.fromEntries(STATUS_OPTIONS.map((s) => [s.value, s]))

// ── Page ─────────────────────────────────────────────────────

export default function JobApplicationsPage() {
  const { id } = useParams<{ id: string }>()
  const { data: job } = useJob(id)
  const { data: applications = [], isLoading } = useJobApplications(id)
  const updateApp = useUpdateApplication()
  const deleteApp = useDeleteApplication()

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 rounded-full border-2 border-navy border-t-blue-accent animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Link
          href={`/admin/jobs/${id}`}
          className="p-1.5 rounded-xl hover:bg-blue-muted text-navy/40 hover:text-navy transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-navy">Applications</h1>
          {job && <p className="text-sm text-navy/60 mt-0.5">{job.title} — {job.company}</p>}
        </div>
      </div>
      <p className="text-sm text-navy/50 mb-6 ml-10">{applications.length} applicant{applications.length !== 1 ? 's' : ''}</p>

      {applications.length === 0 ? (
        <div className="bg-white border border-navy/10 rounded-2xl p-14 text-center">
          <p className="text-base font-bold text-navy">No applications yet</p>
          <p className="text-sm text-navy/50 mt-1">Use the Apply User button on the job view to add applicants.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <ApplicationRow
              key={app.id}
              app={app}
              onUpdate={async (data) => {
                await updateApp.mutateAsync({ id: app.id, data })
              }}
              onDelete={() => setDeleteTarget(app.id)}
            />
          ))}
        </div>
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          title="Remove this application?"
          description="This will permanently remove the applicant from this job."
          confirmLabel="Remove"
          loading={deleteApp.isPending}
          onConfirm={async () => {
            await deleteApp.mutateAsync({ id: deleteTarget, jobId: id })
            toast.success('Application removed')
            setDeleteTarget(null)
          }}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

// ── ApplicationRow ────────────────────────────────────────────

function ApplicationRow({
  app,
  onUpdate,
  onDelete,
}: {
  app: JobApplication
  onUpdate: (data: any) => Promise<void>
  onDelete: () => void
}) {
  const profile = (app as any).profile
  const user = profile?.user
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email || 'Unknown'

  const [editing, setEditing] = useState(false)
  const [status, setStatus] = useState<ApplicationStatus>(app.status)
  const [interviewAt, setInterviewAt] = useState(
    app.interviewAt ? new Date(app.interviewAt).toISOString().slice(0, 16) : ''
  )
  const [notes, setNotes] = useState(app.notes ?? '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await onUpdate({
      status,
      interviewAt: status === 'INTERVIEW' && interviewAt ? interviewAt : null,
      notes: notes.trim() || undefined,
    })
    setSaving(false)
    setEditing(false)
  }

  const handleCancel = () => {
    setStatus(app.status)
    setInterviewAt(app.interviewAt ? new Date(app.interviewAt).toISOString().slice(0, 16) : '')
    setNotes(app.notes ?? '')
    setEditing(false)
  }

  const cfg = STATUS_MAP[app.status]

  const inputCls = 'rounded-xl border border-[#2d4a2d]/20 bg-white px-3 py-2 text-sm font-medium text-[#1a2e1a] focus:outline-none focus:ring-2 focus:ring-[#4a7c59]/40'

  return (
    <div className="bg-white border border-navy/10 rounded-2xl p-5">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <UserAvatar user={user} size={44} />

        {/* Main */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="font-bold text-navy text-base">{name}</p>
              <p className="text-sm text-navy/60">{user?.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-1 rounded-full ${cfg?.pill ?? 'bg-slate-100 text-slate-500'}`}>
                {cfg?.label ?? app.status}
              </span>
              {!editing && (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className="cursor-pointer p-1.5 rounded-lg hover:bg-blue-muted text-[#1a2e1a]/60 hover:text-navy transition-colors"
                    title="Edit"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onDelete}
                    className="cursor-pointer p-1.5 rounded-lg hover:bg-peach-muted text-[#1a2e1a]/60 hover:text-peach transition-colors"
                    title="Remove"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Resume */}
          {app.resume && (
            <div className="flex items-center gap-2 mt-2">
              {app.resumeThumbnailUrl ? (
                <img src={app.resumeThumbnailUrl} alt="Resume" className="w-5 h-7 rounded object-cover border border-slate-200" />
              ) : (
                <DocumentIcon className="w-4 h-4 text-[#1a2e1a]/40" />
              )}
              <span className="text-xs font-medium text-[#1a2e1a]/70">
                {app.resume.label || app.resume.originalName}
                {app.resume.isDefault && <span className="ml-1.5 text-[10px] font-bold px-1 py-0.5 rounded bg-[#4a7c59] text-white">Default</span>}
              </span>
            </div>
          )}

          {/* Interview date (read mode) */}
          {app.status === 'INTERVIEW' && app.interviewAt && !editing && (
            <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
              <CalendarDaysIcon className="w-3.5 h-3.5" />
              Interview: {new Date(app.interviewAt).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
          )}

          {/* Notes (read mode) */}
          {app.notes && !editing && (
            <p className="mt-2 text-xs font-medium text-[#1a2e1a]/60 border-l-2 border-slate-200 pl-2 italic">{app.notes}</p>
          )}

          {/* Applied date */}
          <p className="mt-2 text-xs text-[#1a2e1a]/40 font-medium">
            Applied {new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>

          {/* Edit form */}
          {editing && (
            <div className="mt-4 space-y-3 border-t border-[#2d4a2d]/10 pt-4">
              {/* Status pills */}
              <div>
                <p className="text-xs font-bold text-[#1a2e1a] mb-2">Status</p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setStatus(opt.value)}
                      className={`cursor-pointer text-xs px-3 py-1.5 rounded-full font-bold border-2 transition-colors ${
                        status === opt.value
                          ? 'border-[#4a7c59] bg-[#eef7ee] text-[#1a2e1a]'
                          : 'border-transparent bg-slate-100 text-[#1a2e1a]/60 hover:bg-[#eef7ee]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interview date — only shown when INTERVIEW selected */}
              {status === 'INTERVIEW' && (
                <div>
                  <label className="text-xs font-bold text-[#1a2e1a] mb-1 block">Interview Date & Time</label>
                  <input
                    type="datetime-local"
                    value={interviewAt}
                    onChange={(e) => setInterviewAt(e.target.value)}
                    className={inputCls}
                  />
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="text-xs font-bold text-[#1a2e1a] mb-1 block">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Internal notes…"
                  className={inputCls + ' w-full resize-none h-16'}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="cursor-pointer flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4a7c59] text-white text-xs font-bold hover:bg-[#3d6b4a] disabled:opacity-50 transition-colors"
                >
                  {saving
                    ? <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <CheckIcon className="w-3.5 h-3.5" />
                  }
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="cursor-pointer px-4 py-2 rounded-xl border border-[#2d4a2d]/20 text-[#1a2e1a] text-xs font-bold hover:bg-[#f0f7f0] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Avatar ───────────────────────────────────────────────────

function UserAvatar({ user, size }: { user: any; size: number }) {
  const initials = [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join('') || (user?.email?.[0] ?? '?').toUpperCase()
  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        referrerPolicy="no-referrer"
        alt="avatar"
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <div
      className="rounded-full bg-[#4a7c59] text-white font-bold flex items-center justify-center shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  )
}
