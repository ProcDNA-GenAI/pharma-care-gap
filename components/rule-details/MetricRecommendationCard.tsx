import { LucideIcon } from 'lucide-react'
import { RuleTypeTag, ACCENT_STYLES } from './RuleTypeTag'
import type { MetricAccent } from './RuleTypeTag'

export type { MetricAccent }

interface MetricRecommendationCardProps {
  icon:        LucideIcon
  accent:      MetricAccent
  title:       string
  description: string
  bullets:     React.ReactNode[]
  ruleType:    string
  sourceHref?: string
  sourceLabel?: string
}

export function MetricRecommendationCard({
  icon: Icon, accent, title, description, bullets, ruleType, sourceHref, sourceLabel = 'Source',
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
          <div className="flex shrink-0 flex-col gap-2">
            <RuleTypeTag accent={accent} value={ruleType} />
            {sourceHref && (
              <a
                href={sourceHref}
                target="_blank"
                rel="noreferrer"
                className="flex w-40 flex-col items-start rounded-lg bg-gray-100 px-4 py-2 text-left transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
                aria-label={`${sourceLabel} link`}
              >
                <span className="text-[9px] font-bold uppercase tracking-wide text-[#6B7280]">{sourceLabel}</span>
              </a>
            )}
          </div>
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
