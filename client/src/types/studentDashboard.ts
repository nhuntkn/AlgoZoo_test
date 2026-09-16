export type StudentDisplaySubmissionStatus = 'Pending' | 'Reviewed' | 'Late'

export interface StudentDashboardStats {
  totalProblems: number
  submittedCount: number
  reviewedCount: number
  pendingReviewCount: number
}

export interface UpcomingDeadline {
  classProblemId: string
  title: string
  className: string
  deadline: string
  daysLeft: string
}

export interface RecentSubmission {
  submissionId: string
  classProblemId: string
  title: string
  className: string
  status: StudentDisplaySubmissionStatus
  feedback: string
  submittedAt: string
}

export interface StudentDashboard {
  stats: StudentDashboardStats
  upcomingDeadlines: UpcomingDeadline[]
  recentSubmissions: RecentSubmission[]
}

export interface StudentDashboardResponse {
  status: string
  message?: string
  data: StudentDashboard
}