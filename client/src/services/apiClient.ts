import { ApiError } from '../types/api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })

  const data = await response.json().catch(() => ({})) as T & { message?: string; result?: { message?: string } }

  if (!response.ok) {
    throw new ApiError(data.result?.message || data.message || 'Request failed', response.status)
  }

  return data
}
