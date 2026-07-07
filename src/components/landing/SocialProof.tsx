'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { StarIcon } from '@heroicons/react/24/solid'

const FEATURED = [
  {
    badge: 'GOT 8 INTERVIEWS IN 2 WEEKS',
    quote: (
      <>
        You should focus on what matters the most —{' '}
        <span className="text-blue-accent font-bold">Interview Prep</span>, and let{' '}
        <span className="text-blue-accent font-bold">JobBlitz handle the rest</span>.
        I applied to 200+ jobs without touching a single form.
      </>
    ),
    name: 'Priya Sharma',
    role: 'Software Engineer',
    company: 'Joined Stripe',
    avatar: 'https://i.pravatar.cc/300?img=47',
    stars: 5,
  },
  {
    badge: 'LANDED 3 OFFERS IN 2 WEEKS',
    quote: (
      <>
        After 4 months of manual searching, JobBlitz got me{' '}
        <span className="text-blue-accent font-bold">3 offers in 14 days</span>. The{' '}
        <span className="text-blue-accent font-bold">recruiter outreach</span> found contacts I
        never would have found on my own. Completely changed my job search.
      </>
    ),
    name: 'Sophie Chen',
    role: 'Marketing Manager',
    company: 'Joined HubSpot',
    avatar: 'https://i.pravatar.cc/300?img=25',
    stars: 5,
  },
]

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <StarIcon key={i} className={`w-4 h-4 ${i < count ? 'text-amber-400' : 'text-slate-200'}`} />
      ))}
    </div>
  )
}

export default function SocialProof() {
  return (
    <section className="bg-slate-50 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-blue-accent uppercase tracking-widest mb-3">
            Real results
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-3">
            Hear it from job seekers like you
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Thousands hired. Zero forms filled manually.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {FEATURED.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -60px 0px' }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: 'easeOut' }}
              className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col sm:flex-row"
            >
              {/* Text side */}
              <div className="flex-1 p-8 sm:p-10 flex flex-col justify-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 mb-5 w-fit">
                  <span className="w-2 h-2 rounded-full bg-blue-accent animate-pulse" />
                  <span className="text-xs font-bold text-blue-accent tracking-widest uppercase">
                    {f.badge}
                  </span>
                </div>

                {/* Quote */}
                <blockquote className="text-xl sm:text-2xl font-semibold text-navy leading-snug mb-6">
                  &ldquo;{f.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-px h-10 bg-slate-200" />
                  <div>
                    <p className="text-sm font-bold text-navy">{f.name}</p>
                    <p className="text-xs text-slate-500">{f.role} · {f.company}</p>
                  </div>
                  <div className="ml-2">
                    <StarRow count={f.stars} />
                  </div>
                </div>
              </div>

              {/* Photo side */}
              <div className="sm:w-64 lg:w-80 flex-shrink-0 bg-slate-100 relative overflow-hidden min-h-[220px] sm:min-h-0">
                <Image
                  src={f.avatar}
                  alt={f.name}
                  fill
                  className="object-cover object-top grayscale hover:grayscale-0 transition-all duration-500"
                  unoptimized
                />
                {/* Subtle overlay to blend into card */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
