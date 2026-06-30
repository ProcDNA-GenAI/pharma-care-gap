'use client'

import { useState, useCallback, useMemo } from 'react'
import type { ParameterValues, ParameterDiff } from '@/lib/types'

export const DEFAULT_PARAMETERS: ParameterValues = {
  // M1 — IBD Cohort
  measurementMonths:      12,
  ibdMinClaims:           2,
  ibdGapDays:             30,

  // M2 — Chronic OCS
  ocsDurationThreshold:   90,

  // M3 — High-Dose OCS
  highDoseDurationDays:   60,
  highDoseMg:             10,
  highDoseCumulativeMg:   600,

  // M4 — Repeat Course
  courseGapDays:          30,

  // M5 — Taper Failure
  taperFailMonths:        3,
  taperDoseThresholdMg:   10,

  // M6 — Post-Discontinuation Relapse
  relapseWindowMonths:    3,

  // M8/M9 — Hidden
  transitionWindowDays:   90,
  boneAssessYears:        2,
}

const PARAMETER_LABELS: Record<keyof ParameterValues, string> = {
  measurementMonths:      'Measurement Window',
  ibdMinClaims:           'Minimum IBD Claims',
  ibdGapDays:             'Min Gap Between Claims',
  ocsDurationThreshold:   'Cumulative OCS Days Threshold',
  highDoseDurationDays:   'Consecutive Days at High Dose',
  highDoseMg:             'Prednisone-Equivalent Threshold',
  highDoseCumulativeMg:   'Cumulative OCS mg Threshold',
  courseGapDays:          'Inter-Course Gap',
  taperFailMonths:        'Taper Achievement Window',
  taperDoseThresholdMg:   'Taper Dose Threshold',
  relapseWindowMonths:    'Relapse Window',
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
