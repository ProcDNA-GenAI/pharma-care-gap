import type { ApiResult, CareGap } from '@/lib/types'
import { MOCK_CARE_GAPS } from '@/lib/mocks/careGaps.mock'
import { delay } from '@/lib/utils/delay'

export async function getCareGaps(): Promise<ApiResult<CareGap[]>> {
  await delay(600)
  return { success: true, data: MOCK_CARE_GAPS }
}

export async function getCareGapById(id: string): Promise<ApiResult<CareGap>> {
  await delay(300)
  const found = MOCK_CARE_GAPS.find((g) => g.id === id)
  if (!found) {
    return { success: false, error: { code: 'NOT_FOUND', message: `Care gap '${id}' not found`, status: 404 } }
  }
  return { success: true, data: found }
}
