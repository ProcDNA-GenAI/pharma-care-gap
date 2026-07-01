export interface ProgressHeaderProps {
  completed: number
  total: number
}

export function ProgressHeader({ completed, total }: ProgressHeaderProps) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">Configuration Progress</span>
        <span className="text-sm font-medium text-gray-400">
          {completed} / {total} sections completed
        </span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-gray-100"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #004FBA 0%, #2563eb 100%)' }}
        />
      </div>
    </div>
  )
}
