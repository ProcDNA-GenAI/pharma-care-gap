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

const AGE_OPTIONS: SelectOption[] = [18, 21, 25, 30].map((v) => ({ label: String(v), value: v }))
const LOOKBACK_OPTIONS: SelectOption[] = [12, 18, 24, 36].map((v) => ({ label: String(v), value: v }))
const THERAPY_DURATION_OPTIONS: SelectOption[] = [4, 6, 8, 12, 16].map((v) => ({ label: String(v), value: v }))
const DISEASE_WINDOW_OPTIONS: SelectOption[] = [30, 60, 90, 120, 180].map((v) => ({ label: String(v), value: v }))
const HBI_OPTIONS: SelectOption[] = [4, 6, 8, 10, 12].map((v) => ({ label: `≥ ${v}`, value: v }))
const MAYO_OPTIONS: SelectOption[] = [2, 3, 4, 5, 6].map((v) => ({ label: `≥ ${v}`, value: v }))
const CRP_OPTIONS: SelectOption[] = [5, 8, 10, 15, 20].map((v) => ({ label: `≥ ${v}`, value: v }))
const FC_OPTIONS: SelectOption[] = [150, 200, 250, 300, 500].map((v) => ({ label: `≥ ${v}`, value: v }))
const ENROLLMENT_OPTIONS: SelectOption[] = [6, 12, 18, 24].map((v) => ({ label: String(v), value: v }))

function GroupHeading({ children }: { children: string }) {
  return (
    <p className="mt-3 mb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
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

        {/* General */}
        <div className="divide-y divide-gray-100">
          <ParameterField label="Minimum Age" tooltip="Minimum patient age for eligibility"
            value={parameters.minimumAge} onChange={(v) => onParameterChange('minimumAge', v)}
            options={AGE_OPTIONS} unit="years" />
          <ParameterField label="Disease Lookback Period" tooltip="Lookback window for IBD diagnosis confirmation"
            value={parameters.diseaseLookbackPeriod} onChange={(v) => onParameterChange('diseaseLookbackPeriod', v)}
            options={LOOKBACK_OPTIONS} unit="months" />
          <ParameterField label="Conventional Therapy Duration" tooltip="Minimum weeks on conventional therapy before biologic eligibility"
            value={parameters.conventionalTherapyDuration} onChange={(v) => onParameterChange('conventionalTherapyDuration', v)}
            options={THERAPY_DURATION_OPTIONS} unit="weeks" />
          <ParameterField label="Active Disease Window" tooltip="Days within which disease activity must be documented"
            value={parameters.activeDiseaseWindow} onChange={(v) => onParameterChange('activeDiseaseWindow', v)}
            options={DISEASE_WINDOW_OPTIONS} unit="days" />
        </div>

        <GroupHeading>Disease Activity Thresholds</GroupHeading>
        <div className="divide-y divide-gray-100">
          <ParameterField label="Crohn's Disease (HBI)" tooltip="Harvey-Bradshaw Index threshold for moderate-severe Crohn's"
            value={parameters.crohnsDiseaseHBI} onChange={(v) => onParameterChange('crohnsDiseaseHBI', v)}
            options={HBI_OPTIONS} />
          <ParameterField label="Ulcerative Colitis (Partial Mayo)" tooltip="Partial Mayo Score threshold for moderate-severe UC"
            value={parameters.ulcerativeColitisPartialMayo} onChange={(v) => onParameterChange('ulcerativeColitisPartialMayo', v)}
            options={MAYO_OPTIONS} />
        </div>

        <GroupHeading>Biomarker Thresholds</GroupHeading>
        <div className="divide-y divide-gray-100">
          <ParameterField label="CRP" tooltip="C-reactive protein threshold indicating active inflammation"
            value={parameters.crpThreshold} onChange={(v) => onParameterChange('crpThreshold', v)}
            options={CRP_OPTIONS} unit="mg/L" />
          <ParameterField label="Fecal Calprotectin" tooltip="Fecal calprotectin threshold indicating mucosal inflammation"
            value={parameters.fecalCalprotectinThreshold} onChange={(v) => onParameterChange('fecalCalprotectinThreshold', v)}
            options={FC_OPTIONS} unit="mcg/g" />
        </div>

        <GroupHeading>Enrollment Requirement</GroupHeading>
        <div className="divide-y divide-gray-100">
          <ParameterField label="Continuous Enrollment" tooltip="Minimum continuous health plan enrollment required"
            value={parameters.continuousEnrollment} onChange={(v) => onParameterChange('continuousEnrollment', v)}
            options={ENROLLMENT_OPTIONS} unit="months" />
        </div>

        <GroupHeading>Additional Exclusions</GroupHeading>
        <div className="divide-y divide-gray-100">
          <ParameterToggleField label="Pregnancy" tooltip="Exclude patients who are currently pregnant"
            checked={parameters.excludePregnancy} onChange={(v) => onParameterChange('excludePregnancy', v)} />
          <ParameterToggleField label="Active Serious Infection" tooltip="Exclude patients with active TB, hepatitis B/C, or opportunistic infection"
            checked={parameters.excludeActiveSeriousInfection} onChange={(v) => onParameterChange('excludeActiveSeriousInfection', v)} />
          <ParameterToggleField label="History of Malignancy (5 years)" tooltip="Exclude patients with malignancy in the past 5 years (except non-melanoma skin cancer)"
            checked={parameters.excludeHistoryOfMalignancy} onChange={(v) => onParameterChange('excludeHistoryOfMalignancy', v)} />
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
