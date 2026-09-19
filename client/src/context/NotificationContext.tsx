import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../services/notificationService'
import type { Notification } from '../types/notification'

export type { Notification, NotificationType } from '../types/notification'

interface NotificationContextType {
  notifications: Notification[]
  loading: boolean
  refetch: () => void
  markRead: (id: string) => void
  markAllRead: () => void
  getUnreadCount: () => number
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)

  const refetch = useCallback(() => {
    if (!user) return
    setLoading(true)
    getNotifications()
      .then(setNotifications)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  useEffect(() => { refetch() }, [refetch])

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
    markNotificationRead(id).catch(() => {})
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    markAllNotificationsRead().catch(() => {})
  }

  const getUnreadCount = () => notifications.filter((n) => !n.isRead).length

  return (
    <NotificationContext.Provider
      value={{ notifications, loading, refetch, markRead, markAllRead, getUnreadCount }}
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
