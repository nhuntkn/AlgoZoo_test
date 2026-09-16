import { useState } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { ClassTabNav } from '../../../components/layout/ClassTabNav'
import { Badge } from '../../../components/ui/Badge'

const classNames: Record<string, string> = {
  '1': 'WeCamp Batch 21',
  '2': 'WeCamp Batch 22',
}

type ProblemType = 'DSA' | 'OS' | 'Database' | 'Other'

type Submission = {
  id: number
  student: string
  initials: string
  problem: string
  topic: ProblemType
  submittedAt: string
  sortTs: number
  status: 'PENDING' | 'REVIEWED'
  isLate: boolean
}

const submissions: Submission[] = [
  { id: 1, student: 'Alice Nguyen', initials: 'AN', problem: 'Two Sum', topic: 'DSA', submittedAt: 'Sep 10', sortTs: 10, status: 'PENDING', isLate: false },
  { id: 2, student: 'Bob Tran', initials: 'BT', problem: 'Binary Search', topic: 'DSA', submittedAt: 'Sep 9', sortTs: 9, status: 'REVIEWED', isLate: false },
]

export function ClassSubmissions() {
  const { classId = '1' } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const className = classNames[classId] ?? 'WeCamp Batch 21'

  const [tab, setTab] = useState<'all' | 'pending' | 'reviewed' | 'late'>('all')
  const [search, setSearch] = useState('')

  const problemFilter = searchParams.get('problem') ?? ''
  const topicFilter = searchParams.get('topic') ?? ''

  const clearFilter = () => setSearchParams({})

  const tabs = [
    { label: 'Overview', to: `/trainer/classes/${classId}/overview` },
    { label: 'Problems', to: `/trainer/classes/${classId}/problems` },
    { label: 'Submissions', to: `/trainer/classes/${classId}/submissions` },
    { label: 'Students', to: `/trainer/classes/${classId}/students` },
  ]

  const filtered = [...submissions]
    .sort((a, b) => a.sortTs - b.sortTs)
    .filter((s) => {
      const matchTab =
        tab === 'all' ? true :
        tab === 'pending' ? (s.status === 'PENDING' && !s.isLate) :
        tab === 'reviewed' ? s.status === 'REVIEWED' :
        s.isLate
      const matchSearch = search === '' || s.student.toLowerCase().includes(search.toLowerCase()) || s.problem.toLowerCase().includes(search.toLowerCase())
      const matchProblem = problemFilter === '' || s.problem === problemFilter
      const matchTopic = topicFilter === '' || s.topic === topicFilter
      return matchTab && matchSearch && matchProblem && matchTopic
    })

  // Group by problem when a specific problem or topic filter is active
  const shouldGroup = problemFilter !== '' || topicFilter !== ''

  const groupedByProblem = filtered.reduce<Record<string, Submission[]>>((acc, s) => {
    if (!acc[s.problem]) acc[s.problem] = []
    acc[s.problem].push(s)
    return acc
  }, {})

  const activeFilterLabel = problemFilter
    ? `Problem: ${problemFilter}`
    : topicFilter
    ? `Topic: ${topicFilter}`
    : ''

  return (
    <div>
      <ClassTabNav
        crumbs={[
          { label: 'My Classes', to: '/trainer/classes' },
          { label: className, to: `/trainer/classes/${classId}/overview` },
          { label: 'Submissions' },
        ]}
        title={className}
        tabs={tabs}
      />

      {/* Active filter banner */}
      {activeFilterLabel && (
        <div className="flex items-center gap-2 mb-4 bg-accent/5 border border-accent/20 rounded-xl px-4 py-2.5">
          <span className="text-sm text-accent font-medium">Filtering by: {activeFilterLabel}</span>
          <span className="text-sm text-gray-400">· {filtered.length} submission{filtered.length !== 1 ? 's' : ''}</span>
          <button
            onClick={clearFilter}
            className="ml-auto flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 font-medium"
          >
            <X size={13} /> Clear filter
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex gap-1">
          {([
            { key: 'all', label: `All (${submissions.length})` },
            { key: 'pending', label: `Pending (${submissions.filter(s => s.status === 'PENDING' && !s.isLate).length})` },
            { key: 'reviewed', label: `Reviewed (${submissions.filter(s => s.status === 'REVIEWED').length})` },
            { key: 'late', label: `Late (${submissions.filter(s => s.isLate).length})` },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                tab === key
                  ? key === 'late' ? 'bg-orange-500 text-white' : 'bg-accent text-white'
                  : key === 'late' ? 'bg-white text-orange-500 hover:bg-orange-50 shadow-sm' : 'bg-white text-gray-500 hover:bg-gray-50 shadow-sm'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student or problem..."
            className="pl-8 pr-4 py-2 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:border-accent/50 w-56"
          />
        </div>
      </div>

      {/* Grouped view (when filter is active) */}
      {shouldGroup ? (
        <div className="space-y-4">
          {Object.entries(groupedByProblem).map(([problemName, items]) => (
            <div key={problemName} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Problem group header */}
              <div className="flex items-center justify-between px-6 py-3.5 bg-gray-50 border-b border-gray-100">
                <div>
                  <span className="font-semibold text-gray-900 text-sm">{problemName}</span>
                  <span className="ml-2 text-xs text-gray-400">{items.length} submission{items.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {items.filter((s) => s.status === 'PENDING').length} pending
                  </span>
                  <span className="text-xs text-gray-300">·</span>
                  <span className="text-xs text-gray-400">
                    {items.filter((s) => s.status === 'REVIEWED').length} reviewed
                  </span>
                </div>
              </div>
              <SubmissionTable rows={items} classId={classId} />
            </div>
          ))}
          {Object.keys(groupedByProblem).length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm py-12 text-center text-sm text-gray-400">
              No submissions found
            </div>
          )}
        </div>
      ) : (
        /* Flat view (no filter) */
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <TableHeader />
          {filtered.map((s, i) => (
            <SubmissionRow key={s.id} s={s} classId={classId} last={i === filtered.length - 1} />
          ))}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-gray-400">No submissions found</div>
          )}
        </div>
      )}
    </div>
  )
}

function TableHeader() {
  return (
    <div className="grid grid-cols-[1fr_160px_110px_110px_100px] px-6 py-3 border-b border-gray-100">
      {['STUDENT', 'PROBLEM', 'SUBMITTED', 'STATUS', 'ACTION'].map((h) => (
        <span key={h} className="text-[10px] font-bold text-gray-400 tracking-widest">{h}</span>
      ))}
    </div>
  )
}

function SubmissionTable({ rows, classId }: { rows: Submission[]; classId: string }) {
  return (
    <div>
      <div className="grid grid-cols-[1fr_110px_110px_100px] px-6 py-2.5 border-b border-gray-50 bg-white">
        {['STUDENT', 'SUBMITTED', 'STATUS', 'ACTION'].map((h) => (
          <span key={h} className="text-[10px] font-bold text-gray-400 tracking-widest">{h}</span>
        ))}
      </div>
      {rows.map((s, i) => (
        <div
          key={s.id}
          className={`grid grid-cols-[1fr_110px_110px_100px] items-center px-6 py-3.5 hover:bg-gray-50 transition-colors ${
            i < rows.length - 1 ? 'border-b border-gray-50' : ''
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
              {s.initials}
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-900">{s.student}</span>
              {s.isLate && (
                <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-medium">Late</span>
              )}
            </div>
          </div>
          <span className="text-sm text-gray-400">{s.submittedAt}</span>
          <div className="flex items-center">
            <Badge variant={s.status === 'PENDING' ? 'pending' : 'reviewed'}>
              {s.status === 'PENDING' ? 'Pending' : 'Reviewed'}
            </Badge>
          </div>
          <div>
            <Link to={`/trainer/submissions/${s.id}`} className="text-xs text-accent font-semibold hover:underline">
              {s.status === 'PENDING' ? 'Review' : 'View'}
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

function SubmissionRow({ s, classId, last }: { s: Submission; classId: string; last: boolean }) {
  return (
    <div
      className={`grid grid-cols-[1fr_160px_110px_110px_100px] items-center px-6 py-4 hover:bg-gray-50 transition-colors ${
        !last ? 'border-b border-gray-50' : ''
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
          {s.initials}
        </div>
        <div>
          <span className="text-sm font-semibold text-gray-900">{s.student}</span>
          {s.isLate && (
            <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-medium">Late</span>
          )}
        </div>
      </div>
      <span className="text-sm text-gray-600">{s.problem}</span>
      <span className="text-sm text-gray-400">{s.submittedAt}</span>
      <div className="flex items-center">
        <Badge variant={s.status === 'PENDING' ? 'pending' : 'reviewed'}>
          {s.status === 'PENDING' ? 'Pending' : 'Reviewed'}
        </Badge>
      </div>
      <div>
        <Link to={`/trainer/submissions/${s.id}`} className="text-xs text-accent font-semibold hover:underline">
          {s.status === 'PENDING' ? 'Review' : 'View'}
        </Link>
      </div>
    </div>
  )
}
