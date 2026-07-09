export interface ParameterValues {
  // M1 — IBD Cohort (Denominator)
  measurementMonths: number
  ibdMinClaims: number
  ibdGapDays: number
  m1Enabled: boolean

  // M2 — Chronic OCS Use
  ocsDurationThreshold: number
  m2Enabled: boolean

  // M3 — High-Dose OCS Exposure
  highDoseDurationDays: number
  highDoseMg: number
  highDoseCumulativeMg: number
  m3Enabled: boolean

  // M4 — Repeat OCS Course
  courseGapDays: number
  m4Enabled: boolean

  // M5 — Steroid Taper Failure
  taperFailMonths: number
  taperDoseThresholdMg: number

  // M6 — Post-Discontinuation Relapse
  relapseWindowMonths: number

  // M7 — Composite Assessment
  m7Enabled: boolean

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
