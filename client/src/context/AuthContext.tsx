import React, { createContext, useEffect, useState } from 'react'
import * as authService from '../services/authService'
import { ApiError } from '../types/api'
import type { Role, User } from '../types/auth'

interface AuthContextType {
  user: User | null
  authLoading: boolean
  login: (email: string, password: string) => Promise<User>
  register: (token: string, fullname: string, email: string, password: string) => Promise<User>
  setRole: (role: Role) => void
  logout: () => Promise<void>
}
export const AuthContext = createContext<AuthContextType | null>(null)

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
        let data
        try {
          data = await authService.getCurrentUser()
        } catch (error) {
          if (!(error instanceof ApiError) || error.status !== 401) throw error
          await authService.refreshToken()
          data = await authService.getCurrentUser()
        }

        const currentUser = data?.data?.user as Record<string, unknown> | undefined
        if (currentUser) setUser(toUser(currentUser))
      } finally {
        setAuthLoading(false)
      }
    }

    void restoreSession()
  }, [])

  const login = async (email: string, password: string): Promise<User> => {
    const data = await authService.login(email, password)

    const loggedInUser = data?.result?.data ?? {}
    const nextUser = toUser(loggedInUser)

    setUser(nextUser)
    return nextUser
  }

  const register = async (token: string, fullname: string, email: string, password: string): Promise<User> => {
    const data = await authService.register(token, fullname, email, password)

    const registeredUser = (data?.data?.user ?? {}) as Record<string, unknown>
    const nextUser = toUser({ ...registeredUser, email: registeredUser.email || email })

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
      await authService.logout()
    } finally {
      setUser(null)
    }
  }

  return <AuthContext.Provider value={{ user, authLoading, login, register, setRole, logout }}>{children}</AuthContext.Provider>
}

