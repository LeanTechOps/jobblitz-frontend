'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRightIcon, PlayIcon } from '@heroicons/react/24/solid'

const STATS = [
  { value: '500K+', label: 'Companies reached' },
  { value: '2M+', label: 'Applications sent' },
  { value: '3×', label: 'More interviews' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-28 pb-20 sm:pt-36 sm:pb-28">
      {/* Subtle background grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:64px_64px] opacity-40"
      />
      {/* Radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-blue-50 blur-3xl opacity-60"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="inline-flex items-center gap-2 bg-blue-muted border border-blue-200 text-blue-accent text-xs font-semibold px-3.5 py-1.5 rounded-full mb-8 cursor-default select-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-accent animate-pulse" />
          Now powered by AI — smarter applications, better matches
        </motion.div>

        {/* Headline */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-navy leading-[1.1] mb-6"
        >
          Apply to 100+ Jobs Daily,
          <br />
          <span className="text-blue-accent">Automatically</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          JobBlitz finds and applies to jobs across 500,000+ company career pages on your behalf.
          Set your preferences once — let AI handle the rest.
        </motion.p>

        {/* CTAs */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14"
        >
          <Link
            href="/login?plan=free"
            className="group inline-flex items-center gap-2 bg-blue-accent hover:bg-blue-500 active:scale-95 text-white font-semibold px-6 py-3.5 rounded-lg transition-all duration-150 shadow-lg shadow-blue-100 hover:shadow-xl hover:shadow-blue-100 cursor-pointer select-none"
          >
            Get Started Free
            <ArrowRightIcon className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/#how-it-works"
            className="group inline-flex items-center gap-2 bg-white hover:bg-slate-50 active:scale-95 text-navy font-semibold px-6 py-3.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-all duration-150 cursor-pointer select-none"
          >
            <PlayIcon className="w-4 h-4 text-blue-accent transition-transform duration-150 group-hover:scale-110" />
            See How It Works
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex items-center justify-center gap-3 mb-12"
        >
          {/* Mini avatar stack */}
          <div className="flex -space-x-2">
            {['bg-violet-500','bg-blue-accent','bg-rose-500','bg-emerald-600','bg-amber-500'].map((bg, i) => (
              <div
                key={i}
                className={`w-7 h-7 rounded-full ${bg} border-2 border-white flex items-center justify-center text-white text-[10px] font-bold select-none`}
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-400">
            <span className="text-slate-700 font-semibold">50,000+</span> job seekers trust JobBlitz
            {' '}· <span className="text-slate-500">no credit card</span>
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 gap-4 max-w-lg mx-auto"
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-slate-200 transition-all duration-200 cursor-default"
            >
              <p className="text-2xl font-extrabold text-navy">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
