import Link from 'next/link'
import { ArrowRight, Activity } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils/cn'
import type { CareGap, CareGapStatus } from '@/lib/types'

interface CareGapCardProps {
  careGap: CareGap
}

const STATUS_VARIANT: Record<CareGapStatus, 'draft' | 'active' | 'archived'> = {
  Draft: 'draft',
  Active: 'active',
  Archived: 'archived',
}

const THERAPY_AREA_COLORS: Record<string, string> = {
  Gastroenterology: 'bg-teal-50 text-teal-700 border-teal-200',
  Endocrinology:    'bg-amber-50 text-amber-700 border-amber-200',
  Rheumatology:     'bg-violet-50 text-violet-700 border-violet-200',
  Oncology:         'bg-rose-50 text-rose-700 border-rose-200',
  Cardiology:       'bg-red-50 text-red-700 border-red-200',
  Neurology:        'bg-blue-50 text-blue-700 border-blue-200',
  Pulmonology:      'bg-sky-50 text-sky-700 border-sky-200',
}

const THERAPY_AREA_ACCENT: Record<string, string> = {
  Gastroenterology: 'before:bg-teal-400',
  Endocrinology:    'before:bg-amber-400',
  Rheumatology:     'before:bg-violet-400',
  Oncology:         'before:bg-rose-400',
  Cardiology:       'before:bg-red-400',
  Neurology:        'before:bg-blue-400',
  Pulmonology:      'before:bg-sky-400',
}

export function CareGapCard({ careGap }: CareGapCardProps) {
  const taColor = THERAPY_AREA_COLORS[careGap.therapyArea] ?? 'bg-gray-50 text-gray-700 border-gray-200'
  const accentColor = THERAPY_AREA_ACCENT[careGap.therapyArea] ?? 'before:bg-gray-300'

  return (
    <Link
      href={`/care-gaps/${careGap.id}`}
      className={cn(
        'group relative flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200',
        'hover:border-[#004FBA]/30 hover:shadow-md hover:-translate-y-0.5',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004FBA]',
        'before:absolute before:left-0 before:top-4 before:bottom-4 before:w-[3px] before:rounded-r-full before:opacity-0 before:transition-opacity group-hover:before:opacity-100',
        accentColor,
      )}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium', taColor)}>
            {careGap.therapyArea}
          </span>
          <Badge variant={STATUS_VARIANT[careGap.status]}>{careGap.status}</Badge>
        </div>
        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-100 bg-gray-50 transition-all group-hover:border-[#004FBA]/30 group-hover:bg-[#004FBA]/5">
          <ArrowRight className="h-3 w-3 text-gray-300 transition-colors group-hover:text-[#004FBA]" aria-hidden="true" />
        </div>
      </div>

      {/* Title */}
      <h3 className="mt-3 text-sm font-semibold text-gray-900 leading-snug group-hover:text-[#004FBA] transition-colors">
        {careGap.title}
      </h3>

      {/* Description */}
      <p className="mt-1.5 text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">
        {careGap.description}
      </p>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <Activity className="h-3.5 w-3.5 text-[#004FBA]" aria-hidden="true" />
          <span className="text-xs font-bold text-[#004FBA]">{careGap.evidenceConfidence}%</span>
          <span className="text-xs text-gray-400">confidence</span>
        </div>
        <span className="text-[10px] font-medium text-gray-400 bg-gray-50 border border-gray-100 rounded-full px-2 py-0.5">
          {careGap.guidelineVersion}
        </span>
      </div>
    </Link>
  )
}
