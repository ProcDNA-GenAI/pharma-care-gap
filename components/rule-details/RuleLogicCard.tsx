import { Layers } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import type { RuleLogicStep } from '@/lib/types'

interface RuleLogicCardProps {
  steps: RuleLogicStep[]
}

export function RuleLogicCard({ steps }: RuleLogicCardProps) {
  return (
    <Card padding="sm">
      <div className="flex items-center gap-2 mb-3">
        <Layers className="h-3.5 w-3.5 text-gray-500" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-gray-900">Composite OCS Overuse Flag (Primary KPI)</h2>
      </div>

      <ul className="space-y-2.5">
        {steps.map((step, index) => (
          <li key={index}>
            <p className="text-xs text-gray-800 leading-relaxed">{step.condition}</p>
          </li>
        ))}
      </ul>

      <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Rule Type</p>
        <p className="text-xs text-gray-700">Composite OR Logic</p>
      </div>
    </Card>
  )
}
