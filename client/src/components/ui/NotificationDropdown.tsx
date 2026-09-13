import { useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Bell, CheckCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNotifications, formatRelative } from '../../context/NotificationContext'
import type { Notification } from '../../context/NotificationContext'

const typeIcon: Record<string, string> = {
  SUBMISSION_CREATED: '📥',
  SUBMISSION_RESUBMITTED: '🔁',
  SUBMISSION_LATE: '⏰',
  ASSIGNMENT_ASSIGNED: '📋',
  SUBMISSION_SUCCESS: '✅',
  GRADE_RELEASED: '🎓',
}

function NotifRow({ n, onClose }: { n: Notification; onClose: () => void }) {
  const { markRead } = useNotifications()
  const navigate = useNavigate()

  const handleClick = () => {
    markRead(n.id)
    onClose()
    navigate(n.linkTo)
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 flex gap-3 items-start ${
        !n.isRead ? 'bg-red-50/40' : ''
      }`}
    >
      {/* Unread dot */}
      <div className="mt-1.5 flex-shrink-0 w-2">
        {!n.isRead && <span className="block w-2 h-2 rounded-full bg-accent" />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-gray-900 truncate">{n.title}</span>
          <span className="text-[10px] text-gray-400 flex-shrink-0">{formatRelative(n.createdAt)}</span>
        </div>
        <p className="text-xs text-gray-600 mt-0.5 truncate">{n.message}</p>
        {n.context && (
          <p className="text-[10px] text-gray-400 mt-0.5">{n.context}</p>
        )}
      </div>
    </button>
  )
}

interface NotificationDropdownProps {
  onClose: () => void
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const { user } = useAuth()
  const { getForRole, getUnreadCount, markAllRead } = useNotifications()
  const ref = useRef<HTMLDivElement>(null)

  const notifs = getForRole(user.role)
  const unreadCount = getUnreadCount(user.role)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [onClose])

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Bell size={14} className="text-gray-600" />
          <span className="text-sm font-bold text-gray-900">Notifications</span>
          {unreadCount > 0 && (
            <span className="text-xs bg-accent text-white rounded-full px-1.5 py-0.5 font-semibold leading-none">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead(user.role)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-accent font-medium transition-colors"
          >
            <CheckCheck size={13} /> Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-[360px] overflow-y-auto">
        {notifs.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-gray-500 font-medium">You're all caught up.</p>
            <p className="text-xs text-gray-400 mt-1">No notifications yet.</p>
          </div>
        ) : (
          notifs.map((n) => <NotifRow key={n.id} n={n} onClose={onClose} />)
        )}
      </div>

      {/* Footer */}
      {notifs.length > 0 && (
        <div className="border-t border-gray-100 px-4 py-2.5">
          <Link
            to="/notifications"
            onClick={onClose}
            className="text-xs text-accent font-semibold hover:underline"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  )
}
