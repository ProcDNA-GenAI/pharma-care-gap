export interface ParameterValues {
  minimumAge: number
  diseaseLookbackPeriod: number
  conventionalTherapyDuration: number
  activeDiseaseWindow: number
  crohnsDiseaseHBI: number
  ulcerativeColitisPartialMayo: number
  crpThreshold: number
  fecalCalprotectinThreshold: number
  continuousEnrollment: number
  excludePregnancy: boolean
  excludeActiveSeriousInfection: boolean
  excludeHistoryOfMalignancy: boolean
}

export interface ParameterDiff {
  field: keyof ParameterValues
  label: string
  from: number | boolean
  to: number | boolean
  unit?: string
}
