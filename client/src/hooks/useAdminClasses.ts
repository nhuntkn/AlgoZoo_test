import { useCallback, useEffect, useState } from 'react'
import * as adminService from '../services/adminService'
import type { AdminClass } from '../types/admin'

export function useAdminClasses() {
  const [classes, setClasses] = useState<AdminClass[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadClasses = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      setClasses(await adminService.getClasses())
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load classes')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { void loadClasses() }, [loadClasses])

  const createClass = async (name: string, description: string) => {
    const created = await adminService.createClass(name, description)
    setClasses((current) => [created, ...current])
    return created
  }

  return { classes, isLoading, error, setError, createClass, reload: loadClasses }
}
