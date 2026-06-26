import { Database } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { DataRequirement } from '@/lib/types'

interface DataRequirementsCardProps {
  requirements: DataRequirement[]
}

const TYPE_COLORS: Record<DataRequirement['type'], string> = {
  Diagnosis:    'bg-blue-100 text-blue-700',
  Procedure:    'bg-violet-100 text-violet-700',
  Medication:   'bg-amber-100 text-amber-700',
  Laboratory:   'bg-teal-100 text-teal-700',
  Enrollment:   'bg-emerald-100 text-emerald-700',
  Demographics: 'bg-gray-100 text-gray-700',
}

export function DataRequirementsCard({ requirements }: DataRequirementsCardProps) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Database className="h-4 w-4 text-gray-500" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-gray-900">Data Requirements</h2>
      </div>

      <div className="space-y-3">
        {requirements.map((req) => (
          <div key={req.type} className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_COLORS[req.type]}`}>
                {req.type}
              </span>
              {req.required && (
                <span className="text-xs text-gray-400">Required</span>
              )}
            </div>
            {req.codesets.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-end">
                {req.codesets.map((code) => (
                  <Badge key={code} variant="default">{code}</Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
