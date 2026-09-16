import React, { createContext, useContext, useEffect, useState } from 'react'

export type Role = 'student' | 'trainer' | 'admin'

export interface User {
  name: string
  email: string
  role: Role
  initials: string
}

interface AuthContextType {
  user: User | null
  authLoading: boolean
  login: (email: string, password: string) => Promise<User>
  register: (token: string, fullname: string, email: string, password: string) => Promise<User>
  setRole: (role: Role) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

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
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  const toUser = (account: Record<string, unknown>): User => ({
    name: (account.fullname || account.name || 'User') as string,
    email: (account.email || '') as string,
    role: (account.role as Role) || 'student',
    initials: getInitials((account.fullname || account.name) as string),
  })

  useEffect(() => {
    const restoreSession = async () => {
      try {
        let res = await fetch(`${API_URL}/api/auth/me`, { credentials: 'include' })

        if (res.status === 401) {
          const refreshResponse = await fetch(`${API_URL}/api/auth/refresh-token`, {
            credentials: 'include',
          })

          if (refreshResponse.ok) {
            res = await fetch(`${API_URL}/api/auth/me`, { credentials: 'include' })
          }
        }

        if (!res.ok) return

        const data = await res.json()
        if (data?.data) setUser(toUser(data.data))
      } finally {
        setAuthLoading(false)
      }
    }

    void restoreSession()
  }, [])

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
    const nextUser = toUser(loggedInUser)

    setUser(nextUser)
    return nextUser
  }

  const register = async (token: string, fullname: string, email: string, password: string): Promise<User> => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ token, fullname, email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data?.message || 'Registration failed')
    }

    const registeredUser = data?.data?.user ?? {}
    const nextUser = toUser({ ...registeredUser, email: registeredUser?.email || email })

    setUser(nextUser)
    return nextUser
  }

  const setRole = (role: Role) => {
    setUser((current) => ({
      ...(current || { name: '', email: '', initials: '' }),
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
      setUser(null)
    }
  }

  return <AuthContext.Provider value={{ user, authLoading, login, register, setRole, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}

export function RoleSwitcher() {
  const { user, setRole } = useAuth()
  if (!user) return null
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
