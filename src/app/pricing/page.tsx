'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/api'
import { toast } from 'react-toastify'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

interface StripePlan {
  id: string
  stripePriceId: string
}

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    monthly: 'Free',
    annual: '—',
    includes: '5 auto-applications/day. Basic tracker. No credit card.',
    popular: false,
    cta: 'Get Started',
  },
  {
    id: 'pro',
    name: 'Pro',
    monthly: '$29/mo',
    annual: '$19/mo',
    includes: '50 applications/day. AI resume tailoring, cover letter generator, full analytics.',
    popular: true,
    cta: 'Start Pro',
  },
  {
    id: 'business',
    name: 'Business',
    monthly: '$79/mo',
    annual: '$55/mo',
    includes: '200 applications/day. Everything in Pro, plus hiring manager outreach, A/B testing and API access.',
    popular: false,
    cta: 'Start Business',
  },
]

const WHATS_INCLUDED = [
  'Works on all major ATS systems (Workday, Greenhouse, Lever, iCIMS, Taleo and more)',
  'Application status tracking and job tracker dashboard',
  'Resume profile storage',
  '30-day money-back guarantee',
  'Email support',
]

export default function PricingPage() {
  const { isAuthenticated, subscription } = useAuth()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [stripePlans, setStripePlans] = useState<StripePlan[]>([])
  const currentPlan = (subscription?.plan ?? 'FREE').toLowerCase()

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plans = await api.get<StripePlan[]>('/stripe/pricing')
        setStripePlans(plans)
      } catch {
        // pricing UI still visible; checkout will surface an error if user tries to subscribe
      }
    }
    fetchPlans()
  }, [])

  const handleSelectPlan = async (planId: string) => {
    if (planId === 'free') {
      window.location.href = isAuthenticated ? '/dashboard' : '/login'
      return
    }
    if (!isAuthenticated) {
      window.location.href = '/login'
      return
    }
    const match = stripePlans.find((p) => p.id === planId)
    if (!match?.stripePriceId) {
      toast.error('This plan is not yet available. Please try again later.')
      return
    }
    setLoadingPlan(planId)
    try {
      const { url } = await api.post<{ url: string }>('/stripe/create-subscription-session', {
        stripePriceId: match.stripePriceId,
      })
      window.location.href = url
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-white pt-16">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">

          {/* Page header */}
          <div className="mb-16">
            <p className="text-sm font-semibold text-blue-accent uppercase tracking-widest mb-4">
              Pricing
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-navy mb-5 leading-tight">
              Every plan, real numbers.
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
              No &quot;contact us&quot; for paid plans. No login required to see what you&apos;re paying for.
              Prices are charged in USD. Annual prices shown when billed yearly.
            </p>
          </div>

          {/* ── Section: Auto-Apply Plans ─────────────────────────── */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-navy mb-2">Auto-Apply Plans</h2>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-2xl">
              JobBlitz applies to jobs on your behalf across 500,000+ company career pages — filled, submitted,
              and tracked automatically. Choose the volume that fits your search.
            </p>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[160px_110px_110px_1fr_140px] bg-slate-50 border-b border-slate-200">
                <div className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Plan</div>
                <div className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly</div>
                <div className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Annual</div>
                <div className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Includes</div>
                <div className="px-5 py-3" />
              </div>

              {/* Rows */}
              {PLANS.map((plan) => {
                const isCurrent = currentPlan === plan.id
                const isLoading = loadingPlan === plan.id

                return (
                  <div
                    key={plan.id}
                    className={`grid grid-cols-[160px_110px_110px_1fr_140px] items-start border-b border-slate-100 last:border-0 transition-colors duration-150 ${
                      plan.popular ? 'bg-blue-50/60' : 'bg-white hover:bg-slate-50/60'
                    }`}
                  >
                    {/* Plan name */}
                    <div className="px-5 py-5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-navy text-sm">{plan.name}</span>
                        {plan.popular && (
                          <span className="text-[10px] font-bold bg-blue-accent text-white px-2 py-0.5 rounded-full uppercase tracking-wide">
                            Popular
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Monthly price */}
                    <div className="px-5 py-5">
                      <span className={`text-sm font-semibold ${plan.popular ? 'text-blue-accent' : 'text-navy'}`}>
                        {plan.monthly}
                      </span>
                    </div>

                    {/* Annual price */}
                    <div className="px-5 py-5">
                      <span className="text-sm text-slate-500">{plan.annual}</span>
                    </div>

                    {/* Includes */}
                    <div className="px-5 py-5">
                      <span className="text-sm text-slate-600 leading-relaxed">{plan.includes}</span>
                    </div>

                    {/* CTA */}
                    <div className="px-5 py-4">
                      <button
                        onClick={() => handleSelectPlan(plan.id)}
                        disabled={isCurrent || isLoading}
                        className={`w-full text-xs font-semibold px-4 py-2.5 rounded-lg transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none ${
                          plan.popular
                            ? 'bg-blue-accent hover:bg-blue-500 text-white shadow-sm hover:shadow-md'
                            : 'bg-navy hover:bg-slate-800 text-white'
                        }`}
                      >
                        {isLoading ? (
                          <span className="inline-flex items-center justify-center gap-1.5">
                            <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            …
                          </span>
                        ) : isCurrent ? 'Current' : plan.cta}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <p className="text-xs text-slate-400 mt-3">
              Annual billing saves up to 34%. You can switch between monthly and annual at any time.
            </p>
          </section>

          {/* ── Section: Included in every paid plan ─────────────── */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-navy mb-2">Included in every paid plan</h2>
            <p className="text-slate-500 text-sm mb-8">
              These come with Pro and Business at no extra charge.
            </p>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              {WHATS_INCLUDED.map((item, i) => (
                <div
                  key={item}
                  className={`flex items-start gap-3 px-5 py-4 border-b border-slate-100 last:border-0 ${
                    i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                  }`}
                >
                  <span className="text-blue-accent font-bold text-sm mt-px select-none">✓</span>
                  <span className="text-sm text-slate-600">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── Billing notes — drivetube style ──────────────────── */}
          <div className="border-t border-slate-200 pt-10 text-sm text-slate-500 space-y-2 leading-relaxed">
            <p>
              Billing terms, taxes and renewals are documented in{' '}
              <Link href="#" className="text-blue-accent hover:underline">pricing &amp; billing</Link>;
              refunds in the{' '}
              <Link href="#" className="text-blue-accent hover:underline">refund policy</Link>.
            </p>
            <p>
              Questions?{' '}
              <Link href="/#faq" className="text-blue-accent hover:underline">See the FAQ</Link>
              {' '}or email{' '}
              <a href="mailto:hello@jobblitz.ai" className="text-blue-accent hover:underline">
                hello@jobblitz.ai
              </a>
            </p>
          </div>

        </main>
        <Footer />
      </div>
    </>
  )
}
