import { LucideIcon } from 'lucide-react'
import { RuleTypeTag, ACCENT_STYLES } from './RuleTypeTag'
import { Toggle } from '@/components/ui/Toggle'
import { cn } from '@/lib/utils/cn'
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
  enabled?:    boolean
  onToggle?:   (enabled: boolean) => void
}

export function MetricRecommendationCard({
  icon: Icon, accent, title, description, bullets, ruleType, sources, sourceUrl, enabled = true, onToggle,
}: MetricRecommendationCardProps) {
  const styles = ACCENT_STYLES[accent]

  return (
    <div className={cn(
      'flex overflow-hidden rounded-xl border shadow-sm transition-all duration-200',
      enabled ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50',
    )}>
      <div className={cn('w-1.5 shrink-0 transition-opacity duration-200', styles.bar, !enabled && 'opacity-30')} aria-hidden="true" />
      <div className="min-w-0 flex-1 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          {/* Left: title + description + bullets */}
          <div className={cn('min-w-0 flex-1 transition-opacity duration-200', !enabled && 'opacity-40')}>
            <div className="mb-2 flex items-center gap-3">
              <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', styles.iconBg, styles.iconText)}>
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              </div>
              <h4 className="text-xl font-semibold text-[#1D3F8F]">{title}</h4>
            </div>
            <p className="mb-2 text-sm leading-relaxed text-[#4B5563]">{description}</p>
            <ul className={cn('space-y-1', !enabled && 'pointer-events-none')}>
              {bullets.map((bullet, idx) => (
                <li key={idx} className="flex gap-1.5 text-sm leading-relaxed text-[#4B5563]">
                  <span className="mt-0.5 text-gray-300" aria-hidden="true">&bull;</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: toggle + metric type tag + source */}
          <div className="flex shrink-0 flex-col items-end gap-2">
            {onToggle && (
              <Toggle
                checked={enabled}
                onChange={onToggle}
                ariaLabel={enabled ? 'Disable this metric' : 'Enable this metric'}
              />
            )}
            <div className={cn('transition-opacity duration-200', !enabled && 'opacity-40')}>
              <RuleTypeTag accent={accent} value={ruleType} />
            </div>
            {sources && sources.length > 0 && (
              <div className={cn('flex w-40 flex-col items-start rounded-lg bg-gray-100 px-4 py-2 transition-opacity duration-200', !enabled && 'opacity-40')}>
                <span className="text-[11px] leading-snug text-[#374151]">
                  <span className="font-bold uppercase tracking-wide text-[#6B7280]">Source: </span>
                  {sourceUrl ? (
                    <a
                      href={sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#004FBA] underline hover:text-[#003a8c]"
                      tabIndex={enabled ? 0 : -1}
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
