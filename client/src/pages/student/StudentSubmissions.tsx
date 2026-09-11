import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Inbox, ExternalLink, ImageIcon } from 'lucide-react'
import { Badge, StatusDot } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

const submissions = [
  {
    id: 1,
    problem: 'Two Sum',
    difficulty: 'easy',
    topic: 'Array',
    date: 'Sep 15, 2025 at 4:32 PM',
    status: 'reviewed',
    hasScreenshot: true,
    feedback: {
      trainer: 'Mr. Trainer',
      initials: 'TR',
      time: '1 day ago',
      text: 'Good use of hash map. O(n) time complexity — excellent. Clean and readable code. Well done!',
    },
  },
  {
    id: 2,
    problem: 'Valid Parentheses',
    difficulty: 'easy',
    topic: 'Stack',
    date: 'Sep 16, 2025 at 10:15 AM',
    status: 'submitted',
    hasScreenshot: true,
    feedback: null,
  },
]

const statusLabel: Record<string, string> = {
  submitted: 'Waiting for Review',
  reviewed: 'Reviewed',
  'not-started': 'Not Started',
}

export function StudentSubmissions() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = submissions.filter((s) => {
    const matchSearch = s.problem.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || s.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Submissions</h1>
        <p className="text-sm text-gray-500">Track the status of your submitted solutions</p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search submissions..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
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

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Inbox size={48} className="text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-1">No submissions yet</h3>
          <p className="text-gray-500 text-sm mb-4">Solve a problem on LeetCode and submit it here for Trainer review.</p>
          <Link to="/student/problems"><Button>Browse Problems</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((s) => (
            <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Link to={`/student/problems/${s.id}`} className="font-semibold text-gray-900 text-lg hover:text-accent">
                    {s.problem}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={s.difficulty as 'easy' | 'medium' | 'hard'}>
                      {s.difficulty.charAt(0).toUpperCase() + s.difficulty.slice(1)}
                    </Badge>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-500">{s.topic}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-500">Submitted {s.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <StatusDot status={s.status} />
                  <span className="text-sm font-medium text-gray-700">{statusLabel[s.status]}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                {/* Evidence indicator */}
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-3">
                  <ImageIcon size={16} className="text-gray-400" />
                  <span>Screenshot evidence attached</span>
                </div>

                {/* Feedback */}
                {s.feedback ? (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold">
                        {s.feedback.initials}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900">{s.feedback.trainer}</span>
                        <span className="text-xs text-gray-400 ml-2">{s.feedback.time}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{s.feedback.text}</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-700">
                    Waiting for Trainer feedback…
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                <Link to={`/student/problems/${s.id}`}>
                  <Button variant="secondary" size="sm">View Problem</Button>
                </Link>
                {s.status === 'reviewed' && (
                  <Link to={`/student/problems/${s.id}/workspace`}>
                    <Button size="sm">Resubmit</Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
