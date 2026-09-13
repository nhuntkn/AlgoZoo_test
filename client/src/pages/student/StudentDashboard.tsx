import { Link } from 'react-router-dom'
import { BookOpen, ClipboardList, Send, Clock, ArrowRight } from 'lucide-react'
import { StatCard } from '../../components/ui/StatCard'
import { Badge } from '../../components/ui/Badge'
import { useAuth } from '../../context/AuthContext'

const deadlines = [
  { id: 2, classId: '2', problem: 'Binary Search', class: 'Batch 22', deadline: 'Sep 22, 2026', daysLeft: 10 },
  { id: 4, classId: '2', problem: 'Process Scheduling', class: 'Batch 22', deadline: 'Sep 18, 2026', daysLeft: 6 },
  { id: 6, classId: '2', problem: 'SQL Queries', class: 'Batch 22', deadline: 'Sep 15, 2026', daysLeft: 2 },
]

const recentSubmissions = [
  { id: 1, problem: 'Two Sum', class: 'Batch 22', status: 'REVIEWED' as const, submittedAt: 'Sep 10' },
  { id: 2, problem: 'Binary Search', class: 'Batch 22', status: 'PENDING' as const, submittedAt: 'Sep 14' },
]


export function StudentDashboard() {
  const { user } = useAuth()
  const firstName = user.name.split(' ')[0]

  const daysLeftColor = (days: number) => {
    if (days <= 2) return 'text-red-600 font-semibold'
    if (days <= 7) return 'text-orange-500 font-medium'
    return 'text-gray-500'
  }

  return (
    <div>
      {/* Greeting */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900">Good morning, {firstName}</h1>
        <p className="text-sm text-gray-400 mt-1">Here's your learning progress.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Active Classes"
          value={1}
          icon={<BookOpen size={18} className="text-accent" />}
          color="bg-red-50"
          trend="Currently enrolled"
        />
        <StatCard
          label="Active Problems"
          value={6}
          icon={<ClipboardList size={18} className="text-blue-600" />}
          color="bg-blue-50"
          trend="Assigned to you"
        />
        <StatCard
          label="Submitted"
          value={3}
          icon={<Send size={18} className="text-green-600" />}
          color="bg-green-50"
          trend="3 / 6 problems"
        />
        <StatCard
          label="Pending Review"
          value={2}
          icon={<Clock size={18} className="text-amber-600" />}
          color="bg-amber-50"
          trend="Waiting for feedback"
        />
      </div>

      {/* Bottom grid */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Upcoming Deadlines</h2>
            <Link to="/student/classes/2/problems" className="text-xs text-accent font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div>
            <div className="grid grid-cols-[1fr_80px_110px_60px] px-6 py-2 border-b border-gray-50">
              {['PROBLEM', 'CLASS', 'DEADLINE', 'LEFT'].map((h) => (
                <span key={h} className="text-[10px] font-bold text-gray-400 tracking-widest">{h}</span>
              ))}
            </div>
            {deadlines.map((d, i) => (
              <Link
                key={d.id}
                to={`/student/classes/${d.classId}/problems/${d.id}`}
                className={`grid grid-cols-[1fr_80px_110px_60px] items-center px-6 py-3.5 hover:bg-gray-50 transition-colors ${
                  i < deadlines.length - 1 ? 'border-b border-gray-50' : ''
                }`}
              >
                <span className="text-sm font-medium text-gray-900">{d.problem}</span>
                <span className="text-sm text-gray-400">{d.class}</span>
                <span className="text-sm text-gray-500">{d.deadline}</span>
                <span className={`text-sm ${daysLeftColor(d.daysLeft)}`}>{d.daysLeft}d</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Recent Submissions</h2>
            <Link to="/student/submissions" className="text-xs text-accent font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div>
            <div className="grid grid-cols-[1fr_80px_120px_80px] px-6 py-2 border-b border-gray-50">
              {['PROBLEM', 'CLASS', 'STATUS', 'DATE'].map((h) => (
                <span key={h} className="text-[10px] font-bold text-gray-400 tracking-widest">{h}</span>
              ))}
            </div>
            {recentSubmissions.map((s, i) => (
              <Link
                key={s.id}
                to={`/student/submissions/${s.id}`}
                className={`grid grid-cols-[1fr_80px_120px_80px] items-center px-6 py-3.5 hover:bg-gray-50 transition-colors ${
                  i < recentSubmissions.length - 1 ? 'border-b border-gray-50' : ''
                }`}
              >
                <span className="text-sm font-medium text-gray-900">{s.problem}</span>
                <span className="text-sm text-gray-400">{s.class}</span>
                <div className="flex items-center">
                  <Badge variant={s.status === 'PENDING' ? 'pending' : 'reviewed'}>
                    {s.status === 'PENDING' ? 'Pending' : 'Reviewed'}
                  </Badge>
                </div>
                <span className="text-sm text-gray-400">{s.submittedAt}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
