'use client'

import { useCallback, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useRulePackage } from '@/hooks/useRulePackage'
import { useParameterState } from '@/hooks/useParameterState'

import { ClinicalSummaryCard } from '@/components/rule-details/ClinicalSummaryCard'
import { EligibilityCriteriaCard } from '@/components/rule-details/EligibilityCriteriaCard'
import { ExclusionCriteriaCard } from '@/components/rule-details/ExclusionCriteriaCard'
import { TemporalRulesTable } from '@/components/rule-details/TemporalRulesTable'
import { DataRequirementsCard } from '@/components/rule-details/DataRequirementsCard'
import { EvidenceMappingCard } from '@/components/rule-details/EvidenceMappingCard'
import { RuleLogicCard } from '@/components/rule-details/RuleLogicCard'
import { ConfigurableParametersPanel } from '@/components/rule-details/ConfigurableParametersPanel'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { AlertTriangle } from 'lucide-react'
import type { ParameterValues } from '@/lib/types'

interface RuleDetailsClientProps {
  careGapId: string
}


export function RuleDetailsClient({ careGapId }: RuleDetailsClientProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const tabBarRef = useRef<HTMLDivElement>(null)

  const {
    rulePackage,
    isLoading,
    error,
  } = useRulePackage(careGapId)

  const { parameters, setParameter } = useParameterState()

  const handleParameterChange = useCallback(
    (key: keyof ParameterValues, value: ParameterValues[keyof ParameterValues]) => {
      setParameter(key as keyof ParameterValues, value as ParameterValues[typeof key])
    },
    [setParameter],
  )

  const router = useRouter()
  const [isGeneratingInsights, startInsightsTransition] = useTransition()

  const handleGenerateInsights = useCallback(() => {
    startInsightsTransition(async () => {
      await new Promise((r) => setTimeout(r, 1500))
      if (typeof window !== 'undefined') {
        localStorage.setItem('ruleParameters', JSON.stringify(parameters))
      }
      router.push(`/care-gaps/${careGapId}/insights`)
    })
  }, [careGapId, router, parameters])

  if (isLoading) {
    return (
      <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3 overflow-y-auto pr-1">
          <SkeletonCard className="h-24" />
          <SkeletonCard className="h-10" />
          <SkeletonCard className="h-48" />
        </div>
        <SkeletonCard className="h-full" />
      </div>
    )
  }

  if (error || !rulePackage) {
    return (
      <EmptyState
        icon={<AlertTriangle className="h-6 w-6" />}
        title="Failed to load rule package"
        description={error ?? 'An unexpected error occurred.'}
      />
    )
  }

  return (
    <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]" style={{ maxHeight: 'calc(100vh - 64px - 24px)' }}>

      {/* ── Left panel ── */}
      <div className="flex min-w-0 flex-col gap-3 overflow-y-auto pr-1 scrollbar-hide" ref={scrollContainerRef}>

        {/* Section heading */}
        <div className="rounded-xl border border-gray-200 bg-white px-5 py-3 shrink-0 sticky top-0 z-10 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900">Business Rules</h2>
        </div>

        {/* All cards always visible */}
        <div className="space-y-3 shrink-0">
          <ClinicalSummaryCard clinicalSummary={rulePackage.clinicalSummary} />
          <EligibilityCriteriaCard criteria={rulePackage.eligibilityCriteria} />
          <ExclusionCriteriaCard criteria={rulePackage.exclusionCriteria} />
          <TemporalRulesTable rules={rulePackage.temporalRules} />
          <DataRequirementsCard requirements={rulePackage.dataRequirements} />
          <EvidenceMappingCard mappings={rulePackage.evidenceMapping} />
          <RuleLogicCard steps={rulePackage.ruleLogic} />
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="overflow-y-auto scrollbar-hide pb-2">
        <ConfigurableParametersPanel
          parameters={parameters}
          onParameterChange={handleParameterChange}
          onGenerateInsights={handleGenerateInsights}
          isGeneratingInsights={isGeneratingInsights}
        />
      </div>
    </div>
  )
}
