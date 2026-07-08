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
  sources?:    string[]
  sourceUrl?:  string
}

export function MetricRecommendationCard({
  icon: Icon, accent, title, description, bullets, ruleType, sources, sourceUrl,
}: MetricRecommendationCardProps) {
  const styles = ACCENT_STYLES[accent]

  return (
    <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className={`w-1.5 shrink-0 ${styles.bar}`} aria-hidden="true" />
      <div className="min-w-0 flex-1 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          {/* Left: title + description + bullets */}
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-3">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${styles.iconBg} ${styles.iconText}`}>
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              </div>
              <h4 className="text-xl font-semibold text-[#1D3F8F]">{title}</h4>
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

          {/* Right: metric type tag + source */}
          <div className="flex shrink-0 flex-col gap-2">
            <RuleTypeTag accent={accent} value={ruleType} />
            {sources && sources.length > 0 && (
              <div className="flex w-40 flex-col items-start rounded-lg bg-gray-100 px-4 py-2">
                <span className="text-[11px] leading-snug text-[#374151]">
                  <span className="font-bold uppercase tracking-wide text-[#6B7280]">Source: </span>
                  {sourceUrl ? (
                    <a
                      href={sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#004FBA] underline hover:text-[#003a8c]"
                    >
                      {sources[0]}
                    </a>
                  ) : (
                    sources[0]
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
