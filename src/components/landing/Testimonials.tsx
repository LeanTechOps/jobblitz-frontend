'use client'

import { motion } from 'framer-motion'
import { StarIcon } from '@heroicons/react/24/solid'

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer',
    company: 'Joined Stripe',
    avatar: 'PS',
    avatarBg: 'bg-violet-600',
    text: "I applied to over 200 jobs in two weeks without touching a single form. Got 8 interviews and landed my dream role. JobBlitz is genuinely life-changing.",
    accent: 'hover:border-violet-200',
  },
  {
    name: 'Marcus Johnson',
    role: 'Product Manager',
    company: 'Joined Notion',
    avatar: 'MJ',
    avatarBg: 'bg-blue-accent',
    text: "After 3 months of manual applications with no results, I tried JobBlitz. Within the first week I had 5 interview calls scheduled. The AI resume tailoring is next-level.",
    accent: 'hover:border-blue-200',
  },
  {
    name: 'Aisha Patel',
    role: 'Data Analyst',
    company: 'Joined Airbnb',
    avatar: 'AP',
    avatarBg: 'bg-rose-500',
    text: "The job tracker alone is worth it. I finally stopped losing track of where I applied. Paired with auto-apply, I went from 0 callbacks to 12 in a month.",
    accent: 'hover:border-rose-200',
  },
  {
    name: 'Daniel Kim',
    role: 'UX Designer',
    company: 'Joined Figma',
    avatar: 'DK',
    avatarBg: 'bg-emerald-600',
    text: "I was skeptical at first, but the quality of applications JobBlitz sends is really impressive. Every cover letter felt personalised, not generic.",
    accent: 'hover:border-emerald-200',
  },
  {
    name: 'Sophie Chen',
    role: 'Marketing Manager',
    company: 'Joined HubSpot',
    avatar: 'SC',
    avatarBg: 'bg-amber-500',
    text: "I had been searching for 4 months. Two weeks on JobBlitz and I had 3 offers. The recruiter outreach feature found contacts I would never have found on my own.",
    accent: 'hover:border-amber-200',
  },
  {
    name: 'James Okafor',
    role: 'Backend Engineer',
    company: 'Joined Vercel',
    avatar: 'JO',
    avatarBg: 'bg-navy',
    text: "Saved me hundreds of hours. The analytics showed me which job titles got the most responses so I could double down on what worked. Brilliant product.",
    accent: 'hover:border-slate-300',
  },
]

function Stars() {
  return (
    <div className="flex gap-0.5 mb-4">
      {[...Array(5)].map((_, i) => (
        <StarIcon key={i} className="w-4 h-4 text-amber-400" />
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="bg-section-alt py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-blue-accent uppercase tracking-widest mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-4">
            What job seekers are saying
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto mb-6">
            Thousands of professionals have used JobBlitz to find their next role faster.
          </p>
          {/* Rating summary */}
          <div className="inline-flex items-center gap-3 bg-white border border-slate-100 rounded-xl px-5 py-2.5 shadow-sm cursor-default select-none">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="w-4 h-4 text-amber-400" />
              ))}
            </div>
            <span className="text-sm font-bold text-navy">4.9</span>
            <span className="text-slate-300">·</span>
            <span className="text-sm text-slate-500">2,400+ reviews</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45, ease: 'easeOut' }}
              className={`group bg-white border border-slate-100 ${t.accent} rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col cursor-default`}
            >
              <Stars />
              <p className="text-slate-600 text-sm leading-relaxed flex-1 mb-6">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${t.avatarBg} text-white text-xs font-bold flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">{t.name}</p>
                  <p className="text-xs text-slate-400">
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
