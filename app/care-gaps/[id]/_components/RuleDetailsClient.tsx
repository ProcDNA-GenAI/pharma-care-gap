'use client'

import { useState, useCallback, useRef, useEffect, useTransition } from 'react'
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
  const scrollingByClick = useRef(false)

  const {
    rulePackage,
    isLoading,
    isExporting,
    error,
    impactSummary,
    exportPackage,
  } = useRulePackage(careGapId)

  const { parameters, setParameter } = useParameterState()

  const sectionRefs = useRef<Record<TabKey, HTMLDivElement | null>>({
    summary: null, eligibility: null, exclusions: null,
    temporal: null, data: null, evidence: null, logic: null,
  })
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const tabBarRef = useRef<HTMLDivElement>(null)

  // Scroll-spy: as user scrolls manually, highlight the tab whose section is at the top
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || !rulePackage) return

    function onScroll() {
      if (scrollingByClick.current) return
      const tabBarHeight = tabBarRef.current?.offsetHeight ?? 44
      const containerTop = container!.getBoundingClientRect().top + tabBarHeight + 8

      // Find the last section whose top edge is at or above the threshold
      let current: TabKey = 'summary'
      for (const key of TAB_ORDER) {
        const el = sectionRefs.current[key]
        if (!el) continue
        const top = el.getBoundingClientRect().top
        if (top <= containerTop) current = key
      }
      setActiveTab(current)
    }

    container.addEventListener('scroll', onScroll, { passive: true })
    return () => container.removeEventListener('scroll', onScroll)
  }, [rulePackage])

  function handleTabChange(key: string) {
    const tab = key as TabKey
    setActiveTab(tab)
    const target = sectionRefs.current[tab]
    const container = scrollContainerRef.current
    if (!target || !container) return

    scrollingByClick.current = true

    const tabBarHeight = tabBarRef.current?.offsetHeight ?? 44
    const containerRect = container.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    const scrollTo = container.scrollTop + (targetRect.top - containerRect.top) - tabBarHeight - 8

    container.scrollTo({ top: Math.max(0, scrollTo), behavior: 'smooth' })
    setTimeout(() => { scrollingByClick.current = false }, 800)
  }

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
      router.push(`/care-gaps/${careGapId}/insights`)
    })
  }, [careGapId, router])

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

        {/* All sections always rendered */}
        <div className="space-y-3 shrink-0">
          <div ref={(el) => { sectionRefs.current.summary = el }}>
            <ClinicalSummaryCard clinicalSummary={rulePackage.clinicalSummary} />
          </div>
          <div ref={(el) => { sectionRefs.current.eligibility = el }}>
            <EligibilityCriteriaCard criteria={rulePackage.eligibilityCriteria} />
          </div>
          <div ref={(el) => { sectionRefs.current.exclusions = el }}>
            <ExclusionCriteriaCard criteria={rulePackage.exclusionCriteria} />
          </div>
          <div ref={(el) => { sectionRefs.current.temporal = el }}>
            <TemporalRulesTable rules={rulePackage.temporalRules} />
          </div>
          <div ref={(el) => { sectionRefs.current.data = el }}>
            <DataRequirementsCard requirements={rulePackage.dataRequirements} />
          </div>
          <div ref={(el) => { sectionRefs.current.evidence = el }}>
            <EvidenceMappingCard mappings={rulePackage.evidenceMapping} />
          </div>
          <div ref={(el) => { sectionRefs.current.logic = el }}>
            <RuleLogicCard steps={rulePackage.ruleLogic} />
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="overflow-y-auto scrollbar-hide pb-2">
        <ConfigurableParametersPanel
          parameters={parameters}
          onParameterChange={handleParameterChange}
          isGenerating={false}
          impactSummary={impactSummary}
          onGenerateInsights={handleGenerateInsights}
          isGeneratingInsights={isGeneratingInsights}
        />
      </div>
    </div>
  )
}
