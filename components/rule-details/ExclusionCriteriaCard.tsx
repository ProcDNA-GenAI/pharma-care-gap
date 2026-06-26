import { Ban } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { ExclusionCriterion } from '@/lib/types'

interface ExclusionCriteriaCardProps {
  criteria: ExclusionCriterion[]
}

export function ExclusionCriteriaCard({ criteria }: ExclusionCriteriaCardProps) {
  return (
    <Card padding="sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Ban className="h-3.5 w-3.5 text-gray-500" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-gray-900">Exclusion Criteria</h2>
        </div>
        <Badge variant="warning">{criteria.length} criteria</Badge>
      </div>

      <ul className="space-y-2">
        {criteria.map((criterion) => (
          <li key={criterion.id} className="flex items-start gap-2">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-100">
              <svg className="h-2.5 w-2.5 text-red-600" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M3 9L9 3M3 3l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
            <span className="text-xs text-gray-800">{criterion.label}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
