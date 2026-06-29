'use client'

import { SlidersHorizontal, Sparkles } from 'lucide-react'
import { ParameterField } from './ParameterField'
import { ParameterToggleField } from './ParameterToggleField'
import { ImpactSummaryCard } from './ImpactSummaryCard'
import { Button } from '@/components/ui/Button'
import type { ParameterValues, ImpactSummary } from '@/lib/types'
import type { SelectOption } from '@/components/ui/Select'

interface ConfigurableParametersPanelProps {
  parameters: ParameterValues
  onParameterChange: (key: keyof ParameterValues, value: ParameterValues[keyof ParameterValues]) => void
  isGenerating: boolean
  impactSummary: ImpactSummary | null
  onGenerateInsights: () => void
  isGeneratingInsights: boolean
}

// M1 — Cohort
const AGE_OPTIONS: SelectOption[]         = [18, 21, 25, 30].map((v) => ({ label: String(v), value: v }))
const ENROLLMENT_OPTIONS: SelectOption[]  = [6, 12, 18, 24].map((v) => ({ label: String(v), value: v }))
const WINDOW_OPTIONS: SelectOption[]      = [6, 12, 18, 24, 36].map((v) => ({ label: String(v), value: v }))

// M2 — Chronic OCS
const OCS_DAYS_OPTIONS: SelectOption[]    = [60, 75, 90, 120, 180].map((v) => ({ label: String(v), value: v }))

// M3 — High-dose
const CONSEC_DAYS_OPTIONS: SelectOption[] = [30, 45, 60, 90].map((v) => ({ label: String(v), value: v }))
const PRED_MG_OPTIONS: SelectOption[]     = [5, 7.5, 10, 15, 20].map((v) => ({ label: String(v), value: v }))
const CUM_MG_OPTIONS: SelectOption[]      = [300, 450, 600, 900].map((v) => ({ label: String(v), value: v }))

// M4 — Repeat course
const GAP_OPTIONS: SelectOption[]         = [14, 21, 30, 45, 60].map((v) => ({ label: String(v), value: v }))

// M5 — Taper failure
const TAPER_WINDOW_OPTIONS: SelectOption[] = [1, 2, 3, 4, 6].map((v) => ({ label: String(v), value: v }))

function GroupHeading({ children }: { children: string }) {
  return (
    <p className="mt-4 mb-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
      {children}
    </p>
  )
}

export function ConfigurableParametersPanel({
  parameters,
  onParameterChange,
  isGenerating,
  impactSummary,
  onGenerateInsights,
  isGeneratingInsights,
}: ConfigurableParametersPanelProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-gray-200 bg-white p-4">

        {/* Panel header */}
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal className="h-3.5 w-3.5" style={{ color: '#004FBA' }} aria-hidden="true" />
          <h2 className="text-sm font-semibold text-gray-900">Configurable Parameters</h2>
        </div>

        {/* M1 — IBD Cohort Identification */}
        <GroupHeading>IBD Cohort (Denominator)</GroupHeading>
        <div className="divide-y divide-gray-100">
          <ParameterField
            label="Minimum Age"
            tooltip="Minimum patient age at index date"
            value={parameters.minimumAge}
            onChange={(v) => onParameterChange('minimumAge', v)}
            options={AGE_OPTIONS}
            unit="years"
          />
          <ParameterField
            label="Measurement Window"
            tooltip="Rolling measurement period for OCS accumulation"
            value={parameters.diseaseLookbackPeriod}
            onChange={(v) => onParameterChange('diseaseLookbackPeriod', v)}
            options={WINDOW_OPTIONS}
            unit="months"
          />
          <ParameterField
            label="Continuous Enrollment"
            tooltip="Required continuous health plan enrollment (6 mo pre + 6 mo post index)"
            value={parameters.continuousEnrollment}
            onChange={(v) => onParameterChange('continuousEnrollment', v)}
            options={ENROLLMENT_OPTIONS}
            unit="months"
          />
        </div>

        {/* M2 — Chronic/Prolonged OCS Use */}
        <GroupHeading>Chronic OCS Use</GroupHeading>
        <div className="divide-y divide-gray-100">
          <ParameterField
            label="Cumulative OCS Days Threshold"
            tooltip="Cumulative non-overlapping OCS days in 12 months (STOCKPILE logic)"
            value={parameters.conventionalTherapyDuration}
            onChange={(v) => onParameterChange('conventionalTherapyDuration', v)}
            options={OCS_DAYS_OPTIONS}
            unit="days"
          />
        </div>

        {/* M3 — High-Dose/Prolonged OCS Exposure */}
        <GroupHeading>High-Dose OCS Exposure</GroupHeading>
        <div className="divide-y divide-gray-100">
          <ParameterField
            label="Consecutive Days at High Dose"
            tooltip="Consecutive days at or above prednisone-equivalent threshold (PRED_EQ_FACTOR)"
            value={parameters.activeDiseaseWindow}
            onChange={(v) => onParameterChange('activeDiseaseWindow', v)}
            options={CONSEC_DAYS_OPTIONS}
            unit="days"
          />
          <ParameterField
            label="Prednisone-Equivalent Threshold"
            tooltip="Daily prednisone-equivalent dose threshold (mg/day)"
            value={parameters.crpThreshold}
            onChange={(v) => onParameterChange('crpThreshold', v)}
            options={PRED_MG_OPTIONS}
            unit="mg/day"
          />
          <ParameterField
            label="Cumulative OCS mg Threshold"
            tooltip="Total cumulative prednisone-equivalent mg threshold"
            value={parameters.fecalCalprotectinThreshold}
            onChange={(v) => onParameterChange('fecalCalprotectinThreshold', v)}
            options={CUM_MG_OPTIONS}
            unit="mg"
          />
        </div>

        {/* M4 — Repeat OCS Course */}
        <GroupHeading>Repeat OCS Course</GroupHeading>
        <div className="divide-y divide-gray-100">
          <ParameterField
            label="Inter-Course Gap (New Course Trigger)"
            tooltip="Minimum gap between last fill end date and next fill start date to define a new course"
            value={parameters.crohnsDiseaseHBI}
            onChange={(v) => onParameterChange('crohnsDiseaseHBI', v)}
            options={GAP_OPTIONS}
            unit="days"
          />
        </div>

        {/* M5 — Taper Failure/Dependence */}
        <GroupHeading>Steroid Taper Failure</GroupHeading>
        <div className="divide-y divide-gray-100">
          <ParameterField
            label="Taper Achievement Window"
            tooltip="Months within which OCS must be reduced below 10 mg/day to avoid taper-failure flag"
            value={parameters.ulcerativeColitisPartialMayo}
            onChange={(v) => onParameterChange('ulcerativeColitisPartialMayo', v)}
            options={TAPER_WINDOW_OPTIONS}
            unit="months"
          />
        </div>

        {/* Exclusions */}
        <GroupHeading>Exclusions</GroupHeading>
        <div className="divide-y divide-gray-100">
          <ParameterToggleField
            label="Exclude Pregnancy"
            tooltip="Exclude patients with pregnancy during measurement period"
            checked={parameters.excludePregnancy}
            onChange={(v) => onParameterChange('excludePregnancy', v)}
          />
          <ParameterToggleField
            label="Exclude Active Serious Infection"
            tooltip="Exclude patients with active TB, hepatitis B/C, or opportunistic infection"
            checked={parameters.excludeActiveSeriousInfection}
            onChange={(v) => onParameterChange('excludeActiveSeriousInfection', v)}
          />
          <ParameterToggleField
            label="Exclude Active Malignancy"
            tooltip="Exclude patients with active malignancy or chemotherapy within 12 months"
            checked={parameters.excludeHistoryOfMalignancy}
            onChange={(v) => onParameterChange('excludeHistoryOfMalignancy', v)}
          />
        </div>

      </div>

      {/* Impact Summary */}
      {impactSummary && (
        <ImpactSummaryCard impact={impactSummary} isLoading={isGenerating} />
      )}

      {/* Generate Insights */}
      <Button
        variant="primary"
        size="md"
        className="w-full"
        loading={isGeneratingInsights}
        onClick={onGenerateInsights}
        iconLeft={<Sparkles className="h-4 w-4" />}
        style={{ backgroundColor: '#004FBA' }}
      >
        Generate Insights
      </Button>
    </div>
  )
}
