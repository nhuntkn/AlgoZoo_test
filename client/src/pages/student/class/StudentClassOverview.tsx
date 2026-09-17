import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BookOpen, Check, Clock, Loader2, Users } from 'lucide-react'
import { ClassTabNav } from '../../../components/layout/ClassTabNav'
import { ProgressBar } from '../../../components/ui/ProgressBar'
import { studentService } from '../../../services/studentService'
import type { StudentClass } from '../../../types/class'
import type { StudentDashboard } from '../../../types/studentDashboard'
import type { StudentClassProblem } from '../../../types/classProblem'

export function StudentClassOverview() {
  const { classId = '' } = useParams()
  const [classInfo, setClassInfo] = useState<StudentClass | null>(null)
  const [dashboard, setDashboard] = useState<StudentDashboard | null>(null)
  const [problems, setProblems] = useState<StudentClassProblem[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const classes = (await studentService.getClasses()).data
        const current = classes.find((item) => item.classId === classId)
        if (!current) throw new Error('Class not found')
        setClassInfo(current)
        const [dash, probs] = await Promise.all([
          studentService.getDashboard(classId),
          studentService.getClassProblems(classId),
        ])
        setDashboard(dash.data)
        setProblems(probs.data)
      } catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Unable to load class') }
    }
    void load()
  }, [classId])

  if (error) return <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
  if (!classInfo || !dashboard) return <div className="py-16 flex justify-center gap-2 text-sm text-gray-400"><Loader2 size={16} className="animate-spin" /> Loading class...</div>

  const tabs = [{ label: 'Overview', to: `/student/classes/${classId}/overview` }, { label: 'Problems', to: `/student/classes/${classId}/problems` }]
  const total = dashboard.stats.totalProblems
  const completed = dashboard.stats.submittedCount
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div>
      <ClassTabNav
        crumbs={[{ label: 'My Classes', to: '/student/classes' }, { label: classInfo.name }]}
        title={classInfo.name}
        status={classInfo.isActive ? 'ACTIVE' : 'INACTIVE'}
        tabs={tabs}
      />

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Class Information */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-5">Class Information</h3>

          <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">Description</p>
          <p className="text-sm text-gray-700 mb-5">{classInfo.description || 'No description available.'}</p>

          <div className="flex gap-8 mb-5">
            <div>
              <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">Trainers</p>
              <span className="flex items-center gap-1.5 text-sm text-gray-700">
                <Users size={13} className="text-gray-400" /> {classInfo.totalTrainers}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">Students</p>
              <span className="flex items-center gap-1.5 text-sm text-gray-700">
                <Users size={13} className="text-gray-400" /> {classInfo.totalStudents}
              </span>
            </div>
          </div>

          <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">Your Progress</p>
          <div className="flex justify-between mb-1.5">
            <span className="text-sm text-gray-600">{completed} / {total} problems completed</span>
            <span className="text-sm font-semibold text-gray-800">{percent}%</span>
          </div>
          <ProgressBar value={percent} />
        </div>

        {/* Problem Progress */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <BookOpen size={16} className="text-gray-500" />
            <h3 className="font-bold text-gray-900">Problem Progress</h3>
          </div>
          {problems.length === 0 ? (
            <p className="text-sm text-gray-400">No problems assigned yet.</p>
          ) : (
            <div className="space-y-0">
              {problems.map((p) => (
                <div key={p.classProblemId} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-b-0">
                  <span className="text-sm text-gray-800">{p.problem?.title ?? 'Untitled'}</span>
                  {p.status === 'Reviewed' ? (
                    <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                      <Check size={13} /> Reviewed
                    </span>
                  ) : p.status === 'Pending' ? (
                    <span className="flex items-center gap-1 text-sm text-amber-500 font-medium">
                      <Clock size={13} /> Pending
                    </span>
                  ) : p.status === 'Late' ? (
                    <span className="flex items-center gap-1 text-sm text-orange-500 font-medium">
                      <Clock size={13} /> Late
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">Not started</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
