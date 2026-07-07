'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import {
  BoltIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  ArrowRightIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'

const PLAN_BADGE_COLOR: Record<string, string> = {
  FREE: 'bg-slate-100 text-slate-600',
  PRO: 'bg-blue-muted text-blue-accent',
  BUSINESS: 'bg-navy text-white',
}

const QUICK_ACTIONS = [
  {
    href: '/pricing',
    icon: BoltIcon,
    iconColor: 'text-blue-accent',
    iconBg: 'bg-blue-muted',
    hoverBorder: 'hover:border-blue-200',
    title: 'Start Auto-Applying',
    description: 'Set up your preferences and let AI apply for you.',
  },
  {
    href: '/pricing',
    icon: ClipboardDocumentListIcon,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    hoverBorder: 'hover:border-emerald-200',
    title: 'View Applications',
    description: 'Track every job application in one place.',
  },
  {
    href: '/pricing',
    icon: Cog6ToothIcon,
    iconColor: 'text-violet-600',
    iconBg: 'bg-violet-50',
    hoverBorder: 'hover:border-violet-200',
    title: 'Configure Profile',
    description: 'Upload your resume and set job preferences.',
  },
]

export default function DashboardPage() {
  const { user, subscription, isAuthenticated, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, loading, router])

  // Wait for both user AND subscription to be resolved before rendering plan-gated UI.
  // subscription===null means "fetched, no record"; undefined would mean "not yet fetched",
  // but since AuthContext always sets it in the same batch as user, waiting on loading suffices.
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-section-alt">
        <div className="w-7 h-7 border-2 border-blue-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const firstName = user.firstName ?? user.email.split('@')[0]
  // Only resolve plan after subscription is confirmed loaded (not null from missing data)
  const plan = subscription?.plan ?? 'FREE'
  // Only treat as free if subscription is confirmed loaded AND plan is FREE
  const isFreePlan = subscription !== null
    ? plan === 'FREE'
    : false  // hide upgrade banner while subscription is still loading/null

  return (
    <div className="min-h-screen bg-section-alt flex flex-col">
      {/* Topbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="group cursor-pointer">
            <span className="text-xl font-bold">
              <span className="text-navy group-hover:text-slate-700 transition-colors duration-150">Job</span>
              <span className="text-blue-accent group-hover:text-blue-500 transition-colors duration-150">Blitz</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {/* Plan badge */}
            {subscription !== null ? (
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full cursor-default select-none ${PLAN_BADGE_COLOR[plan] ?? PLAN_BADGE_COLOR.FREE}`}
              >
                {plan}
              </span>
            ) : (
              <span className="inline-block w-14 h-5 rounded-full bg-slate-100 animate-pulse" />
            )}

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-navy text-white text-xs font-bold flex items-center justify-center hover:bg-slate-700 transition-colors duration-150 cursor-default select-none">
              {(user.firstName?.[0] ?? user.email[0]).toUpperCase()}
            </div>

            <button
              onClick={logout}
              className="text-xs text-slate-400 hover:text-slate-700 hover:underline active:scale-95 transition-all duration-150 hidden sm:block cursor-pointer"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10">
        {/* Welcome */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-blue-accent uppercase tracking-widest mb-1">
            Dashboard
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Here&apos;s your job search overview for today.
          </p>
        </div>

        {/* Upgrade banner — only for free plan */}
        {isFreePlan && (
          <div className="bg-navy text-white rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-base mb-1">Unlock the full power of JobBlitz</p>
              <p className="text-blue-200 text-sm">
                You&apos;re on the free plan — upgrade to Pro to send 50 applications per day.
              </p>
            </div>
            <Link
              href="/pricing"
              className="group inline-flex items-center gap-2 bg-white text-navy font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-slate-50 hover:shadow-md active:scale-[0.98] transition-all duration-150 flex-shrink-0 cursor-pointer select-none"
            >
              Upgrade Plan
              <ArrowRightIcon className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Applications Sent', value: '0', sub: 'Start auto-applying to see this', icon: BoltIcon, color: 'text-blue-accent', iconBg: 'bg-blue-muted' },
            { label: 'Active Jobs', value: '0', sub: 'Jobs being tracked', icon: ClipboardDocumentListIcon, color: 'text-emerald-600', iconBg: 'bg-emerald-50' },
            { label: 'Interview Requests', value: '0', sub: 'From applications sent', icon: ChartBarIcon, color: 'text-violet-600', iconBg: 'bg-violet-50' },
            { label: 'Response Rate', value: '—', sub: 'Available after first batch', icon: ChartBarIcon, color: 'text-amber-600', iconBg: 'bg-amber-50' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-slate-200 transition-all duration-200 cursor-default group"
            >
              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${stat.iconBg} ${stat.color} mb-3 transition-transform duration-150 group-hover:scale-110`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <p className="text-2xl font-extrabold text-navy">{stat.value}</p>
              <p className="text-xs font-medium text-slate-600 mt-1">{stat.label}</p>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className={`group bg-white border border-slate-100 ${action.hoverBorder} rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer`}
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${action.iconBg} ${action.iconColor} mb-4 transition-transform duration-200 group-hover:scale-110`}>
                <action.icon className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-navy group-hover:text-blue-accent transition-colors duration-150">
                  {action.title}
                </h3>
                <ArrowRightIcon className="w-4 h-4 text-slate-300 group-hover:text-blue-accent group-hover:translate-x-0.5 transition-all duration-150" />
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
