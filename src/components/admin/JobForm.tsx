'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useCreateJob, useUpdateJob, useJobLogoUrl, useUploadJobLogo, useDeleteJobLogo } from '@/hooks/useJobs'
import { normaliseSkill } from '@/lib/utils'
import { api } from '@/lib/api'
import { toast } from 'react-toastify'
import { XMarkIcon, ArrowUpTrayIcon, TrashIcon } from '@heroicons/react/24/outline'

const WORK_MODES = ['ONSITE', 'REMOTE', 'HYBRID']
const WORK_MODE_LABELS: Record<string, string> = { ONSITE: 'On-site', REMOTE: 'Remote', HYBRID: 'Hybrid' }
const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE']
const EXP_LEVELS = ['ENTRY', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE']
const STATUSES = ['DRAFT', 'ACTIVE', 'PAUSED', 'CLOSED']
const SALARY_PERIODS: { value: string; label: string }[] = [
  { value: 'HOURLY', label: 'Per hour' },
  { value: 'WEEKLY', label: 'Per week' },
  { value: 'BIWEEKLY', label: 'Every 15 days' },
  { value: 'MONTHLY', label: 'Per month' },
]

interface JobFormProps {
  initialData?: Partial<JobFormData>
  jobId?: string
  /** Path to return to after save/cancel. Defaults to /admin/jobs */
  jobsListPath?: string
}

interface JobFormData {
  title: string
  company: string
  companyDomain: string
  location: string
  workMode: string
  type: string
  experienceLevel: string
  status: string
  description: string
  responsibilities: string
  requirements: string
  benefits: string
  skills: string[]
  salaryMin: string
  salaryMax: string
  salaryCurrency: string
  salaryPeriod: string
  salaryNegotiable: boolean
  visaSponsorship: boolean
  applicationUrl: string
  closesAt: string
}

const DEFAULT: JobFormData = {
  title: '', company: '', companyDomain: '', location: '',
  workMode: 'ONSITE', type: 'FULL_TIME', experienceLevel: 'MID', status: 'DRAFT',
  description: '', responsibilities: '', requirements: '', benefits: '',
  skills: [], salaryMin: '', salaryMax: '', salaryCurrency: 'USD', salaryPeriod: 'MONTHLY',
  salaryNegotiable: false, visaSponsorship: false,
  applicationUrl: '', closesAt: '',
}

// These must live OUTSIDE JobForm — defining components inside a render function
// creates a new type on every render, causing React to unmount/remount on each keystroke.

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
      <div className="border-l-2 border-blue-accent pl-3">
        <h2 className="text-lg font-bold text-navy">{title}</h2>
        {hint && <p className="text-sm text-slate-600 mt-0.5">{hint}</p>}
      </div>
      {children}
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-base font-semibold text-navy mb-2">
        {label} {required && <span className="text-peach text-xl leading-none">*</span>}
      </label>
      {children}
    </div>
  )
}

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onChange(!checked) }}
      className="flex items-center gap-2.5 cursor-pointer select-none group w-full text-left"
    >
      <div
        className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all duration-150 ${checked ? 'bg-navy border-navy' : 'border-slate-300 group-hover:border-navy'}`}
      >
        {checked && <svg className="w-3 h-3 text-blue-accent" fill="none" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </div>
      <span className="text-base text-navy font-semibold">{label}</span>
    </button>
  )
}

const inputCls =
  'w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-blue-accent/50 focus:border-navy transition-colors placeholder:text-slate-500 placeholder:font-medium'
const selectCls = `${inputCls} cursor-pointer`
const textareaCls = `${inputCls} resize-y min-h-28 leading-relaxed`

export default function JobForm({ initialData, jobId, jobsListPath = '/admin/jobs' }: JobFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<JobFormData>({ ...DEFAULT, ...initialData })
  const [skillInput, setSkillInput] = useState('')
  // pendingLogoFile: selected on a NEW job before it has an ID — uploaded right after creation
  const [pendingLogoFile, setPendingLogoFile] = useState<File | null>(null)
  const [pendingLogoPreview, setPendingLogoPreview] = useState<string | null>(null)
  const createJob = useCreateJob()
  const updateJob = useUpdateJob(jobId ?? '')
  const uploadLogo = useUploadJobLogo(jobId ?? '')
  const deleteLogo = useDeleteJobLogo(jobId ?? '')
  const { data: logoData, refetch: refetchLogo } = useJobLogoUrl(jobId ?? '', !!jobId)
  const logoFileRef = useRef<HTMLInputElement>(null)

  const handleLogoFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (jobId) {
      // Edit mode — upload immediately
      try {
        await uploadLogo.mutateAsync(file)
        await refetchLogo()
        toast.success('Logo uploaded')
      } catch {
        toast.error('Logo upload failed')
      }
    } else {
      // New job — hold the file and show a local preview; upload after creation
      setPendingLogoFile(file)
      setPendingLogoPreview(URL.createObjectURL(file))
    }
    e.target.value = ''
  }

  const handleLogoDelete = async () => {
    if (pendingLogoFile) {
      setPendingLogoFile(null)
      setPendingLogoPreview(null)
      return
    }
    if (!jobId) return
    try {
      await deleteLogo.mutateAsync()
      toast.success('Logo removed')
    } catch {
      toast.error('Failed to remove logo')
    }
  }

  const set = (field: keyof JobFormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const addSkill = (raw = skillInput) => {
    const s = normaliseSkill(raw)
    if (s && !form.skills.includes(s)) set('skills', [...form.skills, s])
    setSkillInput('')
  }

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val.endsWith(',')) { addSkill(val.slice(0, -1)) } else { setSkillInput(val) }
  }

  const removeSkill = (s: string) => set('skills', form.skills.filter((x) => x !== s))

  const saving = createJob.isPending || updateJob.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...form,
      salaryMin: (!form.salaryNegotiable && form.salaryMin) ? Number(form.salaryMin) : undefined,
      salaryMax: (!form.salaryNegotiable && form.salaryMax) ? Number(form.salaryMax) : undefined,
      closesAt: form.closesAt || undefined,
      companyDomain: form.companyDomain || undefined,
      location: form.location || undefined,
      responsibilities: form.responsibilities || undefined,
      requirements: form.requirements || undefined,
      benefits: form.benefits || undefined,
      applicationUrl: form.applicationUrl || undefined,
    }
    try {
      if (jobId) {
        await updateJob.mutateAsync(payload)
        toast.success('Job updated')
      } else {
        const created = await createJob.mutateAsync(payload) as { id: string }
        if (pendingLogoFile && created?.id) {
          try {
            const { uploadUrl, logoKey } = await api.post<{ uploadUrl: string; logoKey: string }>(
              `/jobs/${created.id}/logo/initiate`,
              { contentType: pendingLogoFile.type },
            )
            await axios.put(uploadUrl, pendingLogoFile, { headers: { 'Content-Type': pendingLogoFile.type } })
            await api.post(`/jobs/${created.id}/logo/confirm`, { logoKey })
          } catch {
            toast.warn('Job created, but logo upload failed — try again from edit.')
          }
        }
        toast.success('Job created')
      }
      router.push(jobsListPath)
    } catch {
      toast.error('Failed to save job')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Basic info */}
      <Section title="Basic Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Job Title" required>
            <input className={inputCls} value={form.title} onChange={(e) => set('title', e.target.value)} required placeholder="e.g. Senior Software Engineer" />
          </Field>
          <Field label="Company" required>
            <input className={inputCls} value={form.company} onChange={(e) => set('company', e.target.value)} required placeholder="e.g. Stripe" />
          </Field>
          <Field label="Company Domain">
            <input
              className={inputCls}
              value={form.companyDomain}
              onChange={(e) => set('companyDomain', e.target.value.toLowerCase().replace(/^https?:\/\//,'').replace(/^www\./,'').split('/')[0])}
              placeholder="stripe.com"
            />
            <p className="text-sm text-slate-500 mt-1.5">Domain only — e.g. <span className="font-mono text-navy">stripe.com</span></p>

            {/* Logo preview + upload */}
            <div className="mt-3 flex items-center gap-3 p-3 bg-section-alt rounded-xl border border-slate-200">
              {(logoData?.logoUrl || pendingLogoPreview) ? (
                <img src={logoData?.logoUrl ?? pendingLogoPreview!} alt="logo" className="w-10 h-10 rounded-lg object-contain border border-slate-200 bg-white p-1 shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-lg border border-slate-200 bg-blue-muted flex items-center justify-center text-sm font-bold text-navy shrink-0">
                  {form.company?.[0]?.toUpperCase() || '?'}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-navy truncate">{form.company || 'Company logo'}</p>
                <p className="text-xs text-slate-500">{logoData?.logoUrl ? 'Custom logo uploaded' : pendingLogoPreview ? 'Logo ready — will upload on save' : 'No logo yet — upload one'}</p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {/* Hidden file input */}
                <input
                  ref={logoFileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                  className="hidden"
                  onChange={handleLogoFileSelect}
                />
                <button
                  type="button"
                  onClick={() => logoFileRef.current?.click()}
                  disabled={uploadLogo.isPending}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-muted hover:bg-blue-accent/20 text-navy rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadLogo.isPending
                    ? <span className="w-3 h-3 border border-navy border-t-transparent rounded-full animate-spin" />
                    : <ArrowUpTrayIcon className="w-3.5 h-3.5" />}
                  Upload
                </button>
                {(logoData?.logoUrl || pendingLogoPreview) && (
                  <button
                    type="button"
                    onClick={handleLogoDelete}
                    disabled={deleteLogo.isPending}
                    title="Remove custom logo"
                    className="p-1.5 text-slate-400 hover:text-peach hover:bg-peach-muted rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </Field>
          <Field label="Location">
            <input className={inputCls} value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="New York, NY" />
          </Field>
        </div>
        <Field label="Work Mode">
          <div className="flex gap-1 p-1 bg-section-alt rounded-xl w-fit">
            {WORK_MODES.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => set('workMode', m)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  form.workMode === m
                    ? 'bg-navy text-blue-accent shadow-sm'
                    : 'text-slate-500 hover:text-navy'
                }`}
              >
                {WORK_MODE_LABELS[m]}
              </button>
            ))}
          </div>
        </Field>
      </Section>

      {/* Classification */}
      <Section title="Classification" hint="Helps candidates filter and find the right role">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Job Type">
            <select className={selectCls} value={form.type} onChange={(e) => set('type', e.target.value)}>
              {JOB_TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
            </select>
          </Field>
          <Field label="Experience Level">
            <select className={selectCls} value={form.experienceLevel} onChange={(e) => set('experienceLevel', e.target.value)}>
              {EXP_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select className={selectCls} value={form.status} onChange={(e) => set('status', e.target.value)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </div>
      </Section>

      {/* Description */}
      <Section title="Description" hint="Be specific — good descriptions attract better candidates">
        <Field label="Job Description" required>
          <textarea className={textareaCls} value={form.description} onChange={(e) => set('description', e.target.value)} required placeholder="What does this role involve day-to-day?" />
        </Field>
        <Field label="Responsibilities">
          <textarea className={textareaCls} value={form.responsibilities} onChange={(e) => set('responsibilities', e.target.value)} placeholder="Key responsibilities…" />
        </Field>
        <Field label="Requirements">
          <textarea className={textareaCls} value={form.requirements} onChange={(e) => set('requirements', e.target.value)} placeholder="Must-have qualifications, years of experience, etc." />
        </Field>
        <Field label="Benefits">
          <textarea className={`${inputCls} resize-y min-h-20`} value={form.benefits} onChange={(e) => set('benefits', e.target.value)} placeholder="Health, 401k, equity, remote, etc." />
        </Field>
      </Section>

      {/* Skills */}
      <Section title="Required Skills" hint="These are used to match candidates from the user pool">
        <div className="flex gap-2">
          <input
            className={`${inputCls} flex-1`}
            value={skillInput}
            onChange={handleSkillChange}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
            placeholder="Type a skill and press Enter or , to add"
          />
          <button
            type="button"
            onClick={() => addSkill()}
            className="px-4 py-2 bg-blue-muted hover:bg-blue-accent/20 text-navy font-semibold rounded-xl text-sm transition-colors cursor-pointer"
          >
            Add
          </button>
        </div>
        {form.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {form.skills.map((s) => (
              <span key={s} className="flex items-center gap-1.5 bg-navy text-blue-accent text-xs font-bold px-3 py-1.5 rounded-full">
                {s}
                <button type="button" onClick={() => removeSkill(s)} className="hover:text-peach transition-colors cursor-pointer">
                  <XMarkIcon className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </Section>

      {/* Salary */}
      <Section title="Compensation">
        <Checkbox
          checked={form.salaryNegotiable}
          onChange={(v) => set('salaryNegotiable', v)}
          label="Salary is negotiable (range below is a guide only)"
        />
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 transition-opacity duration-150 ${form.salaryNegotiable ? 'opacity-50' : ''}`}>
          <Field label="Min Salary">
            <input className={inputCls} type="number" min={0} value={form.salaryMin} onChange={(e) => set('salaryMin', e.target.value)} placeholder="60,000" disabled={form.salaryNegotiable} />
          </Field>
          <Field label="Max Salary">
            <input className={inputCls} type="number" min={0} value={form.salaryMax} onChange={(e) => set('salaryMax', e.target.value)} placeholder="100,000" disabled={form.salaryNegotiable} />
          </Field>
          <Field label="Currency">
            <input className={inputCls} value={form.salaryCurrency} onChange={(e) => set('salaryCurrency', e.target.value.toUpperCase())} maxLength={3} disabled={form.salaryNegotiable} />
          </Field>
          <Field label="Paid">
            <select className={selectCls} value={form.salaryPeriod} onChange={(e) => set('salaryPeriod', e.target.value)} disabled={form.salaryNegotiable}>
              {SALARY_PERIODS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      {/* Visa */}
      <div
        onClick={() => set('visaSponsorship', !form.visaSponsorship)}
        className="w-full bg-white border border-slate-200 rounded-2xl p-6 space-y-5 cursor-pointer hover:border-navy/30 transition-colors group"
      >
        <div className="border-l-2 border-blue-accent pl-3">
          <h2 className="text-lg font-bold text-navy">Visa Sponsorship</h2>
        </div>
        <Checkbox checked={form.visaSponsorship} onChange={(v) => set('visaSponsorship', v)} label="This position offers visa sponsorship" />
      </div>

      {/* Application */}
      <Section title="Application Details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Application URL">
            <input className={inputCls} type="url" value={form.applicationUrl} onChange={(e) => set('applicationUrl', e.target.value)} placeholder="https://careers.company.com/…" />
          </Field>
          <Field label="Closes At">
            <input className={inputCls} type="date" value={form.closesAt} onChange={(e) => set('closesAt', e.target.value)} />
          </Field>
        </div>
      </Section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2 pb-8">
        <button
          type="button"
          onClick={() => router.push(jobsListPath)}
          className="px-5 py-2.5 text-sm font-semibold border-2 border-slate-200 rounded-xl text-slate-600 hover:border-navy/30 hover:bg-section-alt transition-all duration-150 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 text-sm font-bold bg-blue-accent hover:bg-blue-accent-hover active:scale-95 text-navy rounded-xl transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving…' : jobId ? 'Update Job' : 'Create Job'}
        </button>
      </div>
    </form>
  )
}
