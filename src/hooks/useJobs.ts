import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import axios from 'axios'

export interface Job {
  id: string
  title: string
  company: string
  companyDomain: string | null
  companyLogoKey: string | null
  companyLogoUrl: string | null
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
  salaryPeriod: string
  salaryNegotiable: boolean
  description: string
  responsibilities: string | null
  requirements: string | null
  benefits: string | null
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

// ── Logo ─────────────────────────────────────────────────────

export function useJobLogoUrl(jobId: string, enabled: boolean) {
  return useQuery({
    queryKey: ['jobs', jobId, 'logo'],
    queryFn: () => api.get<{ logoUrl: string | null }>(`/jobs/${jobId}/logo/url`),
    enabled,
    staleTime: 50 * 60 * 1000,
  })
}

export function useUploadJobLogo(jobId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (file: File) => {
      // Step 1 — presigned PUT URL
      const { uploadUrl, logoKey } = await api.post<{ uploadUrl: string; logoKey: string }>(
        `/jobs/${jobId}/logo/initiate`,
        { contentType: file.type },
      )
      // Step 2 — upload directly to S3
      await axios.put(uploadUrl, file, { headers: { 'Content-Type': file.type } })
      // Step 3 — confirm
      return api.post<{ logoUrl: string }>(`/jobs/${jobId}/logo/confirm`, { logoKey })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['jobs', jobId, 'logo'] })
      qc.invalidateQueries({ queryKey: ['jobs', jobId] })
    },
  })
}

export function useDeleteJobLogo(jobId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => api.delete(`/jobs/${jobId}/logo`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['jobs', jobId, 'logo'] })
      qc.invalidateQueries({ queryKey: ['jobs', jobId] })
    },
  })
}
