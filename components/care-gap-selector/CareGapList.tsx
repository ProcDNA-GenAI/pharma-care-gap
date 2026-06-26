import { CareGapCard } from './CareGapCard'
import { CareGapListEmpty } from './CareGapListEmpty'
import { SkeletonCard } from '@/components/ui/Skeleton'
import type { CareGap } from '@/lib/types'

interface CareGapListProps {
  careGaps: CareGap[]
  isLoading: boolean
  searchQuery: string
}

export function CareGapList({ careGaps, isLoading, searchQuery }: CareGapListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (careGaps.length === 0) {
    return <CareGapListEmpty searchQuery={searchQuery} />
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {careGaps.map((gap) => (
        <CareGapCard key={gap.id} careGap={gap} />
      ))}
    </div>
  )
}
