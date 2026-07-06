interface CommercialSummaryPanelProps {
  hcpsWithOveruse: number
  territoriesCovered: number
  avgHcpsPerMsl: number
}

export function CommercialSummaryPanel({
  hcpsWithOveruse, territoriesCovered, avgHcpsPerMsl,
}: CommercialSummaryPanelProps) {
  const rows: { label: string; value: string; subtext?: string }[] = [
    { label: 'HCPs with Potential OCS Overuse', value: hcpsWithOveruse.toLocaleString() },
    { label: 'MSL Territories Represented',     value: territoriesCovered.toLocaleString() },
    { label: 'Estimated MSL Coverage Need',      value: territoriesCovered.toLocaleString(), subtext: '1 MSL per Territory' },
    { label: 'Average HCPs per MSL',             value: avgHcpsPerMsl.toFixed(1) },
  ]

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold text-[#1D3F8F]">
        Commercial Impact Summary
      </h3>
      <div className="divide-y divide-gray-100">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-2 py-2">
            <div className="min-w-0">
              <p className="truncate text-xs text-[#4B5563]">{r.label}</p>
              {r.subtext && <p className="leading-tight text-[10px] text-[#6B7280]">{r.subtext}</p>}
            </div>
            <span className="shrink-0 text-sm font-semibold leading-none tabular-nums text-gray-900">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
