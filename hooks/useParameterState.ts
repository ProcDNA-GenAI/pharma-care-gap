'use client'

import { useState, useCallback, useMemo } from 'react'
import type { ParameterValues, ParameterDiff } from '@/lib/types'

export const DEFAULT_PARAMETERS: ParameterValues = {
  // M1 — Cohort
  minimumAge: 18,
  diseaseLookbackPeriod: 12,          // months rolling window
  continuousEnrollment: 12,           // 6 pre + 6 post

  // M2 — Chronic OCS threshold
  conventionalTherapyDuration: 90,    // cumulative OCS days threshold

  // M3 — High-dose thresholds
  activeDiseaseWindow: 60,            // consecutive days at high dose
  crpThreshold: 10,                   // prednisone-equivalent mg/day threshold
  fecalCalprotectinThreshold: 600,    // cumulative mg threshold

  // M4 — Repeat course
  crohnsDiseaseHBI: 30,               // inter-course gap days (new course trigger)

  // M5 — Taper failure
  ulcerativeColitisPartialMayo: 3,    // months to achieve taper

  // Exclusions
  excludePregnancy: true,
  excludeActiveSeriousInfection: true,
  excludeHistoryOfMalignancy: true,
}

const PARAMETER_LABELS: Record<keyof ParameterValues, string> = {
  minimumAge:                    'Minimum Age',
  diseaseLookbackPeriod:         'Measurement Window',
  continuousEnrollment:          'Continuous Enrollment',
  conventionalTherapyDuration:   'Cumulative OCS Days Threshold (M2)',
  activeDiseaseWindow:           'High-Dose Consecutive Days (M3)',
  crpThreshold:                  'Prednisone-Equivalent Threshold mg/day (M3)',
  fecalCalprotectinThreshold:    'Cumulative OCS mg Threshold (M3)',
  crohnsDiseaseHBI:              'Inter-Course Gap — New Course Trigger (M4)',
  ulcerativeColitisPartialMayo:  'Taper Achievement Window (M5)',
  excludePregnancy:              'Exclude Pregnancy',
  excludeActiveSeriousInfection: 'Exclude Active Serious Infection',
  excludeHistoryOfMalignancy:    'Exclude Active Malignancy / Chemotherapy',
}

const PARAMETER_UNITS: Partial<Record<keyof ParameterValues, string>> = {
  minimumAge:                   'years',
  diseaseLookbackPeriod:        'months',
  continuousEnrollment:         'months',
  conventionalTherapyDuration:  'days',
  activeDiseaseWindow:          'days',
  crpThreshold:                 'mg/day',
  fecalCalprotectinThreshold:   'mg',
  crohnsDiseaseHBI:             'days',
  ulcerativeColitisPartialMayo: 'months',
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
