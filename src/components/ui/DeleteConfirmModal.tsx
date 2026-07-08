'use client'

import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface Props {
  title: string
  description?: string
  confirmLabel?: string
  loading?: boolean
  onConfirm: () => void
  onClose: () => void
}

export default function DeleteConfirmModal({
  title,
  description = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  loading = false,
  onConfirm,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Peach top stripe */}
        <div className="h-1.5 w-full bg-peach" />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-peach-muted flex items-center justify-center shrink-0">
                <ExclamationTriangleIcon className="w-5 h-5 text-peach" />
              </div>
              <h2 className="text-lg font-bold text-navy">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-navy transition-colors p-1 rounded-lg hover:bg-slate-100 cursor-pointer shrink-0"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <p className="text-sm text-slate-600 leading-relaxed pl-13 ml-0.5">
            {description}
          </p>
          <p className="text-sm font-semibold text-peach mt-2">
            This action cannot be undone.
          </p>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="px-5 py-2.5 text-sm font-bold bg-peach hover:bg-peach-hover active:scale-95 text-white rounded-xl transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {loading && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
