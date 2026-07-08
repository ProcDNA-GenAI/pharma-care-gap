import { LucideIcon, CheckCircle2 } from 'lucide-react'
import { RuleTypeTag } from './RuleTypeTag'
import type { MetricAccent } from './RuleTypeTag'

interface CohortCardProps {
  icon: LucideIcon
  title: string
  description: string
  items: React.ReactNode[]
  badgeLabel?: string
  badgeValue?: string
  accent?: MetricAccent
}

export function CohortCard({ icon: Icon, title, description, items, badgeLabel, badgeValue, accent = 'blue' }: CohortCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Icon className="h-4.5 w-4.5" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-semibold text-[#1D3F8F]">{title}</h3>
        </div>
        {badgeLabel && badgeValue && <RuleTypeTag accent={accent} label={badgeLabel!} value={badgeValue!} valueColor="#2F6FDF" />}
      </div>

      <p className="mb-3 text-sm leading-relaxed text-[#4B5563]">{description}</p>

      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm leading-relaxed text-[#374151]">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
