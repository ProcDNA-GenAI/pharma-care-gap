export type TherapyArea =
  | 'Gastroenterology'
  | 'Endocrinology'
  | 'Rheumatology'
  | 'Oncology'
  | 'Cardiology'
  | 'Neurology'
  | 'Pulmonology'

export type CareGapStatus = 'Draft' | 'Active' | 'Archived'

export interface CareGap {
  id: string
  title: string
  description: string
  therapyArea: TherapyArea
  status: CareGapStatus
  guidelineVersion: string
  lastUpdated: string
  evidenceConfidence: number
}
