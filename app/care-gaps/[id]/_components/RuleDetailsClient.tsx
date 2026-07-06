'use client'

import { useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useRulePackage } from '@/hooks/useRulePackage'
import { useParameterState } from '@/hooks/useParameterState'

import { PageLayout } from '@/components/rule-details/PageLayout'
import { BusinessRulesSection } from '@/components/rule-details/BusinessRulesSection'
import { AdditionalCriteriaPanel } from '@/components/rule-details/AdditionalCriteriaPanel'
import { GenerateInsightsButton } from '@/components/rule-details/GenerateInsightsButton'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { AlertTriangle } from 'lucide-react'
import type { ParameterValues } from '@/lib/types'

interface RuleDetailsClientProps {
  careGapId: string
}

export function RuleDetailsClient({ careGapId }: RuleDetailsClientProps) {
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
        <div className="space-y-4">
          <SkeletonCard className="h-24" />
          <SkeletonCard className="h-48" />
        </div>
        <SkeletonCard className="h-96" />
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
    <PageLayout
      left={<BusinessRulesSection parameters={parameters} />}
      right={
        <div className="space-y-6">
          <AdditionalCriteriaPanel
            parameters={parameters}
            onParameterChange={handleParameterChange}
          />
          <GenerateInsightsButton
            onClick={handleGenerateInsights}
            loading={isGeneratingInsights}
          />
        </div>
      }
    />
  )
}
