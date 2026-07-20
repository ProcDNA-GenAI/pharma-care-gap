'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import {
  Users, Activity, BarChart2, RefreshCw,
  Clock, FlaskConical, Repeat2, Download, Upload, SlidersHorizontal,
  Database, AlertCircle, Info, ArrowRight, X, Check,
} from 'lucide-react'
import { KpiCard } from '@/components/insights/KpiCard'
import { CommercialSummaryPanel } from '@/components/insights/CommercialSummaryPanel'
import { BusinessRuleSummaryPanel } from '@/components/insights/BusinessRuleSummaryPanel'
import { ViewConfigurationPanel } from '@/components/insights/ViewConfigurationPanel'
import { DistributionTable } from '@/components/insights/DistributionTable'
import type { DistributionColumn } from '@/components/insights/DistributionTable'
import { InsightsSideNav } from '@/components/insights/InsightsSideNav'
import type { InsightsView } from '@/components/insights/InsightsSideNav'
import { ScenarioComparison } from '@/components/insights/ScenarioComparison'
import { FilterBar } from '@/components/insights/FilterBar'
import { InsightsTable, RiskBadge } from '@/components/insights/InsightsTable'
import type { Column } from '@/components/insights/InsightsTable'
import { usePatientDb } from '@/hooks/usePatientDb'
import { DEFAULT_PARAMETERS } from '@/hooks/useParameterState'
import { useScenarios } from '@/hooks/useScenarios'
import { ScenarioDropdown } from '@/components/insights/ScenarioDropdown'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import type { ParameterValues } from '@/lib/types'
import type {
  HcpAgg, AccountAgg, TerritoryAgg, DemographicAgg,
  SpecialtyAgg, AgeDistributionAgg, HcpSegmentAgg,
  InsightsTab, InsightsFilters,
} from '@/lib/types/insights'

// Dynamic page size is managed inside the component based on window height.

// ─── Detailed View tabs ───────────────────────────────────────────────────────
type DetailedTab = 'npi' | 'account' | 'territory'

const DETAILED_TABS: { key: DetailedTab; label: string }[] = [
  { key: 'npi',       label: 'NPI-Level View'         },
  { key: 'account',   label: 'Account-Level View'     },
  { key: 'territory', label: 'Territory-Region View'  },
]

// Legacy TABS kept for Overview view's filter logic
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

// ─── Column definitions (base — filtered dynamically per enabled metrics) ─────

// Detailed View: NPI-Level columns (match screenshot exactly)
const NPI_COLUMNS_BASE: Column<HcpAgg>[] = [
  { key: 'npi',           label: 'NPI',                                              sortable: true,  render: (r) => <span className="font-mono text-xs text-gray-700">{r.npi}</span> },
  { key: 'name',          label: 'HCP Name',                                         sortable: true,  render: (r) => <span className="font-semibold text-gray-900">{r.name}</span> },
  { key: 'specialty',     label: 'Specialty',                                        sortable: true,  render: (r) => <span className="block truncate max-w-[160px]" title={r.specialty}>{r.specialty}</span> },
  { key: 'totalPatients', label: 'Eligible IBD Patients',                            sortable: true,  align: 'right', render: (r) => r.totalPatients.toLocaleString() },
  { key: 'ocsOveruse',    label: 'Patients with Potential OCS Overuse (≥ 1 Criterion)', sortable: true, align: 'right', render: (r) => r.ocsOveruse.toLocaleString() },
  { key: 'm7Rate',        label: 'Overuse Rate (%)',                                 sortable: true,  align: 'right', render: (r) => <span className="font-semibold">{r.m7Rate}%</span> },
  { key: 'chronicOcsRate',    label: 'Chronic OCS Exposure (Duration-Based) (%)',        sortable: true,  align: 'right', render: (r) => {
    const rate = r.totalPatients > 0 ? Math.round((r.chronicOcs / r.totalPatients) * 1000) / 10 : 0
    return `${rate}%`
  }},
  { key: 'highDoseRate',      label: 'High-Dose OCS Exposure (Dose-Based) (%)',         sortable: true,  align: 'right', render: (r) => {
    const rate = r.totalPatients > 0 ? Math.round((r.highDose / r.totalPatients) * 1000) / 10 : 0
    return `${rate}%`
  }},
  { key: 'repeatCourseRate',  label: 'Recurrent OCS Courses (Treatment Pattern) (%)',   sortable: true,  align: 'right', render: (r) => {
    const rate = r.totalPatients > 0 ? Math.round((r.repeatCourse / r.totalPatients) * 1000) / 10 : 0
    return `${rate}%`
  }},
]

// Overview/fallback HCP columns (kept for overview tab logic)
const HCP_COLUMNS_BASE: Column<HcpAgg>[] = [
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
  { key: 'chronicOcsRate',    label: 'Chronic OCS',   sortable: true, align: 'right', render: (r) => r.chronicOcs.toLocaleString() },
  { key: 'highDoseRate',      label: 'High-Dose OCS', sortable: true, align: 'right', render: (r) => r.highDose.toLocaleString() },
  { key: 'repeatCourseRate',  label: 'Repeat Course', sortable: true, align: 'right', render: (r) => r.repeatCourse.toLocaleString() },
  { key: 'risk',          label: 'Risk',          align: 'center', render: (r) => <RiskBadge rate={r.m7Rate} /> },
]

// Detailed View: Account-Level columns
const ACCOUNT_COLUMNS_DETAILED: Column<AccountAgg>[] = [
  { key: 'account',           label: 'Account Name',                                        sortable: true,  render: (r) => <span className="block truncate max-w-[180px]" title={r.account}>{r.account}</span> },
  { key: 'hcpCount',          label: '# of HCPs',                                          sortable: true,  align: 'right', render: (r) => r.hcpCount.toLocaleString() },
  { key: 'totalPatients',     label: 'Eligible IBD Patients',                               sortable: true,  align: 'right', render: (r) => r.totalPatients.toLocaleString() },
  { key: 'ocsOveruse',        label: 'Patients with Potential OCS Overuse (≥ 1 Criterion)', sortable: true,  align: 'right', render: (r) => r.ocsOveruse.toLocaleString() },
  { key: 'm7Rate',            label: 'Overuse Rate (%)',                                     sortable: true,  align: 'right', render: (r) => <span className="font-semibold">{r.m7Rate}%</span> },
  { key: 'chronicOcsRate',    label: 'Chronic OCS Exposure (Duration-Based) (%)',            sortable: true,  align: 'right', render: (r) => `${r.chronicOcsRate}%` },
  { key: 'repeatCourseRate',  label: 'Recurrent OCS Courses (Treatment Pattern) (%)',        sortable: true,  align: 'right', render: (r) => `${r.repeatCourseRate}%` },
]

const ACCOUNT_COLUMNS_BASE: Column<AccountAgg>[] = [
  { key: 'rank',          label: '#',             align: 'center', render: (_, i) => <span className="text-gray-400">{i + 1}</span> },
  { key: 'account',       label: 'Account',       sortable: true,  render: (r) => <span className="font-semibold text-gray-900">{r.account}</span> },
  { key: 'territory',     label: 'Territory',     sortable: true,  render: (r) => r.territory },
  { key: 'topSpecialty',  label: 'Top Specialty', render: (r) => r.topSpecialty },
  { key: 'totalPatients', label: 'Total Pts',     sortable: true, align: 'right', render: (r) => r.totalPatients.toLocaleString() },
  { key: 'ocsOveruse',    label: '# Patient with OCS use',    sortable: true, align: 'right', render: (r) => r.ocsOveruse.toLocaleString() },
  { key: 'm7Rate',        label: 'Overuse Rate',       sortable: true, align: 'right', render: (r) => <span className="font-semibold">{r.m7Rate}%</span> },
  { key: 'risk',          label: 'Risk',          align: 'center', render: (r) => <RiskBadge rate={r.m7Rate} /> },
]

// Detailed View: Territory-Region columns
const TERRITORY_COLUMNS_DETAILED: Column<TerritoryAgg>[] = [
  { key: 'territory',         label: 'Territory',                                           sortable: true,  render: (r) => <span className="font-semibold text-gray-900">{r.territory}</span> },
  { key: 'region',            label: 'Region',                                              sortable: true,  render: (r) => r.region },
  { key: 'hcpCount',          label: '# of HCPs',                                          sortable: true,  align: 'right', render: (r) => r.hcpCount.toLocaleString() },
  { key: 'totalPatients',     label: 'Eligible IBD Patients',                               sortable: true,  align: 'right', render: (r) => r.totalPatients.toLocaleString() },
  { key: 'ocsOveruse',        label: 'Patients with Potential OCS Overuse (≥ 1 Criterion)', sortable: true,  align: 'right', render: (r) => r.ocsOveruse.toLocaleString() },
  { key: 'm7Rate',            label: 'Overuse Rate (%)',                                     sortable: true,  align: 'right', render: (r) => <span className="font-semibold">{r.m7Rate}%</span> },
  { key: 'chronicOcsRate',    label: 'Chronic OCS Exposure (Duration-Based) (%)',            sortable: true,  align: 'right', render: (r) => `${r.chronicOcsRate}%` },
  { key: 'highDoseRate',      label: 'High-Dose OCS Exposure (Dose-Based) (%)',              sortable: true,  align: 'right', render: (r) => `${r.highDoseRate}%` },
  { key: 'repeatCourseRate',  label: 'Recurrent OCS Courses (Treatment Pattern) (%)',        sortable: true,  align: 'right', render: (r) => `${r.repeatCourseRate}%` },
]

const TERRITORY_COLUMNS_BASE: Column<TerritoryAgg>[] = [
  { key: 'rank',          label: '#',            align: 'center', render: (_, i) => <span className="text-gray-400">{i + 1}</span> },
  { key: 'territory',     label: 'Territory',    sortable: true,  render: (r) => <span className="font-semibold text-gray-900">{r.territory}</span> },
  { key: 'region',        label: 'Region',       sortable: true,  render: (r) => r.region },
  { key: 'hcpCount',      label: 'HCPs',         sortable: true, align: 'right', render: (r) => r.hcpCount.toLocaleString() },
  { key: 'totalPatients', label: 'Total Pts',    sortable: true, align: 'right', render: (r) => r.totalPatients.toLocaleString() },
  { key: 'ocsOveruse',    label: '# Patient with OCS use',   sortable: true, align: 'right', render: (r) => r.ocsOveruse.toLocaleString() },
  { key: 'm7Rate',        label: 'Overuse Rate',      sortable: true, align: 'right', render: (r) => <span className="font-semibold">{r.m7Rate}%</span> },
  { key: 'risk',          label: 'Risk',         align: 'center', render: (r) => <RiskBadge rate={r.m7Rate} /> },
]

const DEMOGRAPHIC_COLUMNS_BASE: Column<DemographicAgg>[] = [
  { key: 'ageBand',       label: 'Age Band',      sortable: true,  render: (r) => <span className="font-semibold text-gray-900">{r.ageBand}</span> },
  { key: 'gender',        label: 'Gender',        sortable: true,  render: (r) => r.gender },
  { key: 'totalPatients', label: 'Total Pts',     sortable: true, align: 'right', render: (r) => r.totalPatients.toLocaleString() },
  { key: 'ocsOveruse',    label: '# Patient with OCS use',    sortable: true, align: 'right', render: (r) => r.ocsOveruse.toLocaleString() },
  { key: 'm7Rate',        label: 'Overuse Rate',       sortable: true, align: 'right', render: (r) => <span className="font-semibold">{r.m7Rate}%</span> },
  { key: 'chronicOcsRate',    label: 'Chronic OCS',   sortable: true, align: 'right', render: (r) => r.chronicOcs.toLocaleString() },
  { key: 'highDoseRate',      label: 'High-Dose OCS', sortable: true, align: 'right', render: (r) => r.highDose.toLocaleString() },
  { key: 'repeatCourseRate',  label: 'Repeat Course', sortable: true, align: 'right', render: (r) => r.repeatCourse.toLocaleString() },
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

interface InsightsClientProps {
  careGapId: string
}

export function InsightsClient({ careGapId }: InsightsClientProps) {
  // ── Parameter state (starts at defaults to match SSR, synced from localStorage after mount) ───
  const [parameters, setParameters] = useState<ParameterValues>(DEFAULT_PARAMETERS)
  // Draft = pending edits in ViewConfigurationPanel before user clicks Apply
  const [draftParams, setDraftParams] = useState<ParameterValues>(DEFAULT_PARAMETERS)
  const { scenarios, saveScenario, deleteScenario } = useScenarios(careGapId)
  const [activeScenarioId, setActiveScenarioId] = useState<string>('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    const stored = loadStoredParams()
    setParameters(stored)
    setDraftParams(stored)
  }, [])

  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleResize = () => {
      const windowHeight = window.innerHeight
      // Increase reserved height to account for all headers, tabs, footer, and paddings safely
      const reservedHeight = 650
      const availableHeight = windowHeight - reservedHeight
      // Average row height is around 45px
      const calculatedRows = Math.floor(availableHeight / 45)
      // Display at least 5 rows and at most 50 rows dynamically to fit on one page
      setPageSize(Math.max(5, Math.min(50, calculatedRows)))
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
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

  const handleDraftChange = useCallback(
    (key: keyof ParameterValues, value: ParameterValues[keyof ParameterValues]) => {
      setDraftParams((prev) => ({ ...prev, [key]: value }))
    }, [],
  )

  const handleApplyConfiguration = useCallback((draft: ParameterValues) => {
    setParameters(draft)
    if (typeof window !== 'undefined') {
      localStorage.setItem('ruleParameters', JSON.stringify(draft))
    }
  }, [])

  const handleResetToDefault = useCallback(() => {
    setParameters(DEFAULT_PARAMETERS)
    setDraftParams(DEFAULT_PARAMETERS)
    if (typeof window !== 'undefined') {
      localStorage.setItem('ruleParameters', JSON.stringify(DEFAULT_PARAMETERS))
    }
  }, [])

  // ── SQLite + reactive query engine ───────────────────────────────────────
  const {
    status, statusLabel, hasRealData, rowCount, loadFile,
    kpis, hcpRows, accountRows, territoryRows, demographicRows, error,
    specialtyRows, ageDistributionRows, hcpSegmentRows,
  } = usePatientDb(parameters)

  // ── UI state ─────────────────────────────────────────────────────────────
  const [activeView, setActiveView]   = useState<InsightsView>('overview')
  const [activeTab, setActiveTab]     = useState<InsightsTab>('hcp')
  const [detailedTab, setDetailedTab] = useState<DetailedTab>('npi')
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
    return all.slice((page - 1) * pageSize, page * pageSize)
  }, [activeRows, activeTab, page, pageSize])

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

  // ── Filtered columns based on enabled metrics ────────────────────────────
  const { m2Enabled, m3Enabled, m4Enabled, m7Enabled } = parameters

  const hcpColumns = useMemo(() =>
    HCP_COLUMNS_BASE.filter((col) => {
      if ((col.key === 'ocsOveruse' || col.key === 'm7Rate' || col.key === 'risk') && !m7Enabled) return false
      if (col.key === 'chronicOcsRate'   && !m2Enabled) return false
      if (col.key === 'highDoseRate'     && !m3Enabled) return false
      if (col.key === 'repeatCourseRate' && !m4Enabled) return false
      return true
    }),
    [m2Enabled, m3Enabled, m4Enabled, m7Enabled],
  )

  const accountColumns = useMemo(() =>
    ACCOUNT_COLUMNS_BASE.filter((col) => {
      if ((col.key === 'ocsOveruse' || col.key === 'm7Rate' || col.key === 'risk') && !m7Enabled) return false
      return true
    }),
    [m7Enabled],
  )

  const territoryColumns = useMemo(() =>
    TERRITORY_COLUMNS_BASE.filter((col) => {
      if ((col.key === 'ocsOveruse' || col.key === 'm7Rate' || col.key === 'risk') && !m7Enabled) return false
      return true
    }),
    [m7Enabled],
  )

  const demographicColumns = useMemo(() =>
    DEMOGRAPHIC_COLUMNS_BASE.filter((col) => {
      if ((col.key === 'ocsOveruse' || col.key === 'm7Rate' || col.key === 'risk') && !m7Enabled) return false
      if (col.key === 'chronicOcsRate'   && !m2Enabled) return false
      if (col.key === 'highDoseRate'     && !m3Enabled) return false
      if (col.key === 'repeatCourseRate' && !m4Enabled) return false
      return true
    }),
    [m2Enabled, m3Enabled, m4Enabled, m7Enabled],
  )

  // ── Column + rowKey for active tab (overview) ─────────────────────────────
  type AnyRow = HcpAgg | AccountAgg | TerritoryAgg | DemographicAgg
  const tableProps = useMemo(() => {
    if (activeTab === 'hcp')         return { columns: hcpColumns         as Column<AnyRow>[], rowKey: (r: AnyRow) => (r as HcpAgg).npi }
    if (activeTab === 'account')     return { columns: accountColumns     as Column<AnyRow>[], rowKey: (r: AnyRow) => (r as AccountAgg).account }
    if (activeTab === 'geography')   return { columns: territoryColumns   as Column<AnyRow>[], rowKey: (r: AnyRow) => (r as TerritoryAgg).territory }
    return                                  { columns: demographicColumns as Column<AnyRow>[], rowKey: (r: AnyRow) => `${(r as DemographicAgg).ageBand}-${(r as DemographicAgg).gender}` }
  }, [activeTab, hcpColumns, accountColumns, territoryColumns, demographicColumns])

  // ── Detailed View table props ──────────────────────────────────────────────
  const detailedTableProps = useMemo(() => {
    if (detailedTab === 'npi') {
      const totPts   = hcpRows.reduce((s, r) => s + r.totalPatients, 0)
      const totOver  = hcpRows.reduce((s, r) => s + r.ocsOveruse, 0)
      const totChr   = hcpRows.reduce((s, r) => s + r.chronicOcs, 0)
      const totHigh  = hcpRows.reduce((s, r) => s + r.highDose, 0)
      const totRep   = hcpRows.reduce((s, r) => s + r.repeatCourse, 0)
      const overRate = totPts > 0 ? `${(Math.round((totOver / totPts) * 1000) / 10)}%` : '—'
      const chrRate  = totPts > 0 ? `${(Math.round((totChr  / totPts) * 1000) / 10)}%` : '—'
      const highRate = totPts > 0 ? `${(Math.round((totHigh / totPts) * 1000) / 10)}%` : '—'
      const repRate  = totPts > 0 ? `${(Math.round((totRep  / totPts) * 1000) / 10)}%` : '—'
      const columns = NPI_COLUMNS_BASE.filter((col) => {
        if ((col.key === 'ocsOveruse' || col.key === 'm7Rate' || col.key === 'risk') && !m7Enabled) return false
        if (col.key === 'chronicOcsRate'   && !m2Enabled) return false
        if (col.key === 'highDoseRate'     && !m3Enabled) return false
        if (col.key === 'repeatCourseRate' && !m4Enabled) return false
        return true
      })
      return {
        columns: columns as Column<AnyRow>[],
        rows: sortRows(filteredHcp, sortKey, sortDir) as unknown as AnyRow[],
        rowKey: (r: AnyRow) => (r as HcpAgg).npi,
        totalRow: {
          totalPatients: totPts.toLocaleString(),
          ocsOveruse: totOver.toLocaleString(),
          m7Rate: overRate,
          chronicOcsRate: chrRate,
          highDoseRate: highRate,
          repeatCourseRate: repRate,
        },
        totalRowLabel: 'Total (All NPIs)',
      }
    }
    if (detailedTab === 'account') {
      const totPts  = accountRows.reduce((s, r) => s + r.totalPatients, 0)
      const totOver = accountRows.reduce((s, r) => s + r.ocsOveruse, 0)
      const totChr  = accountRows.reduce((s, r) => s + r.chronicOcs, 0)
      const totRep  = accountRows.reduce((s, r) => s + r.repeatCourse, 0)
      const totHcp  = accountRows.reduce((s, r) => s + r.hcpCount, 0)
      const overRate = totPts > 0 ? `${(Math.round((totOver / totPts) * 1000) / 10)}%` : '—'
      const chrRate  = totPts > 0 ? `${(Math.round((totChr  / totPts) * 1000) / 10)}%` : '—'
      const repRate  = totPts > 0 ? `${(Math.round((totRep  / totPts) * 1000) / 10)}%` : '—'
      const columns = ACCOUNT_COLUMNS_DETAILED.filter((col) => {
        if ((col.key === 'ocsOveruse' || col.key === 'm7Rate' || col.key === 'chronicOcsRate' || col.key === 'repeatCourseRate') && !m7Enabled) return false
        return true
      })
      return {
        columns: columns as Column<AnyRow>[],
        rows: sortRows(filteredAccount, sortKey, sortDir) as unknown as AnyRow[],
        rowKey: (r: AnyRow) => (r as AccountAgg).account,
        totalRow: {
          hcpCount: totHcp.toLocaleString(),
          totalPatients: totPts.toLocaleString(),
          ocsOveruse: totOver.toLocaleString(),
          m7Rate: overRate,
          chronicOcsRate: chrRate,
          repeatCourseRate: repRate,
        },
        totalRowLabel: 'Total (All Accounts)',
      }
    }
    // territory
    const totPts   = territoryRows.reduce((s, r) => s + r.totalPatients, 0)
    const totOver  = territoryRows.reduce((s, r) => s + r.ocsOveruse, 0)
    const totChr   = territoryRows.reduce((s, r) => s + r.chronicOcs, 0)
    const totHigh  = territoryRows.reduce((s, r) => s + r.highDose, 0)
    const totRep   = territoryRows.reduce((s, r) => s + r.repeatCourse, 0)
    const hcpCount = territoryRows.reduce((s, r) => s + r.hcpCount, 0)
    const overRate  = totPts > 0 ? `${(Math.round((totOver  / totPts) * 1000) / 10)}%` : '—'
    const chrRate   = totPts > 0 ? `${(Math.round((totChr   / totPts) * 1000) / 10)}%` : '—'
    const highRate  = totPts > 0 ? `${(Math.round((totHigh  / totPts) * 1000) / 10)}%` : '—'
    const repRate   = totPts > 0 ? `${(Math.round((totRep   / totPts) * 1000) / 10)}%` : '—'
    const columns = TERRITORY_COLUMNS_DETAILED.filter((col) => {
      if ((col.key === 'ocsOveruse' || col.key === 'm7Rate' || col.key === 'chronicOcsRate' || col.key === 'highDoseRate' || col.key === 'repeatCourseRate') && !m7Enabled) return false
      return true
    })
    return {
      columns: columns as Column<AnyRow>[],
      rows: sortRows(filteredTerritory, sortKey, sortDir) as unknown as AnyRow[],
      rowKey: (r: AnyRow) => (r as TerritoryAgg).territory,
      totalRow: {
        hcpCount: hcpCount.toLocaleString(),
        totalPatients: totPts.toLocaleString(),
        ocsOveruse: totOver.toLocaleString(),
        m7Rate: overRate,
        chronicOcsRate: chrRate,
        highDoseRate: highRate,
        repeatCourseRate: repRate,
      },
      totalRowLabel: 'Total (All Territories)',
    }
  }, [detailedTab, hcpRows, accountRows, territoryRows, filteredHcp, filteredAccount, filteredTerritory, sortKey, sortDir])

  // ── Tab header for the Detailed View ─────────────────────────────────────
  const detailedViewTitle =
    detailedTab === 'npi'       ? 'NPI-Level Overview'           :
    detailedTab === 'account'   ? 'Account-Level Overview'       :
                                  'Territory-Region Overview'
  const detailedViewSubtitle =
    detailedTab === 'npi'       ? 'Top performing NPIs by patient volume and care gap overuse.' :
    detailedTab === 'account'   ? 'Care gap overuse across consumer accounts.'                  :
                                  'Care gap overuse across territories and regions.'


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

                {parameters.m1Enabled ? (
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <KpiCard title="Eligible IBD Cohort" value={kpis.totalPatients}
                      caption="Patients satisfying cohort definition" badge="100%"
                      icon={<Users className="h-4 w-4" />} />
                    <KpiCard title="OCS Users" value={kpis.ocsUse}
                      caption="Patients meeting at least one enabled OCS criterion" badge={`${kpis.ocsUseRate}%`}
                      icon={<Activity className="h-4 w-4" />} />
                  </div>
                ) : (
                  <p className="mt-3 text-xs italic text-gray-400">IBD Cohort section is disabled.</p>
                )}
              </div>

              {/* Section 2: OCS Overuse Summary — Key Metrics */}
              <div className="lg:pl-4">
                <h2 className="text-base font-bold text-[#1D3F8F]">2. OCS Overuse Summary — Key Metrics</h2>
                <p className="mt-0.5 text-xs text-[#6B7280]">Patients evaluated across clinically relevant indicators of inappropriate or prolonged OCS use.</p>

                {(m2Enabled || m3Enabled || m4Enabled || m7Enabled) ? (
                  <div
                    className="mt-3 grid gap-3"
                    style={{ gridTemplateColumns: `repeat(${[m7Enabled, m2Enabled, m3Enabled, m4Enabled].filter(Boolean).length}, minmax(0, 1fr))` }}
                  >
                    {m7Enabled && (
                      <KpiCard title="Potential OCS Overuse" value={kpis.ocsOveruse}
                        caption="Patients meeting composite overuse criteria" badge={`${kpis.ocsOveruseRate}%`}
                        variant="purple" icon={<BarChart2 className="h-4 w-4" />} />
                    )}
                    {m2Enabled && (
                      <KpiCard title="Chronic OCS Exposure" value={kpis.chronicOcs}
                        caption={`Chronic OCS days >= ${parameters.ocsDurationThreshold}`} badge={`${kpis.chronicOcsRate}%`}
                        variant="green" icon={<Clock className="h-4 w-4" />} />
                    )}
                    {m3Enabled && (
                      <KpiCard title="High-Dose OCS Exposure" value={kpis.highDose}
                        caption={`High-dose days >= ${parameters.highDoseDurationDays}, prednisone >= ${parameters.highDoseMg}, cumulative >= ${parameters.highDoseCumulativeMg}`} badge={`${kpis.highDoseRate}%`}
                        variant="orange" icon={<FlaskConical className="h-4 w-4" />} />
                    )}
                    {m4Enabled && (
                      <KpiCard title="Recurrent OCS Courses" value={kpis.repeatCourse}
                        caption={`Min gap between OCS courses >= ${parameters.courseGapDays} days`} badge={`${kpis.repeatCourseRate}%`}
                        variant="blue" icon={<Repeat2 className="h-4 w-4" />} />
                    )}
                  </div>
                ) : (
                  <p className="mt-3 text-xs italic text-gray-400">All OCS metrics are disabled.</p>
                )}
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
        /* ── Detailed View: Pill Tabs + Table ── */
        <div className="space-y-4">

          {/* Pill tab strip + action buttons */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
              {DETAILED_TABS.map((tab) => {
                const isActive = detailedTab === tab.key
                return (
                  <button
                    key={tab.key}
                    onClick={() => { setDetailedTab(tab.key); setSortKey('m7Rate'); setSortDir('desc'); setPage(1) }}
                    className={[
                      'rounded-md px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none',
                      isActive
                        ? 'bg-[#1D3F8F] text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
                    ].join(' ')}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Load Data + Export — moved here in Detailed View per design */}
            <div className="flex items-center gap-2">
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

          {/* Table card */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">

            {/* Section header */}
            <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF3FF]">
                <Users className="h-5 w-5 text-[#004FBA]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#1D3F8F]">{detailedViewTitle}</h2>
                <p className="text-xs text-[#6B7280]">{detailedViewSubtitle}</p>
              </div>
            </div>

            {/* Table */}
            <InsightsTable
              columns={detailedTableProps.columns}
              rows={detailedTableProps.rows.slice((page - 1) * pageSize, page * pageSize) as AnyRow[]}
              rowKey={detailedTableProps.rowKey}
              sortKey={sortKey} sortDir={sortDir} onSort={handleSort}
              page={page} pageSize={pageSize} totalRows={detailedTableProps.rows.length} onPage={setPage}
              totalRow={detailedTableProps.totalRow}
              totalRowLabel={detailedTableProps.totalRowLabel}
            />

            {/* Bottom note */}
            <div className="flex items-center gap-2 border-t border-gray-100 bg-gray-50 px-5 py-2.5">
              <Info className="h-3.5 w-3.5 shrink-0 text-[#6B7280]" />
              <p className="text-[11px] text-[#6B7280]">
                Use the filters in the configuration panel to refine results. You can export any table for further analysis.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  )

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-5">

      {/* Hidden file input — always mounted so the ref works in both Overview and Detailed View */}
      <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} className="sr-only" />

      {/* ── Header: offset by fixed sidebar width (w-20 = 80px) — hidden on Scenario Comparison ── */}
      {activeView !== 'scenario-comparison' && <div className="flex items-start justify-between gap-4 pl-24">
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
        {/* In Overview mode, keep the Parameters / Load Data / Export buttons here */}
        {activeView === 'overview' && (
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
            <div
              className={`shrink-0 transition-all duration-300 ease-in-out ${scenarios.length > 0 ? 'w-[180px] opacity-100 overflow-visible' : 'w-0 opacity-0 overflow-hidden'}`}
            >
              <ScenarioDropdown
                scenarios={scenarios}
                activeId={activeScenarioId}
                onSelect={(id) => {
                  setActiveScenarioId(id)
                  if (id) {
                    const scen = scenarios.find(s => s.id === id)
                    if (scen) {
                      setParameters(scen.parameters)
                      setDraftParams(scen.parameters)
                    }
                  }
                }}
                onDelete={(id) => {
                  deleteScenario(id)
                  if (activeScenarioId === id) {
                    setActiveScenarioId('')
                    setParameters(DEFAULT_PARAMETERS)
                    setDraftParams(DEFAULT_PARAMETERS)
                  }
                }}
              />
            </div>
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
        )}
      </div>}

      {/* ── Content row ── */}
      <div className="flex items-start gap-5">
        <InsightsSideNav active={activeView} onChange={setActiveView} scenarioCount={scenarios.length} />
        <div className="w-20 shrink-0 -mr-2" aria-hidden="true" />

        {activeView === 'scenario-comparison' ? (
          <div className="flex-1 min-w-0">
            <ScenarioComparison scenarios={scenarios} />
          </div>
        ) : (
          mainContent
        )}

        {/* ── Right sidebar — hidden on Scenario Comparison view ── */}
        {activeView !== 'scenario-comparison' && (
          <div className="w-72 shrink-0 space-y-4 lg:sticky lg:top-5">
            {activeView === 'detailed' ? (
              /* Detailed View: always show ViewConfigurationPanel */
              <ViewConfigurationPanel
                draft={draftParams}
                onDraftChange={handleDraftChange}
                onApply={handleApplyConfiguration}
                onReset={handleResetToDefault}
              />
            ) : (
              /* Overview: show BusinessRuleSummaryPanel when Parameters is toggled */
              <>
                {showParameters && (
                  <BusinessRuleSummaryPanel
                    parameters={parameters}
                    onParameterChange={handleParameterChange}
                    editing={editingRules}
                    onToggleEditing={() => setEditingRules((v) => !v)}
                    onSaveScenario={() => {
                      const res = saveScenario(parameters)
                      if (!res.success && res.error) {
                        setToast({ message: res.error, type: 'error' })
                      } else {
                        setToast({ message: 'Scenario saved successfully.', type: 'success' })
                      }
                    }}
                  />
                )}
                <CommercialSummaryPanel
                  hcpsWithOveruse={commercialSummary.hcpsWithOveruse}
                  territoriesCovered={commercialSummary.territoriesCovered}
                  avgHcpsPerMsl={commercialSummary.avgHcpsPerMsl}
                />
              </>
            )}
          </div>
        )}
      </div>

      {toast && (
        <div
          className={[
            'fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-lg border p-4 text-xs font-semibold shadow-lg animate-in slide-in-from-bottom-5 duration-300',
            toast.type === 'error'
              ? 'border-red-200 bg-red-50 text-red-800'
              : 'border-green-200 bg-green-50 text-green-800',
          ].join(' ')}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          ) : (
            <Check className="h-4 w-4 shrink-0 text-green-500" />
          )}
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className={[
              'ml-3 rounded p-0.5 transition-colors',
              toast.type === 'error' ? 'text-red-500 hover:bg-red-100' : 'text-green-500 hover:bg-green-100',
            ].join(' ')}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

    </div>
  )
}
