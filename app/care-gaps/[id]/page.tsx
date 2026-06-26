import { AppHeader } from '@/components/layout'
import { RuleDetailsClient } from './_components/RuleDetailsClient'

interface PageProps {
  params: { id: string }
}

export default function RuleDetailsPage({ params }: PageProps) {
  return (
    <div className="flex h-screen flex-col bg-gray-50 overflow-hidden">
      <AppHeader
        breadcrumbs={[
          { label: 'Care Gap Rule Authoring', href: '/care-gaps' },
          { label: 'Rule Details' },
        ]}
      />
      {/* h-screen minus header (h-16 = 64px) */}
      <main className="flex-1 overflow-hidden px-5 py-3 max-w-screen-2xl mx-auto w-full">
        <RuleDetailsClient careGapId={params.id} />
      </main>
    </div>
  )
}
