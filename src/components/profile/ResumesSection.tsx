'use client'

import { useRef, useState } from 'react'
import axios from 'axios'
import { CloudArrowUpIcon, DocumentTextIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'
import { api } from '@/lib/api'
import ResumeRow from './ResumeRow'
import { SectionLabel } from './shared'
import type { Resume } from './types'
import { MAX_RESUME_SIZE_MB, MAX_RESUME_SIZE } from './types'

const ALLOWED_TYPES: Record<string, boolean> = {
  'application/pdf': true,
  'application/msword': true,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': true,
}

interface Props {
  resumes: Resume[]
  loaded: boolean
  busyResumeId: string | null
  onReload: () => Promise<void>
  onSetDefault: (id: string) => Promise<void>
  onDelete: (id: string) => void
}

export default function ResumesSection({ resumes, loaded, busyResumeId, onReload, onSetDefault, onDelete }: Props) {
  const [uploading, setUploading] = useState(false)
  const [uploadLabel, setUploadLabel] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    if (!ALLOWED_TYPES[file.type]) {
      toast.error('Only PDF, DOC, and DOCX files are accepted.')
      return
    }
    if (file.size > MAX_RESUME_SIZE) {
      toast.error(`File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max is ${MAX_RESUME_SIZE_MB} MB.`)
      return
    }

    setUploading(true)
    const toastId = toast.loading('Preparing upload…')
    try {
      const { resumeId, uploadUrl } = await api.post<{ resumeId: string; key: string; uploadUrl: string }>(
        '/profile/resumes/initiate-upload',
        { originalName: file.name, contentType: file.type, fileSize: file.size },
      )
      toast.update(toastId, { render: 'Uploading…', type: 'default', isLoading: true })
      await axios.put(uploadUrl, file, { headers: { 'Content-Type': file.type } })
      toast.update(toastId, { render: 'Saving…', type: 'default', isLoading: true })
      await api.post('/profile/resumes/confirm-upload', {
        resumeId,
        originalName: file.name,
        contentType: file.type,
        ...(uploadLabel.trim() && { label: uploadLabel.trim() }),
      })
      toast.update(toastId, { render: 'Resume uploaded!', type: 'success', isLoading: false, autoClose: 4000 })
      setUploadLabel('')
      if (fileRef.current) fileRef.current.value = ''
      await onReload()
    } catch (err: unknown) {
      toast.update(toastId, {
        render: err instanceof Error ? err.message : 'Upload failed',
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <SectionLabel>Resumes</SectionLabel>
        <div className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200">
        <div className="h-1.5 w-full bg-emerald-500" />
        <div className="p-7">
          {/* Header */}
          <div className="flex items-center gap-3 mb-7">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
              <DocumentTextIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy">Your Resumes</h2>
              <p className="text-sm text-slate-600 mt-0.5">
                PDF, DOC or DOCX · max {MAX_RESUME_SIZE_MB} MB · multiple versions supported
              </p>
            </div>
          </div>

          {/* Upload + tips */}
          <div className="grid sm:grid-cols-2 gap-6 items-start mb-8">
            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => {
                e.preventDefault()
                setDragOver(false)
                const f = e.dataTransfer.files[0]
                if (f) handleUpload(f)
              }}
              onClick={() => !uploading && fileRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 select-none
                ${uploading ? 'opacity-60 cursor-default' : 'cursor-pointer'}
                ${dragOver ? 'border-navy bg-blue-muted' : 'border-slate-200 hover:border-navy hover:bg-blue-muted/40'}`}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f) }}
              />
              {uploading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-2 border-navy border-t-transparent rounded-full animate-spin" />
                  <p className="text-base font-bold text-navy">Uploading…</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-muted flex items-center justify-center">
                    <CloudArrowUpIcon className="w-7 h-7 text-navy" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-navy">Drop your resume here</p>
                    <p className="text-sm text-slate-500 mt-1">or click to browse files</p>
                  </div>
                </div>
              )}
            </div>

            {/* Label + tips */}
            <div className="space-y-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-navy">
                  Version label <span className="font-normal text-slate-500">(optional)</span>
                </label>
                <input
                  type="text"
                  value={uploadLabel}
                  onChange={e => setUploadLabel(e.target.value)}
                  maxLength={100}
                  placeholder="e.g. Senior Engineer Resume"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-base font-medium text-navy placeholder:text-slate-300 outline-none hover:border-slate-300 focus:border-navy focus:ring-4 focus:ring-navy/10 transition-all"
                />
                <p className="text-sm text-slate-500">Name this version to tell them apart.</p>
              </div>
              <div className="pt-4 border-t-2 border-slate-100 space-y-3">
                <p className="text-sm font-bold text-navy">Resume tips</p>
                {[
                  'Use ATS-friendly formatting',
                  'Keep it to 1–2 pages',
                  'Quantify your achievements',
                  'Tailor keywords to target roles',
                ].map(tip => (
                  <div key={tip} className="flex items-center gap-2.5">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-700">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resume list */}
          <div>
            <p className="text-sm font-bold text-navy mb-4">Uploaded resumes</p>
            {!loaded ? (
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-[72px] bg-slate-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : resumes.length === 0 ? (
              <div className="flex items-center gap-4 border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50">
                <DocumentTextIcon className="w-6 h-6 text-slate-300 flex-shrink-0" />
                <div>
                  <p className="text-base font-bold text-slate-500">No resumes yet</p>
                  <p className="text-sm text-slate-400 mt-0.5">Upload your first resume above to get started</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {resumes.map(r => (
                  <ResumeRow
                    key={r.id}
                    resume={r}
                    onSetDefault={onSetDefault}
                    onDelete={onDelete}
                    busy={busyResumeId}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
