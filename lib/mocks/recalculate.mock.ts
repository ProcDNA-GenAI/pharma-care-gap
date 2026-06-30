import type { ImpactSummary, ParameterValues, ParameterDiff } from '@/lib/types'

const DEFAULT_PATIENTS = 24567

const PARAMETER_SENSITIVITY: Partial<Record<keyof ParameterValues, number>> = {
  // M1 — IBD Cohort
  measurementMonths:      85,
  ibdMinClaims:           -420,
  ibdGapDays:             -110,

  // M2 — Chronic OCS
  ocsDurationThreshold:   -210,

  // M3 — High-dose OCS
  highDoseDurationDays:   -180,
  highDoseMg:             -150,
  highDoseCumulativeMg:   -95,

  // M4 — Repeat course
  courseGapDays:          -75,

  // M5 — Taper failure
  taperFailMonths:        -130,
  taperDoseThresholdMg:   -90,

  // M6 — Post-discontinuation relapse
  relapseWindowMonths:    120,
}

export function computeMockImpact(
  _current: ParameterValues,
  _defaults: ParameterValues,
  diffs: ParameterDiff[],
): ImpactSummary {
  let delta = 0

  for (const diff of diffs) {
    const sensitivity = PARAMETER_SENSITIVITY[diff.field] ?? 0
    if (typeof diff.from === 'number' && typeof diff.to === 'number') {
      const change = diff.to - diff.from
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
