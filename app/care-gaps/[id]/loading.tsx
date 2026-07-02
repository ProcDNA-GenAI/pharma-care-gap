import { AppHeader } from '@/components/layout'
import { SkeletonCard } from '@/components/ui/Skeleton'

export default function RuleDetailsLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <AppHeader
        breadcrumbs={[
          { label: 'Care Gap Context and Input', href: '/care-gaps' },
          { label: 'Rule Details' },
        ]}
      />
      <main className="flex-1 px-6 py-6 max-w-screen-2xl mx-auto w-full">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <SkeletonCard className="h-28" />
            <SkeletonCard className="h-12" />
            <SkeletonCard className="h-64" />
            <SkeletonCard className="h-48" />
          </div>
          <SkeletonCard className="h-[600px]" />
        </div>
      </main>
    </div>
  )
}
