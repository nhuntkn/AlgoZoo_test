import { NavLink, useNavigate } from 'react-router-dom'
import { Home, Code2, FileText, Users, Settings, LogOut, LayoutDashboard, BookOpen, UserCog, Library } from 'lucide-react'
import { useAuth, RoleSwitcher } from '../../context/AuthContext'

interface NavItem { to: string; icon: React.ReactNode; label: string }

function getNavItems(role: string): NavItem[] {
  if (role === 'student') return [
    { to: '/student/dashboard', icon: <Home size={18} />, label: 'Home' },
    { to: '/student/problems', icon: <Code2 size={18} />, label: 'Problems' },
    { to: '/student/submissions', icon: <FileText size={18} />, label: 'Submissions' },
  ]
  if (role === 'trainer') return [
    { to: '/trainer/classes', icon: <BookOpen size={18} />, label: 'Classes' },
    { to: '/trainer/submissions', icon: <FileText size={18} />, label: 'Submissions' },
    { to: '/trainer/students', icon: <Users size={18} />, label: 'Students' },
  ]
  // admin
  return [
    { to: '/admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/admin/users', icon: <UserCog size={18} />, label: 'Users' },
    { to: '/admin/classes', icon: <BookOpen size={18} />, label: 'Classes' },
    { to: '/admin/problems', icon: <Library size={18} />, label: 'Problems' },
  ]
}

export function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const navItems = getNavItems(user.role)

  return (
    <div className="fixed left-0 top-0 h-screen w-[185px] bg-sidebar flex flex-col z-10">
      <div className="px-4 pt-5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user.initials}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate leading-tight">{user.name}</p>
            <p className="text-gray-400 text-[11px] truncate">{user.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2 py-2 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'bg-accent text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 pt-2 pb-4">
        <RoleSwitcher />
        <div className="px-2 mt-1 space-y-0.5">
          <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-all">
            <Settings size={16} /> Setting
          </button>
          <button
            onClick={() => { logout(); navigate('/login') }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </div>
    </div>
  )
}
