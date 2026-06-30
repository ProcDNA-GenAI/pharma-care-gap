/**
 * SQLite-compatible aggregate queries run against the patient_metrics view.
 * Uses SUM(CASE WHEN …) instead of COUNT(*) FILTER (WHERE …) for SQLite compat.
 */

export const GLOBAL_KPIS_SQL = `
  SELECT
    SUM(M1_flag) AS total_patients,
    SUM(CASE WHEN M1_flag=1 AND M2 >= 1  THEN 1 ELSE 0 END) AS ocs_use,
    SUM(CASE WHEN M1_flag=1 AND M2_flag=1 THEN 1 ELSE 0 END) AS chronic_ocs,
    SUM(CASE WHEN M1_flag=1 AND M3_flag=1 THEN 1 ELSE 0 END) AS high_dose,
    SUM(CASE WHEN M1_flag=1 AND M4_flag=1 THEN 1 ELSE 0 END) AS repeat_course,
    SUM(CASE WHEN M1_flag=1 AND M5_flag=1 THEN 1 ELSE 0 END) AS taper_failure,
    SUM(CASE WHEN M1_flag=1 AND M6_flag=1 THEN 1 ELSE 0 END) AS relapse,
    SUM(CASE WHEN M1_flag=1 AND M7_flag=1 THEN 1 ELSE 0 END) AS ocs_overuse
  FROM patient_metrics
`

export const HCP_AGG_SQL = `
  SELECT
    NPI AS npi,
    MIN(Specialty)  AS specialty,
    MIN(Account)    AS account,
    MIN(Territory)  AS territory,
    MIN(Region)     AS region,
    SUM(M1_flag)    AS total_patients,
    SUM(CASE WHEN M1_flag=1 AND M2_flag=1 THEN 1 ELSE 0 END) AS chronic_ocs,
    SUM(CASE WHEN M1_flag=1 AND M3_flag=1 THEN 1 ELSE 0 END) AS high_dose,
    SUM(CASE WHEN M1_flag=1 AND M4_flag=1 THEN 1 ELSE 0 END) AS repeat_course,
    SUM(CASE WHEN M1_flag=1 AND M5_flag=1 THEN 1 ELSE 0 END) AS taper_failure,
    SUM(CASE WHEN M1_flag=1 AND M6_flag=1 THEN 1 ELSE 0 END) AS relapse,
    SUM(CASE WHEN M1_flag=1 AND M7_flag=1 THEN 1 ELSE 0 END) AS ocs_overuse,
    ROUND(
      100.0 * SUM(CASE WHEN M1_flag=1 AND M7_flag=1 THEN 1 ELSE 0 END) /
      NULLIF(SUM(M1_flag), 0)
    , 1) AS m7_rate
  FROM patient_metrics
  GROUP BY NPI
  HAVING SUM(M1_flag) > 0
  ORDER BY m7_rate DESC
`

export const ACCOUNT_AGG_SQL = `
  SELECT
    Account AS account,
    MIN(Territory) AS territory,
    MIN(Region)    AS region,
    SUM(M1_flag)   AS total_patients,
    SUM(CASE WHEN M1_flag=1 AND M2_flag=1 THEN 1 ELSE 0 END) AS chronic_ocs,
    SUM(CASE WHEN M1_flag=1 AND M4_flag=1 THEN 1 ELSE 0 END) AS repeat_course,
    SUM(CASE WHEN M1_flag=1 AND M7_flag=1 THEN 1 ELSE 0 END) AS ocs_overuse,
    MIN(Specialty) AS top_specialty,
    ROUND(
      100.0 * SUM(CASE WHEN M1_flag=1 AND M7_flag=1 THEN 1 ELSE 0 END) /
      NULLIF(SUM(M1_flag), 0)
    , 1) AS m7_rate
  FROM patient_metrics
  GROUP BY Account
  HAVING SUM(M1_flag) > 0
  ORDER BY m7_rate DESC
`

export const TERRITORY_AGG_SQL = `
  SELECT
    Territory AS territory,
    MIN(Region) AS region,
    SUM(M1_flag) AS total_patients,
    SUM(CASE WHEN M1_flag=1 AND M2_flag=1 THEN 1 ELSE 0 END) AS chronic_ocs,
    SUM(CASE WHEN M1_flag=1 AND M7_flag=1 THEN 1 ELSE 0 END) AS ocs_overuse,
    COUNT(DISTINCT NPI) AS hcp_count,
    ROUND(
      100.0 * SUM(CASE WHEN M1_flag=1 AND M7_flag=1 THEN 1 ELSE 0 END) /
      NULLIF(SUM(M1_flag), 0)
    , 1) AS m7_rate
  FROM patient_metrics
  GROUP BY Territory
  HAVING SUM(M1_flag) > 0
  ORDER BY m7_rate DESC
`

export const DEMOGRAPHIC_AGG_SQL = `
  SELECT
    CASE
      WHEN Pat_Age < 35 THEN '18–34'
      WHEN Pat_Age < 50 THEN '35–49'
      WHEN Pat_Age < 65 THEN '50–64'
      ELSE '65+'
    END AS age_band,
    Pat_Gender AS gender,
    SUM(M1_flag)  AS total_patients,
    SUM(CASE WHEN M1_flag=1 AND M2_flag=1 THEN 1 ELSE 0 END) AS chronic_ocs,
    SUM(CASE WHEN M1_flag=1 AND M4_flag=1 THEN 1 ELSE 0 END) AS repeat_course,
    SUM(CASE WHEN M1_flag=1 AND M7_flag=1 THEN 1 ELSE 0 END) AS ocs_overuse,
    ROUND(
      100.0 * SUM(CASE WHEN M1_flag=1 AND M7_flag=1 THEN 1 ELSE 0 END) /
      NULLIF(SUM(M1_flag), 0)
    , 1) AS m7_rate
  FROM patient_metrics
  GROUP BY age_band, Pat_Gender
  HAVING SUM(M1_flag) > 0
  ORDER BY age_band, Pat_Gender
`
