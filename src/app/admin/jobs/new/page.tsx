'use client'

import Link from 'next/link'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import JobForm from '@/components/admin/JobForm'

export default function NewJobPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/jobs"
          className="p-1.5 rounded-xl hover:bg-blue-muted text-navy/40 hover:text-navy transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-semibold text-navy">New Job Listing</h1>
      </div>
      <JobForm />
    </div>
  )
}
