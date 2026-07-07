'use client'

import { SlidersHorizontal, Sparkles, Info } from 'lucide-react'
import { ParameterField } from './ParameterField'
import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'
import { cn } from '@/lib/utils/cn'
import type { ParameterValues } from '@/lib/types'
import type { SelectOption } from '@/components/ui/Select'

interface ConfigurableParametersPanelProps {
  parameters: ParameterValues
  onParameterChange: (key: keyof ParameterValues, value: ParameterValues[keyof ParameterValues]) => void
  onGenerateInsights?: () => void
  isGeneratingInsights?: boolean
  /** When true, hides the Generate Insights button (e.g. when used inline on the Insights page) */
  hideActions?: boolean
  /** When true, hides the "Configurable Parameters" panel heading (use when parent already has a title) */
  hideHeader?: boolean
  /** When true, drops the outer border/background/padding — use when nesting inside another card shell */
  bare?: boolean
  /** Render only the IBD cohort group, only the metric-threshold groups, or (default) all groups */
  only?: 'cohort' | 'metrics'
}

// M1 — IBD Cohort
const MEASUREMENT_OPTIONS: SelectOption[]  = [6, 12, 18, 24, 36].map((v) => ({ label: String(v), value: v }))
const IBD_CLAIMS_OPTIONS: SelectOption[]   = [1, 2, 3].map((v) => ({ label: String(v), value: v }))
const IBD_GAP_OPTIONS: SelectOption[]      = [14, 30, 45, 60, 90].map((v) => ({ label: String(v), value: v }))

// M2 — Chronic OCS
const OCS_DAYS_OPTIONS: SelectOption[]     = [60, 75, 90, 120, 180].map((v) => ({ label: String(v), value: v }))

// M3 — High-dose OCS
const CONSEC_DAYS_OPTIONS: SelectOption[]  = [30, 45, 60, 90].map((v) => ({ label: String(v), value: v }))
const PRED_MG_OPTIONS: SelectOption[]      = [5, 7.5, 10, 15, 20].map((v) => ({ label: String(v), value: v }))
const CUM_MG_OPTIONS: SelectOption[]       = [300, 450, 600, 900].map((v) => ({ label: String(v), value: v }))

// M4 — Repeat course
const GAP_OPTIONS: SelectOption[]          = [14, 21, 30, 45, 60].map((v) => ({ label: String(v), value: v }))

export function GroupHeading({ children, tooltip }: { children: string; tooltip?: string }) {
  return (
    <p className="mt-4 mb-1.5 flex items-center gap-1 text-[10px] font-bold text-black uppercase tracking-wider">
      {children}
      {tooltip && (
        <Tooltip content={tooltip} className="normal-case font-normal tracking-normal">
          <Info className="h-3 w-3 text-gray-400 cursor-help shrink-0" aria-label="Group info" />
        </Tooltip>
      )}
    </p>
  )
}

export function ConfigurableParametersPanel({
  parameters,
  onParameterChange,
  onGenerateInsights,
  isGeneratingInsights = false,
  hideActions = false,
  hideHeader = false,
  bare = false,
  only,
}: ConfigurableParametersPanelProps) {
  const showCohort  = only !== 'metrics'
  const showMetrics = only !== 'cohort'
  return (
    <div className="flex flex-col gap-3">
      <div className={cn(!bare && 'rounded-xl border border-gray-200 bg-white p-4')}>

        {/* Panel header */}
        {!hideHeader && (
          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal className="h-3.5 w-3.5" style={{ color: '#004FBA' }} aria-hidden="true" />
            <h2 className="text-sm font-semibold text-gray-900">Configurable Parameters</h2>
            <span className="text-xs text-gray-400">(Select Values to analyze Care Gap)</span>
          </div>
        )}

        {/* M1 — IBD Cohort */}
        {showCohort && (
          <>
            <GroupHeading>IBD Patient Cohort Eligibility</GroupHeading>
            <div className="divide-y divide-gray-100">
              <ParameterField
                label="Measurement Window"
                tooltip="Rolling look forward period for OCS accumulation"
                value={parameters.measurementMonths}
                onChange={(v) => onParameterChange('measurementMonths', v)}
                options={MEASUREMENT_OPTIONS}
                unit="months"
              />
              <ParameterField
                label="Minimum IBD Claims"
                tooltip="Minimum number of IBD diagnosis claims required to confirm cohort membership"
                value={parameters.ibdMinClaims}
                onChange={(v) => onParameterChange('ibdMinClaims', v)}
                options={IBD_CLAIMS_OPTIONS}
              />
              <ParameterField
                label="Min Gap Between Claims"
                tooltip="Minimum days between IBD claims to count as separate encounters"
                value={parameters.ibdGapDays}
                onChange={(v) => onParameterChange('ibdGapDays', v)}
                options={IBD_GAP_OPTIONS}
                unit="days"
              />
            </div>
          </>
        )}

        {showMetrics && (
          <>
            {/* M2 — Chronic OCS Use */}
            <GroupHeading>Chronic OCS Use</GroupHeading>
            <div className="divide-y divide-gray-100">
              <ParameterField
                label="Cumulative OCS Days Threshold"
                tooltip="Cumulative non-overlapping OCS days in measurement window (STOCKPILE logic)"
                value={parameters.ocsDurationThreshold}
                onChange={(v) => onParameterChange('ocsDurationThreshold', v)}
                options={OCS_DAYS_OPTIONS}
                unit="days"
              />
            </div>

            {/* M3 — High-Dose OCS Exposure */}
            <GroupHeading>High-Dose OCS Exposure</GroupHeading>
            <div className="divide-y divide-gray-100">
              <ParameterField
                label="Consecutive Days at High Dose"
                tooltip="Consecutive days at or above the prednisone-equivalent threshold"
                value={parameters.highDoseDurationDays}
                onChange={(v) => onParameterChange('highDoseDurationDays', v)}
                options={CONSEC_DAYS_OPTIONS}
                unit="days"
              />
              <ParameterField
                label="Prednisone-Equivalent Threshold"
                tooltip="Daily prednisone-equivalent dose threshold (mg/day)"
                value={parameters.highDoseMg}
                onChange={(v) => onParameterChange('highDoseMg', v)}
                options={PRED_MG_OPTIONS}
                unit="mg/day"
              />
              <ParameterField
                label="Cumulative OCS mg Threshold"
                tooltip="Total cumulative prednisone-equivalent mg threshold"
                value={parameters.highDoseCumulativeMg}
                onChange={(v) => onParameterChange('highDoseCumulativeMg', v)}
                options={CUM_MG_OPTIONS}
                unit="mg"
              />
            </div>

            {/* M4 — Repeat OCS Course */}
            <GroupHeading>Repeat OCS Course</GroupHeading>
            <div className="divide-y divide-gray-100">
              <ParameterField
                label="Inter-Course Gap (New Course Trigger)"
                tooltip="Minimum gap between last fill end date and next fill start to define a new course"
                value={parameters.courseGapDays}
                onChange={(v) => onParameterChange('courseGapDays', v)}
                options={GAP_OPTIONS}
                unit="days"
              />
            </div>
          </>
        )}

      </div>

      {/* Generate Insights */}
      {!hideActions && onGenerateInsights && (
        <Button
          variant="primary"
          size="md"
          className="w-full"
          loading={isGeneratingInsights}
          onClick={onGenerateInsights}
          iconLeft={<Sparkles className="h-4 w-4" />}
          style={{ backgroundColor: '#004FBA' }}
        >
          Generate Care Gap Insights
        </Button>
      )}
    </div>
  )
}
