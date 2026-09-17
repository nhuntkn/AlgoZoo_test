import { useState, useEffect, useMemo } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { ClassTabNav } from '../../../components/layout/ClassTabNav'
import {
  getTrainerClassById,
  getTrainerClassSubmissions,
  type TrainerClass,
  type TrainerClassSubmission,
} from '../../../utils/trainerStore'

type FilterTab = 'all' | 'pending' | 'reviewed' | 'late'

// Avatar color palette — deterministic per initials
const AVATAR_COLORS = [
  'bg-amber-500',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-rose-500',
  'bg-violet-500',
  'bg-cyan-500',
  'bg-orange-500',
  'bg-teal-500',
]

function getAvatarColor(initials: string) {
  let hash = 0
  for (let i = 0; i < initials.length; i++) {
    hash = initials.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export function TrainerClassSubmissions() {
  const { classId = 'wecamp-21' } = useParams<{ classId: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [cls, setCls] = useState<TrainerClass | null>(null)
  const [submissions, setSubmissions] = useState<TrainerClassSubmission[]>([])
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [search, setSearch] = useState('')

  // Problem filter from query params (when coming from Problems tab "View Submissions")
  const problemFilter = searchParams.get('problem') || ''

  const loadData = () => {
    const found = getTrainerClassById(classId)
    if (found) setCls(found)
    setSubmissions(getTrainerClassSubmissions(classId))
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('algozoo_trainer_classes_updated', handleUpdate)
    return () => window.removeEventListener('algozoo_trainer_classes_updated', handleUpdate)
  }, [classId])

  // Filter logic
  const filteredSubmissions = useMemo(() => {
    let result = [...submissions]

    // Problem filter from URL
    if (problemFilter) {
      result = result.filter(
        (s) => s.problemTitle.toLowerCase() === problemFilter.toLowerCase()
      )
    }

    // Search filter
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (s) =>
          s.studentName.toLowerCase().includes(q) ||
          s.problemTitle.toLowerCase().includes(q)
      )
    }

    // Status filter
    if (activeFilter === 'pending') {
      result = result.filter((s) => s.status === 'pending')
    } else if (activeFilter === 'reviewed') {
      result = result.filter((s) => s.status === 'reviewed')
    } else if (activeFilter === 'late') {
      result = result.filter((s) => s.isLate)
    }

    // Sort by submitted date (newest first)
    result.sort((a, b) => {
      const dateA = new Date(a.submittedFull).getTime()
      const dateB = new Date(b.submittedFull).getTime()
      return dateA - dateB
    })

    return result
  }, [submissions, problemFilter, search, activeFilter])

  // Counts for filter chips (based on base list before status filter)
  const counts = useMemo(() => {
    let baseList = [...submissions]
    if (problemFilter) {
      baseList = baseList.filter(
        (s) => s.problemTitle.toLowerCase() === problemFilter.toLowerCase()
      )
    }
    if (search) {
      const q = search.toLowerCase()
      baseList = baseList.filter(
        (s) =>
          s.studentName.toLowerCase().includes(q) ||
          s.problemTitle.toLowerCase().includes(q)
      )
    }
    return {
      all: baseList.length,
      pending: baseList.filter((s) => s.status === 'pending').length,
      reviewed: baseList.filter((s) => s.status === 'reviewed').length,
      late: baseList.filter((s) => s.isLate).length,
    }
  }, [submissions, problemFilter, search])

  if (!cls) return null

  const tabs = [
    { label: 'Overview', to: `/trainer/classes/${cls.id}/overview` },
    { label: 'Problems', to: `/trainer/classes/${cls.id}/problems` },
    { label: 'Submissions', to: `/trainer/classes/${cls.id}/submissions` },
    { label: 'Students', to: `/trainer/classes/${cls.id}/students` },
  ]

  const crumbs = [
    { label: 'My Classes', to: '/trainer/classes' },
    { label: cls.name, to: `/trainer/classes/${cls.id}/overview` },
    { label: 'Submissions' },
  ]

  const clearProblemFilter = () => {
    setSearchParams({})
  }

  const filterChips: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'pending', label: 'Pending', count: counts.pending },
    { key: 'reviewed', label: 'Reviewed', count: counts.reviewed },
    { key: 'late', label: 'Late', count: counts.late },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* ── Top Navigation & Tabs ── */}
      <ClassTabNav
        backLink={{ label: 'My Classes', to: '/trainer/classes' }}
        crumbs={crumbs}
        title={cls.name}
        status={cls.status}
        tabs={tabs}
      />

      {/* ── Problem Filter Banner ── */}
      {problemFilter && (
        <div className="flex items-center justify-between bg-red-50/60 border border-red-100 rounded-xl px-5 py-2.5">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-accent font-semibold">
              Filtering by: Problem: {problemFilter}
            </span>
            <span className="text-gray-400">· {filteredSubmissions.length} submissions</span>
          </div>
          <button
            onClick={clearProblemFilter}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            <X size={13} />
            Clear filter
          </button>
        </div>
      )}

      {/* ── Filter Chips + Search ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
              {filterChips.map((chip) => {
                const isActive = activeFilter === chip.key
                const isLateChip = chip.key === 'late'
                return (
                  <button
                    key={chip.key}
                    onClick={() => setActiveFilter(chip.key)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                      isActive
                        ? 'bg-accent text-white border-accent shadow-sm shadow-red-200'
                        : isLateChip
                        ? 'bg-amber-50/60 text-amber-600 border-amber-200/80 hover:border-amber-300'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {chip.label} ({chip.count})
                  </button>
                )
              })}
        </div>

        <div className="relative max-w-[280px]">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search student or problem"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:border-accent bg-white shadow-xs transition-colors"
          />
        </div>
      </div>

      {/* ── Flat Submissions Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filteredSubmissions.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 font-medium">No submissions found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-6">Student</th>
                  <th className="py-3 px-6">Problem</th>
                  <th className="py-3 px-6">Submitted</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {filteredSubmissions.map((sub) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Student */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        >
                          {sub.studentInitials}
                        </div>
                        <span className="font-semibold text-gray-900">
                          {sub.studentName}
                        </span>
                        {sub.isLate && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-600 border border-amber-200/60">
                            Late
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Problem */}
                    <td className="py-4 px-6 text-sm text-gray-700 font-medium">
                      {sub.problemTitle}
                    </td>

                    {/* Submitted Date */}
                    <td className="py-4 px-6 text-xs text-gray-500 font-medium">
                      {sub.submittedDate}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          sub.status === 'pending'
                            ? 'bg-amber-50 text-amber-600 border border-amber-200/60'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        }`}
                      >
                        {sub.status === 'pending' ? 'Pending' : 'Reviewed'}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 text-right">
                      <Link
                        to={`/trainer/classes/${classId}/submissions/${sub.id}`}
                        className="text-xs text-accent font-semibold hover:underline"
                      >
                        {sub.status === 'pending' ? 'Review' : 'View'}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
