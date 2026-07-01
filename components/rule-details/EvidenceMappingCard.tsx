import { TrendingDown } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import type { EvidenceMapping } from '@/lib/types'

interface EvidenceMappingCardProps {
  mappings: EvidenceMapping[]
}

export function EvidenceMappingCard({ mappings }: EvidenceMappingCardProps) {
  return (
    <Card padding="sm">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <TrendingDown className="h-3.5 w-3.5 text-gray-500" aria-hidden="true" />
          <span className="shrink-0 text-[10px] font-bold text-[#004FBA] bg-[#004FBA]/10 px-1.5 py-0.5 rounded">M6</span>
          <h2 className="text-sm font-semibold text-gray-900">Post-Discontinuation Relapse Rate</h2>
        </div>
        <span className="shrink-0 text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Evidence Mapping</span>
      </div>

      <ul className="space-y-2.5">
        {mappings.map((mapping, index) => (
          <li key={index}>
            <p className="text-xs text-gray-800 leading-relaxed">{mapping.recommendation}</p>
          </li>
        ))}
      </ul>

      <div className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5">
        <p className="text-[10px] font-semibold text-red-700 uppercase tracking-wide mb-1">Rule Type</p>
        <p className="text-xs text-red-800">Post-Exposure Surveillance</p>
      </div>
    </Card>
  )
}
