export type SubmissionStatus = 'pending' | 'late' | 'review'

export type SubmissionListItem = {
  submission_id: string
  student: { id: string; name: string } | null
  problem: { id: string; title: string; problemType: string } | null
  class: { id: string; className: string } | null
  status: SubmissionStatus
  is_late: boolean
  submitted_at: string
}

export type ContentBlock = {
  type: 'text' | 'code' | 'image' | 'file'
  content?: string
  language?: string
  file_id?: string
  filename?: string
}

export type SubmissionDetail = {
  submission_id: string
  content_blocks: ContentBlock[]
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
