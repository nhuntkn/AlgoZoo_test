import type {ProblemType } from './problem'

export interface AdminDashboardSummary {
  total: number
  active: number
  inactive: number
}

export interface AdminClassProgress {
  class_id: string
  name: string
  isActive: boolean
  studentCount: number
  problemCount: number
  submissionCount: number
  progressPercent: number
}

export interface AdminStudentProgress {
  student_id: string
  fullname: string
  email: string
  class_id: string
  className: string
  submissionCount: number
  problemCount: number
  progressPercent: number
}

export interface AdminSubjectOverview {
  problemType: ProblemType
  submissionCount: number
  progressPercent: number
}

export interface AdminDashboardData {
  filter: {
    class_id: string | null
  }
  classes: AdminDashboardSummary
  students: AdminDashboardSummary
  classProgress: AdminClassProgress[]
  studentsProgress: AdminStudentProgress[]
  subjectOverview: AdminSubjectOverview[]
}

export interface AdminDashboardResponse {
  status: string
  message: string
  data: AdminDashboardData
}