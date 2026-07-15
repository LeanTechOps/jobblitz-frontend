'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import {
  BoltIcon, ChartBarIcon, ClipboardDocumentListIcon,
  Cog6ToothIcon, CreditCardIcon, ArrowRightIcon, BriefcaseIcon,
} from '@heroicons/react/24/outline'
import { useMyApplications } from '@/hooks/useApplications'
import ApplicationCard from '@/components/dashboard/ApplicationCard'
import Logo from '@/components/Logo'

const PLAN_BADGE_COLOR: Record<string, string> = {
  FORGE:      'bg-slate-100 text-slate-700',
  FORGE_FREE: 'bg-amber-50 text-amber-700 border border-amber-200',
  CRAFT:      'bg-blue-muted text-navy',
  LAUNCH:     'bg-blue-accent text-navy',
  MOMENTUM:   'bg-navy text-white',
}

const PLAN_DISPLAY_NAME: Record<string, string> = {
  FORGE_FREE: 'Trial',
}

export default function DashboardPage() {
  const { user, subscription, isAuthenticated, loading, logout } = useAuth()
  const router = useRouter()
  const { data: applications = [], isLoading: appsLoading } = useMyApplications()

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace('/login')
  }, [isAuthenticated, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-section-alt">
        <div className="w-7 h-7 border-2 border-navy border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const firstName = user.firstName ?? user.email.split('@')[0]
  const plan = subscription?.plan ?? 'FORGE'

  const totalApps  = applications.length
  const interviews = applications.filter((a) => a.status === 'INTERVIEW').length
  const offers     = applications.filter((a) => a.status === 'OFFER').length

  return (
    <div className="min-h-screen bg-section-alt flex flex-col">

      {/* Topbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="cursor-pointer">
            <Logo height={56} />
          </Link>
          <div className="flex items-center gap-4">
            {subscription !== null ? (
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full cursor-default select-none ${PLAN_BADGE_COLOR[plan] ?? PLAN_BADGE_COLOR.FORGE}`}>
                {PLAN_DISPLAY_NAME[plan] ?? plan}
              </span>
            ) : (
              <span className="inline-block w-14 h-5 rounded-full bg-slate-100 animate-pulse" />
            )}
            <div className="w-8 h-8 rounded-full bg-navy text-white text-xs font-bold flex items-center justify-center cursor-default select-none">
              {(user.firstName?.[0] ?? user.email[0]).toUpperCase()}
            </div>
            <button
              onClick={logout}
              className="text-sm text-slate-500 hover:text-slate-800 hover:underline active:scale-95 transition-all duration-150 hidden sm:block cursor-pointer"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 space-y-10">

        {/* Welcome */}
        <div>
          <p className="text-xs font-semibold text-navy uppercase tracking-widest mb-1">Dashboard</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">Welcome back, {firstName} 👋</h1>
          <p className="text-slate-700 font-medium mt-1">Here&apos;s your job search overview.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Applications',  value: String(totalApps),  sub: 'Jobs applied to',               icon: ClipboardDocumentListIcon, color: 'text-navy',        iconBg: 'bg-blue-muted' },
            { label: 'Interviews',    value: String(interviews), sub: 'Active interview stages',         icon: ChartBarIcon,              color: 'text-amber-600',   iconBg: 'bg-amber-50' },
            { label: 'Offers',        value: String(offers),     sub: 'Job offers received',             icon: BoltIcon,                  color: 'text-emerald-600', iconBg: 'bg-emerald-50' },
            { label: 'Response Rate', value: totalApps > 0 ? `${Math.round(((interviews + offers) / totalApps) * 100)}%` : '—', sub: 'Interviews + offers / apps', icon: ChartBarIcon, color: 'text-violet-600', iconBg: 'bg-violet-50' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm cursor-default">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${stat.iconBg} ${stat.color} mb-4`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-3xl font-extrabold text-navy">{stat.value}</p>
              <p className="text-base font-bold text-slate-800 mt-1">{stat.label}</p>
              <p className="text-sm font-medium text-slate-600 mt-1 leading-snug">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Applications */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-navy uppercase tracking-widest">My Applications</p>
            {applications.length > 5 && (
              <Link href="/applications" className="text-sm font-semibold text-navy hover:text-navy-light underline underline-offset-2 transition-colors">
                View all {applications.length}
              </Link>
            )}
          </div>
          {appsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-white rounded-2xl border border-slate-200 animate-pulse" />
              ))}
            </div>
          ) : applications.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
              <BriefcaseIcon className="w-10 h-10 mx-auto mb-3 text-navy/30" />
              <p className="text-base font-bold text-navy">No applications yet</p>
              <p className="text-sm font-medium text-slate-600 mt-1">
                Our team will apply you to matching roles. Check back soon.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 5).map((app) => (
                <ApplicationCard key={app.id} app={app} />
              ))}
              {applications.length > 5 && (
                <Link
                  href="/applications"
                  className="block text-center py-3 rounded-2xl border border-dashed border-navy/20 text-sm font-semibold text-navy/60 hover:text-navy hover:border-navy/40 transition-colors"
                >
                  View all {applications.length} applications →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div>
          <p className="text-sm font-semibold text-navy uppercase tracking-widest mb-4">Quick Actions</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/profile"
              className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-navy/30 hover:shadow-md transition-all duration-150 cursor-pointer select-none"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-violet-50 text-violet-600">
                  <Cog6ToothIcon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-muted text-navy">
                  Set up →
                </span>
              </div>
              <h3 className="text-lg font-bold text-navy">Configure Profile</h3>
              <p className="text-sm font-medium text-slate-700 mt-2 leading-relaxed">
                Upload your resume and set job preferences so we can apply to the best roles for you.
              </p>
            </Link>
            <div className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm cursor-default select-none opacity-80">
              <div className="flex items-start justify-between mb-5">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-blue-muted text-navy">
                  <BoltIcon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                  Coming soon
                </span>
              </div>
              <h3 className="text-lg font-bold text-navy">Start Auto-Applying</h3>
              <p className="text-sm font-medium text-slate-700 mt-2 leading-relaxed">
                Set up your preferences and let AI apply for you automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Plan & Billing */}
        <div>
          <p className="text-sm font-semibold text-navy uppercase tracking-widest mb-4">Plan &amp; Billing</p>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-muted text-navy flex-shrink-0">
                <CreditCardIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-lg font-bold text-navy">
                  {PLAN_DISPLAY_NAME[plan] ?? (plan.charAt(0) + plan.slice(1).toLowerCase())} Plan
                </p>
                <p className="text-sm font-medium text-slate-700 mt-0.5">
                  {plan === 'FORGE'
                    ? 'Upgrade to unlock more applications and AI features.'
                    : plan === 'FORGE_FREE'
                    ? 'You are on a free trial. Upgrade to keep access after it ends.'
                    : 'Manage your subscription, invoices and billing details.'}
                </p>
              </div>
            </div>
            <Link
              href="/pricing"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-blue-accent hover:bg-blue-accent-hover text-navy text-sm font-bold px-5 py-3 rounded-xl transition-all duration-150 active:scale-95 hover:shadow-md cursor-pointer"
            >
              {plan === 'FORGE' || plan === 'FORGE_FREE' ? 'Upgrade Plan' : 'Manage Billing'}
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </main>
    </div>
  )
}
