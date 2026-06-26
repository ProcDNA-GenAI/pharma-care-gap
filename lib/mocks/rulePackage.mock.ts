import type { RulePackage } from '@/lib/types'

export const MOCK_RULE_PACKAGE: RulePackage = {
  careGapId: 'ibd-biologic-initiation',
  careGapTitle: 'Biologic Therapy Initiation for Moderate to Severe IBD',
  careGapDescription:
    'Identify patients with moderate to severe Crohn\'s Disease or Ulcerative Colitis who remain uncontrolled despite conventional therapy and have not initiated biologic therapy.',
  status: 'Draft',
  guidelineVersion: 'ACG 2024',
  lastGenerated: 'May 20, 2025 10:32 AM',
  evidenceConfidence: 92,

  clinicalSummary: {
    text: 'According to ACG 2024 guidelines, patients with moderate to severe Crohn\'s Disease or Ulcerative Colitis who have inadequate response, loss of response, or intolerance to conventional therapy (e.g., aminosalicylates, corticosteroids, immunomodulators) should be considered for biologic therapy.',
    sources: [
      'ACG Clinical Guideline: Ulcerative Colitis in Adults (2024)',
      'ACG Clinical Guideline: Crohn\'s Disease in Adults (2024)',
    ],
  },

  eligibilityCriteria: [
    {
      id: 'age',
      label: 'Age ≥ 18 years',
      editable: true,
    },
    {
      id: 'diagnosis',
      label: 'Diagnosis of Crohn\'s Disease (ICD-10: K50.x) OR Ulcerative Colitis (ICD-10: K51.x)',
      editable: false,
    },
    {
      id: 'disease-severity',
      label: 'Moderate to severe disease:',
      editable: false,
      subItems: [
        'Crohn\'s: Harvey-Bradshaw Index (HBI) ≥ 8 OR documented steroid dependence OR hospitalization/ED visit in last 12 months',
        'UC: Partial Mayo Score ≥ 4 OR documented steroid dependence OR hospitalization/ED visit in last 12 months',
      ],
    },
    {
      id: 'conventional-therapy',
      label: 'Received conventional therapy (5-ASA, corticosteroids, immunomodulators) for ≥ 8 weeks',
      editable: true,
    },
    {
      id: 'active-disease',
      label: 'Active disease within last 90 days (elevated CRP, fecal calprotectin ≥ 250, or endoscopic/radiologic activity)',
      editable: true,
    },
  ],

  exclusionCriteria: [
    {
      id: 'prior-biologic',
      label: 'Prior use of any biologic therapy (anti-TNF, anti-integrin, anti-IL12/23, anti-IL23)',
      editable: false,
    },
    {
      id: 'colectomy',
      label: 'History of colectomy with end ileostomy',
      editable: false,
    },
    {
      id: 'indeterminate-colitis',
      label: 'Indeterminate colitis',
      editable: false,
    },
    {
      id: 'pregnancy',
      label: 'Pregnancy or active pregnancy',
      editable: true,
    },
    {
      id: 'serious-infection',
      label: 'Active serious infection (e.g., TB, hepatitis B/C, opportunistic infection)',
      editable: true,
    },
    {
      id: 'malignancy',
      label: 'History of malignancy in past 5 years (excluding non-melanoma skin cancer)',
      editable: true,
    },
  ],

  temporalRules: [
    { rule: 'Diagnosis Lookback', value: '24 months', editable: true },
    { rule: 'Conventional Therapy Duration', value: '≥ 8 weeks', editable: true },
    { rule: 'Active Disease Window', value: 'Within 90 days', editable: true },
    { rule: 'Continuous Enrollment', value: '≥ 12 months (6 months pre + 6 months post index)', editable: true },
  ],

  dataRequirements: [
    { type: 'Diagnosis', codesets: ['ICD-10'], required: true },
    { type: 'Procedure', codesets: ['HCPCS', 'CPT'], required: true },
    { type: 'Medication', codesets: ['NDC', 'RxNorm'], required: true },
    { type: 'Laboratory', codesets: ['LOINC'], required: true },
    { type: 'Enrollment', codesets: [], required: true },
  ],

  evidenceMapping: [
    {
      rule: 'Moderate-to-severe disease definition',
      source: 'ACG Clinical Guideline 2024',
      recommendation: 'Section 3.2 — Disease Activity Assessment',
      evidenceGrade: 'A',
    },
    {
      rule: 'Conventional therapy failure (≥ 8 weeks)',
      source: 'ACG Clinical Guideline 2024',
      recommendation: 'Recommendation 5 — Steroid-dependent/refractory disease',
      evidenceGrade: 'A',
    },
    {
      rule: 'Biologic initiation threshold',
      source: 'ACG Clinical Guideline 2024',
      recommendation: 'Recommendation 7 — Biologic therapy in moderate-severe IBD',
      evidenceGrade: 'A',
    },
    {
      rule: 'Active disease window (90 days)',
      source: 'ECCO Guideline 2024',
      recommendation: 'Section 4 — Monitoring and biomarkers',
      evidenceGrade: 'B',
    },
  ],

  ruleLogic: [
    { condition: 'IBD Diagnosis (K50.x OR K51.x)', operator: 'AND' },
    { condition: 'Age ≥ 18 years', operator: 'AND' },
    { condition: 'Moderate-to-severe disease activity', operator: 'AND' },
    { condition: 'Conventional therapy ≥ 8 weeks', operator: 'AND' },
    { condition: 'Active disease within 90 days', operator: 'AND' },
    { condition: 'No prior biologic therapy', operator: 'AND' },
    { condition: 'No pregnancy', operator: 'AND' },
    { condition: 'No active serious infection', operator: 'AND' },
    { condition: 'No history of malignancy (5 years)', },
  ],

  evidenceReferences: [
    {
      source: 'ACG Clinical Guideline: Crohn\'s Disease in Adults',
      recommendation: 'Recommendation 7',
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
      source: 'ECCO Guideline',
      evidenceStrength: 'Strong',
      year: 2024,
    },
    {
      source: 'FDA Prescribing Information',
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
