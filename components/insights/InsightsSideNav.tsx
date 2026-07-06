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
    <nav className="w-20 shrink-0 self-stretch border-r border-gray-200 bg-white px-1.5 pt-4 pb-3">
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
                  'flex min-h-[52px] w-full flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 text-center text-[10px] font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004FBA]',
                  isActive
                    ? 'bg-brand-50 text-[#004FBA]'
                    : 'bg-transparent text-gray-700 hover:bg-gray-50',
                )}
              >
                <Icon
                  size={20}
                  strokeWidth={2}
                  className={cn('shrink-0', isActive ? 'text-[#2563EB]' : 'text-[#6B7280]')}
                  aria-hidden="true"
                />
                <span className="leading-tight">{label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
