interface CommercialSummaryPanelProps {
  hcpsWithOveruse: number
  territoriesCovered: number
  avgHcpsPerMsl: number
}

export function CommercialSummaryPanel({
  hcpsWithOveruse, territoriesCovered, avgHcpsPerMsl,
}: CommercialSummaryPanelProps) {
  const rows: { label: string; value: string; subtext?: string }[] = [
    { label: 'HCPs Treating Composite Overusers', value: hcpsWithOveruse.toLocaleString() },
    { label: 'Territories Covered',               value: territoriesCovered.toLocaleString() },
    { label: 'Estimated MSL Requirement',          value: territoriesCovered.toLocaleString(), subtext: '1 MSL per Territory' },
    { label: 'Average HCPs per MSL',               value: avgHcpsPerMsl.toFixed(1) },
  ]

  return (
    <div className="flex h-full flex-col justify-center rounded-xl border border-gray-200 bg-white p-2.5 shadow-sm">
      <p className="mb-0.5 px-1 text-[10px] font-semibold uppercase tracking-wider leading-none text-gray-400">
        Commercial Summary
      </p>
      <div className="divide-y divide-gray-100">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-2 px-1 py-1">
            <div className="min-w-0">
              <p className="truncate text-[11px] leading-tight text-gray-600">{r.label}</p>
              {r.subtext && <p className="leading-tight text-[9px] text-gray-400">{r.subtext}</p>}
            </div>
            <span className="shrink-0 text-sm font-bold leading-none tabular-nums text-gray-900">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
