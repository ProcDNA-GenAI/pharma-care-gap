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
          { label: 'Care Gap Context and Input', href: '/care-gaps' },
          { label: 'Care Gap Rule Summary', href: `/care-gaps/${params.id}` },
          { label: 'Care Gap Insights' },
        ]}
      />
      <main className="flex-1 pl-0 pr-5 py-5 w-full">
        <InsightsClient careGapId={params.id} />
      </main>
    </div>
  )
}
