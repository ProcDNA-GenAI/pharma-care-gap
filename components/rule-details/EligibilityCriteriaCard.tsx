import { Clock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import type { EligibilityCriterion } from '@/lib/types'

interface EligibilityCriteriaCardProps {
  criteria: EligibilityCriterion[]
}

export function EligibilityCriteriaCard({ criteria }: EligibilityCriteriaCardProps) {
  return (
    <Card padding="sm">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-gray-500" aria-hidden="true" />
          <span className="shrink-0 text-[10px] font-bold text-[#004FBA] bg-[#004FBA]/10 px-1.5 py-0.5 rounded">M2</span>
          <h2 className="text-sm font-semibold text-gray-900">Chronic/Prolonged OCS Use Rate</h2>
        </div>
        <span className="shrink-0 text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Eligibility Criteria</span>
      </div>

      <ul className="space-y-2.5">
        {criteria.map((criterion) => (
          <li key={criterion.id}>
            <p className="text-xs text-gray-800 leading-relaxed">{criterion.label}</p>
            {criterion.subItems && criterion.subItems.length > 0 && (
              <ul className="mt-1.5 space-y-1 pl-3 border-l-2 border-gray-100">
                {criterion.subItems.map((sub, idx) => (
                  <li key={idx} className="text-[11px] text-gray-500 leading-relaxed">{sub}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2.5">
        <p className="text-[10px] font-semibold text-blue-700 uppercase tracking-wide mb-1">Care Gap Metric Type</p>
        <p className="text-xs text-blue-800">Duration-Based</p>
      </div>
    </Card>
  )
}
