'use client'

import { cn } from '@/lib/utils/cn'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  ariaLabel?: string
  size?: 'sm' | 'md'
}

export function Toggle({ checked, onChange, disabled = false, ariaLabel, size = 'sm' }: ToggleProps) {
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
