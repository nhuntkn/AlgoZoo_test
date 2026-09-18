
export type SubmissionBlockType = 'text' | 'code' | 'image' | 'file'
export type ContentBlock = SubmissionContentBlock

export type SubmissionStatus = 'pending' | 'late' | 'review'

export interface SubmissionContentBlock {
  type: SubmissionBlockType
  content?: string
  language?: string
  file_id?: string
  filename?: string
}

export interface Submission {
  _id: string
  class_problem_id: string
  student_id: string
  content_blocks: SubmissionContentBlock[]
  is_late: boolean
  status: SubmissionStatus
  feedback: string
  reviewed_by: string | null
  reviewed_at: string | null
  createdAt: string
  updatedAt: string
}

export interface StudentSubmission {
  id: string
  contentBlocks: SubmissionContentBlock[]
  isLate: boolean
  status: SubmissionStatus
  feedback: string
  reviewedBy: {
    _id: string
    fullname: string
  } | null
  reviewedAt: string | null
  createdAt: string
}

export interface CreateSubmissionRequest {
  class_problem_id: string
  type?: SubmissionBlockType
  content?: string
  language?: string
  file_id?: string
  filename?: string
  content_blocks?: SubmissionContentBlock[]
}

export interface CreateSubmissionResponse {
  status: string
  message: string
  data: Submission
}

export interface SubmissionListItem {
  submission_id: string
  student: { id: string; name: string } | null
  problem: { id: string; title: string; problemType: string } | null
  class: { id: string; className: string } | null
  status: SubmissionStatus
  is_late: boolean
  submitted_at: string
}

export interface SubmissionDetail {
  submission_id: string
  content_blocks: SubmissionContentBlock[]
  student: { id: string; name: string } | null
  problem: { id: string; title: string } | null
  class: { id: string; className: string } | null
  status: SubmissionStatus
  is_late: boolean
  feedback: string
  reviewed_by: { id: string; name: string } | null
  reviewed_at: string | null
  submitted_at: string
}