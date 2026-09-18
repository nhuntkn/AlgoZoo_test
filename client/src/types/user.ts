export type UserRole = 'student' | 'trainer' | 'admin'

export interface User {
  id: string
  fullname: string
  email: string
  isActive: boolean
  role: UserRole
  createdAt: string
  updatedAt: string
}