'use client'

import { useState } from 'react'
import { Pencil, Check, Info } from 'lucide-react'
import { Tooltip } from '@/components/ui/Tooltip'
import { ParameterField } from '@/components/rule-details/ParameterField'
import { Select } from '@/components/ui/Select'
import type { SelectOption } from '@/components/ui/Select'
import type { ParameterValues } from '@/lib/types'

interface BusinessRuleSummaryPanelProps {
  parameters: ParameterValues
  onParameterChange: (key: keyof ParameterValues, value: ParameterValues[keyof ParameterValues]) => void
  editing: boolean
  onToggleEditing: () => void
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

function ReadRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1.5">
      <span className="text-xs leading-snug text-[#4B5563]">{label}</span>
      <span className="shrink-0 text-xs font-semibold text-gray-900">{value}</span>
    </div>
  )
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-gray-100 pt-3 first:border-t-0 first:pt-0">
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">{title}</p>
      <div className="divide-y divide-gray-100">{children}</div>
    </div>
  )
}

export function BusinessRuleSummaryPanel({ parameters, onParameterChange, editing, onToggleEditing }: BusinessRuleSummaryPanelProps) {
  const [compositeLogic, setCompositeLogic] = useState<string | number>('Any_1')

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-[#1D3F8F]">Care Gap Business Rule Configuration</h3>

      <div className="space-y-3">
        <Group title="IBD Cohort Definition">
          {editing ? (
            <>
              <ParameterField label="Look Forward Period" tooltip="Rolling look forward period for OCS accumulation"
                value={parameters.measurementMonths} onChange={(v) => onParameterChange('measurementMonths', v)}
                options={MEASUREMENT_OPTIONS} unit="months" />
              <ParameterField label="Minimum IBD Diagnosis Claims" tooltip="Minimum number of IBD diagnosis claims required to confirm cohort membership"
                value={parameters.ibdMinClaims} onChange={(v) => onParameterChange('ibdMinClaims', v)}
                options={IBD_CLAIMS_OPTIONS} />
              <ParameterField label="Minimum Days Between IBD Diagnosis Claims" tooltip="Minimum days between IBD claims to count as separate encounters"
                value={parameters.ibdGapDays} onChange={(v) => onParameterChange('ibdGapDays', v)}
                options={IBD_GAP_OPTIONS} unit="days" />
            </>
          ) : (
            <>
              <ReadRow label="Look Forward Period" value={`${parameters.measurementMonths} months`} />
              <ReadRow label="Minimum IBD Diagnosis Claims" value={String(parameters.ibdMinClaims)} />
              <ReadRow label="Minimum Days Between IBD Diagnosis Claims" value={`${parameters.ibdGapDays} days`} />
            </>
          )}
        </Group>

        <Group title="Chronic OCS Exposure">
          {editing ? (
            <ParameterField label="Minimum Cumulative OCS Days" tooltip="Cumulative non-overlapping OCS days in the measurement window"
              value={parameters.ocsDurationThreshold} onChange={(v) => onParameterChange('ocsDurationThreshold', v)}
              options={OCS_DAYS_OPTIONS} unit="days" />
          ) : (
            <ReadRow label="Minimum Cumulative OCS Days" value={`${parameters.ocsDurationThreshold} days`} />
          )}
        </Group>

        <Group title="High-Dose OCS Exposure">
          {editing ? (
            <>
              <ParameterField label="Consecutive Days at High Dose" tooltip="Consecutive days at or above the prednisone-equivalent threshold"
                value={parameters.highDoseDurationDays} onChange={(v) => onParameterChange('highDoseDurationDays', v)}
                options={CONSEC_DAYS_OPTIONS} unit="days" />
              <ParameterField label="Prednisone-Equivalent Daily Dose" tooltip="Daily prednisone-equivalent dose threshold"
                value={parameters.highDoseMg} onChange={(v) => onParameterChange('highDoseMg', v)}
                options={PRED_MG_OPTIONS} unit="mg/day" />
              <ParameterField label="Cumulative Prednisone-Equivalent Dose" tooltip="Total cumulative prednisone-equivalent mg threshold"
                value={parameters.highDoseCumulativeMg} onChange={(v) => onParameterChange('highDoseCumulativeMg', v)}
                options={CUM_MG_OPTIONS} unit="mg" />
            </>
          ) : (
            <>
              <ReadRow label="Consecutive Days at High Dose" value={`${parameters.highDoseDurationDays} days`} />
              <ReadRow label="Prednisone-Equivalent Daily Dose" value={`${parameters.highDoseMg} mg/day`} />
              <ReadRow label="Cumulative Prednisone-Equivalent Dose" value={`${parameters.highDoseCumulativeMg} mg`} />
            </>
          )}
        </Group>

        <Group title="Recurrent OCS Courses">
          {editing ? (
            <ParameterField label="Minimum Gap Between OCS Courses" tooltip="Minimum gap between last fill end date and next fill start to define a new course"
              value={parameters.courseGapDays} onChange={(v) => onParameterChange('courseGapDays', v)}
              options={GAP_OPTIONS} unit="days" />
          ) : (
            <ReadRow label="Minimum Gap Between OCS Courses" value={`${parameters.courseGapDays} days`} />
          )}
        </Group>

        <Group title="Composite Care Gap Rule">
          {editing ? (
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
          ) : (
            <ReadRow label="Minimum Number of Care Gap Criteria Met" value="≥ 1 Criteria" />
          )}
        </Group>
      </div>

      <button
        type="button"
        onClick={onToggleEditing}
        className="mt-4 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-brand-600 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50"
      >
        {editing ? <Check className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
        {editing ? 'Done' : 'Edit Rules'}
      </button>
    </div>
  )
}
