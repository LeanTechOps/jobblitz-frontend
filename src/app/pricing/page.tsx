'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useStripePricing, useCreateCheckoutSession } from '@/hooks/useStripe'
import { toast } from 'react-toastify'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

interface PlanPriceData {
  monthly?: { price: number; priceId: string }
  annual?: { perMonth: number; total: number; priceId: string }
}

const PLAN_INCLUDES = {
  free: [
    'Up to 5 auto-applications/day',
    '1 resume profile',
    'Basic job tracker',
    'Application status tracking',
    'No credit card required',
  ],
  pro: [
    'Up to 50 auto-applications/day',
    '5 resume profiles',
    'AI resume tailoring per job',
    'AI cover letter generator',
    'Full application analytics',
    'Priority email support',
  ],
  business: [
    'Up to 200 auto-applications/day',
    'Unlimited resume profiles',
    'Everything in Pro',
    'Hiring manager email outreach',
    'A/B testing for job titles',
    'Dedicated account support',
  ],
}

const INCLUDED_IN_ALL_PAID = [
  'Works on all major ATS systems (Workday, Greenhouse, Lever, iCIMS, Taleo and more)',
  'Application status tracking and job tracker dashboard',
  'Resume profile storage',
  '30-day money-back guarantee',
  'Email support',
]

export default function PricingPage() {
  const { isAuthenticated, subscription } = useAuth()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const currentPlan = (subscription?.plan ?? 'FREE').toLowerCase()
  const currentInterval = subscription?.billingCycle === 'YEARLY' ? 'year' : 'month'

  const { data: rawPlans, isLoading: pricesLoading } = useStripePricing()
  const checkout = useCreateCheckoutSession()

  const priceData = useMemo<Record<string, PlanPriceData>>(() => {
    if (!rawPlans) return {}
    const data: Record<string, PlanPriceData> = {}
    for (const plan of rawPlans) {
      if (!data[plan.id]) data[plan.id] = {}
      if (plan.interval === 'month') {
        data[plan.id].monthly = { price: plan.price, priceId: plan.stripePriceId }
      } else if (plan.interval === 'year') {
        data[plan.id].annual = {
          total: plan.price,
          perMonth: Math.round((plan.price / 12) * 100) / 100,
          priceId: plan.stripePriceId,
        }
      }
    }
    return data
  }, [rawPlans])

  const handleSelectPlan = async (planId: string, priceId?: string) => {
    if (planId === 'free') {
      window.location.href = isAuthenticated ? '/dashboard' : '/login?plan=free'
      return
    }
    if (!isAuthenticated) {
      window.location.href = `/login?plan=${planId}`
      return
    }
    if (!priceId) {
      toast.error('This plan is not yet available. Please try again later.')
      return
    }
    setLoadingPlan(priceId)
    try {
      const { url } = await checkout.mutateAsync({ stripePriceId: priceId })
      window.location.href = url
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally { setLoadingPlan(null) }
  }

  const [annual, setAnnual] = useState(false)
  const hasAnyAnnual = !pricesLoading && Object.values(priceData).some(p => p.annual != null)
  const isCurrent = (planId: string, interval: 'month' | 'year' = 'month') =>
    currentPlan === planId && currentInterval === interval

  const PriceSkeleton = () => (
    <span className="inline-block w-20 h-7 bg-slate-200 rounded-lg animate-pulse align-middle" />
  )

  const plans = [
    {
      id: 'free',
      name: 'Free',
      badge: null as string | null,
      description: 'Start applying automatically, no credit card needed.',
      stripe: 'bg-slate-400',
      accent: 'text-slate-700',
      btnCls: 'bg-slate-900 hover:bg-slate-700 text-white',
      cardCls: 'border-slate-200',
      features: PLAN_INCLUDES.free,
      monthly: 0,
      annualPerMonth: null as number | null,
      annualTotal: null as number | null,
      monthlyPriceId: undefined as string | undefined,
      annualPriceId: undefined as string | undefined,
    },
    {
      id: 'pro',
      name: 'Pro',
      badge: 'Most popular',
      description: 'For active job seekers who want real results fast.',
      stripe: 'bg-blue-accent',
      accent: 'text-navy',
      btnCls: 'bg-blue-accent hover:bg-blue-accent-hover text-navy font-bold shadow-lg',
      cardCls: 'border-navy ring-2 ring-navy/20',
      features: PLAN_INCLUDES.pro,
      monthly: priceData.pro?.monthly?.price ?? 9.99,
      annualPerMonth: priceData.pro?.annual?.perMonth ?? null,
      annualTotal: priceData.pro?.annual?.total ?? null,
      monthlyPriceId: priceData.pro?.monthly?.priceId,
      annualPriceId: priceData.pro?.annual?.priceId,
    },
    {
      id: 'business',
      name: 'Business',
      badge: null,
      description: 'Max volume, outreach automation, and A/B testing.',
      stripe: 'bg-navy',
      accent: 'text-navy',
      btnCls: 'bg-blue-accent hover:bg-blue-accent-hover text-navy',
      cardCls: 'border-slate-200',
      features: PLAN_INCLUDES.business,
      monthly: priceData.business?.monthly?.price ?? 25,
      annualPerMonth: priceData.business?.annual?.perMonth ?? null,
      annualTotal: priceData.business?.annual?.total ?? null,
      monthlyPriceId: priceData.business?.monthly?.priceId,
      annualPriceId: priceData.business?.annual?.priceId,
    },
  ]

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-white pt-16">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

          {/* Header — same size as landing page section headers */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-navy mb-4">
              Every plan, real numbers.
            </h1>
            <p className="text-slate-700 font-medium max-w-xl mx-auto leading-relaxed">
              No &ldquo;contact us&rdquo; for paid plans. No hidden fees. Cancel anytime.
            </p>
          </div>

          {/* Monthly / Annual toggle */}
          {hasAnyAnnual && (
            <div className="flex items-center justify-center gap-4 mb-10">
              <span className={`text-sm font-semibold ${!annual ? 'text-navy' : 'text-slate-500'}`}>Monthly</span>
              <button
                onClick={() => setAnnual(a => !a)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer ${annual ? 'bg-navy' : 'bg-slate-200'}`}
              >
                <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${annual ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <span className={`text-sm font-semibold ${annual ? 'text-navy' : 'text-slate-500'}`}>Annually</span>
              {annual && (
                <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
                  Save up to 30%
                </span>
              )}
            </div>
          )}

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {plans.filter(plan => {
              if (!annual) return true
              if (plan.id === 'free') return true
              return plan.annualPerMonth != null
            }).map(plan => {
              const showAnnual = annual && plan.annualPerMonth != null
              const priceId = showAnnual ? plan.annualPriceId : plan.monthlyPriceId
              const interval = showAnnual ? 'year' : 'month'
              const displayPrice = showAnnual ? plan.annualPerMonth! : plan.monthly

              return (
                <div
                  key={plan.id}
                  className={`relative bg-white border-2 ${plan.cardCls} rounded-2xl overflow-hidden shadow-sm flex flex-col`}
                >
                  <div className={`h-1.5 w-full ${plan.stripe}`} />

                  <div className="p-7 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-lg font-extrabold text-navy">{plan.name}</h2>
                      {plan.badge && (
                        <span className="text-[10px] font-bold bg-blue-accent text-navy px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-slate-600 mb-6 leading-relaxed">{plan.description}</p>

                    {/* Price */}
                    <div className="mb-7">
                      <div className="flex items-end gap-1">
                        {pricesLoading && plan.id !== 'free' ? (
                          <span className="inline-block w-20 h-8 bg-slate-200 rounded-lg animate-pulse" />
                        ) : (
                          <>
                            <span className="text-4xl font-extrabold text-navy">
                              {plan.id === 'free' ? '$0' : `$${displayPrice}`}
                            </span>
                            <span className="text-base font-semibold text-slate-500 mb-1 ml-1">
                              {plan.id === 'free' ? 'forever' : '/mo'}
                            </span>
                          </>
                        )}
                      </div>
                      {showAnnual && plan.annualTotal && (
                        <p className="text-sm font-semibold text-emerald-600 mt-1">
                          Billed ${plan.annualTotal}/yr · Save ${Math.round((plan.monthly - plan.annualPerMonth!) * 12)}/yr
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-start gap-2.5 text-sm font-medium text-slate-800">
                          <CheckCircleIcon className={`flex-shrink-0 mt-0.5 ${plan.accent}`} style={{ width: 18, height: 18 }} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <button
                      onClick={() => handleSelectPlan(plan.id, priceId)}
                      disabled={isCurrent(plan.id, interval) || loadingPlan === priceId}
                      className={`w-full text-sm font-bold px-4 py-3 rounded-xl transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${plan.btnCls}`}
                    >
                      {loadingPlan === priceId ? (
                        <span className="inline-flex items-center justify-center gap-1.5">
                          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Loading…
                        </span>
                      ) : isCurrent(plan.id, interval) ? 'Current plan'
                        : plan.id === 'free' ? 'Get Started Free'
                        : plan.id === 'pro' ? 'Start Pro'
                        : 'Start Business'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Included in every paid plan */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-navy mb-2">Included in every paid plan</h2>
            <p className="text-slate-700 text-sm font-medium mb-6">These come with Pro and Business at no extra charge.</p>
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              {INCLUDED_IN_ALL_PAID.map((item, i) => (
                <div
                  key={item}
                  className={`flex items-start gap-3 px-6 py-4 border-b border-slate-100 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}
                >
                  <CheckCircleIcon className="text-navy flex-shrink-0 mt-0.5" style={{ width: 18, height: 18 }} />
                  <span className="text-sm font-medium text-slate-800">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Billing notes */}
          <div className="border-t border-slate-200 pt-10 text-sm text-slate-700 space-y-2 leading-relaxed">
            <p>
              Billing terms, taxes and renewals are documented in{' '}
              <Link href="#" className="text-navy font-semibold hover:underline">pricing &amp; billing</Link>;
              refunds in the{' '}
              <Link href="#" className="text-navy font-semibold hover:underline">refund policy</Link>.
            </p>
            <p>
              Questions?{' '}
              <Link href="/#faq" className="text-navy font-semibold hover:underline">See the FAQ</Link>
              {' '}or email{' '}
              <a href="mailto:hello@jobblitz.ai" className="text-navy font-semibold hover:underline">hello@jobblitz.ai</a>
            </p>
          </div>

        </main>
        <Footer />
      </div>
    </>
  )
}
