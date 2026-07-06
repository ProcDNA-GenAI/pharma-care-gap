import { LucideIcon } from 'lucide-react'
import { RuleTypeTag, ACCENT_STYLES } from './RuleTypeTag'
import type { MetricAccent } from './RuleTypeTag'

export type { MetricAccent }

interface MetricRecommendationCardProps {
  icon:        LucideIcon
  accent:      MetricAccent
  title:       string
  description: string
  bullets:     string[]
  ruleType:    string
}

export function MetricRecommendationCard({
  icon: Icon, accent, title, description, bullets, ruleType,
}: MetricRecommendationCardProps) {
  const styles = ACCENT_STYLES[accent]

  return (
    <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className={`w-1.5 shrink-0 ${styles.bar}`} aria-hidden="true" />
      <div className="min-w-0 flex-1 px-5 py-4">
        <div className="mb-2 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${styles.iconBg} ${styles.iconText}`}>
              <Icon className="h-4.5 w-4.5" aria-hidden="true" />
            </div>
            <h4 className="text-xl font-semibold text-[#1D3F8F]">{title}</h4>
          </div>
          <RuleTypeTag accent={accent} value={ruleType} />
        </div>

        <p className="mb-2 text-sm leading-relaxed text-[#4B5563]">{description}</p>

        <ul className="space-y-1">
          {bullets.map((bullet, idx) => (
            <li key={idx} className="flex gap-1.5 text-sm leading-relaxed text-[#4B5563]">
              <span className="mt-0.5 text-gray-300" aria-hidden="true">&bull;</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
