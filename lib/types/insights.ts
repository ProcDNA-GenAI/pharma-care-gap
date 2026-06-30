export interface PatientRow {
  Pat_ID: string
  NPI: string
  Specialty: string
  Account: string
  Territory: string
  Region: string
  Pat_Age: number
  Pat_Gender: string
  M1: number
  M2: number
  M3: number
  M4: number
  M5: number
  M6: number
  M7: number
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
  ocsOveruse: number
  repeatCourse: number
  taperFailure: number
  relapse: number
  m7Rate: number
}

export interface AccountAgg {
  account: string
  territory: string
  region: string
  totalPatients: number
  ocsOveruse: number
  m7Rate: number
  chronicOcs: number
  repeatCourse: number
  topSpecialty: string
}

export interface TerritoryAgg {
  territory: string
  region: string
  totalPatients: number
  ocsOveruse: number
  m7Rate: number
  chronicOcs: number
  hcpCount: number
}

export interface DemographicAgg {
  ageBand: AgeBand
  gender: string
  totalPatients: number
  ocsOveruse: number
  m7Rate: number
  chronicOcs: number
  repeatCourse: number
}

export interface SummaryInsights {
  highestRiskHcp: HcpAgg
  highestBurdenTerritory: TerritoryAgg
  highestRiskAgeBand: DemographicAgg
  flaggedHcpCount: number
  totalHcpCount: number
  flaggedHcpRate: number
}

export type InsightsTab = 'hcp' | 'account' | 'geography' | 'demographic'

export interface InsightsFilters {
  search: string
  territory: string
  specialty: string
}
