// services/api.ts

const configuredApiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
export const API_BASE_URL = configuredApiUrl.endsWith('/api') ? configuredApiUrl : `${configuredApiUrl}/api`

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
      body?.result?.message ?? body?.message ?? 'Request failed',
      response.status
    )
  }

  return body
}


async function requestFormData<T>(
  path: string,
  formData: FormData
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
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

  postFormData: <T>(path: string, formData: FormData) =>
    requestFormData<T>(path, formData),
}