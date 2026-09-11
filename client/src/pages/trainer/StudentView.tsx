import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Badge, StatusDot } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

const student = { id: 1, name: 'Trang Nguyen', initials: 'TN', email: 'trang@algozoo.com' }
const classInfo = { id: 1, name: 'WeCamp Batch 4' }

const submissions = [
  { id: 1, problem: 'Two Sum', difficulty: 'easy', topic: 'Array', submittedAt: '2h ago', status: 'submitted' },
  { id: 2, problem: 'Binary Tree Level Order Traversal', difficulty: 'medium', topic: 'BFS', submittedAt: '4h ago', status: 'submitted' },
  { id: 3, problem: 'Merge Two Sorted Lists', difficulty: 'easy', topic: 'Linked List', submittedAt: '2d ago', status: 'reviewed' },
  { id: 4, problem: 'Valid Parentheses', difficulty: 'easy', topic: 'Stack', submittedAt: '3d ago', status: 'reviewed' },
]

const statusLabel: Record<string, string> = {
  submitted: 'Waiting for Review',
  reviewed: 'Reviewed',
}

export function StudentView() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1 text-sm text-gray-500">
        <Link to="/trainer/classes" className="flex items-center gap-1 hover:text-accent">
          <ArrowLeft size={14} /> Classes
        </Link>
        <span>›</span>
        <Link to={`/trainer/classes/${classInfo.id}`} className="hover:text-accent">{classInfo.name}</Link>
        <span>›</span>
        <span className="text-gray-700">{student.name}</span>
      </div>

      <div className="flex items-center gap-4 mb-6 mt-3">
        <div className="w-12 h-12 rounded-full bg-accent text-white text-base flex items-center justify-center font-bold">
          {student.initials}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
          <p className="text-sm text-gray-500">{student.email}</p>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Submissions</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Problem</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Topic</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Difficulty</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Submitted</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">{s.problem}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{s.topic}</td>
                  <td className="px-4 py-4">
                    <Badge variant={s.difficulty as 'easy' | 'medium' | 'hard'}>
                      {s.difficulty.charAt(0).toUpperCase() + s.difficulty.slice(1)}
                    </Badge>
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
    </div>
  )
}
