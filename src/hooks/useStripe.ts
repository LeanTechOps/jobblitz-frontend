import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { ApiPlan } from '@/types/pricing'

export function useStripePricing() {
  return useQuery({
    queryKey: ['stripe', 'pricing'],
    queryFn: () => api.get<ApiPlan[]>('/stripe/pricing'),
    staleTime: 5 * 60 * 1000, // pricing rarely changes — cache for 5 min
  })
}

interface CheckoutArgs {
  stripePriceId: string
  flowType?: string
}

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: (args: CheckoutArgs) =>
      api.post<{ url: string }>('/stripe/create-subscription-session', args),
  })
}
