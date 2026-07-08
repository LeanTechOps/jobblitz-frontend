import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import axios from 'axios'

// ── Types ───────────────────────────────────────────────────

export interface ProfileData {
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
}

export interface Resume {
  id: string
  originalName: string
  label: string | null
  contentType: string
  isDefault: boolean
  createdAt: string
  thumbnailKey: string | null
  thumbnailUrl: string | null
  downloadUrl: string | null
}

// ── Query keys ──────────────────────────────────────────────

export const profileKeys = {
  profile: ['profile'] as const,
  resumes: ['profile', 'resumes'] as const,
}

// ── Profile ─────────────────────────────────────────────────

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.profile,
    queryFn: () => api.get<ProfileData>('/profile'),
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<ProfileData>) => api.patch<ProfileData>('/profile', data),
    // Optimistically update the cache so the hero/form reflects changes instantly,
    // then confirm with a server re-fetch
    onSuccess: (updated) => {
      qc.setQueryData(profileKeys.profile, updated)
    },
  })
}

// ── Resumes ─────────────────────────────────────────────────

export function useResumes() {
  return useQuery({
    queryKey: profileKeys.resumes,
    queryFn: () =>
      api.get<Resume[]>('/profile/resumes').then((list) =>
        list.map((r) => ({ ...r, thumbnailKey: r.thumbnailKey ?? null, thumbnailUrl: r.thumbnailUrl ?? null, downloadUrl: null })),
      ),
  })
}

export function useDeleteResume() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/profile/resumes/${id}`),
    onSuccess: (_data, id) => {
      // Optimistic remove from cache — no spinner wait needed
      qc.setQueryData<Resume[]>(profileKeys.resumes, (prev) =>
        prev ? prev.filter((r) => r.id !== id) : [],
      )
    },
  })
}

export function useSetDefaultResume() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.patch(`/profile/resumes/${id}/default`),
    onSuccess: (_data, id) => {
      // Update isDefault flags in-place without a round-trip
      qc.setQueryData<Resume[]>(profileKeys.resumes, (prev) =>
        prev ? prev.map((r) => ({ ...r, isDefault: r.id === id })) : [],
      )
    },
  })
}

interface UploadResumeArgs {
  file: File
  label?: string
}

// Fetches a time-limited presigned S3 download URL on demand.
// staleTime = 50 min so repeated clicks reuse the cached URL within S3's validity window.
export function useResumeUrl(resumeId: string) {
  return useQuery({
    queryKey: ['profile', 'resumes', resumeId, 'url'],
    queryFn: () =>
      api.get<{ downloadUrl: string }>(`/profile/resumes/${resumeId}/url`),
    enabled: false,            // only fetch when manually triggered with refetch()
    staleTime: 50 * 60 * 1000,
    retry: 1,
  })
}

export function useUploadResume() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ file, label }: UploadResumeArgs) => {
      // Step 1 — get presigned S3 URL
      const { resumeId, uploadUrl } = await api.post<{
        resumeId: string
        key: string
        uploadUrl: string
      }>('/profile/resumes/initiate-upload', {
        originalName: file.name,
        contentType: file.type,
        fileSize: file.size,
      })

      // Step 2 — upload directly to S3
      await axios.put(uploadUrl, file, { headers: { 'Content-Type': file.type } })

      // Step 3 — confirm so the backend persists the record
      return api.post('/profile/resumes/confirm-upload', {
        resumeId,
        originalName: file.name,
        contentType: file.type,
        ...(label?.trim() && { label: label.trim() }),
      })
    },
    // Invalidate so the list re-fetches with the new entry
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileKeys.resumes })
    },
  })
}
