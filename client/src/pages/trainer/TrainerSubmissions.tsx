import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Badge, StatusDot } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

const submissions = [
  { id: 1, student: 'Trang Nguyen', initials: 'TN', class: 'WeCamp Batch 4', problem: 'Two Sum', difficulty: 'easy', submittedAt: '2h ago', status: 'submitted' },
  { id: 2, student: 'Minh Le', initials: 'ML', class: 'WeCamp Batch 4', problem: 'Binary Tree Level Order Traversal', difficulty: 'medium', submittedAt: '4h ago', status: 'submitted' },
  { id: 3, student: 'Huy Pham', initials: 'HP', class: 'StarCamp Batch 2', problem: 'Course Schedule', difficulty: 'hard', submittedAt: '5h ago', status: 'submitted' },
  { id: 4, student: 'An Tran', initials: 'AT', class: 'WeCamp Batch 4', problem: 'Merge Two Sorted Lists', difficulty: 'easy', submittedAt: '1d ago', status: 'reviewed' },
  { id: 5, student: 'Linh Vo', initials: 'LV', class: 'StarCamp Batch 2', problem: 'Kth Largest Element', difficulty: 'medium', submittedAt: '1d ago', status: 'reviewed' },
]

const statusLabel: Record<string, string> = {
  submitted: 'Waiting for Review',
  reviewed: 'Reviewed',
}

export function TrainerSubmissions() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [classFilter, setClassFilter] = useState('all')

  const filtered = submissions.filter((s) => {
    const matchSearch = s.student.toLowerCase().includes(search.toLowerCase()) || s.problem.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || s.status === statusFilter
    const matchClass = classFilter === 'all' || s.class === classFilter
    return matchSearch && matchStatus && matchClass
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Submissions</h1>
        <p className="text-sm text-gray-500">All student submissions across your classes</p>
      </div>

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student or problem..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
        >
          <option value="all">All Classes</option>
          <option value="WeCamp Batch 4">WeCamp Batch 4</option>
          <option value="StarCamp Batch 2">StarCamp Batch 2</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="submitted">Waiting for Review</option>
          <option value="reviewed">Reviewed</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Student</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Class</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Problem</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Difficulty</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Submitted</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Status</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold">{s.initials}</div>
                    <span className="text-sm font-medium text-gray-900">{s.student}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">{s.class}</td>
                <td className="px-4 py-4 text-sm text-gray-700 max-w-[180px] truncate">{s.problem}</td>
                <td className="px-4 py-4">
                  <Badge variant={s.difficulty}>{s.difficulty.charAt(0).toUpperCase() + s.difficulty.slice(1)}</Badge>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">{s.submittedAt}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5">
                    <StatusDot status={s.status} />
                    <span className="text-sm text-gray-700">{statusLabel[s.status]}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <Link to={`/trainer/submissions/${s.id}`}>
                    <Button size="sm" variant={s.status === 'submitted' ? 'primary' : 'secondary'}>
                      {s.status === 'submitted' ? 'Review' : 'View'}
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
