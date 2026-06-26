'use client'

import { Search } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface CareGapSearchBarProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function CareGapSearchBar({ value, onChange, className }: CareGapSearchBarProps) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search care gaps by name, therapy area, or description..."
        className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      />
    </div>
  )
}
