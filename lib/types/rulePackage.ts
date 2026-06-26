export interface EvidenceReference {
  source: string
  recommendation?: string
  evidenceStrength: 'Strong' | 'Moderate' | 'Weak' | 'Expert Opinion'
  year: number
}

export interface EligibilityCriterion {
  id: string
  label: string
  detail?: string
  subItems?: string[]
  editable: boolean
}

export interface ExclusionCriterion {
  id: string
  label: string
  editable: boolean
}

export interface TemporalRule {
  rule: string
  value: string
  editable: boolean
}

export interface DataRequirement {
  type: 'Diagnosis' | 'Procedure' | 'Medication' | 'Laboratory' | 'Enrollment' | 'Demographics'
  codesets: string[]
  required: boolean
}

export interface EvidenceMapping {
  rule: string
  source: string
  recommendation: string
  evidenceGrade: 'A' | 'B' | 'C' | 'Expert'
}

export interface RuleLogicStep {
  condition: string
  operator?: 'AND' | 'OR'
}

export interface ImpactSummary {
  estimatedEligiblePatients: number
  changeVsDefault: number
  changePercent: number
  datasetSize: string
  diffs: Array<{
    label: string
    from: string
    to: string
  }>
  isMock: boolean
}

export interface RulePackage {
  careGapId: string
  careGapTitle: string
  careGapDescription: string
  status: 'Draft' | 'Active' | 'Archived'
  guidelineVersion: string
  lastGenerated: string
  evidenceConfidence: number
  clinicalSummary: {
    text: string
    sources: string[]
  }
  eligibilityCriteria: EligibilityCriterion[]
  exclusionCriteria: ExclusionCriterion[]
  temporalRules: TemporalRule[]
  dataRequirements: DataRequirement[]
  evidenceMapping: EvidenceMapping[]
  ruleLogic: RuleLogicStep[]
  evidenceReferences: EvidenceReference[]
  impactSummary: ImpactSummary
}
