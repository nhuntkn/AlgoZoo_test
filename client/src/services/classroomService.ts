const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}/api${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.message || 'Request failed')
  }
  return data
}

export type TrainerDashboard = {
  classCount: number
  pendingReviewCount: number
  problemCount: number
}

export async function getTrainerDashboard(): Promise<TrainerDashboard> {
  const data = await request<{ data: TrainerDashboard }>('/trainer/dashboard')
  return data.data
}

export type TrainerClass = {
  class_id: string
  className: string
  is_active: boolean
  student_count: number
  pending_review_count: number
}

export async function getTrainerClasses(): Promise<TrainerClass[]> {
  const data = await request<{ data: TrainerClass[] }>('/trainer/classes')
  return data.data
}

export type ClassStudent = {
  user_id: string
  name: string
  completed_tasks: number
}

export type ClassDetail = {
  class_id: string
  className: string
  description: string
  total_problems: number
  students: ClassStudent[]
}

export async function getClassDetail(classId: string): Promise<ClassDetail> {
  const data = await request<{ data: ClassDetail }>(`/trainer/classes/${classId}`)
  return data.data
}

export type ClassProblem = {
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

export async function getClassProblems(classId: string, search?: string): Promise<ClassProblem[]> {
  const qs = search ? `?search=${encodeURIComponent(search)}` : ''
  const data = await request<{ data: ClassProblem[] }>(`/trainer/classes/${classId}/problems${qs}`)
  return data.data
}

export async function assignProblemToClass(
  classId: string,
  problemId: string,
  deadline?: string | null
): Promise<void> {
  await request(`/trainer/classes/${classId}/problems`, {
    method: 'POST',
    body: JSON.stringify({ problem_id: problemId, deadline: deadline || null }),
  })
}

export async function removeClassProblem(classId: string, problemId: string): Promise<void> {
  await request(`/trainer/classes/${classId}/problems/${problemId}`, { method: 'DELETE' })
}
