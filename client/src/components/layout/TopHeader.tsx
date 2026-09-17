import { Bell } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'

export function TopHeader() {
  const { user } = useAuth()
  const { getUnreadCount } = useNotifications()
  const unread = getUnreadCount(user.role)

  return (
    <header className="h-[60px] flex items-center justify-between px-8 flex-shrink-0">
      <div />

      {/* Notification bell */}
      <button className="relative p-2 rounded-xl hover:bg-white transition-colors">
        <Bell size={20} className="text-gray-500" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
    </header>
  )
}
