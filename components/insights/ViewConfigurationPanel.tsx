'use client'

import { Settings, RotateCcw, Check } from 'lucide-react'
import { Select } from '@/components/ui/Select'
import type { SelectOption } from '@/components/ui/Select'
import type { ParameterValues } from '@/lib/types'

// ─── Options ──────────────────────────────────────────────────────────────────

const MEASUREMENT_OPTIONS: SelectOption[] = [6, 12, 18, 24, 36].map((v) => ({ label: `${v} months`, value: v }))
const IBD_CLAIMS_OPTIONS: SelectOption[]  = [1, 2, 3, 4].map((v) => ({ label: String(v), value: v }))
const IBD_GAP_OPTIONS: SelectOption[]     = [14, 30, 45, 60, 90].map((v) => ({ label: `${v} days`, value: v }))
const OCS_DAYS_OPTIONS: SelectOption[]    = [60, 75, 90, 120, 180].map((v) => ({ label: `${v} days`, value: v }))
const CONSEC_DAYS_OPTIONS: SelectOption[] = [30, 45, 60, 90].map((v) => ({ label: `${v} days`, value: v }))
const PRED_MG_OPTIONS: SelectOption[]     = [5, 7.5, 10, 15, 20].map((v) => ({ label: `${v} mg/day`, value: v }))
const CUM_MG_OPTIONS: SelectOption[]      = [300, 450, 600, 900].map((v) => ({ label: `${v} mg`, value: v }))
const GAP_OPTIONS: SelectOption[]         = [14, 21, 30, 45, 60].map((v) => ({ label: `${v} days`, value: v }))

const COMPOSITE_OPTIONS: SelectOption[] = [
  { label: '≥ 1 Criterion', value: 'Any_1' },
  { label: '≥ 2 Criteria',  value: 'Any_2' },
  { label: 'All Criteria',  value: 'All_3' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-2 border-t border-gray-100 pt-3 mt-2 first:mt-0 first:border-t-0 first:pt-0">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EEF3FF] text-[10px] font-bold text-[#004FBA]">
        {number}
      </span>
      <p className="text-xs font-semibold text-[#1D3F8F]">{title}</p>
    </div>
  )
}

function SubHeader({ title }: { title: string }) {
  return (
    <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">{title}</p>
  )
}

interface ConfigRowProps {
  label: string
  options: SelectOption[]
  value: number | string
  onChange: (v: number | string) => void
}

function ConfigRow({ label, options, value, onChange }: ConfigRowProps) {
  return (
    <div className="flex items-center justify-between gap-2 py-1">
      <span className="text-[11px] leading-snug text-[#4B5563]">{label}</span>
      <div className="w-[108px] shrink-0">
        <Select
          options={options}
          value={value}
          onChange={onChange}
          ariaLabel={label}
          fullWidth
        />
      </div>
    </div>
  )
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export interface ViewConfigurationPanelProps {
  /** Draft params (live edits before Apply) */
  draft: ParameterValues
  onDraftChange: (key: keyof ParameterValues, value: ParameterValues[keyof ParameterValues]) => void
  /** Called when user clicks "Apply Configuration" */
  onApply: (params: ParameterValues) => void
  /** Called when user clicks "Reset to Default" */
  onReset: () => void
}

export function ViewConfigurationPanel({
  draft,
  onDraftChange,
  onApply,
  onReset,
}: ViewConfigurationPanelProps) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3 shrink-0">
        <Settings className="h-4 w-4 text-[#004FBA]" />
        <h3 className="text-sm font-semibold text-[#1D3F8F]">View Configuration</h3>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 py-3">

        {/* 1. Cohort Definition */}
        <SectionHeader number={1} title="Cohort Definition" />
        <div className="mt-1 divide-y divide-gray-50">
          <ConfigRow
            label="Measurement Period"
            options={MEASUREMENT_OPTIONS}
            value={draft.measurementMonths}
            onChange={(v) => onDraftChange('measurementMonths', v as number)}
          />
          <ConfigRow
            label="Minimum IBD Diagnosis Claims"
            options={IBD_CLAIMS_OPTIONS}
            value={draft.ibdMinClaims}
            onChange={(v) => onDraftChange('ibdMinClaims', v as number)}
          />
          <ConfigRow
            label="Minimum Days Between IBD Diagnosis Claims"
            options={IBD_GAP_OPTIONS}
            value={draft.ibdGapDays}
            onChange={(v) => onDraftChange('ibdGapDays', v as number)}
          />
        </div>

        {/* 2. Care Gap Metrics */}
        {(draft.m2Enabled || draft.m3Enabled || draft.m4Enabled) && (
          <>
            <SectionHeader number={2} title="Care Gap Metrics" />

            {draft.m2Enabled && (
              <>
                <SubHeader title="Chronic OCS Exposure (Duration-Based)" />
                <div className="divide-y divide-gray-50">
                  <ConfigRow
                    label="Minimum Cumulative OCS Days"
                    options={OCS_DAYS_OPTIONS}
                    value={draft.ocsDurationThreshold}
                    onChange={(v) => onDraftChange('ocsDurationThreshold', v as number)}
                  />
                </div>
              </>
            )}

            {draft.m3Enabled && (
              <>
                <SubHeader title="High-Dose OCS Exposure (Dose-Based)" />
                <div className="divide-y divide-gray-50">
                  <ConfigRow
                    label="Consecutive Days at High Dose"
                    options={CONSEC_DAYS_OPTIONS}
                    value={draft.highDoseDurationDays}
                    onChange={(v) => onDraftChange('highDoseDurationDays', v as number)}
                  />
                  <ConfigRow
                    label="Prednisone-Equivalent Daily Dose"
                    options={PRED_MG_OPTIONS}
                    value={draft.highDoseMg}
                    onChange={(v) => onDraftChange('highDoseMg', v as number)}
                  />
                  <ConfigRow
                    label="Cumulative Prednisone-Equivalent Dose"
                    options={CUM_MG_OPTIONS}
                    value={draft.highDoseCumulativeMg}
                    onChange={(v) => onDraftChange('highDoseCumulativeMg', v as number)}
                  />
                </div>
              </>
            )}

            {draft.m4Enabled && (
              <>
                <SubHeader title="Recurrent OCS Courses (Treatment Pattern)" />
                <div className="divide-y divide-gray-50">
                  <ConfigRow
                    label="Minimum Gap Between OCS Courses"
                    options={GAP_OPTIONS}
                    value={draft.courseGapDays}
                    onChange={(v) => onDraftChange('courseGapDays', v as number)}
                  />
                </div>
              </>
            )}
          </>
        )}

        {/* 3. Composite Care Gap Rule */}
        <SectionHeader
          number={(draft.m2Enabled || draft.m3Enabled || draft.m4Enabled) ? 3 : 2}
          title="Composite Care Gap Rule"
        />
        <div className="mt-1 divide-y divide-gray-50">
          <ConfigRow
            label="Minimum Number of Care Gap Criteria Met"
            options={COMPOSITE_OPTIONS}
            value={draft.compositeLogic}
            onChange={(v) => onDraftChange('compositeLogic', v as string)}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="shrink-0 space-y-2 border-t border-gray-100 px-4 py-3">
        <button
          type="button"
          onClick={() => onApply(draft)}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#F59E0B] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#D97706] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]/50"
        >
          <Check className="h-4 w-4" />
          Apply Configuration
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 focus-visible:outline-none"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset to Default
        </button>
      </div>
    </div>
  )
}
