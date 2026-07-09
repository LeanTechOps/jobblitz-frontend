'use client'

import { ShieldCheckIcon } from '@heroicons/react/24/outline'
import { Card } from './shared'

const VISA_OPTIONS: { value: string; label: string }[] = [
  { value: 'US_CITIZEN',  label: 'US Citizen' },
  { value: 'GREEN_CARD',  label: 'Green Card' },
  { value: 'H1B',         label: 'H-1B' },
  { value: 'H4_EAD',      label: 'H-4 EAD' },
  { value: 'L1',          label: 'L-1' },
  { value: 'O1',          label: 'O-1' },
  { value: 'TN',          label: 'TN Visa' },
  { value: 'F1_OPT',      label: 'F-1 OPT' },
  { value: 'F1_CPT',      label: 'F-1 CPT' },
  { value: 'EAD',         label: 'EAD' },
  { value: 'OTHER',       label: 'Other' },
]

interface Props {
  value: string | null
  onChange: (v: string | null) => void
}

export default function VisaCard({ value, onChange }: Props) {
  return (
    <Card
      title="Work Authorization"
      icon={ShieldCheckIcon}
      iconColor="text-teal-600"
      iconBg="bg-teal-50"
      stripe="bg-teal-400"
    >
      <p className="text-sm text-slate-500 -mt-2 mb-1">Select your current US work authorization status.</p>
      <div className="flex flex-wrap gap-2">
        {VISA_OPTIONS.map((opt) => {
          const active = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(active ? null : opt.value)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-150 cursor-pointer ${
                active
                  ? 'bg-navy text-blue-accent border-navy'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-navy/30 hover:text-navy'
              }`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
      {value && (
        <p className="text-xs text-slate-400 mt-1">
          Click the selected option again to clear it.
        </p>
      )}
    </Card>
  )
}
