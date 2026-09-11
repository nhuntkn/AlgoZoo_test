import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, CheckCircle2, Users, BookOpen, CalendarDays, Shield, User, Search, Plus, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

const classInfo = {
  id: 1,
  name: 'WeCamp Batch 15',
  startDate: 'Jan 15, 2025',
  endDate: 'Mar 30, 2025',
  trainer: 'Nguyen Van Hung',
  admin: 'Maya Tran',
  students: 24,
  pending: 7,
  reviewed: 52,
  total: 35,
  progress: 62,
}

const pendingSubmissions = [
  { id: 1, student: 'Trang Nguyen', initials: 'TN', problem: 'Two Sum', difficulty: 'easy', submittedAt: '2h ago' },
  { id: 2, student: 'Minh Le', initials: 'ML', problem: 'Binary Tree Level Order Traversal', difficulty: 'medium', submittedAt: '4h ago' },
  { id: 3, student: 'Huy Pham', initials: 'HP', problem: 'Course Schedule', difficulty: 'hard', submittedAt: '5h ago' },
  { id: 4, student: 'An Tran', initials: 'AT', problem: 'Merge Two Sorted Lists', difficulty: 'easy', submittedAt: '1d ago' },
  { id: 5, student: 'Linh Vo', initials: 'LV', problem: 'Kth Largest Element', difficulty: 'medium', submittedAt: '1d ago' },
]

const students = [
  { id: 1, name: 'Trang Nguyen', initials: 'TN', completed: 22, progress: 63, pending: 2, lastActive: '2h ago' },
  { id: 2, name: 'Minh Le', initials: 'ML', completed: 19, progress: 54, pending: 1, lastActive: '4h ago' },
  { id: 3, name: 'Huy Pham', initials: 'HP', completed: 17, progress: 49, pending: 0, lastActive: '5h ago' },
  { id: 4, name: 'An Tran', initials: 'AT', completed: 25, progress: 71, pending: 0, lastActive: '1d ago' },
  { id: 5, name: 'Linh Vo', initials: 'LV', completed: 14, progress: 40, pending: 3, lastActive: '1d ago' },
  { id: 6, name: 'Bao Le', initials: 'BL', completed: 23, progress: 66, pending: 1, lastActive: '2d ago' },
]

// Starts empty — populated when trainer publishes assignments
const assignedProblems: { id: number; title: string; topic: string; difficulty: string; url: string; assignment: string }[] = []

export function ClassView() {
  const [tab, setTab] = useState<'reviews' | 'problems' | 'students'>('reviews')
  const [problemSearch, setProblemSearch] = useState('')
  const [problemDiff, setProblemDiff] = useState('all')

  const filteredProblems = assignedProblems.filter(
    (p) =>
      p.title.toLowerCase().includes(problemSearch.toLowerCase()) &&
      (problemDiff === 'all' || p.difficulty === problemDiff)
  )

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-5 text-sm text-gray-400">
        <Link to="/trainer/classes" className="hover:text-accent flex items-center gap-1">
          <ArrowLeft size={14} /> Classes
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">{classInfo.name}</span>
      </div>

      {/* Class header */}
      <div className="bg-white rounded-2xl px-7 py-5 shadow-sm mb-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-sm bg-accent" />
              <h1 className="text-2xl font-bold text-gray-900">{classInfo.name}</h1>
            </div>
            <div className="flex items-center gap-5 text-sm text-gray-500 mt-2 flex-wrap">
              <span className="flex items-center gap-1.5"><CalendarDays size={13} className="text-gray-400" />{classInfo.startDate} — {classInfo.endDate}</span>
              <span className="flex items-center gap-1.5"><User size={13} className="text-gray-400" />Trainer: <strong className="text-gray-700 font-semibold ml-1">{classInfo.trainer}</strong></span>
              <span className="flex items-center gap-1.5"><Shield size={13} className="text-gray-400" />Admin: <strong className="text-gray-700 font-semibold ml-1">{classInfo.admin}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { icon: <Users size={18} className="text-gray-400" />, label: 'Students', value: classInfo.students, bg: 'bg-white' },
          { icon: <BookOpen size={18} className="text-gray-400" />, label: 'Problems', value: assignedProblems.length, bg: 'bg-white' },
          { icon: <Clock size={18} className="text-yellow-500" />, label: 'Needs Review', value: classInfo.pending, bg: 'bg-yellow-50' },
          { icon: <CheckCircle2 size={18} className="text-green-500" />, label: 'Reviewed', value: classInfo.reviewed, bg: 'bg-green-50' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-5 shadow-sm`}>
            <div className="flex items-center gap-2 mb-2">{s.icon}<span className="text-xs text-gray-400 font-medium">{s.label}</span></div>
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl px-7 py-4 shadow-sm mb-5">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Overall Class Progress</span>
          <span className="font-semibold text-gray-700">{classInfo.progress}%</span>
        </div>
        <ProgressBar value={classInfo.progress} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4">
        {([
          { key: 'reviews', label: 'Pending Reviews' },
          { key: 'problems', label: 'Problems' },
          { key: 'students', label: 'All Students' },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === t.key ? 'bg-accent text-white' : 'bg-white text-gray-500 hover:bg-gray-50 shadow-sm'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Pending Reviews tab ── */}
      {tab === 'reviews' && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-[1fr_160px_100px_80px_100px] border-b border-gray-100 px-6 py-3">
            {['STUDENT', 'PROBLEM', 'DIFFICULTY', 'SUBMITTED', 'ACTION'].map((h) => (
              <span key={h} className="text-[10px] font-bold text-gray-400 tracking-widest">{h}</span>
            ))}
          </div>
          {pendingSubmissions.map((s, i) => (
            <div key={s.id}
              className={`grid grid-cols-[1fr_160px_100px_80px_100px] items-center px-6 py-4 hover:bg-gray-50 transition-colors ${i < pendingSubmissions.length - 1 ? 'border-b border-gray-50' : ''}`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold flex-shrink-0">{s.initials}</div>
                <span className="text-sm font-semibold text-gray-900">{s.student}</span>
              </div>
              <span className="text-sm text-gray-600 truncate pr-4">{s.problem}</span>
              <span><Badge variant={s.difficulty as 'easy' | 'medium' | 'hard'}>{s.difficulty.toUpperCase()}</Badge></span>
              <span className="text-sm text-gray-400">{s.submittedAt}</span>
              <Link to={`/trainer/submissions/${s.id}`}><Button size="sm">Review</Button></Link>
            </div>
          ))}
        </div>
      )}

      {/* ── Problems tab — list assigned via assignments (CP-03, CP-04) ── */}
      {tab === 'problems' && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={problemSearch}
                onChange={(e) => setProblemSearch(e.target.value)}
                placeholder="Search problems..."
                className="pl-8 pr-3 py-2 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:border-accent/50 w-52"
              />
            </div>
            <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              {['all', 'easy', 'medium', 'hard'].map((d) => (
                <button key={d} onClick={() => setProblemDiff(d)}
                  className={`px-3 py-2 text-xs font-semibold capitalize transition-colors ${problemDiff === d ? 'bg-accent text-white' : 'text-gray-500 hover:text-gray-800'}`}>
                  {d === 'all' ? 'All' : d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
            <div className="ml-auto">
              <Link to={`/trainer/classes/${classInfo.id}/assignments/create`}>
                <Button size="sm"><Plus size={14} /> New Assignment</Button>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-[48px_1fr_120px_100px_1fr_100px] border-b border-gray-100 px-6 py-3">
              {['#', 'TITLE', 'TOPIC', 'DIFFICULTY', 'ASSIGNMENT', 'LEETCODE'].map((h) => (
                <span key={h} className="text-[10px] font-bold text-gray-400 tracking-widest">{h}</span>
              ))}
            </div>
            {filteredProblems.length === 0 && (
              <div className="py-14 text-center text-gray-400 text-sm">
                No problems assigned yet.{' '}
                <Link to={`/trainer/classes/${classInfo.id}/assignments/create`} className="text-accent font-semibold hover:underline">
                  Create an assignment
                </Link>{' '}
                to add problems to this class.
              </div>
            )}
            {filteredProblems.map((p, i) => (
              <div key={p.id}
                className={`grid grid-cols-[48px_1fr_120px_100px_1fr_100px] items-center px-6 py-4 hover:bg-gray-50 transition-colors ${i < filteredProblems.length - 1 ? 'border-b border-gray-50' : ''}`}
              >
                <span className="text-sm text-gray-400">{i + 1}</span>
                <span className="text-sm font-semibold text-gray-900">{p.title}</span>
                <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2.5 py-1 w-fit">{p.topic}</span>
                <Badge variant={p.difficulty as 'easy' | 'medium' | 'hard'}>{p.difficulty.toUpperCase()}</Badge>
                <span className="text-xs text-gray-400 truncate pr-4">{p.assignment}</span>
                <a href={p.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-accent text-xs font-semibold hover:underline">
                  <ExternalLink size={12} /> Open
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Students tab ── */}
      {tab === 'students' && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-[1fr_100px_160px_80px_90px_100px] border-b border-gray-100 px-6 py-3">
            {['STUDENT', 'COMPLETED', 'PROGRESS', 'PENDING', 'ACTIVE', 'ACTION'].map((h) => (
              <span key={h} className="text-[10px] font-bold text-gray-400 tracking-widest">{h}</span>
            ))}
          </div>
          {students.map((s, i) => (
            <div key={s.id}
              className={`grid grid-cols-[1fr_100px_160px_80px_90px_100px] items-center px-6 py-4 hover:bg-gray-50 transition-colors ${i < students.length - 1 ? 'border-b border-gray-50' : ''}`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold flex-shrink-0">{s.initials}</div>
                <span className="text-sm font-semibold text-gray-900">{s.name}</span>
              </div>
              <span className="text-sm text-gray-600">{s.completed}/{assignedProblems.length}</span>
              <div className="flex items-center gap-2 pr-4">
                <div className="flex-1"><ProgressBar value={s.progress} height="h-1.5" /></div>
                <span className="text-xs text-gray-600 flex-shrink-0">{s.progress}%</span>
              </div>
              <span>
                {s.pending > 0
                  ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">{s.pending}</span>
                  : <span className="text-gray-300 text-sm">—</span>
                }
              </span>
              <span className="text-xs text-gray-400">{s.lastActive}</span>
              <Link to={`/trainer/classes/${classInfo.id}/students/${s.id}`} className="text-accent text-sm font-semibold hover:underline">
                View →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
