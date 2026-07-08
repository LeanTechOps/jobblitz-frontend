'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateJob, useUpdateJob } from '@/hooks/useJobs'
import { toast } from 'react-toastify'
import { XMarkIcon } from '@heroicons/react/24/outline'

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

const inputCls =
  'w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-accent/40 focus:border-navy transition-colors placeholder:text-slate-300'
const textareaCls = `${inputCls} resize-y min-h-28 leading-relaxed`

export default function JobForm({ initialData, jobId }: JobFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<JobFormData>({ ...DEFAULT, ...initialData })
  const [skillInput, setSkillInput] = useState('')
  const createJob = useCreateJob()
  const updateJob = useUpdateJob(jobId ?? '')

  const set = (field: keyof JobFormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const addSkill = () => {
    const s = skillInput.trim()
    if (s && !form.skills.includes(s)) set('skills', [...form.skills, s])
    setSkillInput('')
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
        await createJob.mutateAsync(payload)
        toast.success('Job created')
      }
      router.push('/admin/jobs')
    } catch {
      toast.error('Failed to save job')
    }
  }

  const Section = ({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) => (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
      <div className="border-l-2 border-blue-accent pl-3">
        <h2 className="text-base font-bold text-navy">{title}</h2>
        {hint && <p className="text-xs text-slate-400 mt-0.5">{hint}</p>}
      </div>
      {children}
    </div>
  )

  const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
    <div>
      <label className="block text-sm font-semibold text-slate-600 mb-1.5">
        {label} {required && <span className="text-peach">*</span>}
      </label>
      {children}
    </div>
  )

  const Checkbox = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
    <label className="flex items-center gap-2.5 cursor-pointer select-none group">
      <div
        onClick={() => onChange(!checked)}
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-150 ${checked ? 'bg-navy border-navy' : 'border-slate-300 group-hover:border-navy/50'}`}
      >
        {checked && <svg className="w-3 h-3 text-blue-accent" fill="none" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </div>
      <span className="text-sm text-slate-700 font-medium">{label}</span>
    </label>
  )

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
            <div className="flex items-center gap-3">
              <input
                className={inputCls}
                value={form.companyDomain}
                onChange={(e) => set('companyDomain', e.target.value.toLowerCase().replace(/^https?:\/\//,'').replace(/^www\./,'').split('/')[0])}
                placeholder="stripe.com"
              />
              {form.companyDomain && (
                <img
                  src={`https://logo.clearbit.com/${form.companyDomain}`}
                  alt=""
                  className="w-9 h-9 rounded-lg object-contain border border-slate-100 bg-white p-0.5 shrink-0"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                  onLoad={(e) => { e.currentTarget.style.display = 'block' }}
                />
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">Domain only — e.g. <span className="font-mono">stripe.com</span></p>
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
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
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
            <select className={inputCls} value={form.type} onChange={(e) => set('type', e.target.value)}>
              {JOB_TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
            </select>
          </Field>
          <Field label="Experience Level">
            <select className={inputCls} value={form.experienceLevel} onChange={(e) => set('experienceLevel', e.target.value)}>
              {EXP_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select className={inputCls} value={form.status} onChange={(e) => set('status', e.target.value)}>
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
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
            placeholder="Type a skill and press Enter or Add"
          />
          <button
            type="button"
            onClick={addSkill}
            className="px-4 py-2 bg-blue-muted hover:bg-blue-accent/20 text-navy font-semibold rounded-xl text-sm transition-colors"
          >
            Add
          </button>
        </div>
        {form.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {form.skills.map((s) => (
              <span key={s} className="flex items-center gap-1.5 bg-navy text-blue-accent text-xs font-bold px-3 py-1.5 rounded-full">
                {s}
                <button type="button" onClick={() => removeSkill(s)} className="hover:text-peach transition-colors">
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
            <select className={inputCls} value={form.salaryPeriod} onChange={(e) => set('salaryPeriod', e.target.value)} disabled={form.salaryNegotiable}>
              {SALARY_PERIODS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      {/* Visa */}
      <Section title="Visa Sponsorship">
        <Checkbox checked={form.visaSponsorship} onChange={(v) => set('visaSponsorship', v)} label="This position offers visa sponsorship" />
      </Section>

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
          onClick={() => router.push('/admin/jobs')}
          className="px-5 py-2.5 text-sm font-semibold border-2 border-slate-200 rounded-xl text-slate-600 hover:border-navy/30 hover:bg-section-alt transition-all duration-150"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 text-sm font-bold bg-blue-accent hover:bg-blue-accent-hover active:scale-95 text-navy rounded-xl transition-all duration-150 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving…' : jobId ? 'Update Job' : 'Create Job'}
        </button>
      </div>
    </form>
  )
}
