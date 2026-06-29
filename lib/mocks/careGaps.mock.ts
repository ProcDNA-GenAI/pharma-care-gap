import type { CareGap } from '@/lib/types'

export const MOCK_CARE_GAPS: CareGap[] = [
  {
    id: 'ibd-biologic-initiation',
    title: 'Biologic Therapy Initiation for Moderate to Severe IBD',
    description:
      'Identify patients with moderate to severe Crohn\'s Disease or Ulcerative Colitis who remain uncontrolled despite conventional therapy and have not initiated biologic therapy.',
    therapyArea: 'Gastroenterology',
    status: 'Active',
    guidelineVersion: 'ACG 2024',
    lastUpdated: '2025-05-20',
    evidenceConfidence: 92,
  },
  {
    id: 't2d-glp1-initiation',
    title: 'Initiation of GLP-1 Therapy in Eligible T2D Patients',
    description:
      'Identify patients with Type 2 Diabetes with inadequate glycemic control on metformin monotherapy who are eligible for GLP-1 receptor agonist initiation.',
    therapyArea: 'Endocrinology',
    status: 'Active',
    guidelineVersion: 'ADA 2025',
    lastUpdated: '2025-04-12',
    evidenceConfidence: 89,
  },
  {
    id: 't2d-escalation',
    title: 'Therapy Escalation in Uncontrolled Type 2 Diabetes',
    description:
      'Identify patients with persistent HbA1c above target despite dual therapy who should be considered for treatment escalation per ADA guidelines.',
    therapyArea: 'Endocrinology',
    status: 'Draft',
    guidelineVersion: 'ADA 2025',
    lastUpdated: '2025-03-28',
    evidenceConfidence: 94,
  },
  {
    id: 'ra-biologic-escalation',
    title: 'Biologic Escalation in Refractory Rheumatoid Arthritis',
    description:
      'Identify RA patients with inadequate response to two or more DMARDs who have not been prescribed biologic or targeted synthetic DMARD therapy.',
    therapyArea: 'Rheumatology',
    status: 'Active',
    guidelineVersion: 'ACR 2023',
    lastUpdated: '2025-02-14',
    evidenceConfidence: 87,
  },
  {
    id: 'copd-maintenance',
    title: 'Maintenance Inhaler Therapy in Moderate-Severe COPD',
    description:
      'Identify COPD patients with FEV1 < 50% predicted who are not on long-acting bronchodilator maintenance therapy following hospitalization or ER visit.',
    therapyArea: 'Pulmonology',
    status: 'Draft',
    guidelineVersion: 'GOLD 2024',
    lastUpdated: '2025-01-30',
    evidenceConfidence: 81,
  },
  {
    id: 'heart-failure-arni',
    title: 'ARNI Therapy Initiation in HFrEF Patients',
    description:
      'Identify heart failure with reduced ejection fraction patients currently on ACE inhibitor/ARB therapy who have not been transitioned to sacubitril/valsartan.',
    therapyArea: 'Cardiology',
    status: 'Active',
    guidelineVersion: 'ACC/AHA 2022',
    lastUpdated: '2024-12-10',
    evidenceConfidence: 96,
  },
]
