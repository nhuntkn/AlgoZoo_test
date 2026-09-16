import type { UserRole } from './user'

export interface AdminClass {
  id: string
  name: string
  description: string
  isActive: boolean
}

export interface AdminUser {
  _id?: string
  id: string
  name: string
  fullname?: string
  email: string
  role: UserRole
  isActive: boolean
}

export interface AdminUserListResponse {
  status: string
  message: string
  count: number
  data: {
    users: AdminUser[]
  }
}

export interface AdminUserDetailResponse {
  status: string
  message: string
  data: AdminUser
}

export interface AdminUsersByRoleResponse {
  status: string
  data: AdminUser[]
}

export interface UpdateUserActiveRequest {
  isActive: boolean
}

export interface UpdateUserActiveResponse {
  status: string
  message: string
  data: {
    user: AdminUser
  }
}


export interface AdminClassListItem {
  _id: string
  name: string
  description: string
  isActive: boolean
  studentJoinToken?: string
  trainerInviteToken?: string
  studentJoinTokenExpiresAt?: string | null
  trainerInviteTokenExpiresAt?: string | null
  archivedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface AdminClassListResponse {
  status: string
  message: string
  count: number
  data: {
    classes: AdminClassListItem[]
  }
}

export interface AdminClassMember {
  id: string
  fullname: string
  email: string
  isActive: boolean
  joinedAt: string
}

export interface AdminClassDetail {
  id: string
  name: string
  description: string
  isActive: boolean
  trainers: Array<{ id: string; name: string; email: string; isActive: boolean; joinedAt: string }>
  students: Array<{ id: string; name: string; email: string; isActive: boolean; joinedAt: string }>
}

export interface AdminClassDetailResponse {
  status: string
  message: string
  data: {
    class_id: string
    name: string
    description: string
    isActive: boolean
    trainer_count: number
    student_count: number
    trainers: AdminClassMember[]
    students: AdminClassMember[]
  }
}

export interface CreateClassRequest {
  name: string
  description?: string
}

export interface CreateClassResponse {
  status: string
  message: string
  data: {
    class_id: string
    name: string
    description: string
  }
}

export interface UpdateClassDetailsRequest {
  name?: string
  description?: string
}

export interface UpdateClassDetailsResponse {
  status: string
  message: string
  data: {
    class_id: string
    name: string
    description: string
  }
}

export interface UpdateClassActiveRequest {
  isActive: boolean
}

export interface UpdateClassActiveResponse {
  status: string
  message: string
  data: {
    affectedStudents: number
    class: AdminClassListItem
  }
}

export interface RemoveMemberResponse {
  status: string
  message: string
  data: {
    class_id: string
    class_name: string
    trainer_id?: string
    trainer_name?: string
    student_id?: string
    student_name?: string
  }
}