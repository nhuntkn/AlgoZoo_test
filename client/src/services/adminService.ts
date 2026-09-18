import { api } from './api'
import type { AdminClass, AdminClassDetail, AdminUser } from '../types/admin'
import type { AdminClassListResponse, AdminClassDetailResponse, CreateClassResponse, UpdateClassDetailsResponse, UpdateClassActiveResponse, AdminUserListResponse, UpdateUserActiveResponse } from '../types/admin'
import type { AdminDashboardResponse } from '../types/adminDashboard'

function mapClass(item: AdminClassListResponse['data']['classes'][number]): AdminClass {
  return { id: item._id, name: item.name, description: item.description || '', isActive: item.isActive }
}

function mapUser(item: AdminUserListResponse['data']['users'][number]): AdminUser {
  return { id: item._id || item.id, name: item.fullname || item.name || 'Unnamed user', email: item.email, role: item.role, isActive: item.isActive ?? true }
}

export async function getClasses(): Promise<AdminClass[]> {
  const response = await api.get<AdminClassListResponse>('/admin/classes')
  return response.data.classes.map(mapClass)
}

export async function createClass(name: string, description: string): Promise<AdminClass> {
  const response = await api.post<CreateClassResponse>('/admin/classes', { name, description })
  return { id: response.data.class_id, name: response.data.name, description: response.data.description || '', isActive: true }
}

export async function getUsers(): Promise<AdminUser[]> {
  const response = await api.get<AdminUserListResponse>('/admin/get-user')
  return response.data.users.map(mapUser)
}

export async function updateUserActive(id: string, isActive: boolean): Promise<AdminUser> {
  const response = await api.patch<UpdateUserActiveResponse>(`/admin/users/${id}`, { isActive })
  return mapUser(response.data.user)
}

export async function getClassDetail(id: string): Promise<AdminClassDetail> {
  const response = await api.get<AdminClassDetailResponse>(`/admin/classes/${id}`)
  const data = response.data
  return {
    id: data.class_id,
    name: data.name,
    description: data.description || '',
    isActive: data.isActive,
    trainers: data.trainers.map((member) => ({ id: member.id, name: member.fullname, email: member.email, isActive: member.isActive, joinedAt: member.joinedAt })),
    students: data.students.map((member) => ({ id: member.id, name: member.fullname, email: member.email, isActive: member.isActive, joinedAt: member.joinedAt })),
  }
}

export function updateClass(id: string, name: string, description: string) {
  return api.patch<UpdateClassDetailsResponse>(`/admin/classes/${id}`, { name, description })
}

export function updateClassActive(id: string, isActive: boolean) {
  return api.patch<UpdateClassActiveResponse>(`/admin/classes/${id}/active`, { isActive })
}

export function generateJoinLink(id: string, role: 'student' | 'trainer', expiresInDays = 2) {
  return api.post<{ data: { joinUrl: string; token: string; role: 'student' | 'trainer'; expiresAt: string } }>(`/classes/${id}/generate-join-link`, { role, expiresInDays })
}

export function removeStudent(classId: string, studentId: string) {
  return api.delete(`/admin/classes/${classId}/student/${studentId}`)
}

export function removeTrainer(classId: string, trainerId: string) {
  return api.delete(`/admin/classes/${classId}/trainer/${trainerId}`)
}

export function getDashboard(classId?: string) {
  const query = classId ? `?class_id=${encodeURIComponent(classId)}` : ''
  return api.get<AdminDashboardResponse>(`/admin/dashboard${query}`)
}

export function getUserById(id: string) {
  return api.get(`/admin/get-user/${id}`)
}

export function getUsersByRole(role: 'student' | 'trainer' | 'admin') {
  return api.get(`/admin/users?role=${encodeURIComponent(role)}`)
}