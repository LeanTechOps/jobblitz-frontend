/** Shape returned by GET /stripe/pricing */
export interface ApiPlan {
  id: string          // 'forge' | 'craft' | 'launch' | 'momentum'
  name: string
  price: number
  interval: string    // 'month' | 'year'
  stripePriceId: string
  popular: boolean
  features: string[]
}

/** Normalised monthly-only plan used by dashboard & billing UI */
export interface PlanOption {
  id: string
  name: string
  price: number       // monthly amount in USD
  stripePriceId: string
  popular: boolean
  features: string[]
}
