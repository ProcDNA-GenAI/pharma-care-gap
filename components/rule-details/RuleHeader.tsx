import { Activity, MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Tooltip } from '@/components/ui/Tooltip'
import { Button } from '@/components/ui/Button'
import { Download } from 'lucide-react'
import type { RulePackage } from '@/lib/types'

interface RuleHeaderProps {
  rulePackage: RulePackage
  isExporting: boolean
  onExport: () => void
}

const STATUS_VARIANT = {
  Draft: 'draft',
  Active: 'active',
  Archived: 'archived',
} as const

export function RuleHeader({
  rulePackage,
  isExporting,
  onExport,
}: RuleHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      {/* Left: icon + title + description */}
      <div className="flex items-start gap-3 min-w-0">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: '#EEF3FF' }}>
          <MessageSquare className="h-5 w-5" style={{ color: '#004FBA' }} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base font-semibold text-gray-900 leading-snug">
              {rulePackage.careGapTitle}
            </h1>
            <Badge variant={STATUS_VARIANT[rulePackage.status]}>
              {rulePackage.status}
            </Badge>
          </div>
          <p className="mt-0.5 text-xs text-gray-500 leading-relaxed line-clamp-2">
            {rulePackage.careGapDescription}
          </p>
        </div>
      </div>

      {/* Right: confidence + actions */}
      <div className="flex shrink-0 items-center gap-5">
        {/* Evidence confidence */}
        <div className="text-right">
          <div className="flex items-center justify-end gap-1">
            <span className="text-xs text-gray-500">Evidence Confidence</span>
            <Tooltip content="Confidence score based on the strength and consistency of available clinical evidence">
              <Activity className="h-3 w-3 text-gray-400 cursor-help" aria-label="Info" />
            </Tooltip>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#004FBA' }}>{rulePackage.evidenceConfidence}%</p>
          <p className="text-xs text-gray-500">High Confidence</p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            loading={isExporting}
            onClick={onExport}
            iconLeft={<Download className="h-3.5 w-3.5" />}
          >
            Export
          </Button>
        </div>
      </div>
    </div>
  )
}
