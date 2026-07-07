'use client'

import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export interface GenerateButtonProps {
  disabled: boolean
  onClick: () => void
  label?: string
  sticky?: boolean
}

export function GenerateButton({
  disabled,
  onClick,
  label = 'Generate Recommended Evidence Sources',
  sticky = true,
}: GenerateButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        sticky && 'sticky bottom-4',
        'flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-semibold text-white shadow-lg transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004FBA] focus-visible:ring-offset-2',
        disabled ? 'cursor-not-allowed opacity-40' : 'hover:scale-[1.003] hover:opacity-90 active:scale-[0.997]',
      )}
      style={{ backgroundColor: '#004FBA' }}
    >
      {label}
      <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
    </button>
  )
}
