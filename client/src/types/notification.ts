export type NotificationType =
  | 'ASSIGNMENT_ASSIGNED'
  | 'GRADE_RELEASED'
  | 'SUBMISSION_CREATED'
  | 'USER_REGISTERED'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  context: string
  entityType: 'submission' | 'problem' | 'class' | 'user'
  entityId: string
  linkTo: string
  isRead: boolean
  createdAt: string
}
