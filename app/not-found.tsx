import Link from 'next/link'
import { Button } from '@/components/ui'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50">
      <p className="text-6xl font-bold text-gray-200">404</p>
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900">Page not found</h2>
        <p className="mt-1 text-sm text-gray-500">The page you are looking for does not exist.</p>
      </div>
      <Link href="/care-gaps">
        <Button variant="primary" size="sm">Go to Care Gaps</Button>
      </Link>
    </div>
  )
}
