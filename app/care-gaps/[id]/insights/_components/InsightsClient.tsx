'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import {
  Users, Activity, BarChart2, RefreshCw,
  Clock, FlaskConical, Repeat2, Download, Upload, SlidersHorizontal,
  Database, AlertCircle, Info, ArrowRight,
} from 'lucide-react'
import { KpiCard } from '@/components/insights/KpiCard'
import { CommercialSummaryPanel } from '@/components/insights/CommercialSummaryPanel'
import { BusinessRuleSummaryPanel } from '@/components/insights/BusinessRuleSummaryPanel'
import { DistributionTable } from '@/components/insights/DistributionTable'
import type { DistributionColumn } from '@/components/insights/DistributionTable'
import { InsightsSideNav } from '@/components/insights/InsightsSideNav'
import type { InsightsView } from '@/components/insights/InsightsSideNav'
import { FilterBar } from '@/components/insights/FilterBar'
import { InsightsTable, RiskBadge } from '@/components/insights/InsightsTable'
import type { Column } from '@/components/insights/InsightsTable'
import { Button } from '@/components/ui/Button'
import { usePatientDb } from '@/hooks/usePatientDb'
import { DEFAULT_PARAMETERS } from '@/hooks/useParameterState'
import type { ParameterValues } from '@/lib/types'
import type {
  HcpAgg, AccountAgg, TerritoryAgg, DemographicAgg,
  SpecialtyAgg, AgeDistributionAgg, HcpSegmentAgg,
  InsightsTab, InsightsFilters,
} from '@/lib/types/insights'

const PAGE_SIZE = 10

const TABS = [
  { key: 'hcp',         label: 'HCP Level'        },
  { key: 'account',     label: 'Account Level'     },
  { key: 'geography',   label: 'Geography Level'   },
  { key: 'demographic', label: 'Demographic Level' },
  { key: 'payer',       label: 'Payer Level'       },
  { key: 'temporal',    label: 'Temporal Trend'    },
]
const UNAVAILABLE_TABS = new Set(['payer', 'temporal'])

// ─── Granular Care Gap Distribution (column headers; rows come from live SQL) ─

const SPECIALTY_COLUMNS: DistributionColumn[] = [
  { label: 'Specialty' },
  { label: 'Eligible Patients', align: 'right' },
  { label: 'Overuse Patients (≥ 1 Criterion)', align: 'right' },
  { label: 'Overuse Rate', align: 'right' },
]

const AGE_COLUMNS: DistributionColumn[] = [
  { label: 'Age Group' },
  { label: 'Eligible Patients', align: 'right' },
  { label: 'Overuse Patients (≥ 1 Criterion)', align: 'right' },
  { label: 'Overuse Rate', align: 'right' },
]

const HCP_SEGMENT_COLUMNS: DistributionColumn[] = [
  { label: 'Overuse Rate Band' },
  { label: 'HCP Count', align: 'right' },
  { label: 'Eligible Patients', align: 'right' },
]

function withTotalRate(totalPatients: number, overusers: number): (string | number)[] {
  const rate = totalPatients === 0 ? 0 : Math.round((overusers / totalPatients) * 1000) / 10
  return ['Total', totalPatients.toLocaleString(), overusers.toLocaleString(), `${rate}%`]
}

// ─── Column definitions ───────────────────────────────────────────────────────

const HCP_COLUMNS: Column<HcpAgg>[] = [
  { key: 'rank',          label: '#',             align: 'center',  render: (_, i) => <span className="text-gray-400">{i + 1}</span> },
  { key: 'name',          label: 'NPI',           sortable: true,   render: (r) => (
    <div>
      <p className="font-semibold text-gray-900">{r.name}</p>
      <p className="text-[10px] text-gray-400">{r.specialty}</p>
    </div>
  )},
  { key: 'account',       label: 'Account',       sortable: true,  render: (r) => r.account },
  { key: 'totalPatients', label: 'Total Pts',     sortable: true, align: 'right', render: (r) => r.totalPatients.toLocaleString() },
  { key: 'ocsOveruse',    label: '# Patient with OCS use',    sortable: true, align: 'right', render: (r) => r.ocsOveruse.toLocaleString() },
  { key: 'm7Rate',        label: 'Overuse Rate',       sortable: true, align: 'right', render: (r) => <span className="font-semibold">{r.m7Rate}%</span> },
  { key: 'chronicOcs',    label: 'Chronic OCS',   sortable: true, align: 'right', render: (r) => r.chronicOcs.toLocaleString() },
  { key: 'highDose',      label: 'High-Dose OCS', sortable: true, align: 'right', render: (r) => r.highDose.toLocaleString() },
  { key: 'repeatCourse',  label: 'Repeat Course', sortable: true, align: 'right', render: (r) => r.repeatCourse.toLocaleString() },
  { key: 'risk',          label: 'Risk',          align: 'center', render: (r) => <RiskBadge rate={r.m7Rate} /> },
]

const ACCOUNT_COLUMNS: Column<AccountAgg>[] = [
  { key: 'rank',          label: '#',             align: 'center', render: (_, i) => <span className="text-gray-400">{i + 1}</span> },
  { key: 'account',       label: 'Account',       sortable: true,  render: (r) => <span className="font-semibold text-gray-900">{r.account}</span> },
  { key: 'territory',     label: 'Territory',     sortable: true,  render: (r) => r.territory },
  { key: 'topSpecialty',  label: 'Top Specialty', render: (r) => r.topSpecialty },
  { key: 'totalPatients', label: 'Total Pts',     sortable: true, align: 'right', render: (r) => r.totalPatients.toLocaleString() },
  { key: 'ocsOveruse',    label: '# Patient with OCS use',    sortable: true, align: 'right', render: (r) => r.ocsOveruse.toLocaleString() },
  { key: 'm7Rate',        label: 'Overuse Rate',       sortable: true, align: 'right', render: (r) => <span className="font-semibold">{r.m7Rate}%</span> },
  { key: 'risk',          label: 'Risk',          align: 'center', render: (r) => <RiskBadge rate={r.m7Rate} /> },
]

const TERRITORY_COLUMNS: Column<TerritoryAgg>[] = [
  { key: 'rank',          label: '#',            align: 'center', render: (_, i) => <span className="text-gray-400">{i + 1}</span> },
  { key: 'territory',     label: 'Territory',    sortable: true,  render: (r) => <span className="font-semibold text-gray-900">{r.territory}</span> },
  { key: 'region',        label: 'Region',       sortable: true,  render: (r) => r.region },
  { key: 'hcpCount',      label: 'HCPs',         sortable: true, align: 'right', render: (r) => r.hcpCount.toLocaleString() },
  { key: 'totalPatients', label: 'Total Pts',    sortable: true, align: 'right', render: (r) => r.totalPatients.toLocaleString() },
  { key: 'ocsOveruse',    label: '# Patient with OCS use',   sortable: true, align: 'right', render: (r) => r.ocsOveruse.toLocaleString() },
  { key: 'm7Rate',        label: 'Overuse Rate',      sortable: true, align: 'right', render: (r) => <span className="font-semibold">{r.m7Rate}%</span> },
  { key: 'risk',          label: 'Risk',         align: 'center', render: (r) => <RiskBadge rate={r.m7Rate} /> },
]

const DEMOGRAPHIC_COLUMNS: Column<DemographicAgg>[] = [
  { key: 'ageBand',       label: 'Age Band',      sortable: true,  render: (r) => <span className="font-semibold text-gray-900">{r.ageBand}</span> },
  { key: 'gender',        label: 'Gender',        sortable: true,  render: (r) => r.gender },
  { key: 'totalPatients', label: 'Total Pts',     sortable: true, align: 'right', render: (r) => r.totalPatients.toLocaleString() },
  { key: 'ocsOveruse',    label: '# Patient with OCS use',    sortable: true, align: 'right', render: (r) => r.ocsOveruse.toLocaleString() },
  { key: 'm7Rate',        label: 'Overuse Rate',       sortable: true, align: 'right', render: (r) => <span className="font-semibold">{r.m7Rate}%</span> },
  { key: 'chronicOcs',    label: 'Chronic OCS',   sortable: true, align: 'right', render: (r) => r.chronicOcs.toLocaleString() },
  { key: 'highDose',      label: 'High-Dose OCS', sortable: true, align: 'right', render: (r) => r.highDose.toLocaleString() },
  { key: 'repeatCourse',  label: 'Repeat Course', sortable: true, align: 'right', render: (r) => r.repeatCourse.toLocaleString() },
  { key: 'risk',          label: 'Risk',          align: 'center', render: (r) => <RiskBadge rate={r.m7Rate} /> },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sortRows<T extends object>(rows: T[], key: string, dir: 'asc' | 'desc'): T[] {
  return [...rows].sort((a, b) => {
    const av = (a as Record<string, unknown>)[key] ?? 0
    const bv = (b as Record<string, unknown>)[key] ?? 0
    const cmp = typeof av === 'number' && typeof bv === 'number'
      ? av - bv : String(av).localeCompare(String(bv))
    return dir === 'asc' ? cmp : -cmp
  })
}

function loadStoredParams(): ParameterValues {
  try {
    const raw = localStorage.getItem('ruleParameters')
    if (raw) return { ...DEFAULT_PARAMETERS, ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return DEFAULT_PARAMETERS
}

// ─── Status pill ──────────────────────────────────────────────────────────────

function StatusPill({ status, label }: { status: string; label: string }) {
  const cfg: Record<string, string> = {
    initializing: 'bg-blue-50 text-blue-700 border-blue-200',
    loading:      'bg-amber-50 text-amber-700 border-amber-200',
    computing:    'bg-violet-50 text-violet-700 border-violet-200',
    error:        'bg-red-50 text-red-700 border-red-200',
    ready:        'bg-emerald-50 text-emerald-700 border-emerald-200',
  }
  const spin = status === 'initializing' || status === 'loading' || status === 'computing'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${cfg[status] ?? 'bg-gray-50 text-gray-500 border-gray-200'}`}>
      {spin
        ? <RefreshCw className="h-2.5 w-2.5 animate-spin" />
        : status === 'error'
          ? <AlertCircle className="h-2.5 w-2.5" />
          : <Database className="h-2.5 w-2.5" />}
      {label}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

export function InsightsClient() {
  // ── Parameter state (starts at defaults to match SSR, synced from localStorage after mount) ───
  const [parameters, setParameters] = useState<ParameterValues>(DEFAULT_PARAMETERS)

  useEffect(() => {
    setParameters(loadStoredParams())
  }, [])

  const handleParameterChange = useCallback(
    <K extends keyof ParameterValues>(key: K, value: ParameterValues[K]) => {
      setParameters((prev) => {
        const next = { ...prev, [key]: value }
        if (typeof window !== 'undefined') {
          localStorage.setItem('ruleParameters', JSON.stringify(next))
        }
        return next
      })
    }, [],
  )

  // ── SQLite + reactive query engine ───────────────────────────────────────
  const {
    status, statusLabel, hasRealData, rowCount, loadFile,
    kpis, hcpRows, accountRows, territoryRows, demographicRows, error,
    specialtyRows, ageDistributionRows, hcpSegmentRows,
  } = usePatientDb(parameters)

  // ── UI state ─────────────────────────────────────────────────────────────
  const [activeView, setActiveView]   = useState<InsightsView>('overview')
  const [activeTab, setActiveTab]     = useState<InsightsTab>('hcp')
  const [filters, setFilters]         = useState<InsightsFilters>({ search: '', territory: 'All', specialty: 'All' })
  const [sortKey, setSortKey]         = useState('m7Rate')
  const [sortDir, setSortDir]         = useState<'asc' | 'desc'>('desc')
  const [page, setPage]               = useState(1)
  const [editingRules, setEditingRules]     = useState(false)
  const [showParameters, setShowParameters] = useState(false)
  const [uploading, setUploading]     = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Event handlers ────────────────────────────────────────────────────────
  function handleTabChange(key: string) {
    if (UNAVAILABLE_TABS.has(key)) return
    setActiveTab(key as InsightsTab)
    setSortKey('m7Rate'); setSortDir('desc'); setPage(1)
  }

  function handleSort(key: string) {
    if (key === sortKey) {
      setSortDir((d) => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key); setSortDir('desc')
    }
    setPage(1)
  }

  const handleFiltersChange = useCallback((f: InsightsFilters) => {
    setFilters(f); setPage(1)
  }, [])

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      await loadFile(file)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to load file')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // ── Filter dropdowns ──────────────────────────────────────────────────────
  const territories = useMemo(() => [...new Set(hcpRows.map((r) => r.territory))].sort(), [hcpRows])
  const specialties  = useMemo(() => [...new Set(hcpRows.map((r) => r.specialty))].sort(), [hcpRows])

  // ── Filtered rows ─────────────────────────────────────────────────────────
  const filteredHcp = useMemo(() => {
    const q = filters.search.toLowerCase()
    return hcpRows.filter((r) =>
      (filters.territory === 'All' || r.territory === filters.territory) &&
      (filters.specialty  === 'All' || r.specialty  === filters.specialty) &&
      (q === '' || r.name.toLowerCase().includes(q) || r.npi.includes(q)),
    )
  }, [hcpRows, filters])

  const filteredAccount = useMemo(() => {
    const q = filters.search.toLowerCase()
    return accountRows.filter((r) =>
      (filters.territory === 'All' || r.territory === filters.territory) &&
      (q === '' || r.account.toLowerCase().includes(q)),
    )
  }, [accountRows, filters])

  const filteredTerritory = useMemo(() => {
    const q = filters.search.toLowerCase()
    return territoryRows.filter((r) =>
      (filters.territory === 'All' || r.territory === filters.territory) &&
      (q === '' || r.territory.toLowerCase().includes(q)),
    )
  }, [territoryRows, filters])

  const filteredDemographic = useMemo(() => {
    const q = filters.search.toLowerCase()
    return demographicRows.filter((r) =>
      q === '' || r.ageBand.includes(q) || r.gender.toLowerCase().includes(q),
    )
  }, [demographicRows, filters])

  // ── Sorted + paginated ────────────────────────────────────────────────────
  const activeRows = useMemo(() => ({
    hcp:         sortRows(filteredHcp,         sortKey, sortDir),
    account:     sortRows(filteredAccount,     sortKey, sortDir),
    geography:   sortRows(filteredTerritory,   sortKey, sortDir),
    demographic: sortRows(filteredDemographic, sortKey, sortDir),
  }), [filteredHcp, filteredAccount, filteredTerritory, filteredDemographic, sortKey, sortDir])

  const pagedRows = useMemo(() => {
    const all = activeRows[activeTab] as unknown[]
    return all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  }, [activeRows, activeTab, page])

  const totalRows = activeRows[activeTab].length

  // ── Commercial summary (derived from existing HCP/Territory aggregations) ──
  const commercialSummary = useMemo(() => {
    const hcpsWithOveruse   = hcpRows.filter((r) => r.ocsOveruse > 0).length
    const territoriesCovered = territoryRows.length
    const totalHcps         = hcpRows.length
    const avgHcpsPerMsl     = territoriesCovered === 0 ? 0 : totalHcps / territoriesCovered
    return { hcpsWithOveruse, territoriesCovered, avgHcpsPerMsl }
  }, [hcpRows, territoryRows])

  // ── Granular Care Gap Distribution (live SQL-backed rows + Total row) ──────
  const specialtyTableRows = useMemo(() => specialtyRows.map((r): (string | number)[] => [
    r.specialty, r.totalPatients.toLocaleString(), r.overusers.toLocaleString(), `${r.overuseRate}%`,
  ]), [specialtyRows])
  const specialtyTotalRow = useMemo(() => withTotalRate(
    specialtyRows.reduce((sum, r) => sum + r.totalPatients, 0),
    specialtyRows.reduce((sum, r) => sum + r.overusers, 0),
  ), [specialtyRows])

  const ageTableRows = useMemo(() => ageDistributionRows.map((r): (string | number)[] => [
    r.ageBand, r.totalPatients.toLocaleString(), r.overusers.toLocaleString(), `${r.overuseRate}%`,
  ]), [ageDistributionRows])
  const ageTotalRow = useMemo(() => withTotalRate(
    ageDistributionRows.reduce((sum, r) => sum + r.totalPatients, 0),
    ageDistributionRows.reduce((sum, r) => sum + r.overusers, 0),
  ), [ageDistributionRows])

  const hcpSegmentTableRows = useMemo(() => hcpSegmentRows.map((r): (string | number)[] => [
    r.band, r.hcpCount.toLocaleString(), r.patients.toLocaleString(),
  ]), [hcpSegmentRows])
  const hcpSegmentTotalRow = useMemo((): (string | number)[] => [
    'Total',
    hcpSegmentRows.reduce((sum, r) => sum + r.hcpCount, 0).toLocaleString(),
    hcpSegmentRows.reduce((sum, r) => sum + r.patients, 0).toLocaleString(),
  ], [hcpSegmentRows])

  // ── Column + rowKey for active tab ────────────────────────────────────────
  type AnyRow = HcpAgg | AccountAgg | TerritoryAgg | DemographicAgg
  const tableProps = useMemo(() => {
    if (activeTab === 'hcp')         return { columns: HCP_COLUMNS         as Column<AnyRow>[], rowKey: (r: AnyRow) => (r as HcpAgg).npi }
    if (activeTab === 'account')     return { columns: ACCOUNT_COLUMNS     as Column<AnyRow>[], rowKey: (r: AnyRow) => (r as AccountAgg).account }
    if (activeTab === 'geography')   return { columns: TERRITORY_COLUMNS   as Column<AnyRow>[], rowKey: (r: AnyRow) => (r as TerritoryAgg).territory }
    return                                  { columns: DEMOGRAPHIC_COLUMNS as Column<AnyRow>[], rowKey: (r: AnyRow) => `${(r as DemographicAgg).ageBand}-${(r as DemographicAgg).gender}` }
  }, [activeTab])

  // ─────────────────────────────────────────────────────────────────────────
  const mainContent = (
    <div className="flex-1 min-w-0 space-y-5">

      {/* ── Error banner ── */}
      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {activeView === 'overview' ? (
        <>
          {/* ── Sections 1 & 2: one box, divided by a vertical rule ── */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:items-start lg:divide-x lg:divide-gray-300">

              {/* Section 1: Eligible IBD Patient Cohort */}
              <div className="lg:pr-4">
                <h2 className="text-base font-bold text-[#1D3F8F]">1. Eligible IBD Patient Cohort</h2>
                <p className="mt-0.5 text-xs text-[#6B7280]">Patient population that meets the defined IBD cohort criteria.</p>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <KpiCard title="Eligible IBD Cohort" value={kpis.totalPatients}
                    caption="Patients satisfying cohort definition" badge="100%"
                    icon={<Users className="h-4 w-4" />} />
                  <KpiCard title="OCS Users" value={kpis.ocsUse}
                    caption="Patients with ≥1 OCS claim" badge={`${kpis.ocsUseRate}%`}
                    icon={<Activity className="h-4 w-4" />} />
                </div>
              </div>

              {/* Section 2: OCS Overuse Summary — Key Metrics */}
              <div className="lg:pl-4">
                <h2 className="text-base font-bold text-[#1D3F8F]">2. OCS Overuse Summary — Key Metrics</h2>
                <p className="mt-0.5 text-xs text-[#6B7280]">Patients evaluated across clinically relevant indicators of inappropriate or prolonged OCS use.</p>

                <div className="mt-3 grid grid-cols-4 gap-3">
                  <KpiCard title="Potential OCS Overuse" value={kpis.ocsOveruse}
                    caption="Patients meeting composite overuse criteria" badge={`${kpis.ocsOveruseRate}%`}
                    variant="purple" icon={<BarChart2 className="h-4 w-4" />} />
                  <KpiCard title="Chronic OCS Exposure" value={kpis.chronicOcs}
                    caption=">90 cumulative OCS days within look forward period" badge={`${kpis.chronicOcsRate}%`}
                    variant="green" icon={<Clock className="h-4 w-4" />} />
                  <KpiCard title="High-Dose OCS Exposure" value={kpis.highDose}
                    caption="Prednisone-equivalent ≥10 mg/day for ≥60 days OR cumulative dose threshold" badge={`${kpis.highDoseRate}%`}
                    variant="orange" icon={<FlaskConical className="h-4 w-4" />} />
                  <KpiCard title="Recurrent OCS Courses" value={kpis.repeatCourse}
                    caption="≥2 distinct OCS courses within the look forward period" badge={`${kpis.repeatCourseRate}%`}
                    variant="blue" icon={<Repeat2 className="h-4 w-4" />} />
                </div>
              </div>

            </div>
          </div>

          {/* ── Section 3: Care Gap Distribution Across Key Dimensions ── */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-base font-bold text-[#1D3F8F]">3. Care Gap Distribution Across Key Dimensions</h2>
            <p className="mt-0.5 text-xs text-[#6B7280]">Explore the distribution of OCS overuse across provider, patient, and geographic dimensions to identify the highest-priority opportunities for medical engagement.</p>

            <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
              <DistributionTable title="A. By HCP Specialty" columns={SPECIALTY_COLUMNS} rows={specialtyTableRows} totalRow={specialtyTotalRow} />
              <DistributionTable title="B. By Patient Age Group" columns={AGE_COLUMNS} rows={ageTableRows} totalRow={ageTotalRow} />
              <DistributionTable title="C. Top HCP Segments by Overuse Rate" columns={HCP_SEGMENT_COLUMNS} rows={hcpSegmentTableRows} totalRow={hcpSegmentTotalRow} />
            </div>
          </div>

          {/* ── Bottom CTA bar ── */}
          <div className="flex flex-col items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF3FF] text-[#004FBA]">
                <Info className="h-4 w-4" />
              </div>
              <p className="text-xs text-[#4B5563]">
                Use the Detailed View to explore patient and HCP level insights by territory, account, specialty, and overuse measure.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActiveView('detailed')}
              iconRight={<ArrowRight className="h-3.5 w-3.5" />}
              className="shrink-0"
            >
              Go to Detailed View
            </Button>
          </div>
        </>
      ) : (
        /* ── Detailed View: Tabs + Filter + Table ── */
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">

          {/* Tab bar */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto scrollbar-hide">
              {TABS.map((tab) => {
                const unavailable = UNAVAILABLE_TABS.has(tab.key)
                const isActive    = activeTab === tab.key
                return (
                  <button
                    key={tab.key}
                    onClick={() => handleTabChange(tab.key)}
                    disabled={unavailable}
                    title={unavailable ? 'Source data does not contain payer/date columns' : undefined}
                    className={[
                      'relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none shrink-0',
                      unavailable
                        ? 'cursor-not-allowed text-gray-300'
                        : isActive
                          ? 'border-b-2 border-[#004FBA] text-[#004FBA]'
                          : 'text-gray-500 hover:text-gray-700',
                    ].join(' ')}
                  >
                    {tab.label}
                    {unavailable && (
                      <span className="ml-1.5 rounded bg-gray-100 px-1 py-0.5 text-[9px] font-semibold uppercase text-gray-400">
                        N/A
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Filter bar */}
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-2.5">
            <FilterBar filters={filters} territories={territories} specialties={specialties}
              activeTab={activeTab} onChange={handleFiltersChange} />
            <span className="shrink-0 text-[10px] text-gray-400">
              {totalRows} result{totalRows !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Table */}
          <InsightsTable
            columns={tableProps.columns}
            rows={pagedRows as AnyRow[]}
            rowKey={tableProps.rowKey}
            sortKey={sortKey} sortDir={sortDir} onSort={handleSort}
            page={page} pageSize={PAGE_SIZE} totalRows={totalRows} onPage={setPage}
          />
        </div>
      )}

    </div>
  )

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-5">

      {/* ── Header: offset by fixed sidebar width (w-20 = 80px) ── */}
      <div className="flex items-start justify-between gap-4 pl-24">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-[#1D3F8F]">Care Gap Insights</h1>
            <StatusPill status={status} label={statusLabel} />
            {hasRealData && rowCount > 0 && (
              <span className="text-[10px] text-[#6B7280]">
                {rowCount.toLocaleString()} patients loaded
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-[#4B5563] max-w-2xl">
            Understand where oral corticosteroid overuse exists within the eligible IBD population to support evidence-based medical engagement and care optimization.
            {!hasRealData && status !== 'loading' && ' Upload your own CSV/Excel to replace demo data.'}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => setShowParameters((v) => !v)}
            className={[
              'inline-flex h-9 items-center gap-2 rounded-lg border px-4 text-sm font-medium shadow-sm transition-colors',
              showParameters
                ? 'border-[#004FBA] bg-[#EEF3FF] text-[#004FBA]'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50',
            ].join(' ')}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Parameters
          </button>
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} className="sr-only" />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || status === 'initializing'}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {uploading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? 'Loading…' : 'Load Data'}
          </button>
          <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* ── Content row ── */}
      <div className="flex items-start gap-5">
        <InsightsSideNav active={activeView} onChange={setActiveView} />
        <div className="w-20 shrink-0 -mr-2" aria-hidden="true" />

        {mainContent}

        {/* ── Right sidebar: always present to keep layout stable ── */}
        <div className="w-72 shrink-0 space-y-4 lg:sticky lg:top-5">
          {showParameters && (
            <BusinessRuleSummaryPanel
              parameters={parameters}
              onParameterChange={handleParameterChange}
              editing={editingRules}
              onToggleEditing={() => setEditingRules((v) => !v)}
            />
          )}
          <CommercialSummaryPanel
            hcpsWithOveruse={commercialSummary.hcpsWithOveruse}
            territoriesCovered={commercialSummary.territoriesCovered}
            avgHcpsPerMsl={commercialSummary.avgHcpsPerMsl}
          />
        </div>
      </div>

    </div>
  )
}