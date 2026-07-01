'use client'

import { cn } from '@/lib/utils/cn'
import { ChevronDown } from 'lucide-react'

export interface SelectOption {
  label: string
  value: string | number
}

interface SelectProps {
  options: SelectOption[]
  value: string | number
  onChange: (value: string | number) => void
  className?: string
  ariaLabel?: string
  /** Stretches the select to fill its container instead of the compact 64px default */
  fullWidth?: boolean
}

export function Select({ options, value, onChange, className, ariaLabel, fullWidth }: SelectProps) {
  return (
    <div className={cn('relative inline-flex items-center', fullWidth && 'flex w-full', className)}>
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => {
          const raw = e.target.value
          const asNum = Number(raw)
          onChange(isNaN(asNum) ? raw : asNum)
        }}
        className={cn(
          'appearance-none rounded-lg border border-gray-300 bg-white py-1 pl-2.5 pr-7 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 cursor-pointer',
          fullWidth ? 'w-full' : 'w-16',
        )}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-1.5 h-3.5 w-3.5 text-gray-400" />
    </div>
  )
}
