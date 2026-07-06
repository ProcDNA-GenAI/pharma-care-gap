import { Users } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import type { RulePackage } from '@/lib/types'

interface ClinicalSummaryCardProps {
  clinicalSummary: RulePackage['clinicalSummary']
}

export function ClinicalSummaryCard({ clinicalSummary }: ClinicalSummaryCardProps) {
  return (
    <Card padding="sm">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Users className="h-3.5 w-3.5 text-gray-500" aria-hidden="true" />
          <span className="shrink-0 text-[10px] font-bold text-[#004FBA] bg-[#004FBA]/10 px-1.5 py-0.5 rounded">M1</span>
          <h2 className="text-sm font-semibold text-gray-900">IBD Cohort Identification</h2>
        </div>
        <span className="shrink-0 text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Clinical Summary</span>
      </div>

      <p className="text-xs text-gray-800 leading-relaxed">{clinicalSummary.text}</p>

      {clinicalSummary.sources.length > 0 && (
        <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Sources</p>
          <ul className="space-y-1">
            {clinicalSummary.sources.map((source, idx) => (
              <li key={idx} className="text-[11px] text-gray-600 leading-relaxed">
                <span className="font-semibold text-gray-400">Source {idx + 1}:</span> {source}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-3 rounded-lg border border-[#004FBA]/10 bg-[#004FBA]/5 px-3 py-2.5">
        <p className="text-[10px] font-semibold text-[#004FBA] uppercase tracking-wide mb-1">Care Gap Metric Type</p>
        <p className="text-xs text-[#004FBA]/80">Cohort Definition</p>
      </div>
    </Card>
  )
}
