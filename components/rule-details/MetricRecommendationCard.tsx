import { LucideIcon } from 'lucide-react'
import { RuleTypeTag, ACCENT_STYLES } from './RuleTypeTag'
import type { MetricAccent } from './RuleTypeTag'

export type { MetricAccent }

interface MetricRecommendationCardProps {
  icon:     LucideIcon
  accent:   MetricAccent
  title:    string
  bullets:  string[]
  ruleType: string
}

export function MetricRecommendationCard({
  icon: Icon, accent, title, bullets, ruleType,
}: MetricRecommendationCardProps) {
  const styles = ACCENT_STYLES[accent]

  return (
    <div className="flex overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className={`w-1 shrink-0 ${styles.bar}`} aria-hidden="true" />
      <div className="min-w-0 flex-1 px-4 py-3.5">
        <div className="mb-1.5 flex items-center gap-2">
          <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${styles.iconBg} ${styles.iconText}`}>
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          </div>
          <h4 className="text-base font-semibold text-gray-900">{title}</h4>
        </div>

        <ul className="space-y-1 pl-9">
          {bullets.map((bullet, idx) => (
            <li key={idx} className="flex gap-1.5 text-sm leading-relaxed text-gray-600">
              <span className="mt-0.5 text-gray-300" aria-hidden="true">&bull;</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        <div className="mt-2 flex justify-end">
          <RuleTypeTag accent={accent} value={ruleType} />
        </div>
      </div>
    </div>
  )
}
