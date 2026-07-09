'use client'

import { useEffect, useState } from 'react'
import { DocumentTextIcon, StarIcon, TrashIcon, ArrowDownTrayIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'
import { useResumeUrl } from '@/hooks/useProfile'
import { toast } from 'react-toastify'
import type { Resume } from './types'

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

interface Props {
  resume: Resume
  onSetDefault: (id: string) => void
  onDelete: (id: string) => void
  busy: string | null
}

function ThumbnailModal({ url, name, onClose }: { url: string; name: string; onClose: () => void }) {
  const [visible, setVisible] = useState(false)

  // Trigger enter transition on mount
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  const close = () => {
    setVisible(false)
    setTimeout(onClose, 180)
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 bg-black/55
        ${visible ? 'opacity-100' : 'opacity-0'}`}
      onClick={close}
    >
      <div
        className={`relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden transition-transform duration-200
          ${visible ? 'scale-100' : 'scale-95'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <p className="text-sm font-bold text-navy truncate pr-4">{name}</p>
          <button
            onClick={close}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer flex-shrink-0"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <img src={url} alt={name} className="w-full object-contain max-h-[85vh]" />
      </div>
    </div>
  )
}

export default function ResumeRow({ resume, onSetDefault, onDelete, busy }: Props) {
  const isBusy = busy === resume.id
  const [showPreview, setShowPreview] = useState(false)
  const { refetch, isFetching: downloading } = useResumeUrl(resume.id)

  const handleDownload = async () => {
    if (downloading) return
    const { data, error } = await refetch()
    if (error || !data?.downloadUrl) {
      toast.error('Failed to get download link')
      return
    }
    window.open(data.downloadUrl, '_blank', 'noreferrer')
  }

  return (
    <>
      <div className={`flex items-center gap-4 rounded-xl border-2 px-4 py-3.5 transition-all duration-150
        ${resume.isDefault
          ? 'border-navy bg-blue-muted'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
        }`}>

        {/* Thumbnail — click to preview */}
        <div
          onClick={() => resume.thumbnailUrl && setShowPreview(true)}
          title={resume.thumbnailUrl ? 'Click to preview' : undefined}
          className={`w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all duration-150
            ${resume.thumbnailUrl ? 'cursor-pointer hover:ring-2 hover:ring-navy hover:ring-offset-1' : 'cursor-default'}
            ${resume.isDefault ? 'border-navy' : 'border-slate-200'}`}
        >
          {resume.thumbnailUrl ? (
            <img src={resume.thumbnailUrl} alt="Resume preview" className="w-full h-full object-cover object-top" />
          ) : (
            <div className={`w-full h-full flex items-center justify-center
              ${resume.isDefault ? 'bg-navy text-blue-accent' : 'bg-slate-100 text-slate-400'}`}>
              <DocumentTextIcon className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-bold text-navy truncate">
              {resume.label || resume.originalName}
            </span>
            {resume.isDefault && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-navy bg-blue-accent/20 border border-navy/20 px-2.5 py-0.5 rounded-full uppercase tracking-wide flex-shrink-0">
                <StarSolid className="w-3 h-3" /> Default
              </span>
            )}
          </div>
          {resume.label && <p className="text-sm text-slate-500 truncate">{resume.originalName}</p>}
          <p className="text-sm text-slate-500 mt-0.5">Uploaded {fmtDate(resume.createdAt)}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
        <button onClick={handleDownload} disabled={downloading} title="Download"
          className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-navy hover:bg-blue-muted disabled:opacity-40 transition-colors cursor-pointer">
          {downloading
            ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            : <ArrowDownTrayIcon className="w-5 h-5" />}
        </button>
          {!resume.isDefault && (
            <button onClick={() => onSetDefault(resume.id)} disabled={isBusy} title="Set as default"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-amber-500 hover:bg-amber-50 disabled:opacity-40 transition-colors cursor-pointer">
              <StarIcon className="w-5 h-5" />
            </button>
          )}
          <button onClick={() => onDelete(resume.id)} disabled={isBusy} title="Delete"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 disabled:opacity-40 transition-colors cursor-pointer">
            {isBusy
              ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              : <TrashIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {showPreview && resume.thumbnailUrl && (
        <ThumbnailModal
          url={resume.thumbnailUrl}
          name={resume.label || resume.originalName}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  )
}
