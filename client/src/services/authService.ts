import { apiRequest } from './apiClient'
import type { ApiPayload } from '../types/api'

export function getCurrentUser() {
  return apiRequest<ApiPayload>('/api/auth/me')
}

export function refreshToken() {
  return apiRequest<ApiPayload>('/api/auth/refresh-token')
}

export function login(email: string, password: string, inviteToken?: string) {
  return apiRequest<ApiPayload>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, inviteToken }),
  })
}

export function register(token: string, fullname: string, email: string, password: string) {
  return apiRequest<ApiPayload>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ token, fullname, email, password }),
  })
}

export function logout() {
  return apiRequest<ApiPayload>('/api/auth/logout', { method: 'POST' })
}
