import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export interface Job {
  id: string
  title: string
  company: string
  companyDomain: string | null
  location: string | null
  workMode: string
  type: string
  experienceLevel: string
  status: string
  skills: string[]
  visaSponsorship: boolean
  salaryMin: number | null
  salaryMax: number | null
  salaryCurrency: string
  salaryNegotiable: boolean
  applicationUrl: string | null
  closesAt: string | null
  createdAt: string
  postedBy: { id: string; firstName: string | null; lastName: string | null; email: string } | null
}

export interface JobsResponse {
  data: Job[]
  total: number
  page: number
  totalPages: number
}

export interface JobFilters {
  page?: number
  limit?: number
  search?: string
  status?: string
  type?: string
  workMode?: string
  experienceLevel?: string
  skill?: string
  visaSponsorship?: boolean
}

function buildParams(filters: JobFilters) {
  const p = new URLSearchParams()
  if (filters.page) p.set('page', String(filters.page))
  if (filters.limit) p.set('limit', String(filters.limit))
  if (filters.search) p.set('search', filters.search)
  if (filters.status) p.set('status', filters.status)
  if (filters.type) p.set('type', filters.type)
  if (filters.workMode) p.set('workMode', filters.workMode)
  if (filters.experienceLevel) p.set('experienceLevel', filters.experienceLevel)
  if (filters.skill) p.set('skill', filters.skill)
  if (filters.visaSponsorship !== undefined) p.set('visaSponsorship', String(filters.visaSponsorship))
  return p.toString()
}

export function useJobs(filters: JobFilters = {}) {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => api.get<JobsResponse>(`/jobs?${buildParams(filters)}`),
  })
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ['jobs', id],
    queryFn: () => api.get<Job>(`/jobs/${id}`),
    enabled: !!id,
  })
}

export function useDeleteJob() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/jobs/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobs'] }),
  })
}

export function useCreateJob() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.post('/jobs', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobs'] }),
  })
}

export function useUpdateJob(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.patch(`/jobs/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['jobs'] })
      qc.invalidateQueries({ queryKey: ['jobs', id] })
    },
  })
}
