import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge, StatusDot } from '../../components/ui/Badge'

const allProblems = [
  { id: 1, title: 'Two Sum', difficulty: 'easy', topic: 'Array', status: 'reviewed', leetcodeUrl: 'https://leetcode.com/problems/two-sum/' },
  { id: 2, title: 'Valid Parentheses', difficulty: 'easy', topic: 'Stack', status: 'submitted', leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/' },
  { id: 3, title: 'Best Time to Buy and Sell Stock', difficulty: 'medium', topic: 'Array', status: 'not-started', leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
  { id: 4, title: 'Reverse Linked List', difficulty: 'medium', topic: 'Linked List', status: 'reviewed', leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/' },
  { id: 5, title: 'Group Anagrams', difficulty: 'medium', topic: 'Hash Table', status: 'not-started', leetcodeUrl: 'https://leetcode.com/problems/group-anagrams/' },
  { id: 6, title: 'Longest Substring Without Repeating Characters', difficulty: 'hard', topic: 'Sliding Window', status: 'submitted', leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
  { id: 7, title: 'Merge Intervals', difficulty: 'medium', topic: 'Array', status: 'not-started', leetcodeUrl: 'https://leetcode.com/problems/merge-intervals/' },
  { id: 8, title: 'Word Search', difficulty: 'hard', topic: 'Backtracking', status: 'not-started', leetcodeUrl: 'https://leetcode.com/problems/word-search/' },
  { id: 9, title: 'Binary Search', difficulty: 'easy', topic: 'Binary Search', status: 'reviewed', leetcodeUrl: 'https://leetcode.com/problems/binary-search/' },
]

const statusLabel: Record<string, string> = {
  'not-started': 'Not Started',
  submitted: 'Submitted',
  reviewed: 'Reviewed',
}

export function StudentProblems() {
  const [search, setSearch] = useState('')
  const [diffFilter, setDiffFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = allProblems.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
    const matchDiff = diffFilter === 'all' || p.difficulty === diffFilter
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    return matchSearch && matchDiff && matchStatus
  })

  return (
    <div className="pt-2">
      {/* Page header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">WeCamp Batch 15</p>
          <h1 className="font-bold text-2xl text-gray-900">Problems</h1>
        </div>

        {/* Inline filters — compact */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-accent/50 w-44"
            />
          </div>
          <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
            {['all', 'easy', 'medium', 'hard'].map((f) => (
              <button
                key={f}
                onClick={() => setDiffFilter(f)}
                className={`px-3 py-2 text-xs font-semibold transition-colors ${
                  diffFilter === f ? 'bg-accent text-white' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="not-started">Not Started</option>
            <option value="submitted">Submitted</option>
            <option value="reviewed">Reviewed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-[40px_1fr_120px_120px_140px_120px] gap-0 border-b border-gray-100 px-6 py-3">
          {['#', 'TITLE', 'TOPIC', 'DIFFICULTY', 'STATUS', 'ACTIONS'].map((h) => (
            <span key={h} className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{h}</span>
          ))}
        </div>

        {filtered.map((p, i) => (
          <div
            key={p.id}
            className={`grid grid-cols-[40px_1fr_120px_120px_140px_120px] gap-0 items-center px-6 py-4 hover:bg-gray-50 transition-colors ${
              i < filtered.length - 1 ? 'border-b border-gray-50' : ''
            }`}
          >
            <span className="text-sm text-gray-400">{i + 1}</span>
            <Link to={`/student/problems/${p.id}`} className="text-sm font-semibold text-gray-900 hover:text-accent pr-4 block truncate">
              {p.title}
            </Link>
            <span className="text-sm text-gray-500">{p.topic}</span>
            <span>
              <Badge variant={p.difficulty as 'easy' | 'medium' | 'hard'}>
                {p.difficulty.toUpperCase()}
              </Badge>
            </span>
            <span className="flex items-center gap-1.5">
              <StatusDot status={p.status} />
              <span className="text-sm text-gray-700">{statusLabel[p.status]}</span>
            </span>
            <span className="flex items-center gap-3">
              <Link to={`/student/problems/${p.id}`} className="text-accent text-sm font-semibold hover:underline">
                {p.status === 'not-started' ? 'Start →' : 'View →'}
              </Link>
              <a href={p.leetcodeUrl} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-gray-500">
                <ExternalLink size={13} />
              </a>
            </span>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-1 mt-5">
        <button className="p-2 rounded-lg hover:bg-white text-gray-400"><ChevronLeft size={16} /></button>
        {[1, 2, 3].map((n) => (
          <button key={n} className={`w-8 h-8 rounded-lg text-sm font-semibold ${n === 1 ? 'bg-accent text-white' : 'text-gray-500 hover:bg-white'}`}>{n}</button>
        ))}
        <button className="p-2 rounded-lg hover:bg-white text-gray-400"><ChevronRight size={16} /></button>
      </div>
    </div>
  )
}