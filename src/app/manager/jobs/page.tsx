'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useJobs, useDeleteJob, Job } from '@/hooks/useJobs'
import { useDebounce } from '@/hooks/useDebounce'
import { PlusIcon, MagnifyingGlassIcon, PencilSquareIcon, TrashIcon, BriefcaseIcon, EyeIcon, UserPlusIcon, UsersIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'
import DeleteConfirmModal from '@/components/ui/DeleteConfirmModal'
import ApplyUserModal from '@/components/admin/ApplyUserModal'

const STATUS_PILL: Record<string, string> = {
  ACTIVE: 'bg-blue-accent text-navy font-bold',
  DRAFT: 'bg-navy/10 text-navy/60',
  PAUSED: 'bg-peach-muted text-peach font-semibold',
  CLOSED: 'bg-navy/10 text-navy/40',
}

const JOB_TYPE_LABEL: Record<string, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
  FREELANCE: 'Freelance',
}

const WORK_MODE_LABEL: Record<string, string> = {
  ONSITE: 'On-site',
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
}

const inputCls =
  'border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-accent/40 focus:border-navy transition-colors'

export default function ManagerJobsPage() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null)
  const [applyTarget, setApplyTarget] = useState<Job | null>(null)

  // Debounce search — only fires query 400ms after user stops typing
  const search = useDebounce(searchInput, 400)

  const { data, isLoading } = useJobs({ page, limit: 15, search, status: statusFilter })
  const deleteJob = useDeleteJob()

  const jobs = data?.data ?? []
  const total = data?.total ?? 0
  const totalPages = data?.totalPages ?? 1

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteJob.mutateAsync(deleteTarget.id)
      toast.success('Job deleted')
      setDeleteTarget(null)
    } catch {
      toast.error('Failed to delete job')
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-navy">Manage Jobs</h1>
          <p className="text-sm text-navy/50 mt-1">{total} listings</p>
        </div>
        <Link
          href="/manager/jobs/new"
          className="flex items-center gap-2 bg-blue-accent hover:bg-blue-accent-hover active:scale-95 text-navy font-bold px-5 py-2.5 rounded-xl text-sm transition-all duration-150 shadow-sm hover:shadow-md"
        >
          <PlusIcon className="w-4 h-4" />
          Add Job
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-56">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/40" />
          <input
            type="text"
            placeholder="Search title, company…"
            value={searchInput}
            onChange={(e) => { setSearchInput(e.target.value); setPage(1) }}
            className={`${inputCls} w-full pl-9`}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className={inputCls}
        >
          <option value="">All statuses</option>
          {['ACTIVE', 'DRAFT', 'PAUSED', 'CLOSED'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-navy/10 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-7 h-7 rounded-full border-2 border-navy border-t-blue-accent animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <BriefcaseIcon className="w-10 h-10 mx-auto mb-3 text-navy/30" />
            <p className="text-base font-semibold text-navy">No jobs found</p>
            <Link href="/manager/jobs/new" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-blue-accent transition-colors">
              <PlusIcon className="w-4 h-4" /> Add your first job
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-section-alt border-b border-slate-100">
              <tr>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-navy/50 uppercase tracking-wide">Job</th>
                <th className="text-left px-4 py-3.5 text-xs font-bold text-navy/50 uppercase tracking-wide hidden md:table-cell">Type</th>
                <th className="text-left px-4 py-3.5 text-xs font-bold text-navy/50 uppercase tracking-wide hidden lg:table-cell">Work Mode</th>
                <th className="text-left px-4 py-3.5 text-xs font-bold text-navy/50 uppercase tracking-wide">Status</th>
                <th className="text-right px-5 py-3.5 text-xs font-bold text-navy/50 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  onClick={() => router.push(`/manager/jobs/${job.id}`)}
                  className="hover:bg-section-alt transition-colors duration-100 cursor-pointer"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <CompanyLogo name={job.company} logoUrl={job.companyLogoUrl} />
                      <div>
                        <p className="font-semibold text-navy">{job.title}</p>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {job.company}
                          {job.location ? ` · ${job.location}` : ''}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell text-slate-700 text-sm font-medium">
                    {JOB_TYPE_LABEL[job.type] ?? job.type}
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-muted text-navy">
                      {WORK_MODE_LABEL[job.workMode] ?? job.workMode}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full ${STATUS_PILL[job.status] ?? 'bg-slate-100 text-slate-500'}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setApplyTarget(job)}
                        className="p-2 rounded-lg hover:bg-[#eef7ee] text-[#4a7c59] hover:text-[#2d5a3d] transition-colors cursor-pointer"
                        title="Apply user to this job"
                      >
                        <UserPlusIcon className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/manager/jobs/${job.id}/applications`}
                        className="p-2 rounded-lg hover:bg-[#eef7ee] text-[#1a2e1a] hover:text-[#4a7c59] transition-colors cursor-pointer"
                        title="View applicants"
                      >
                        <UsersIcon className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/manager/jobs/${job.id}`}
                        className="p-2 rounded-lg hover:bg-blue-muted text-[#1a2e1a] hover:text-navy transition-colors cursor-pointer"
                        title="View"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/manager/jobs/${job.id}/edit`}
                        className="p-2 rounded-lg hover:bg-blue-muted text-[#1a2e1a] hover:text-navy transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget({ id: job.id, title: job.title })}
                        disabled={deleteJob.isPending}
                        className="p-2 rounded-lg hover:bg-peach-muted text-[#1a2e1a] hover:text-peach transition-colors disabled:opacity-50 cursor-pointer"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-5">
          <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 text-sm font-medium border border-slate-200 rounded-xl bg-white disabled:opacity-40 hover:border-navy/30 hover:bg-section-alt transition-colors cursor-pointer">
              Previous
            </button>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 text-sm font-medium border border-slate-200 rounded-xl bg-white disabled:opacity-40 hover:border-navy/30 hover:bg-section-alt transition-colors cursor-pointer">
              Next
            </button>
          </div>
        </div>
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          title={`Delete "${deleteTarget.title}"?`}
          description="This job listing and all its data will be permanently removed."
          confirmLabel="Delete Job"
          loading={deleteJob.isPending}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      {applyTarget && (
        <ApplyUserModal
          jobId={applyTarget.id}
          jobTitle={`${applyTarget.title} — ${applyTarget.company}`}
          onClose={() => setApplyTarget(null)}
        />
      )}
    </div>
  )
}

function CompanyLogo({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className="w-9 h-9 rounded-lg object-contain border border-slate-100 bg-white p-1 shrink-0"
      />
    )
  }
  return (
    <div className="w-9 h-9 rounded-lg bg-blue-muted border border-blue-accent/20 flex items-center justify-center text-sm font-bold text-navy shrink-0">
      {name[0]?.toUpperCase()}
    </div>
  )
}
