'use client'

import { cn } from '@/lib/utils/cn'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  ariaLabel?: string
  size?: 'sm' | 'md'
  showLabel?: boolean
}

export function Toggle({ checked, onChange, disabled = false, ariaLabel, size = 'sm', showLabel = false }: ToggleProps) {
  if (showLabel) {
    return (
      <button
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'inline-flex h-5 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-2 text-[10px] font-semibold leading-none transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50',
          checked ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-500',
        )}
      >
        {!checked && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-gray-400" />}
        <span>{checked ? 'Include' : 'Exclude'}</span>
        {checked && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-white" />}
      </button>
    )
  }

  const isSm = size === 'sm'
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        isSm ? 'h-4 w-8' : 'h-6 w-11',
        checked ? 'bg-brand-600' : 'bg-gray-200',
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
          isSm ? 'h-3 w-3' : 'h-5 w-5',
          checked ? (isSm ? 'translate-x-4' : 'translate-x-5') : 'translate-x-0',
        )}
      />
    </button>
  )
}
