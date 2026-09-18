import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Code2 } from 'lucide-react'
import { TypeBadge, Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

const problem: {
  id: number
  title: string
  type: 'DSA' | 'OS' | 'Database' | 'Other'
  description: string
  resource_url: string
  deadline: string
  status: 'not-started' | 'pending' | 'reviewed'
  isPastDeadline: boolean
} = {
  id: 1,
  title: 'Two Sum',
  type: 'DSA' as const,
  description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
  resource_url: 'https://leetcode.com/problems/two-sum/',
  deadline: 'September 20, 2026',
  status: 'not-started',
  isPastDeadline: false,
}

export function ProblemDetail() {
  const { classId, problemId } = useParams()

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-5 text-sm text-gray-400">
        <Link to={`/student/classes/${classId}`} className="hover:text-accent flex items-center gap-1">
          <ArrowLeft size={14} /> Back to Class
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">{problem.title}</span>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TypeBadge type={problem.type} />
            {problem.isPastDeadline && <Badge variant="late">Deadline passed</Badge>}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{problem.title}</h1>
        </div>
        <Link to={`/student/classes/${classId}/problems/${problemId}/submit`}>
          <Button>
            <Code2 size={14} /> Submit Solution
          </Button>
        </Link>
      </div>

      <div className="flex gap-6">
        {/* Main content */}
        <div className="flex-1 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5 text-sm text-gray-700 leading-relaxed">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p style={{ whiteSpace: 'pre-line' }}>{problem.description}</p>
            </div>
          </div>

          {problem.resource_url && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
              <ExternalLink size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Resource</p>
                <a
                  href={problem.resource_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 hover:underline break-all"
                >
                  {problem.resource_url}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-64 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3 text-sm">
            <h3 className="font-semibold text-gray-800">Problem Info</h3>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Type</span>
              <TypeBadge type={problem.type} />
            </div>
            {problem.deadline && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Deadline</span>
                <span className={`text-sm font-medium ${problem.isPastDeadline ? 'text-red-500' : 'text-gray-900'}`}>
                  {problem.deadline}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Status</span>
              <span className={`text-sm font-medium capitalize ${
                problem.status === 'reviewed' ? 'text-green-600' :
                problem.status === 'pending' ? 'text-yellow-600' :
                'text-gray-400'
              }`}>
                {problem.status === 'not-started' ? 'Not started' :
                 problem.status === 'pending' ? 'Pending review' : 'Reviewed'}
              </span>
            </div>
          </div>

          <Link to={`/student/classes/${classId}/problems/${problemId}/submit`} className="block">
            <Button className="w-full justify-center">
              <Code2 size={15} /> Submit Solution
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
