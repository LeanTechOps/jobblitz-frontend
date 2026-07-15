'use client'

import Link from 'next/link'
import { useRecruiterStats } from '@/hooks/useRecruiter'
import {
  UsersIcon,
  BriefcaseIcon,
  SparklesIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'

const PLAN_PILL: Record<string, string> = {
  FORGE: 'bg-navy/10 text-navy',
  FORGE_FREE: 'bg-amber-50 text-amber-700 font-semibold border border-amber-200',
  CRAFT: 'bg-blue-muted text-navy font-bold',
  LAUNCH: 'bg-blue-accent text-navy font-bold',
  MOMENTUM: 'bg-orange-100 text-orange-800 font-bold',
}

export default function RecruiterDashboardPage() {
  const { data: stats, isLoading: loading } = useRecruiterStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-navy border-t-blue-accent animate-spin" />
      </div>
    )
  }

  if (!stats) return null

  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: UsersIcon,
      href: '/recruiter/users',
      accent: 'bg-blue-muted text-navy',
    },
    {
      label: 'Total Jobs',
      value: stats.totalJobs,
      icon: BriefcaseIcon,
      href: '/recruiter/jobs',
      accent: 'bg-blue-accent/20 text-navy',
    },
    {
      label: 'Paid Subscribers',
      value: (stats.plans['CRAFT'] ?? 0) + (stats.plans['LAUNCH'] ?? 0) + (stats.plans['MOMENTUM'] ?? 0),
      icon: SparklesIcon,
      href: '/recruiter/users?plan=CRAFT',
      accent: 'bg-peach-muted text-peach',
    },
  ]

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-navy">Dashboard</h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 hover:border-blue-accent/40 hover:shadow-md transition-all duration-200"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.accent} shrink-0`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-navy">{card.value.toLocaleString()}</p>
              <p className="text-sm text-navy/60 font-medium">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plan breakdown */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6">
          <h2 className="text-base font-bold text-navy mb-4">Users by Plan</h2>
          <div className="space-y-3">
            {Object.entries(stats.plans).length === 0 ? (
              <p className="text-sm text-slate-400">No data yet</p>
            ) : (
              Object.entries(stats.plans).map(([plan, count]) => (
                <div key={plan} className="flex items-center justify-between py-1">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${PLAN_PILL[plan] ?? 'bg-slate-100 text-slate-500'}`}>
                    {plan.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-navy/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-accent rounded-full"
                        style={{ width: `${Math.min(100, (count / stats.totalUsers) * 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-navy w-8 text-right">{count}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent sign-ups */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-navy">Recent Sign-ups</h2>
            <Link
              href="/recruiter/users"
              className="flex items-center gap-1 text-xs font-semibold text-navy hover:text-blue-accent transition-colors"
            >
              View all <ArrowRightIcon className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-1">
            {stats.recentUsers.map((u) => (
              <Link
                key={u.id}
                href={`/recruiter/users/${u.id}`}
                className="flex items-center gap-3 hover:bg-section-alt -mx-2 px-2 py-2 rounded-xl transition-colors duration-150"
              >
                {u.avatar ? (
                  <img src={u.avatar} alt="" referrerPolicy="no-referrer" className="w-8 h-8 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-muted border border-blue-accent/20 flex items-center justify-center text-xs font-bold text-navy shrink-0">
                    {(u.firstName?.[0] ?? u.email[0]).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-navy truncate">
                    {u.firstName} {u.lastName}
                  </p>
                  <p className="text-sm text-slate-700 truncate">{u.email}</p>
                </div>
                {u.subscription && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${PLAN_PILL[u.subscription.plan] ?? 'bg-slate-100 text-slate-500'}`}>
                    {u.subscription.plan.replace('_', ' ')}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
