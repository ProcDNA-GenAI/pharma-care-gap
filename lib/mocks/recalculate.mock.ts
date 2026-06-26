import type { ImpactSummary, ParameterValues, ParameterDiff } from '@/lib/types'

const DEFAULT_PATIENTS = 24567

const PARAMETER_SENSITIVITY: Partial<Record<keyof ParameterValues, number>> = {
  minimumAge: -120,
  diseaseLookbackPeriod: 85,
  conventionalTherapyDuration: -210,
  activeDiseaseWindow: 95,
  crohnsDiseaseHBI: -180,
  ulcerativeColitisPartialMayo: -95,
  crpThreshold: -75,
  fecalCalprotectinThreshold: -60,
  continuousEnrollment: -145,
  excludePregnancy: -320,
  excludeActiveSeriousInfection: -280,
  excludeHistoryOfMalignancy: -190,
}

export function computeMockImpact(
  current: ParameterValues,
  defaults: ParameterValues,
  diffs: ParameterDiff[],
): ImpactSummary {
  let delta = 0

  for (const diff of diffs) {
    const sensitivity = PARAMETER_SENSITIVITY[diff.field] ?? 0
    if (typeof diff.from === 'boolean' && typeof diff.to === 'boolean') {
      delta += diff.to ? sensitivity : -sensitivity
    } else if (typeof diff.from === 'number' && typeof diff.to === 'number') {
      const change = (diff.to as number) - (diff.from as number)
      delta += Math.round(sensitivity * (change / 10))
    }
  }

  const estimated = Math.max(0, DEFAULT_PATIENTS + delta)
  const changeVsDefault = estimated - DEFAULT_PATIENTS
  const changePercent = Math.round((changeVsDefault / DEFAULT_PATIENTS) * 1000) / 10

  return {
    estimatedEligiblePatients: estimated,
    changeVsDefault,
    changePercent,
    datasetSize: '1.2M',
    diffs: diffs.map((d) => ({
      label: d.label,
      from: String(d.from) + (d.unit ? ` ${d.unit}` : ''),
      to: String(d.to) + (d.unit ? ` ${d.unit}` : ''),
    })),
    isMock: true,
  }
}
