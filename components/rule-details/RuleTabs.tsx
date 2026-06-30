'use client'

import { Tabs } from '@/components/ui/Tabs'
import type { TabItem } from '@/components/ui/Tabs'

export const RULE_TABS: TabItem[] = [
  { key: 'summary',      label: 'Clinical Summary' },
  { key: 'eligibility',  label: 'Eligibility Criteria' },
  { key: 'exclusions',   label: 'Exclusion Criteria' },
  { key: 'temporal',     label: 'Temporal Rules' },
  { key: 'data',         label: 'Data Requirements' },
  { key: 'evidence',     label: 'Evidence Mapping' },
  { key: 'logic',        label: 'Rule Logic' },
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
