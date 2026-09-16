import { apiRequest } from './apiClient'
import type { AdminClass, AdminClassDetail, AdminUser } from '../types/admin'
import type { ApiPayload } from '../types/api'

interface BackendClass { _id: string; name: string; description?: string; isActive: boolean }
interface BackendUser { _id: string; fullname?: string; email: string; role: AdminUser['role']; isActive: boolean }

export async function getClasses(): Promise<AdminClass[]> {
  const response = await apiRequest<ApiPayload>('/api/admin/classes')
  const classes = (response.data?.classes || []) as BackendClass[]
  return classes.map((item) => ({ id: item._id, name: item.name, description: item.description || '', isActive: item.isActive }))
}

export async function createClass(name: string, description: string): Promise<AdminClass> {
  const response = await apiRequest<ApiPayload>('/api/admin/classes', {
    method: 'POST',
    body: JSON.stringify({ name, description }),
  })
  const item = response.data as { class_id: string; name: string; description?: string }
  return { id: item.class_id, name: item.name, description: item.description || '', isActive: true }
}

export async function getUsers(): Promise<AdminUser[]> {
  const response = await apiRequest<ApiPayload>('/api/admin/get-user')
  const users = (response.data?.users || []) as BackendUser[]
  return users.map((item) => ({ id: item._id, name: item.fullname || 'Unnamed user', email: item.email, role: item.role, isActive: item.isActive }))
}

export async function updateUserActive(id: string, isActive: boolean): Promise<AdminUser> {
  const response = await apiRequest<ApiPayload>(`/api/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  })
  const item = response.data?.user as BackendUser
  return { id: item._id, name: item.fullname || 'Unnamed user', email: item.email, role: item.role, isActive: item.isActive }
}

export async function getClassDetail(id: string): Promise<AdminClassDetail> {
  const response = await apiRequest<ApiPayload>(`/api/admin/classes/${id}`)
  const data = response.data as Omit<AdminClassDetail, 'id' | 'isActive'> & { class_id: string; isActive: boolean }
  return { ...data, id: data.class_id, isActive: data.isActive }
}

export function updateClass(id: string, name: string, description: string) {
  return apiRequest<ApiPayload>(`/api/admin/classes/${id}`, { method: 'PATCH', body: JSON.stringify({ name, description }) })
}

export function updateClassActive(id: string, isActive: boolean) {
  return apiRequest<ApiPayload>(`/api/admin/classes/${id}/active`, { method: 'PATCH', body: JSON.stringify({ isActive }) })
}

export function generateJoinLink(id: string, role: 'student' | 'trainer', expiresInDays = 2) {
  return apiRequest<ApiPayload>(`/api/classes/${id}/generate-join-link`, {
    method: 'POST',
    body: JSON.stringify({ role, expiresInDays }),
  })
}

export function removeStudent(classId: string, studentId: string) {
  return apiRequest<ApiPayload>(`/api/admin/classes/${classId}/student/${studentId}`, { method: 'DELETE' })
}

export function removeTrainer(classId: string, trainerId: string) {
  return apiRequest<ApiPayload>(`/api/admin/classes/${classId}/trainer/${trainerId}`, { method: 'DELETE' })
}
