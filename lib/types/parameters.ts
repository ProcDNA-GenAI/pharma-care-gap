export interface ParameterValues {
  // M1 — IBD Cohort (Denominator)
  measurementMonths: number
  ibdMinClaims: number
  ibdGapDays: number

  // M2 — Chronic OCS Use
  ocsDurationThreshold: number

  // M3 — High-Dose OCS Exposure
  highDoseDurationDays: number
  highDoseMg: number
  highDoseCumulativeMg: number

  // M4 — Repeat OCS Course
  courseGapDays: number

  // M5 — Steroid Taper Failure
  taperFailMonths: number
  taperDoseThresholdMg: number

  // M6 — Post-Discontinuation Relapse
  relapseWindowMonths: number

  // M8/M9 — Hidden (not shown in UI yet)
  transitionWindowDays: number
  boneAssessYears: number
}

export interface ParameterDiff {
  field: keyof ParameterValues
  label: string
  from: number | boolean
  to: number | boolean
  unit?: string
}
