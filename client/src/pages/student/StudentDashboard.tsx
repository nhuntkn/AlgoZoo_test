import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ClipboardList, Clock, Loader2 } from 'lucide-react'
import { StatCard } from '../../components/ui/StatCard'
import { Badge } from '../../components/ui/Badge'
import { useAuth } from '../../hooks/useAuth'
import { studentService } from '../../services/studentService'
import type { StudentClass } from '../../types/class'
import type { StudentDashboard as DashboardData } from '../../types/studentDashboard'

export function StudentDashboard() {
  const { user } = useAuth()
  const [classes, setClasses] = useState<StudentClass[]>([])
  const [selectedClass, setSelectedClass] = useState('')
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    studentService.getClasses().then((response) => { setClasses(response.data); setSelectedClass(response.data[0]?.classId || '') }).catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Unable to load classes')).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedClass) return
    setLoading(true)
    studentService.getDashboard(selectedClass).then((response) => setDashboard(response.data)).catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Unable to load dashboard')).finally(() => setLoading(false))
  }, [selectedClass])

  const firstName = user?.name.split(' ')[0] || 'there'
  const stats = dashboard?.stats

  return <div><div className="mb-5"><h1 className="text-2xl font-bold text-gray-900">Good morning, {firstName}</h1><p className="text-sm text-gray-400 mt-1">Here&apos;s your learning progress.</p></div>{classes.length > 1 && <div className="bg-white rounded-2xl shadow-sm p-4 mb-5"><label className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-4" htmlFor="student-class">Class</label><select id="student-class" value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm">{classes.map((item) => <option key={item.classId} value={item.classId}>{item.name}</option>)}</select></div>}{error && <p className="mb-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}{loading && <p className="mb-5 flex items-center gap-2 text-sm text-gray-400"><Loader2 size={16} className="animate-spin" /> Loading...</p>}<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5"><StatCard label="Total Problems" value={stats?.totalProblems ?? 0} icon={<ClipboardList size={18} className="text-blue-600" />} color="bg-blue-50" trend="Assigned to you" /><StatCard label="Reviewed Submissions" value={stats?.reviewedCount ?? 0} icon={<CheckCircle2 size={18} className="text-green-600" />} color="bg-green-50" trend={`${stats?.submittedCount ?? 0} submitted`} /><StatCard label="Pending Review" value={stats?.pendingReviewCount ?? 0} icon={<Clock size={18} className="text-amber-600" />} color="bg-amber-50" trend="Waiting for feedback" /></div><div className="grid lg:grid-cols-2 gap-5"><section className="bg-white rounded-2xl shadow-sm overflow-hidden"><div className="px-6 py-4 border-b border-gray-100 flex justify-between"><h2 className="font-bold text-gray-900">Upcoming Deadlines</h2><Link to={`/student/classes/${selectedClass}/problems`} className="text-xs text-accent font-semibold flex items-center gap-1">View all <ArrowRight size={12} /></Link></div>{dashboard?.upcomingDeadlines.length ? dashboard.upcomingDeadlines.map((item) => <Link key={item.classProblemId} to={`/student/classes/${selectedClass}/problems/${item.classProblemId}`} className="flex items-center justify-between px-6 py-4 border-b border-gray-50"><span className="text-sm font-medium text-gray-900">{item.title}</span><span className="text-xs text-gray-400">{item.daysLeft}</span></Link>) : <p className="p-6 text-sm text-gray-400">No upcoming deadlines.</p>}</section><section className="bg-white rounded-2xl shadow-sm overflow-hidden"><div className="px-6 py-4 border-b border-gray-100"><h2 className="font-bold text-gray-900">Recent Submissions</h2></div>{dashboard?.recentSubmissions.length ? dashboard.recentSubmissions.map((item) => <div key={item.submissionId} className="flex items-center justify-between px-6 py-4 border-b border-gray-50"><span className="text-sm font-medium text-gray-900">{item.title}</span><Badge variant={item.status === 'Reviewed' ? 'reviewed' : item.status === 'Late' ? 'late' : 'pending'}>{item.status}</Badge></div>) : <p className="p-6 text-sm text-gray-400">No submissions yet.</p>}</section></div></div>
}
