import { Link } from 'react-router-dom'
import { Inbox } from 'lucide-react'
import { TypeBadge, StatusDot } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

type SubmissionStatus = 'PENDING' | 'REVIEWED' | 'NOT_STARTED'

type SubmissionItem = {
  id: number
  problem: string
  problemType: 'DSA' | 'OS' | 'Database' | 'Other'
  class: string
  status: SubmissionStatus
  submittedAt: string | null
  feedback: string | null
  isLate: boolean
}

const submissions: SubmissionItem[] = [
  {
    id: 1,
    problem: 'Two Sum',
    problemType: 'DSA',
    class: 'Batch 22',
    status: 'REVIEWED',
    submittedAt: 'Sep 10',
    feedback: 'Good use of hash map for O(n) solution. Clean and readable code. Well done!',
    isLate: false,
  },
  {
    id: 2,
    problem: 'Binary Search',
    problemType: 'DSA',
    class: 'Batch 22',
    status: 'PENDING',
    submittedAt: 'Sep 14',
    feedback: null,
    isLate: false,
  },
  {
    id: 3,
    problem: 'Process Scheduling',
    problemType: 'OS',
    class: 'Batch 22',
    status: 'PENDING',
    submittedAt: 'Sep 19',
    feedback: null,
    isLate: true,
  },
  {
    id: 4,
    problem: 'Memory Management',
    problemType: 'OS',
    class: 'Batch 22',
    status: 'NOT_STARTED',
    submittedAt: null,
    feedback: null,
    isLate: false,
  },
  {
    id: 5,
    problem: 'SQL Queries',
    problemType: 'Database',
    class: 'Batch 22',
    status: 'NOT_STARTED',
    submittedAt: null,
    feedback: null,
    isLate: false,
  },
]

const statusLabel: Record<SubmissionStatus, string> = {
  PENDING: 'Pending review',
  REVIEWED: 'Reviewed',
  NOT_STARTED: 'Not started',
}

const statusDotKey: Record<SubmissionStatus, string> = {
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  NOT_STARTED: 'not-started',
}

export function StudentSubmissions() {
  if (submissions.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Submissions</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Inbox size={48} className="text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-1">No submissions yet</h3>
          <p className="text-gray-500 text-sm mb-4">Submit a solution to see it here.</p>
          <Link to="/student/classes">
            <Button>Go to My Classes</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-7">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Student</p>
        <h1 className="text-2xl font-bold text-gray-900">My Submissions</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1fr_100px_120px_160px_100px_80px] border-b border-gray-100 px-6 py-3">
          {['PROBLEM', 'TYPE', 'CLASS', 'STATUS', 'SUBMITTED', ''].map((h, i) => (
            <span key={i} className="text-[10px] font-bold text-gray-400 tracking-widest">{h}</span>
          ))}
        </div>
        {submissions.map((s, i) => (
          <div
            key={s.id}
            className={`grid grid-cols-[1fr_100px_120px_160px_100px_80px] items-center px-6 py-4 hover:bg-gray-50 transition-colors ${
              i < submissions.length - 1 ? 'border-b border-gray-50' : ''
            }`}
          >
            <div>
              <span className={`text-sm font-semibold ${s.status === 'NOT_STARTED' ? 'text-gray-500' : 'text-gray-900'}`}>
                {s.problem}
              </span>
              {s.isLate && (
                <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-medium">Late</span>
              )}
              {s.status === 'REVIEWED' && s.feedback && (
                <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">{s.feedback}</p>
              )}
            </div>
            <div className="flex items-center"><TypeBadge type={s.problemType} /></div>
            <span className="text-sm text-gray-500">{s.class}</span>
            <div className="flex items-center gap-1.5">
              <StatusDot status={statusDotKey[s.status]} />
              <span className={`text-sm ${s.status === 'NOT_STARTED' ? 'text-gray-400' : 'text-gray-700'}`}>
                {statusLabel[s.status]}
              </span>
            </div>
            <span className="text-sm text-gray-400">{s.submittedAt ?? '—'}</span>
            <div>
              {s.status !== 'NOT_STARTED' && (
                <Link to={`/student/submissions/${s.id}`}>
                  <button className="text-xs text-accent font-semibold hover:underline">View</button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
