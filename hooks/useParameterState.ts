'use client'

import { useState, useCallback, useMemo } from 'react'
import type { ParameterValues, ParameterDiff } from '@/lib/types'

export const DEFAULT_PARAMETERS: ParameterValues = {
  minimumAge: 18,
  diseaseLookbackPeriod: 24,
  conventionalTherapyDuration: 8,
  activeDiseaseWindow: 90,
  crohnsDiseaseHBI: 8,
  ulcerativeColitisPartialMayo: 4,
  crpThreshold: 10,
  fecalCalprotectinThreshold: 250,
  continuousEnrollment: 12,
  excludePregnancy: true,
  excludeActiveSeriousInfection: true,
  excludeHistoryOfMalignancy: true,
}

const PARAMETER_LABELS: Record<keyof ParameterValues, string> = {
  minimumAge: 'Minimum Age',
  diseaseLookbackPeriod: 'Disease Lookback Period',
  conventionalTherapyDuration: 'Conventional Therapy Duration',
  activeDiseaseWindow: 'Active Disease Window',
  crohnsDiseaseHBI: "Crohn's Disease (HBI)",
  ulcerativeColitisPartialMayo: 'Ulcerative Colitis (Partial Mayo)',
  crpThreshold: 'CRP',
  fecalCalprotectinThreshold: 'Fecal Calprotectin',
  continuousEnrollment: 'Continuous Enrollment',
  excludePregnancy: 'Pregnancy',
  excludeActiveSeriousInfection: 'Active Serious Infection',
  excludeHistoryOfMalignancy: 'History of Malignancy (5 years)',
}

const PARAMETER_UNITS: Partial<Record<keyof ParameterValues, string>> = {
  minimumAge: 'years',
  diseaseLookbackPeriod: 'months',
  conventionalTherapyDuration: 'weeks',
  activeDiseaseWindow: 'days',
  crpThreshold: 'mg/L',
  fecalCalprotectinThreshold: 'mcg/g',
  continuousEnrollment: 'months',
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
