import type { PatientRow } from '@/lib/types/insights'

const REQUIRED_COLUMNS = [
  'Patient_ID',
  'Age',
  'Gender',
  'State',
  'Region',
  'Territory_ID',
  'MSL_Territory',
  'NPI_ID',
  'HCP_Name',
  'Specialty',
  'Diagnosis',
  'Minimum_IBD_Claims',
  'Gap_First_Last_IBD_Dx_Claim_Days',
  'Chronic_OCS_Days',
  'High_Dose_Consecutive_Days',
  'No_of_OCS_Episodes',
  'Lookforward',
  'Prednisone Equivalent',
  'Cumulative Prednisone',
  'Min Gap between OCS courses',
]

function toNum(v: unknown): number {
  const n = Number(v)
  return isNaN(n) ? 0 : n
}

function assertRequiredColumns(rows: Record<string, unknown>[]) {
  const first = rows[0]
  if (!first) return
  const missing = REQUIRED_COLUMNS.filter((column) => !(column in first))
  if (missing.length) {
    throw new Error(`Missing required dataset columns: ${missing.join(', ')}`)
  }
}

function parseRow(raw: Record<string, unknown>): PatientRow {
  return {
    Patient_ID: String(raw['Patient_ID'] ?? ''),
    Age: toNum(raw['Age']),
    Gender: String(raw['Gender'] ?? ''),
    State: String(raw['State'] ?? ''),
    Region: String(raw['Region'] ?? ''),
    Territory_ID: String(raw['Territory_ID'] ?? ''),
    MSL_Territory: String(raw['MSL_Territory'] ?? ''),
    NPI_ID: String(raw['NPI_ID'] ?? ''),
    HCP_Name: String(raw['HCP_Name'] ?? ''),
    Specialty: String(raw['Specialty'] ?? ''),
    Diagnosis: String(raw['Diagnosis'] ?? ''),
    Minimum_IBD_Claims: toNum(raw['Minimum_IBD_Claims']),
    Gap_First_Last_IBD_Dx_Claim_Days: toNum(raw['Gap_First_Last_IBD_Dx_Claim_Days']),
    Chronic_OCS_Days: toNum(raw['Chronic_OCS_Days']),
    High_Dose_Consecutive_Days: toNum(raw['High_Dose_Consecutive_Days']),
    No_of_OCS_Episodes: toNum(raw['No_of_OCS_Episodes']),
    Lookforward: toNum(raw['Lookforward']),
    'Prednisone Equivalent': toNum(raw['Prednisone Equivalent']),
    'Cumulative Prednisone': toNum(raw['Cumulative Prednisone']),
    'Min Gap between OCS courses': toNum(raw['Min Gap between OCS courses']),
  }
}

export function parsePatientRows(rows: Record<string, unknown>[]): PatientRow[] {
  assertRequiredColumns(rows)
  return rows.map(parseRow)
}

export async function parseExcelFile(file: File): Promise<PatientRow[]> {
  const XLSX = await import('xlsx')
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet)
  return parsePatientRows(rows)
}

export async function parseExcelBuffer(buffer: ArrayBuffer): Promise<PatientRow[]> {
  const XLSX = await import('xlsx')
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet)
  return parsePatientRows(rows)
}

export async function parseCsvFile(file: File): Promise<PatientRow[]> {
  const text = await file.text()
  const { default: Papa } = await import('papaparse')
  const result = Papa.parse<Record<string, unknown>>(text, { header: true, skipEmptyLines: true, dynamicTyping: true })
  return parsePatientRows(result.data)
}
