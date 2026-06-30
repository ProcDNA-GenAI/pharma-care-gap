'use client'

import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { InsightsFilters, InsightsTab } from '@/lib/types/insights'

interface FilterBarProps {
  filters: InsightsFilters
  territories: string[]
  specialties: string[]
  activeTab: InsightsTab
  onChange: (filters: InsightsFilters) => void
}

export function FilterBar({ filters, territories, specialties, activeTab, onChange }: FilterBarProps) {
  const hasFilter = filters.search !== '' || filters.territory !== 'All' || filters.specialty !== 'All'

  const searchPlaceholder =
    activeTab === 'hcp'       ? 'Search by NPI or name…' :
    activeTab === 'account'   ? 'Search by account…' :
    activeTab === 'geography' ? 'Search by territory…' :
    'Search by age band…'

  return (
    <div className="flex flex-wrap items-center gap-2">

      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
        <input
          type="search"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder={searchPlaceholder}
          className="h-8 w-56 rounded-lg border border-gray-200 bg-white pl-8 pr-3 text-xs text-gray-800 placeholder:text-gray-400 focus:border-[#004FBA] focus:outline-none focus:ring-2 focus:ring-[#004FBA]/15"
        />
      </div>

      {/* Territory */}
      <select
        value={filters.territory}
        onChange={(e) => onChange({ ...filters, territory: e.target.value })}
        className="h-8 rounded-lg border border-gray-200 bg-white px-2.5 text-xs text-gray-700 focus:border-[#004FBA] focus:outline-none focus:ring-2 focus:ring-[#004FBA]/15"
      >
        <option value="All">All Territories</option>
        {territories.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>

      {/* Specialty (only relevant for HCP tab) */}
      {activeTab === 'hcp' && (
        <select
          value={filters.specialty}
          onChange={(e) => onChange({ ...filters, specialty: e.target.value })}
          className="h-8 rounded-lg border border-gray-200 bg-white px-2.5 text-xs text-gray-700 focus:border-[#004FBA] focus:outline-none focus:ring-2 focus:ring-[#004FBA]/15"
        >
          <option value="All">All Specialties</option>
          {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      )}

      {/* Clear */}
      {hasFilter && (
        <button
          onClick={() => onChange({ search: '', territory: 'All', specialty: 'All' })}
          className={cn(
            'flex h-8 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-500 hover:text-gray-700 transition-colors',
          )}
        >
          <X className="h-3.5 w-3.5" />
          Clear all
        </button>
      )}
    </div>
  )
}
