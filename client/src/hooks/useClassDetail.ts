import { useCallback, useEffect, useState } from 'react'
import { getClassDetail, type ClassDetail } from '../services/classroomService'

export function useClassDetail(classId: string) {
  const [classDetail, setClassDetail] = useState<ClassDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setClassDetail(await getClassDetail(classId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load class')
    } finally {
      setLoading(false)
    }
  }, [classId])

  useEffect(() => {
    void refetch()
  }, [refetch])

  return { classDetail, loading, error, refetch }
}