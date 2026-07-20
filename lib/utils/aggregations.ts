import type {
  PatientRow, GlobalKpis, HcpAgg, AccountAgg,
  TerritoryAgg, DemographicAgg, AgeBand,
} from '@/lib/types/insights'
import { getAgeBand } from '@/lib/types/insights'

const DEFAULT_IBD_CLAIMS = 2
const DEFAULT_IBD_GAP_DAYS = 30
const DEFAULT_OCS_DAYS = 90
const DEFAULT_HIGH_DOSE_DAYS = 60
const DEFAULT_PREDNISONE_EQUIV = 10
const DEFAULT_CUMULATIVE_PREDNISONE = 600
const DEFAULT_COURSE_GAP_DAYS = 30

function inCohort(r: PatientRow) {
  return r.Minimum_IBD_Claims >= DEFAULT_IBD_CLAIMS &&
    r.Gap_First_Last_IBD_Dx_Claim_Days >= DEFAULT_IBD_GAP_DAYS
}

function chronicFlag(r: PatientRow) {
  return r.Chronic_OCS_Days >= DEFAULT_OCS_DAYS
}

function highDoseFlag(r: PatientRow) {
  return r.High_Dose_Consecutive_Days >= DEFAULT_HIGH_DOSE_DAYS &&
    r['Prednisone Equivalent'] >= DEFAULT_PREDNISONE_EQUIV &&
    r['Cumulative Prednisone'] >= DEFAULT_CUMULATIVE_PREDNISONE
}

function repeatCourseFlag(r: PatientRow) {
  return r['Min Gap between OCS courses'] >= DEFAULT_COURSE_GAP_DAYS
}

function overuseFlag(r: PatientRow) {
  return chronicFlag(r) || highDoseFlag(r) || repeatCourseFlag(r)
}

function rate(n: number, d: number) {
  return d === 0 ? 0 : Math.round((n / d) * 1000) / 10
}

function scoped(rows: PatientRow[]) {
  return rows.filter(inCohort)
}

export function computeGlobalKpis(rows: PatientRow[]): GlobalKpis {
  const pts = scoped(rows)
  const total = pts.length
  const ocsUse = pts.filter(overuseFlag).length
  const ocsOveruse = ocsUse
  const chronicOcs = pts.filter(chronicFlag).length
  const highDose = pts.filter(highDoseFlag).length
  const repeatCourse = pts.filter(repeatCourseFlag).length

  return {
    totalPatients: total,
    ocsUse, ocsUseRate: rate(ocsUse, total),
    ocsOveruse, ocsOveruseRate: rate(ocsOveruse, total),
    m7Rate: rate(ocsOveruse, total),
    chronicOcs, chronicOcsRate: rate(chronicOcs, total),
    highDose, highDoseRate: rate(highDose, total),
    repeatCourse, repeatCourseRate: rate(repeatCourse, total),
    taperFailure: 0, taperFailureRate: 0,
    relapse: 0, relapseRate: 0,
  }
}

export function aggregateByHcp(rows: PatientRow[]): HcpAgg[] {
  const map = new Map<string, PatientRow[]>()
  for (const r of scoped(rows)) {
    const bucket = map.get(r.NPI_ID) ?? []
    bucket.push(r)
    map.set(r.NPI_ID, bucket)
  }
  return Array.from(map.entries()).map(([npi, pts]) => {
    const total = pts.length
    const ocsOveruse = pts.filter(overuseFlag).length
    const repeatCourse = pts.filter(repeatCourseFlag).length
    return {
      npi,
      name: npi,
      specialty: pts[0].Specialty,
      account: pts[0].HCP_Name,
      territory: pts[0].MSL_Territory,
      region: pts[0].Region,
      totalPatients: total,
      ocsUse: ocsOveruse,
      chronicOcs: pts.filter(chronicFlag).length,
      chronicOcsRate: rate(pts.filter(chronicFlag).length, total),
      highDose: pts.filter(highDoseFlag).length,
      highDoseRate: rate(pts.filter(highDoseFlag).length, total),
      ocsOveruse,
      repeatCourse,
      repeatCourseRate: rate(repeatCourse, total),
      taperFailure: 0,
      relapse: 0,
      m7Rate: rate(ocsOveruse, total),
    }
  })
}

export function aggregateByAccount(rows: PatientRow[]): AccountAgg[] {
  const map = new Map<string, PatientRow[]>()
  for (const r of scoped(rows)) {
    const bucket = map.get(r.HCP_Name) ?? []
    bucket.push(r)
    map.set(r.HCP_Name, bucket)
  }
  return Array.from(map.entries()).map(([account, pts]) => {
    const total = pts.length
    const ocsOveruse = pts.filter(overuseFlag).length
    const repeatCourse = pts.filter(repeatCourseFlag).length
    const specCount = new Map<string, number>()
    pts.forEach((p) => specCount.set(p.Specialty, (specCount.get(p.Specialty) ?? 0) + 1))
    const topSpecialty = [...specCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? ''
    return {
      account,
      territory: pts[0].MSL_Territory,
      region: pts[0].Region,
      hcpCount: new Set(pts.map((p) => p.NPI_ID)).size,
      totalPatients: total,
      ocsUse: ocsOveruse,
      chronicOcs: pts.filter(chronicFlag).length,
      chronicOcsRate: rate(pts.filter(chronicFlag).length, total),
      highDose: pts.filter(highDoseFlag).length,
      highDoseRate: rate(pts.filter(highDoseFlag).length, total),
      ocsOveruse,
      repeatCourse,
      repeatCourseRate: rate(repeatCourse, total),
      taperFailure: 0,
      relapse: 0,
      m7Rate: rate(ocsOveruse, total),
      topSpecialty,
    }
  })
}

export function aggregateByTerritory(rows: PatientRow[]): TerritoryAgg[] {
  const map = new Map<string, PatientRow[]>()
  for (const r of scoped(rows)) {
    const bucket = map.get(r.MSL_Territory) ?? []
    bucket.push(r)
    map.set(r.MSL_Territory, bucket)
  }
  return Array.from(map.entries()).map(([territory, pts]) => {
    const total = pts.length
    const ocsOveruse = pts.filter(overuseFlag).length
    const repeatCourse = pts.filter(repeatCourseFlag).length
    return {
      territory,
      region: pts[0].Region,
      totalPatients: total,
      ocsUse: ocsOveruse,
      chronicOcs: pts.filter(chronicFlag).length,
      chronicOcsRate: rate(pts.filter(chronicFlag).length, total),
      highDose: pts.filter(highDoseFlag).length,
      highDoseRate: rate(pts.filter(highDoseFlag).length, total),
      ocsOveruse,
      repeatCourse,
      repeatCourseRate: rate(repeatCourse, total),
      taperFailure: 0,
      relapse: 0,
      m7Rate: rate(ocsOveruse, total),
      hcpCount: new Set(pts.map((p) => p.NPI_ID)).size,
    }
  })
}

export function aggregateByDemographic(rows: PatientRow[]): DemographicAgg[] {
  const map = new Map<string, PatientRow[]>()
  for (const r of scoped(rows)) {
    const key = `${getAgeBand(r.Age)}||${r.Gender}`
    const bucket = map.get(key) ?? []
    bucket.push(r)
    map.set(key, bucket)
  }
  return Array.from(map.entries()).map(([key, pts]) => {
    const [ageBand, gender] = key.split('||') as [AgeBand, string]
    const total = pts.length
    const ocsOveruse = pts.filter(overuseFlag).length
    const repeatCourse = pts.filter(repeatCourseFlag).length
    return {
      ageBand,
      gender,
      totalPatients: total,
      ocsUse: ocsOveruse,
      chronicOcs: pts.filter(chronicFlag).length,
      chronicOcsRate: rate(pts.filter(chronicFlag).length, total),
      highDose: pts.filter(highDoseFlag).length,
      highDoseRate: rate(pts.filter(highDoseFlag).length, total),
      ocsOveruse,
      repeatCourse,
      repeatCourseRate: rate(repeatCourse, total),
      taperFailure: 0,
      relapse: 0,
      m7Rate: rate(ocsOveruse, total),
    }
  })
}
