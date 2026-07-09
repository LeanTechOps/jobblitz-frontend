/**
 * Manager portal hooks — same data as admin, hits /manager/* endpoints.
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

export function useManagerStats() {
  return useQuery({
    queryKey: ['manager', 'stats'],
    queryFn: () => api.get<DashboardStats>('/manager/dashboard'),
  })
}

export function useManagerSkills() {
  return useQuery({
    queryKey: ['manager', 'skills'],
    queryFn: () => api.get<string[]>('/manager/skills'),
    staleTime: 2 * 60 * 1000,
  })
}

export function useManagerResumeUrl(resumeId: string) {
  return useQuery({
    queryKey: ['manager', 'resumes', resumeId, 'url'],
    queryFn: () => api.get<{ downloadUrl: string; fileName: string }>(`/manager/resumes/${resumeId}/url`),
    enabled: false,
    staleTime: 50 * 60 * 1000,
    retry: 1,
  })
}

export function useManagerUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: ['manager', 'users', filters],
    queryFn: () => api.get<UsersResponse>(`/manager/users?${buildParams(filters)}`),
  })
}

export function useManagerUser(id: string) {
  return useQuery({
    queryKey: ['manager', 'users', id],
    queryFn: () => api.get<AdminUserProfile>(`/manager/users/${id}`),
    enabled: !!id,
  })
}
