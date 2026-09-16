export type Role = 'student' | 'trainer' | 'admin'

export interface User {
  name: string
  email: string
  role: Role
  initials: string
}
