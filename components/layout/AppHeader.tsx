import Link from 'next/link'
import Image from 'next/image'
import { HelpCircle } from 'lucide-react'
import { Breadcrumb } from './Breadcrumb'

interface AppHeaderProps {
  breadcrumbs?: Array<{ label: string; href?: string }>
}

export function AppHeader({ breadcrumbs }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center border-b border-gray-100 bg-white px-6 shadow-sm">

      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 shrink-0 mr-4">
        <Image src="/ProcDNA_Logo.svg" alt="ProcDNA" width={80} height={46} priority className="py-1" />
        <div className="h-6 w-px bg-gray-200" aria-hidden="true" />
        <Image src="/abbvie_logo.png" alt="AbbVie" width={72} height={46} />
      </Link>

      {/* Vertical rule */}
      <div className="h-6 w-px bg-gray-200 mr-4 shrink-0" />

      {/* App name + breadcrumb */}
      <div className="flex flex-col justify-center min-w-0">
        {breadcrumbs ? (
          <Breadcrumb items={breadcrumbs} />
        ) : (
          <span className="text-sm font-semibold text-gray-800 truncate">Care Gap Rule Authoring</span>
        )}
      </div>

      {/* Right section */}
      <div className="ml-auto flex items-center gap-2">

        {/* Help */}
        <button
          aria-label="Help"
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <HelpCircle className="h-[18px] w-[18px]" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200 mx-1 shrink-0" />

        {/* User pill */}
        <div className="flex items-center gap-2.5 cursor-pointer group rounded-full px-2 py-1.5 hover:bg-gray-50 transition-colors">
          {/* Avatar */}
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white select-none ring-2 ring-white shadow-sm"
            style={{ backgroundColor: '#004FBA' }}
          >
            AD
          </div>
          {/* Name + role */}
          <div className="hidden sm:flex flex-col leading-none">
            <span className="text-xs font-semibold text-gray-800">Admin</span>
            <span className="text-[10px] text-gray-400 mt-0.5">Therapy Area Scientist</span>
          </div>
          {/* Caret */}
          <svg className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600 transition-colors" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </header>
  )
}
