import { Select } from '@/components/ui/Select'
import { Tooltip } from '@/components/ui/Tooltip'
import { Info } from 'lucide-react'
import type { SelectOption } from '@/components/ui/Select'

interface ParameterFieldProps {
  label: string
  tooltip?: string
  value: number
  onChange: (value: number) => void
  options: SelectOption[]
  unit?: string
}

export function ParameterField({
  label,
  tooltip,
  value,
  onChange,
  options,
  unit,
}: ParameterFieldProps) {
  return (
    <div className="flex items-center gap-2 py-1.5">
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <span className="text-xs text-[#4B5563] truncate">{label}</span>
        {tooltip && (
          <Tooltip content={tooltip}>
            <Info className="h-3 w-3 text-gray-400 cursor-help shrink-0" aria-label="Parameter info" />
          </Tooltip>
        )}
      </div>
      <div className="flex items-center gap-1.5 w-[100px] shrink-0">
        <Select
          options={options}
          value={value}
          onChange={(v) => onChange(v as number)}
          ariaLabel={label}
        />
        <span className="text-xs text-[#6B7280] w-10 shrink-0 text-left">{unit ?? ''}</span>
      </div>
    </div>
  )
}
