import type { PatientRow } from '@/lib/types/insights'

function toNum(v: unknown): number {
  const n = Number(v)
  return isNaN(n) ? 0 : n
}

function parseRow(raw: Record<string, unknown>): PatientRow {
  return {
    Pat_ID:    String(raw['Pat_ID'] ?? ''),
    NPI:       String(raw['NPI'] ?? ''),
    Specialty: String(raw['Specialty'] ?? ''),
    Account:   String(raw['Account'] ?? ''),
    Territory: String(raw['Territory'] ?? ''),
    Region:    String(raw['Region'] ?? ''),
    Pat_Age:   toNum(raw['Pat_Age']),
    Pat_Gender:String(raw['Pat_Gender'] ?? ''),
    M1: toNum(raw['M1']),
    M2: toNum(raw['M2']),
    M3: toNum(raw['M3']),
    M4: toNum(raw['M4']),
    M5: toNum(raw['M5']),
    M6: toNum(raw['M6']),
    M7: toNum(raw['M7']),
  }
}

export async function parseExcelFile(file: File): Promise<PatientRow[]> {
  const XLSX = (await import('xlsx')).default
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet)
  return rows.map(parseRow)
}

export async function parseCsvFile(file: File): Promise<PatientRow[]> {
  const text = await file.text()
  const { default: Papa } = await import('papaparse')
  const result = Papa.parse<Record<string, unknown>>(text, { header: true, skipEmptyLines: true, dynamicTyping: true })
  return result.data.map(parseRow)
}
