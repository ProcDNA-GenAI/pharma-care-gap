'use client'

import { Tabs } from '@/components/ui/Tabs'
import type { TabItem } from '@/components/ui/Tabs'

export const RULE_TABS: TabItem[] = [
  { key: 'summary',      label: 'IBD Cohort Identification' },
  { key: 'eligibility',  label: 'Chronic/Prolonged OCS Use' },
  { key: 'exclusions',   label: 'High-Dose OCS Exposure' },
  { key: 'temporal',     label: 'Repeat OCS Course' },
  { key: 'data',         label: 'Steroid Taper Failure' },
  { key: 'evidence',     label: 'Post-Discontinuation Relapse' },
  { key: 'logic',        label: 'Composite OCS Overuse Flag' },
]

interface RuleTabsProps {
  activeTab: string
  onChange: (key: string) => void
}

export function RuleTabs({ activeTab, onChange }: RuleTabsProps) {
  return (
    <Tabs
      tabs={RULE_TABS}
      activeKey={activeTab}
      onChange={onChange}
      className="overflow-x-auto scrollbar-hide"
    />
  )
}
