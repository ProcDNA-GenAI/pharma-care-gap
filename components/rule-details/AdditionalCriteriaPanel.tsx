'use client'

import { useState } from 'react'
import { Info } from 'lucide-react'
import { ParameterField } from './ParameterField'
import { Toggle } from '@/components/ui/Toggle'
import { Tooltip } from '@/components/ui/Tooltip'
import { Select } from '@/components/ui/Select'
import { cn } from '@/lib/utils/cn'
import type { SelectOption } from '@/components/ui/Select'
import type { ParameterValues } from '@/lib/types'

interface AdditionalCriteriaPanelProps {
  parameters: ParameterValues
  onParameterChange: (key: keyof ParameterValues, value: ParameterValues[keyof ParameterValues]) => void
}

const MEASUREMENT_OPTIONS: SelectOption[]  = [6, 12, 18, 24, 36].map((v) => ({ label: String(v), value: v }))
const IBD_CLAIMS_OPTIONS: SelectOption[]   = [1, 2, 3].map((v) => ({ label: String(v), value: v }))
const IBD_GAP_OPTIONS: SelectOption[]      = [14, 30, 45, 60, 90].map((v) => ({ label: String(v), value: v }))
const OCS_DAYS_OPTIONS: SelectOption[]     = [60, 75, 90, 120, 180].map((v) => ({ label: String(v), value: v }))
const CONSEC_DAYS_OPTIONS: SelectOption[]  = [30, 45, 60, 90].map((v) => ({ label: String(v), value: v }))
const PRED_MG_OPTIONS: SelectOption[]      = [5, 7.5, 10, 15, 20].map((v) => ({ label: String(v), value: v }))
const CUM_MG_OPTIONS: SelectOption[]       = [300, 450, 600, 900].map((v) => ({ label: String(v), value: v }))
const GAP_OPTIONS: SelectOption[]          = [14, 21, 30, 45, 60].map((v) => ({ label: String(v), value: v }))

const COMPOSITE_OPTIONS: SelectOption[] = [
  { label: '≥ 1 Criteria', value: 'Any_1' },
  { label: '≥ 2 Criteria', value: 'Any_2' },
  { label: 'All Criteria', value: 'All_3' },
]

interface ConfigCardProps {
  title: string
  children: React.ReactNode
  enabled?: boolean
  onToggle?: (enabled: boolean) => void
}

function ConfigCard({ title, children, enabled = true, onToggle }: ConfigCardProps) {
  return (
    <div className={cn(
      'rounded-xl border p-4 shadow-sm transition-all duration-200',
      enabled ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50',
    )}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className={cn('text-sm font-semibold text-[#1D3F8F] transition-opacity duration-200', !enabled && 'opacity-40')}>
          {title}
        </h3>
        {onToggle && (
          <Toggle
            checked={enabled}
            onChange={onToggle}
            showLabel
            ariaLabel={enabled ? `Disable ${title}` : `Enable ${title}`}
          />
        )}
      </div>
      <div className={cn('divide-y divide-gray-100 transition-opacity duration-200', !enabled && 'pointer-events-none opacity-40')}>
        {children}
      </div>
    </div>
  )
}

export function AdditionalCriteriaPanel({ parameters, onParameterChange }: AdditionalCriteriaPanelProps) {
  const [compositeLogic, setCompositeLogic] = useState<string | number>('Any_1')

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="mb-1 text-xl font-semibold text-[#1D3F8F]">Care Gap Business Rules Configuration</h2>
        <p className="text-sm leading-relaxed text-[#5F6B7A]">
          Set the clinical rules used to define patient cohort and evaluate OCS overuse care gap.
        </p>
      </div>

      <div className="space-y-4">

      <ConfigCard
        title="Patient Cohort Definition"
        enabled={parameters.m1Enabled}
        onToggle={(v) => onParameterChange('m1Enabled', v)}
      >
        <ParameterField
          label="Look Forward Period"
          tooltip="Rolling look forward period for OCS accumulation"
          value={parameters.measurementMonths}
          onChange={(v) => onParameterChange('measurementMonths', v)}
          options={MEASUREMENT_OPTIONS}
          unit="months"
        />
        <ParameterField
          label="Minimum IBD Diagnosis Claims"
          tooltip="Minimum number of IBD diagnosis claims required to confirm cohort membership"
          value={parameters.ibdMinClaims}
          onChange={(v) => onParameterChange('ibdMinClaims', v)}
          options={IBD_CLAIMS_OPTIONS}
        />
        <ParameterField
          label="Minimum Days Between IBD Diagnosis Claims"
          tooltip="Minimum days between IBD claims to count as separate encounters"
          value={parameters.ibdGapDays}
          onChange={(v) => onParameterChange('ibdGapDays', v)}
          options={IBD_GAP_OPTIONS}
          unit="days"
        />
      </ConfigCard>

      <ConfigCard
        title="Chronic OCS Exposure"
        enabled={parameters.m2Enabled}
        onToggle={(v) => onParameterChange('m2Enabled', v)}
      >
        <ParameterField
          label="Minimum Cumulative OCS Days"
          tooltip="Cumulative non-overlapping OCS days in the measurement window"
          value={parameters.ocsDurationThreshold}
          onChange={(v) => onParameterChange('ocsDurationThreshold', v)}
          options={OCS_DAYS_OPTIONS}
          unit="days"
        />
      </ConfigCard>

      <ConfigCard
        title="High-Dose OCS Exposure"
        enabled={parameters.m3Enabled}
        onToggle={(v) => onParameterChange('m3Enabled', v)}
      >
        <ParameterField
          label="Consecutive Days at High Dose"
          tooltip="Consecutive days at or above the prednisone-equivalent threshold"
          value={parameters.highDoseDurationDays}
          onChange={(v) => onParameterChange('highDoseDurationDays', v)}
          options={CONSEC_DAYS_OPTIONS}
          unit="days"
        />
        <ParameterField
          label="Prednisone-Equivalent Daily Dose"
          tooltip="Daily prednisone-equivalent dose threshold"
          value={parameters.highDoseMg}
          onChange={(v) => onParameterChange('highDoseMg', v)}
          options={PRED_MG_OPTIONS}
          unit="mg/day"
        />
        <ParameterField
          label="Cumulative Prednisone-Equivalent Dose"
          tooltip="Total cumulative prednisone-equivalent mg threshold"
          value={parameters.highDoseCumulativeMg}
          onChange={(v) => onParameterChange('highDoseCumulativeMg', v)}
          options={CUM_MG_OPTIONS}
          unit="mg"
        />
      </ConfigCard>

      <ConfigCard
        title="Recurrent OCS Courses"
        enabled={parameters.m4Enabled}
        onToggle={(v) => onParameterChange('m4Enabled', v)}
      >
        <ParameterField
          label="Minimum Gap Between OCS Courses"
          tooltip="Minimum gap between last fill end date and next fill start to define a new course"
          value={parameters.courseGapDays}
          onChange={(v) => onParameterChange('courseGapDays', v)}
          options={GAP_OPTIONS}
          unit="days"
        />
      </ConfigCard>

      <ConfigCard
        title="Composite Care Gap Rule"
        enabled={parameters.m7Enabled}
        onToggle={(v) => onParameterChange('m7Enabled', v)}
      >
        <div className="flex items-center gap-2 py-1.5">
          <div className="flex flex-1 min-w-0 items-center gap-1">
            <span className="text-xs text-[#4B5563]">Minimum Number of Care Gap Criteria Met</span>
            <Tooltip content="Patients who meet the IBD cohort eligibility criteria are evaluated against the selected OCS care gap measures.">
              <Info className="h-3 w-3 shrink-0 cursor-help text-gray-400" />
            </Tooltip>
          </div>
          <div className="w-[110px] shrink-0">
            <Select
              options={COMPOSITE_OPTIONS}
              value={compositeLogic}
              onChange={setCompositeLogic}
              ariaLabel="Minimum Number of Care Gap Criteria Met"
              fullWidth
            />
          </div>
        </div>
      </ConfigCard>

      </div>
    </div>
  )
}
