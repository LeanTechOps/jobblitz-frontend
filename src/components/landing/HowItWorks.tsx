'use client'

import { motion } from 'framer-motion'

import { UserCircleIcon, AdjustmentsHorizontalIcon, TrophyIcon } from '@heroicons/react/24/outline'

const STEPS = [
  {
    step: '01',
    icon: UserCircleIcon,
    title: 'Create Your Profile',
    description:
      'Upload your resume, fill in your skills and experience once. JobsFoundry uses this to personalise every application on your behalf.',
    num: 'bg-blue-accent text-navy border-blue-accent',
    card: 'hover:border-blue-accent/30 hover:shadow-blue-muted',
    iconColor: 'text-navy',
    glow: 'hover:shadow-blue-muted',
  },
  {
    step: '02',
    icon: AdjustmentsHorizontalIcon,
    title: 'Set Your Preferences',
    description:
      'Choose your target roles, locations, salary range, and companies to include or exclude. Your AI copilot follows your criteria precisely.',
    num: 'bg-violet-500 text-white border-violet-500',
    card: 'hover:border-violet-300 hover:shadow-violet-100',
    iconColor: 'text-violet-600',
    glow: 'hover:shadow-violet-100',
  },
  {
    step: '03',
    icon: TrophyIcon,
    title: 'Sit Back & Get Interviews',
    description:
      'JobsFoundry applies to new matching jobs daily. Track every application in your dashboard and focus on preparing for the interviews that follow.',
    num: 'bg-emerald-500 text-white border-emerald-500',
    card: 'hover:border-emerald-300 hover:shadow-emerald-100',
    iconColor: 'text-emerald-600',
    glow: 'hover:shadow-emerald-100',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-gradient-to-b from-blue-muted/40 via-blue-muted/20 to-white py-12 sm:py-16 overflow-hidden">
      {/* Decorative blobs */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-blue-muted/50 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-violet-200/20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-navy uppercase tracking-widest mb-3">
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-4">
            Get hired in 3 simple steps
          </h2>
          <p className="text-slate-700 max-w-xl mx-auto font-medium">
            From profile to interview in days, not months. Our AI handles the repetitive work
            so you can focus on what matters.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div
            aria-hidden
            className="hidden md:block absolute top-10 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 bg-gradient-to-r from-blue-accent/60 via-violet-300 to-emerald-300"
          />
          <div aria-hidden className="hidden md:block absolute top-[35px] left-[calc(33.33%-10px)] text-violet-300 text-xl select-none font-bold">›</div>
          <div aria-hidden className="hidden md:block absolute top-[35px] left-[calc(66.66%-10px)] text-emerald-300 text-xl select-none font-bold">›</div>

          {STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -60px 0px" }}
              transition={{ delay: i * 0.15, duration: 0.4, ease: 'easeOut' }}
              className={`group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-200 p-8 text-center cursor-default ${step.card}`}
            >
              {/* Colored top stripe */}
              <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${step.num.split(' ')[0]}`} />

              {/* Step number */}
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-full border-2 font-bold text-sm mb-6 relative z-10 ${step.num}`}
              >
                {step.step}
              </div>

              <step.icon className={`w-8 h-8 mx-auto mb-4 ${step.iconColor} transition-transform duration-200 group-hover:scale-110`} />

              <h3 className="text-lg font-bold text-navy mb-3">
                {step.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
