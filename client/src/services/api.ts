/**
 * Centralized API service layer.
 *
 * Currently returns mock data. When backend is ready, replace each function
 * body with a real fetch/axios call. All pages import from here, so you only
 * change this file.
 *
 * Usage:
 *   import { api } from '@/services/api'
 *   const classes = await api.classes.list()
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

// ─── HTTP helper ───────────────────────────────────────────────────────────────

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      // TODO: add auth token header
      // 'Authorization': `Bearer ${getToken()}`,
      ...options?.headers,
    },
    ...options,
  })

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

// ─── API namespaces (placeholder — implement when backend is ready) ────────────

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; user: import('../types').User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    me: () => request<import('../types').User>('/auth/me'),
  },

  classes: {
    list: () => request<import('../types').ClassItem[]>('/classes'),
    get: (id: string) => request<import('../types').ClassItem>(`/classes/${id}`),
    create: (data: Partial<import('../types').ClassItem>) =>
      request<import('../types').ClassItem>('/classes', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  problems: {
    list: () => request<import('../types').Problem[]>('/problems'),
    get: (id: string) => request<import('../types').Problem>(`/problems/${id}`),
    create: (data: Partial<import('../types').Problem>) =>
      request<import('../types').Problem>('/problems', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<import('../types').Problem>) =>
      request<import('../types').Problem>(`/problems/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<void>(`/problems/${id}`, { method: 'DELETE' }),
  },

  submissions: {
    list: (params?: { classId?: string; status?: string }) => {
      const qs = new URLSearchParams(params as Record<string, string>).toString()
      return request<import('../types').Submission[]>(`/submissions?${qs}`)
    },
    get: (id: string) => request<import('../types').Submission>(`/submissions/${id}`),
    create: (data: Partial<import('../types').Submission>) =>
      request<import('../types').Submission>('/submissions', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    review: (id: string, feedback: string) =>
      request<import('../types').Submission>(`/submissions/${id}/review`, {
        method: 'POST',
        body: JSON.stringify({ feedback }),
      }),
  },

  users: {
    list: (params?: { role?: string }) => {
      const qs = new URLSearchParams(params as Record<string, string>).toString()
      return request<import('../types').User[]>(`/users?${qs}`)
    },
  },
}
