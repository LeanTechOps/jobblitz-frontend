'use client'

import { motion } from 'framer-motion'
import { CheckIcon, XMarkIcon, MinusIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

const ROWS = [
  {
    feature: 'Works on ALL ATS systems (Workday, iCIMS, Taleo…)',
    solo: 'partial',
    aiAutoApply: false,
    staffing: 'partial',
    jobblitz: true,
  },
  {
    feature: 'Fully personalized applications',
    solo: true,
    aiAutoApply: false,
    staffing: 'partial',
    jobblitz: true,
  },
  {
    feature: 'Consistent & reliable every day',
    solo: false,
    aiAutoApply: true,
    staffing: false,
    jobblitz: true,
  },
  {
    feature: 'AI resume tailoring per role',
    solo: false,
    aiAutoApply: 'partial',
    staffing: false,
    jobblitz: true,
  },
  {
    feature: 'Recruiter email outreach',
    solo: false,
    aiAutoApply: false,
    staffing: false,
    jobblitz: true,
  },
  {
    feature: 'Proof of every application',
    solo: false,
    aiAutoApply: false,
    staffing: false,
    jobblitz: true,
  },
  {
    feature: 'Better use of your time',
    solo: false,
    aiAutoApply: true,
    staffing: false,
    jobblitz: true,
  },
  {
    feature: 'Affordable pricing',
    solo: true,
    aiAutoApply: true,
    staffing: false,
    jobblitz: true,
  },
]

type CellVal = boolean | 'partial'

function Cell({ value, isJobBlitz }: { value: CellVal; isJobBlitz?: boolean }) {
  if (value === true)
    return (
      <CheckIcon
        className={`w-5 h-5 mx-auto ${isJobBlitz ? 'text-blue-accent' : 'text-emerald-400'}`}
      />
    )
  if (value === false)
    return <XMarkIcon className="w-5 h-5 mx-auto text-red-500" />
  return <MinusIcon className="w-4 h-4 mx-auto text-amber-400" />
}

const VERDICTS = [
  { label: 'Solo', verdict: 'Soul-crushing', emoji: '😵', sub: 'Burnout guaranteed' },
  { label: 'AI Auto-Apply', verdict: 'Misses 60% of roles', emoji: '🐍', sub: 'ATS limitations' },
  { label: 'Staffing Firms', verdict: '20% of salary gone', emoji: '💀', sub: 'Expensive & slow' },
  { label: 'JobBlitz', verdict: 'Your true wingman', emoji: '🚀', sub: 'Smart + affordable' },
]

export default function Comparison() {
  return (
    <section className="bg-section-alt py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-blue-accent uppercase tracking-widest mb-3">
            Stack up
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-4">
            Let&apos;s see how we compare
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            See why JobBlitz outperforms solo job hunting, AI auto-apply tools, and traditional staffing firms.
          </p>
        </div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white mb-10"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left py-4 px-6 text-slate-500 font-medium w-2/5">
                  What matters
                </th>
                <th className="text-center py-4 px-5 text-slate-500 font-semibold">Solo</th>
                <th className="text-center py-4 px-5 text-slate-500 font-semibold">AI Auto-Apply</th>
                <th className="text-center py-4 px-5 text-slate-500 font-semibold">Staffing Firms</th>
                <th className="text-center py-4 px-5 text-navy font-bold bg-blue-accent/5">
                  <span className="text-blue-accent">JobBlitz</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr
                  key={row.feature}
                  className={`border-b border-slate-100 last:border-0 hover:bg-blue-50/30 transition-colors duration-100 cursor-default ${
                    i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                  }`}
                >
                  <td className="py-3.5 px-6 text-slate-600 font-medium leading-snug">
                    {row.feature}
                  </td>
                  <td className="py-3.5 px-5 text-center">
                    <Cell value={row.solo as CellVal} />
                  </td>
                  <td className="py-3.5 px-5 text-center">
                    <Cell value={row.aiAutoApply as CellVal} />
                  </td>
                  <td className="py-3.5 px-5 text-center">
                    <Cell value={row.staffing as CellVal} />
                  </td>
                  <td className="py-3.5 px-5 text-center bg-blue-accent/5">
                    <Cell value={row.jobblitz as CellVal} isJobBlitz />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Verdict row */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VERDICTS.map((v, i) => (
            <motion.div
              key={v.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4, ease: 'easeOut' }}
              className={`rounded-xl p-5 text-center border transition-all duration-200 cursor-default ${
                v.label === 'JobBlitz'
                  ? 'bg-navy border-blue-accent text-white shadow-lg shadow-blue-100 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100'
                  : 'bg-white border-slate-200 shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300'
              }`}
            >
              <p className="text-2xl mb-1">{v.emoji}</p>
              <p
                className={`text-xs font-semibold uppercase tracking-widest mb-1 ${
                  v.label === 'JobBlitz' ? 'text-blue-300' : 'text-slate-400'
                }`}
              >
                {v.label}
              </p>
              <p
                className={`font-bold text-base ${
                  v.label === 'JobBlitz' ? 'text-white' : 'text-navy'
                }`}
              >
                {v.verdict}
              </p>
              <p
                className={`text-xs mt-1 ${
                  v.label === 'JobBlitz' ? 'text-blue-200' : 'text-slate-400'
                }`}
              >
                {v.sub}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA nudge */}
        <div className="text-center mt-12">
          <Link
            href="/login?plan=free"
            className="group inline-flex items-center gap-2 bg-blue-accent hover:bg-blue-500 active:scale-[0.98] text-white font-semibold px-8 py-3.5 rounded-lg transition-all duration-150 text-sm shadow-lg shadow-blue-100 hover:shadow-xl hover:shadow-blue-100 cursor-pointer select-none"
          >
            Start for Free — No Credit Card Required
          </Link>
          <p className="text-slate-400 text-xs mt-3">Free forever. Upgrade when you need to.</p>
        </div>
      </div>
    </section>
  )
}
