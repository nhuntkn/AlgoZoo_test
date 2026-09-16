import type { SubmissionStatus, SubmissionListItem, SubmissionDetail } from '../types/submission'

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

export async function getSubmissions(params?: {
  student?: string
  problem?: string
  status?: SubmissionStatus
  problemType?: string
}): Promise<SubmissionListItem[]> {
  const query = new URLSearchParams()
  if (params?.student) query.set('student', params.student)
  if (params?.problem) query.set('problem', params.problem)
  if (params?.status) query.set('status', params.status)
  if (params?.problemType) query.set('problemType', params.problemType)
  const qs = query.toString()
  const data = await request<{ data: SubmissionListItem[] }>(`/trainer/submissions${qs ? `?${qs}` : ''}`)
  return data.data
}

export async function getSubmissionDetail(id: string): Promise<SubmissionDetail> {
  const data = await request<{ data: SubmissionDetail }>(`/trainer/submissions/${id}`)
  return data.data
}

export async function reviewSubmission(id: string, feedback: string): Promise<void> {
  await request(`/trainer/review/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ feedback }),
  })
}
