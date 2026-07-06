import { LayoutDashboard, LayoutList, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export type InsightsView = 'overview' | 'detailed'

interface InsightsSideNavProps {
  active: InsightsView
  onChange: (view: InsightsView) => void
}

const ITEMS: { key: InsightsView; label: string; icon: LucideIcon }[] = [
  { key: 'overview', label: 'Overview',      icon: LayoutDashboard },
  { key: 'detailed', label: 'Detailed View', icon: LayoutList },
]

export function InsightsSideNav({ active, onChange }: InsightsSideNavProps) {
  return (
    <nav className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-20 border-r border-gray-200 bg-white px-1.5 pt-3 pb-3">
      <ul className="space-y-2">
        {ITEMS.map(({ key, label, icon: Icon }) => {
          const isActive = active === key
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => onChange(key)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex w-full flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-center text-xs font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004FBA]',
                  isActive
                    ? 'bg-brand-50 text-[#004FBA]'
                    : 'bg-transparent text-gray-700 hover:bg-gray-50',
                )}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center" aria-hidden="true">
                  <Icon
                    size={20}
                    strokeWidth={2}
                    className={isActive ? 'text-[#2563EB]' : 'text-[#6B7280]'}
                  />
                </div>
                <span className="leading-tight">{label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
