'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Trash2 } from 'lucide-react'
import type { Scenario } from '@/hooks/useScenarios'

interface ScenarioDropdownProps {
  scenarios: Scenario[]
  activeId: string
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}

export function ScenarioDropdown({ scenarios, activeId, onSelect, onDelete }: ScenarioDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const activeScenario = scenarios.find((s) => s.id === activeId)
  const buttonLabel = activeScenario ? activeScenario.name : 'Select Scenario...'

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex h-9 w-full items-center justify-between rounded-lg border border-gray-200 bg-white pl-3 pr-2.5 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50 focus:border-[#004FBA] focus:outline-none focus:ring-2 focus:ring-[#004FBA]/20"
      >
        <span className="truncate">{buttonLabel}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-1 w-full min-w-[200px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1 duration-100">
          <div className="max-h-60 overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                onSelect('')
                setIsOpen(false)
              }}
              className="flex w-full px-3 py-2 text-left text-xs font-medium text-gray-400 hover:bg-gray-50"
            >
              Select Scenario...
            </button>
            {scenarios.map((s) => (
              <div
                key={s.id}
                className={`group flex items-center justify-between px-3 py-1.5 text-sm transition-colors hover:bg-gray-50 ${
                  s.id === activeId ? 'bg-brand-50/50 font-semibold text-brand-600' : 'text-gray-700'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    onSelect(s.id)
                    setIsOpen(false)
                  }}
                  className="flex-1 truncate text-left text-xs"
                >
                  {s.name}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(s.id)
                  }}
                  className="ml-2 rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Delete Scenario"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
