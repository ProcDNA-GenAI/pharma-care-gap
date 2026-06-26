import { BookOpen } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { EvidenceMapping } from '@/lib/types'

interface EvidenceMappingCardProps {
  mappings: EvidenceMapping[]
}

const GRADE_VARIANT: Record<EvidenceMapping['evidenceGrade'], 'success' | 'info' | 'warning' | 'default'> = {
  A:      'success',
  B:      'info',
  C:      'warning',
  Expert: 'default',
}

export function EvidenceMappingCard({ mappings }: EvidenceMappingCardProps) {
  return (
    <Card padding="none">
      <div className="flex items-center gap-2 px-5 py-4">
        <BookOpen className="h-4 w-4 text-gray-500" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-gray-900">Evidence Mapping</h2>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-t border-gray-100 bg-gray-50">
            <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-500">Rule</th>
            <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-500">Evidence</th>
            <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-500">Grade</th>
          </tr>
        </thead>
        <tbody>
          {mappings.map((mapping, index) => (
            <tr key={index} className="border-t border-gray-100 hover:bg-gray-50/60 transition-colors">
              <td className="px-5 py-3 text-gray-700 max-w-xs">{mapping.rule}</td>
              <td className="px-5 py-3">
                <p className="text-gray-900 font-medium text-xs">{mapping.source}</p>
                <p className="text-gray-500 text-xs mt-0.5">{mapping.recommendation}</p>
              </td>
              <td className="px-5 py-3">
                <Badge variant={GRADE_VARIANT[mapping.evidenceGrade]}>Grade {mapping.evidenceGrade}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
