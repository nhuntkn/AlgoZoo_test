import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BookOpen, CheckCircle2, Clock, Loader2 } from 'lucide-react'
import { ClassTabNav } from '../../../components/layout/ClassTabNav'
import { StatCard } from '../../../components/ui/StatCard'
import { studentService } from '../../../services/studentService'
import type { StudentClass } from '../../../types/class'
import type { StudentDashboard } from '../../../types/studentDashboard'

export function StudentClassOverview() {
  const { classId = '' } = useParams()
  const [classInfo, setClassInfo] = useState<StudentClass | null>(null)
  const [dashboard, setDashboard] = useState<StudentDashboard | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const classes = (await studentService.getClasses()).data
        const current = classes.find((item) => item.classId === classId)
        if (!current) throw new Error('Class not found')
        setClassInfo(current)
        setDashboard((await studentService.getDashboard(classId)).data)
      } catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Unable to load class') }
    }
    void load()
  }, [classId])

  if (error) return <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
  if (!classInfo || !dashboard) return <div className="py-16 flex justify-center gap-2 text-sm text-gray-400"><Loader2 size={16} className="animate-spin" /> Loading class...</div>

  const tabs = [{ label: 'Overview', to: `/student/classes/${classId}/overview` }, { label: 'Problems', to: `/student/classes/${classId}/problems` }]
  return <div><ClassTabNav crumbs={[{ label: 'My Classes', to: '/student/classes' }, { label: classInfo.name }]} title={classInfo.name} status={classInfo.isActive ? 'ACTIVE' : 'INACTIVE'} tabs={tabs} /><div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"><StatCard label="Total Problems" value={dashboard.stats.totalProblems} icon={<BookOpen size={16} className="text-accent" />} color="bg-red-50" /><StatCard label="Reviewed" value={dashboard.stats.reviewedCount} icon={<CheckCircle2 size={16} className="text-green-600" />} color="bg-green-50" /><StatCard label="Pending Review" value={dashboard.stats.pendingReviewCount} icon={<Clock size={16} className="text-amber-600" />} color="bg-amber-50" /></div><div className="grid lg:grid-cols-2 gap-5"><div className="bg-white rounded-2xl shadow-sm p-6"><h3 className="font-bold text-gray-900 mb-4">Class Information</h3><p className="text-sm text-gray-600">{classInfo.description || 'No description available.'}</p></div><div className="bg-white rounded-2xl shadow-sm p-6"><h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>{dashboard.recentSubmissions.length ? dashboard.recentSubmissions.map((item) => <div key={item.submissionId} className="flex justify-between py-3 border-b border-gray-50"><span className="text-sm text-gray-700">{item.title}</span><span className="text-xs text-gray-400">{item.status}</span></div>) : <p className="text-sm text-gray-400">No submissions yet.</p>}</div></div></div>
}
