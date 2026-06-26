import { FileText } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import type { RulePackage } from '@/lib/types'

interface ClinicalSummaryCardProps {
  clinicalSummary: RulePackage['clinicalSummary']
}

export function ClinicalSummaryCard({ clinicalSummary }: ClinicalSummaryCardProps) {
  return (
    <Card padding="sm">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="h-3.5 w-3.5 text-gray-500" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-gray-900">Clinical Summary</h2>
      </div>
      <p className="text-xs text-gray-700 leading-relaxed">{clinicalSummary.text}</p>
      {clinicalSummary.sources.length > 0 && (
        <p className="mt-2 text-[10px] text-gray-400">
          {clinicalSummary.sources.join(' | ')}
        </p>
      )}
    </Card>
  )
}
