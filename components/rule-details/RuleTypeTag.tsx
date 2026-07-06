export type MetricAccent = 'blue' | 'green' | 'purple' | 'orange'

export const ACCENT_STYLES: Record<MetricAccent, {
  bar: string
  iconBg: string
  iconText: string
  tagBg: string
  tagLabel: string
  tagValue: string
}> = {
  blue:   { bar: 'bg-blue-500',   iconBg: 'bg-blue-50',   iconText: 'text-blue-600',   tagBg: 'bg-blue-50',   tagLabel: 'text-[#6B7280]',   tagValue: 'text-[#3B82F6]' },
  green:  { bar: 'bg-green-500',  iconBg: 'bg-green-50',  iconText: 'text-green-600',  tagBg: 'bg-green-50',  tagLabel: 'text-[#6B7280]',  tagValue: 'text-[#16A34A]' },
  purple: { bar: 'bg-purple-500', iconBg: 'bg-purple-50', iconText: 'text-purple-600', tagBg: 'bg-purple-50', tagLabel: 'text-[#6B7280]', tagValue: 'text-[#8B5CF6]' },
  orange: { bar: 'bg-orange-500', iconBg: 'bg-orange-50', iconText: 'text-orange-600', tagBg: 'bg-orange-50', tagLabel: 'text-[#6B7280]', tagValue: 'text-[#F97316]' },
}

interface RuleTypeTagProps {
  accent: MetricAccent
  label?: string
  value: string
  /** Overrides the accent's default value color with an explicit hex */
  valueColor?: string
}

export function RuleTypeTag({ accent, label = 'Care Gap Metric Type', value, valueColor }: RuleTypeTagProps) {
  const s = ACCENT_STYLES[accent]
  return (
    <div className={`flex w-40 shrink-0 flex-col items-start rounded-lg px-4 py-1.5 text-left ${s.tagBg}`}>
      <span className={`text-[9px] font-bold uppercase tracking-wide ${s.tagLabel}`}>{label}</span>
      <span
        className={`text-xs font-semibold leading-tight ${valueColor ? '' : s.tagValue}`}
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </span>
    </div>
  )
}
