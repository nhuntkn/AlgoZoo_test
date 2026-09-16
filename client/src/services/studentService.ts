import { api } from './api'

import type {
  StudentClassesResponse,
} from '../types/class'

import type {
  StudentClassProblemsResponse,
  StudentProblemDetailResponse,
} from '../types/classProblem'

import type {
  CreateSubmissionRequest,
  CreateSubmissionResponse,
} from '../types/submission'

import type {
  StudentDashboardResponse,
} from '../types/studentDashboard'

export const studentService = {
  getClasses: () =>
    api.get<StudentClassesResponse>(
      '/student/classes'
    ),

  getDashboard: (classId: string) =>
    api.get<StudentDashboardResponse>(
      `/student/classes/${classId}/dashboard`
    ),

  getClassProblems: (classId: string) =>
    api.get<StudentClassProblemsResponse>(
      `/student/classes/${classId}/problems`
    ),

  getProblem: (classProblemId: string) =>
    api.get<StudentProblemDetailResponse>(
      `/student/problems/${classProblemId}`
    ),

  createSubmission: (data: CreateSubmissionRequest) =>
    api.post<CreateSubmissionResponse>(
      '/student/submissions',
      data
    ),
}