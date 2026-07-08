'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAdminUsers } from '@/hooks/useAdmin'
import { useDebounce } from '@/hooks/useDebounce'
import { MagnifyingGlassIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

const PLAN_PILL: Record<string, string> = {
  FREE: 'bg-slate-100 text-slate-500',
  PRO_FREE: 'bg-blue-muted text-navy',
  PRO: 'bg-blue-accent/20 text-navy font-semibold',
  BUSINESS: 'bg-peach-muted text-peach font-semibold',
}

const VISA_LABELS: Record<string, string> = {
  US_CITIZEN: 'US Citizen', GREEN_CARD: 'Green Card', H1B: 'H-1B',
  H4_EAD: 'H-4 EAD', L1: 'L-1', O1: 'O-1', TN: 'TN',
  F1_OPT: 'F-1 OPT', F1_CPT: 'F-1 CPT', EAD: 'EAD', OTHER: 'Other',
}

const VISA_TYPES = Object.keys(VISA_LABELS)
const PLANS = ['FREE', 'PRO_FREE', 'PRO', 'BUSINESS']

const inputCls =
  'border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-accent/40 focus:border-navy transition-colors'

export default function AdminUsersPage() {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [skillInput, setSkillInput] = useState('')
  const [visaFilter, setVisaFilter] = useState('')
  const [planFilter, setPlanFilter] = useState('')

  const search = useDebounce(searchInput, 400)
  const skill = useDebounce(skillInput, 400)

  const { data, isLoading } = useAdminUsers({ page, limit: 20, search, skill, visaType: visaFilter, plan: planFilter })

  const users = data?.data ?? []
  const total = data?.total ?? 0
  const totalPages = data?.totalPages ?? 1

  const hasFilters = searchInput || skillInput || visaFilter || planFilter
  const clearFilters = () => { setSearchInput(''); setSkillInput(''); setVisaFilter(''); setPlanFilter(''); setPage(1) }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-bold tracking-widest text-blue-accent/70 uppercase mb-1">Manage</p>
        <h1 className="text-3xl font-bold text-navy">Users</h1>
        <p className="text-sm text-slate-500 mt-0.5">{total} registered members</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-56">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input
              type="text"
              placeholder="Search name or email…"
              value={searchInput}
              onChange={(e) => { setSearchInput(e.target.value); setPage(1) }}
              className={`${inputCls} w-full pl-9`}
            />
          </div>

          {/* Skill */}
          <input
            type="text"
            placeholder="Filter by skill"
            value={skillInput}
            onChange={(e) => { setSkillInput(e.target.value); setPage(1) }}
            className={`${inputCls} min-w-44`}
          />

          {/* Visa */}
          <select
            value={visaFilter}
            onChange={(e) => { setVisaFilter(e.target.value); setPage(1) }}
            className={`${inputCls} min-w-36`}
          >
            <option value="">All visa types</option>
            {VISA_TYPES.map((v) => <option key={v} value={v}>{VISA_LABELS[v]}</option>)}
          </select>

          {/* Plan */}
          <select
            value={planFilter}
            onChange={(e) => { setPlanFilter(e.target.value); setPage(1) }}
            className={inputCls}
          >
            <option value="">All plans</option>
            {PLANS.map((p) => <option key={p} value={p}>{p.replace('_', ' ')}</option>)}
          </select>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-navy border border-slate-200 rounded-xl hover:border-navy/30 bg-white transition-all"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-7 h-7 rounded-full border-2 border-navy border-t-blue-accent animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm font-medium">No users match your filters</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-section-alt border-b border-slate-100">
              <tr>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wide">User</th>
                <th className="text-left px-4 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wide hidden md:table-cell">Skills</th>
                <th className="text-left px-4 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wide hidden lg:table-cell">Visa</th>
                <th className="text-left px-4 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wide">Plan</th>
                <th className="text-left px-4 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wide hidden sm:table-cell">Resumes</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-section-alt transition-colors duration-100">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {u.avatar ? (
                        <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-muted border border-blue-accent/20 flex items-center justify-center text-xs font-bold text-navy shrink-0">
                          {(u.firstName?.[0] ?? u.email[0]).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-navy truncate">
                          {u.firstName} {u.lastName}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {(u.profile?.skills ?? []).slice(0, 3).map((s) => (
                        <span key={s} className="text-xs bg-blue-muted text-navy font-medium px-2 py-0.5 rounded-full">
                          {s}
                        </span>
                      ))}
                      {(u.profile?.skills?.length ?? 0) > 3 && (
                        <span className="text-xs text-slate-400">+{(u.profile?.skills?.length ?? 0) - 3}</span>
                      )}
                      {(u.profile?.skills?.length ?? 0) === 0 && (
                        <span className="text-xs text-slate-200">—</span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-4 hidden lg:table-cell text-xs font-medium text-slate-600">
                    {u.profile?.visaType
                      ? <span className="bg-section-alt px-2 py-0.5 rounded-full">{VISA_LABELS[u.profile.visaType] ?? u.profile.visaType}</span>
                      : <span className="text-slate-200">—</span>}
                  </td>

                  <td className="px-4 py-4">
                    {u.subscription ? (
                      <span className={`text-xs px-2.5 py-1 rounded-full ${PLAN_PILL[u.subscription.plan] ?? 'bg-slate-100 text-slate-500'}`}>
                        {u.subscription.plan.replace('_', ' ')}
                      </span>
                    ) : <span className="text-slate-200 text-xs">—</span>}
                  </td>

                  <td className="px-4 py-4 hidden sm:table-cell text-xs font-medium text-slate-500">
                    {u.profile?.resumes.length ?? 0} file{(u.profile?.resumes.length ?? 0) !== 1 ? 's' : ''}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-navy hover:text-blue-accent-hover transition-colors"
                    >
                      View <ChevronRightIcon className="w-3.5 h-3.5" />
                    </Link>
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
              className="px-4 py-2 text-sm font-medium border border-slate-200 rounded-xl bg-white disabled:opacity-40 hover:border-navy/30 hover:bg-section-alt transition-colors">
              Previous
            </button>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 text-sm font-medium border border-slate-200 rounded-xl bg-white disabled:opacity-40 hover:border-navy/30 hover:bg-section-alt transition-colors">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
