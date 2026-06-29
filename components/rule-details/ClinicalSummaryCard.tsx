import { Users } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import type { RulePackage } from '@/lib/types'

interface ClinicalSummaryCardProps {
  clinicalSummary: RulePackage['clinicalSummary']
}

export function ClinicalSummaryCard({ clinicalSummary }: ClinicalSummaryCardProps) {
  return (
    <Card padding="sm">
      <div className="flex items-center gap-2 mb-3">
        <Users className="h-3.5 w-3.5 text-gray-500" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-gray-900">IBD Cohort Identification (Denominator)</h2>
      </div>

      <p className="text-xs text-gray-800 leading-relaxed">{clinicalSummary.text}</p>

      {clinicalSummary.sources.length > 0 && (
        <p className="mt-2 text-[10px] text-gray-400 leading-relaxed">
          {clinicalSummary.sources.join(' | ')}
        </p>
      )}

      <div className="mt-3 rounded-lg border border-[#004FBA]/10 bg-[#004FBA]/5 px-3 py-2.5">
        <p className="text-[10px] font-semibold text-[#004FBA] uppercase tracking-wide mb-1">Rule Type</p>
        <p className="text-xs text-[#004FBA]/80">Cohort Definition</p>
      </div>
    </Card>
  )
}
