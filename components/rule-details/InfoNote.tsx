import { Info } from 'lucide-react'

interface InfoNoteProps {
  title: string
  lines: string[]
}

export function InfoNote({ title, lines }: InfoNoteProps) {
  return (
    <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-blue-700">{title}</p>
        <div className="mt-1 space-y-1">
          {lines.map((line, idx) => (
            <p key={idx} className="text-sm leading-relaxed text-blue-700/80">{line}</p>
          ))}
        </div>
      </div>
    </div>
  )
}
