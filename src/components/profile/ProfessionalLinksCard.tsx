import { LinkIcon } from '@heroicons/react/24/outline'
import { Card, Field } from './shared'
import type { ProfileData } from './types'

interface Props {
  form: ProfileData
  loaded: boolean
  onChange: (k: keyof ProfileData) => (v: string) => void
}

export default function ProfessionalLinksCard({ form, loaded, onChange }: Props) {
  return (
    <Card
      title="Professional Links"
      icon={LinkIcon}
      iconColor="text-violet-600"
      iconBg="bg-violet-50"
      stripe="bg-violet-500"
    >
      {!loaded ? (
        <div className="space-y-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          {/* LinkedIn */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-navy">LinkedIn</label>
            <div className="flex border-2 border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 focus-within:border-navy focus-within:ring-4 focus-within:ring-navy/10 transition-all bg-white">
              <span className="px-4 py-3 bg-slate-50 border-r-2 border-slate-200 text-sm font-bold text-slate-500 whitespace-nowrap flex items-center">
                linkedin.com/in/
              </span>
              <input
                type="text"
                value={form.linkedinUrl.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, '')}
                onChange={e => onChange('linkedinUrl')(e.target.value ? `https://linkedin.com/in/${e.target.value}` : '')}
                placeholder="your-handle"
                className="flex-1 px-4 py-3 text-base font-medium text-navy outline-none bg-white placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* GitHub */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-navy">GitHub</label>
            <div className="flex border-2 border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 focus-within:border-navy focus-within:ring-4 focus-within:ring-navy/10 transition-all bg-white">
              <span className="px-4 py-3 bg-slate-50 border-r-2 border-slate-200 text-sm font-bold text-slate-500 whitespace-nowrap flex items-center">
                github.com/
              </span>
              <input
                type="text"
                value={form.githubUrl.replace(/^https?:\/\/(www\.)?github\.com\//i, '')}
                onChange={e => onChange('githubUrl')(e.target.value ? `https://github.com/${e.target.value}` : '')}
                placeholder="your-handle"
                className="flex-1 px-4 py-3 text-base font-medium text-navy outline-none bg-white placeholder:text-slate-300"
              />
            </div>
          </div>

          <Field
            label="Portfolio / Website"
            value={form.portfolioUrl}
            onChange={onChange('portfolioUrl')}
            placeholder="https://yoursite.com"
            type="url"
          />

          {/* Link pills */}
          {(form.linkedinUrl || form.githubUrl || form.portfolioUrl) && (
            <div className="flex flex-wrap gap-2 pt-5 border-t-2 border-slate-100">
              {form.linkedinUrl.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, '') && (
                <a href={form.linkedinUrl} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-navy bg-blue-muted border-2 border-navy/20 px-4 py-2 rounded-xl hover:bg-blue-muted/70 transition-colors cursor-pointer">
                  LinkedIn ↗
                </a>
              )}
              {form.githubUrl.replace(/^https?:\/\/(www\.)?github\.com\//i, '') && (
                <a href={form.githubUrl} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-navy bg-slate-100 border-2 border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer">
                  GitHub ↗
                </a>
              )}
              {form.portfolioUrl && (
                <a href={form.portfolioUrl} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-violet-700 bg-violet-50 border-2 border-violet-200 px-4 py-2 rounded-xl hover:bg-violet-100 transition-colors cursor-pointer">
                  Portfolio ↗
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
