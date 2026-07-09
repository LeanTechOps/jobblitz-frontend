'use client'

import { motion } from 'framer-motion'
import {
  BoltIcon,
  DocumentTextIcon,
  ChartBarIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline'

const FEATURES = [
  {
    icon: BoltIcon,
    title: 'Auto-Apply Engine',
    description:
      'Automatically apply to hundreds of matching jobs every day across 500,000+ company career pages — without you lifting a finger.',
    iconColor: 'text-navy',
    iconBg: 'bg-blue-muted',
    stripe: 'bg-blue-accent',
    borderHover: 'hover:border-blue-accent/30 hover:shadow-blue-muted',
  },
  {
    icon: DocumentTextIcon,
    title: 'AI Resume Tailoring',
    description:
      'Every application gets a version of your resume tailored to the job description, improving ATS scores and increasing your visibility.',
    iconColor: 'text-violet-600',
    iconBg: 'bg-violet-50',
    stripe: 'bg-violet-500',
    borderHover: 'hover:border-violet-200 hover:shadow-violet-50',
  },
  {
    icon: ClipboardDocumentListIcon,
    title: 'Job Application Tracker',
    description:
      'A real-time dashboard showing every application — status, company, role, date applied. No more lost-in-the-void guessing.',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    stripe: 'bg-emerald-500',
    borderHover: 'hover:border-emerald-200 hover:shadow-emerald-50',
  },
  {
    icon: ChartBarIcon,
    title: 'Performance Analytics',
    description:
      'See which job titles, companies, and resume versions perform best. Continuously improve your search based on real data.',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50',
    stripe: 'bg-amber-500',
    borderHover: 'hover:border-amber-200 hover:shadow-amber-50',
  },
  {
    icon: EnvelopeIcon,
    title: 'Recruiter Outreach',
    description:
      'Automatically find and email hiring managers at your target companies with a personalised message, putting you ahead of the stack.',
    iconColor: 'text-rose-600',
    iconBg: 'bg-rose-50',
    stripe: 'bg-rose-500',
    borderHover: 'hover:border-rose-200 hover:shadow-rose-50',
  },
  {
    icon: MagnifyingGlassIcon,
    title: 'AI Cover Letter',
    description:
      'Generate a compelling, role-specific cover letter in seconds. Personalised tone, relevant keywords, and always on-brand.',
    iconColor: 'text-sky-600',
    iconBg: 'bg-sky-50',
    stripe: 'bg-sky-500',
    borderHover: 'hover:border-sky-200 hover:shadow-sky-50',
  },
]

export default function Features() {
  return (
    <section id="features" className="bg-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-navy uppercase tracking-widest mb-3">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-4">
            Everything you need to land your dream job
          </h2>
          <p className="text-slate-700 max-w-xl mx-auto font-medium">
            Stop spending hours on repetitive applications. JobsFoundry gives you an unfair advantage
            in your job search.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -60px 0px" }}
              transition={{ delay: i * 0.08, duration: 0.4, ease: 'easeOut' }}
              className={`group relative bg-white border border-slate-200 ${feature.borderHover} rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-200 cursor-default`}
            >
              {/* Colored top stripe */}
              <div className={`h-1.5 w-full ${feature.stripe}`} />

              <div className="p-6">
                <div
                  className={`inline-flex items-center justify-center w-11 h-11 rounded-xl mb-5 ${feature.iconBg} ${feature.iconColor} transition-transform duration-200 group-hover:scale-110`}
                >
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-navy mb-2 group-hover:text-navy-light transition-colors duration-150">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
