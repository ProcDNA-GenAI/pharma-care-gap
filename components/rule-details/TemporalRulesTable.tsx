import { Clock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { TemporalRule } from '@/lib/types'

interface TemporalRulesTableProps {
  rules: TemporalRule[]
}

export function TemporalRulesTable({ rules }: TemporalRulesTableProps) {
  return (
    <Card padding="none">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-gray-500" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-gray-900">Temporal Rules</h2>
        </div>
        <Badge variant="info">{rules.length} rules</Badge>
      </div>

      <table className="w-full text-xs">
        <thead>
          <tr className="border-t border-gray-100 bg-gray-50">
            <th className="px-4 py-2 text-left font-medium text-gray-500">Rule</th>
            <th className="px-4 py-2 text-left font-medium text-gray-500">Value</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule, index) => (
            <tr key={index} className="border-t border-gray-100 hover:bg-gray-50/60 transition-colors">
              <td className="px-4 py-2 text-gray-700">{rule.rule}</td>
              <td className="px-4 py-2 text-gray-900 font-medium">{rule.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
