import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1">
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <span key={index} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronRight className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
            )}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-sm text-[#6B7280] hover:text-gray-700 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-sm font-medium text-[#1D3F8F]' : 'text-sm text-[#6B7280]'}>
                {item.label}
              </span>
            )}
          </span>
        )
      })}
    </nav>
  )
}
