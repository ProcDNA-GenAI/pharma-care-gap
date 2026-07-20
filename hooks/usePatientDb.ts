'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { SqlDatabase } from '@/lib/db/sqlite-singleton'
import type { ParameterValues } from '@/lib/types'
import type {
  GlobalKpis, HcpAgg, AccountAgg, TerritoryAgg, DemographicAgg,
  SpecialtyAgg, AgeDistributionAgg, HcpSegmentAgg, PatientRow,
} from '@/lib/types/insights'
import { MOCK_GLOBAL_KPIS, MOCK_HCP_ROWS, MOCK_ACCOUNT_ROWS, MOCK_TERRITORY_ROWS, MOCK_DEMOGRAPHIC_ROWS } from '@/lib/mocks/insights.mock'
import { buildMetricsViewSQL, CREATE_FACT_TABLE_SQL, TRUNCATE_FACT_TABLE_SQL } from '@/lib/db/ruleEngine'
import {
  GLOBAL_KPIS_SQL, HCP_AGG_SQL, ACCOUNT_AGG_SQL, TERRITORY_AGG_SQL, DEMOGRAPHIC_AGG_SQL,
  SPECIALTY_AGG_SQL, AGE_DISTRIBUTION_SQL, HCP_SEGMENT_SQL,
} from '@/lib/db/kpiEngine'

// ─── Types ────────────────────────────────────────────────────────────────────

export type DbStatus = 'idle' | 'initializing' | 'ready' | 'loading' | 'computing' | 'error'

export interface UsePatientDbResult {
  status: DbStatus
  statusLabel: string
  hasRealData: boolean
  rowCount: number
  loadFile: (file: File) => Promise<void>
  kpis: GlobalKpis
  hcpRows: HcpAgg[]
  accountRows: AccountAgg[]
  territoryRows: TerritoryAgg[]
  demographicRows: DemographicAgg[]
  specialtyRows: SpecialtyAgg[]
  ageDistributionRows: AgeDistributionAgg[]
  hcpSegmentRows: HcpSegmentAgg[]
  dataDate: string
  error: string | null
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function n(v: unknown): number {
  if (v === null || v === undefined) return 0
  const num = typeof v === 'number' ? v : Number(v)
  return isNaN(num) ? 0 : num
}
function s(v: unknown): string {
  return v === null || v === undefined ? '' : String(v)
}
function pct(num: number, den: number) {
  return den === 0 ? 0 : Math.round((num / den) * 1000) / 10
}

type SqlRow = Record<string, unknown>

const DEFAULT_DATASET_PATH = '/IBD_Care_Gap_Synthetic_50K_Upd.xlsx'
const INSERT_PATIENT_FACT_SQL = `INSERT INTO patient_fact VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`

/** Convert sql.js exec() result to plain objects. */
function toObjects(result: { columns: string[]; values: unknown[][] }[]): SqlRow[] {
  if (!result.length) return []
  const { columns, values } = result[0]
  return values.map((row) => Object.fromEntries(columns.map((col, i) => [col, row[i]])))
}

function insertRows(db: SqlDatabase, rows: PatientRow[]) {
  const stmt = db.prepare(INSERT_PATIENT_FACT_SQL)
  db.run('BEGIN TRANSACTION')
  for (const r of rows) {
    stmt.run([
      r.Patient_ID,
      r.Age,
      r.Gender,
      r.State,
      r.Region,
      r.Territory_ID,
      r.MSL_Territory,
      r.NPI_ID,
      r.HCP_Name,
      r.Specialty,
      r.Diagnosis,
      r.Minimum_IBD_Claims,
      r.Gap_First_Last_IBD_Dx_Claim_Days,
      r.Chronic_OCS_Days,
      r.High_Dose_Consecutive_Days,
      r.No_of_OCS_Episodes,
      r.Lookforward,
      r['Prednisone Equivalent'],
      r['Cumulative Prednisone'],
      r['Min Gap between OCS courses'],
    ])
  }
  db.run('COMMIT')
  stmt.free()
}

// ─── The Hook ────────────────────────────────────────────────────────────────

export function usePatientDb(parameters: ParameterValues): UsePatientDbResult {
  const [status, setStatus] = useState<DbStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [hasRealData, setHasRealData] = useState(false)
  const [rowCount, setRowCount] = useState(0)
  const [dataDate, setDataDate] = useState('')
  const [kpis, setKpis] = useState<GlobalKpis>(MOCK_GLOBAL_KPIS)
  const [hcpRows, setHcpRows] = useState<HcpAgg[]>(MOCK_HCP_ROWS)
  const [accountRows, setAccountRows] = useState<AccountAgg[]>(MOCK_ACCOUNT_ROWS)
  const [territoryRows, setTerritoryRows] = useState<TerritoryAgg[]>(MOCK_TERRITORY_ROWS)
  const [demographicRows, setDemographicRows] = useState<DemographicAgg[]>(MOCK_DEMOGRAPHIC_ROWS)
  const [specialtyRows, setSpecialtyRows] = useState<SpecialtyAgg[]>([])
  const [ageDistributionRows, setAgeDistributionRows] = useState<AgeDistributionAgg[]>([])
  const [hcpSegmentRows, setHcpSegmentRows] = useState<HcpSegmentAgg[]>([])

  const dbRef = useRef<SqlDatabase | null>(null)
  const paramsRef = useRef(parameters)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  paramsRef.current = parameters

  // ── Core query runner (wraps synchronous sql.js in a Promise + setTimeout) ─
  const runQueries = useCallback(async (params: ParameterValues) => {
    const db = dbRef.current
    if (!db) return

    setStatus('computing')

    await new Promise<void>((resolve, reject) => {
      // setTimeout(0) yields to the event loop so the UI can paint "computing" first
      setTimeout(() => {
        try {
          // 1. Rebuild patient_metrics view with new thresholds
          for (const sql of buildMetricsViewSQL(params)) db.run(sql)

          // 2. Global KPIs
          const kpiRows = toObjects(db.exec(GLOBAL_KPIS_SQL))
          const kr = kpiRows[0] ?? {}
          const total       = n(kr.total_patients)
          const ocsUse      = n(kr.ocs_use)
          const chronicOcs  = n(kr.chronic_ocs)
          const highDose    = n(kr.high_dose)
          const repeatCourse= n(kr.repeat_course)
          const taperFailure= n(kr.taper_failure)
          const relapse     = n(kr.relapse)
          const ocsOveruse  = n(kr.ocs_overuse)

          setKpis({
            totalPatients:    total,
            ocsUse,           ocsUseRate:       pct(ocsUse, total),
            ocsOveruse,       ocsOveruseRate:   pct(ocsOveruse, total),
            m7Rate:           pct(ocsOveruse, total),
            chronicOcs,       chronicOcsRate:   pct(chronicOcs, total),
            highDose,         highDoseRate:     pct(highDose, total),
            repeatCourse,     repeatCourseRate: pct(repeatCourse, total),
            taperFailure,     taperFailureRate: pct(taperFailure, ocsUse),
            relapse,          relapseRate:      pct(relapse, ocsUse),
          })

          // 3. HCP aggregation
          const hcpRaw = toObjects(db.exec(HCP_AGG_SQL))
          setHcpRows(hcpRaw.map((r) => ({
            npi:          s(r.npi),
            name:         s(r.npi),
            specialty:    s(r.specialty),
            account:      s(r.account),
            territory:    s(r.territory),
            region:       s(r.region),
            totalPatients: n(r.total_patients),
            ocsUse:        n(r.ocs_use),
            chronicOcs:    n(r.chronic_ocs),
            chronicOcsRate: pct(n(r.chronic_ocs), n(r.total_patients)),
            highDose:      n(r.high_dose),
            highDoseRate:  pct(n(r.high_dose), n(r.total_patients)),
            ocsOveruse:    n(r.ocs_overuse),
            repeatCourse:  n(r.repeat_course),
            repeatCourseRate: pct(n(r.repeat_course), n(r.total_patients)),
            taperFailure:  n(r.taper_failure),
            relapse:       n(r.relapse),
            m7Rate:        n(r.m7_rate),
          })))

          // 4. Account aggregation
          const accountRaw = toObjects(db.exec(ACCOUNT_AGG_SQL))
          setAccountRows(accountRaw.map((r) => ({
            account:      s(r.account),
            territory:    s(r.territory),
            region:       s(r.region),
            hcpCount:     n(r.hcp_count),
            totalPatients: n(r.total_patients),
            ocsUse:       n(r.ocs_use),
            chronicOcs:   n(r.chronic_ocs),
            chronicOcsRate: pct(n(r.chronic_ocs), n(r.total_patients)),
            highDose:     n(r.high_dose),
            highDoseRate: pct(n(r.high_dose), n(r.total_patients)),
            ocsOveruse:   n(r.ocs_overuse),
            repeatCourse: n(r.repeat_course),
            repeatCourseRate: pct(n(r.repeat_course), n(r.total_patients)),
            taperFailure: n(r.taper_failure),
            relapse:      n(r.relapse),
            m7Rate:       n(r.m7_rate),
            topSpecialty: s(r.top_specialty),
          })))

          // 5. Territory aggregation
          const terrRaw = toObjects(db.exec(TERRITORY_AGG_SQL))
          setTerritoryRows(terrRaw.map((r) => ({
            territory:    s(r.territory),
            region:       s(r.region),
            totalPatients: n(r.total_patients),
            ocsUse:       n(r.ocs_use),
            chronicOcs:   n(r.chronic_ocs),
            chronicOcsRate: pct(n(r.chronic_ocs), n(r.total_patients)),
            highDose:     n(r.high_dose),
            highDoseRate: pct(n(r.high_dose), n(r.total_patients)),
            ocsOveruse:   n(r.ocs_overuse),
            repeatCourse: n(r.repeat_course),
            repeatCourseRate: pct(n(r.repeat_course), n(r.total_patients)),
            taperFailure: n(r.taper_failure),
            relapse:      n(r.relapse),
            m7Rate:       n(r.m7_rate),
            hcpCount:     n(r.hcp_count),
          })))

          // 6. Demographic aggregation
          const demoRaw = toObjects(db.exec(DEMOGRAPHIC_AGG_SQL))
          setDemographicRows(demoRaw.map((r) => ({
            ageBand:      s(r.age_band) as DemographicAgg['ageBand'],
            gender:       s(r.gender),
            totalPatients: n(r.total_patients),
            ocsUse:       n(r.ocs_use),
            chronicOcs:   n(r.chronic_ocs),
            chronicOcsRate: pct(n(r.chronic_ocs), n(r.total_patients)),
            highDose:     n(r.high_dose),
            highDoseRate: pct(n(r.high_dose), n(r.total_patients)),
            ocsOveruse:   n(r.ocs_overuse),
            repeatCourse: n(r.repeat_course),
            repeatCourseRate: pct(n(r.repeat_course), n(r.total_patients)),
            taperFailure: n(r.taper_failure),
            relapse:      n(r.relapse),
            m7Rate:       n(r.m7_rate),
          })))

          // 7. Specialty distribution
          const specialtyRaw = toObjects(db.exec(SPECIALTY_AGG_SQL))
          setSpecialtyRows(specialtyRaw.map((r) => ({
            specialty:     s(r.specialty),
            totalPatients: n(r.total_patients),
            overusers:     n(r.overusers),
            overuseRate:   n(r.overuse_rate),
          })))

          // 8. Age distribution
          const ageRaw = toObjects(db.exec(AGE_DISTRIBUTION_SQL))
          setAgeDistributionRows(ageRaw.map((r) => ({
            ageBand:       s(r.age_band) as AgeDistributionAgg['ageBand'],
            totalPatients: n(r.total_patients),
            overusers:     n(r.overusers),
            overuseRate:   n(r.overuse_rate),
          })))

          // 9. HCP overuse-rate segments
          const segmentRaw = toObjects(db.exec(HCP_SEGMENT_SQL))
          setHcpSegmentRows(segmentRaw.map((r) => ({
            band:     s(r.band),
            hcpCount: n(r.hcp_count),
            patients: n(r.patients),
          })))

          setStatus('ready')
          resolve()
        } catch (err) {
          reject(err)
        }
      }, 0)
    }).catch((err: unknown) => {
      console.error('[SQLite] query failed', err)
      setError(err instanceof Error ? err.message : 'Query execution failed')
      setStatus('error')
    })
  }, [])

  // ── Initialize SQLite + auto-load demo data on mount ───────────────────────
  useEffect(() => {
    let cancelled = false
    setStatus('initializing')

    ;(async () => {
      try {
        const { getSqlJs } = await import('@/lib/db/sqlite-singleton')
        if (cancelled) return
        const SQL = await getSqlJs()
        if (cancelled) return

        const db = new SQL.Database()
        db.run(CREATE_FACT_TABLE_SQL)
        dbRef.current = db

        // Auto-load demo CSV so parameters are reactive before manual upload
        setStatus('loading')
        let demoLoaded = false
        let demoLoadError: string | null = null
        try {
          const res = await fetch(DEFAULT_DATASET_PATH)
          if (!res.ok) {
            throw new Error(`Could not load ${DEFAULT_DATASET_PATH} (HTTP ${res.status})`)
          }
          if (!cancelled) {
            const { parseExcelBuffer } = await import('@/lib/utils/parseExcel')
            const rows = await parseExcelBuffer(await res.arrayBuffer())
            if (!rows.length) throw new Error('The bundled dataset contains no patient rows')
            if (!cancelled) {
              insertRows(db, rows)
              setRowCount(rows.length)
              setHasRealData(true)
              setDataDate(`IBD_Care_Gap_Synthetic_50K_Upd · ${rows.length.toLocaleString()} patients`)
              demoLoaded = true
            }
          }
        } catch (err) {
          try { db.run('ROLLBACK') } catch { /* no active transaction */ }
          demoLoadError = err instanceof Error ? err.message : 'Failed to load the bundled dataset'
          console.error('[SQLite] bundled dataset load failed', err)
        }

        if (!cancelled) {
          if (demoLoaded) {
            await runQueries(paramsRef.current)
          } else {
            setError(demoLoadError ?? 'The bundled dataset could not be loaded')
            setStatus('error')
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[SQLite] init failed', err)
          setError('Failed to initialize SQLite. Check your network connection.')
          setStatus('error')
        }
      }
    })()

    return () => {
      cancelled = true
      dbRef.current?.close()
    }
  }, [runQueries])

  // ── Re-run queries whenever parameters change (debounced 350 ms) ──────────
  useEffect(() => {
    if (!hasRealData) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      void runQueries(parameters)
    }, 350)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parameters, hasRealData])

  // ── File loader ────────────────────────────────────────────────────────────
  const loadFile = useCallback(async (file: File) => {
    const db = dbRef.current
    if (!db) throw new Error('Database not ready — wait for initialization')

    setStatus('loading')
    setError(null)

    try {
      const ext = file.name.split('.').pop()?.toLowerCase()

      // Parse to rows (CSV → papaparse, Excel → xlsx)
      let rows: PatientRow[]

      if (ext === 'csv') {
        const { parseCsvFile } = await import('@/lib/utils/parseExcel')
        rows = await parseCsvFile(file)
      } else {
        const { parseExcelFile } = await import('@/lib/utils/parseExcel')
        rows = await parseExcelFile(file)
      }

      if (!rows.length) throw new Error('File is empty or could not be parsed')

      // Clear and (re)create fact table
      db.run(TRUNCATE_FACT_TABLE_SQL)

      // Batch insert inside one transaction — critical for performance with 50k rows
      insertRows(db, rows)

      setRowCount(rows.length)
      setHasRealData(true)
      setDataDate(
        `${file.name} · ${rows.length.toLocaleString()} patients · ` +
        new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      )

      await runQueries(paramsRef.current)
    } catch (err) {
      try { db.run('ROLLBACK') } catch { /* no active transaction */ }
      const msg = err instanceof Error ? err.message : 'Failed to load file'
      setError(msg)
      setStatus('error')
      throw new Error(msg)
    }
  }, [runQueries])

  const STATUS_LABELS: Record<DbStatus, string> = {
    idle:         'Idle',
    initializing: 'Initializing SQLite…',
    ready:        'Ready',
    loading:      'Loading data…',
    computing:    'Recalculating…',
    error:        'Error',
  }

  return {
    status, statusLabel: STATUS_LABELS[status],
    hasRealData, rowCount,
    loadFile,
    kpis, hcpRows, accountRows, territoryRows, demographicRows,
    specialtyRows, ageDistributionRows, hcpSegmentRows,
    dataDate, error,
  }
}
