'use client'

import { useState } from 'react'
import { LayoutDashboard, LayoutList, GitCompare, LucideIcon, X, GitBranch } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export type InsightsView = 'overview' | 'detailed' | 'scenario-comparison'

interface InsightsSideNavProps {
  active: InsightsView
  onChange: (view: InsightsView) => void
  scenarioCount: number
}

const ITEMS: { key: InsightsView; label: string; icon: LucideIcon }[] = [
  { key: 'overview',              label: 'Overview',          icon: LayoutDashboard },
  { key: 'detailed',              label: 'Detailed View',     icon: LayoutList },
  { key: 'scenario-comparison',   label: 'Scenario\nComparison', icon: GitCompare },
]

export function InsightsSideNav({ active, onChange, scenarioCount }: InsightsSideNavProps) {
  const [showLockedPopup, setShowLockedPopup] = useState(false)
  const isComparisonLocked = scenarioCount < 2

  return (
    <>
      <nav className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-20 border-r border-gray-200 bg-white px-1.5 pt-3 pb-3">
        <ul className="space-y-2">
          {ITEMS.map(({ key, label, icon: Icon }) => {
            const isActive = active === key
            const isLocked = key === 'scenario-comparison' && isComparisonLocked

            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => {
                    if (isLocked) {
                      setShowLockedPopup(true)
                    } else {
                      onChange(key)
                    }
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  title={isLocked ? 'Create at least 2 scenarios in Overview to unlock' : label}
                  className={cn(
                    'flex w-full flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-center text-xs font-medium transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004FBA]',
                    isLocked
                      ? 'cursor-pointer text-gray-300'
                      : isActive
                        ? 'bg-brand-50 text-[#004FBA]'
                        : 'bg-transparent text-gray-700 hover:bg-gray-50',
                  )}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center" aria-hidden="true">
                    <Icon
                      size={20}
                      strokeWidth={2}
                      className={
                        isLocked
                          ? 'text-gray-300'
                          : isActive
                            ? 'text-[#2563EB]'
                            : 'text-[#6B7280]'
                      }
                    />
                  </div>
                  <span className="leading-tight whitespace-pre-line">{label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* ── Locked popup modal ── */}
      {showLockedPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setShowLockedPopup(false)}
        >
          <div
            className="relative mx-4 w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header stripe */}
            <div className="bg-gradient-to-r from-[#1D3F8F] to-[#2563EB] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
                  <GitBranch className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Scenario Comparison</p>
                  <p className="text-[11px] text-blue-200">Locked</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-5 py-5">
              <p className="text-sm font-semibold text-[#111827]">
                At least 2 scenarios required
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-[#6B7280]">
                Create and save a minimum of{' '}
                <span className="font-semibold text-[#1D3F8F]">2 scenarios</span>{' '}
                in the <span className="font-semibold text-[#1D3F8F]">Overview</span> page
                to unlock the Scenario Comparison view.
              </p>

              {/* Progress indicator */}
              <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#374151]">Scenarios saved</span>
                  <span className="text-[11px] font-bold text-[#1D3F8F]">
                    {scenarioCount} / 2 minimum
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#1D3F8F] to-[#2563EB] transition-all duration-500"
                    style={{ width: `${Math.min((scenarioCount / 2) * 100, 100)}%` }}
                  />
                </div>
                <p className="mt-1.5 text-[10px] text-[#9CA3AF]">
                  {scenarioCount === 0
                    ? 'No scenarios yet — go to Overview → Parameters to save one.'
                    : scenarioCount === 1
                      ? 'One more scenario needed. Go to Overview → Parameters.'
                      : 'Minimum reached!'}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-2 border-t border-gray-100 px-5 py-4">
              <button
                type="button"
                onClick={() => setShowLockedPopup(false)}
                className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLockedPopup(false)
                  onChange('overview')
                }}
                className="flex-1 rounded-lg bg-gradient-to-r from-[#1D3F8F] to-[#2563EB] py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
              >
                Go to Overview
              </button>
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowLockedPopup(false)}
              className="absolute right-3 top-3 rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
