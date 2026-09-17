export interface Class {
  id: string
  name: string
  description: string
  isActive: boolean
  studentJoinToken: string
  trainerInviteToken: string
  studentJoinTokenExpiresAt: string | null
  trainerInviteTokenExpiresAt: string | null
  archivedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface StudentClass {
  classId: string
  name: string
  description: string
  isActive: boolean
  joinedAt: string
  totalTrainers: number
  totalStudents: number
}

export interface StudentClassesResponse {
  status: string
  message?: string
  data: StudentClass[]
}