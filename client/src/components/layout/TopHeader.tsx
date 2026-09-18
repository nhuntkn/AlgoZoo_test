import { useState } from 'react'
import { Bell, Search } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useNotifications } from '../../context/NotificationContext'
import { NotificationDropdown } from '../ui/NotificationDropdown'

export function TopHeader() {
  const { user } = useAuth()
  const { getUnreadCount } = useNotifications()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  if (!user) return null
  const unread = getUnreadCount(user.role)

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10 flex-shrink-0">
      <div className="relative max-w-xs w-full">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-accent/60 focus:bg-white transition-colors"
        />
      </div>

      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} className="text-gray-500" />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] flex items-center justify-center bg-accent text-white text-[10px] font-bold rounded-full px-1 leading-none">
                {unread > 99 ? '99+' : unread}
              </span>
            )}
          </button>
          {dropdownOpen && (
            <NotificationDropdown onClose={() => setDropdownOpen(false)} />
          )}
        </div>
      </div>
    </header>
  )
}
