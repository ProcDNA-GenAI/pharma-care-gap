import { Users, TrendingUp, TrendingDown } from 'lucide-react'
import type { ImpactSummary } from '@/lib/types'
import { cn } from '@/lib/utils/cn'

interface ImpactSummaryCardProps {
  impact: ImpactSummary
  isLoading?: boolean
}

export function ImpactSummaryCard({ impact, isLoading = false }: ImpactSummaryCardProps) {
  const isPositive = impact.changeVsDefault >= 0
  const changeSign = isPositive ? '+' : ''
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Users className="h-3.5 w-3.5 text-gray-500" aria-hidden="true" />
        <span className="text-xs font-semibold text-gray-900">Impact Summary</span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-[10px] text-gray-500 mb-0.5">Estimated Eligible Patients</p>
          <p className={cn('text-xl font-bold text-gray-900 tabular-nums transition-opacity', isLoading && 'opacity-40')}>
            {impact.estimatedEligiblePatients.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 mb-0.5">Change vs. Default</p>
          <div className={cn('flex items-center gap-1', isLoading && 'opacity-40')}>
            <TrendIcon
              className={cn('h-3.5 w-3.5', isPositive ? 'text-emerald-500' : 'text-red-500')}
              aria-hidden="true"
            />
            <p className={cn('text-sm font-bold tabular-nums', isPositive ? 'text-emerald-600' : 'text-red-600')}>
              {changeSign}{impact.changeVsDefault.toLocaleString()} ({changeSign}{impact.changePercent}%)
            </p>
          </div>
        </div>
      </div>

      {/* Changes list */}
      {impact.diffs.length > 0 && (
        <div className="space-y-1 border-t border-gray-100 pt-2">
          {impact.diffs.map((diff, index) => (
            <div key={index} className="flex items-center justify-between text-[10px] text-gray-600">
              <span>{diff.label}:</span>
              <span className="font-medium tabular-nums">{diff.from} → {diff.to}</span>
            </div>
          ))}
        </div>
      )}

      <p className="text-[10px] text-gray-400">
        Population calculated on mock dataset of {impact.datasetSize} lives
      </p>
    </div>
  )
}
