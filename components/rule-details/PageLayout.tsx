import { ReactNode } from 'react'

interface PageLayoutProps {
  left: ReactNode
  right: ReactNode
}

/**
 * Desktop: 70/30 two-column split.
 * Tablet/mobile: single column — right (parameters) stacks below left (rules) in DOM order.
 */
export function PageLayout({ left, right }: PageLayoutProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[7fr_3fr] lg:items-start">
      <div className="min-w-0">{left}</div>
      <div className="min-w-0 lg:sticky lg:top-6">{right}</div>
    </div>
  )
}
