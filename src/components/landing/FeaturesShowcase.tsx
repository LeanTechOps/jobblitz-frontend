'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BoltIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  ChartBarIcon,
  EnvelopeIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

/* ─── avatar helpers ─────────────────────────────────────── */
const AVATARS = [
  'https://i.pravatar.cc/48?img=1',
  'https://i.pravatar.cc/48?img=5',
  'https://i.pravatar.cc/48?img=9',
  'https://i.pravatar.cc/48?img=12',
  'https://i.pravatar.cc/48?img=25',
  'https://i.pravatar.cc/48?img=33',
  'https://i.pravatar.cc/48?img=47',
  'https://i.pravatar.cc/48?img=60',
]

function Avatar({ idx, size = 32, className = '' }: { idx: number; size?: number; className?: string }) {
  return (
    <Image
      src={AVATARS[idx % AVATARS.length]}
      alt="profile"
      width={size}
      height={size}
      className={`rounded-full object-cover ring-2 ring-white ${className}`}
      unoptimized
    />
  )
}

/* ─── Preview components ─────────────────────────────────── */
function AutoApplyPreview() {
  const jobs = [
    { title: 'Senior Software Engineer', company: 'Stripe', status: 'Applied', color: 'bg-blue-500', avatarIdx: 0 },
    { title: 'Full Stack Developer', company: 'Airbnb', status: 'Applied', color: 'bg-rose-500', avatarIdx: 2 },
    { title: 'Backend Engineer', company: 'Figma', status: 'Applying…', color: 'bg-violet-500', avatarIdx: 4 },
    { title: 'Platform Engineer', company: 'Notion', status: 'Queued', color: 'bg-slate-400', avatarIdx: 6 },
    { title: 'Software Engineer II', company: 'Vercel', status: 'Queued', color: 'bg-slate-400', avatarIdx: 7 },
  ]
  return (
    <div className="space-y-2.5">
      {/* Profile card */}
      <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4">
        <Avatar idx={1} size={40} className="ring-blue-200" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-navy">Alex Johnson</p>
          <p className="text-xs text-slate-500">Senior Software Engineer · San Francisco</p>
        </div>
        <span className="text-xs font-bold bg-blue-accent text-white px-2.5 py-1 rounded-full flex-shrink-0">47 sent today</span>
      </div>

      {jobs.map((j) => (
        <div key={j.title} className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
          <div className={`w-8 h-8 rounded-lg ${j.color} flex-shrink-0 flex items-center justify-center text-white text-xs font-bold`}>
            {j.company[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-navy truncate">{j.title}</p>
            <p className="text-xs text-slate-500">{j.company}</p>
          </div>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
            j.status === 'Applied' ? 'bg-emerald-50 text-emerald-700' :
            j.status === 'Applying…' ? 'bg-blue-50 text-blue-600 animate-pulse' :
            'bg-slate-100 text-slate-500'
          }`}>
            {j.status}
          </span>
        </div>
      ))}
    </div>
  )
}

function TrackerPreview() {
  const cols = [
    { label: 'Applied', count: 47, color: 'bg-blue-accent', jobs: ['Stripe · SWE', 'Airbnb · Backend'] },
    { label: 'Interviewing', count: 6, color: 'bg-violet-500', jobs: ['Vercel · Platform', 'Notion · FS'] },
    { label: 'Offer', count: 1, color: 'bg-emerald-600', jobs: ['Figma · SWE II'] },
  ]
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <Avatar idx={3} size={36} />
        <div>
          <p className="text-sm font-bold text-navy">Application Pipeline</p>
          <p className="text-xs text-slate-500">54 total applications tracked</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {cols.map((col) => (
          <div key={col.label} className="bg-slate-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2 h-2 rounded-full ${col.color}`} />
              <p className="text-xs font-semibold text-slate-600">{col.label}</p>
              <span className="ml-auto text-xs font-bold text-slate-700">{col.count}</span>
            </div>
            {col.jobs.map((j) => (
              <div key={j} className="bg-white border border-slate-100 rounded-lg p-2 mb-2 last:mb-0">
                <p className="text-[11px] font-medium text-navy">{j}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function ResumePreview() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <Avatar idx={5} size={36} />
        <div className="flex-1">
          <p className="text-sm font-bold text-navy">Resume Tailoring</p>
          <p className="text-xs text-slate-500">AI-optimised for each application</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">ATS Score</p>
          <span className="text-sm font-extrabold text-emerald-600">94%</span>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <div className="h-3 bg-navy rounded w-48" />
        <div className="h-2 bg-slate-200 rounded w-full" />
        <div className="h-2 bg-slate-200 rounded w-5/6" />
        <div className="mt-3">
          <div className="h-2 bg-violet-300 rounded w-32 mb-2" />
          <div className="flex flex-wrap gap-1.5">
            {['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'].map((s) => (
              <span key={s} className="text-[10px] font-semibold bg-violet-50 border border-violet-200 text-violet-700 px-2 py-0.5 rounded-full">{s}</span>
            ))}
          </div>
        </div>
        <div className="mt-2 space-y-1.5">
          <div className="h-2 bg-emerald-100 border-l-2 border-emerald-500 rounded pl-1 w-full" />
          <div className="h-2 bg-emerald-100 border-l-2 border-emerald-500 rounded pl-1 w-4/5" />
          <div className="h-2 bg-slate-100 rounded w-3/4" />
        </div>
      </div>
      <p className="text-[11px] text-emerald-700 font-semibold mt-2 flex items-center gap-1">
        <CheckCircleIcon className="w-3.5 h-3.5" /> Tailored for: Senior Software Engineer at Stripe
      </p>
    </div>
  )
}

function CoverLetterPreview() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <Avatar idx={2} size={36} />
        <div className="flex-1">
          <p className="text-sm font-bold text-navy">Cover Letter</p>
          <p className="text-xs text-slate-500">Personalised for every application</p>
        </div>
        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">AI Generated</span>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="h-2 bg-slate-700 rounded w-40 mb-3" />
        <p className="text-[11px] text-slate-500 leading-relaxed mb-2">
          Dear Hiring Manager,
        </p>
        <p className="text-[11px] text-slate-600 leading-relaxed mb-2">
          I&apos;m excited to apply for the <span className="font-semibold text-amber-600 bg-amber-50 px-0.5 rounded">Senior Software Engineer</span> role at{' '}
          <span className="font-semibold text-amber-600 bg-amber-50 px-0.5 rounded">Stripe</span>. With 5 years of experience in{' '}
          <span className="font-semibold text-amber-600 bg-amber-50 px-0.5 rounded">distributed systems</span> and a proven track record…
        </p>
        <div className="flex flex-wrap gap-1 mt-3">
          {['Personalised tone', 'Keyword rich', 'ATS-friendly'].map((tag) => (
            <span key={tag} className="text-[9px] font-semibold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function AnalyticsPreview() {
  const bars = [
    { label: 'Mon', h: 40 },
    { label: 'Tue', h: 65 },
    { label: 'Wed', h: 80 },
    { label: 'Thu', h: 55 },
    { label: 'Fri', h: 90 },
    { label: 'Sat', h: 30 },
    { label: 'Sun', h: 45 },
  ]
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <Avatar idx={6} size={36} />
        <div>
          <p className="text-sm font-bold text-navy">Weekly Performance</p>
          <p className="text-xs text-slate-500">Your job search analytics</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Applied', val: '312', color: 'text-blue-accent' },
          { label: 'Responses', val: '26', color: 'text-emerald-600' },
          { label: 'Rate', val: '8.3%', color: 'text-violet-600' },
        ].map((m) => (
          <div key={m.label} className="bg-white border border-slate-100 rounded-xl p-3 text-center">
            <p className={`text-lg font-extrabold ${m.color}`}>{m.val}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white border border-slate-100 rounded-xl p-3">
        <div className="flex items-end gap-1.5 h-16">
          {bars.map((b) => (
            <div key={b.label} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-sm bg-blue-accent/80 hover:bg-blue-accent transition-colors duration-150"
                style={{ height: `${b.h}%` }}
              />
              <span className="text-[9px] text-slate-400">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function OutreachPreview() {
  const emails = [
    { name: 'Sarah Chen', role: 'Eng. Manager · Stripe', status: 'Replied', avatarIdx: 0 },
    { name: 'James Park', role: 'Tech Lead · Figma', status: 'Sent', avatarIdx: 2 },
    { name: 'Priya Shah', role: 'Dir. Eng · Notion', status: 'Sent', avatarIdx: 4 },
    { name: 'Mike Torres', role: 'CTO · Linear', status: 'Queued', avatarIdx: 7 },
  ]
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <Avatar idx={3} size={36} />
        <div className="flex-1">
          <p className="text-sm font-bold text-navy">Recruiter Outreach</p>
          <p className="text-xs text-slate-500">Automated personalised emails</p>
        </div>
        <span className="text-xs font-semibold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200 flex-shrink-0">14 sent this week</span>
      </div>
      <div className="space-y-2.5">
        {emails.map((e) => (
          <div key={e.name} className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
            <Avatar idx={e.avatarIdx} size={32} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-navy">{e.name}</p>
              <p className="text-xs text-slate-500 truncate">{e.role}</p>
            </div>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
              e.status === 'Replied' ? 'bg-emerald-50 text-emerald-700' :
              e.status === 'Sent' ? 'bg-cyan-50 text-cyan-700' :
              'bg-slate-100 text-slate-500'
            }`}>{e.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Feature list ───────────────────────────────────────── */
const FEATURES = [
  {
    id: 'auto-apply',
    icon: BoltIcon,
    title: 'Auto-Apply Engine',
    short: 'Apply to 100+ jobs daily, automatically.',
    accent: '#3b82f6',
    preview: <AutoApplyPreview />,
  },
  {
    id: 'tracker',
    icon: ClipboardDocumentListIcon,
    title: 'Job Application Tracker',
    short: 'Every application in one organised dashboard.',
    accent: '#10b981',
    preview: <TrackerPreview />,
  },
  {
    id: 'resume',
    icon: DocumentTextIcon,
    title: 'AI Resume Tailoring',
    short: 'Each job gets its own AI-optimised resume version.',
    accent: '#8b5cf6',
    preview: <ResumePreview />,
  },
  {
    id: 'cover-letter',
    icon: PencilSquareIcon,
    title: 'AI Cover Letter Generator',
    short: 'Personalised, keyword-rich cover letters in seconds.',
    accent: '#f59e0b',
    preview: <CoverLetterPreview />,
  },
  {
    id: 'analytics',
    icon: ChartBarIcon,
    title: 'Performance Analytics',
    short: 'See what works — and double down on it.',
    accent: '#ef4444',
    preview: <AnalyticsPreview />,
  },
  {
    id: 'outreach',
    icon: EnvelopeIcon,
    title: 'Recruiter Outreach',
    short: 'Email hiring managers automatically at target companies.',
    accent: '#06b6d4',
    preview: <OutreachPreview />,
  },
]

const EDGE_HOLD_MS = 500          // ms to hold at edge before releasing page scroll
const FEATURE_DEBOUNCE_MS = 400   // ms between feature switches

/* ─── Main component ─────────────────────────────────────── */
export default function FeaturesShowcase() {
  const [active, setActive] = useState(0)
  const panelRef    = useRef<HTMLDivElement>(null)
  const previewRef  = useRef<HTMLDivElement>(null)
  const activeRef   = useRef(0)
  const lastSwitch  = useRef(0)
  const edgeHitTime = useRef<number | null>(null)
  const prevDir     = useRef<'up' | 'down' | null>(null)
  const hasCentred  = useRef(false)   // only auto-centre once per scroll session inside box

  // Keep activeRef in sync without re-registering wheel listener
  useEffect(() => { activeRef.current = active }, [active])

  // Scroll preview back to top whenever feature changes
  useEffect(() => {
    if (previewRef.current) previewRef.current.scrollTop = 0
  }, [active])

  const goNext = useCallback(() => setActive((p) => Math.min(p + 1, FEATURES.length - 1)), [])
  const goPrev = useCallback(() => setActive((p) => Math.max(p - 1, 0)), [])

  // Single registration — never torn down/re-added (uses refs for all state)
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const panel = panelRef.current
      // Ignore if cursor not inside the panel box
      if (!panel || !panel.contains(e.target as Node)) {
        edgeHitTime.current = null
        prevDir.current = null
        hasCentred.current = false  // reset so next entry re-centres
        return
      }

      // Auto-centre the panel in the viewport on first scroll inside
      if (!hasCentred.current) {
        hasCentred.current = true
        const rect = panel.getBoundingClientRect()
        const panelCentre = rect.top + rect.height / 2
        const viewCentre  = window.innerHeight / 2
        const diff = panelCentre - viewCentre
        if (Math.abs(diff) > 80) {
          window.scrollBy({ top: diff, behavior: 'smooth' })
        }
      }

      const cur         = activeRef.current
      const goingDown   = e.deltaY > 0
      const dir         = goingDown ? 'down' : 'up'
      const atEnd       = cur === FEATURES.length - 1
      const atStart     = cur === 0
      const atEdge      = (goingDown && atEnd) || (!goingDown && atStart)

      // Reset edge timer when direction reverses
      if (prevDir.current && prevDir.current !== dir) edgeHitTime.current = null
      prevDir.current = dir

      if (atEdge) {
        const now = Date.now()
        if (edgeHitTime.current === null) edgeHitTime.current = now

        // Always block native scroll while inside box
        e.preventDefault()

        // After hold period, drive page scroll ourselves
        if (now - edgeHitTime.current >= EDGE_HOLD_MS) {
          window.scrollBy({ top: e.deltaY, behavior: 'auto' })
        }
        return
      }

      // Inside list — reset edge timer and block page scroll
      edgeHitTime.current = null
      e.preventDefault()

      const now = Date.now()
      if (now - lastSwitch.current < FEATURE_DEBOUNCE_MS) return

      if (goingDown) setActive((p) => Math.min(p + 1, FEATURES.length - 1))
      else           setActive((p) => Math.max(p - 1, 0))
      lastSwitch.current = now
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const feature = FEATURES[active]

  return (
    <section className="bg-gradient-to-br from-blue-50/60 via-white to-violet-50/30 py-12 sm:py-16 relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-100/40 blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-blue-accent uppercase tracking-widest mb-3">
            All the tools you need
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-4">
            The most powerful AI job search platform — free to start.
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            AI where it genuinely works. Every feature built to reduce your time-to-hire.
          </p>
        </div>

        {/* Two-panel layout */}
        <div ref={panelRef} className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-[280px_1fr]">

            {/* Left: feature nav */}
            <div className="border-r border-slate-100 bg-slate-50/60 p-4 flex flex-col gap-1">
              {FEATURES.map((f, i) => (
                <button
                  key={f.id}
                  onClick={() => setActive(i)}
                  className={`group flex items-start gap-3 w-full text-left px-4 py-3.5 rounded-xl transition-all duration-150 cursor-pointer ${
                    active === i
                      ? 'bg-white shadow-sm border border-slate-200'
                      : 'hover:bg-white/70 border border-transparent'
                  }`}
                >
                  <div
                    className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
                    style={{
                      backgroundColor: active === i ? f.accent + '18' : '#f1f5f9',
                      color: active === i ? f.accent : '#64748b',
                    }}
                  >
                    <f.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-tight transition-colors duration-150"
                       style={{ color: active === i ? f.accent : '#1e293b' }}>
                      {f.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug hidden sm:block">
                      {f.short}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Right: feature preview */}
            <div ref={previewRef} className="p-6 sm:p-8 min-h-[420px] flex flex-col overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="flex-1"
                >
                  {/* Feature header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: feature.accent + '18', color: feature.accent }}
                    >
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-navy">{feature.title}</h3>
                      <p className="text-sm text-slate-600">{feature.short}</p>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                    {feature.preview}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Nav hint */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400 select-none">
                  {active + 1} / {FEATURES.length} — scroll inside to navigate
                </p>
                <div className="flex gap-1">
                  <button onClick={goPrev} disabled={active === 0}
                    className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-navy hover:border-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer"
                    aria-label="Previous feature">
                    <ChevronUpIcon className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={goNext} disabled={active === FEATURES.length - 1}
                    className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-navy hover:border-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer"
                    aria-label="Next feature">
                    <ChevronDownIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
