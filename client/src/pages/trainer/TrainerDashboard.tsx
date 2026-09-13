import { Link } from 'react-router-dom'
import { BookOpen, Users, Clock, CheckCircle, ArrowRight } from 'lucide-react'
import { StatCard } from '../../components/ui/StatCard'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { useAuth } from '../../context/AuthContext'

const recentSubmissions = [
  { id: 1, student: 'Alice Nguyen', initials: 'AN', problem: 'Two Sum', class: 'Batch 21', submittedAt: 'Sep 10', status: 'PENDING' as const },
  { id: 2, student: 'Bob Tran', initials: 'BT', problem: 'Binary Search', class: 'Batch 21', submittedAt: 'Sep 9', status: 'REVIEWED' as const },
  { id: 3, student: 'Carol Lee', initials: 'CL', problem: 'Two Sum', class: 'Batch 22', submittedAt: 'Sep 11', status: 'PENDING' as const },
  { id: 4, student: 'Minh Pham', initials: 'MP', problem: 'Binary Search', class: 'Batch 22', submittedAt: 'Sep 12', status: 'REVIEWED' as const },
  { id: 5, student: 'Ha Le', initials: 'HL', problem: 'Process Scheduling', class: 'Batch 21', submittedAt: 'Sep 8', status: 'PENDING' as const },
]

const classProgress = [
  { id: 1, name: 'WeCamp Batch 21', students: 25, submitted: 18, total: 25 },
  { id: 2, name: 'WeCamp Batch 22', students: 23, submitted: 10, total: 23 },
]

export function TrainerDashboard() {
  const { user } = useAuth()
  if (!user) return null
  const firstName = user.name.split(' ')[0]

  return (
    <div>
      {/* Greeting */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900">Good morning, {firstName}</h1>
        <p className="text-sm text-gray-400 mt-1">Here's what's happening in your classes.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Active Classes"
          value={2}
          icon={<BookOpen size={18} className="text-accent" />}
          color="bg-red-50"
          trend="All currently active"
        />
        <StatCard
          label="Active Students"
          value={48}
          icon={<Users size={18} className="text-blue-600" />}
          color="bg-blue-50"
          trend="Across 2 classes"
        />
        <StatCard
          label="Pending Submissions"
          value={15}
          icon={<Clock size={18} className="text-amber-600" />}
          color="bg-amber-50"
          trend="Needs your review"
        />
        <StatCard
          label="Reviewed This Week"
          value={23}
          icon={<CheckCircle size={18} className="text-green-600" />}
          color="bg-green-50"
          trend="+8 since last week"
        />
      </div>

      {/* Bottom grid */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Recent Submissions */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Recent Submissions</h2>
            <Link to="/trainer/classes" className="text-xs text-accent font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div>
            <div className="grid grid-cols-[1fr_120px_90px_90px_80px] px-6 py-2 border-b border-gray-50">
              {['STUDENT', 'PROBLEM', 'CLASS', 'SUBMITTED', 'STATUS'].map((h) => (
                <span key={h} className="text-[10px] font-bold text-gray-400 tracking-widest">{h}</span>
              ))}
            </div>
            {recentSubmissions.map((s, i) => (
              <Link
                key={s.id}
                to={`/trainer/submissions/${s.id}`}
                className={`grid grid-cols-[1fr_120px_90px_90px_80px] items-center px-6 py-3.5 hover:bg-gray-50 transition-colors ${
                  i < recentSubmissions.length - 1 ? 'border-b border-gray-50' : ''
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-accent text-white text-[10px] flex items-center justify-center font-bold flex-shrink-0">
                    {s.initials}
                  </div>
                  <span className="text-sm font-medium text-gray-900 truncate">{s.student}</span>
                </div>
                <span className="text-sm text-gray-600 truncate">{s.problem}</span>
                <span className="text-sm text-gray-400">{s.class}</span>
                <span className="text-sm text-gray-400">{s.submittedAt}</span>
                <div className="flex justify-end">
                  {s.status === 'PENDING' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline">
                      Review <ArrowRight size={11} />
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">Done</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Class Progress */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Class Progress</h2>
          </div>
          <div className="p-5 space-y-5">
            {classProgress.map((c) => {
              const pct = Math.round((c.submitted / c.total) * 100)
              return (
                <div key={c.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <Link to={`/trainer/classes/${c.id}/overview`} className="text-sm font-semibold text-gray-900 hover:text-accent transition-colors">
                      {c.name}
                    </Link>
                    <span className="text-xs text-gray-400">{c.students} students</span>
                  </div>
                  <ProgressBar value={pct} />
                  <p className="text-xs text-gray-400 mt-1">{c.submitted} / {c.total} submitted · {pct}%</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
