import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Users } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { useAuth } from '../../hooks/useAuth'
import * as adminService from '../../services/adminService'
import type { AdminClass } from '../../types/admin'
import type { AdminDashboardData, AdminStudentProgress } from '../../types/adminDashboard'

function Metric({ label, value, detail, icon, tone }: { label: string; value: number; detail: string; icon: React.ReactNode; tone: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${tone}`}>{icon}</div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-bold text-gray-900 leading-tight">{value}</p>
        <p className="text-xs text-gray-400">{detail}</p>
      </div>
    </div>
  )
}

function StudentTable({ students }: { students: AdminStudentProgress[] }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center"><Users size={17} className="text-accent" /></div><h2 className="font-bold text-gray-900">Students</h2></div>
        <Link to="/admin/users" className="text-xs font-semibold text-accent flex items-center gap-1">View all <ArrowRight size={13} /></Link>
      </div>
      <div className="grid grid-cols-[1.5fr_1fr_80px_100px] px-6 py-2.5 bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 tracking-widest"><span>STUDENT</span><span>CLASS</span><span>DONE</span><span>PROGRESS</span></div>
      {students.length ? students.slice(0, 8).map((student) => (
        <div key={`${student.student_id}-${student.class_id}`} className="grid grid-cols-[1.5fr_1fr_80px_100px] items-center px-6 py-3.5 border-b border-gray-50">
          <div className="min-w-0"><p className="text-sm font-semibold text-gray-900 truncate">{student.fullname}</p><p className="text-xs text-gray-400 truncate">{student.email}</p></div>
          <span className="text-sm text-gray-500 truncate pr-2">{student.className}</span>
          <span className="text-sm text-gray-600">{student.submissionCount}/{student.problemCount}</span>
          <div><div className="flex justify-between text-xs text-gray-500 mb-1"><span>{student.progressPercent}%</span></div><div className="h-1.5 rounded-full bg-gray-100 overflow-hidden"><div className="h-full rounded-full bg-accent" style={{ width: `${student.progressPercent}%` }} /></div></div>
        </div>
      )) : <p className="p-6 text-sm text-gray-400">No student progress available.</p>}
    </section>
  )
}

export function AdminDashboard() {
  const { user } = useAuth()
  const [classes, setClasses] = useState<AdminClass[]>([])
  const [selectedClassId, setSelectedClassId] = useState('')
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadClasses = async () => {
      try { setClasses(await adminService.getClasses()) } catch { /* dashboard request reports the visible error */ }
    }
    void loadClasses()
  }, [])

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true)
      try {
        setError('')
        setDashboard((await adminService.getDashboard(selectedClassId || undefined)).data)
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : 'Unable to load dashboard')
      } finally {
        setIsLoading(false)
      }
    }
    void loadDashboard()
  }, [selectedClassId])

  return (
    <div>
      <div className="mb-5"><p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Admin</p><h1 className="text-2xl font-bold text-gray-900">Good morning, {user?.name?.split(' ')[0] || 'Admin'}</h1><p className="text-sm text-gray-400 mt-1">Platform overview from live backend data.</p></div>

      <div className="bg-white rounded-2xl shadow-sm p-4 mb-5 flex items-center justify-between gap-4"><label className="text-xs font-bold text-gray-400 uppercase tracking-widest" htmlFor="class-filter">Batch</label><select id="class-filter" value={selectedClassId} onChange={(event) => setSelectedClassId(event.target.value)} className="w-full max-w-xs border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-accent/60"><option value="">All Classes</option>{classes.map((classItem) => <option key={classItem.id} value={classItem.id}>{classItem.name}</option>)}</select></div>

      {error && <p className="mb-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      {isLoading && <p className="mb-5 text-sm text-gray-500">Loading dashboard...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5"><Metric label="Classes" value={dashboard?.classes.total ?? 0} detail={`${dashboard?.classes.active ?? 0} active · ${dashboard?.classes.inactive ?? 0} inactive`} icon={<BookOpen size={18} />} tone="bg-red-50 text-red-500" /><Metric label="Students" value={dashboard?.students.total ?? 0} detail={`${dashboard?.students.active ?? 0} active · ${dashboard?.students.inactive ?? 0} inactive`} icon={<Users size={18} />} tone="bg-blue-50 text-blue-500" /></div>

      <div className="grid xl:grid-cols-[3fr_2fr] gap-5 items-start"><StudentTable students={dashboard?.studentsProgress ?? []} /><div className="space-y-5"><section className="bg-white rounded-2xl shadow-sm overflow-hidden"><div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between"><h2 className="font-bold text-gray-900">Class Progress</h2><Link to="/admin/classes" className="text-xs font-semibold text-accent flex items-center gap-1">View all <ArrowRight size={13} /></Link></div>{dashboard?.classProgress.length ? dashboard.classProgress.map((item) => <Link key={item.class_id} to={`/admin/classes/${item.class_id}/manage`} className="block px-5 py-3.5 border-b border-gray-50 hover:bg-gray-50"><div className="flex items-center justify-between gap-2 mb-1"><span className="text-sm font-semibold text-gray-900 truncate">{item.name}</span><Badge variant={item.isActive ? 'active' : 'disabled'}>{item.isActive ? 'Active' : 'Inactive'}</Badge></div><div className="flex justify-between text-xs text-gray-400 mb-1"><span>{item.studentCount} students · {item.problemCount} problems</span><span>{item.progressPercent}%</span></div><div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-accent rounded-full" style={{ width: `${item.progressPercent}%` }} /></div></Link>) : <p className="p-5 text-sm text-gray-400">No class progress available.</p>}</section><section className="bg-white rounded-2xl shadow-sm p-5"><h2 className="font-bold text-gray-900 mb-4">Subject Overview</h2>{dashboard?.subjectOverview.length ? dashboard.subjectOverview.map((subject) => <div key={subject.problemType} className="mb-4 last:mb-0"><div className="flex justify-between text-xs mb-1.5"><span className="font-semibold text-gray-700">{subject.problemType === 'Database' ? 'Database' : subject.problemType}</span><span className="text-gray-400">{subject.submissionCount} submissions · {subject.progressPercent}%</span></div><div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-accent rounded-full" style={{ width: `${subject.progressPercent}%` }} /></div></div>) : <p className="text-sm text-gray-400">No subject progress available.</p>}</section></div></div>
    </div>
  )
}
