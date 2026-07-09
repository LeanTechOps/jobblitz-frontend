import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { SectionLabel } from './shared'

export default function JobPreferencesCard() {
  return (
    <div>
      <SectionLabel>Job Preferences</SectionLabel>
        <div className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200">
        <div className="h-1.5 w-full bg-amber-500" />
        <div className="p-7 flex items-center gap-5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
            <Cog6ToothIcon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-navy">Job Preferences</h2>
            <p className="text-sm text-slate-600 mt-1 max-w-lg leading-relaxed">
              Set your target roles, preferred locations, salary range and work type.
              JobsFoundry uses these to auto-apply to your best-matched jobs.
            </p>
          </div>
          <span className="flex-shrink-0 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-slate-100 text-slate-500">
            Coming soon
          </span>
        </div>
      </div>
    </div>
  )
}
