import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Circle, Clock } from 'lucide-react'
import { TypeBadge, Badge } from '../../components/ui/Badge'

type ProblemStatus = 'not-started' | 'pending' | 'reviewed'

type ClassProblem = {
  id: number
  title: string
  type: 'DSA' | 'OS' | 'Database' | 'Other'
  deadline: string | null
  status: ProblemStatus
  isPastDeadline: boolean
}

const classInfo = {
  id: 1,
  name: 'WeCamp Batch 22',
}

const problems: ClassProblem[] = [
  { id: 1, title: 'Two Sum', type: 'DSA', deadline: 'Sep 20, 2026', status: 'reviewed', isPastDeadline: false },
  { id: 2, title: 'Binary Search', type: 'DSA', deadline: 'Sep 22, 2026', status: 'pending', isPastDeadline: false },
  { id: 3, title: 'Reverse Linked List', type: 'DSA', deadline: 'Sep 25, 2026', status: 'not-started', isPastDeadline: false },
  { id: 4, title: 'Process Scheduling', type: 'OS', deadline: 'Sep 18, 2026', status: 'not-started', isPastDeadline: true },
  { id: 5, title: 'Memory Management', type: 'OS', deadline: 'Sep 28, 2026', status: 'not-started', isPastDeadline: false },
  { id: 6, title: 'SQL Queries', type: 'Database', deadline: 'Oct 1, 2026', status: 'not-started', isPastDeadline: false },
]

const types = ['DSA', 'OS', 'Database', 'Other'] as const

const statusIcon = {
  reviewed: <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />,
  pending: <Clock size={16} className="text-yellow-500 flex-shrink-0" />,
  'not-started': <Circle size={16} className="text-gray-300 flex-shrink-0" />,
}

const statusLabel = {
  reviewed: 'Reviewed',
  pending: 'Pending review',
  'not-started': 'Not started',
}

export function StudentClassView() {
  const { classId } = useParams()
  const [activeTab, setActiveTab] = useState<'problems' | 'submissions'>('problems')

  const grouped = types.reduce((acc, type) => {
    const typeProblems = problems.filter((p) => p.type === type)
    if (typeProblems.length > 0) acc[type] = typeProblems
    return acc
  }, {} as Record<string, ClassProblem[]>)

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-5 text-sm text-gray-400">
        <Link to="/student/dashboard" className="hover:text-accent flex items-center gap-1">
          <ArrowLeft size={14} /> My Classes
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">{classInfo.name}</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{classInfo.name}</h1>
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('problems')}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === 'problems' ? 'bg-accent text-white' : 'bg-white text-gray-500 hover:bg-gray-50 shadow-sm'
            }`}
          >
            Problems
          </button>
          <Link to="/student/submissions">
            <button
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-white text-gray-500 hover:bg-gray-50 shadow-sm transition-colors"
            >
              My Submissions
            </button>
          </Link>
        </div>
      </div>

      {/* Problems grouped by type */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([type, typeProblems]) => (
          <div key={type}>
            <div className="flex items-center gap-2 mb-3">
              <TypeBadge type={type} />
            </div>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {typeProblems.map((p, i) => (
                <Link
                  key={p.id}
                  to={`/student/classes/${classId}/problems/${p.id}`}
                  className={`flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors ${
                    i < typeProblems.length - 1 ? 'border-b border-gray-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {statusIcon[p.status]}
                    <span className={`text-sm font-semibold ${p.status === 'not-started' ? 'text-gray-600' : 'text-gray-900'}`}>
                      {p.title}
                    </span>
                    {p.isPastDeadline && p.status === 'not-started' && (
                      <Badge variant="late">Deadline passed</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    {p.deadline && (
                      <span className="text-xs text-gray-400">{p.deadline}</span>
                    )}
                    <span className={`text-sm ${
                      p.status === 'reviewed' ? 'text-green-600 font-medium' :
                      p.status === 'pending' ? 'text-yellow-600' :
                      'text-gray-400'
                    }`}>
                      {statusLabel[p.status]}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
