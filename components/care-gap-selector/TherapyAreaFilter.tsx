'use client'

import { cn } from '@/lib/utils/cn'
import type { TherapyArea } from '@/lib/types'

interface TherapyAreaFilterProps {
  areas: Array<TherapyArea | 'All'>
  selected: TherapyArea | 'All'
  onChange: (area: TherapyArea | 'All') => void
  className?: string
}

export function TherapyAreaFilter({ areas, selected, onChange, className }: TherapyAreaFilterProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)} role="group" aria-label="Filter by therapy area">
      {areas.map((area) => (
        <button
          key={area}
          onClick={() => onChange(area)}
          className={cn(
            'rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
            selected === area
              ? 'bg-brand-600 text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600',
          )}
        >
          {area}
        </button>
      ))}
    </div>
  )
}
