'use client'

import { useState } from 'react'
import { WrenchScrewdriverIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Card } from './shared'
import { normaliseSkill } from '@/lib/utils'

interface Props {
  skills: string[]
  onChange: (skills: string[]) => void
}

export default function SkillsCard({ skills, onChange }: Props) {
  const [input, setInput] = useState('')

  const add = (raw = input) => {
    const s = normaliseSkill(raw)
    if (s && !skills.includes(s)) onChange([...skills, s])
    setInput('')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val.endsWith(',')) {
      add(val.slice(0, -1))
    } else {
      setInput(val)
    }
  }

  const remove = (s: string) => onChange(skills.filter((x) => x !== s))

  return (
    <Card
      title="Skills"
      icon={WrenchScrewdriverIcon}
      iconColor="text-navy"
      iconBg="bg-lime-100"
      stripe="bg-lime-400"
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={handleChange}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
            placeholder="e.g. React, NestJS, Figma…"
            className="flex-1 px-4 py-3 rounded-xl text-base border-2 border-slate-200 text-navy font-medium placeholder:text-slate-300 hover:border-slate-300 focus:border-navy focus:ring-4 focus:ring-navy/10 outline-none transition-all cursor-text"
          />
          <button
            type="button"
            onClick={() => add()}
            className="px-5 py-3 bg-blue-muted hover:bg-blue-accent/20 text-navy font-bold rounded-xl text-sm transition-colors cursor-pointer"
          >
            Add
          </button>
        </div>

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 bg-navy text-blue-accent text-xs font-bold px-3 py-1.5 rounded-full"
              >
                {s}
                <button
                  type="button"
                  onClick={() => remove(s)}
                  className="hover:text-peach transition-colors cursor-pointer"
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        {skills.length === 0 && (
          <p className="text-sm text-slate-400">No skills added yet. Type one above and press Enter.</p>
        )}
      </div>
    </Card>
  )
}
