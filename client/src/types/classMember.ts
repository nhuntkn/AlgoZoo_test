export interface ClassMember {
  id: string
  classId: string
  userId: string
  createdAt: string
  updatedAt: string
}

export type ClassMemberRole = 'student' | 'trainer'

export interface GenerateJoinLinkRequest {
  role?: ClassMemberRole
  expiresInDays?: number
}

export interface GenerateJoinLinkResponse {
  status: string
  message: string
  data: {
    token: string
    role: ClassMemberRole
    expiresAt: string
    joinUrl: string
  }
}