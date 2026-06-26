import { SearchX } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'

interface CareGapListEmptyProps {
  searchQuery: string
}

export function CareGapListEmpty({ searchQuery }: CareGapListEmptyProps) {
  return (
    <EmptyState
      icon={<SearchX className="h-6 w-6" />}
      title={searchQuery ? 'No matching care gaps' : 'No care gaps available'}
      description={
        searchQuery
          ? `No care gaps match "${searchQuery}". Try adjusting your search or filter.`
          : 'There are currently no care gaps configured in this environment.'
      }
    />
  )
}
