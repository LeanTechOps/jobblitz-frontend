/**
 * Recruiter portal hooks — same data as admin, hits /recruiter/* endpoints.
 * Types are re-exported from useAdmin.ts.
 */
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { DashboardStats, AdminUserRow, UsersResponse, UserFilters, AdminUserProfile } from './useAdmin'

export type { DashboardStats, AdminUserRow, UsersResponse, UserFilters, AdminUserProfile }

function buildParams(filters: UserFilters) {
  const p = new URLSearchParams()
  if (filters.page) p.set('page', String(filters.page))
  if (filters.limit) p.set('limit', String(filters.limit))
  if (filters.search) p.set('search', filters.search)
  filters.skills?.forEach((s) => p.append('skills', s))
  if (filters.visaType) p.set('visaType', filters.visaType)
  if (filters.plan) p.set('plan', filters.plan)
  return p.toString()
}

export function useRecruiterStats() {
  return useQuery({
    queryKey: ['recruiter', 'stats'],
    queryFn: () => api.get<DashboardStats>('/recruiter/dashboard'),
  })
}

export function useRecruiterSkills() {
  return useQuery({
    queryKey: ['recruiter', 'skills'],
    queryFn: () => api.get<string[]>('/recruiter/skills'),
    staleTime: 2 * 60 * 1000,
  })
}

export function useRecruiterResumeUrl(resumeId: string) {
  return useQuery({
    queryKey: ['recruiter', 'resumes', resumeId, 'url'],
    queryFn: () => api.get<{ downloadUrl: string; fileName: string }>(`/recruiter/resumes/${resumeId}/url`),
    enabled: false,
    staleTime: 50 * 60 * 1000,
    retry: 1,
  })
}

export function useRecruiterUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: ['recruiter', 'users', filters],
    queryFn: () => api.get<UsersResponse>(`/recruiter/users?${buildParams(filters)}`),
  })
}

export function useRecruiterUser(id: string) {
  return useQuery({
    queryKey: ['recruiter', 'users', id],
    queryFn: () => api.get<AdminUserProfile>(`/recruiter/users/${id}`),
    enabled: !!id,
  })
}
