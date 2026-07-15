'use client'

import { motion } from 'framer-motion'

import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

const ROWS = [
  { feature: 'Works on ALL ATS systems (Workday, iCIMS, Taleo…)', solo: false, aiAutoApply: false, staffing: false, jobsfoundry: true },
  { feature: 'Fully personalized applications', solo: true, aiAutoApply: false, staffing: false, jobsfoundry: true },
  { feature: 'Consistent & reliable every day', solo: false, aiAutoApply: true, staffing: false, jobsfoundry: true },
  { feature: 'AI resume tailoring per role', solo: false, aiAutoApply: false, staffing: false, jobsfoundry: true },
  { feature: 'Recruiter email outreach', solo: false, aiAutoApply: false, staffing: false, jobsfoundry: true },
  { feature: 'Proof of every application', solo: false, aiAutoApply: false, staffing: false, jobsfoundry: true },
  { feature: 'Better use of your time', solo: false, aiAutoApply: true, staffing: false, jobsfoundry: true },
  { feature: 'Affordable pricing', solo: true, aiAutoApply: true, staffing: false, jobsfoundry: true },
]

function Cell({ value, isJobsFoundry }: { value: boolean; isJobsFoundry?: boolean }) {
  if (value === true)
    return <CheckIcon className={`w-5 h-5 mx-auto ${isJobsFoundry ? 'text-navy' : 'text-emerald-500'}`} />
  return <XMarkIcon className="w-5 h-5 mx-auto text-red-500" />
}

const VERDICTS = [
  { label: 'Solo', verdict: 'Soul-crushing', emoji: '😵', sub: 'Burnout guaranteed', dark: false },
  { label: 'AI Auto-Apply', verdict: 'Misses 60% of roles', emoji: '🐍', sub: 'ATS limitations', dark: false },
  { label: 'Staffing Firms', verdict: '20% salary gone', emoji: '💀', sub: 'Expensive & slow', dark: false },
  { label: 'JobsFoundry', verdict: 'Your true wingman', emoji: '🚀', sub: 'Smart + affordable', dark: true },
]

export default function Comparison() {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-navy uppercase tracking-widest mb-3">
            Stack up
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-4">
            Let&apos;s see how we compare
          </h2>
          <p className="text-slate-700 max-w-xl mx-auto font-medium">
            See why JobsFoundry outperforms solo job hunting, AI auto-apply tools, and traditional staffing firms.
          </p>
        </div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white mb-10"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-4 px-6 bg-slate-100 text-slate-800 font-semibold w-2/5">What matters</th>
                <th className="text-center py-4 px-5 bg-slate-100 text-slate-800 font-bold">Solo</th>
                <th className="text-center py-4 px-5 bg-slate-100 text-slate-800 font-bold">AI Auto-Apply</th>
                <th className="text-center py-4 px-5 bg-slate-100 text-slate-800 font-bold">Staffing Firms</th>
                <th className="text-center py-4 px-5 bg-blue-accent text-navy font-bold">
                  JobsFoundry ⚡
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr
                  key={row.feature}
                  className={`border-b border-slate-100 last:border-0 hover:bg-blue-muted/20 transition-colors duration-100 cursor-default ${
                    i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                  }`}
                >
                  <td className="py-3.5 px-6 text-slate-700 font-medium leading-snug">{row.feature}</td>
                  <td className="py-3.5 px-5 text-center"><Cell value={row.solo} /></td>
                  <td className="py-3.5 px-5 text-center"><Cell value={row.aiAutoApply} /></td>
                  <td className="py-3.5 px-5 text-center"><Cell value={row.staffing} /></td>
                  <td className="py-3.5 px-5 text-center bg-blue-muted/30">
                    <Cell value={row.jobsfoundry} isJobsFoundry />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Verdict cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {VERDICTS.map((v, i) => (
            <motion.div
              key={v.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -60px 0px" }}
              transition={{ delay: i * 0.08, duration: 0.4, ease: 'easeOut' }}
              className={`rounded-2xl p-5 text-center border transition-all duration-200 cursor-default ${
                v.dark
                  ? 'bg-navy border-navy text-white shadow-xl hover:-translate-y-1.5 hover:shadow-2xl'
                  : 'bg-slate-50 border-slate-200 hover:-translate-y-1 hover:shadow-md hover:border-slate-300'
              }`}
            >
              <p className="text-2xl mb-1.5">{v.emoji}</p>
              <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${v.dark ? 'text-blue-accent' : 'text-slate-500'}`}>
                {v.label}
              </p>
              <p className={`font-bold text-sm ${v.dark ? 'text-white' : 'text-navy'}`}>{v.verdict}</p>
              <p className={`text-xs mt-1 ${v.dark ? 'text-white/60' : 'text-slate-500'}`}>{v.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/login?plan=forge"
            className="group inline-flex items-center gap-2 bg-blue-accent hover:bg-blue-accent-hover active:scale-[0.98] text-navy font-bold px-8 py-4 rounded-xl transition-all duration-150 text-base shadow-lg hover:shadow-xl cursor-pointer select-none"
          >
            Start for Free — No Credit Card Required
          </Link>
          <p className="text-slate-500 text-sm mt-3">Free forever. Upgrade when you need to.</p>
        </div>
      </div>
    </section>
  )
}
