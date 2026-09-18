import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Search, Loader2 } from 'lucide-react'
import { ClassTabNav } from '../../../components/layout/ClassTabNav'
import { ProgressBar } from '../../../components/ui/ProgressBar'
import { useClassDetail } from '../../../hooks/useClassDetail'

function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

export function ClassStudents() {
  const { classId = '' } = useParams()
  const navigate = useNavigate()
  const { classDetail, loading, error } = useClassDetail(classId)
  const [search, setSearch] = useState('')

  const tabs = [
    { label: 'Overview', to: `/trainer/classes/${classId}/overview` },
    { label: 'Problems', to: `/trainer/classes/${classId}/problems` },
    { label: 'Submissions', to: `/trainer/classes/${classId}/submissions` },
    { label: 'Students', to: `/trainer/classes/${classId}/students` },
  ]

  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center text-sm text-gray-400 gap-2">
        <Loader2 size={16} className="animate-spin" /> Loading class...
      </div>
    )
  }

  if (error || !classDetail) {
    return <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">{error ?? 'Class not found'}</div>
  }

  const filtered = classDetail.students.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <ClassTabNav
        crumbs={[
          { label: 'My Classes', to: '/trainer/classes' },
          { label: classDetail.className, to: `/trainer/classes/${classId}/overview` },
          { label: 'Students' },
        ]}
        title={classDetail.className}
        tabs={tabs}
      />

      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">{classDetail.students.length} students enrolled</p>
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
        <div className="grid grid-cols-[1fr_1fr] px-6 py-3 border-b border-gray-100">
          {['STUDENT', 'PROGRESS'].map((h) => (
            <span key={h} className="text-[10px] font-bold text-gray-400 tracking-widest">{h}</span>
          ))}
        </div>
        {filtered.map((s, i) => {
          const total = classDetail.total_problems
          const pct = total > 0 ? Math.round((s.completed_tasks / total) * 100) : 0
          return (
            <div
              key={s.user_id}
              onClick={() => navigate(`/trainer/classes/${classId}/submissions?student=${encodeURIComponent(s.name)}`)}
              className={`grid grid-cols-[1fr_1fr] items-center px-6 py-4 hover:bg-gray-50 cursor-pointer ${
                i < filtered.length - 1 ? 'border-b border-gray-50' : ''
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                  {initials(s.name)}
                </div>
                <span className="text-sm font-semibold text-gray-900">{s.name}</span>
              </div>
              <div className="pr-6">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">{s.completed_tasks}/{total} completed</span>
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