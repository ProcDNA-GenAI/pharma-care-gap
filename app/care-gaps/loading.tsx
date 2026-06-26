import { SkeletonCard } from '@/components/ui/Skeleton'
import { AppHeader } from '@/components/layout'

export default function CareGapsLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <AppHeader breadcrumbs={[{ label: 'Care Gap Rule Authoring' }]} />
      <main className="flex-1 px-6 py-8 max-w-screen-xl mx-auto w-full">
        <div className="mb-8">
          <div className="h-6 w-48 rounded-md bg-gray-200 animate-pulse" />
          <div className="mt-1.5 h-4 w-80 rounded-md bg-gray-200 animate-pulse" />
        </div>
        <div className="mb-5 h-10 w-full max-w-md rounded-lg bg-gray-200 animate-pulse" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </main>
    </div>
  )
}
