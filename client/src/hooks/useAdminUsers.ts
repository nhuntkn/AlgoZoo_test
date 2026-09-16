import { useCallback, useEffect, useState } from 'react'
import * as adminService from '../services/adminService'
import type { AdminUser } from '../types/admin'

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadUsers = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      setUsers(await adminService.getUsers())
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load users')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { void loadUsers() }, [loadUsers])

  const updateUserActive = async (user: AdminUser) => {
    const updated = await adminService.updateUserActive(user.id, !user.isActive)
    setUsers((current) => current.map((item) => item.id === updated.id ? updated : item))
  }

  return { users, isLoading, error, setError, updateUserActive, reload: loadUsers }
}
