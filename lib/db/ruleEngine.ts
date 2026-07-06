import type { ParameterValues } from '@/lib/types'

/** DDL for the raw patient fact table — created once per session. */
export const CREATE_FACT_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS patient_fact (
    Pat_ID    TEXT,
    NPI       TEXT,
    Specialty TEXT,
    Account   TEXT,
    Territory TEXT,
    Region    TEXT,
    Pat_Age   INTEGER,
    Pat_Gender TEXT,
    IBD_Claims REAL, Chronic_OCS_Days REAL, High_Dose_Days REAL,
    M4 REAL, M5 REAL, M6 REAL, Composite_Overuse REAL
  )
`

export const TRUNCATE_FACT_TABLE_SQL = `DELETE FROM patient_fact`

/**
 * Returns SQL statements that recreate the patient_metrics view.
 * Must be executed in order (DROP first, then CREATE).
 *
 * Flag semantics against raw measurements:
 *   IBD_Claims       = IBD claim count       → flag if >= ibdMinClaims
 *   Chronic_OCS_Days = cumulative OCS days   → flag if >= ocsDurationThreshold
 *   High_Dose_Days   = high-dose OCS days    → flag if >= highDoseDurationDays
 *   M4 = repeat course count   → flag if > 1
 *   M5 = months to taper fail  → flag if > taperFailMonths
 *   M6 = months to relapse     → flag if > 0 AND <= relapseWindowMonths
 *   Composite_Overuse = composite (OR of Chronic_OCS_Days/High_Dose_Days/M4–M6 flags)
 */
export function buildMetricsViewSQL(p: ParameterValues): string[] {
  const ocs  = p.ocsDurationThreshold
  const hdur = p.highDoseDurationDays
  const tap  = p.taperFailMonths
  const rel  = p.relapseWindowMonths
  const ibd  = p.ibdMinClaims

  const m2f = `CASE WHEN Chronic_OCS_Days >= ${ocs}  THEN 1 ELSE 0 END`
  const m3f = `CASE WHEN High_Dose_Days >= ${hdur} THEN 1 ELSE 0 END`
  const m4f = `CASE WHEN M4 > 1        THEN 1 ELSE 0 END`
  const m5f = `CASE WHEN M5 > ${tap}   THEN 1 ELSE 0 END`
  const m6f = `CASE WHEN M6 > 0 AND M6 <= ${rel} THEN 1 ELSE 0 END`

  return [
    `DROP VIEW IF EXISTS patient_metrics`,
    `CREATE VIEW patient_metrics AS
      SELECT
        Pat_ID, NPI, Specialty, Account, Territory, Region, Pat_Age, Pat_Gender,
        IBD_Claims, Chronic_OCS_Days, High_Dose_Days, M4, M5, M6, Composite_Overuse,
        CASE WHEN IBD_Claims >= ${ibd} THEN 1 ELSE 0 END  AS IBD_Claims_flag,
        ${m2f} AS Chronic_OCS_Days_flag,
        ${m3f} AS High_Dose_Days_flag,
        ${m4f} AS M4_flag,
        ${m5f} AS M5_flag,
        ${m6f} AS M6_flag,
        CASE WHEN
          ${m2f} = 1 OR ${m3f} = 1 OR
          ${m4f} = 1 OR ${m5f} = 1 OR ${m6f} = 1
        THEN 1 ELSE 0 END AS Composite_Overuse_flag
      FROM patient_fact
      WHERE Pat_Age >= 18`,
  ]
}
