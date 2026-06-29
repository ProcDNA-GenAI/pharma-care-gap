'use client'

import { useState, useEffect, useCallback } from 'react'
import type { RulePackage, ImpactSummary, ParameterValues, ParameterDiff } from '@/lib/types'
import { getRulePackage, recalculatePopulation, exportRules } from '@/lib/api'

interface UseRulePackageReturn {
  rulePackage: RulePackage | null
  isLoading: boolean
  isRecalculating: boolean
  isExporting: boolean
  error: string | null
  impactSummary: ImpactSummary | null
  recalculate: (params: ParameterValues, defaults: ParameterValues, diffs: ParameterDiff[]) => Promise<void>
  exportPackage: () => Promise<void>
}

export function useRulePackage(careGapId: string): UseRulePackageReturn {
  const [rulePackage, setRulePackage] = useState<RulePackage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRecalculating, setIsRecalculating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [impactSummary, setImpactSummary] = useState<ImpactSummary | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    getRulePackage(careGapId)
      .then((result) => {
        if (cancelled) return
        if (result.success) {
          setRulePackage(result.data)
          setImpactSummary(result.data.impactSummary)
        } else {
          setError(result.error.message)
        }
        setIsLoading(false)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Failed to load rule package')
        setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [careGapId])

  const recalculate = useCallback(
    async (params: ParameterValues, defaults: ParameterValues, diffs: ParameterDiff[]) => {
      setIsRecalculating(true)
      const result = await recalculatePopulation({ careGapId, parameters: params, defaults, diffs })
      if (result.success) {
        setImpactSummary(result.data)
      }
      setIsRecalculating(false)
    },
    [careGapId],
  )

  const exportPackage = useCallback(async () => {
    setIsExporting(true)
    await exportRules(careGapId)
    setIsExporting(false)
  }, [careGapId])

  return {
    rulePackage,
    isLoading,
    isRecalculating,
    isExporting,
    error,
    impactSummary,
    recalculate,
    exportPackage,
  }
}
