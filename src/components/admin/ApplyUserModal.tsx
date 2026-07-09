'use client'

import { useState, useCallback } from 'react'
import { XMarkIcon, MagnifyingGlassIcon, DocumentIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { useAdminUsers, useAdminUser, AdminUserRow } from '@/hooks/useAdmin'
import { useCreateApplication, ApplicationStatus } from '@/hooks/useApplications'
import { useDebounce } from '@/hooks/useDebounce'

interface Props {
  jobId: string
  jobTitle: string
  onClose: () => void
}

type ModalStep = 'select-user' | 'select-resume' | 'success' | 'error'

const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: 'APPLIED',   label: 'Applied' },
  { value: 'INTERVIEW', label: 'Interview' },
  { value: 'OFFER',     label: 'Offer' },
  { value: 'REJECTED',  label: 'Rejected' },
  { value: 'WITHDRAWN', label: 'Withdrawn' },
]

export default function ApplyUserModal({ jobId, jobTitle, onClose }: Props) {
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<AdminUserRow | null>(null)
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<ApplicationStatus>('APPLIED')
  const [interviewAt, setInterviewAt] = useState('')
  const [step, setStep] = useState<ModalStep>('select-user')
  const [errorMsg, setErrorMsg] = useState('')

  const debouncedSearch = useDebounce(search, 300)

  const { data: usersData, isLoading: usersLoading } = useAdminUsers({
    search: debouncedSearch || undefined,
    limit: 30,
  })

  const { data: fullProfile, isLoading: profileLoading } = useAdminUser(selectedUser?.id ?? '')
  const { mutateAsync: createApplication, isPending } = useCreateApplication()

  const handleSelectUser = useCallback((user: AdminUserRow) => {
    setSelectedUser(user)
    setSelectedResumeId(null)
    setStep('select-resume')
  }, [])

  const handleBack = () => {
    setSelectedUser(null)
    setSelectedResumeId(null)
    setStatus('APPLIED')
    setInterviewAt('')
    setErrorMsg('')
    setStep('select-user')
  }

  const handleSubmit = async () => {
    if (!selectedUser) return
    try {
      await createApplication({
        jobId,
        userId: selectedUser.id,
        resumeId: selectedResumeId ?? undefined,
        notes: notes.trim() || undefined,
        status,
        interviewAt: status === 'INTERVIEW' && interviewAt ? interviewAt : undefined,
      })
      setStep('success')
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'Something went wrong')
      setStep('error')
    }
  }

  const resumes = fullProfile?.profile?.resumes ?? []
  const defaultResume = resumes.find((r) => r.isDefault) ?? resumes[0] ?? null

  if (fullProfile && selectedResumeId === null && resumes.length > 0 && step === 'select-resume') {
    setSelectedResumeId(defaultResume?.id ?? null)
  }

  const inputCls = 'w-full rounded-xl border border-[#2d4a2d]/20 bg-white px-4 py-2.5 text-sm font-medium text-[#1a2e1a] placeholder:text-[#1a2e1a]/50 focus:outline-none focus:ring-2 focus:ring-[#4a7c59]/40'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d4a2d]/10">
          <div>
            <h2 className="text-lg font-bold text-[#1a2e1a]">Apply User to Job</h2>
            <p className="text-sm font-semibold text-[#1a2e1a]/70 mt-0.5 truncate max-w-xs">{jobTitle}</p>
          </div>
          <button onClick={onClose} className="cursor-pointer p-1.5 rounded-lg hover:bg-[#eef7ee] text-[#1a2e1a]">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Step indicator */}
        {(step === 'select-user' || step === 'select-resume') && (
          <div className="flex gap-2 px-6 py-3 border-b border-[#2d4a2d]/10">
            <StepPip active={step === 'select-user'} done={step === 'select-resume'} label="1. Select User" />
            <div className="flex-1 self-center h-px bg-[#2d4a2d]/10" />
            <StepPip active={step === 'select-resume'} done={false} label="2. Choose Resume" />
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">

          {/* ── Step 1: select user ── */}
          {step === 'select-user' && (
            <>
              <div className="relative mb-4">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1a2e1a]/50" />
                <input
                  className={inputCls + ' pl-9'}
                  placeholder="Search users by name or email…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {usersLoading ? (
                <LoadingRows />
              ) : !usersData?.data?.length ? (
                <p className="text-center text-sm font-semibold text-[#1a2e1a]/60 py-8">No users found</p>
              ) : (
                <ul className="space-y-2">
                  {usersData.data.map((user) => (
                    <li key={user.id}>
                      <button
                        onClick={() => handleSelectUser(user)}
                        className="cursor-pointer w-full flex items-center gap-3 rounded-xl border border-[#2d4a2d]/15 bg-[#f8fdf8] px-4 py-3 hover:bg-[#eef7ee] hover:border-[#4a7c59]/50 transition-colors text-left"
                      >
                        <Avatar user={user} size={40} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#1a2e1a] truncate">
                            {user.firstName || user.lastName
                              ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
                              : 'Unnamed User'}
                          </p>
                          <p className="text-sm font-medium text-[#1a2e1a] truncate">{user.email}</p>
                        </div>
                        <div className="shrink-0 text-right">
                          <span className="text-xs font-semibold text-[#1a2e1a]/70">
                            {user.profile?.resumes?.length ?? 0} resume{user.profile?.resumes?.length !== 1 ? 's' : ''}
                          </span>
                          {user.subscription && (
                            <p className="text-xs font-bold text-[#4a7c59]">{user.subscription.plan}</p>
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {/* ── Step 2: select resume ── */}
          {step === 'select-resume' && selectedUser && (
            <>
              {/* Selected user chip */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#eef7ee] border border-[#4a7c59]/30 mb-5">
                <Avatar user={selectedUser} size={36} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1a2e1a] truncate">
                    {selectedUser.firstName || selectedUser.lastName
                      ? `${selectedUser.firstName ?? ''} ${selectedUser.lastName ?? ''}`.trim()
                      : 'Unnamed User'}
                  </p>
                  <p className="text-sm font-medium text-[#1a2e1a] truncate">{selectedUser.email}</p>
                </div>
                <button onClick={handleBack} className="cursor-pointer text-xs font-bold text-[#4a7c59] underline underline-offset-2">
                  Change
                </button>
              </div>

              {/* Resume picker */}
              <p className="text-sm font-bold text-[#1a2e1a] mb-3">Select Resume</p>
              {profileLoading ? (
                <LoadingRows />
              ) : resumes.length === 0 ? (
                <p className="text-sm font-medium text-[#1a2e1a]/70 italic">
                  This user has no resumes — the application will be created without one.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {resumes.map((resume) => {
                    const isSelected = selectedResumeId === resume.id
                    return (
                      <button
                        key={resume.id}
                        onClick={() => setSelectedResumeId(resume.id)}
                        className={`cursor-pointer relative rounded-xl border-2 p-3 flex gap-3 items-start text-left transition-colors ${
                          isSelected
                            ? 'border-[#4a7c59] bg-[#eef7ee]'
                            : 'border-[#2d4a2d]/15 bg-[#f8fdf8] hover:border-[#4a7c59]/40'
                        }`}
                      >
                        <div className="shrink-0 w-12 h-16 rounded-lg overflow-hidden bg-[#e8f0e8] flex items-center justify-center border border-[#2d4a2d]/10">
                          {resume.thumbnailUrl ? (
                            <img src={resume.thumbnailUrl} alt="Resume preview" className="w-full h-full object-cover" />
                          ) : (
                            <DocumentIcon className="h-6 w-6 text-[#1a2e1a]/50" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#1a2e1a] line-clamp-2">
                            {resume.label || resume.originalName}
                          </p>
                          {resume.isDefault && (
                            <span className="inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#4a7c59] text-white">
                              Default
                            </span>
                          )}
                        </div>
                        {isSelected && (
                          <CheckCircleIcon className="absolute top-2 right-2 h-5 w-5 text-[#4a7c59]" />
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Status */}
              <p className="text-sm font-bold text-[#1a2e1a] mb-2">Initial Status</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setStatus(opt.value)}
                    className={`cursor-pointer text-xs px-3 py-1.5 rounded-full font-bold border-2 transition-colors ${
                      status === opt.value
                        ? 'border-[#4a7c59] bg-[#eef7ee] text-[#1a2e1a]'
                        : 'border-transparent bg-slate-100 text-[#1a2e1a]/60 hover:bg-[#eef7ee]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Interview date — only when INTERVIEW */}
              {status === 'INTERVIEW' && (
                <div className="mb-4">
                  <label className="block text-sm font-bold text-[#1a2e1a] mb-1.5">Interview Date & Time</label>
                  <input
                    type="datetime-local"
                    value={interviewAt}
                    onChange={(e) => setInterviewAt(e.target.value)}
                    className={inputCls.replace('w-full ', '')}
                  />
                </div>
              )}

              {/* Notes */}
              <label className="block text-sm font-bold text-[#1a2e1a] mb-1.5">Notes (optional)</label>
              <textarea
                className={inputCls + ' resize-none h-20'}
                placeholder="Add any internal notes about this application…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </>
          )}

          {/* ── Success ── */}
          {step === 'success' && selectedUser && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-[#eef7ee] flex items-center justify-center mb-4">
                <CheckCircleIcon className="w-9 h-9 text-[#4a7c59]" />
              </div>
              <h3 className="text-lg font-bold text-[#1a2e1a] mb-2">Application Created</h3>
              <p className="text-sm font-medium text-[#1a2e1a] max-w-xs leading-relaxed">
                <span className="font-bold">
                  {[selectedUser.firstName, selectedUser.lastName].filter(Boolean).join(' ') || selectedUser.email}
                </span>{' '}
                has been applied to <span className="font-bold">{jobTitle}</span>.
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleBack}
                  className="cursor-pointer px-5 py-2.5 rounded-xl border border-[#4a7c59]/40 text-[#1a2e1a] font-bold text-sm hover:bg-[#eef7ee] transition-colors"
                >
                  Apply another user
                </button>
                <button
                  onClick={onClose}
                  className="cursor-pointer px-5 py-2.5 rounded-xl bg-[#4a7c59] text-white font-bold text-sm hover:bg-[#3d6b4a] transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* ── Error ── */}
          {step === 'error' && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-peach-muted flex items-center justify-center mb-4">
                <ExclamationCircleIcon className="w-9 h-9 text-peach" />
              </div>
              <h3 className="text-lg font-bold text-[#1a2e1a] mb-2">Application Failed</h3>
              <p className="text-sm font-medium text-[#1a2e1a] max-w-xs leading-relaxed">{errorMsg}</p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleBack}
                  className="cursor-pointer px-5 py-2.5 rounded-xl border border-[#4a7c59]/40 text-[#1a2e1a] font-bold text-sm hover:bg-[#eef7ee] transition-colors"
                >
                  Apply another user
                </button>
                <button
                  onClick={onClose}
                  className="cursor-pointer px-5 py-2.5 rounded-xl bg-[#1a2e1a] text-white font-bold text-sm hover:bg-[#2d4a2d] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'select-resume' && (
          <div className="flex gap-3 justify-end px-6 py-4 border-t border-[#2d4a2d]/10">
            <button
              onClick={handleBack}
              className="cursor-pointer px-4 py-2 rounded-xl text-sm font-bold text-[#1a2e1a] border border-[#2d4a2d]/20 hover:bg-[#f0f7f0] transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="cursor-pointer px-5 py-2 rounded-xl text-sm font-bold bg-[#4a7c59] text-white hover:bg-[#3d6b4a] disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {isPending && <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              Apply User
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function StepPip({ active, done, label }: { active: boolean; done: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-1.5 text-xs font-bold ${active ? 'text-[#1a2e1a]' : 'text-[#1a2e1a]/50'}`}>
      <span className={`h-5 w-5 rounded-full text-[10px] flex items-center justify-center font-bold ${active ? 'bg-[#4a7c59] text-white' : done ? 'bg-[#4a7c59] text-white' : 'bg-[#e8f0e8] text-[#1a2e1a]/60'}`}>
        {done ? '✓' : label[0]}
      </span>
      {label.slice(3)}
    </div>
  )
}

function Avatar({ user, size }: { user: AdminUserRow; size: number }) {
  const initials = [user.firstName?.[0], user.lastName?.[0]].filter(Boolean).join('') || user.email[0].toUpperCase()
  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt="avatar"
        referrerPolicy="no-referrer"
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <div
      className="rounded-full bg-[#4a7c59] text-white font-bold flex items-center justify-center shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  )
}

function LoadingRows() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-16 rounded-xl bg-[#f0f7f0] animate-pulse" />
      ))}
    </div>
  )
}
