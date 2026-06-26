import { Code2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import type { RuleLogicStep } from '@/lib/types'

interface RuleLogicCardProps {
  steps: RuleLogicStep[]
}

export function RuleLogicCard({ steps }: RuleLogicCardProps) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Code2 className="h-4 w-4 text-gray-500" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-gray-900">Rule Logic</h2>
      </div>

      <div className="rounded-lg bg-gray-950 px-5 py-4 font-mono text-sm space-y-1.5">
        <p className="text-gray-400">Patient must</p>
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-2">
            {index > 0 && step.operator && (
              <span className="shrink-0 text-brand-400 font-semibold">{step.operator}</span>
            )}
            {index === 0 && <span className="shrink-0 text-transparent select-none">AND</span>}
            <span className="text-emerald-300">• {step.condition}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
