import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

// ── Types ───────────────────────────────────────────────────

export type ApplicationStatus = 'APPLIED' | 'INTERVIEW' | 'OFFER' | 'REJECTED' | 'WITHDRAWN'

export interface ApplicationJob {
  id: string
  title: string
  company: string
  companyLogoKey: string | null
  location: string | null
  workMode: string
  type: string
  experienceLevel: string
  salaryMin: number | null
  salaryMax: number | null
  salaryCurrency: string
  salaryPeriod: string
  salaryNegotiable: boolean
  visaSponsorship: boolean
  status: string
  description: string
  responsibilities: string | null
  requirements: string | null
  benefits: string | null
  skills: string[]
  applicationUrl: string | null
  closesAt: string | null
  createdAt: string
  postedBy: { id: string; firstName: string | null; lastName: string | null; email: string } | null
}

export interface ApplicationResume {
  id: string
  originalName: string
  label: string | null
  isDefault: boolean
  thumbnailKey: string | null
  key: string
  contentType: string
}

export interface ApplicationUser {
  id: string
  firstName: string | null
  lastName: string | null
  email: string
  avatar: string | null
  profile: { headline: string | null; skills: string[]; visaType: string | null } | null
}

export interface JobApplication {
  id: string
  jobId: string
  userId: string
  resumeId: string | null
  status: ApplicationStatus
  interviewAt: string | null
  notes: string | null
  appliedAt: string
  updatedAt: string
  job?: ApplicationJob
  user?: ApplicationUser
  resume: ApplicationResume | null
  // Presigned URL fields
  resumeThumbnailUrl?: string | null
  resumeDownloadUrl?: string | null
  companyLogoUrl?: string | null
}

export interface CreateApplicationPayload {
  jobId: string
  userId: string
  resumeId?: string
  notes?: string
  status?: ApplicationStatus
  interviewAt?: string
}

export interface UpdateApplicationPayload {
  status?: ApplicationStatus
  interviewAt?: string | null
  notes?: string
  resumeId?: string
}

// ── Admin hooks ──────────────────────────────────────────────

/** List all applications for a given job */
export function useJobApplications(jobId: string) {
  return useQuery<JobApplication[]>({
    queryKey: ['applications', 'job', jobId],
    queryFn: () => api.get(`/applications/job/${jobId}`),
    enabled: !!jobId,
  })
}

/** Create an application (admin applies a user to a job) */
export function useCreateApplication() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateApplicationPayload) => api.post<JobApplication>('/applications', payload),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['applications', 'job', vars.jobId] })
    },
  })
}

/** Update application status / resume / notes / interview date */
export function useUpdateApplication() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateApplicationPayload }) =>
      api.patch<JobApplication>(`/applications/${id}`, data),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ['applications', 'job', updated.jobId] })
    },
  })
}

/** Delete an application */
export function useDeleteApplication() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, jobId }: { id: string; jobId: string }) => api.delete(`/applications/${id}`),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['applications', 'job', vars.jobId] })
    },
  })
}

// ── User-side hooks ──────────────────────────────────────────

/** Get the current user's applications (with job details + status) */
export function useMyApplications() {
  return useQuery<JobApplication[]>({
    queryKey: ['applications', 'me'],
    queryFn: () => api.get('/applications/me'),
  })
}
