import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, Circle, Clock, Loader2, Search } from 'lucide-react'
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

export function StudentProblemList() {
  const { classId = '' } = useParams()
  const [problems, setProblems] = useState<StudentClassProblem[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!classId) return
    studentService.getClassProblems(classId)
      .then((response) => setProblems(response.data))
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Unable to load problems'))
      .finally(() => setLoading(false))
  }, [classId])

  const filtered = problems.filter((item) => {
    const matchesSearch = item.problem?.title.toLowerCase().includes(search.toLowerCase()) ?? false
    return matchesSearch && (filter === 'all' || getStatus(item) === filter)
  })

  return <div><ClassTabNav crumbs={[{ label: 'My Classes', to: '/student/classes' }, { label: 'Problems' }]} title="Assigned Problems" tabs={[{ label: 'Problems', to: `/student/classes/${classId}/problems` }]} /><div className="flex items-center justify-between mb-5 gap-3 flex-wrap"><div className="relative"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search problems..." className="pl-8 pr-4 py-2 border border-gray-200 rounded-xl bg-white text-sm" /></div><div className="flex gap-1">{(['all', 'not-started', 'pending', 'reviewed'] as Filter[]).map((value) => <button key={value} onClick={() => setFilter(value)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${filter === value ? 'bg-accent text-white' : 'bg-white text-gray-500'}`}>{value === 'all' ? 'All' : value === 'not-started' ? 'Not Started' : value === 'pending' ? 'Pending' : 'Reviewed'}</button>)}</div></div>{error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}{loading ? <div className="py-16 flex justify-center gap-2 text-sm text-gray-400"><Loader2 size={16} className="animate-spin" /> Loading problems...</div> : <div className="bg-white rounded-2xl shadow-sm overflow-hidden">{filtered.map((item) => { const status = getStatus(item); const problemType = item.problem?.problemType as string | undefined; const type = problemType === 'DB' ? 'Database' : problemType === 'OTHER' ? 'Other' : problemType; return <Link key={item.classProblemId} to={`/student/classes/${classId}/problems/${item.classProblemId}`} className="flex items-center gap-3 px-5 py-4 border-b border-gray-50 hover:bg-gray-50">{status === 'reviewed' ? <CheckCircle2 size={16} className="text-green-500" /> : status === 'pending' ? <Clock size={16} className="text-yellow-500" /> : <Circle size={16} className="text-gray-300" />}<span className="flex-1 text-sm font-medium text-gray-900">{item.problem?.title ?? 'Untitled problem'}</span>{type && <TypeBadge type={type} />}<span className="text-xs text-gray-400">{item.deadline ? new Date(item.deadline).toLocaleDateString() : 'No deadline'}</span></Link>})}{!filtered.length && <p className="py-12 text-center text-sm text-gray-400">No problems found.</p>}</div>}</div>
}
