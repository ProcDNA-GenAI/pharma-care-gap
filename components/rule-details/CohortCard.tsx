import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { RuleTypeTag } from './RuleTypeTag'

interface CohortCardProps {
  icon: LucideIcon
  title: string
  description: string
  /** Rule type shown as a "RULE TYPE / value" tag. Omit for plain info cards. */
  badge?: string
  /** 'white' (default) for the rule card, 'muted' for a soft blue info box */
  tone?: 'white' | 'muted'
}

export function CohortCard({ icon: Icon, title, description, badge, tone = 'white' }: CohortCardProps) {
  const isMuted = tone === 'muted'

  return (
    <div
      className={cn(
        'rounded-2xl p-4',
        isMuted
          ? 'border border-blue-100 bg-blue-50'
          : 'border border-gray-200 bg-white shadow-sm',
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
            isMuted ? 'bg-white/70 text-blue-500' : 'bg-blue-50 text-[#004FBA]',
          )}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-sm leading-relaxed text-gray-700">{description}</p>
      {badge && (
        <div className="mt-3">
          <RuleTypeTag accent="blue" value={badge} />
        </div>
      )}
    </div>
  )
}
