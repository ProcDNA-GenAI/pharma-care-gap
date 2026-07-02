import { AppHeader } from '@/components/layout'
import { RuleDetailsClient } from './_components/RuleDetailsClient'

interface PageProps {
  params: { id: string }
}

export default function RuleDetailsPage({ params }: PageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <AppHeader
        breadcrumbs={[
          { label: 'Care Gap Context and Input', href: '/care-gaps' },
          { label: 'Business Rules Configuration' },
        ]}
      />
      <main className="mx-auto w-full max-w-screen-2xl flex-1 px-8 py-8">
        <RuleDetailsClient careGapId={params.id} />
      </main>
    </div>
  )
}
