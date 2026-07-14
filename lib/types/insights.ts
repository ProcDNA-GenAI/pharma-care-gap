export interface PatientRow {
  Pat_ID: string
  NPI: string
  Specialty: string
  Account: string
  Territory: string
  Region: string
  Pat_Age: number
  Pat_Gender: string
  IBD_Claims: number
  Chronic_OCS_Days: number
  High_Dose_Days: number
  M4: number
  M5: number
  M6: number
  Composite_Overuse: number
}

export type AgeBand = '18–34' | '35–49' | '50–64' | '65+'

export function getAgeBand(age: number): AgeBand {
  if (age < 35) return '18–34'
  if (age < 50) return '35–49'
  if (age < 65) return '50–64'
  return '65+'
}

export interface GlobalKpis {
  totalPatients: number
  ocsUse: number
  ocsUseRate: number
  ocsOveruse: number
  ocsOveruseRate: number
  m7Rate: number
  chronicOcs: number
  chronicOcsRate: number
  highDose: number
  highDoseRate: number
  repeatCourse: number
  repeatCourseRate: number
  taperFailure: number
  taperFailureRate: number
  relapse: number
  relapseRate: number
}

export interface HcpAgg {
  npi: string
  name: string
  specialty: string
  account: string
  territory: string
  region: string
  totalPatients: number
  ocsUse: number
  chronicOcs: number
  chronicOcsRate: number
  highDose: number
  highDoseRate: number
  ocsOveruse: number
  repeatCourse: number
  repeatCourseRate: number
  taperFailure: number
  relapse: number
  m7Rate: number
}

export interface AccountAgg {
  account: string
  territory: string
  region: string
  hcpCount: number
  totalPatients: number
  ocsUse: number
  chronicOcs: number
  chronicOcsRate: number
  highDose: number
  highDoseRate: number
  ocsOveruse: number
  repeatCourse: number
  repeatCourseRate: number
  taperFailure: number
  relapse: number
  m7Rate: number
  topSpecialty: string
}

export interface TerritoryAgg {
  territory: string
  region: string
  totalPatients: number
  ocsUse: number
  chronicOcs: number
  chronicOcsRate: number
  highDose: number
  highDoseRate: number
  ocsOveruse: number
  repeatCourse: number
  repeatCourseRate: number
  taperFailure: number
  relapse: number
  m7Rate: number
  hcpCount: number
}

export interface DemographicAgg {
  ageBand: AgeBand
  gender: string
  totalPatients: number
  ocsUse: number
  chronicOcs: number
  chronicOcsRate: number
  highDose: number
  highDoseRate: number
  ocsOveruse: number
  repeatCourse: number
  repeatCourseRate: number
  taperFailure: number
  relapse: number
  m7Rate: number
}

export interface SpecialtyAgg {
  specialty: string
  totalPatients: number
  overusers: number
  overuseRate: number
}

export interface AgeDistributionAgg {
  ageBand: AgeBand
  totalPatients: number
  overusers: number
  overuseRate: number
}

export interface HcpSegmentAgg {
  band: string
  hcpCount: number
  patients: number
}

export type InsightsTab = 'hcp' | 'account' | 'geography' | 'demographic'

export interface InsightsFilters {
  search: string
  territory: string
  specialty: string
}
