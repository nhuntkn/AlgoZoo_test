import React, { createContext, useContext, useState } from 'react'

export type Role = 'student' | 'trainer' | 'admin'

export interface User {
  name: string
  email: string
  role: Role
  initials: string
}

interface AuthContextType {
  user: User
  setRole: (role: Role) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const defaultUser: User = {
  name: 'Juliana Silva',
  email: 'juliana@algozoo.com',
  role: 'student',
  initials: 'JS',
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser)

  const setRole = (role: Role) => {
    const names: Record<Role, { name: string; email: string; initials: string }> = {
      student: { name: 'Juliana Silva', email: 'juliana@algozoo.com', initials: 'JS' },
      trainer: { name: 'Nguyen Van Hung', email: 'hung@algozoo.com', initials: 'NH' },
      admin: { name: 'Maya Tran', email: 'maya@algozoo.com', initials: 'MT' },
    }
    setUser({ role, ...names[role] })
  }

  const logout = () => setUser(defaultUser)

  return <AuthContext.Provider value={{ user, setRole, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}

export function RoleSwitcher() {
  const { user, setRole } = useAuth()
  return (
    <div className="px-2 py-2">
      <p className="text-[10px] text-gray-500 mb-1 px-1">Demo Role</p>
      <select
        value={user.role}
        onChange={(e) => setRole(e.target.value as Role)}
        className="w-full bg-white/10 text-white text-xs rounded-lg px-2 py-1.5 border border-white/20 focus:outline-none"
      >
        <option value="student">Student</option>
        <option value="trainer">Trainer</option>
        <option value="admin">Admin</option>
      </select>
    </div>
  )
}
