'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BoltIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  ChartBarIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

/* ─── Avatars ────────────────────────────────────────────── */
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
    <Image src={AVATARS[idx % AVATARS.length]} alt="profile" width={size} height={size}
      className={`rounded-full object-cover ring-2 ring-white ${className}`} unoptimized />
  )
}

/* ─── Browser chrome ─────────────────────────────────────── */
function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xl bg-white">
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center gap-3">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-amber-400" />
          <span className="w-3 h-3 rounded-full bg-emerald-400" />
        </div>
        <div className="flex-1 bg-white rounded-md px-3 py-1 text-[11px] text-slate-400 border border-slate-200">
          app.jobsfoundry.ai
        </div>
      </div>
      <div className="p-5 bg-slate-50 min-h-[300px]">{children}</div>
    </div>
  )
}

/* ─── Previews ───────────────────────────────────────────── */
function AutoApplyPreview() {
  const jobs = [
    { title: 'Senior Software Engineer', company: 'Stripe', status: 'Applied', color: 'bg-blue-500' },
    { title: 'Full Stack Developer', company: 'Airbnb', status: 'Applied', color: 'bg-rose-500' },
    { title: 'Backend Engineer', company: 'Figma', status: 'Applying…', color: 'bg-violet-500' },
    { title: 'Platform Engineer', company: 'Notion', status: 'Queued', color: 'bg-slate-400' },
  ]
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4">
        <Avatar idx={1} size={36} className="ring-blue-200" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-navy">Alex Johnson</p>
          <p className="text-xs text-slate-500">Senior Software Engineer · San Francisco</p>
        </div>
        <span className="text-xs font-bold bg-blue-accent text-navy px-2.5 py-1 rounded-full">47 sent today</span>
      </div>
      {jobs.map((j) => (
        <div key={j.title} className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
          <div className={`w-8 h-8 rounded-lg ${j.color} flex-shrink-0 flex items-center justify-center text-white text-xs font-bold`}>{j.company[0]}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-navy truncate">{j.title}</p>
            <p className="text-xs text-slate-500">{j.company}</p>
          </div>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
            j.status === 'Applied' ? 'bg-emerald-50 text-emerald-700' :
            j.status === 'Applying…' ? 'bg-blue-50 text-blue-600 animate-pulse' : 'bg-slate-100 text-slate-500'
          }`}>{j.status}</span>
        </div>
      ))}
    </div>
  )
}

function TrackerPreview() {
  const cols = [
    { label: 'Applied', count: 47, color: 'bg-navy', jobs: ['Stripe · SWE', 'Airbnb · Backend'] },
    { label: 'Interviewing', count: 6, color: 'bg-violet-500', jobs: ['Vercel · Platform', 'Notion · FS'] },
    { label: 'Offer', count: 1, color: 'bg-emerald-600', jobs: ['Figma · SWE II'] },
  ]
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <Avatar idx={3} size={36} />
        <div><p className="text-sm font-bold text-navy">Application Pipeline</p><p className="text-xs text-slate-500">54 total tracked</p></div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {cols.map((col) => (
          <div key={col.label} className="bg-white rounded-xl p-3 border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2 h-2 rounded-full ${col.color}`} />
              <p className="text-xs font-semibold text-slate-600">{col.label}</p>
              <span className="ml-auto text-xs font-bold text-slate-700">{col.count}</span>
            </div>
            {col.jobs.map((j) => (
              <div key={j} className="bg-slate-50 border border-slate-100 rounded-lg p-2 mb-2 last:mb-0">
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
        <div className="flex-1"><p className="text-sm font-bold text-navy">Resume Tailoring</p><p className="text-xs text-slate-500">AI-optimised per role</p></div>
        <span className="text-sm font-extrabold text-emerald-600">ATS 94%</span>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <div className="h-3 bg-navy rounded w-48" />
        <div className="h-2 bg-slate-200 rounded w-full" /><div className="h-2 bg-slate-200 rounded w-5/6" />
        <div className="flex flex-wrap gap-1.5 mt-2">
          {['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'].map((s) => (
            <span key={s} className="text-[10px] font-semibold bg-violet-50 border border-violet-200 text-violet-700 px-2 py-0.5 rounded-full">{s}</span>
          ))}
        </div>
        <div className="space-y-1.5">
          <div className="h-2 bg-emerald-100 border-l-2 border-emerald-500 rounded w-full" />
          <div className="h-2 bg-emerald-100 border-l-2 border-emerald-500 rounded w-4/5" />
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
        <div className="flex-1"><p className="text-sm font-bold text-navy">Cover Letter</p><p className="text-xs text-slate-500">Personalised per application</p></div>
        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">AI Generated</span>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="h-2 bg-slate-700 rounded w-40 mb-3" />
        <p className="text-[11px] text-slate-500 mb-2">Dear Hiring Manager,</p>
        <p className="text-[11px] text-slate-600 leading-relaxed mb-2">
          I&apos;m excited to apply for the <span className="font-semibold text-amber-600 bg-amber-50 px-0.5 rounded">Senior Software Engineer</span> role at{' '}
          <span className="font-semibold text-amber-600 bg-amber-50 px-0.5 rounded">Stripe</span>. With 5 years in{' '}
          <span className="font-semibold text-amber-600 bg-amber-50 px-0.5 rounded">distributed systems</span>…
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
  const bars = [40, 65, 80, 55, 90, 30, 45]
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <Avatar idx={6} size={36} />
        <div><p className="text-sm font-bold text-navy">Weekly Performance</p><p className="text-xs text-slate-500">Your analytics</p></div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[{ label: 'Applied', val: '312', color: 'text-navy' }, { label: 'Responses', val: '26', color: 'text-emerald-600' }, { label: 'Rate', val: '8.3%', color: 'text-violet-600' }].map((m) => (
          <div key={m.label} className="bg-white border border-slate-100 rounded-xl p-3 text-center">
            <p className={`text-lg font-extrabold ${m.color}`}>{m.val}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white border border-slate-100 rounded-xl p-3">
        <div className="flex items-end gap-1.5 h-16">
          {bars.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-sm bg-blue-accent/80" style={{ height: `${h}%` }} />
              <span className="text-[9px] text-slate-400">{days[i]}</span>
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
        <div className="flex-1"><p className="text-sm font-bold text-navy">Recruiter Outreach</p><p className="text-xs text-slate-500">Automated personalised emails</p></div>
        <span className="text-xs font-semibold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">14 this week</span>
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
              e.status === 'Sent' ? 'bg-cyan-50 text-cyan-700' : 'bg-slate-100 text-slate-500'
            }`}>{e.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Feature list ───────────────────────────────────────── */
const FEATURES = [
  { id: 'auto-apply', icon: BoltIcon, title: 'Auto-Apply Engine', short: 'Apply to 100+ jobs daily, automatically.', description: 'Set your preferences once. JobsFoundry applies to perfectly matched roles every single day — custom resume and cover letter included — while you focus on interview prep.', accent: '#3b82f6', Preview: AutoApplyPreview },
  { id: 'tracker', icon: ClipboardDocumentListIcon, title: 'Job Application Tracker', short: 'Every application in one organised dashboard.', description: 'Never lose track of where you applied. See every application, its status, and follow-up actions in a clean kanban-style pipeline.', accent: '#10b981', Preview: TrackerPreview },
  { id: 'resume', icon: DocumentTextIcon, title: 'AI Resume Tailoring', short: 'Each job gets its own AI-optimised resume.', description: 'Generic resumes get ignored. JobsFoundry rewrites your resume for every role — matching keywords, adjusting tone, and maximising your ATS score automatically.', accent: '#8b5cf6', Preview: ResumePreview },
  { id: 'cover-letter', icon: PencilSquareIcon, title: 'AI Cover Letter Generator', short: 'Personalised, keyword-rich letters in seconds.', description: 'Every application ships with a cover letter that reads like you wrote it yourself — personalised to the company, role, and hiring manager.', accent: '#f59e0b', Preview: CoverLetterPreview },
  { id: 'analytics', icon: ChartBarIcon, title: 'Performance Analytics', short: 'See what works — and double down on it.', description: 'Track response rates by role, company size, and location. Know exactly which applications perform best so you can optimise your search strategy.', accent: '#ef4444', Preview: AnalyticsPreview },
  { id: 'outreach', icon: EnvelopeIcon, title: 'Recruiter Outreach', short: 'Email hiring managers automatically.', description: 'JobsFoundry finds the right recruiter or hiring manager at target companies and sends personalised outreach emails on your behalf.', accent: '#06b6d4', Preview: OutreachPreview },
]

/* ─── Main component ─────────────────────────────────────── */
export default function FeaturesShowcase() {
  const [active, setActive] = useState(0)
  const feature = FEATURES[active]
  const Preview = feature.Preview

  return (
    <section className="bg-gradient-to-br from-blue-muted/40 via-white to-blue-muted/10 py-12 sm:py-16 relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-muted/40 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-navy uppercase tracking-widest mb-3">All the tools you need</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-3">
            The most powerful AI job search platform.
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">AI where it genuinely works. Every feature built to reduce your time-to-hire.</p>
        </div>

        <div className="grid lg:grid-cols-[360px_1fr] gap-10 xl:gap-16 items-start">

          {/* ── LEFT: click-only feature nav ── */}
          <div className="flex flex-col divide-y divide-slate-200">
            {FEATURES.map((f, i) => {
              const isActive = active === i
              return (
                <button
                  key={f.id}
                  onClick={() => setActive(i)}
                  className="text-left py-5 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-0.5 h-7 rounded-full flex-shrink-0 transition-all duration-300"
                      style={{ backgroundColor: isActive ? f.accent : 'transparent' }}
                    />
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                      style={{ backgroundColor: isActive ? f.accent + '18' : '#f1f5f9', color: isActive ? f.accent : '#94a3b8' }}
                    >
                      <f.icon className="w-3.5 h-3.5" />
                    </div>
                    <span
                      className="text-sm font-semibold transition-colors duration-200"
                      style={{ color: isActive ? f.accent : '#475569' }}
                    >
                      {f.title}
                    </span>
                  </div>
                  <AnimatePresence>
                    {isActive && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="overflow-hidden text-sm text-slate-500 leading-relaxed mt-2 pl-[42px]"
                      >
                        {f.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </button>
              )
            })}
          </div>

          {/* ── RIGHT: single preview, swaps on click ── */}
          <div className="hidden lg:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <BrowserFrame><Preview /></BrowserFrame>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  )
}
