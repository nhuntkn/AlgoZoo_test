<<<<<<< HEAD
import { Link } from 'react-router-dom'
import { CheckCircle2, Play, Circle, ArrowRight, CalendarDays, User, Shield } from 'lucide-react'
import { Badge, StatusDot } from '../../components/ui/Badge'
import { ProgressBar } from '../../components/ui/ProgressBar'

const classInfo = {
  name: 'WeCamp Batch 15',
  startDate: 'Jan 15, 2025',
  endDate: 'Mar 30, 2025',
  trainer: 'Nguyen Van Hung',
  admin: 'Maya Tran',
  totalProblems: 35,
  completed: 24,
  submitted: 7,
  notStarted: 4,
}

const recentProblems = [
  { id: 1, title: 'Two Sum', difficulty: 'easy', topic: 'Array', status: 'reviewed', action: 'View' },
  { id: 2, title: 'Valid Parentheses', difficulty: 'medium', topic: 'Stack', status: 'submitted', action: 'View' },
  { id: 3, title: 'Binary Search', difficulty: 'easy', topic: 'Binary Search', status: 'not-started', action: 'Start' },
  { id: 4, title: 'Merge Sorted Lists', difficulty: 'hard', topic: 'Linked List', status: 'submitted', action: 'View' },
]

const progressPct = Math.round((classInfo.completed / classInfo.totalProblems) * 100)

function CircularProgress({ value }: { value: number }) {
  const r = 42
  const circ = 2 * Math.PI * r
  const dash = (value / 100) * circ
  return (
    <svg width="108" height="108" className="-rotate-90">
      <circle cx="54" cy="54" r={r} stroke="#e5e7eb" strokeWidth="10" fill="none" />
      <circle cx="54" cy="54" r={r} stroke="#dc2626" strokeWidth="10" fill="none"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      <text x="54" y="54" textAnchor="middle" dominantBaseline="middle"
        style={{ transform: 'rotate(90deg)', transformOrigin: '54px 54px', fontSize: '17px', fontWeight: '800', fill: '#111827', fontFamily: 'Sora, sans-serif' }}>
        {value}%
      </text>
    </svg>
  )
}

export function StudentDashboard() {
  return (
    <div className="space-y-7 pt-2">

      {/* Class Overview — rich info, no heavy card border */}
      <div className="bg-white rounded-2xl px-7 py-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Your Class</p>
            <h1 className="font-bold text-2xl text-gray-900 mb-3">{classInfo.name}</h1>
            <div className="flex items-center gap-6 text-sm text-gray-500 flex-wrap">
              <div className="flex items-center gap-1.5">
                <CalendarDays size={14} className="text-gray-400" />
                <span>{classInfo.startDate} — {classInfo.endDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User size={14} className="text-gray-400" />
                <span>Trainer: <span className="text-gray-700 font-medium">{classInfo.trainer}</span></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield size={14} className="text-gray-400" />
                <span>Admin: <span className="text-gray-700 font-medium">{classInfo.admin}</span></span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 mb-1">Total problems</p>
            <p className="font-bold text-3xl text-gray-900">{classInfo.totalProblems}</p>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-white rounded-2xl px-7 py-5 shadow-sm">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Overall Progress</p>
        <div className="flex items-center gap-8">
          {/* Circular + bar */}
          <div className="flex items-center gap-5">
            <CircularProgress value={progressPct} />
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-2">
                {classInfo.completed} / {classInfo.totalProblems} problems completed
              </p>
              <div className="w-48">
                <ProgressBar value={progressPct} height="h-2" />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 grid grid-cols-3 gap-4 ml-4">
            {[
              { icon: <CheckCircle2 size={18} className="text-gray-300" />, label: 'Completed', value: classInfo.completed },
              { icon: <Play size={18} className="text-gray-300" />, label: 'In Progress', value: classInfo.submitted },
              { icon: <Circle size={18} className="text-gray-300" />, label: 'Not Started', value: classInfo.notStarted },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center justify-center border border-gray-100 rounded-xl py-4 gap-1">
                {s.icon}
                <p className="font-bold text-3xl text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Problems */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl text-gray-900">Recent Problems</h2>
          <Link to="/student/problems" className="text-accent text-sm font-semibold hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[40px_1fr_100px_120px_140px_100px] gap-0 border-b border-gray-100 px-6 py-3">
            {['#', 'TITLE', 'DIFFICULTY', 'TOPIC', 'STATUS', 'ACTION'].map((h) => (
              <span key={h} className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{h}</span>
            ))}
          </div>

          {recentProblems.map((p, i) => (
            <div
              key={p.id}
              className={`grid grid-cols-[40px_1fr_100px_120px_140px_100px] gap-0 items-center px-6 py-4 hover:bg-gray-50 transition-colors ${
                i < recentProblems.length - 1 ? 'border-b border-gray-50' : ''
              }`}
            >
              <span className="text-sm text-gray-400">{i + 1}</span>
              <span className="text-sm font-semibold text-gray-900">{p.title}</span>
              <span>
                <Badge variant={p.difficulty as 'easy' | 'medium' | 'hard'}>
                  {p.difficulty.toUpperCase()}
                </Badge>
              </span>
              <span className="text-sm text-gray-500">{p.topic}</span>
              <span className="flex items-center gap-1.5">
                <StatusDot status={p.status} />
                <span className="text-sm text-gray-700 capitalize">{p.status === 'not-started' ? 'Not Started' : p.status.charAt(0).toUpperCase() + p.status.slice(1)}</span>
              </span>
              <span>
                <Link
                  to={`/student/problems/${p.id}`}
                  className="text-accent text-sm font-semibold hover:underline flex items-center gap-1"
                >
                  {p.action} <ArrowRight size={12} />
                </Link>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
=======
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
>>>>>>> d96b4f5600f620774943785cb2d6e27f419a5d6e
}
