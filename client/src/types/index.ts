// ─── Auth ──────────────────────────────────────────────────────────────────────

export type Role = 'student' | 'trainer' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  initials: string
  avatar?: string
}

// ─── Class ─────────────────────────────────────────────────────────────────────

export type ClassStatus = 'ACTIVE' | 'INACTIVE'

export interface ClassItem {
  id: string
  name: string
  description: string
  status: ClassStatus
  trainers: string[]
  students: number
  problems: number
  progress: number
  endDate?: string
  studentJoinToken?: string
  trainerInviteToken?: string
}

// ─── Problem ───────────────────────────────────────────────────────────────────

export type ProblemType = 'DSA' | 'OS' | 'Database' | 'Other'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Resource {
  id: number
  label?: string
  url?: string
  filename?: string
}

export interface Problem {
  id: string
  title: string
  type: ProblemType
  difficulty: Difficulty
  description: string
  resources: Resource[]
}

// ─── Submission ────────────────────────────────────────────────────────────────

export type SubmissionStatus = 'pending' | 'reviewed' | 'late'

export type ContentBlock =
  | { type: 'text'; content: string }
  | { type: 'code'; language: string; content: string }
  | { type: 'image'; filename: string; dataUrl: string }
  | { type: 'file'; filename: string }

export interface Submission {
  id: string
  studentId: string
  studentName: string
  studentInitials: string
  problemId: string
  problemTitle: string
  problemType: ProblemType
  classId: string
  className: string
  status: SubmissionStatus
  submittedAt: string
  isLate: boolean
  contentBlocks: ContentBlock[]
  feedback?: string
  reviewedAt?: string
}

// ─── Assignment ────────────────────────────────────────────────────────────────

export interface Assignment {
  id: string
  problemId: string
  classId: string
  deadline: string | null
  createdAt: string
}

// ─── Subject / Category ────────────────────────────────────────────────────────

export type Subject = 'DSA' | 'OS' | 'Database'

export const SUBJECT_STYLES: Record<Subject, { bar: string; text: string }> = {
  DSA: { bar: 'bg-orange-400', text: 'text-orange-600' },
  Database: { bar: 'bg-green-500', text: 'text-green-700' },
  OS: { bar: 'bg-purple-500', text: 'text-purple-700' },
}

// ─── Notification ──────────────────────────────────────────────────────────────

export type NotificationType =
  | 'NEW_SUBMISSION'
  | 'GRADE_RELEASED'
  | 'LATE_SUBMISSION'
  | 'ASSIGNMENT_CREATED'

export interface AppNotification {
  id: string
  recipientRole: Role
  type: NotificationType
  title: string
  message: string
  context?: string
  linkTo?: string
  read: boolean
  createdAt: string
}
