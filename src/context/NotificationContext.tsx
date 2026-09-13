import React, { createContext, useContext, useState } from 'react'
import type { Role } from './AuthContext'

export type NotificationType =
  | 'SUBMISSION_CREATED'
  | 'SUBMISSION_RESUBMITTED'
  | 'SUBMISSION_LATE'
  | 'ASSIGNMENT_ASSIGNED'
  | 'SUBMISSION_SUCCESS'
  | 'GRADE_RELEASED'

export interface Notification {
  id: number
  recipientRole: Role
  type: NotificationType
  title: string
  message: string
  context: string        // e.g. "WeCamp Batch 21 · DSA"
  entityType: 'submission' | 'problem' | 'class'
  entityId: string
  linkTo: string
  isRead: boolean
  createdAt: Date
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (n: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void
  markRead: (id: number) => void
  markAllRead: (role: Role) => void
  getForRole: (role: Role) => Notification[]
  getUnreadCount: (role: Role) => number
}

let nextNotifId = 100

const now = new Date()
const minsAgo = (m: number) => new Date(now.getTime() - m * 60 * 1000)

const seed: Notification[] = [
  {
    id: 1,
    recipientRole: 'trainer',
    type: 'SUBMISSION_CREATED',
    title: 'New submission',
    message: 'Alice Nguyen submitted Two Sum',
    context: 'WeCamp Batch 21 · DSA',
    entityType: 'submission',
    entityId: '1',
    linkTo: '/trainer/submissions/1',
    isRead: false,
    createdAt: minsAgo(2),
  },
  {
    id: 2,
    recipientRole: 'trainer',
    type: 'SUBMISSION_LATE',
    title: 'Late submission',
    message: 'Carol Lee submitted Two Sum after the deadline',
    context: 'WeCamp Batch 21 · DSA',
    entityType: 'submission',
    entityId: '3',
    linkTo: '/trainer/submissions/1',
    isRead: false,
    createdAt: minsAgo(15),
  },
  {
    id: 3,
    recipientRole: 'trainer',
    type: 'SUBMISSION_CREATED',
    title: 'New submission',
    message: 'Ha Le submitted Process Scheduling',
    context: 'WeCamp Batch 21 · OS',
    entityType: 'submission',
    entityId: '5',
    linkTo: '/trainer/submissions/1',
    isRead: true,
    createdAt: minsAgo(60),
  },
  {
    id: 4,
    recipientRole: 'student',
    type: 'ASSIGNMENT_ASSIGNED',
    title: 'New assignment',
    message: 'You have a new assignment: Binary Search',
    context: 'WeCamp Batch 22 · DSA',
    entityType: 'problem',
    entityId: '2',
    linkTo: '/student/classes/2/problems/2',
    isRead: false,
    createdAt: minsAgo(30),
  },
  {
    id: 5,
    recipientRole: 'student',
    type: 'GRADE_RELEASED',
    title: 'Submission graded',
    message: 'Your submission for Two Sum has been graded.',
    context: 'WeCamp Batch 22 · DSA',
    entityType: 'submission',
    entityId: '1',
    linkTo: '/student/submissions/1',
    isRead: true,
    createdAt: minsAgo(120),
  },
]

const NotificationContext = createContext<NotificationContextType | null>(null)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(seed)

  const addNotification = (n: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    setNotifications((prev) => [
      { ...n, id: nextNotifId++, isRead: false, createdAt: new Date() },
      ...prev,
    ])
  }

  const markRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  const markAllRead = (role: Role) => {
    setNotifications((prev) =>
      prev.map((n) => (n.recipientRole === role ? { ...n, isRead: true } : n))
    )
  }

  const getForRole = (role: Role) =>
    notifications.filter((n) => n.recipientRole === role)

  const getUnreadCount = (role: Role) =>
    notifications.filter((n) => n.recipientRole === role && !n.isRead).length

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markRead, markAllRead, getForRole, getUnreadCount }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be inside NotificationProvider')
  return ctx
}

export function formatRelative(date: Date): string {
  const diffMs = Date.now() - date.getTime()
  const diffMins = Math.floor(diffMs / 60_000)
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHrs = Math.floor(diffMins / 60)
  if (diffHrs < 24) return `${diffHrs}h ago`
  const diffDays = Math.floor(diffHrs / 24)
  return `${diffDays}d ago`
}
