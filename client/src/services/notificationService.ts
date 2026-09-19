import { api } from './api'
import type { Notification } from '../types/notification'

export function getNotifications() {
  return api.get<{ data: Notification[] }>('/notifications').then((response) => response.data)
}

export function markNotificationRead(id: string) {
  return api.patch(`/notifications/${id}/read`)
}

export function markAllNotificationsRead() {
  return api.patch('/notifications/read-all')
}
