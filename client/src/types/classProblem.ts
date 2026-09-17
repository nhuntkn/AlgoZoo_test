import type {
  ProblemDifficulty,
  ProblemType,
} from './problem'
import type { StudentSubmission } from './submission'

export interface StudentClassProblem {
  classProblemId: string
  deadline: string | null
  status: string | null
  problem: {
    id: string
    title: string
    problemType: ProblemType
    difficulty: ProblemDifficulty | null
    problemUrl?: string
  } | null
}

export interface StudentClassProblemsResponse {
  status: string
  message?: string
  data: StudentClassProblem[]
}

export interface StudentProblemDetail {
  classProblemId: string
  classId: string
  deadline: string | null
  status: string | null
  submission: StudentSubmission | null
  problem: {
    id: string
    title: string
    description?: string
    problemType: ProblemType
    difficulty: ProblemDifficulty | null
    problemUrl?: string
  } | null
}

export interface StudentProblemDetailResponse {
  status: string
  message?: string
  data: StudentProblemDetail
}