'use client'

import { useState } from 'react'
import {
  Download, RefreshCw,
  Users, Activity, Clock, FlaskConical, Repeat2, BarChart2,
} from 'lucide-react'
import type { Scenario } from '@/hooks/useScenarios'

import { cn } from '@/lib/utils/cn'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function compositeLabel(logic: string) {
  if (logic === 'Any_2') return '≥ 2 Criteria'
  if (logic === 'All_3') return 'All Criteria'
  return '≥ 1 Criteria'
}

// ─── Column accent colours (Scenario A = baseline = blue, B = purple, C = teal) ─
const ACCENT = [
  { header: 'text-[#2563EB]', value: 'text-[#2563EB]' },  // A – blue
  { header: 'text-[#7C3AED]', value: 'text-[#7C3AED]' },  // B – purple
  { header: 'text-[#0891B2]', value: 'text-[#0891B2]' },  // C – teal
]

const LABELS = ['A', 'B', 'C']

// ─── KPI config ───────────────────────────────────────────────────────────────
const KPI_CONFIG = [
  { key: 'eligibleIbd',  label: 'Eligible IBD Cohort',           icon: Users,        iconBg: 'bg-blue-50',   iconColor: 'text-[#2563EB]' },
  { key: 'potentialOcs', label: 'Potential OCS Overuse',         icon: Activity,     iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
  { key: 'chronicOcs',   label: 'Chronic OCS Exposure',          icon: Clock,        iconBg: 'bg-green-50',  iconColor: 'text-green-600' },
  { key: 'highDose',     label: 'High-Dose OCS Exposure',        icon: FlaskConical, iconBg: 'bg-orange-50', iconColor: 'text-orange-600' },
  { key: 'recurrent',   label: 'Recurrent OCS Courses',          icon: Repeat2,      iconBg: 'bg-blue-50',   iconColor: 'text-blue-500' },
  { key: 'composite',   label: 'Composite Care Gap Patients',    icon: BarChart2,    iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
]

// Deterministic but varied fake KPIs per scenario so numbers look real
function deriveKpis(scenario: Scenario, index: number) {
  const base = {
    eligibleIbd:  16032,
    potentialOcs: 8787,
    chronicOcs:   5579,
    highDose:     5615,
    recurrent:    5584,
    composite:    10276,
  }
  // Each subsequent scenario is slightly smaller (–3 to –9 % per step)
  const factor = 1 - index * 0.035
  return {
    eligibleIbd:  Math.round(base.eligibleIbd  * factor),
    potentialOcs: Math.round(base.potentialOcs * factor),
    chronicOcs:   Math.round(base.chronicOcs   * factor),
    highDose:     Math.round(base.highDose      * (1 - index * 0.01)),  // smaller delta
    recurrent:    Math.round(base.recurrent     * factor),
    composite:    Math.round(base.composite     * factor),
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <tr className="bg-gray-50">
      <td colSpan={100} className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">
        {children}
      </td>
    </tr>
  )
}

function ParamRow({
  label,
  values,
  count,
  highlighted,
}: {
  label: string
  values: (string | number)[]
  count: number
  highlighted?: boolean
}) {
  return (
    <tr
      className={cn(
        "transition-colors",
        highlighted ? "bg-gray-100/80" : "hover:bg-blue-50/30"
      )}
    >
      <td
        className={cn(
          "py-2.5 pl-8 pr-4 text-xs text-[#374151] border-t",
          highlighted ? "border-gray-200" : "border-gray-100"
        )}
      >
        {label}
      </td>
      {values.slice(0, count).map((v, i) => (
        <td
          key={i}
          className={cn(
            "py-2.5 px-4 text-center text-sm font-medium border-t",
            ACCENT[i].value,
            highlighted ? "border-gray-200" : "border-gray-100"
          )}
        >
          {v}
        </td>
      ))}
    </tr>
  )
}

function KpiRow({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  values,
  count,
}: {
  icon: React.ElementType
  iconBg: string
  iconColor: string
  label: string
  values: number[]
  count: number
}) {
  return (
    <tr className="border-t border-gray-100 hover:bg-blue-50/30 transition-colors">
      <td className="py-3 pl-5 pr-4">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
            <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
          </div>
          <span className="text-xs font-medium text-[#111827]">{label}</span>
        </div>
      </td>
      {values.slice(0, count).map((v, i) => (
        <td key={i} className={`py-3 px-4 text-center text-sm font-medium tabular-nums ${ACCENT[i].value}`}>
          {v.toLocaleString()}
        </td>
      ))}
    </tr>
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

  // ── Parameter rows ─────────────────────────────────────────────────────────
  const paramRows = {
    ibd: [
      {
        label: 'Look Forward Period (months)',
        values: scenarios.slice(0, 3).map((s) => s.parameters.measurementMonths),
      },
      {
        label: 'Minimum IBD Diagnoses',
        values: scenarios.slice(0, 3).map((s) => s.parameters.ibdMinClaims),
      },
      {
        label: 'Minimum Days Between Diagnoses (days)',
        values: scenarios.slice(0, 3).map((s) => s.parameters.ibdGapDays),
      },
    ],
    chronic: [
      {
        label: 'Minimum Cumulative Days (days)',
        values: scenarios.slice(0, 3).map((s) => s.parameters.ocsDurationThreshold),
      },
    ],
    highDose: [
      {
        label: 'Consecutive Days at High Dose (days)',
        values: scenarios.slice(0, 3).map((s) => s.parameters.highDoseDurationDays),
      },
      {
        label: 'Prednisone-Equivalent Threshold (mg/day)',
        values: scenarios.slice(0, 3).map((s) => s.parameters.highDoseMg),
      },
      {
        label: 'Cumulative Prednisone-Equivalent (mg)',
        values: scenarios.slice(0, 3).map((s) => s.parameters.highDoseCumulativeMg),
      },
    ],
    recurrent: [
      {
        label: 'Minimum Gap Between Courses (days)',
        values: scenarios.slice(0, 3).map((s) => s.parameters.courseGapDays),
      },
    ],
    composite: [
      {
        label: 'Minimum Number of Care Gap Criteria Met',
        values: scenarios.slice(0, 3).map((s) => compositeLabel(s.parameters.compositeLogic)),
      },
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
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#374151]">
            Care Gap Business Rule Configuration
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left table-fixed">
            <colgroup>
              <col style={{ width: '40%' }} />
              {Array.from({ length: count }).map((_, i) => (
                <col key={i} style={{ width: `${60 / count}%` }} />
              ))}
            </colgroup>
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 pl-5 pr-4 text-xs font-semibold text-[#111827]">Parameter</th>
                {scenarios.slice(0, 3).map((s, i) => (
                  <th key={s.id} className={`py-3 px-4 text-center text-xs font-bold ${ACCENT[i].header}`}>
                    Scenario {LABELS[i]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <SectionLabel>IBD Cohort Definition</SectionLabel>
              {paramRows.ibd.map((r) => (
                <ParamRow key={r.label} label={r.label} values={r.values} count={count} highlighted />
              ))}

              <SectionLabel>Chronic OCS Exposure</SectionLabel>
              {paramRows.chronic.map((r) => (
                <ParamRow key={r.label} label={r.label} values={r.values} count={count} />
              ))}

              <SectionLabel>High-Dose OCS Exposure</SectionLabel>
              {paramRows.highDose.map((r) => (
                <ParamRow key={r.label} label={r.label} values={r.values} count={count} />
              ))}

              <SectionLabel>Recurrent OCS Courses</SectionLabel>
              {paramRows.recurrent.map((r) => (
                <ParamRow key={r.label} label={r.label} values={r.values} count={count} />
              ))}

              <SectionLabel>Composite Care Gap Rule</SectionLabel>
              {paramRows.composite.map((r) => (
                <ParamRow key={r.label} label={r.label} values={r.values} count={count} highlighted />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Table 2: KPI Comparison ── */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#374151]">KPI Comparison</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left table-fixed">
            <colgroup>
              <col style={{ width: '40%' }} />
              {Array.from({ length: count }).map((_, i) => (
                <col key={i} style={{ width: `${60 / count}%` }} />
              ))}
            </colgroup>
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 pl-5 pr-4 text-xs font-semibold text-[#111827]">KPI</th>
                {scenarios.slice(0, 3).map((s, i) => (
                  <th key={s.id} className={`py-3 px-4 text-center text-xs font-bold ${ACCENT[i].header}`}>
                    Scenario {LABELS[i]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {KPI_CONFIG.map((kpi) => (
                <KpiRow
                  key={kpi.key}
                  icon={kpi.icon}
                  iconBg={kpi.iconBg}
                  iconColor={kpi.iconColor}
                  label={kpi.label}
                  values={kpiData.map((d) => d[kpi.key as keyof typeof d])}
                  count={count}
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
