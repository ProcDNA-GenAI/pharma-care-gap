import type {
  PatientRow, GlobalKpis, HcpAgg, AccountAgg,
  TerritoryAgg, DemographicAgg, AgeBand,
} from '@/lib/types/insights'
import { getAgeBand } from '@/lib/types/insights'

const M7_THRESHOLD   = 30
const M3_THRESHOLD   = 90
const M4_THRESHOLD   = 1
const M5_THRESHOLD   = 3
const M6_THRESHOLD   = 3

export function computeGlobalKpis(rows: PatientRow[]): GlobalKpis {
  const total        = rows.length
  const ocsUse       = rows.filter((r) => r.High_Dose_Days > 0).length
  const ocsOveruse   = rows.filter((r) => r.Composite_Overuse > M7_THRESHOLD).length
  const chronicOcs   = rows.filter((r) => r.High_Dose_Days > M3_THRESHOLD).length
  const highDose     = rows.filter((r) => r.Composite_Overuse > 0).length
  const repeatCourse = rows.filter((r) => r.M4 > M4_THRESHOLD).length
  const taperFailure = rows.filter((r) => r.M5 > M5_THRESHOLD).length
  const relapse      = rows.filter((r) => r.M6 > 0 && r.M6 <= M6_THRESHOLD).length
  const pct = (n: number, d: number) => d === 0 ? 0 : Math.round((n / d) * 1000) / 10

  return {
    totalPatients:    total,
    ocsUse,           ocsUseRate:       pct(ocsUse, total),
    ocsOveruse,       ocsOveruseRate:   pct(ocsOveruse, total),
    m7Rate:           pct(ocsOveruse, total),
    chronicOcs,       chronicOcsRate:   pct(chronicOcs, total),
    highDose,         highDoseRate:     pct(highDose, total),
    repeatCourse,     repeatCourseRate: pct(repeatCourse, total),
    taperFailure,     taperFailureRate: pct(taperFailure, ocsUse),
    relapse,          relapseRate:      pct(relapse, ocsUse),
  }
}

function rate(n: number, d: number) {
  return d === 0 ? 0 : Math.round((n / d) * 1000) / 10
}

export function aggregateByHcp(rows: PatientRow[]): HcpAgg[] {
  const map = new Map<string, PatientRow[]>()
  for (const r of rows) {
    const bucket = map.get(r.NPI) ?? []
    bucket.push(r)
    map.set(r.NPI, bucket)
  }
  return Array.from(map.entries()).map(([npi, pts]) => {
    const total        = pts.length
    const ocsOveruse   = pts.filter((p) => p.Composite_Overuse > M7_THRESHOLD).length
    return {
      npi,
      name:         npi,
      specialty:    pts[0].Specialty,
      account:      pts[0].Account,
      territory:    pts[0].Territory,
      region:       pts[0].Region,
      totalPatients: total,
      ocsUse:        pts.filter((p) => p.High_Dose_Days > 0).length,
      chronicOcs:    pts.filter((p) => p.High_Dose_Days > M3_THRESHOLD).length,
      chronicOcsRate: rate(pts.filter((p) => p.High_Dose_Days > M3_THRESHOLD).length, total),
      highDose:      pts.filter((p) => p.Composite_Overuse > 0).length,
      highDoseRate:  rate(pts.filter((p) => p.Composite_Overuse > 0).length, total),
      ocsOveruse,
      repeatCourse:  pts.filter((p) => p.M4 > M4_THRESHOLD).length,
      repeatCourseRate: rate(pts.filter((p) => p.M4 > M4_THRESHOLD).length, total),
      taperFailure:  pts.filter((p) => p.M5 > M5_THRESHOLD).length,
      relapse:       pts.filter((p) => p.M6 > 0 && p.M6 <= M6_THRESHOLD).length,
      m7Rate:        rate(ocsOveruse, total),
    }
  })
}

export function aggregateByAccount(rows: PatientRow[]): AccountAgg[] {
  const map = new Map<string, PatientRow[]>()
  for (const r of rows) {
    const b = map.get(r.Account) ?? []
    b.push(r); map.set(r.Account, b)
  }
  return Array.from(map.entries()).map(([account, pts]) => {
    const total      = pts.length
    const ocsOveruse = pts.filter((p) => p.Composite_Overuse > M7_THRESHOLD).length
    const specCount  = new Map<string, number>()
    pts.forEach((p) => specCount.set(p.Specialty, (specCount.get(p.Specialty) ?? 0) + 1))
    const topSpecialty = [...specCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? ''
    return {
      account, territory: pts[0].Territory, region: pts[0].Region,
      hcpCount:      new Set(pts.map((p) => p.NPI)).size,
      totalPatients: total,
      ocsUse:        pts.filter((p) => p.High_Dose_Days > 0).length,
      chronicOcs:    pts.filter((p) => p.High_Dose_Days > M3_THRESHOLD).length,
      chronicOcsRate: rate(pts.filter((p) => p.High_Dose_Days > M3_THRESHOLD).length, total),
      highDose:      pts.filter((p) => p.Composite_Overuse > 0).length,
      highDoseRate:  rate(pts.filter((p) => p.Composite_Overuse > 0).length, total),
      ocsOveruse,    m7Rate: rate(ocsOveruse, total),
      repeatCourse:  pts.filter((p) => p.M4 > M4_THRESHOLD).length,
      repeatCourseRate: rate(pts.filter((p) => p.M4 > M4_THRESHOLD).length, total),
      taperFailure:  pts.filter((p) => p.M5 > M5_THRESHOLD).length,
      relapse:       pts.filter((p) => p.M6 > 0 && p.M6 <= M6_THRESHOLD).length,
      topSpecialty,
    }
  })
}

export function aggregateByTerritory(rows: PatientRow[]): TerritoryAgg[] {
  const map = new Map<string, PatientRow[]>()
  for (const r of rows) {
    const b = map.get(r.Territory) ?? []; b.push(r); map.set(r.Territory, b)
  }
  return Array.from(map.entries()).map(([territory, pts]) => {
    const total      = pts.length
    const ocsOveruse = pts.filter((p) => p.Composite_Overuse > M7_THRESHOLD).length
    const hcpCount   = new Set(pts.map((p) => p.NPI)).size
    return {
      territory, region: pts[0].Region, totalPatients: total,
      ocsUse:       pts.filter((p) => p.High_Dose_Days > 0).length,
      chronicOcs:   pts.filter((p) => p.High_Dose_Days > M3_THRESHOLD).length,
      chronicOcsRate: rate(pts.filter((p) => p.High_Dose_Days > M3_THRESHOLD).length, total),
      highDose:     pts.filter((p) => p.Composite_Overuse > 0).length,
      highDoseRate:  rate(pts.filter((p) => p.Composite_Overuse > 0).length, total),
      ocsOveruse,   m7Rate: rate(ocsOveruse, total),
      repeatCourse: pts.filter((p) => p.M4 > M4_THRESHOLD).length,
      repeatCourseRate: rate(pts.filter((p) => p.M4 > M4_THRESHOLD).length, total),
      taperFailure: pts.filter((p) => p.M5 > M5_THRESHOLD).length,
      relapse:      pts.filter((p) => p.M6 > 0 && p.M6 <= M6_THRESHOLD).length,
      hcpCount,
    }
  })
}

export function aggregateByDemographic(rows: PatientRow[]): DemographicAgg[] {
  const map = new Map<string, PatientRow[]>()
  for (const r of rows) {
    const key = `${getAgeBand(r.Pat_Age)}||${r.Pat_Gender}`
    const b = map.get(key) ?? []; b.push(r); map.set(key, b)
  }
  return Array.from(map.entries()).map(([key, pts]) => {
    const [ageBand, gender] = key.split('||') as [AgeBand, string]
    const total      = pts.length
    const ocsOveruse = pts.filter((p) => p.Composite_Overuse > M7_THRESHOLD).length
    return {
      ageBand, gender, totalPatients: total,
      ocsUse:        pts.filter((p) => p.High_Dose_Days > 0).length,
      chronicOcs:    pts.filter((p) => p.High_Dose_Days > M3_THRESHOLD).length,
      chronicOcsRate: rate(pts.filter((p) => p.High_Dose_Days > M3_THRESHOLD).length, total),
      highDose:      pts.filter((p) => p.Composite_Overuse > 0).length,
      highDoseRate:  rate(pts.filter((p) => p.Composite_Overuse > 0).length, total),
      ocsOveruse,    m7Rate: rate(ocsOveruse, total),
      repeatCourse:  pts.filter((p) => p.M4 > M4_THRESHOLD).length,
      repeatCourseRate: rate(pts.filter((p) => p.M4 > M4_THRESHOLD).length, total),
      taperFailure:  pts.filter((p) => p.M5 > M5_THRESHOLD).length,
      relapse:       pts.filter((p) => p.M6 > 0 && p.M6 <= M6_THRESHOLD).length,
    }
  })
}
