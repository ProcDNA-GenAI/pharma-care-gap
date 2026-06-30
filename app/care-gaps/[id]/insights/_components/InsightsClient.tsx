'use client'

import { useState, useMemo, useCallback, useRef } from 'react'
import {
  Users, Activity, TrendingUp, BarChart2, RefreshCw,
  Clock, FlaskConical, Repeat2, Download, Upload, SlidersHorizontal,
  X, Database, AlertCircle,
} from 'lucide-react'
import { KpiCard } from '@/components/insights/KpiCard'
import { SummaryInsightCards } from '@/components/insights/SummaryInsightCards'
import { FilterBar } from '@/components/insights/FilterBar'
import { InsightsTable, RiskBadge } from '@/components/insights/InsightsTable'
import type { Column } from '@/components/insights/InsightsTable'
import { ConfigurableParametersPanel } from '@/components/rule-details/ConfigurableParametersPanel'
import { usePatientDb } from '@/hooks/usePatientDb'
import { DEFAULT_PARAMETERS } from '@/hooks/useParameterState'
import type { ParameterValues } from '@/lib/types'
import type {
  HcpAgg, AccountAgg, TerritoryAgg, DemographicAgg,
  InsightsTab, InsightsFilters, SummaryInsights,
} from '@/lib/types/insights'

const PAGE_SIZE = 10
const FLAG_THRESHOLD = 20

const TABS = [
  { key: 'hcp',         label: 'HCP Level'        },
  { key: 'account',     label: 'Account Level'     },
  { key: 'geography',   label: 'Geography Level'   },
  { key: 'demographic', label: 'Demographic Level' },
  { key: 'payer',       label: 'Payer Level'       },
  { key: 'temporal',    label: 'Temporal Trend'    },
]
const UNAVAILABLE_TABS = new Set(['payer', 'temporal'])

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
  { key: 'taperFailure',  label: 'Taper Failure', sortable: true, align: 'right', render: (r) => r.taperFailure.toLocaleString() },
  { key: 'relapse',       label: 'Post-Disc. Relapse', sortable: true, align: 'right', render: (r) => r.relapse.toLocaleString() },
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
  { key: 'taperFailure',  label: 'Taper Failure', sortable: true, align: 'right', render: (r) => r.taperFailure.toLocaleString() },
  { key: 'relapse',       label: 'Post-Disc. Relapse', sortable: true, align: 'right', render: (r) => r.relapse.toLocaleString() },
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
  if (typeof window === 'undefined') return DEFAULT_PARAMETERS
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
  // ── Parameter state (loaded from localStorage, falls back to defaults) ───
  const [parameters, setParameters] = useState<ParameterValues>(loadStoredParams)

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
    kpis, hcpRows, accountRows, territoryRows, demographicRows, dataDate, error,
  } = usePatientDb(parameters)

  // ── UI state ─────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab]     = useState<InsightsTab>('hcp')
  const [filters, setFilters]         = useState<InsightsFilters>({ search: '', territory: 'All', specialty: 'All' })
  const [sortKey, setSortKey]         = useState('m7Rate')
  const [sortDir, setSortDir]         = useState<'asc' | 'desc'>('desc')
  const [page, setPage]               = useState(1)
  const [showParams, setShowParams]   = useState(false)
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

  // ── Summary insights ──────────────────────────────────────────────────────
  const summaryInsights = useMemo<SummaryInsights>(() => {
    const sortedHcp  = [...hcpRows].sort((a, b) => b.m7Rate - a.m7Rate)
    const sortedTerr = [...territoryRows].sort((a, b) => b.m7Rate - a.m7Rate)
    const sortedDemo = [...demographicRows].sort((a, b) => b.m7Rate - a.m7Rate)
    const flagged    = hcpRows.filter((r) => r.m7Rate >= FLAG_THRESHOLD).length
    return {
      highestRiskHcp:         sortedHcp[0]  ?? hcpRows[0],
      highestBurdenTerritory: sortedTerr[0] ?? territoryRows[0],
      highestRiskAgeBand:     sortedDemo[0] ?? demographicRows[0],
      flaggedHcpCount:  flagged,
      totalHcpCount:    hcpRows.length,
      flaggedHcpRate:   hcpRows.length === 0 ? 0 : Math.round((flagged / hcpRows.length) * 1000) / 10,
    }
  }, [hcpRows, territoryRows, demographicRows])

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

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-gray-900">Care Gap Insights</h1>
            <StatusPill status={status} label={statusLabel} />
            {hasRealData && rowCount > 0 && (
              <span className="text-[10px] text-gray-400">
                {rowCount.toLocaleString()} patients loaded
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-gray-500 max-w-2xl">
            A real-time view of overuse and care gap burden across the eligible IBD cohort — surfaced by HCP, geography, and patient demographics as parameters change.
            {!hasRealData && status !== 'loading' && ' Upload your own CSV/Excel to replace demo data.'}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => setShowParams((v) => !v)}
            className={[
              'inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium shadow-sm transition-colors',
              showParams
                ? 'border-[#004FBA] bg-[#EEF3FF] text-[#004FBA]'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50',
            ].join(' ')}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Parameters
          </button>
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} className="sr-only" />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || status === 'initializing'}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {uploading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            {uploading ? 'Loading…' : 'Load Data'}
          </button>
          <button className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 shadow-sm hover:bg-gray-50 transition-colors">
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Primary KPI Row ── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard title="Total Eligible IBD Patients" value={kpis.totalPatients}
          caption="M1 flag = 1 (active cohort)" badge="Full Cohort" variant="default"
          icon={<Users className="h-4 w-4" />} />
        <KpiCard title="Patients with OCS Use" value={kpis.ocsUse}
          caption={`${kpis.ocsUseRate}% of cohort`} badge={`${kpis.ocsUseRate}%`}
          variant="default" icon={<Activity className="h-4 w-4" />} />
        <KpiCard title="Patients with OCS Overuse" value={kpis.ocsOveruse}
          caption={`${kpis.ocsOveruseRate}% of cohort · composite overuse flag`}
          variant="highlight"
          icon={<BarChart2 className="h-4 w-4" />} />
        <KpiCard title="Composite OCS Overuse Rate" value={`${kpis.m7Rate}%`}
          caption="Share of cohort meeting any overuse criterion" badge="Primary KPI" variant="success"
          icon={<TrendingUp className="h-4 w-4" />} />
      </div>

      {/* ── Secondary KPI Row ── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <KpiCard size="secondary" title="Chronic OCS Use" value={kpis.chronicOcs}
          caption={`Cumulative OCS days ≥ ${parameters.ocsDurationThreshold} within the measurement window`}
          badge={`${kpis.chronicOcsRate}%`} icon={<Clock className="h-3.5 w-3.5" />} />
        <KpiCard size="secondary" title="High-Dose OCS" value={kpis.highDose}
          caption={`≥ ${parameters.highDoseDurationDays} consecutive days on high-dose therapy`}
          badge={`${kpis.highDoseRate}%`} variant="warning"
          icon={<FlaskConical className="h-3.5 w-3.5" />} />
        <KpiCard size="secondary" title="Repeat Course" value={kpis.repeatCourse}
          caption="More than one distinct OCS course in the period"
          badge={`${kpis.repeatCourseRate}%`} icon={<Repeat2 className="h-3.5 w-3.5" />} />
        <KpiCard size="secondary" title="Taper Failure" value={kpis.taperFailure}
          caption={`Returns to OCS within ${parameters.taperFailMonths} months of a prior course`}
          badge={`${kpis.taperFailureRate}%`} variant="warning"
          icon={<TrendingUp className="h-3.5 w-3.5" />} />
        <KpiCard size="secondary" title="Post-Discontinuation Relapse" value={kpis.relapse}
          caption={`Relapse flagged within a ${parameters.relapseWindowMonths}-month post-discontinuation window`}
          badge={`${kpis.relapseRate}%`} icon={<RefreshCw className="h-3.5 w-3.5" />} />
      </div>

      {/* ── Key Insights ── */}
      <SummaryInsightCards insights={summaryInsights} />

      {/* ── Tabs + Filter + Table ── */}
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

      {/* ── Footer ── */}
      <div className="flex items-center justify-between px-1 text-[10px] text-gray-400">
        <span>
          {dataDate || (hasRealData ? 'Data loaded' : 'Loading demo data…')}
          {status === 'computing' && ' · Recalculating…'}
        </span>
        <span>M7 = M2 OR M3 OR M4 OR M5 OR M6 flags · HCP flag threshold: ≥ {FLAG_THRESHOLD}% M7 rate</span>
      </div>
    </div>
  )

  return (
    <div className={['flex gap-5 items-start', showParams ? '' : ''].join('')}>
      {mainContent}

      {/* ── Collapsible parameters sidebar ── */}
      {showParams && (
        <div className="w-80 shrink-0 sticky top-0">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            {/* Sidebar header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-3.5 w-3.5 text-[#004FBA]" />
                <span className="text-xs font-semibold text-gray-900">Configurable Parameters</span>
                <span className="text-xs text-gray-400">(Select Values to analyze Care Gap)</span>
              </div>
              <div className="flex items-center gap-2">
                {status === 'computing' && (
                  <span className="flex items-center gap-1 text-[10px] text-violet-600">
                    <RefreshCw className="h-2.5 w-2.5 animate-spin" />
                    Recalculating…
                  </span>
                )}
                <button onClick={() => setShowParams(false)} className="rounded p-0.5 text-gray-400 hover:text-gray-600">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            {/* Parameter fields */}
            <div className="max-h-[calc(100vh-180px)] overflow-y-auto px-1 py-1 scrollbar-hide">
              <ConfigurableParametersPanel
                parameters={parameters}
                onParameterChange={handleParameterChange}
                hideActions={true}
                hideHeader={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}