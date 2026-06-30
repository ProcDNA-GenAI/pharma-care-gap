import { Activity } from 'lucide-react'
import { Card } from '@/components/ui/Card'

interface DataRequirementsCardProps {
  requirements: unknown[]
}

export function DataRequirementsCard({ requirements: _ }: DataRequirementsCardProps) {
  return (
    <Card padding="sm">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-gray-500" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-gray-900">Data Requirements</h2>
        </div>
        <span className="shrink-0 text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">M5 — Steroid Taper-Failure/Dependence Rate</span>
      </div>

      <p className="text-xs text-gray-800 leading-relaxed">
        Failure to reduce OCS below 10 mg/day prednisone-equivalent within 3 months of course initiation,
        excluding patients with concurrent documented flare.
      </p>

      <div className="mt-3 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2.5">
        <p className="text-[10px] font-semibold text-amber-700 uppercase tracking-wide mb-1">Rule Type</p>
        <p className="text-xs text-amber-800">Dose Trajectory</p>
      </div>
    </Card>
  )
}
