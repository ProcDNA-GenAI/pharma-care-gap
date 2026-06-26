import { Toggle } from '@/components/ui/Toggle'
import { Tooltip } from '@/components/ui/Tooltip'
import { Info } from 'lucide-react'

interface ParameterToggleFieldProps {
  label: string
  tooltip?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function ParameterToggleField({
  label,
  tooltip,
  checked,
  onChange,
}: ParameterToggleFieldProps) {
  return (
    <div className="flex items-center justify-between gap-2 py-1.5">
      <div className="flex items-center gap-1 min-w-0">
        <span className="text-xs text-gray-700 truncate">{label}</span>
        {tooltip && (
          <Tooltip content={tooltip}>
            <Info className="h-3 w-3 text-gray-400 cursor-help shrink-0" aria-label="Parameter info" />
          </Tooltip>
        )}
      </div>
      <Toggle checked={checked} onChange={onChange} ariaLabel={`Exclude: ${label}`} />
    </div>
  )
}
