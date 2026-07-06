export type MetricAccent = 'blue' | 'violet' | 'emerald' | 'amber' | 'red' | 'gray'

export const ACCENT_STYLES: Record<MetricAccent, {
  bar: string
  iconBg: string
  iconText: string
  tagBg: string
  tagLabel: string
  tagValue: string
}> = {
  blue:    { bar: 'bg-blue-500',    iconBg: 'bg-blue-50',    iconText: 'text-blue-600',    tagBg: 'bg-blue-50',    tagLabel: 'text-slate-400',   tagValue: 'text-blue-700' },
  violet:  { bar: 'bg-violet-500',  iconBg: 'bg-violet-50',  iconText: 'text-violet-600',  tagBg: 'bg-violet-50',  tagLabel: 'text-violet-400',  tagValue: 'text-violet-700' },
  emerald: { bar: 'bg-emerald-500', iconBg: 'bg-emerald-50', iconText: 'text-emerald-600', tagBg: 'bg-emerald-50', tagLabel: 'text-emerald-400', tagValue: 'text-emerald-700' },
  amber:   { bar: 'bg-amber-500',   iconBg: 'bg-amber-50',   iconText: 'text-amber-600',   tagBg: 'bg-amber-50',   tagLabel: 'text-amber-400',   tagValue: 'text-amber-700' },
  red:     { bar: 'bg-red-500',     iconBg: 'bg-red-50',     iconText: 'text-red-600',     tagBg: 'bg-red-50',    tagLabel: 'text-red-400',      tagValue: 'text-red-700' },
  gray:    { bar: 'bg-gray-400',    iconBg: 'bg-gray-100',   iconText: 'text-gray-600',    tagBg: 'bg-gray-100',  tagLabel: 'text-gray-400',     tagValue: 'text-gray-600' },
}

interface RuleTypeTagProps {
  accent: MetricAccent
  value: string
}

export function RuleTypeTag({ accent, value }: RuleTypeTagProps) {
  const s = ACCENT_STYLES[accent]
  return (
    <div className={`flex w-40 flex-col items-start rounded-lg px-4 py-1.5 text-left ${s.tagBg}`}>
      <span className={`text-[9px] font-bold uppercase tracking-wide ${s.tagLabel}`}>Care Gap Metric Type</span>
      <span className={`text-xs font-semibold leading-tight ${s.tagValue}`}>{value}</span>
    </div>
  )
}
