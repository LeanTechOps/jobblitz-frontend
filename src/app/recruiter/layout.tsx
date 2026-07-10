'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import RecruiterSidebar from '@/components/recruiter/RecruiterSidebar'
import { ShieldExclamationIcon, Bars3Icon } from '@heroicons/react/24/outline'

export default function RecruiterLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isUnauthorized = !loading && user && user.role !== 'RECRUITER' && user.role !== 'ADMIN'
  const isUnauthenticated = !loading && !user

  useEffect(() => {
    if (isUnauthenticated) router.replace('/login')
  }, [isUnauthenticated, router])

  useEffect(() => {
    if (!isUnauthorized) return
    const dest = user?.role === 'ADMIN' ? '/admin/dashboard'
      : user?.role === 'MANAGER' ? '/manager/dashboard'
      : '/dashboard'
    if (countdown <= 0) { router.replace(dest); return }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [isUnauthorized, countdown, router])

  if (loading || isUnauthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-section-alt">
        <div className="w-8 h-8 rounded-full border-2 border-navy border-t-blue-accent animate-spin" />
      </div>
    )
  }

  if (isUnauthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-section-alt px-4">
        <div className="w-full max-w-sm bg-white border border-slate-100 rounded-2xl shadow-lg p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-peach-muted flex items-center justify-center mx-auto mb-5">
            <ShieldExclamationIcon className="w-7 h-7 text-peach" />
          </div>
          <h2 className="text-lg font-bold text-navy mb-2">Access Restricted</h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            You don&apos;t have permission to view this page.
            Only recruiters can access this area.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
            <span>Redirecting to dashboard in</span>
            <span className="w-7 h-7 rounded-full bg-navy text-blue-accent text-xs font-bold flex items-center justify-center">
              {countdown}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-section-alt">
      <RecruiterSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-100">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-navy cursor-pointer"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <span className="text-sm font-semibold text-navy">Recruiter Portal</span>
        </div>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
