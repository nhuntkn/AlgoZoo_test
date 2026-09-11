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
}
