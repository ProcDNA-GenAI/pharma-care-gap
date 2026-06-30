import { AppHeader } from '@/components/layout'
import { InsightsClient } from './_components/InsightsClient'

interface PageProps {
  params: { id: string }
}

export default function InsightsPage({ params }: PageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <AppHeader
        breadcrumbs={[
          { label: 'Care Gap Rule Authoring', href: '/care-gaps' },
          { label: 'Rule Details', href: `/care-gaps/${params.id}` },
          { label: 'Aggregated Insights' },
        ]}
      />
      <main className="flex-1 px-5 py-5 max-w-screen-2xl mx-auto w-full">
        <InsightsClient />
      </main>
    </div>
  )
}
