'use client'

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

const FAQS = [
  {
    question: 'How does JobsFoundry auto-apply to jobs?',
    answer:
      'JobsFoundry scans 500,000+ company career pages daily for new postings that match your preferences. When a match is found, it fills and submits the application form using your profile — exactly like a manual application, just done automatically at scale.',
  },
  {
    question: 'Will employers know my application was automated?',
    answer:
      'No. Applications are submitted through standard application flows, indistinguishable from a manual submission. Employers see a normal, complete, personalised application.',
  },
  {
    question: 'Can I control which jobs JobsFoundry applies to?',
    answer:
      'Absolutely. Set job titles, locations, salary range, seniority level, and specific companies to include or exclude. You can also switch to manual review mode to approve each application before it goes out.',
  },
  {
    question: 'What results can I realistically expect?',
    answer:
      'Users typically see 3× more interview invitations compared to manual applications. Results vary by role and market, but the analytics dashboard helps you continuously optimise — you can A/B test resumes and track which job titles get the most responses.',
  },
  {
    question: 'How long until I start getting interviews?',
    answer:
      "61% of users report receiving an interview request within their first 10 days. The more accurately you configure your preferences, the faster you'll see results.",
  },
  {
    question: 'Is there a free plan?',
    answer:
      'Yes — the Forge (Free) plan gives you 1 application per day, a basic job tracker, and 1 resume profile. No credit card required to get started.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Yes — no contracts, no lock-ins. Cancel anytime from your billing settings. You retain access until the end of your current billing period.',
  },
  {
    question: 'Is my resume and personal data safe?',
    answer:
      "Your data is encrypted in transit and at rest. We never sell your data to third parties. Your information is used solely to run your job search — that's a promise.",
  },
  {
    question: 'Do you share my data with employers?',
    answer:
      'Only the information included in your application (resume, cover letter, answers) is shared with employers — nothing else. We never share your account activity, browsing data, or analytics with any third party without your explicit consent.',
  },
]

export default function FAQ() {
  return (
    <section id="faq" className="bg-gradient-to-b from-white to-blue-muted/30 py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-navy uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy mb-4">
            We know you have questions
          </h2>
          <p className="text-slate-700 font-medium">
            95% of questions answered here. Can&apos;t find what you&apos;re looking for?{' '}
            <a
              href="mailto:hello@jobsfoundry.ai"
              className="text-navy font-semibold hover:text-navy-light hover:underline transition-colors duration-150"
            >
              Email us
            </a>
          </p>
        </div>

        {/* FAQ list */}
        <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
          {FAQS.map((faq) => (
            <Disclosure key={faq.question} as="div">
              {({ open }) => (
                <>
                  <DisclosureButton
                    className={cn(
                      'w-full flex items-center justify-between px-6 py-5 text-left gap-6 transition-colors duration-150 cursor-pointer group',
                      open ? 'bg-blue-muted/40' : 'hover:bg-slate-50'
                    )}
                  >
                    <span
                      className={cn(
                        'text-sm sm:text-base font-semibold transition-colors duration-150 leading-snug',
                        open ? 'text-navy' : 'text-slate-800 group-hover:text-navy'
                      )}
                    >
                      {faq.question}
                    </span>
                    <span
                      className={cn(
                        'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200',
                        open
                          ? 'bg-blue-accent text-navy'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                      )}
                    >
                      {open
                        ? <MinusIcon className="w-3.5 h-3.5" />
                        : <PlusIcon className="w-3.5 h-3.5" />
                      }
                    </span>
                  </DisclosureButton>

                  <DisclosurePanel className="px-6 pb-6 pt-1 bg-blue-muted/20">
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <p className="text-slate-600 text-sm">
            Still have questions?{' '}
            <a
              href="mailto:hello@jobsfoundry.ai"
              className="text-navy font-semibold hover:underline"
            >
              hello@jobsfoundry.ai
            </a>
          </p>
        </div>

      </div>
    </section>
  )
}
