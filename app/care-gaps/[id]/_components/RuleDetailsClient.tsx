'use client'

import { useState, useCallback, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useRulePackage } from '@/hooks/useRulePackage'
import { useParameterState } from '@/hooks/useParameterState'

import { RuleHeader } from '@/components/rule-details/RuleHeader'
import { RuleTabs } from '@/components/rule-details/RuleTabs'
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

type TabKey = 'summary' | 'eligibility' | 'exclusions' | 'temporal' | 'data' | 'evidence' | 'logic'

const TAB_ORDER: TabKey[] = ['summary', 'eligibility', 'exclusions', 'temporal', 'data', 'evidence', 'logic']

export function RuleDetailsClient({ careGapId }: RuleDetailsClientProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('summary')

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const tabBarRef = useRef<HTMLDivElement>(null)

  const {
    rulePackage,
    isLoading,
    isExporting,
    error,
    exportPackage,
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

  function handleTabChange(key: string) {
    const tab = key as TabKey
    setActiveTab(tab)
  }

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

        {/* Header card */}
        <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 shrink-0">
          <RuleHeader
            rulePackage={rulePackage}
            isExporting={isExporting}
            onExport={exportPackage}
          />
        </div>

        {/* Sticky tab bar */}
        <div ref={tabBarRef} className="rounded-xl border border-gray-200 bg-white shrink-0 sticky top-0 z-10 shadow-sm">
          <div className="px-2">
            <RuleTabs activeTab={activeTab} onChange={handleTabChange} />
          </div>
        </div>

        {/* Show active card and all cards after it */}
        <div className="space-y-3 shrink-0">
          {TAB_ORDER.slice(TAB_ORDER.indexOf(activeTab)).map((key) => (
            <div key={key}>
              {key === 'summary'     && <ClinicalSummaryCard clinicalSummary={rulePackage.clinicalSummary} />}
              {key === 'eligibility' && <EligibilityCriteriaCard criteria={rulePackage.eligibilityCriteria} />}
              {key === 'exclusions'  && <ExclusionCriteriaCard criteria={rulePackage.exclusionCriteria} />}
              {key === 'temporal'    && <TemporalRulesTable rules={rulePackage.temporalRules} />}
              {key === 'data'        && <DataRequirementsCard requirements={rulePackage.dataRequirements} />}
              {key === 'evidence'    && <EvidenceMappingCard mappings={rulePackage.evidenceMapping} />}
              {key === 'logic'       && <RuleLogicCard steps={rulePackage.ruleLogic} />}
            </div>
          ))}
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
