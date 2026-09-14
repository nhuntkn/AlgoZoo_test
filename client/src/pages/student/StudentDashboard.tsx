import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ClipboardList, CheckCircle2, Clock, ArrowRight } from 'lucide-react'
import { StatCard } from '../../components/ui/StatCard'
import { Badge } from '../../components/ui/Badge'
import { useAuth } from '../../context/AuthContext'

type FilterStatus = 'reviewed' | 'pending' | 'not-started' | null

const deadlines = [
  { id: 2, classId: '2', problem: 'Binary Search',      class: 'Batch 22', deadline: 'Sep 22, 2026', daysLeft: 10 },
  { id: 4, classId: '2', problem: 'Process Scheduling', class: 'Batch 22', deadline: 'Sep 18, 2026', daysLeft: 6  },
  { id: 6, classId: '2', problem: 'SQL Queries',        class: 'Batch 22', deadline: 'Sep 15, 2026', daysLeft: 2  },
]

const recentSubmissions = [
  { id: 1, problem: 'Two Sum',       class: 'Batch 22', status: 'REVIEWED' as const, submittedAt: 'Sep 10' },
  { id: 2, problem: 'Binary Search', class: 'Batch 22', status: 'PENDING'  as const, submittedAt: 'Sep 14' },
]

// Assignment breakdown data
const totalProblems   = 6
const reviewed        = 1
const pendingReview   = 2
const notStarted      = 3
const reviewedPct     = Math.round((reviewed      / totalProblems) * 100)
const pendingPct      = Math.round((pendingReview / totalProblems) * 100)
const notStartedPct   = 100 - reviewedPct - pendingPct

// Learning progress by topic
const topicProgress = [
  { label: 'DSA',      total: 3, submitted: 2, color: 'bg-blue-500'   },
  { label: 'OS',       total: 2, submitted: 1, color: 'bg-purple-500' },
  { label: 'Database', total: 1, submitted: 0, color: 'bg-emerald-500'},
]

export function StudentDashboard() {
  const { user } = useAuth()
  const firstName = user.name.split(' ')[0]
  const [activeFilter, setActiveFilter] = useState<FilterStatus>(null)

  const toggleFilter = (status: FilterStatus) =>
    setActiveFilter((prev) => (prev === status ? null : status))

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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard
          label="Active Classes"
          value={1}
          icon={<BookOpen size={18} className="text-accent" />}
          color="bg-red-50"
          trend="Currently enrolled"
        />
        <StatCard
          label="Total Problems"
          value={totalProblems}
          icon={<ClipboardList size={18} className="text-blue-600" />}
          color="bg-blue-50"
          trend="Assigned to you"
        />
        <StatCard
          label="Reviewed Submissions"
          value={reviewed}
          icon={<CheckCircle2 size={18} className="text-green-600" />}
          color="bg-green-50"
          trend={`${reviewed} / ${totalProblems} problems`}
        />
        <StatCard
          label="Pending Review"
          value={pendingReview}
          icon={<Clock size={18} className="text-amber-600" />}
          color="bg-amber-50"
          trend="Waiting for feedback"
        />
      </div>

      {/* Middle section: Assignment Breakdown + Learning Progress */}
      <div className="grid lg:grid-cols-[3fr_2fr] gap-5 mb-5">

        {/* Assignment Breakdown — interactive */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900">Assignment Breakdown</h2>
            <div className="flex items-center gap-2">
              {activeFilter && (
                <button
                  onClick={() => setActiveFilter(null)}
                  className="text-[10px] text-gray-400 hover:text-accent underline"
                >
                  Clear filter
                </button>
              )}
              <span className="text-xs text-gray-400">{totalProblems} total problems</span>
            </div>
          </div>

          {/* Stacked bar — each segment clickable */}
          <div className="flex rounded-xl overflow-hidden h-8 mb-4 gap-0.5">
            {reviewedPct > 0 && (
              <button
                onClick={() => toggleFilter('reviewed')}
                className={`flex items-center justify-center text-white text-xs font-semibold transition-all cursor-pointer hover:brightness-110 active:scale-y-95 ${
                  activeFilter === 'reviewed' ? 'bg-green-600 ring-2 ring-green-400 ring-inset' : 'bg-green-500'
                } ${activeFilter && activeFilter !== 'reviewed' ? 'opacity-30' : ''}`}
                style={{ width: `${reviewedPct}%` }}
              >
                {reviewedPct}%
              </button>
            )}
            {pendingPct > 0 && (
              <button
                onClick={() => toggleFilter('pending')}
                className={`flex items-center justify-center text-white text-xs font-semibold transition-all cursor-pointer hover:brightness-110 active:scale-y-95 ${
                  activeFilter === 'pending' ? 'bg-amber-500 ring-2 ring-amber-300 ring-inset' : 'bg-amber-400'
                } ${activeFilter && activeFilter !== 'pending' ? 'opacity-30' : ''}`}
                style={{ width: `${pendingPct}%` }}
              >
                {pendingPct}%
              </button>
            )}
            {notStartedPct > 0 && (
              <button
                onClick={() => toggleFilter('not-started')}
                className={`flex items-center justify-center text-gray-500 text-xs font-semibold transition-all cursor-pointer hover:brightness-95 active:scale-y-95 ${
                  activeFilter === 'not-started' ? 'bg-gray-300 ring-2 ring-gray-400 ring-inset' : 'bg-gray-200'
                } ${activeFilter && activeFilter !== 'not-started' ? 'opacity-30' : ''}`}
                style={{ width: `${notStartedPct}%` }}
              >
                {notStartedPct}%
              </button>
            )}
          </div>

          {/* Legend — clickable pills */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            {([
              { status: 'reviewed'    as FilterStatus, dot: 'bg-green-500', label: 'Reviewed',       value: reviewed      },
              { status: 'pending'     as FilterStatus, dot: 'bg-amber-400', label: 'Pending Review', value: pendingReview },
              { status: 'not-started' as FilterStatus, dot: 'bg-gray-300',  label: 'Not Started',    value: notStarted    },
            ]).map((item) => {
              const isActive = activeFilter === item.status
              return (
                <button
                  key={item.status}
                  onClick={() => toggleFilter(item.status)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                    isActive
                      ? 'border-gray-400 bg-gray-100 text-gray-800 shadow-sm'
                      : activeFilter && !isActive
                        ? 'border-gray-100 text-gray-300 bg-white'
                        : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.dot} ${activeFilter && !isActive ? 'opacity-30' : ''}`} />
                  {item.label}
                  <span className={`font-bold ${isActive ? 'text-gray-900' : ''}`}>{item.value}</span>
                </button>
              )
            })}
          </div>

          {/* Per-problem rows — filter-aware */}
          <div className="space-y-2">
            {([
              { label: 'Two Sum',             status: 'reviewed'    as const, classId: '2', id: 1 },
              { label: 'Binary Search',       status: 'pending'     as const, classId: '2', id: 2 },
              { label: 'Reverse Linked List', status: 'not-started' as const, classId: '2', id: 3 },
              { label: 'Process Scheduling',  status: 'not-started' as const, classId: '2', id: 4 },
              { label: 'Memory Management',   status: 'not-started' as const, classId: '2', id: 5 },
              { label: 'SQL Queries',         status: 'not-started' as const, classId: '2', id: 6 },
            ]).map((p) => {
              const isMatch = !activeFilter || activeFilter === p.status
              const barColor = p.status === 'reviewed' ? 'bg-green-500' : p.status === 'pending' ? 'bg-amber-400' : 'bg-gray-200'
              const statusLabel = p.status === 'reviewed' ? 'Reviewed' : p.status === 'pending' ? 'Pending' : 'Not started'
              const statusColor = p.status === 'reviewed' ? 'text-green-600' : p.status === 'pending' ? 'text-amber-500' : 'text-gray-300'

              return (
                <Link
                  key={p.label}
                  to={`/student/classes/${p.classId}/problems/${p.id}`}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                    isMatch
                      ? 'hover:bg-gray-50 cursor-pointer'
                      : 'opacity-20 pointer-events-none'
                  } ${activeFilter && isMatch ? 'bg-gray-50/80 ring-1 ring-gray-100' : ''}`}
                >
                  <span className="text-xs text-gray-700 w-40 truncate flex-shrink-0 font-medium">{p.label}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${barColor}`}
                      style={{ width: p.status !== 'not-started' ? '100%' : '0%' }}
                    />
                  </div>
                  <span className={`text-[10px] font-semibold w-16 text-right flex-shrink-0 ${statusColor}`}>
                    {statusLabel}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Learning Progress */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900">Learning Progress</h2>
            <Link to="/student/classes/2/problems" className="text-xs text-accent font-semibold hover:underline">
              View details →
            </Link>
          </div>

          <div className="flex gap-4 flex-1 items-center">
            {/* Topic bars — left */}
            <div className="flex-1 space-y-4">
              {topicProgress.map((t) => {
                const pct = t.total > 0 ? Math.round((t.submitted / t.total) * 100) : 0
                return (
                  <div key={t.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{t.label}</span>
                      <span className="text-sm font-bold text-gray-800">{pct}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${t.color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{t.submitted} / {t.total} submitted</p>
                  </div>
                )
              })}

              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Overall completion</span>
                  <span className="text-xs font-bold text-gray-700">
                    {Math.round(((reviewed + pendingReview) / totalProblems) * 100)}%
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{reviewed + pendingReview} of {totalProblems} problems attempted</p>
              </div>
            </div>

            {/* Donut chart — right */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <DonutChart
                reviewed={reviewed}
                pending={pendingReview}
                total={totalProblems}
              />
            </div>
          </div>
        </div>
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

function DonutChart({ reviewed, pending, total }: { reviewed: number; pending: number; total: number }) {
  const r = 44
  const cx = 55
  const cy = 55
  const circumference = 2 * Math.PI * r // ≈ 276.5

  const reviewedLen  = (reviewed / total) * circumference
  const pendingLen   = (pending  / total) * circumference
  const attempted    = reviewed + pending

  return (
    <div className="relative flex items-center justify-center">
      <svg width="110" height="110" viewBox="0 0 110 110">
        {/* Background track */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth="10"
        />
        {/* Not started (gray, sits under other segments) */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="10"
          strokeDasharray={`${circumference - reviewedLen - pendingLen} ${reviewedLen + pendingLen}`}
          strokeDashoffset={-(reviewedLen + pendingLen)}
          transform={`rotate(-90 ${cx} ${cy})`}
          strokeLinecap="butt"
        />
        {/* Pending Review (amber) */}
        {pendingLen > 0 && (
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="10"
            strokeDasharray={`${pendingLen} ${circumference - pendingLen}`}
            strokeDashoffset={-reviewedLen}
            transform={`rotate(-90 ${cx} ${cy})`}
            strokeLinecap="butt"
          />
        )}
        {/* Reviewed (green) */}
        {reviewedLen > 0 && (
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="#22c55e"
            strokeWidth="10"
            strokeDasharray={`${reviewedLen} ${circumference - reviewedLen}`}
            strokeDashoffset={0}
            transform={`rotate(-90 ${cx} ${cy})`}
            strokeLinecap="butt"
          />
        )}
        {/* Center text */}
        <text x={cx} y={cy - 6} textAnchor="middle" className="font-bold" style={{ fontSize: 16, fontWeight: 700, fill: '#111827' }}>
          {attempted}/{total}
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" style={{ fontSize: 9, fill: '#9ca3af' }}>
          problems
        </text>
      </svg>
    </div>
  )
}
