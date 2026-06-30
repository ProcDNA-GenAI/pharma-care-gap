import { BarChart2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import type { ExclusionCriterion } from '@/lib/types'

interface ExclusionCriteriaCardProps {
  criteria: ExclusionCriterion[]
}

export function ExclusionCriteriaCard({ criteria }: ExclusionCriteriaCardProps) {
  return (
    <Card padding="sm">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-3.5 w-3.5 text-gray-500" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-gray-900">Exclusion Criteria</h2>
        </div>
        <span className="shrink-0 text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">M3 — High-Dose/Prolonged OCS Exposure Rate</span>
      </div>

      <ul className="space-y-2.5">
        {criteria.map((criterion) => (
          <li key={criterion.id}>
            <p className="text-xs text-gray-800 leading-relaxed">{criterion.label}</p>
          </li>
        ))}
      </ul>

      <div className="mt-3 rounded-lg border border-violet-100 bg-violet-50 px-3 py-2.5">
        <p className="text-[10px] font-semibold text-violet-700 uppercase tracking-wide mb-1">Rule Type</p>
        <p className="text-xs text-violet-800">Dose + Duration Composite</p>
      </div>
    </Card>
  )
}
