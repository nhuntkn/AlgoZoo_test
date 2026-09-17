export interface ApiPayload {
  status?: string
  message?: string
  data?: Record<string, unknown>
  result?: { status?: string; message?: string; data?: Record<string, unknown> }
}

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(
      body?.message ?? 'Request failed',
      response.status
    )
  }

  return body
}

export const api = {
  get: <T>(path: string) =>
    request<T>(path),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: body !== undefined
        ? JSON.stringify(body)
        : undefined,
    }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body: body !== undefined
        ? JSON.stringify(body)
        : undefined,
    }),

  delete: <T>(path: string) =>
    request<T>(path, {
      method: 'DELETE',
    }),
}