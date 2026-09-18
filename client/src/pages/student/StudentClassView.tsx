import { useParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { StudentProblemList } from './class/StudentProblemList'
import { studentService } from '../../services/studentService'
import { useEffect, useState } from 'react'
import type { StudentClass } from '../../types/class'

export function StudentClassView() {
  const { classId = '' } = useParams()
  const [classInfo, setClassInfo] = useState<StudentClass | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    studentService.getClasses()
      .then((response) => {
        const current = response.data.find((item) => item.classId === classId)
        if (!current) throw new Error('Class not found')
        setClassInfo(current)
      })
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Unable to load class'))
  }, [classId])

  if (error) return <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
  if (!classInfo) return <div className="py-16 flex justify-center gap-2 text-sm text-gray-400"><Loader2 size={16} className="animate-spin" /> Loading class...</div>

  return <StudentProblemList />
}