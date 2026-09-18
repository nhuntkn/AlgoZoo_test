import { api } from './api'

export interface TrainerDashboard {
  classCount: number
  pendingReviewCount: number
  problemCount: number
}

export interface TrainerClass {
  class_id: string
  className: string
  is_active: boolean
  student_count: number
  pending_review_count: number
}

export interface TrainerClassDetail {
  class_id: string
  className: string
  description: string
  total_problems: number
  students: Array<{ user_id: string; name: string; completed_tasks: number }>
}

export interface TrainerClassProblem {
  class_id: string
  class_problem_id: string
  problem_id: string | null
  title: string | null
  difficulty: string | null
  problemType: string | null
  assigned_by: string
  deadline: string | null
  created_at: string
  submitted_count: number
  total_students: number
}

export function getDashboard() {
  return api.get<{ data: TrainerDashboard }>('/trainer/dashboard')
}

export function getClasses() {
  return api.get<{ data: TrainerClass[] }>('/trainer/classes')
}

export function getClassDetail(classId: string) {
  return api.get<{ data: TrainerClassDetail }>(`/trainer/classes/${classId}`)
}

export function getClassProblems(classId: string, search?: string) {
  const query = search ? `?search=${encodeURIComponent(search)}` : ''
  return api.get<{ data: TrainerClassProblem[] }>(`/trainer/classes/${classId}/problems${query}`)
}

export function assignProblem(classId: string, problemId: string, deadline?: string | null) {
  return api.post(`/trainer/classes/${classId}/problems`, { problem_id: problemId, deadline: deadline || null })
}

export function removeProblem(classId: string, problemId: string) {
  return api.delete(`/trainer/classes/${classId}/problems/${problemId}`)
}
