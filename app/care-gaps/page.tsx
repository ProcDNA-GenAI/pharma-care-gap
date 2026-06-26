import { AppHeader } from '@/components/layout'
import { CareGapUploadClient } from './_components/CareGapUploadClient'

export default function CareGapsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <AppHeader breadcrumbs={[{ label: 'Care Gap Rule Authoring' }]} />
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <CareGapUploadClient />
      </main>
    </div>
  )
}
