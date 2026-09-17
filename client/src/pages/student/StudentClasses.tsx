<<<<<<< HEAD
import { ArrowRight } from 'lucide-react'
import { ProgressBar } from '../../components/ui/ProgressBar'

const classes = [
  { id: 1, name: 'Algorithms 101', trainer: 'Nguyen Van Hung', problems: 20, progress: 60, cohort: 'Cohort 4' },
  { id: 2, name: 'Data Structures', trainer: 'Nguyen Van Hung', problems: 15, progress: 45, cohort: 'Cohort 4' },
  { id: 3, name: 'Competitive Programming', trainer: 'Tran Thi Mai', problems: 25, progress: 20, cohort: 'Cohort 3' },
  { id: 4, name: 'Graph Algorithms', trainer: 'Le Van An', problems: 18, progress: 72, cohort: 'Cohort 5' },
  { id: 5, name: 'Dynamic Programming', trainer: 'Pham Thi Huong', problems: 22, progress: 35, cohort: 'Cohort 4' },
]

export function StudentClasses() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
        <p className="text-gray-500 text-sm mt-1">Classes you are enrolled in</p>
      </div>
      <div className="grid grid-cols-3 gap-5">
        {classes.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border-t-4 border-accent shadow-sm hover:shadow-md transition-shadow p-5">
            <div className="mb-4">
              <h3 className="font-bold text-gray-900 text-lg">{c.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{c.cohort}</p>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-gray-400">Trainer:</span> {c.trainer}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-gray-400">Problems:</span> {c.problems}
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{c.progress}%</span>
              </div>
              <ProgressBar value={c.progress} />
            </div>
            <button className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium py-2 rounded-lg transition-colors">
              VIEW CLASS <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>
=======
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Loader2, Users } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { studentService } from '../../services/studentService'
import type { StudentClass } from '../../types/class'
import type { StudentDashboard } from '../../types/studentDashboard'

export function StudentClasses() {
  const [classes, setClasses] = useState<StudentClass[]>([])
  const [progress, setProgress] = useState<Record<string, StudentDashboard>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const response = await studentService.getClasses()
        setClasses(response.data)
        const dashboards = await Promise.all(response.data.map(async (item) => {
          try { return [item.classId, (await studentService.getDashboard(item.classId)).data] as const } catch { return null }
        }))
        setProgress(Object.fromEntries(dashboards.filter((item): item is readonly [string, StudentDashboard] => item !== null)))
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : 'Unable to load classes')
      } finally { setLoading(false) }
    }
    void load()
  }, [])

  return (
    <div>
      <div className="mb-7"><p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Student</p><h1 className="text-2xl font-bold text-gray-900">My Classes</h1></div>
      {error && <p className="mb-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      {loading ? <div className="py-16 flex items-center justify-center gap-2 text-sm text-gray-400"><Loader2 size={16} className="animate-spin" /> Loading classes...</div> : classes.length === 0 ? <div className="bg-white rounded-2xl shadow-sm py-16 text-center text-sm text-gray-400">You are not enrolled in any classes.</div> : <div className="space-y-4">{classes.map((item) => { const dashboard = progress[item.classId]; const total = dashboard?.stats.totalProblems ?? 0; const completed = dashboard?.stats.submittedCount ?? 0; const percent = total ? Math.round((completed / total) * 100) : 0; return <div key={item.classId} className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between gap-6"><div className="flex-1 min-w-0"><div className="flex items-center gap-2.5 mb-1"><h2 className="font-bold text-gray-900 text-lg truncate">{item.name}</h2><Badge variant={item.isActive ? 'ACTIVE' : 'INACTIVE'}>{item.isActive ? 'Active' : 'Inactive'}</Badge></div><p className="text-sm text-gray-400 mb-3">{item.description || 'No description'}</p><div className="flex items-center gap-4 mb-3 text-sm text-gray-500"><span className="flex items-center gap-1.5"><Users size={13} className="text-gray-400" /> Enrolled</span><span>{total} Problems</span></div><div className="max-w-xs"><div className="flex justify-between mb-1"><span className="text-xs text-gray-400">{completed} / {total} Problems Completed</span><span className="text-xs font-semibold text-gray-700">{percent}%</span></div><ProgressBar value={percent} /></div></div><Link to={`/student/classes/${item.classId}/overview`} className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-4 py-2 rounded-xl flex-shrink-0">Open Class <ArrowRight size={14} /></Link></div> })}</div>}
>>>>>>> d96b4f5600f620774943785cb2d6e27f419a5d6e
    </div>
  )
}
