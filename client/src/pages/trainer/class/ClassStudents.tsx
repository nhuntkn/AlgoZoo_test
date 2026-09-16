import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { ClassTabNav } from '../../../components/layout/ClassTabNav'
import { ProgressBar } from '../../../components/ui/ProgressBar'

const classNames: Record<string, string> = {
  '1': 'WeCamp Batch 21',
  '2': 'WeCamp Batch 22',
}

type Student = {
  id: number
  name: string
  initials: string
  email: string
  joinedAt: string
  completed: number
  total: number
}

const initialStudents: Student[] = [
  { id: 1, name: 'Alice Nguyen', initials: 'AN', email: 'alice@gmail.com', joinedAt: 'Sep 1', completed: 6, total: 8 },
]

export function ClassStudents() {
  const { classId = '1' } = useParams()
  const className = classNames[classId] ?? 'WeCamp Batch 21'
  const [students] = useState(initialStudents)
  const [search, setSearch] = useState('')

  const tabs = [
    { label: 'Overview', to: `/trainer/classes/${classId}/overview` },
    { label: 'Problems', to: `/trainer/classes/${classId}/problems` },
    { label: 'Submissions', to: `/trainer/classes/${classId}/submissions` },
    { label: 'Students', to: `/trainer/classes/${classId}/students` },
  ]

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <ClassTabNav
        crumbs={[
          { label: 'My Classes', to: '/trainer/classes' },
          { label: className, to: `/trainer/classes/${classId}/overview` },
          { label: 'Students' },
        ]}
        title={className}
        tabs={tabs}
      />

      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">{students.length} students enrolled</p>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students..."
            className="pl-8 pr-4 py-2 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:border-accent/50 w-52"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1fr_190px_90px_1fr] px-6 py-3 border-b border-gray-100">
          {['STUDENT', 'EMAIL', 'JOINED', 'PROGRESS'].map((h) => (
            <span key={h} className="text-[10px] font-bold text-gray-400 tracking-widest">{h}</span>
          ))}
        </div>
        {filtered.map((s, i) => {
          const pct = Math.round((s.completed / s.total) * 100)
          return (
            <div
              key={s.id}
              className={`grid grid-cols-[1fr_190px_90px_1fr] items-center px-6 py-4 hover:bg-gray-50 ${
                i < filtered.length - 1 ? 'border-b border-gray-50' : ''
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                  {s.initials}
                </div>
                <span className="text-sm font-semibold text-gray-900">{s.name}</span>
              </div>
              <span className="text-sm text-gray-500 truncate">{s.email}</span>
              <span className="text-sm text-gray-400">{s.joinedAt}</span>
              <div className="pr-6">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">{s.completed}/{s.total} completed</span>
                  <span className="text-xs text-gray-600 font-medium">{pct}%</span>
                </div>
                <ProgressBar value={pct} />
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-400">No students found</div>
        )}
      </div>
    </div>
  )
}
