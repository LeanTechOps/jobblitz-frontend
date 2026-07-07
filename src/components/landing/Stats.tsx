'use client'

import { motion } from 'framer-motion'

const STATS = [
  {
    value: '78%',
    label: 'of users land interviews',
    context: 'within the first 3 months of using JobBlitz.',
  },
  {
    value: '40%',
    label: 'less time spent searching',
    context: 'We cut the average 5-month search down to under 3.',
  },
  {
    value: '200×',
    label: 'return on investment',
    context: 'Time saved equals $20K+; offers average a $30K salary jump.',
  },
  {
    value: '50K+',
    label: 'active job seekers',
    context: 'Trust JobBlitz to automate their applications every day.',
  },
]

export default function Stats() {
  return (
    <section className="bg-navy py-20 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-blue-accent uppercase tracking-widest mb-3">
            Undeniable proof
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Numbers that speak for themselves
          </h2>
          <p className="text-blue-200 max-w-xl mx-auto">
            We don&apos;t make vague promises. Here&apos;s what our users actually experience.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.value}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.45, ease: 'easeOut' }}
              className="text-center group cursor-default"
            >
              <p className="text-5xl sm:text-6xl font-extrabold text-white mb-2 leading-none transition-transform duration-200 group-hover:scale-105">
                {stat.value}
              </p>
              <p className="text-blue-accent font-semibold text-base mb-2 group-hover:text-blue-300 transition-colors duration-150">{stat.label}</p>
              <p className="text-blue-200/70 text-sm leading-relaxed">{stat.context}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
