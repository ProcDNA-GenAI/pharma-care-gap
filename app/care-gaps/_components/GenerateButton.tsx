'use client'

import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export interface GenerateButtonProps {
  disabled: boolean
  onClick: () => void
}

export function GenerateButton({ disabled, onClick }: GenerateButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'sticky bottom-4 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-semibold text-white shadow-lg transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004FBA] focus-visible:ring-offset-2',
        disabled ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-90 hover:scale-[1.003] active:scale-[0.997]',
      )}
      style={{ backgroundColor: '#004FBA' }}
    >
      Generate Recommended Metrics &amp; Business Rules for Care Gap Quantification
      <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
    </button>
  )
}
