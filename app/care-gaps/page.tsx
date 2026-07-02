import { AppHeader } from '@/components/layout'
import { AnalysisWizard } from './_components/AnalysisWizard'

export default function CareGapsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <AppHeader breadcrumbs={[{ label: 'Care Gap Context and Input' }]} />
      <main className="flex flex-1 justify-center px-6 py-10">
        <AnalysisWizard />
      </main>
    </div>
  )
}
