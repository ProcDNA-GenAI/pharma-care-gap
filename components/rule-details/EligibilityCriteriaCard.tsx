import { Users } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { EligibilityCriterion } from '@/lib/types'

interface EligibilityCriteriaCardProps {
  criteria: EligibilityCriterion[]
}

export function EligibilityCriteriaCard({ criteria }: EligibilityCriteriaCardProps) {
  return (
    <Card padding="sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="h-3.5 w-3.5 text-gray-500" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-gray-900">Eligibility Criteria (Inclusions)</h2>
        </div>
        <Badge variant="info">{criteria.length} criteria</Badge>
      </div>

      <ul className="space-y-2">
        {criteria.map((criterion) => (
          <li key={criterion.id} className="flex items-start gap-2">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <svg className="h-2.5 w-2.5 text-emerald-600" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div className="flex-1">
              <span className="text-xs text-gray-800">{criterion.label}</span>
              {criterion.subItems && criterion.subItems.length > 0 && (
                <ul className="mt-1 space-y-0.5 pl-2">
                  {criterion.subItems.map((sub, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-400" aria-hidden="true" />
                      <span className="text-[10px] text-gray-600 leading-relaxed">{sub}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
