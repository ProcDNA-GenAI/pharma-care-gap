/**
 * SQLite-compatible aggregate queries run against the patient_metrics view.
 * Uses SUM(CASE WHEN …) instead of COUNT(*) FILTER (WHERE …) for SQLite compat.
 */

const OCS_USER_SQL = `No_of_OCS_Episodes > 0`

const HIGH_DOSE_CRITERIA_SQL = `
  High_Dose_Consecutive_Days_flag=1
  AND Prednisone_Equivalent_flag=1
  AND Cumulative_Prednisone_flag=1
`

export const GLOBAL_KPIS_SQL = `
  SELECT
    SUM(IBD_Claims_flag) AS total_patients,
    SUM(CASE WHEN IBD_Claims_flag=1 AND (${OCS_USER_SQL}) THEN 1 ELSE 0 END) AS ocs_use,
    SUM(CASE WHEN IBD_Claims_flag=1 AND Chronic_OCS_Days_threshold_flag=1 THEN 1 ELSE 0 END) AS chronic_ocs,
    SUM(CASE WHEN IBD_Claims_flag=1 AND (${HIGH_DOSE_CRITERIA_SQL}) THEN 1 ELSE 0 END) AS high_dose,
    SUM(CASE WHEN IBD_Claims_flag=1 AND Min_Gap_between_OCS_courses_flag=1 THEN 1 ELSE 0 END) AS repeat_course,
    0 AS taper_failure,
    0 AS relapse,
    SUM(CASE WHEN IBD_Claims_flag=1 AND Composite_Overuse_flag=1 THEN 1 ELSE 0 END) AS ocs_overuse
  FROM patient_metrics
`

export const HCP_AGG_SQL = `
  SELECT
    NPI AS npi,
    MIN(Specialty)  AS specialty,
    MIN(Account)    AS account,
    MIN(Territory)  AS territory,
    MIN(Region)     AS region,
    SUM(IBD_Claims_flag)    AS total_patients,
    SUM(CASE WHEN IBD_Claims_flag=1 AND (${OCS_USER_SQL}) THEN 1 ELSE 0 END) AS ocs_use,
    SUM(CASE WHEN IBD_Claims_flag=1 AND Chronic_OCS_Days_threshold_flag=1 THEN 1 ELSE 0 END) AS chronic_ocs,
    SUM(CASE WHEN IBD_Claims_flag=1 AND (${HIGH_DOSE_CRITERIA_SQL}) THEN 1 ELSE 0 END) AS high_dose,
    SUM(CASE WHEN IBD_Claims_flag=1 AND Min_Gap_between_OCS_courses_flag=1 THEN 1 ELSE 0 END) AS repeat_course,
    0 AS taper_failure,
    0 AS relapse,
    SUM(CASE WHEN IBD_Claims_flag=1 AND Composite_Overuse_flag=1 THEN 1 ELSE 0 END) AS ocs_overuse,
    ROUND(
      100.0 * SUM(CASE WHEN IBD_Claims_flag=1 AND Composite_Overuse_flag=1 THEN 1 ELSE 0 END) /
      NULLIF(SUM(IBD_Claims_flag), 0)
    , 1) AS m7_rate
  FROM patient_metrics
  GROUP BY NPI
  HAVING SUM(IBD_Claims_flag) > 0
  ORDER BY m7_rate DESC
`

export const ACCOUNT_AGG_SQL = `
  SELECT
    Account AS account,
    MIN(Territory) AS territory,
    MIN(Region)    AS region,
    COUNT(DISTINCT NPI) AS hcp_count,
    SUM(IBD_Claims_flag)   AS total_patients,
    SUM(CASE WHEN IBD_Claims_flag=1 AND (${OCS_USER_SQL}) THEN 1 ELSE 0 END) AS ocs_use,
    SUM(CASE WHEN IBD_Claims_flag=1 AND Chronic_OCS_Days_threshold_flag=1 THEN 1 ELSE 0 END) AS chronic_ocs,
    SUM(CASE WHEN IBD_Claims_flag=1 AND (${HIGH_DOSE_CRITERIA_SQL}) THEN 1 ELSE 0 END) AS high_dose,
    SUM(CASE WHEN IBD_Claims_flag=1 AND Min_Gap_between_OCS_courses_flag=1 THEN 1 ELSE 0 END) AS repeat_course,
    0 AS taper_failure,
    0 AS relapse,
    SUM(CASE WHEN IBD_Claims_flag=1 AND Composite_Overuse_flag=1 THEN 1 ELSE 0 END) AS ocs_overuse,
    MIN(Specialty) AS top_specialty,
    ROUND(
      100.0 * SUM(CASE WHEN IBD_Claims_flag=1 AND Composite_Overuse_flag=1 THEN 1 ELSE 0 END) /
      NULLIF(SUM(IBD_Claims_flag), 0)
    , 1) AS m7_rate
  FROM patient_metrics
  GROUP BY Account
  HAVING SUM(IBD_Claims_flag) > 0
  ORDER BY m7_rate DESC
`

export const TERRITORY_AGG_SQL = `
  SELECT
    Territory AS territory,
    MIN(Region) AS region,
    SUM(IBD_Claims_flag) AS total_patients,
    SUM(CASE WHEN IBD_Claims_flag=1 AND (${OCS_USER_SQL}) THEN 1 ELSE 0 END) AS ocs_use,
    SUM(CASE WHEN IBD_Claims_flag=1 AND Chronic_OCS_Days_threshold_flag=1 THEN 1 ELSE 0 END) AS chronic_ocs,
    SUM(CASE WHEN IBD_Claims_flag=1 AND (${HIGH_DOSE_CRITERIA_SQL}) THEN 1 ELSE 0 END) AS high_dose,
    SUM(CASE WHEN IBD_Claims_flag=1 AND Min_Gap_between_OCS_courses_flag=1 THEN 1 ELSE 0 END) AS repeat_course,
    0 AS taper_failure,
    0 AS relapse,
    SUM(CASE WHEN IBD_Claims_flag=1 AND Composite_Overuse_flag=1 THEN 1 ELSE 0 END) AS ocs_overuse,
    COUNT(DISTINCT NPI) AS hcp_count,
    ROUND(
      100.0 * SUM(CASE WHEN IBD_Claims_flag=1 AND Composite_Overuse_flag=1 THEN 1 ELSE 0 END) /
      NULLIF(SUM(IBD_Claims_flag), 0)
    , 1) AS m7_rate
  FROM patient_metrics
  GROUP BY Territory
  HAVING SUM(IBD_Claims_flag) > 0
  ORDER BY m7_rate DESC
`

export const SPECIALTY_AGG_SQL = `
  SELECT
    Specialty AS specialty,
    SUM(IBD_Claims_flag) AS total_patients,
    SUM(CASE WHEN IBD_Claims_flag=1 AND Composite_Overuse_flag=1 THEN 1 ELSE 0 END) AS overusers,
    ROUND(
      100.0 * SUM(CASE WHEN IBD_Claims_flag=1 AND Composite_Overuse_flag=1 THEN 1 ELSE 0 END) /
      NULLIF(SUM(IBD_Claims_flag), 0)
    , 1) AS overuse_rate
  FROM patient_metrics
  GROUP BY Specialty
  HAVING SUM(IBD_Claims_flag) > 0
  ORDER BY total_patients DESC
`

export const AGE_DISTRIBUTION_SQL = `
  SELECT
    CASE
      WHEN Pat_Age < 35 THEN '18–34'
      WHEN Pat_Age < 50 THEN '35–49'
      WHEN Pat_Age < 65 THEN '50–64'
      ELSE '65+'
    END AS age_band,
    SUM(IBD_Claims_flag) AS total_patients,
    SUM(CASE WHEN IBD_Claims_flag=1 AND Composite_Overuse_flag=1 THEN 1 ELSE 0 END) AS overusers,
    ROUND(
      100.0 * SUM(CASE WHEN IBD_Claims_flag=1 AND Composite_Overuse_flag=1 THEN 1 ELSE 0 END) /
      NULLIF(SUM(IBD_Claims_flag), 0)
    , 1) AS overuse_rate
  FROM patient_metrics
  GROUP BY age_band
  HAVING SUM(IBD_Claims_flag) > 0
  ORDER BY age_band
`

export const HCP_SEGMENT_SQL = `
  WITH hcp_rates AS (
    SELECT
      NPI,
      SUM(IBD_Claims_flag) AS total_patients,
      ROUND(
        100.0 * SUM(CASE WHEN IBD_Claims_flag=1 AND Composite_Overuse_flag=1 THEN 1 ELSE 0 END) /
        NULLIF(SUM(IBD_Claims_flag), 0)
      , 1) AS m7_rate
    FROM patient_metrics
    GROUP BY NPI
    HAVING SUM(IBD_Claims_flag) > 0
  )
  SELECT
    CASE
      WHEN m7_rate >= 90 THEN '90–100%'
      WHEN m7_rate >= 80 THEN '80–90%'
      WHEN m7_rate >= 70 THEN '70–80%'
      WHEN m7_rate >= 60 THEN '60–70%'
      ELSE '<60%'
    END AS band,
    CASE
      WHEN m7_rate >= 90 THEN 1
      WHEN m7_rate >= 80 THEN 2
      WHEN m7_rate >= 70 THEN 3
      WHEN m7_rate >= 60 THEN 4
      ELSE 5
    END AS band_order,
    COUNT(*) AS hcp_count,
    SUM(total_patients) AS patients
  FROM hcp_rates
  GROUP BY band, band_order
  ORDER BY band_order
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
    SUM(IBD_Claims_flag)  AS total_patients,
    SUM(CASE WHEN IBD_Claims_flag=1 AND (${OCS_USER_SQL}) THEN 1 ELSE 0 END) AS ocs_use,
    SUM(CASE WHEN IBD_Claims_flag=1 AND Chronic_OCS_Days_threshold_flag=1 THEN 1 ELSE 0 END) AS chronic_ocs,
    SUM(CASE WHEN IBD_Claims_flag=1 AND (${HIGH_DOSE_CRITERIA_SQL}) THEN 1 ELSE 0 END) AS high_dose,
    SUM(CASE WHEN IBD_Claims_flag=1 AND Min_Gap_between_OCS_courses_flag=1 THEN 1 ELSE 0 END) AS repeat_course,
    0 AS taper_failure,
    0 AS relapse,
    SUM(CASE WHEN IBD_Claims_flag=1 AND Composite_Overuse_flag=1 THEN 1 ELSE 0 END) AS ocs_overuse,
    ROUND(
      100.0 * SUM(CASE WHEN IBD_Claims_flag=1 AND Composite_Overuse_flag=1 THEN 1 ELSE 0 END) /
      NULLIF(SUM(IBD_Claims_flag), 0)
    , 1) AS m7_rate
  FROM patient_metrics
  GROUP BY age_band, Pat_Gender
  HAVING SUM(IBD_Claims_flag) > 0
  ORDER BY age_band, Pat_Gender
`
