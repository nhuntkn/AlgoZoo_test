import type { Role } from './auth'

export interface AdminClass {
  id: string
  name: string
  description: string
  isActive: boolean
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: Role
  isActive: boolean
}

export interface AdminClassDetail extends AdminClass {
  trainers: Array<{ id: string; name: string; email: string; isActive: boolean; joinedAt: string }>
  students: Array<{ id: string; name: string; email: string; isActive: boolean; joinedAt: string }>
}
