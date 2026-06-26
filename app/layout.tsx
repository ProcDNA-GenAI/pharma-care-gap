import type { Metadata } from 'next'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/dm-serif-display/400.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'Care Gap Rule Authoring | ProcDNA',
  description: 'AI-assisted evidence-grounded business rule generation for clinical care gaps.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        {children}
      </body>
    </html>
  )
}
