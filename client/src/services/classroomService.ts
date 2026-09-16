import { api } from './api'

export type TrainerDashboard = { classCount: number; pendingReviewCount: number; problemCount: number }
export type TrainerClass = { class_id: string; className: string; is_active: boolean; student_count: number; pending_review_count: number }
export type ClassStudent = { user_id: string; name: string; completed_tasks: number }
export type ClassDetail = { class_id: string; className: string; description: string; total_problems: number; students: ClassStudent[] }
export type ClassProblem = { class_id: string; class_problem_id: string; problem_id: string | null; title: string | null; difficulty: string | null; problemType: string | null; assigned_by: string; deadline: string | null; created_at: string; submitted_count: number; total_students: number }

export async function getTrainerDashboard(): Promise<TrainerDashboard> {
  return (await api.get<{ data: TrainerDashboard }>('/trainer/dashboard')).data
}

export async function getTrainerClasses(): Promise<TrainerClass[]> {
  return (await api.get<{ data: TrainerClass[] }>('/trainer/classes')).data
}

export async function getClassDetail(classId: string): Promise<ClassDetail> {
  return (await api.get<{ data: ClassDetail }>(`/trainer/classes/${classId}`)).data
}

export async function getClassProblems(classId: string, search?: string): Promise<ClassProblem[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : ''
  return (await api.get<{ data: ClassProblem[] }>(`/trainer/classes/${classId}/problems${query}`)).data
}

export async function assignProblemToClass(classId: string, problemId: string, deadline?: string | null) {
  await api.post(`/trainer/classes/${classId}/problems`, { problem_id: problemId, deadline: deadline || null })
}

export async function removeClassProblem(classId: string, problemId: string) {
  await api.delete(`/trainer/classes/${classId}/problems/${problemId}`)
}
