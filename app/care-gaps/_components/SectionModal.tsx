'use client'

import { useEffect, ReactNode } from 'react'
import { LucideIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export interface SectionModalProps {
  open: boolean
  icon: LucideIcon
  title: string
  subtitle: string
  onClose: () => void
  onSave: () => void
  saveDisabled?: boolean
  children: ReactNode
}

export function SectionModal({
  open, icon: Icon, title, subtitle, onClose, onSave, saveDisabled, children,
}: SectionModalProps) {
  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-start gap-3 border-b border-gray-100 px-7 pt-6 pb-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#004FBA]/10 text-[#004FBA]">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-gray-900">{title}</h2>
            <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004FBA]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-7 py-6">
          {children}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-7 py-5">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004FBA] rounded"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saveDisabled}
            className={cn(
              'rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004FBA] focus-visible:ring-offset-2',
              saveDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-90 active:scale-[0.98]',
            )}
            style={{ backgroundColor: '#004FBA' }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
