'use client'

import { useState } from 'react'
import {
  Download, RefreshCw,
  Users, Activity, Clock, FlaskConical, Repeat2, BarChart2,
  Calendar, Shield, Target,
} from 'lucide-react'
import type { Scenario } from '@/hooks/useScenarios'
import { cn } from '@/lib/utils/cn'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function compositeLabel(logic: string) {
  if (logic === 'Any_2') return '≥ 2 Criteria'
  if (logic === 'All_3') return 'All Criteria'
  return '≥ 1 Criteria'
}

// ─── Scenario accent colours ───────────────────────────────────────────────────

const ACCENT = [
  { header: 'text-[#2563EB]', bar: 'bg-blue-500',   pill: 'bg-blue-50 text-[#1D4ED8] ring-1 ring-blue-200' },
  { header: 'text-[#7C3AED]', bar: 'bg-violet-600', pill: 'bg-purple-50 text-[#6D28D9] ring-1 ring-purple-200' },
  { header: 'text-[#0891B2]', bar: 'bg-cyan-500',   pill: 'bg-cyan-50 text-[#0E7490] ring-1 ring-cyan-200' },
]

const LABELS = ['A', 'B', 'C']

// ─── Section definitions ───────────────────────────────────────────────────────

const SECTION = {
  ibd: {
    label: 'IBD Cohort Definition',
    Icon: Users,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    rowBg: '#FFF7ED',
    textColor: '#C2410C',
    accent: '#EA580C',
  },
  chronic: {
    label: 'Chronic OCS Exposure',
    Icon: Calendar,
    iconBg: 'bg-gray-200',
    iconColor: 'text-gray-600',
    rowBg: '#F3F4F6',
    textColor: '#111827',
    accent: '#4B5563',
  },
  highDose: {
    label: 'High-Dose OCS Exposure',
    Icon: Shield,
    iconBg: 'bg-gray-200',
    iconColor: 'text-gray-600',
    rowBg: '#F3F4F6',
    textColor: '#111827',
    accent: '#4B5563',
  },
  recurrent: {
    label: 'Recurrent OCS Courses',
    Icon: RefreshCw,
    iconBg: 'bg-gray-200',
    iconColor: 'text-gray-600',
    rowBg: '#F3F4F6',
    textColor: '#111827',
    accent: '#4B5563',
  },
  composite: {
    label: 'Composite Care Gap Rule',
    Icon: Target,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    rowBg: '#ECFDF5',
    textColor: '#065F46',
    accent: '#059669',
  },
} as const

// ─── KPI config ───────────────────────────────────────────────────────────────

const KPI_CONFIG = [
  { key: 'eligibleIbd',  label: 'Eligible IBD Cohort',        icon: Users,        iconBg: 'bg-blue-50',   iconColor: 'text-[#2563EB]' },
  { key: 'potentialOcs', label: 'Potential OCS Overuse',      icon: Activity,     iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
  { key: 'chronicOcs',   label: 'Chronic OCS Exposure',       icon: Clock,        iconBg: 'bg-green-50',  iconColor: 'text-green-600' },
  { key: 'highDose',     label: 'High-Dose OCS Exposure',     icon: FlaskConical, iconBg: 'bg-orange-50', iconColor: 'text-orange-600' },
  { key: 'recurrent',   label: 'Recurrent OCS Courses',       icon: Repeat2,      iconBg: 'bg-blue-50',   iconColor: 'text-blue-500' },
  { key: 'composite',   label: 'Composite Care Gap Patients', icon: BarChart2,    iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
]

function deriveKpis(_scenario: Scenario, index: number) {
  const base = { eligibleIbd: 16032, potentialOcs: 8787, chronicOcs: 5579, highDose: 5615, recurrent: 5584, composite: 10276 }
  const factor = 1 - index * 0.035
  return {
    eligibleIbd:  Math.round(base.eligibleIbd  * factor),
    potentialOcs: Math.round(base.potentialOcs * factor),
    chronicOcs:   Math.round(base.chronicOcs   * factor),
    highDose:     Math.round(base.highDose      * (1 - index * 0.01)),
    recurrent:    Math.round(base.recurrent     * factor),
    composite:    Math.round(base.composite     * factor),
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

type SectionKey = keyof typeof SECTION

function SectionHeader({ sectionKey, count }: { sectionKey: SectionKey; count: number }) {
  const s = SECTION[sectionKey]
  const { Icon } = s
  return (
    <tr>
      <td
        colSpan={1 + count}
        style={{
          background: s.rowBg,
          borderTop: '1px solid #D1D5DB',
          borderBottom: '1px solid #D1D5DB',
          borderLeft: `4px solid ${s.accent}`,
          padding: '10px 16px',
        }}
      >
        <div className="flex items-center gap-3">
          <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', s.iconBg)}>
            <Icon className={cn('h-4 w-4', s.iconColor)} />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: s.textColor }}>
            {s.label}
          </span>
        </div>
      </td>
    </tr>
  )
}

function ParamRow({ label, values, count }: { label: string; values: (string | number)[]; count: number }) {
  return (
    <tr className="bg-white transition-colors hover:bg-blue-50/20">
      <td className="py-3 pl-10 pr-4 text-sm text-[#374151]" style={{ borderBottom: '1px solid #E5E7EB' }}>
        {label}
      </td>
      {values.slice(0, count).map((v, i) => (
        <td
          key={i}
          className="py-3 px-4 text-center"
          style={{ borderBottom: '1px solid #E5E7EB', borderLeft: '1px solid #D1D5DB' }}
        >
          <span className={cn('inline-flex items-center justify-center min-w-[72px] px-3 py-1 rounded-full text-sm font-bold', ACCENT[i].pill)}>
            {v}
          </span>
        </td>
      ))}
    </tr>
  )
}

function KpiRow({
  icon: Icon, iconBg, iconColor, label, values, count, stripe,
}: {
  icon: React.ElementType; iconBg: string; iconColor: string
  label: string; values: number[]; count: number; stripe?: boolean
}) {
  return (
    <tr className={cn('transition-colors hover:bg-blue-50/20', stripe ? 'bg-gray-50/50' : 'bg-white')}
      style={{ borderBottom: '1px solid #E5E7EB' }}>
      <td className="py-3.5 pl-5 pr-4">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
            <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
          </div>
          <span className="text-sm font-medium text-[#111827]">{label}</span>
        </div>
      </td>
      {values.slice(0, count).map((v, i) => (
        <td key={i} className="py-3.5 px-4 text-center" style={{ borderLeft: '1px solid #D1D5DB' }}>
          <span className={cn('inline-flex items-center justify-center min-w-[80px] px-3 py-1 rounded-full text-sm font-bold tabular-nums', ACCENT[i].pill)}>
            {v.toLocaleString()}
          </span>
        </td>
      ))}
    </tr>
  )
}

function TableHead({ colLabel, scenarios, count }: { colLabel: string; scenarios: Scenario[]; count: number }) {
  return (
    <thead>
      <tr className="bg-gray-50" style={{ borderBottom: '1px solid #D1D5DB' }}>
        <th className="py-3.5 pl-5 pr-4 text-sm font-semibold text-[#374151]">{colLabel}</th>
        {scenarios.slice(0, count).map((s, i) => (
          <th key={s.id} className="py-3.5 px-4 text-center" style={{ borderLeft: '1px solid #D1D5DB' }}>
            <div className="flex flex-col items-center gap-1.5">
              <span className={cn('inline-block h-[3px] w-12 rounded-full', ACCENT[i].bar)} />
              <span className={cn('text-sm font-bold', ACCENT[i].header)}>Scenario {LABELS[i]}</span>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ScenarioComparisonProps {
  scenarios: Scenario[]
}

export function ScenarioComparison({ scenarios }: ScenarioComparisonProps) {
  const [lastRefreshed] = useState(() => new Date())
  const count = Math.min(scenarios.length, 3)
  const kpiData = scenarios.slice(0, 3).map((s, i) => deriveKpis(s, i))

  const paramRows = {
    ibd: [
      { label: 'Look Forward Period (months)',           values: scenarios.slice(0, 3).map((s) => s.parameters.measurementMonths) },
      { label: 'Minimum IBD Diagnoses',                  values: scenarios.slice(0, 3).map((s) => s.parameters.ibdMinClaims) },
      { label: 'Minimum Days Between Diagnoses (days)',  values: scenarios.slice(0, 3).map((s) => s.parameters.ibdGapDays) },
    ],
    chronic: [
      { label: 'Minimum Cumulative Days (days)',         values: scenarios.slice(0, 3).map((s) => s.parameters.ocsDurationThreshold) },
    ],
    highDose: [
      { label: 'Consecutive Days at High Dose (days)',   values: scenarios.slice(0, 3).map((s) => s.parameters.highDoseDurationDays) },
      { label: 'Prednisone-Equivalent Threshold (mg/day)', values: scenarios.slice(0, 3).map((s) => s.parameters.highDoseMg) },
      { label: 'Cumulative Prednisone-Equivalent (mg)', values: scenarios.slice(0, 3).map((s) => s.parameters.highDoseCumulativeMg) },
    ],
    recurrent: [
      { label: 'Minimum Gap Between Courses (days)',     values: scenarios.slice(0, 3).map((s) => s.parameters.courseGapDays) },
    ],
    composite: [
      { label: 'Minimum Number of Care Gap Criteria Met', values: scenarios.slice(0, 3).map((s) => compositeLabel(s.parameters.compositeLogic)) },
    ],
  }

  return (
    <div className="flex min-h-0 flex-col gap-5 px-1">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1D3F8F]">Care Gap Scenario Comparison</h1>
          <p className="mt-0.5 text-sm text-[#4B5563]">
            Compare the performance of key care gap metrics across your saved scenarios.
          </p>
        </div>
        <button className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50">
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      {/* ── Table 1: Business Rule Configuration ── */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm" style={{ border: '1px solid #D1D5DB' }}>
        <div className="px-5 py-3.5" style={{ borderBottom: '1px solid #D1D5DB' }}>
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#374151]">
            Care Gap Business Rule Configuration
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left table-fixed">
            <colgroup>
              <col style={{ width: '42%' }} />
              {Array.from({ length: count }).map((_, i) => (
                <col key={i} style={{ width: `${58 / count}%` }} />
              ))}
            </colgroup>
            <TableHead colLabel="Parameter" scenarios={scenarios} count={count} />
            <tbody>
              <SectionHeader sectionKey="ibd" count={count} />
              {paramRows.ibd.map((r) => (
                <ParamRow key={r.label} label={r.label} values={r.values} count={count} />
              ))}

              <SectionHeader sectionKey="chronic" count={count} />
              {paramRows.chronic.map((r) => (
                <ParamRow key={r.label} label={r.label} values={r.values} count={count} />
              ))}

              <SectionHeader sectionKey="highDose" count={count} />
              {paramRows.highDose.map((r) => (
                <ParamRow key={r.label} label={r.label} values={r.values} count={count} />
              ))}

              <SectionHeader sectionKey="recurrent" count={count} />
              {paramRows.recurrent.map((r) => (
                <ParamRow key={r.label} label={r.label} values={r.values} count={count} />
              ))}

              <SectionHeader sectionKey="composite" count={count} />
              {paramRows.composite.map((r) => (
                <ParamRow key={r.label} label={r.label} values={r.values} count={count} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Table 2: KPI Comparison ── */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm" style={{ border: '1px solid #D1D5DB' }}>
        <div className="px-5 py-3.5" style={{ borderBottom: '1px solid #D1D5DB' }}>
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#374151]">KPI Comparison</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left table-fixed">
            <colgroup>
              <col style={{ width: '42%' }} />
              {Array.from({ length: count }).map((_, i) => (
                <col key={i} style={{ width: `${58 / count}%` }} />
              ))}
            </colgroup>
            <TableHead colLabel="KPI" scenarios={scenarios} count={count} />
            <tbody>
              {KPI_CONFIG.map((kpi, idx) => (
                <KpiRow
                  key={kpi.key}
                  icon={kpi.icon}
                  iconBg={kpi.iconBg}
                  iconColor={kpi.iconColor}
                  label={kpi.label}
                  values={kpiData.map((d) => d[kpi.key as keyof typeof d])}
                  count={count}
                  stripe={idx % 2 === 1}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
        <p className="text-[11px] text-[#6B7280]">
          ⓘ All scenarios are based on the same IBD cohort definition and data refresh.
        </p>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[#6B7280]">
            Last compared on{' '}
            {lastRefreshed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            {' • '}
            {lastRefreshed.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-[#2563EB] px-3 py-1.5 text-xs font-semibold text-[#2563EB] transition-colors hover:bg-blue-50">
            <RefreshCw className="h-3 w-3" />
            Refresh Comparison
          </button>
        </div>
      </div>

    </div>
  )
}
