'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useManagerUsers, useManagerSkills } from '@/hooks/useManager'
import { useDebounce } from '@/hooks/useDebounce'
import { MagnifyingGlassIcon, ChevronRightIcon, XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline'

const PLAN_PILL: Record<string, string> = {
  FORGE: 'bg-navy/10 text-navy',
  FORGE_FREE: 'bg-amber-50 text-amber-700 font-semibold border border-amber-200',
  CRAFT: 'bg-blue-muted text-navy font-bold',
  LAUNCH: 'bg-blue-accent text-navy font-bold',
  MOMENTUM: 'bg-orange-100 text-orange-800 font-bold',
}

const VISA_LABELS: Record<string, string> = {
  US_CITIZEN: 'US Citizen', GREEN_CARD: 'Green Card', H1B: 'H-1B',
  H4_EAD: 'H-4 EAD', L1: 'L-1', O1: 'O-1', TN: 'TN',
  F1_OPT: 'F-1 OPT', F1_CPT: 'F-1 CPT', EAD: 'EAD', OTHER: 'Other',
}

const VISA_TYPES = Object.keys(VISA_LABELS)
const PLANS = ['FORGE', 'FORGE_FREE', 'CRAFT', 'LAUNCH', 'MOMENTUM']

const inputCls =
  'border border-navy/15 rounded-xl px-3 py-2 text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-blue-accent/50 focus:border-navy transition-colors placeholder:text-navy/35'

function SkillsModal({
  skills,
  selected,
  onApply,
  onClose,
}: {
  skills: string[]
  selected: string[]
  onApply: (s: string[]) => void
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const [pending, setPending] = useState<string[]>(selected)

  const toggle = (s: string) =>
    setPending((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])

  const filtered = query.trim()
    ? skills.filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    : skills

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" />

      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-navy">Filter by Skills</h2>
            <p className="text-sm text-slate-600 mt-0.5">
              {skills.length} skills · {pending.length} selected
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-section-alt text-slate-500 hover:text-navy transition-colors cursor-pointer">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b border-slate-200">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              autoFocus
              type="text"
              placeholder="Search skills…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`${inputCls} w-full pl-9`}
            />
          </div>
        </div>

        {/* Skill pills */}
        <div className="overflow-y-auto flex-1 px-5 py-4">
          {filtered.length === 0 ? (
            <p className="text-center py-8 text-slate-500 text-sm font-medium">No skills match</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {filtered.map((s) => {
                const active = pending.includes(s)
                return (
                  <button
                    key={s}
                    onClick={() => toggle(s)}
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 cursor-pointer border ${
                      active
                        ? 'bg-navy text-blue-accent border-navy'
                        : 'bg-white text-navy border-slate-300 hover:border-navy'
                    }`}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-200 gap-3">
          <button
            onClick={() => setPending([])}
            className="text-sm font-semibold text-slate-600 hover:text-navy transition-colors cursor-pointer"
          >
            Clear all
          </button>
          <button
            onClick={() => { onApply(pending); onClose() }}
            className="px-5 py-2 bg-navy text-blue-accent text-sm font-bold rounded-xl hover:bg-navy-dark transition-colors cursor-pointer"
          >
            Apply{pending.length > 0 ? ` (${pending.length})` : ''}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ManagerUsersPage() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [skillFilters, setSkillFilters] = useState<string[]>([])
  const [visaFilter, setVisaFilter] = useState('')
  const [planFilter, setPlanFilter] = useState('')
  const [skillModalOpen, setSkillModalOpen] = useState(false)

  const search = useDebounce(searchInput, 400)

  const { data, isLoading } = useManagerUsers({ page, limit: 20, search, skills: skillFilters, visaType: visaFilter, plan: planFilter })
  const { data: allSkills = [] } = useManagerSkills()

  const users = data?.data ?? []
  const total = data?.total ?? 0
  const totalPages = data?.totalPages ?? 1

  const hasFilters = searchInput || skillFilters.length > 0 || visaFilter || planFilter
  const clearFilters = () => { setSearchInput(''); setSkillFilters([]); setVisaFilter(''); setPlanFilter(''); setPage(1) }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {skillModalOpen && (
        <SkillsModal
          skills={allSkills}
          selected={skillFilters}
          onApply={(s) => { setSkillFilters(s); setPage(1) }}
          onClose={() => setSkillModalOpen(false)}
        />
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-navy">Manage Users</h1>
        <p className="text-sm text-navy/50 mt-1">{total} registered members</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-navy/10 rounded-2xl p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-56">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/40" />
            <input
              type="text"
              placeholder="Search name or email…"
              value={searchInput}
              onChange={(e) => { setSearchInput(e.target.value); setPage(1) }}
              className={`${inputCls} w-full pl-9`}
            />
          </div>

          {/* Skill modal button */}
          <button
            onClick={() => setSkillModalOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-150 cursor-pointer ${
              skillFilters.length > 0
                ? 'bg-navy text-blue-accent border-navy'
                : 'bg-white text-navy border-slate-300 hover:border-navy'
            }`}
          >
            <FunnelIcon className="w-4 h-4" />
            {skillFilters.length > 0
              ? skillFilters.length === 1
                ? skillFilters[0]
                : `${skillFilters.length} skills`
              : 'Filter by Skill'}
          </button>

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
              className="px-4 py-2 text-sm font-semibold text-navy/50 hover:text-navy border border-navy/15 rounded-xl hover:border-navy/40 bg-white transition-all cursor-pointer"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-navy/10 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-7 h-7 rounded-full border-2 border-navy border-t-blue-accent animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-base font-semibold text-navy">No users match your filters</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-section-alt border-b border-navy/8">
              <tr>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-navy/50 uppercase tracking-wide">User</th>
                <th className="text-left px-4 py-3.5 text-xs font-bold text-navy/50 uppercase tracking-wide hidden md:table-cell">Skills</th>
                <th className="text-left px-4 py-3.5 text-xs font-bold text-navy/50 uppercase tracking-wide hidden lg:table-cell">Visa</th>
                <th className="text-left px-4 py-3.5 text-xs font-bold text-navy/50 uppercase tracking-wide">Plan</th>
                <th className="text-left px-4 py-3.5 text-xs font-bold text-navy/50 uppercase tracking-wide hidden sm:table-cell">Resumes</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {users.map((u) => (
                <tr
                  key={u.id}
                  onClick={() => router.push(`/manager/users/${u.id}`)}
                  className="hover:bg-section-alt transition-colors duration-100 cursor-pointer"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {u.avatar ? (
                        <img src={u.avatar} alt="" referrerPolicy="no-referrer" className="w-8 h-8 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-xs font-bold text-blue-accent shrink-0">
                          {(u.firstName?.[0] ?? u.email[0]).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-navy truncate">
                          {u.firstName} {u.lastName}
                        </p>
                        <p className="text-sm text-navy/60 truncate">{u.email}</p>
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
                        <span className="text-xs text-navy/40">+{(u.profile?.skills?.length ?? 0) - 3}</span>
                      )}
                      {(u.profile?.skills?.length ?? 0) === 0 && (
                        <span className="text-xs text-navy/25">—</span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-4 hidden lg:table-cell text-xs font-medium text-navy">
                    {u.profile?.visaType
                      ? <span className="bg-blue-muted px-2 py-0.5 rounded-full">{VISA_LABELS[u.profile.visaType] ?? u.profile.visaType}</span>
                      : <span className="text-navy/25">—</span>}
                  </td>

                  <td className="px-4 py-4">
                    {u.subscription ? (
                      <span className={`text-xs px-2.5 py-1 rounded-full ${PLAN_PILL[u.subscription.plan] ?? 'bg-navy/10 text-navy'}`}>
                        {u.subscription.plan.replace('_', ' ')}
                      </span>
                    ) : <span className="text-navy/25 text-xs">—</span>}
                  </td>

                  <td className="px-4 py-4 hidden sm:table-cell text-xs font-medium text-navy/60">
                    {u.profile?.resumes.length ?? 0} file{(u.profile?.resumes.length ?? 0) !== 1 ? 's' : ''}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-navy/40">
                      View <ChevronRightIcon className="w-3.5 h-3.5" />
                    </span>
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
          <p className="text-sm text-navy/50">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 text-sm font-medium border border-navy/15 rounded-xl bg-white disabled:opacity-40 hover:border-navy/40 hover:bg-section-alt transition-colors cursor-pointer">
              Previous
            </button>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 text-sm font-medium border border-navy/15 rounded-xl bg-white disabled:opacity-40 hover:border-navy/40 hover:bg-section-alt transition-colors cursor-pointer">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
