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
  login: (email: string, password: string) => Promise<User>
  setRole: (role: Role) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const defaultUser: User = {
  name: 'Juliana Silva',
  email: 'juliana@algozoo.com',
  role: 'student',
  initials: 'JS',
}

const getInitials = (name?: string) => {
  if (!name || typeof name !== 'string') return 'U'

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser)

  const login = async (email: string, password: string): Promise<User> => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data?.result?.message || data?.message || 'Login failed')
    }

    const loggedInUser = data?.result?.data ?? {}
    const nextUser: User = {
      name: loggedInUser?.fullname || loggedInUser?.name || 'User',
      email: loggedInUser?.email || '',
      role: (loggedInUser?.role as Role) || 'student',
      initials: getInitials(loggedInUser?.name),
    }

    setUser(nextUser)
    return nextUser
  }

  const setRole = (role: Role) => {
    setUser((current) => ({
      ...current,
      role,
    }))
  }

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } finally {
      setUser(defaultUser)
    }
  }

  return <AuthContext.Provider value={{ user, login, setRole, logout }}>{children}</AuthContext.Provider>
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
