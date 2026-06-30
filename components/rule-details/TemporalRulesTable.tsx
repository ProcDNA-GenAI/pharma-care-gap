import { RefreshCw } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import type { TemporalRule } from '@/lib/types'

interface TemporalRulesTableProps {
  rules: TemporalRule[]
}

export function TemporalRulesTable({ rules }: TemporalRulesTableProps) {
  return (
    <Card padding="sm">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-3.5 w-3.5 text-gray-500" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-gray-900">Temporal Rules</h2>
        </div>
        <span className="shrink-0 text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">M4 — Repeat OCS Course Rate</span>
      </div>

      <ul className="space-y-2.5">
        {rules.map((rule, index) => (
          <li key={index}>
            <p className="text-xs text-gray-800 leading-relaxed">{rule.value}</p>
          </li>
        ))}
      </ul>

      <div className="mt-3 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2.5">
        <p className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wide mb-1">Rule Type</p>
        <p className="text-xs text-emerald-800">Episode Count</p>
      </div>
    </Card>
  )
}
