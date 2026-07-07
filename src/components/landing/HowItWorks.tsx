'use client'

import { motion } from 'framer-motion'
import { UserCircleIcon, AdjustmentsHorizontalIcon, TrophyIcon } from '@heroicons/react/24/outline'

const STEPS = [
  {
    step: '01',
    icon: UserCircleIcon,
    title: 'Create Your Profile',
    description:
      'Upload your resume, fill in your skills and experience once. JobBlitz uses this to personalise every application on your behalf.',
    accent: 'group-hover:border-blue-accent group-hover:bg-blue-muted',
    numAccent: 'group-hover:bg-blue-accent group-hover:text-white group-hover:border-blue-accent',
  },
  {
    step: '02',
    icon: AdjustmentsHorizontalIcon,
    title: 'Set Your Preferences',
    description:
      'Choose your target roles, locations, salary range, and companies to include or exclude. Your AI copilot will follow your criteria precisely.',
    accent: 'group-hover:border-violet-400 group-hover:bg-violet-50/50',
    numAccent: 'group-hover:bg-violet-500 group-hover:text-white group-hover:border-violet-500',
  },
  {
    step: '03',
    icon: TrophyIcon,
    title: 'Sit Back & Get Interviews',
    description:
      'JobBlitz applies to new matching jobs daily. Track every application in your dashboard and focus on preparing for the interviews that follow.',
    accent: 'group-hover:border-emerald-400 group-hover:bg-emerald-50/50',
    numAccent: 'group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-section-alt py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-blue-accent uppercase tracking-widest mb-3">
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-4">
            Get hired in 3 simple steps
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            From profile to interview in days, not months. Our AI handles the repetitive work
            so you can focus on what matters.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop) */}
          <div
            aria-hidden
            className="hidden md:block absolute top-10 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-blue-200 via-slate-200 to-emerald-200"
          />
          {/* Arrow chevrons */}
          <div
            aria-hidden
            className="hidden md:block absolute top-[34px] left-[calc(33.33%-8px)] text-slate-300 text-lg select-none"
          >›</div>
          <div
            aria-hidden
            className="hidden md:block absolute top-[34px] left-[calc(66.66%-8px)] text-slate-300 text-lg select-none"
          >›</div>

          {STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5, ease: 'easeOut' }}
              className={`group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 p-8 text-center cursor-default ${step.accent}`}
            >
              {/* Step number */}
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-muted border-2 border-blue-accent text-blue-accent font-bold text-sm mb-6 relative z-10 transition-all duration-200 ${step.numAccent}`}
              >
                {step.step}
              </div>

              <step.icon className="w-8 h-8 text-navy mx-auto mb-4 transition-transform duration-200 group-hover:scale-110" />

              <h3 className="text-lg font-bold text-navy mb-3 group-hover:text-blue-accent transition-colors duration-150">
                {step.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
