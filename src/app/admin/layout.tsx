'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { ShieldExclamationIcon } from '@heroicons/react/24/outline'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  const isUnauthorized = !loading && user && user.role !== 'ADMIN'
  const isUnauthenticated = !loading && !user

  // Unauthenticated → login
  useEffect(() => {
    if (isUnauthenticated) router.replace('/login')
  }, [isUnauthenticated, router])

  // Unauthorized (logged in but not admin) → countdown → their own dashboard
  useEffect(() => {
    if (!isUnauthorized) return
    const dest = user?.role === 'MANAGER' ? '/manager/dashboard'
      : user?.role === 'RECRUITER' ? '/recruiter/dashboard'
      : '/dashboard'
    if (countdown <= 0) { router.replace(dest); return }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [isUnauthorized, countdown, router])

  // Still loading or unauthenticated
  if (loading || isUnauthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-section-alt">
        <div className="w-8 h-8 rounded-full border-2 border-navy border-t-blue-accent animate-spin" />
      </div>
    )
  }

  // Logged in but not an admin
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
            Only admins can access this area.
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
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
