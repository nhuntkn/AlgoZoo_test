import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, ChevronDown, ChevronRight, Circle, Clock, Loader2, Search } from 'lucide-react'
import { ClassTabNav } from '../../../components/layout/ClassTabNav'
import { TypeBadge } from '../../../components/ui/Badge'
import { studentService } from '../../../services/studentService'
import type { StudentClassProblem } from '../../../types/classProblem'

type Filter = 'all' | 'not-started' | 'pending' | 'reviewed'

function getStatus(problem: StudentClassProblem): Filter {
  if (problem.status === 'Reviewed') return 'reviewed'
  if (problem.status === 'Pending' || problem.status === 'Late') return 'pending'
  return 'not-started'
}

function normalizeType(raw: string | undefined): string {
  if (!raw) return 'Other'
  if (raw === 'DB') return 'Database'
  if (raw === 'OTHER') return 'Other'
  return raw
}

export function StudentProblemList() {
  const { classId = '' } = useParams()
  const [problems, setProblems] = useState<StudentClassProblem[]>([])
  const [className, setClassName] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!classId) return

    studentService.getClasses()
      .then((response) => {
        const current = response.data.find((c) => c.classId === classId)
        if (current) setClassName(current.name)
      })
      .catch(() => { /* class name is optional display info */ })

    studentService.getClassProblems(classId)
      .then((response) => setProblems(response.data))
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Unable to load problems'))
      .finally(() => setLoading(false))
  }, [classId])

  const filtered = problems.filter((item) => {
    const matchesSearch = item.problem?.title.toLowerCase().includes(search.toLowerCase()) ?? false
    return matchesSearch && (filter === 'all' || getStatus(item) === filter)
  })

  const grouped = filtered.reduce<Record<string, StudentClassProblem[]>>((acc, item) => {
    const type = normalizeType(item.problem?.problemType as string | undefined)
    if (!acc[type]) acc[type] = []
    acc[type].push(item)
    return acc
  }, {})

  const toggleGroup = (type: string) => {
    setCollapsed((prev) => ({ ...prev, [type]: !prev[type] }))
  }

  const tabs = [
    { label: 'Overview', to: `/student/classes/${classId}/overview` },
    { label: 'Problems', to: `/student/classes/${classId}/problems` },
  ]

  const crumbs = [
    { label: 'My Classes', to: '/student/classes' },
    ...(className ? [{ label: className }] : []),
    { label: 'Problems' },
  ]

  return (
    <div>
      <ClassTabNav crumbs={crumbs} title={className || 'Problems'} tabs={tabs} />

      {/* Search + Filter */}
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search problems..."
            className="pl-8 pr-4 py-2 border border-gray-200 rounded-xl bg-white text-sm"
          />
        </div>
        <div className="flex gap-1">
          {(['all', 'not-started', 'pending', 'reviewed'] as Filter[]).map((value) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${filter === value ? 'bg-accent text-white' : 'bg-white text-gray-500'}`}
            >
              {value === 'all' ? 'All' : value === 'not-started' ? 'Not Started' : value === 'pending' ? 'Pending' : 'Reviewed'}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      {loading ? (
        <div className="py-16 flex justify-center gap-2 text-sm text-gray-400">
          <Loader2 size={16} className="animate-spin" /> Loading problems...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm py-12 text-center text-sm text-gray-400">No problems found.</div>
      ) : (
        <div className="space-y-3">
          {Object.entries(grouped).map(([type, items]) => {
            const completedCount = items.filter((p) => p.status === 'Reviewed').length
            const isCollapsed = collapsed[type]
            return (
              <div key={type} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Group header */}
                <button
                  onClick={() => toggleGroup(type)}
                  className="w-full flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {isCollapsed
                    ? <ChevronRight size={15} className="text-gray-400 flex-shrink-0" />
                    : <ChevronDown size={15} className="text-gray-400 flex-shrink-0" />
                  }
                  <TypeBadge type={type} />
                  <span className="text-sm font-semibold text-gray-700">
                    {items.length} {items.length === 1 ? 'problem' : 'problems'}
                  </span>
                  <span className="ml-auto text-xs text-gray-400">{completedCount} / {items.length} completed</span>
                </button>

                {/* Problem rows */}
                {!isCollapsed && items.map((item) => {
                  const status = getStatus(item)
                  const deadline = item.deadline
                    ? new Date(item.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'No deadline'
                  return (
                    <Link
                      key={item.classProblemId}
                      to={`/student/classes/${classId}/problems/${item.classProblemId}`}
                      className="flex items-center gap-3 px-5 py-4 border-b border-gray-50 hover:bg-gray-50 last:border-b-0"
                    >
                      {status === 'reviewed'
                        ? <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                        : status === 'pending'
                        ? <Clock size={16} className="text-yellow-500 flex-shrink-0" />
                        : <Circle size={16} className="text-gray-300 flex-shrink-0" />
                      }
                      <span className="flex-1 text-sm font-medium text-gray-900">
                        {item.problem?.title ?? 'Untitled problem'}
                      </span>
                      <span className="text-xs text-gray-400 mr-4">{deadline}</span>
                      {status === 'reviewed' && (
                        <span className="text-xs font-medium text-green-600">Reviewed</span>
                      )}
                      {status === 'pending' && (
                        <span className="text-xs font-medium text-amber-500">Pending review</span>
                      )}
                    </Link>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
