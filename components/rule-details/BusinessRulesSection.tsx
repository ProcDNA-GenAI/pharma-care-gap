import { Users, Calendar, BarChart2, RefreshCw, Puzzle } from 'lucide-react'
import { CohortCard } from './CohortCard'
import { MetricRecommendationCard } from './MetricRecommendationCard'
import type { ParameterValues } from '@/lib/types'

interface BusinessRulesSectionProps {
  parameters: ParameterValues
}

export function BusinessRulesSection({ parameters }: BusinessRulesSectionProps) {
  return (
    <div className="space-y-6">

      {/* Section 1 — IBD Patient Cohort Eligibility */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-2xl font-semibold leading-tight text-[#1D3F8F]">1. IBD Patient Cohort Eligibility</h2>
        <p className="mb-4 text-sm leading-relaxed text-[#5F6B7A]">
          Define the patient population eligible for oral corticosteroid (OCS) care gap evaluation.
        </p>

        <CohortCard
          icon={Users}
          title="IBD Patient Cohort Definition"
          description="Patients are eligible for care gap analysis if they:"
          sourceLabel="Govani et al."
          sourceUrl="https://pubmed.ncbi.nlm.nih.gov/26521118/"
          enabled={parameters.m1Enabled}
          items={[
            <>Have ≥ <strong className="font-semibold text-[#1D3F8F]">{parameters.ibdMinClaims}</strong> medical claims with an IBD diagnosis (ICD-10 K50.x or K51.x)</>,
            <>Have a minimum of <strong className="font-semibold text-[#1D3F8F]">{parameters.ibdGapDays}</strong> days between the first and last IBD diagnosis claim</>,
            <>Are identified within the selected <strong className="font-semibold text-[#1D3F8F]">{parameters.measurementMonths}</strong>-month look forward period</>,
          ]}
        />
      </section>

      {/* Section 2 — Recommended Care Gap Measures for OCS Overuse */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-2xl font-semibold leading-tight text-[#138A57]">2. Recommended Care Gap Metrics for Oral Corticosteroid (OCS) Overuse</h2>
        <p className="mb-4 text-sm leading-relaxed text-[#5F6B7A]">
          Evaluate eligible IBD patients across clinically relevant indicators of inappropriate or prolonged OCS use.
        </p>

        <div className="space-y-4">
          <MetricRecommendationCard
            icon={Calendar}
            accent="green"
            title="Chronic Oral Corticosteroid Use"
            description="Identify patients with prolonged exposure to oral corticosteroids."
            bullets={[
              <>Total cumulative OCS exposure ≥ <strong className="font-semibold text-[#1D3F8F]">{parameters.ocsDurationThreshold}</strong> days during the look forward period</>,
            ]}
            ruleType="Duration-Based"
            sources={['Zhdanova et al.']}
            sourceUrl="https://www.jmcp.org/"
            enabled={parameters.m2Enabled}
          />
          <MetricRecommendationCard
            icon={BarChart2}
            accent="purple"
            title="High-Dose Oral Corticosteroid Exposure"
            description="Identify patients with sustained exposure to high-dose oral corticosteroids."
            bullets={[
              <>Prednisone-equivalent dose ≥ <strong className="font-semibold text-[#1D3F8F]">{parameters.highDoseMg}</strong> mg/day for ≥ <strong className="font-semibold text-[#1D3F8F]">{parameters.highDoseDurationDays}</strong> consecutive days OR</>,
              <>Total cumulative prednisone-equivalent dose ≥ <strong className="font-semibold text-[#1D3F8F]">{parameters.highDoseCumulativeMg}</strong> mg</>,
            ]}
            ruleType="Dose-Based"
            sources={['AGA / CMS MIPS Quality ID #271']}
            sourceUrl="https://mdinteractive.com/mips_quality_measure/2025-mips-quality-measure-271"
            enabled={parameters.m3Enabled}
          />
          <MetricRecommendationCard
            icon={RefreshCw}
            accent="orange"
            title="Recurrent Oral Corticosteroid Courses"
            description="Identify patients receiving repeated courses of oral corticosteroids."
            bullets={[
              'More than 1 distinct OCS treatment course during the look forward period',
              <>A new treatment course is defined by a gap of ≥ <strong className="font-semibold text-[#1D3F8F]">{parameters.courseGapDays}</strong> days between prescriptions</>,
            ]}
            ruleType="Treatment Pattern"
            sources={['DICE Study Methodology']}
            sourceUrl="https://pmc.ncbi.nlm.nih.gov/articles/PMC11084465/"
            enabled={parameters.m4Enabled}
          />
          <MetricRecommendationCard
            icon={Puzzle}
            accent="blue"
            title="Composite OCS Overuse Assessment"
            description="Patients are classified as having a potential OCS overuse care gap when they satisfy the selected composite rule."
            bullets={[
              'Meets at least one care gap criterion',
              'Meets at least two care gap criteria',
              'Meets all care gap criteria',
            ]}
            ruleType="Composite Assessment"
            sources={['Damasceno et al.']}
            sourceUrl="https://pubmed.ncbi.nlm.nih.gov/41825519/"
            enabled={parameters.m7Enabled}
          />
        </div>
      </section>

    </div>
  )
}
