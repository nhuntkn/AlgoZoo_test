import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, CheckCheck } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useNotifications, formatRelative } from '../context/NotificationContext'
import type { Notification } from '../types/notification'

const typeLabel: Record<string, string> = {
  SUBMISSION_CREATED: 'Submissions',
  ASSIGNMENT_ASSIGNED: 'Assignments',
  GRADE_RELEASED: 'Grades',
  USER_REGISTERED: 'Members',
}

function groupByCategory(notifs: Notification[]): Record<string, Notification[]> {
  return notifs.reduce<Record<string, Notification[]>>((acc, n) => {
    const cat = typeLabel[n.type] ?? 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(n)
    return acc
  }, {})
}

const CATEGORY_ORDER = ['Submissions', 'Assignments', 'Grades', 'Members', 'Other']

function NotifItem({ n, onRead }: { n: Notification; onRead: (id: string) => void }) {
  const navigate = useNavigate()

  const handleClick = () => {
    onRead(n.id)
    navigate(n.linkTo)
  }

  return (
    <div
      onClick={handleClick}
      className={`flex gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${
        !n.isRead ? 'bg-red-50/30' : ''
      }`}
    >
      {/* Unread dot column */}
      <div className="mt-2 w-2 flex-shrink-0">
        {!n.isRead && <span className="block w-2 h-2 rounded-full bg-accent" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <p className={`text-sm font-semibold ${!n.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
            {n.title}
          </p>
          <span className="text-xs text-gray-400 flex-shrink-0 mt-0.5">{formatRelative(new Date(n.createdAt))}</span>
        </div>
        <p className={`text-sm mt-0.5 ${!n.isRead ? 'text-gray-700' : 'text-gray-500'}`}>
          {n.message}
        </p>
        {n.context && (
          <p className="text-xs text-gray-400 mt-1">{n.context}</p>
        )}
      </div>
    </div>
  )
}

type TabKey = 'all' | 'unread'

export function NotificationsPage() {
  const { user } = useAuth()
  const { notifications, getUnreadCount, markRead, markAllRead } = useNotifications()
  const [tab, setTab] = useState<TabKey>('all')

  if (!user) return null

  const all = notifications
  const unreadCount = getUnreadCount()
  const displayed = tab === 'unread' ? all.filter((n) => !n.isRead) : all
  const grouped = groupByCategory(displayed)
  const categories = CATEGORY_ORDER.filter((c) => grouped[c])

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Bell size={18} className="text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
            <p className="text-xs text-gray-400">{all.length} total · {unreadCount} unread</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead()}
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-accent font-semibold transition-colors"
          >
            <CheckCheck size={14} /> Mark all as read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5">
        {([
          { key: 'all' as TabKey, label: `All (${all.length})` },
          { key: 'unread' as TabKey, label: `Unread (${unreadCount})` },
        ]).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              tab === key
                ? 'bg-accent text-white'
                : 'bg-white text-gray-500 hover:bg-gray-50 shadow-sm'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Notification list */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm py-16 text-center">
          <Bell size={32} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-500 font-medium">You're all caught up.</p>
          <p className="text-sm text-gray-400 mt-1">
            {tab === 'unread' ? 'No unread notifications.' : 'No notifications yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Category header */}
              <div className="px-5 py-2.5 border-b border-gray-50">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{cat}</span>
              </div>
              {/* Items */}
              <div className="divide-y divide-gray-50">
                {grouped[cat].map((n) => (
                  <NotifItem key={n.id} n={n} onRead={markRead} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
