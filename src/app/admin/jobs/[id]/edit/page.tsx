'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { useJob } from '@/hooks/useJobs'
import JobForm from '@/components/admin/JobForm'

export default function EditJobPage() {
  const { id } = useParams<{ id: string }>()
  const { data: job, isLoading } = useJob(id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 rounded-full border-2 border-navy border-t-blue-accent animate-spin" />
      </div>
    )
  }

  if (!job) {
    return <div className="p-8 text-slate-500">Job not found.</div>
  }

  const initialData = {
    ...job,
    salaryMin: job.salaryMin != null ? String(job.salaryMin) : '',
    salaryMax: job.salaryMax != null ? String(job.salaryMax) : '',
    closesAt: job.closesAt ? job.closesAt.split('T')[0] : '',
    workMode: job.workMode ?? 'ONSITE',
    companyDomain: job.companyDomain ?? '',
    location: job.location ?? '',
    responsibilities: ((job as unknown) as Record<string, string>).responsibilities ?? '',
    requirements: ((job as unknown) as Record<string, string>).requirements ?? '',
    benefits: ((job as unknown) as Record<string, string>).benefits ?? '',
    applicationUrl: job.applicationUrl ?? '',
  } as Parameters<typeof JobForm>[0]['initialData']

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/jobs"
          className="p-1.5 rounded-xl hover:bg-blue-muted text-slate-400 hover:text-navy transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </Link>
        <div>
          <p className="text-xs font-bold tracking-widest text-blue-accent/70 uppercase">Jobs</p>
          <h1 className="text-2xl font-bold text-navy">Edit Job</h1>
          <p className="text-sm text-slate-500 mt-0.5">{job.title} · {job.company}</p>
        </div>
      </div>

      <JobForm initialData={initialData} jobId={id} />
    </div>
  )
}
