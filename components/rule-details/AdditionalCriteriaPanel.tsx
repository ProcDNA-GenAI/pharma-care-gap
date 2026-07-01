'use client'

import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { ConfigurableParametersPanel, GroupHeading } from './ConfigurableParametersPanel'
import { Select } from '@/components/ui/Select'
import type { SelectOption } from '@/components/ui/Select'
import type { ParameterValues } from '@/lib/types'

interface AdditionalCriteriaPanelProps {
  parameters: ParameterValues
  onParameterChange: (key: keyof ParameterValues, value: ParameterValues[keyof ParameterValues]) => void
}

const COMPOSITE_OPTIONS: SelectOption[] = [
  { label: 'Any_1', value: 'Any_1' },
  { label: 'Any_2', value: 'Any_2' },
  { label: 'All_3', value: 'All_3' },
]

export function AdditionalCriteriaPanel({ parameters, onParameterChange }: AdditionalCriteriaPanelProps) {
  const [compositeLogic, setCompositeLogic] = useState<string | number>('Any_1')

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-1 flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-[#004FBA]" aria-hidden="true" />
        <h3 className="text-base font-semibold text-gray-900">Additional Criteria</h3>
      </div>
      <p className="mb-2 text-sm text-gray-400">Fine-tune the thresholds used across the recommended metrics</p>

      <ConfigurableParametersPanel
        parameters={parameters}
        onParameterChange={onParameterChange}
        hideHeader
        hideActions
        bare
      />

      {/* Composite Overuse Flag — kept inside Additional Criteria, not a separate card */}
      <div className="border-t border-gray-100">
        <GroupHeading>Composite Overuse Flag</GroupHeading>
        <div className="flex items-center gap-2 py-1.5">
          <span className="flex-1 min-w-0 truncate text-xs text-gray-700"># of metrics indicating overuse of OCS</span>
          <div className="w-[100px] shrink-0">
            <Select
              options={COMPOSITE_OPTIONS}
              value={compositeLogic}
              onChange={setCompositeLogic}
              ariaLabel="# of metrics indicating overuse of OCS"
              fullWidth
            />
          </div>
        </div>
      </div>
    </div>
  )
}
