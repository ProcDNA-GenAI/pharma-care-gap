import { Users, Clock, BarChart2, RefreshCw, Layers } from 'lucide-react'
import { CohortCard } from './CohortCard'
import { MetricRecommendationCard } from './MetricRecommendationCard'
import type { RulePackage } from '@/lib/types'

interface BusinessRulesSectionProps {
  rulePackage: RulePackage
}

export function BusinessRulesSection({ rulePackage }: BusinessRulesSectionProps) {
  const {
    clinicalSummary,
    eligibilityCriteria, exclusionCriteria, temporalRules,
    ruleLogic,
  } = rulePackage

  return (
    <div className="space-y-6">

      {/* Section 1 — IBD Patient Cohort Eligibility */}
      <section className="rounded-2xl border-2 border-gray-300 bg-white p-5 shadow-lg">
        <h2 className="mb-1 text-base font-semibold text-brand-900">1. IBD Patient Cohort Eligibility</h2>
        <p className="mb-4 text-sm leading-relaxed text-gray-700">
          Business rules to create IBD patient cohort for care gap analysis.
        </p>

        <div className="flex flex-col gap-4">
          <CohortCard
            icon={Users}
            title="IBD Patient Cohort Definition"
            description={clinicalSummary.text}
            badge="IBD Patient Cohort Definition"
          />
        </div>
      </section>

      {/* Section 2 — Recommended Metrics for Quantifying the Overuse of Oral Corticosteroids */}
      <section className="rounded-2xl border-2 border-gray-300 bg-white p-5 shadow-lg">
        <h2 className="mb-1 text-base font-semibold text-emerald-600">2. Recommended Care Gap Metrics for Quantifying the Overuse of Oral Corticosteroids</h2>
        <p className="mb-4 text-sm leading-relaxed text-gray-600">
          Patients meeting the IBD cohort definition are evaluated using the following recommended care gap metrics.
        </p>

        <div className="space-y-5">
          <MetricRecommendationCard
            icon={Clock}
            accent="blue"
            title="Chronic/Prolonged OCS Use Rate"
            bullets={[
              eligibilityCriteria[0]?.label,
              ...(eligibilityCriteria[0]?.subItems ?? []),
            ].filter((b): b is string => !!b)}
            ruleType="Duration Based"
          />
          <MetricRecommendationCard
            icon={BarChart2}
            accent="violet"
            title="High-Dose/Prolonged OCS Exposure Rate"
            bullets={[exclusionCriteria[0]?.label].filter((b): b is string => !!b)}
            ruleType="Dose + Duration"
          />
          <MetricRecommendationCard
            icon={RefreshCw}
            accent="emerald"
            title="Repeat OCS Course Rate"
            bullets={[temporalRules[0]?.value].filter((b): b is string => !!b)}
            ruleType="Episode Count"
          />
          <MetricRecommendationCard
            icon={Layers}
            accent="gray"
            title="Composite OCS Overuse Eligibility"
            bullets={ruleLogic.map((step) => step.condition)}
            ruleType="Composite OR Logic"
          />
        </div>
      </section>

    </div>
  )
}
