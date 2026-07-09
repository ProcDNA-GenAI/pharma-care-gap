'use client'

import { useState, useCallback, useMemo } from 'react'
import type { ParameterValues, ParameterDiff } from '@/lib/types'

export const DEFAULT_PARAMETERS: ParameterValues = {
  // M1 — IBD Cohort
  measurementMonths:      12,
  ibdMinClaims:           2,
  ibdGapDays:             30,
  m1Enabled:              true,

  // M2 — Chronic OCS
  ocsDurationThreshold:   90,
  m2Enabled:              true,

  // M3 — High-Dose OCS
  highDoseDurationDays:   60,
  highDoseMg:             10,
  highDoseCumulativeMg:   600,
  m3Enabled:              true,

  // M4 — Repeat Course
  courseGapDays:          30,
  m4Enabled:              true,

  // M5 — Taper Failure
  taperFailMonths:        3,
  taperDoseThresholdMg:   10,

  // M6 — Post-Discontinuation Relapse
  relapseWindowMonths:    3,

  // M7 — Composite
  m7Enabled:              true,

  // M8/M9 — Hidden
  transitionWindowDays:   90,
  boneAssessYears:        2,
}

const PARAMETER_LABELS: Record<keyof ParameterValues, string> = {
  measurementMonths:      'Measurement Window',
  ibdMinClaims:           'Minimum IBD Claims',
  ibdGapDays:             'Min Gap Between Claims',
  m1Enabled:              'IBD Cohort Section',
  ocsDurationThreshold:   'Cumulative OCS Days Threshold',
  m2Enabled:              'Chronic OCS Use',
  highDoseDurationDays:   'Consecutive Days at High Dose',
  highDoseMg:             'Prednisone-Equivalent Threshold',
  highDoseCumulativeMg:   'Cumulative OCS mg Threshold',
  m3Enabled:              'High-Dose OCS Exposure',
  courseGapDays:          'Inter-Course Gap',
  m4Enabled:              'Recurrent OCS Courses',
  taperFailMonths:        'Taper Achievement Window',
  taperDoseThresholdMg:   'Taper Dose Threshold',
  relapseWindowMonths:    'Relapse Window',
  m7Enabled:              'Composite OCS Assessment',
  transitionWindowDays:   'Transition Window',
  boneAssessYears:        'Bone Assessment Lookback',
}

const PARAMETER_UNITS: Partial<Record<keyof ParameterValues, string>> = {
  measurementMonths:      'months',
  ibdGapDays:             'days',
  ocsDurationThreshold:   'days',
  highDoseDurationDays:   'days',
  highDoseMg:             'mg/day',
  highDoseCumulativeMg:   'mg',
  courseGapDays:          'days',
  taperFailMonths:        'months',
  taperDoseThresholdMg:   'mg/day',
  relapseWindowMonths:    'months',
  transitionWindowDays:   'days',
  boneAssessYears:        'years',
}

interface UseParameterStateReturn {
  parameters: ParameterValues
  diffs: ParameterDiff[]
  hasChanges: boolean
  setParameter: <K extends keyof ParameterValues>(key: K, value: ParameterValues[K]) => void
  resetParameters: () => void
}

export function useParameterState(): UseParameterStateReturn {
  const [parameters, setParameters] = useState<ParameterValues>(DEFAULT_PARAMETERS)

  const setParameter = useCallback(<K extends keyof ParameterValues>(
    key: K,
    value: ParameterValues[K],
  ) => {
    setParameters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const resetParameters = useCallback(() => {
    setParameters(DEFAULT_PARAMETERS)
  }, [])

  const diffs = useMemo<ParameterDiff[]>(() => {
    return (Object.keys(DEFAULT_PARAMETERS) as Array<keyof ParameterValues>)
      .filter((key) => parameters[key] !== DEFAULT_PARAMETERS[key])
      .map((key) => ({
        field: key,
        label: PARAMETER_LABELS[key],
        from: DEFAULT_PARAMETERS[key],
        to: parameters[key],
        unit: PARAMETER_UNITS[key],
      }))
  }, [parameters])

  const hasChanges = diffs.length > 0

  return { parameters, diffs, hasChanges, setParameter, resetParameters }
}
