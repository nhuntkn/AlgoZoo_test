// authService.ts
import { api } from './api'
import type { ApiPayload } from '../types/api'

export function getCurrentUser() {
  return api.get<ApiPayload>('/auth/me')
}

export function refreshToken() {
  return api.get<ApiPayload>('/auth/refresh-token')
}

export function login(email: string, password: string, inviteToken?: string) {
  return api.post<ApiPayload>('/auth/login', { email, password, inviteToken })
}

export function register(token: string, fullname: string, email: string, password: string) {
  return api.post<ApiPayload>('/auth/register', { token, fullname, email, password })
}

export function logout() {
  return api.post<ApiPayload>('/auth/logout')
}