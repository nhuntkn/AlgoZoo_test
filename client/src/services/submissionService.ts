import { api } from './api'
import type { SubmissionStatus, SubmissionListItem, SubmissionDetail } from '../types/submission'

export function getSubmissions(params?: { student?: string; problem?: string; status?: SubmissionStatus; problemType?: string }) {
  const query = new URLSearchParams()
  if (params?.student) query.set('student', params.student)
  if (params?.problem) query.set('problem', params.problem)
  if (params?.status) query.set('status', params.status)
  if (params?.problemType) query.set('problemType', params.problemType)
  const suffix = query.toString() ? `?${query}` : ''
  return api.get<{ data: SubmissionListItem[] }>(`/trainer/submissions${suffix}`).then((response) => response.data)
}

export function getSubmissionDetail(submissionId: string) {
  return api.get<{ data: SubmissionDetail }>(`/trainer/submissions/${submissionId}`).then((response) => response.data)
}

export function reviewSubmission(submissionId: string, feedback: string) {
  return api.patch(`/trainer/review/${submissionId}`, { feedback })
}
