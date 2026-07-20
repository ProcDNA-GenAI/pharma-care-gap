export interface PatientRow {
  Patient_ID: string
  Age: number
  Gender: string
  State: string
  Region: string
  Territory_ID: string
  MSL_Territory: string
  NPI_ID: string
  HCP_Name: string
  Specialty: string
  Diagnosis: string
  Minimum_IBD_Claims: number
  Gap_First_Last_IBD_Dx_Claim_Days: number
  Chronic_OCS_Days: number
  High_Dose_Consecutive_Days: number
  No_of_OCS_Episodes: number
  Lookforward: number
  'Prednisone Equivalent': number
  'Cumulative Prednisone': number
  'Min Gap between OCS courses': number
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
