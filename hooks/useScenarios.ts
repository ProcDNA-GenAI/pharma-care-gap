'use client'

import { useState, useEffect } from 'react'
import type { ParameterValues } from '@/lib/types'

export interface Scenario {
  id: string
  name: string
  parameters: ParameterValues
}

export function useScenarios(careGapId?: string) {
  const [scenarios, setScenarios] = useState<Scenario[]>([])

  const key = careGapId ? `ruleScenarios_${careGapId}` : 'ruleScenarios'

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored) {
        setScenarios(JSON.parse(stored))
      } else {
        setScenarios([])
      }
    } catch {
      // Ignore
    }
  }, [key])

  const saveScenario = (parameters: ParameterValues): { success: boolean; error?: string } => {
    if (scenarios.length >= 3) {
      return { success: false, error: 'You can only save up to 3 scenarios.' }
    }
    const newScenario: Scenario = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Scenario ${scenarios.length + 1}`,
      parameters: { ...parameters },
    }
    const newScenarios = [...scenarios, newScenario]
    setScenarios(newScenarios)
    localStorage.setItem(key, JSON.stringify(newScenarios))
    return { success: true }
  }

  const deleteScenario = (id: string) => {
    const newScenarios = scenarios.filter((s) => s.id !== id)
    setScenarios(newScenarios)
    localStorage.setItem(key, JSON.stringify(newScenarios))
  }

  return { scenarios, saveScenario, deleteScenario }
}
