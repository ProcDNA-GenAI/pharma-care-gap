import type { ApiResult, RulePackage, ImpactSummary, ParameterValues, ParameterDiff } from '@/lib/types'
import { MOCK_RULE_PACKAGE } from '@/lib/mocks/rulePackage.mock'
import { computeMockImpact } from '@/lib/mocks/recalculate.mock'
import { delay } from '@/lib/utils/delay'

export async function getRulePackage(careGapId: string): Promise<ApiResult<RulePackage>> {
  await delay(1200)
  if (careGapId !== MOCK_RULE_PACKAGE.careGapId) {
    return {
      success: false,
      error: { code: 'NOT_FOUND', message: `Rule package for care gap '${careGapId}' not found`, status: 404 },
    }
  }
  return { success: true, data: MOCK_RULE_PACKAGE }
}

export interface RecalculatePayload {
  careGapId: string
  parameters: ParameterValues
  defaults: ParameterValues
  diffs: ParameterDiff[]
}

export async function recalculatePopulation(
  payload: RecalculatePayload,
): Promise<ApiResult<ImpactSummary>> {
  await delay(900)
  const impact = computeMockImpact(payload.parameters, payload.defaults, payload.diffs)
  return { success: true, data: impact }
}

export async function exportRules(careGapId: string): Promise<ApiResult<{ url: string }>> {
  await delay(500)
  return { success: true, data: { url: `/exports/${careGapId}.pdf` } }
}
