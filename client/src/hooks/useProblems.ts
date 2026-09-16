import { useCallback, useEffect, useState } from 'react'
import { listProblems } from '../services/problemService'
import type { Problem } from '../types/problem'

export function useProblems() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setProblems(await listProblems())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load problems')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refetch()
  }, [refetch])

  return { problems, setProblems, loading, error, refetch }
}
