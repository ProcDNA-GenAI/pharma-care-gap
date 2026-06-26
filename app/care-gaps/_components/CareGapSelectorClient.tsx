'use client'

import { useCareGaps } from '@/hooks/useCareGaps'
import { CareGapList } from '@/components/care-gap-selector/CareGapList'
import { EmptyState } from '@/components/ui/EmptyState'
import { AlertTriangle, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { TherapyArea, CareGapStatus } from '@/lib/types'

const THERAPY_AREA_DOT: Record<string, string> = {
  Gastroenterology: 'bg-teal-400',
  Endocrinology:    'bg-amber-400',
  Rheumatology:     'bg-violet-400',
  Pulmonology:      'bg-sky-400',
  Cardiology:       'bg-red-400',
  Oncology:         'bg-rose-400',
  Neurology:        'bg-blue-400',
}

const STATUS_DOT: Record<string, string> = {
  Active:   'bg-emerald-400',
  Draft:    'bg-amber-400',
  Archived: 'bg-gray-400',
}

export function CareGapSelectorClient() {
  const {
    filteredCareGaps,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedTherapyArea,
    setSelectedTherapyArea,
    selectedStatus,
    setSelectedStatus,
    therapyAreas,
    statuses,
    careGaps,
  } = useCareGaps()

  const hasActiveFilter = selectedTherapyArea !== 'All' || selectedStatus !== 'All' || searchQuery.trim() !== ''

  function clearAll() {
    setSearchQuery('')
    setSelectedTherapyArea('All')
    setSelectedStatus('All')
  }

  if (error) {
    return (
      <EmptyState
        icon={<AlertTriangle className="h-6 w-6" />}
        title="Failed to load care gaps"
        description={error}
      />
    )
  }

  return (
    <div className="flex gap-5">

      {/* ── Left filter panel ── */}
      <aside className="w-56 shrink-0">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">

          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Filters</span>
            {hasActiveFilter && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1 text-[10px] font-medium text-[#004FBA] hover:underline"
              >
                <X className="h-3 w-3" />
                Clear all
              </button>
            )}
          </div>

          {/* Search inside filter panel */}
          <div className="px-3 py-3 border-b border-gray-100">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Care Gap</p>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name…"
                className="h-8 w-full rounded-lg border border-gray-200 bg-gray-50 pl-7 pr-3 text-xs text-gray-800 placeholder:text-gray-400 focus:border-[#004FBA] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004FBA]/15"
              />
            </div>
          </div>

          {/* Therapy Area filter */}
          <div className="px-3 py-3 border-b border-gray-100">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Therapy Area</p>
            <div className="space-y-0.5">
              {(isLoading ? (['All'] as const) : therapyAreas).map((area) => (
                <button
                  key={area}
                  onClick={() => setSelectedTherapyArea(area as TherapyArea | 'All')}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors text-left',
                    selectedTherapyArea === area
                      ? 'bg-[#004FBA]/8 text-[#004FBA] font-medium'
                      : 'text-gray-600 hover:bg-gray-50',
                  )}
                >
                  {area !== 'All' && (
                    <span className={cn('h-2 w-2 shrink-0 rounded-full', THERAPY_AREA_DOT[area] ?? 'bg-gray-300')} />
                  )}
                  {area === 'All' && <span className="h-2 w-2 shrink-0 rounded-full bg-gray-300" />}
                  <span className="truncate">{area}</span>
                  {!isLoading && (
                    <span className="ml-auto text-[10px] text-gray-400 shrink-0">
                      {area === 'All'
                        ? careGaps.length
                        : careGaps.filter((g) => g.therapyArea === area).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Status filter */}
          <div className="px-3 py-3">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Status</p>
            <div className="space-y-0.5">
              {(isLoading ? (['All'] as const) : statuses).map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status as CareGapStatus | 'All')}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors text-left',
                    selectedStatus === status
                      ? 'bg-[#004FBA]/8 text-[#004FBA] font-medium'
                      : 'text-gray-600 hover:bg-gray-50',
                  )}
                >
                  {status !== 'All' && (
                    <span className={cn('h-2 w-2 shrink-0 rounded-full', STATUS_DOT[status] ?? 'bg-gray-300')} />
                  )}
                  {status === 'All' && <span className="h-2 w-2 shrink-0 rounded-full bg-gray-300" />}
                  <span className="truncate">{status}</span>
                  {!isLoading && (
                    <span className="ml-auto text-[10px] text-gray-400 shrink-0">
                      {status === 'All'
                        ? careGaps.length
                        : careGaps.filter((g) => g.status === status).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 min-w-0">
        {/* Result count */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {isLoading ? '–' : filteredCareGaps.length} of {isLoading ? '–' : careGaps.length} care gaps
          </span>
        </div>

        <CareGapList
          careGaps={filteredCareGaps}
          isLoading={isLoading}
          searchQuery={searchQuery}
        />
      </div>

    </div>
  )
}
