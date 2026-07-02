import type { RulePackage } from '@/lib/types'

export const MOCK_RULE_PACKAGE: RulePackage = {
  careGapId: 'ibd-biologic-initiation',
  careGapTitle: 'Biologic Therapy Initiation for Moderate to Severe IBD',
  careGapDescription:
    'Identify IBD patients with evidence of chronic or recurrent OCS overuse using a composite metric framework (M1–M7) per AbbVie Medical Affairs Care Gap Analytics Platform SOP.',
  status: 'Active',
  guidelineVersion: 'ACG 2024',
  lastGenerated: 'May 20, 2025 10:32 AM',
  evidenceConfidence: 92,

  // ── M1: IBD Cohort Identification (Denominator) ──────────────────────────
  clinicalSummary: {
    text: 'Patients with ≥ 2 medical claims with K50.x or K51.x (ICD-10 code), ≥30 days apart, within measurement period.',
    sources: [
      'AbbVie Medical Affairs — Care Gap Analytics Platform SOP',
      'ACG Clinical Guideline: Ulcerative Colitis in Adults (2024)',
      'ACG Clinical Guideline: Crohn\'s Disease in Adults (2024)',
    ],
  },

  // ── M2: Chronic/Prolonged OCS Use Rate ───────────────────────────────────
  eligibilityCriteria: [
    {
      id: 'm2-rule',
      label: '>90 cumulative non-overlapping OCS days in 12 months',
      editable: true,
      subItems: [
        'Overlapping fills use STOCKPILE logic',
        'Missing days supply uses MEDIAN_IMPUTE',
      ],
    },
  ],

  // ── M3: High-Dose/Prolonged OCS Exposure Rate ────────────────────────────
  exclusionCriteria: [
    {
      id: 'm3-rule',
      label: 'Prednisone-equivalent ≥10 mg/day for ≥60 consecutive days OR cumulative ≥600 mg; requires PRED_EQ_FACTOR conversion',
      editable: false,
    },
  ],

  // ── M4: Repeat OCS Course Rate ────────────────────────────────────────────
  temporalRules: [
    {
      rule: 'Primary Business Rule',
      value: '>1 distinct OCS course in 12 months; new course defined by ≥30-day gap between fills',
      editable: true,
    },
  ],

  // ── M5: Steroid Taper-Failure/Dependence Rate — Data Requirements used as carrier ──
  dataRequirements: [
    {
      type: 'Diagnosis',
      codesets: ['ICD-10'],
      required: true,
    },
    {
      type: 'Medication',
      codesets: ['NDC', 'RxNorm'],
      required: true,
    },
    {
      type: 'Procedure',
      codesets: ['HCPCS', 'CPT'],
      required: true,
    },
    {
      type: 'Laboratory',
      codesets: ['LOINC'],
      required: true,
    },
    {
      type: 'Enrollment',
      codesets: [],
      required: true,
    },
  ],

  // ── M6: Post-Discontinuation Relapse Rate ────────────────────────────────
  evidenceMapping: [
    {
      rule: 'Primary Business Rule',
      source: 'AbbVie Medical Affairs SOP 2024',
      recommendation: 'New IBD-related medical claim (inpatient, ED, or outpatient escalation) within 3 months of last OCS fill end date',
      evidenceGrade: 'A',
    },
  ],

  // ── M7: Composite OCS Overuse Flag (Primary KPI) ─────────────────────────
  ruleLogic: [
    { condition: 'A patient is flagged as an OCS overuser if they meet ANY of the above metrics.' },
    { condition: 'Primary care gap indicator for aggregated reporting' },
  ],

  evidenceReferences: [
    {
      source: 'AbbVie Medical Affairs — Care Gap Analytics Platform SOP',
      recommendation: 'Metrics M1–M7 Framework',
      evidenceStrength: 'Strong',
      year: 2024,
    },
    {
      source: 'ACG Clinical Guideline: Ulcerative Colitis in Adults',
      recommendation: 'Recommendation 5',
      evidenceStrength: 'Strong',
      year: 2024,
    },
    {
      source: 'ACG Clinical Guideline: Crohn\'s Disease in Adults',
      recommendation: 'Recommendation 7',
      evidenceStrength: 'Strong',
      year: 2024,
    },
  ],

  impactSummary: {
    estimatedEligiblePatients: 24567,
    changeVsDefault: 2134,
    changePercent: 9.5,
    datasetSize: '1.2M',
    diffs: [],
    isMock: true,
  },
}
