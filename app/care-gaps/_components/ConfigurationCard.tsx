'use client'

import { LucideIcon, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export interface ConfigurationCardProps {
  icon: LucideIcon
  title: string
  description: string
  completed: boolean
  required: boolean
  onClick: () => void
}

export function ConfigurationCard({
  icon: Icon, title, description, completed, required, onClick,
}: ConfigurationCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex h-full min-h-[168px] flex-col items-start rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition-all',
        'hover:-translate-y-0.5 hover:border-[#004FBA]/30 hover:shadow-lg',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004FBA] focus-visible:ring-offset-2',
      )}
    >
      <div
        className={cn(
          'mb-4 flex h-11 w-11 items-center justify-center rounded-xl transition-colors',
          completed ? 'bg-emerald-50 text-emerald-600' : 'bg-[#004FBA]/10 text-[#004FBA]',
        )}
      >
        <Icon className="h-5.5 w-5.5" aria-hidden="true" />
      </div>

      <h3 className="text-base font-bold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm leading-snug text-gray-500">{description}</p>

      <div className="mt-auto flex w-full items-center justify-between pt-4">
        {completed ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            Completed
          </span>
        ) : (
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
              required ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-500',
            )}
          >
            {required ? 'Required' : 'Optional'}
          </span>
        )}
        <span className="text-xs font-medium text-gray-300 transition-colors group-hover:text-[#004FBA]">
          Configure &rarr;
        </span>
      </div>
    </button>
  )
}
