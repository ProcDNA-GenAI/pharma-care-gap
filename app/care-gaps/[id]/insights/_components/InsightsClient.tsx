'use client'

import { useState, useMemo, useCallback, useRef } from 'react'
import {
  Users, Activity, TrendingUp, BarChart2, RefreshCw,
  Clock, FlaskConical, Repeat2, Download, Upload, Info,
} from 'lucide-react'
import { KpiCard } from '@/components/insights/KpiCard'
import { SummaryInsightCards } from '@/components/insights/SummaryInsightCards'
import { FilterBar } from '@/components/insights/FilterBar'
import { InsightsTable, RiskBadge } from '@/components/insights/InsightsTable'
import type { Column } from '@/components/insights/InsightsTable'
import {
  MOCK_GLOBAL_KPIS, MOCK_HCP_ROWS, MOCK_ACCOUNT_ROWS,
  MOCK_TERRITORY_ROWS, MOCK_DEMOGRAPHIC_ROWS, MOCK_DATA_DATE,
} from '@/lib/mocks/insights.mock'
import { parseExcelFile } from '@/lib/utils/parseExcel'
import {
  computeGlobalKpis, aggregateByHcp, aggregateByAccount,
  aggregateByTerritory, aggregateByDemographic,
} from '@/lib/utils/aggregations'
import type {
  HcpAgg, AccountAgg, TerritoryAgg, DemographicAgg,
  InsightsTab, InsightsFilters, SummaryInsights, GlobalKpis,
} from '@/lib/types/insights'

const PAGE_SIZE = 10
const FLAG_THRESHOLD = 20

const TABS = [
  { key: 'hcp',         label: 'HCP Level'       },
  { key: 'account',     label: 'Account Level'    },
  { key: 'geography',   label: 'Geography Level'  },
  { key: 'demographic', label: 'Demographic Level' },
  { key: 'payer',       label: 'Payer Level'      },
  { key: 'temporal',    label: 'Temporal Trend'   },
]

const UNAVAILABLE_TABS = new Set(['payer', 'temporal'])

// ─── HCP columns ────────────────────────────────────────────────────────────
const HCP_COLUMNS: Column<HcpAgg>[] = [
  { key: 'rank',           label: '#',                  align: 'center', render: (_, i) => <span className="text-gray-400">{i + 1}</span> },
  { key: 'name',           label: 'HCP',                sortable: true,  render: (r) => (
    <div>
      <p className="font-semibold text-gray-900">{r.name}</p>
      <p className="text-[10px] text-gray-400">NPI: {r.npi} · {r.specialty}</p>
    </div>
  )},
  { key: 'account',        label: 'Account',            sortable: true,  render: (r) => r.account },
  { key: 'totalPatients',  label: 'Total Pts',          sortable: true, align: 'right', render: (r) => r.totalPatients.toLocaleString() },
  { key: 'ocsOveruse',     label: 'M7 Overuse',         sortable: true, align: 'right', render: (r) => r.ocsOveruse.toLocaleString() },
  { key: 'm7Rate',         label: 'M7 Rate',            sortable: true, align: 'right', render: (r) => <span className="font-semibold">{r.m7Rate}%</span> },
  { key: 'chronicOcs',     label: 'Chronic OCS',        sortable: true, align: 'right', render: (r) => r.chronicOcs.toLocaleString() },
  { key: 'repeatCourse',   label: 'Repeat Course',      sortable: true, align: 'right', render: (r) => r.repeatCourse.toLocaleString() },
  { key: 'risk',           label: 'Risk',               align: 'center', render: (r) => <RiskBadge rate={r.m7Rate} /> },
]

// ─── Account columns ─────────────────────────────────────────────────────────
const ACCOUNT_COLUMNS: Column<AccountAgg>[] = [
  { key: 'rank',           label: '#',             align: 'center', render: (_, i) => <span className="text-gray-400">{i + 1}</span> },
  { key: 'account',        label: 'Account',       sortable: true,  render: (r) => <span className="font-semibold text-gray-900">{r.account}</span> },
  { key: 'territory',      label: 'Territory',     sortable: true,  render: (r) => r.territory },
  { key: 'topSpecialty',   label: 'Top Specialty', render: (r) => r.topSpecialty },
  { key: 'totalPatients',  label: 'Total Pts',     sortable: true, align: 'right', render: (r) => r.totalPatients.toLocaleString() },
  { key: 'ocsOveruse',     label: 'M7 Overuse',   sortable: true, align: 'right', render: (r) => r.ocsOveruse.toLocaleString() },
  { key: 'm7Rate',         label: 'M7 Rate',      sortable: true, align: 'right', render: (r) => <span className="font-semibold">{r.m7Rate}%</span> },
  { key: 'risk',           label: 'Risk',          align: 'center', render: (r) => <RiskBadge rate={r.m7Rate} /> },
]

// ─── Territory columns ────────────────────────────────────────────────────────
const TERRITORY_COLUMNS: Column<TerritoryAgg>[] = [
  { key: 'rank',           label: '#',            align: 'center', render: (_, i) => <span className="text-gray-400">{i + 1}</span> },
  { key: 'territory',      label: 'Territory',    sortable: true,  render: (r) => <span className="font-semibold text-gray-900">{r.territory}</span> },
  { key: 'region',         label: 'Region',       sortable: true,  render: (r) => r.region },
  { key: 'hcpCount',       label: 'HCPs',         sortable: true, align: 'right', render: (r) => r.hcpCount.toLocaleString() },
  { key: 'totalPatients',  label: 'Total Pts',    sortable: true, align: 'right', render: (r) => r.totalPatients.toLocaleString() },
  { key: 'ocsOveruse',     label: 'M7 Overuse',  sortable: true, align: 'right', render: (r) => r.ocsOveruse.toLocaleString() },
  { key: 'm7Rate',         label: 'M7 Rate',     sortable: true, align: 'right', render: (r) => <span className="font-semibold">{r.m7Rate}%</span> },
  { key: 'risk',           label: 'Risk',         align: 'center', render: (r) => <RiskBadge rate={r.m7Rate} /> },
]

// ─── Demographic columns ──────────────────────────────────────────────────────
const DEMOGRAPHIC_COLUMNS: Column<DemographicAgg>[] = [
  { key: 'ageBand',        label: 'Age Band',      sortable: true,  render: (r) => <span className="font-semibold text-gray-900">{r.ageBand}</span> },
  { key: 'gender',         label: 'Gender',        sortable: true,  render: (r) => r.gender },
  { key: 'totalPatients',  label: 'Total Pts',     sortable: true, align: 'right', render: (r) => r.totalPatients.toLocaleString() },
  { key: 'ocsOveruse',     label: 'M7 Overuse',   sortable: true, align: 'right', render: (r) => r.ocsOveruse.toLocaleString() },
  { key: 'm7Rate',         label: 'M7 Rate',      sortable: true, align: 'right', render: (r) => <span className="font-semibold">{r.m7Rate}%</span> },
  { key: 'chronicOcs',     label: 'Chronic OCS',  sortable: true, align: 'right', render: (r) => r.chronicOcs.toLocaleString() },
  { key: 'repeatCourse',   label: 'Repeat Course',sortable: true, align: 'right', render: (r) => r.repeatCourse.toLocaleString() },
  { key: 'risk',           label: 'Risk',          align: 'center', render: (r) => <RiskBadge rate={r.m7Rate} /> },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────
function sortRows<T extends Record<string, unknown>>(rows: T[], key: string, dir: 'asc' | 'desc'): T[] {
  return [...rows].sort((a, b) => {
    const av = a[key] ?? 0
    const bv = b[key] ?? 0
    const cmp = typeof av === 'number' && typeof bv === 'number'
      ? av - bv
      : String(av).localeCompare(String(bv))
    return dir === 'asc' ? cmp : -cmp
  })
}

// ─────────────────────────────────────────────────────────────────────────────

export function InsightsClient() {
  const [activeTab, setActiveTab] = useState<InsightsTab>('hcp')
  const [filters, setFilters] = useState<InsightsFilters>({ search: '', territory: 'All', specialty: 'All' })
  const [sortKey, setSortKey] = useState('m7Rate')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const [kpis, setKpis] = useState<GlobalKpis>(MOCK_GLOBAL_KPIS)
  const [hcpRows, setHcpRows] = useState<HcpAgg[]>(MOCK_HCP_ROWS)
  const [accountRows, setAccountRows] = useState<AccountAgg[]>(MOCK_ACCOUNT_ROWS)
  const [territoryRows, setTerritoryRows] = useState<TerritoryAgg[]>(MOCK_TERRITORY_ROWS)
  const [demographicRows, setDemographicRows] = useState<DemographicAgg[]>(MOCK_DEMOGRAPHIC_ROWS)
  const [dataDate, setDataDate] = useState(MOCK_DATA_DATE)
  const [isMock, setIsMock] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleTabChange(key: string) {
    if (UNAVAILABLE_TABS.has(key)) return
    setActiveTab(key as InsightsTab)
    setSortKey('m7Rate')
    setSortDir('desc')
    setPage(1)
  }

  function handleSort(key: string) {
    if (key === sortKey) {
      setSortDir((d) => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
    setPage(1)
  }

  const handleFiltersChange = useCallback((f: InsightsFilters) => {
    setFilters(f)
    setPage(1)
  }, [])

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const patients = await parseExcelFile(file)
      setKpis(computeGlobalKpis(patients))
      setHcpRows(aggregateByHcp(patients))
      setAccountRows(aggregateByAccount(patients))
      setTerritoryRows(aggregateByTerritory(patients))
      setDemographicRows(aggregateByDemographic(patients))
      setDataDate(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }))
      setIsMock(false)
    } catch {
      alert('Failed to parse file. Ensure columns: Pat_ID, NPI, Specialty, Account, Territory, Region, Pat_Age, Pat_Gender, M1–M7')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // ─── Derived territories / specialties for filter dropdowns ────────────────
  const territories = useMemo(() => [...new Set(hcpRows.map((r) => r.territory))].sort(), [hcpRows])
  const specialties  = useMemo(() => [...new Set(hcpRows.map((r) => r.specialty))].sort(), [hcpRows])

  // ─── Filtered rows ────────────────────────────────────────────────────────
  const filteredHcp = useMemo(() => {
    const q = filters.search.toLowerCase()
    return hcpRows.filter((r) =>
      (filters.territory === 'All' || r.territory === filters.territory) &&
      (filters.specialty  === 'All' || r.specialty  === filters.specialty) &&
      (q === '' || r.name.toLowerCase().includes(q) || r.npi.includes(q) || r.specialty.toLowerCase().includes(q)),
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
      (q === '' || r.ageBand.includes(q) || r.gender.toLowerCase().includes(q)),
    )
  }, [demographicRows, filters])

  // ─── Sorted + paginated ───────────────────────────────────────────────────
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

  // ─── Summary insights (computed from full/unfiltered data) ────────────────
  const summaryInsights = useMemo<SummaryInsights>(() => {
    const allHcp = [...hcpRows].sort((a, b) => b.m7Rate - a.m7Rate)
    const highestRiskHcp = allHcp[0]
    const allTerritory = [...territoryRows].sort((a, b) => b.m7Rate - a.m7Rate)
    const highestBurdenTerritory = allTerritory[0]
    const allDemo = [...demographicRows].sort((a, b) => b.m7Rate - a.m7Rate)
    const highestRiskAgeBand = allDemo[0]
    const flaggedHcpCount = hcpRows.filter((r) => r.m7Rate >= FLAG_THRESHOLD).length
    const totalHcpCount   = hcpRows.length
    const flaggedHcpRate  = totalHcpCount === 0 ? 0 : Math.round((flaggedHcpCount / totalHcpCount) * 1000) / 10
    return { highestRiskHcp, highestBurdenTerritory, highestRiskAgeBand, flaggedHcpCount, totalHcpCount, flaggedHcpRate }
  }, [hcpRows, territoryRows, demographicRows])

  // ─── Columns and row key for active tab ─────────────────────────────────
  type AnyRow = HcpAgg | AccountAgg | TerritoryAgg | DemographicAgg
  const tableProps: { columns: Column<AnyRow>[]; rowKey: (r: AnyRow) => string } = useMemo(() => {
    if (activeTab === 'hcp')         return { columns: HCP_COLUMNS         as Column<AnyRow>[], rowKey: (r) => (r as HcpAgg).npi }
    if (activeTab === 'account')     return { columns: ACCOUNT_COLUMNS     as Column<AnyRow>[], rowKey: (r) => (r as AccountAgg).account }
    if (activeTab === 'geography')   return { columns: TERRITORY_COLUMNS   as Column<AnyRow>[], rowKey: (r) => (r as TerritoryAgg).territory }
    return                                  { columns: DEMOGRAPHIC_COLUMNS as Column<AnyRow>[], rowKey: (r) => `${(r as DemographicAgg).ageBand}-${(r as DemographicAgg).gender}` }
  }, [activeTab])

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Aggregated Insights</h1>
          <p className="mt-0.5 text-sm text-gray-500 max-w-2xl">
            Multi-dimensional aggregation of patient-level care gap metrics to identify care gap hotspots and opportunities.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {isMock && (
            <span className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-medium text-amber-700">
              <Info className="h-3 w-3" />
              Demo data
            </span>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            className="sr-only"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {uploading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            {uploading ? 'Parsing…' : 'Load Data'}
          </button>
          <button className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 shadow-sm hover:bg-gray-50 transition-colors">
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* ── Primary KPI Row ── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          title="Total Eligible IBD Patients"
          value={kpis.totalPatients}
          caption="100% of cohort"
          badge="Full Cohort"
          variant="default"
          icon={<Users className="h-4 w-4" />}
        />
        <KpiCard
          title="Patients with OCS Use"
          value={kpis.ocsUse}
          caption={`${kpis.ocsUseRate}% of cohort`}
          badge={`${kpis.ocsUseRate}%`}
          variant="default"
          icon={<Activity className="h-4 w-4" />}
        />
        <KpiCard
          title="Patients with OCS Overuse"
          value={kpis.ocsOveruse}
          caption={`${kpis.ocsOveruseRate}% of cohort · M7 > 30 days`}
          badge={`${kpis.ocsOveruseRate}%`}
          variant="highlight"
          icon={<BarChart2 className="h-4 w-4" />}
        />
        <KpiCard
          title="M7 Overuse Rate"
          value={`${kpis.m7Rate}%`}
          caption="Composite OCS overuse rate"
          badge="Primary KPI"
          variant="success"
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      {/* ── Secondary KPI Row ── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <KpiCard size="secondary" title="Chronic OCS" value={kpis.chronicOcs}
          caption={`${kpis.chronicOcsRate}% of cohort · M3 > 90 days`}
          badge={`${kpis.chronicOcsRate}%`}
          icon={<Clock className="h-3.5 w-3.5" />} />
        <KpiCard size="secondary" title="High-Dose OCS" value={kpis.highDose}
          caption={`${kpis.highDoseRate}% of cohort · M7 > 0 days`}
          badge={`${kpis.highDoseRate}%`}
          variant="warning"
          icon={<FlaskConical className="h-3.5 w-3.5" />} />
        <KpiCard size="secondary" title="Repeat OCS Course" value={kpis.repeatCourse}
          caption={`${kpis.repeatCourseRate}% of cohort · M4 > 1 episode`}
          badge={`${kpis.repeatCourseRate}%`}
          icon={<Repeat2 className="h-3.5 w-3.5" />} />
        <KpiCard size="secondary" title="Steroid Taper Failure" value={kpis.taperFailure}
          caption={`${kpis.taperFailureRate}% of OCS users · M5 > 3 mo`}
          badge={`${kpis.taperFailureRate}%`}
          variant="warning"
          icon={<TrendingUp className="h-3.5 w-3.5" />} />
        <KpiCard size="secondary" title="Post-Disc. Relapse" value={kpis.relapse}
          caption={`${kpis.relapseRate}% of discontinuations · M6 ≤ 3 mo`}
          badge={`${kpis.relapseRate}%`}
          icon={<RefreshCw className="h-3.5 w-3.5" />} />
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
                  title={unavailable ? 'Data not available — payer/date fields not present in source dataset' : undefined}
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
          <FilterBar
            filters={filters}
            territories={territories}
            specialties={specialties}
            activeTab={activeTab}
            onChange={handleFiltersChange}
          />
          <span className="shrink-0 text-[10px] text-gray-400">
            {totalRows} result{totalRows !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Table */}
        <InsightsTable
          columns={tableProps.columns}
          rows={pagedRows as AnyRow[]}
          rowKey={tableProps.rowKey}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          page={page}
          pageSize={PAGE_SIZE}
          totalRows={totalRows}
          onPage={setPage}
        />
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between px-1 text-[10px] text-gray-400">
        <span>Data refreshed on {dataDate}{isMock ? ' (demo)' : ''}</span>
        <span>PP = percentage points · M7 threshold: &gt;30 days · HCP flag threshold: ≥20% M7 rate</span>
      </div>

    </div>
  )
}
