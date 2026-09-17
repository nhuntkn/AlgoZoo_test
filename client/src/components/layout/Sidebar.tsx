import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, BookOpen, FileText, Settings, LogOut, Users } from 'lucide-react'
import { useAuth, RoleSwitcher } from '../../context/AuthContext'
import type { Role } from '../../types'

type NavItem = {
  label: string
  to: string
  icon: React.ReactNode
}

const menuItems: Record<Role, NavItem[]> = {
  student: [
    { label: 'Dashboard', to: '/student/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'My Classes', to: '/student/classes', icon: <BookOpen size={18} /> },
    { label: 'My Submissions', to: '/student/submissions', icon: <FileText size={18} /> },
  ],
  trainer: [
    { label: 'Dashboard', to: '/trainer/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'My Classes', to: '/trainer/classes', icon: <BookOpen size={18} /> },
    { label: 'Problem Bank', to: '/trainer/problems', icon: <FileText size={18} /> },
  ],
  admin: [
    { label: 'Dashboard', to: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Classes', to: '/admin/classes', icon: <BookOpen size={18} /> },
    { label: 'Users', to: '/admin/users', icon: <Users size={18} /> },
  ],
}

export function Sidebar() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const items = menuItems[user.role]

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[200px] bg-sidebar flex flex-col z-30">
      {/* User profile */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
            {user.initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user.role}</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-2">
          Menu
        </p>
        <div className="space-y-1">
          {items.map((item) => {
            const isActive = location.pathname.startsWith(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent text-white'
                    : 'text-gray-400 hover:text-white hover:bg-sidebar-hover'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* General section */}
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mt-6 mb-2">
          General
        </p>
        <Link
          to="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-sidebar-hover transition-colors"
        >
          <Settings size={18} />
          Settings
        </Link>
      </nav>

      {/* Demo role switcher — remove in production */}
      <RoleSwitcher />

      {/* Logout */}
      <div className="px-3 pb-5">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-sidebar-hover transition-colors w-full"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </aside>
  )
}
