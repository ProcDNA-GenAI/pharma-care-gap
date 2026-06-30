import { UserCheck, MapPin, Users, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { SummaryInsights } from '@/lib/types/insights'

function riskBadge(rate: number) {
  if (rate >= 30) return { label: 'High Risk',   cls: 'bg-red-100 text-red-700'    }
  if (rate >= 20) return { label: 'Medium Risk',  cls: 'bg-amber-100 text-amber-700' }
  return           { label: 'Low Risk',    cls: 'bg-emerald-100 text-emerald-700' }
}

interface InsightTileProps {
  icon: React.ReactNode
  label: string
  heading: string
  subheading: string
  rate: number
  footer: string
}

function InsightTile({ icon, label, heading, subheading, rate, footer }: InsightTileProps) {
  const badge = riskBadge(rate)
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EEF3FF] text-[#004FBA]">
          {icon}
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</span>
      </div>
      <div>
        <p className="text-sm font-bold text-gray-900 leading-snug">{heading}</p>
        <p className="mt-0.5 text-xs text-gray-500">{subheading}</p>
      </div>
      <div className="flex items-center justify-between">
        <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold', badge.cls)}>
          {rate}% M7 Rate
        </span>
        <span className="text-[10px] text-gray-400">{footer}</span>
      </div>
    </div>
  )
}

interface Props {
  insights: SummaryInsights
}

export function SummaryInsightCards({ insights }: Props) {
  const { highestRiskHcp, highestBurdenTerritory, highestRiskAgeBand, flaggedHcpCount, totalHcpCount, flaggedHcpRate } = insights

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
        <AlertTriangle className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
        <span className="text-xs font-semibold text-gray-800 uppercase tracking-wide">Key Insights</span>
        <span className="text-[10px] text-gray-400 ml-1">— highest-burden hotspots in this cohort</span>
      </div>
      <div className="grid grid-cols-2 gap-px bg-gray-100 lg:grid-cols-4">
        {/* Highest Risk HCP */}
        <div className="bg-white p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EEF3FF] text-[#004FBA]">
              <UserCheck className="h-3.5 w-3.5" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Highest Risk HCP</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{highestRiskHcp.name}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{highestRiskHcp.specialty}</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
              {highestRiskHcp.m7Rate}% M7 Rate
            </span>
            <span className="text-[10px] text-gray-400">{highestRiskHcp.totalPatients.toLocaleString()} patients</span>
          </div>
        </div>

        {/* Highest Burden Territory */}
        <div className="bg-white p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EEF3FF] text-[#004FBA]">
              <MapPin className="h-3.5 w-3.5" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Highest Burden Territory</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{highestBurdenTerritory.territory}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Region: {highestBurdenTerritory.region}</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
              {highestBurdenTerritory.m7Rate}% M7 Rate
            </span>
            <span className="text-[10px] text-gray-400">{highestBurdenTerritory.totalPatients.toLocaleString()} patients</span>
          </div>
        </div>

        {/* Highest Risk Age Band */}
        <div className="bg-white p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EEF3FF] text-[#004FBA]">
              <Users className="h-3.5 w-3.5" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Highest Risk Age Band</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{highestRiskAgeBand.ageBand} years</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Gender: {highestRiskAgeBand.gender}</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
              {highestRiskAgeBand.m7Rate}% M7 Rate
            </span>
            <span className="text-[10px] text-gray-400">{highestRiskAgeBand.totalPatients.toLocaleString()} patients</span>
          </div>
        </div>

        {/* HCPs Flagged */}
        <div className="bg-white p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <AlertTriangle className="h-3.5 w-3.5" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">HCPs Flagged</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 tabular-nums">{flaggedHcpCount} <span className="text-sm font-normal text-gray-400">/ {totalHcpCount}</span></p>
            <p className="text-[10px] text-gray-400 mt-0.5">NPIs with M7 rate ≥ 20%</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
              {flaggedHcpRate}% flagged rate
            </span>
            <span className="text-[10px] text-gray-400">threshold: ≥20%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
