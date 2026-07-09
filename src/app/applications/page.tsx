'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useMyApplications } from '@/hooks/useApplications'
import { BriefcaseIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'
import ApplicationCard from '@/components/dashboard/ApplicationCard'

export default function ApplicationsPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const { data: applications = [], isLoading } = useMyApplications()

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace('/login')
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-section-alt">
        <div className="w-7 h-7 border-2 border-navy border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-section-alt">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="p-1.5 rounded-xl hover:bg-white text-navy/40 hover:text-navy transition-colors">
            <ChevronLeftIcon className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-navy">My Applications</h1>
            <p className="text-sm text-slate-500 mt-0.5">{applications.length} total</p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-14 text-center shadow-sm">
            <BriefcaseIcon className="w-10 h-10 mx-auto mb-3 text-navy/30" />
            <p className="text-base font-bold text-navy">No applications yet</p>
            <p className="text-sm font-medium text-slate-600 mt-1">Our team will apply you to matching roles. Check back soon.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <ApplicationCard key={app.id} app={app} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
