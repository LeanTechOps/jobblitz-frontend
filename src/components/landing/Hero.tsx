'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRightIcon, BoltIcon } from '@heroicons/react/24/solid'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

const STATS = [
  { value: '500K+', label: 'Companies reached' },
  { value: '2M+', label: 'Applications sent' },
  { value: '3×', label: 'More interviews' },
]

const TRUST_BULLETS = [
  'No credit card required',
  'Free plan available',
  'Cancel anytime',
]

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.45, ease: 'easeOut' as const },
  }),
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-14 sm:pt-28 sm:pb-16">
      {/* Grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:64px_64px] opacity-30"
      />
      {/* Top glow — lime tinted */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-60 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-gradient-to-br from-blue-muted via-blue-muted/30 to-transparent blur-3xl opacity-70"
      />
      {/* Side accent blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 -left-64 w-[400px] h-[400px] rounded-full bg-blue-muted/50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -right-64 w-[400px] h-[400px] rounded-full bg-blue-muted/40 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Badge */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="inline-flex items-center gap-2 bg-blue-accent text-navy text-xs font-bold px-4 py-1.5 rounded-full mb-8 shadow-md select-none cursor-default"
        >
          <BoltIcon className="w-3.5 h-3.5" />
          AI-powered · Apply to 100+ jobs daily automatically
        </motion.div>

        {/* Headline */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-navy leading-[1.12] mb-5"
        >
          Where Talent Meets Opportunity.
          <br />
          <span className="relative inline-block">
            <span className="text-navy">Your Career, Reimagined.</span>
            <span
              aria-hidden
              className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-blue-accent opacity-70"
            />
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto mb-8 leading-relaxed"
        >
          JobsFoundry finds and applies to jobs across 500,000+ company career pages on your behalf.
          Set your preferences once — our AI handles everything else.
        </motion.p>

        {/* CTAs */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8"
        >
          <Link
            href="/login?plan=forge"
            className="group inline-flex items-center gap-2 bg-blue-accent hover:bg-blue-accent-hover active:scale-95 text-navy font-bold px-8 py-4 rounded-xl transition-all duration-150 shadow-lg hover:shadow-xl text-base cursor-pointer select-none"
          >
            Get Started Free
            <ArrowRightIcon className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 bg-blue-accent hover:bg-blue-accent-hover active:scale-95 text-navy font-bold px-8 py-4 rounded-xl transition-all duration-150 shadow-lg hover:shadow-xl text-base cursor-pointer select-none"
          >
            View Pricing
          </Link>
        </motion.div>

        {/* Trust bullets */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-12"
        >
          {TRUST_BULLETS.map((b) => (
            <span key={b} className="flex items-center gap-1.5 text-sm text-slate-600 font-medium">
              <CheckCircleIcon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              {b}
            </span>
          ))}
        </motion.div>

        {/* Social proof */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex items-center justify-center gap-4 mb-12"
        >
          <div className="flex -space-x-2.5">
            {[
              { bg: 'bg-violet-500', l: 'A' },
              { bg: 'bg-navy', l: 'B' },
              { bg: 'bg-rose-500', l: 'C' },
              { bg: 'bg-emerald-600', l: 'D' },
              { bg: 'bg-amber-500', l: 'E' },
              { bg: 'bg-sky-500', l: 'F' },
            ].map(({ bg, l }, i) => (
              <div
                key={i}
                className={`w-9 h-9 rounded-full ${bg} border-[2.5px] border-white flex items-center justify-center text-white text-xs font-bold select-none shadow-sm`}
              >
                {l}
              </div>
            ))}
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-navy">50,000+ job seekers</p>
            <p className="text-xs text-slate-500">trust JobsFoundry every day</p>
          </div>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          custom={6}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 gap-4 max-w-md mx-auto"
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-white border-2 border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-blue-accent/30 transition-all duration-200 cursor-default"
            >
              <p className="text-2xl font-extrabold text-navy">{stat.value}</p>
              <p className="text-xs font-medium text-slate-600 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
