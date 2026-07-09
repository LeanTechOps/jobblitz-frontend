import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const ALL_ROLES = ['MEMBER', 'MANAGER', 'RECRUITER', 'ADMIN'] as const
export type UserRole = typeof ALL_ROLES[number]

export const ROLE_LABELS: Record<UserRole, string> = {
  MEMBER: 'Job Seeker',
  MANAGER: 'Manager',
  RECRUITER: 'Recruiter',
  ADMIN: 'Admin',
}

// ── Dashboard ──────────────────────────────────────────────

export interface DashboardStats {
  totalUsers: number
  totalJobs: number
  plans: Record<string, number>
  recentUsers: {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    avatar: string | null
    createdAt: string
    subscription: { plan: string } | null
  }[]
}

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => api.get<DashboardStats>('/admin/dashboard'),
  })
}

export function useAdminSkills() {
  return useQuery({
    queryKey: ['admin', 'skills'],
    queryFn: () => api.get<string[]>('/admin/skills'),
    staleTime: 2 * 60 * 1000,
  })
}

export function useAdminResumeUrl(resumeId: string) {
  return useQuery({
    queryKey: ['admin', 'resumes', resumeId, 'url'],
    queryFn: () => api.get<{ downloadUrl: string; fileName: string }>(`/admin/resumes/${resumeId}/url`),
    enabled: false,
    staleTime: 50 * 60 * 1000,
    retry: 1,
  })
}

// ── Users ──────────────────────────────────────────────────

export interface AdminUserRow {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  avatar: string | null
  role: string
  createdAt: string
  subscription: { plan: string; status: string } | null
  profile: {
    headline: string | null
    skills: string[]
    visaType: string | null
    resumes: { id: string; isDefault: boolean }[]
  } | null
}

export interface UsersResponse {
  data: AdminUserRow[]
  total: number
  page: number
  totalPages: number
}

export interface UserFilters {
  page?: number
  limit?: number
  search?: string
  skills?: string[]
  visaType?: string
  plan?: string
  role?: UserRole
}

function buildParams(filters: UserFilters) {
  const p = new URLSearchParams()
  if (filters.page) p.set('page', String(filters.page))
  if (filters.limit) p.set('limit', String(filters.limit))
  if (filters.search) p.set('search', filters.search)
  filters.skills?.forEach((s) => p.append('skills', s))
  if (filters.visaType) p.set('visaType', filters.visaType)
  if (filters.plan) p.set('plan', filters.plan)
  if (filters.role) p.set('role', filters.role)
  return p.toString()
}

export function useAdminUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: () => api.get<UsersResponse>(`/admin/users?${buildParams(filters)}`),
  })
}

// ── Single user profile ────────────────────────────────────

export interface AdminUserProfile {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  avatar: string | null
  role: string
  createdAt: string
  subscription: {
    plan: string
    status: string
    currentPeriodEnd: string | null
    billingCycle: string | null
  } | null
  profile: {
    headline: string | null
    bio: string | null
    location: string | null
    phoneNumber: string | null
    linkedinUrl: string | null
    githubUrl: string | null
    portfolioUrl: string | null
    address: string | null
    city: string | null
    state: string | null
    country: string | null
    zipCode: string | null
    visaType: string | null
    skills: string[]
    resumes: {
      id: string
      originalName: string
      label: string | null
      isDefault: boolean
      createdAt: string
      thumbnailKey: string | null
      thumbnailUrl: string | null
      downloadUrl: string | null
    }[]
  } | null
}

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: ['admin', 'users', id],
    queryFn: () => api.get<AdminUserProfile>(`/admin/users/${id}`),
    enabled: !!id,
  })
}

export function useUpdateUserRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      api.patch(`/admin/users/${userId}/role`, { role }),
    onSuccess: (_data, { userId }) => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
      qc.invalidateQueries({ queryKey: ['admin', 'users', userId] })
    },
  })
}
