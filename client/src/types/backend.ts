export type UserRole = 'student' | 'trainer' | 'admin'
export type ProblemType = 'OS' | 'DB' | 'DSA' | 'OTHER'
export type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard'
export type SubmissionStatus = 'pending' | 'late' | 'review'

export interface UserModel {
  _id: string
  fullname: string
  email: string
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ClassModel {
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

export interface ClassMemberModel {
  _id: string
  classId: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface ClassProblemModel {
  _id: string
  class_id: string
  problem_id: string
  assigned_by: string
  deadline: string | null
  created_at: string
}

export interface ProblemModel {
  _id: string
  title: string
  description?: string
  problemType: ProblemType
  difficulty: ProblemDifficulty | null
  createdBy: string
  problemUrl?: string
  createdAt: string
  updatedAt: string
}

export interface ContentBlockModel {
  type: 'text' | 'code' | 'image' | 'file'
  content?: string
  language?: string
  file_id?: string
  filename?: string
}

export interface SubmissionModel {
  _id: string
  class_problem_id: string
  student_id: string
  content_blocks: ContentBlockModel[]
  is_late: boolean
  status: SubmissionStatus
  feedback: string
  reviewed_by: string | null
  reviewed_at: string | null
  createdAt: string
  updatedAt: string
}

export interface FileModel {
  _id: string
  original_name: string
  stored_name: string
  mime_type: string
  size: number
  path: string
  uploaded_by: string
  created_at: string
}
