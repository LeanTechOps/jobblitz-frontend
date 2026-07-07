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
    iconColor: 'text-blue-accent',
    iconBg: 'bg-blue-muted',
    hoverBg: 'group-hover:bg-blue-accent group-hover:text-white',
    borderHover: 'hover:border-blue-200',
  },
  {
    icon: DocumentTextIcon,
    title: 'AI Resume Tailoring',
    description:
      'Every application gets a version of your resume tailored to the job description, improving ATS scores and increasing your visibility.',
    iconColor: 'text-violet-600',
    iconBg: 'bg-violet-50',
    hoverBg: 'group-hover:bg-violet-600 group-hover:text-white',
    borderHover: 'hover:border-violet-200',
  },
  {
    icon: ClipboardDocumentListIcon,
    title: 'Job Application Tracker',
    description:
      'A real-time dashboard showing every application — status, company, role, date applied. No more lost-in-the-void guessing.',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    hoverBg: 'group-hover:bg-emerald-600 group-hover:text-white',
    borderHover: 'hover:border-emerald-200',
  },
  {
    icon: ChartBarIcon,
    title: 'Performance Analytics',
    description:
      'See which job titles, companies, and resume versions perform best. Continuously improve your search based on real data.',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50',
    hoverBg: 'group-hover:bg-amber-600 group-hover:text-white',
    borderHover: 'hover:border-amber-200',
  },
  {
    icon: EnvelopeIcon,
    title: 'Recruiter Outreach',
    description:
      'Automatically find and email hiring managers at your target companies with a personalised message, putting you ahead of the stack.',
    iconColor: 'text-rose-600',
    iconBg: 'bg-rose-50',
    hoverBg: 'group-hover:bg-rose-600 group-hover:text-white',
    borderHover: 'hover:border-rose-200',
  },
  {
    icon: MagnifyingGlassIcon,
    title: 'AI Cover Letter',
    description:
      'Generate a compelling, role-specific cover letter in seconds. Personalised tone, relevant keywords, and always on-brand.',
    iconColor: 'text-sky-600',
    iconBg: 'bg-sky-50',
    hoverBg: 'group-hover:bg-sky-600 group-hover:text-white',
    borderHover: 'hover:border-sky-200',
  },
]

export default function Features() {
  return (
    <section id="features" className="bg-white py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-blue-accent uppercase tracking-widest mb-3">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-4">
            Everything you need to land your dream job
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Stop spending hours on repetitive applications. JobBlitz gives you an unfair advantage
            in your job search.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45, ease: 'easeOut' }}
              className={`group bg-white border border-slate-100 ${feature.borderHover} rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-default`}
            >
              {/* Icon wrapper — fills with color on hover */}
              <div
                className={`inline-flex items-center justify-center w-11 h-11 rounded-xl mb-5 transition-all duration-200 ${feature.iconBg} ${feature.iconColor} ${feature.hoverBg}`}
              >
                <feature.icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              </div>
              <h3 className="text-base font-bold text-navy mb-2 group-hover:text-blue-accent transition-colors duration-150">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
