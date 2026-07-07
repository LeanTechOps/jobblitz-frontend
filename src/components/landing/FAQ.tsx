'use client'

import { useState } from 'react'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

type Category = 'General' | 'Pricing' | 'Privacy' | 'Results'

interface FAQItem {
  question: string
  answer: string
  category: Category
}

const FAQS: FAQItem[] = [
  {
    category: 'General',
    question: 'How does JobBlitz auto-apply to jobs?',
    answer:
      'JobBlitz scans 500,000+ company career pages daily for new postings that match your preferences. When a match is found, it fills and submits the application form using your profile — exactly like a manual application, just done automatically at scale.',
  },
  {
    category: 'General',
    question: 'Will employers know my application was automated?',
    answer:
      'No. Applications are submitted through standard application flows, indistinguishable from a manual submission. Employers see a normal, complete, personalised application.',
  },
  {
    category: 'General',
    question: 'Can I control which jobs JobBlitz applies to?',
    answer:
      'Absolutely. Set job titles, locations, salary range, seniority level, and specific companies to include or exclude. You can also switch to manual review mode to approve each application before it goes out.',
  },
  {
    category: 'Results',
    question: 'What results can I realistically expect?',
    answer:
      'Users typically see 3× more interview invitations compared to manual applications. Results vary by role and market, but the analytics dashboard helps you continuously optimise — you can A/B test resumes and track which job titles get the most responses.',
  },
  {
    category: 'Results',
    question: 'How long until I start getting interviews?',
    answer:
      "61% of users report receiving an interview request within their first 10 days. The more accurately you configure your preferences, the faster you'll see results.",
  },
  {
    category: 'Pricing',
    question: 'Is there a free plan?',
    answer:
      'Yes — the Starter plan is free forever with 5 auto-applications per day, a basic job tracker, and 1 resume profile. No credit card required to get started.',
  },
  {
    category: 'Pricing',
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Yes — no contracts, no lock-ins. Cancel anytime from your billing settings. You retain access until the end of your current billing period. We also offer a 30-day money-back guarantee on all paid plans.',
  },
  {
    category: 'Privacy',
    question: 'Is my resume and personal data safe?',
    answer:
      "Your data is encrypted in transit and at rest. We never sell your data to third parties. Your information is used solely to run your job search — that's a promise.",
  },
  {
    category: 'Privacy',
    question: 'Do you share my data with employers?',
    answer:
      'Only the information included in your application (resume, cover letter, answers) is shared with employers — nothing else. We never share your account activity, browsing data, or analytics with any third party without your explicit consent.',
  },
]

const CATEGORIES: Category[] = ['General', 'Results', 'Pricing', 'Privacy']

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState<Category>('General')

  const filtered = FAQS.filter((f) => f.category === activeCategory)
  const half = Math.ceil(filtered.length / 2)
  const leftCol = filtered.slice(0, half)
  const rightCol = filtered.slice(half)

  return (
    <section className="bg-section-alt py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-accent uppercase tracking-widest mb-3">
            FAQ
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-4">
            Frequently asked questions
          </h2>
          <p className="text-slate-500 mb-8">
            Still have questions?{' '}
            <a
              href="mailto:hello@jobblitz.ai"
              className="text-blue-accent hover:text-blue-500 hover:underline font-medium transition-colors duration-150 cursor-pointer"
            >
              Contact us
            </a>
          </p>

          {/* Category pills */}
          <div className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1 shadow-sm flex-wrap justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer select-none',
                  activeCategory === cat
                    ? 'bg-navy text-white shadow-sm'
                    : 'text-slate-500 hover:text-navy hover:bg-slate-50 active:scale-95'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Two-column accordion */}
        <div className="grid md:grid-cols-2 gap-4">
          {[leftCol, rightCol].map((col, colIdx) => (
            <div key={colIdx} className="space-y-3">
              {col.map((faq) => (
                <Disclosure key={faq.question} as="div">
                  {({ open }) => (
                    <div
                      className={cn(
                        'bg-white rounded-xl shadow-sm overflow-hidden border transition-all duration-200',
                        open
                          ? 'border-blue-accent/30 shadow-md shadow-blue-50'
                          : 'border-slate-100 hover:border-slate-200 hover:shadow-md'
                      )}
                    >
                      <DisclosureButton className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 hover:bg-slate-50/70 transition-colors duration-150 group cursor-pointer">
                        <span
                          className={cn(
                            'text-sm font-semibold transition-colors duration-150',
                            open ? 'text-blue-accent' : 'text-navy group-hover:text-blue-accent'
                          )}
                        >
                          {faq.question}
                        </span>
                        <div
                          className={cn(
                            'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200',
                            open ? 'bg-blue-accent text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                          )}
                        >
                          <ChevronDownIcon
                            className={cn(
                              'w-3.5 h-3.5 transition-transform duration-200',
                              open && 'rotate-180'
                            )}
                          />
                        </div>
                      </DisclosureButton>
                      <DisclosurePanel className="px-6 pb-5 border-t border-slate-50">
                        <p className="text-sm text-slate-500 leading-relaxed pt-4">{faq.answer}</p>
                      </DisclosurePanel>
                    </div>
                  )}
                </Disclosure>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
