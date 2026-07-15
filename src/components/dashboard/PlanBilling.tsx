'use client'

import { useMemo, useState } from 'react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/context/AuthContext'
import { useStripePricing, useCreateCheckoutSession } from '@/hooks/useStripe'
import { toast } from 'react-toastify'
import type { PlanOption } from '@/types/pricing'

export default function PlanBilling() {
  const { subscription } = useAuth()
  const plan = subscription?.plan ?? 'FORGE'
  const isFreePlan = subscription !== null ? plan === 'FORGE' : false

  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const { data: rawPlans } = useStripePricing()
  const checkout = useCreateCheckoutSession()

  const plans: PlanOption[] = useMemo(() => {
    if (!rawPlans) return []
    const seen = new Set<string>()
    const monthly: PlanOption[] = []
    for (const p of rawPlans) {
      if (p.interval === 'month' && !seen.has(p.id)) {
        seen.add(p.id)
        monthly.push({
          id: p.id,
          name: p.name,
          price: p.price,
          stripePriceId: p.stripePriceId,
          popular: p.popular,
          features: p.features,
        })
      }
    }
    return monthly.sort((a, b) => a.price - b.price)
  }, [rawPlans])

  const handleSubscribe = async (stripePriceId: string, planId: string) => {
    setLoadingPlan(planId)
    try {
      const { url } = await checkout.mutateAsync({ stripePriceId, flowType: 'subscription_update' })
      if (url) window.open(url, '_blank')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoadingPlan(null)
    }
  }

  if (plans.length === 0) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Plan &amp; Billing
        </p>
        {!isFreePlan && (
          <p className="text-xs text-slate-400">
            Changes take effect immediately via the Stripe portal.
          </p>
        )}
      </div>

      <div
        className={`grid gap-4 ${
          plans.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {plans.map((p) => {
          const isCurrent = plan.toLowerCase() === p.id
          const isLoading = loadingPlan === p.id
          const isFree = p.price === 0

          return (
            <div
              key={p.id}
              className={`relative bg-white rounded-2xl border p-6 shadow-sm flex flex-col transition-all duration-200 ${
                isCurrent
                  ? 'border-navy ring-2 ring-navy/20'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {isCurrent && (
                <span className="absolute top-4 right-4 text-[10px] font-bold bg-blue-accent text-navy px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Current
                </span>
              )}

              <div className="mb-4">
                <h3 className="text-base font-bold text-navy mb-1">{p.name}</h3>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-extrabold text-navy">
                    {isFree ? 'Free' : `$${p.price}`}
                  </span>
                  {!isFree && <span className="text-sm text-slate-400 mb-0.5">/mo</span>}
                </div>
              </div>

              <ul className="space-y-2 flex-1 mb-6">
                {p.features.slice(0, 5).map((feat) => (
                  <li key={feat} className="flex items-start gap-2">
                    <CheckIcon className="w-4 h-4 text-navy flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-600 leading-snug">{feat}</span>
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="w-full text-center text-xs font-semibold text-navy bg-blue-muted py-2.5 rounded-lg select-none">
                  Your current plan
                </div>
              ) : (
                <button
                  onClick={() => !isFree && handleSubscribe(p.stripePriceId, p.id)}
                  disabled={isLoading || isFree}
                  className={`w-full text-xs font-semibold py-2.5 rounded-lg transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none ${
                    isFree
                      ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                      : p.price > (plans.find(x => x.id === plan.toLowerCase())?.price ?? 0)
                      ? 'bg-blue-accent hover:bg-blue-accent-hover text-navy font-bold hover:shadow-md'
                      : 'bg-slate-900 hover:bg-slate-700 text-white hover:shadow-md'
                  }`}
                >
                  {isLoading ? (
                    <span className="inline-flex items-center justify-center gap-1.5">
                      <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Redirecting…
                    </span>
                  ) : isFree ? (
                    'Downgrade via support'
                  ) : p.price > (plans.find(x => x.id === plan.toLowerCase())?.price ?? 0) ? (
                    `Upgrade to ${p.name}`
                  ) : (
                    `Switch to ${p.name}`
                  )}
                </button>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-xs text-slate-400 mt-3">
        Upgrades open Stripe Checkout. Plan changes for existing subscribers open the Stripe billing portal.
      </p>
    </div>
  )
}
