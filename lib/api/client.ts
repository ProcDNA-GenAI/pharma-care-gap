import type { ApiResult, ApiError } from '@/lib/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

async function request<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...init?.headers },
      ...init,
    })

    if (!res.ok) {
      const error: ApiError = {
        code: 'HTTP_ERROR',
        message: `Request failed with status ${res.status}`,
        status: res.status,
      }
      return { success: false, error }
    }

    const data: T = await res.json()
    return { success: true, data }
  } catch (err) {
    const error: ApiError = {
      code: 'NETWORK_ERROR',
      message: err instanceof Error ? err.message : 'Network error',
    }
    return { success: false, error }
  }
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
}
