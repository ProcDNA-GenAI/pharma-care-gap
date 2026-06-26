'use client'

import { useEffect } from 'react'
import { AppHeader } from '@/components/layout'
import { Button } from '@/components/ui'
import { AlertTriangle } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function RuleDetailsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <AppHeader
        breadcrumbs={[
          { label: 'Care Gap Rule Authoring', href: '/care-gaps' },
          { label: 'Rule Details' },
        ]}
      />
      <main className="flex flex-1 flex-col items-center justify-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">Failed to load rule details</h2>
          <p className="mt-1 text-sm text-gray-500">An error occurred while loading the rule package.</p>
        </div>
        <Button onClick={reset} variant="secondary" size="sm">Retry</Button>
      </main>
    </div>
  )
}
