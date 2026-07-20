import type { ParameterValues } from '@/lib/types'

/** DDL for the raw patient fact table — created once per session. */
export const CREATE_FACT_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS patient_fact (
    Patient_ID TEXT,
    Age INTEGER,
    Gender TEXT,
    State TEXT,
    Region TEXT,
    Territory_ID TEXT,
    MSL_Territory TEXT,
    NPI_ID TEXT,
    HCP_Name TEXT,
    Specialty TEXT,
    Diagnosis TEXT,
    Minimum_IBD_Claims REAL,
    Gap_First_Last_IBD_Dx_Claim_Days REAL,
    Chronic_OCS_Days REAL,
    High_Dose_Consecutive_Days REAL,
    No_of_OCS_Episodes REAL,
    Lookforward REAL,
    "Prednisone Equivalent" REAL,
    "Cumulative Prednisone" REAL,
    "Min Gap between OCS courses" REAL
  )
`

export const TRUNCATE_FACT_TABLE_SQL = `DELETE FROM patient_fact`

/**
 * Returns SQL statements that recreate the patient_metrics view.
 * Must be executed in order (DROP first, then CREATE).
 *
 * Flag semantics against the updated 50K patient-level dataset:
 *   Lookforward exact-matches measurementMonths.
 *   Minimum_IBD_Claims and all other selected thresholds use direct >= comparisons.
 *   M5/M6 are inactive because the updated dataset has no taper/relapse columns.
 */
export function buildMetricsViewSQL(p: ParameterValues): string[] {
  const ocs  = p.ocsDurationThreshold
  const hdur = p.highDoseDurationDays
  const ibd  = p.ibdMinClaims

  const lookforwardFlag = p.m1Enabled ? `CASE WHEN Lookforward = ${p.measurementMonths} THEN 1 ELSE 0 END` : `0`
  const minIbdClaimsFlag = p.m1Enabled ? `CASE WHEN Minimum_IBD_Claims >= ${ibd} THEN 1 ELSE 0 END` : `0`
  const ibdGapFlag = p.m1Enabled ? `CASE WHEN Gap_First_Last_IBD_Dx_Claim_Days >= ${p.ibdGapDays} THEN 1 ELSE 0 END` : `0`
  const ibdFlag = p.m1Enabled
    ? `CASE WHEN Lookforward = ${p.measurementMonths}
          AND Minimum_IBD_Claims >= ${ibd}
          AND Gap_First_Last_IBD_Dx_Claim_Days >= ${p.ibdGapDays}
        THEN 1 ELSE 0 END`
    : `0`
  const chronicOcsFlag = p.m2Enabled ? `CASE WHEN Chronic_OCS_Days >= ${ocs} THEN 1 ELSE 0 END` : `0`
  const highDoseDaysFlag = p.m3Enabled ? `CASE WHEN High_Dose_Consecutive_Days >= ${hdur} THEN 1 ELSE 0 END` : `0`
  const prednisoneEquivalentFlag = p.m3Enabled ? `CASE WHEN "Prednisone Equivalent" >= ${p.highDoseMg} THEN 1 ELSE 0 END` : `0`
  const cumulativePrednisoneFlag = p.m3Enabled ? `CASE WHEN "Cumulative Prednisone" >= ${p.highDoseCumulativeMg} THEN 1 ELSE 0 END` : `0`
  const m3f = p.m3Enabled
    ? `CASE WHEN High_Dose_Consecutive_Days >= ${hdur}
          AND "Prednisone Equivalent" >= ${p.highDoseMg}
          AND "Cumulative Prednisone" >= ${p.highDoseCumulativeMg}
        THEN 1 ELSE 0 END`
    : `0`
  const minOcsCourseGapFlag = p.m4Enabled ? `CASE WHEN "Min Gap between OCS courses" >= ${p.courseGapDays} THEN 1 ELSE 0 END` : `0`
  const m5f = `0`
  const m6f = `0`
  let compositeExpr = '0'
  if (p.m7Enabled) {
    const sumExpr = `(${chronicOcsFlag}) + (${m3f}) + (${minOcsCourseGapFlag})`
    if (p.compositeLogic === 'Any_2') {
      compositeExpr = `CASE WHEN ${sumExpr} >= 2 THEN 1 ELSE 0 END`
    } else if (p.compositeLogic === 'All_3') {
      const activeCount = (p.m2Enabled ? 1 : 0) + (p.m3Enabled ? 1 : 0) + (p.m4Enabled ? 1 : 0)
      compositeExpr = activeCount > 0 ? `CASE WHEN ${sumExpr} = ${activeCount} THEN 1 ELSE 0 END` : `0`
    } else {
      compositeExpr = `CASE WHEN ${sumExpr} >= 1 THEN 1 ELSE 0 END`
    }
  }

  return [
    `DROP VIEW IF EXISTS patient_metrics`,
    `CREATE VIEW patient_metrics AS
      SELECT
        Patient_ID AS Pat_ID,
        NPI_ID AS NPI,
        Specialty,
        HCP_Name AS Account,
        MSL_Territory AS Territory,
        Region,
        Age AS Pat_Age,
        Gender AS Pat_Gender,
        Minimum_IBD_Claims AS IBD_Claims,
        Chronic_OCS_Days,
        High_Dose_Consecutive_Days AS High_Dose_Days,
        No_of_OCS_Episodes AS M4,
        0 AS M5,
        0 AS M6,
        0 AS Composite_Overuse,
        Lookforward,
        Gap_First_Last_IBD_Dx_Claim_Days,
        "Prednisone Equivalent",
        "Cumulative Prednisone",
        "Min Gap between OCS courses",
        ${lookforwardFlag} AS Lookforward_flag,
        ${minIbdClaimsFlag} AS Minimum_IBD_Claims_flag,
        ${ibdGapFlag} AS Gap_First_Last_IBD_Dx_Claim_Days_flag,
        ${chronicOcsFlag} AS Chronic_OCS_Days_threshold_flag,
        ${highDoseDaysFlag} AS High_Dose_Consecutive_Days_flag,
        ${prednisoneEquivalentFlag} AS Prednisone_Equivalent_flag,
        ${cumulativePrednisoneFlag} AS Cumulative_Prednisone_flag,
        ${minOcsCourseGapFlag} AS Min_Gap_between_OCS_courses_flag,
        ${ibdFlag}  AS IBD_Claims_flag,
        ${chronicOcsFlag} AS Chronic_OCS_Days_flag,
        ${m3f} AS High_Dose_Days_flag,
        ${minOcsCourseGapFlag} AS M4_flag,
        ${m5f} AS M5_flag,
        ${m6f} AS M6_flag,
        ${compositeExpr} AS Composite_Overuse_flag
      FROM patient_fact
      WHERE Age >= 18`,
  ]
}
