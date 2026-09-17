import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { ClassTabNav } from '../../../components/layout/ClassTabNav'
import {
  getTrainerClassById,
  getTrainerClassSubmissions,
  getTrainerAssignedProblems,
  type TrainerClass,
  type TrainerClassSubmission,
} from '../../../utils/trainerStore'
import { getClassStudents } from '../../../utils/adminStore'

// Avatar color palette
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

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function TrainerClassStudents() {
  const { classId = 'wecamp-21' } = useParams<{ classId: string }>()
  const [cls, setCls] = useState<TrainerClass | null>(null)
  const [search, setSearch] = useState('')

  const loadData = () => {
    const found = getTrainerClassById(classId)
    if (found) setCls(found)
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('algozoo_trainer_classes_updated', handleUpdate)
    return () => window.removeEventListener('algozoo_trainer_classes_updated', handleUpdate)
  }, [classId])

  if (!cls) return null

  const students = getClassStudents(classId)
  const submissions = getTrainerClassSubmissions(classId)
  const assignedProblems = getTrainerAssignedProblems(classId)
  const totalProblems = assignedProblems.length || cls.totalProblems || 8

  const tabs = [
    { label: 'Overview', to: `/trainer/classes/${cls.id}/overview` },
    { label: 'Problems', to: `/trainer/classes/${cls.id}/problems` },
    { label: 'Submissions', to: `/trainer/classes/${cls.id}/submissions` },
    { label: 'Students', to: `/trainer/classes/${cls.id}/students` },
  ]

  const crumbs = [
    { label: 'My Classes', to: '/trainer/classes' },
    { label: cls.name, to: `/trainer/classes/${cls.id}/overview` },
    { label: 'Students' },
  ]

  // Enrich students with progress data
  const enrichedStudents = students.map((std) => {
    const initials = getInitials(std.name)
    // Count unique problems submitted by this student
    const studentSubs = submissions.filter(
      (s: TrainerClassSubmission) =>
        s.studentName.toLowerCase() === std.name.toLowerCase()
    )
    const uniqueProblemsSubmitted = new Set(studentSubs.map((s: TrainerClassSubmission) => s.problemId)).size
    const completedCount = std.completedCount ?? uniqueProblemsSubmitted
    const studentTotalProblems = std.totalProblems ?? totalProblems
    const progress = studentTotalProblems > 0 ? Math.round((completedCount / studentTotalProblems) * 100) : 0

    return {
      ...std,
      initials,
      completedCount,
      totalProblems: studentTotalProblems,
      progress,
    }
  })

  const filteredStudents = search
    ? enrichedStudents.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          (s.email && s.email.toLowerCase().includes(search.toLowerCase()))
      )
    : enrichedStudents

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <ClassTabNav
        backLink={{ label: 'My Classes', to: '/trainer/classes' }}
        crumbs={crumbs}
        title={cls.name}
        status={cls.status}
        tabs={tabs}
      />

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm text-gray-500 font-medium">
          {filteredStudents.length} students enrolled
        </p>

        <div className="relative max-w-[280px]">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:border-accent bg-white shadow-xs transition-colors"
          />
        </div>
      </div>

      {/* ── Students Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 font-medium">No students found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-6">Student</th>
                  <th className="py-3 px-6">Email</th>
                  <th className="py-3 px-6">Joined</th>
                  <th className="py-3 px-6 w-72">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {filteredStudents.map((std) => (
                  <tr
                    key={std.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Student Name + Avatar */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        >
                          {std.initials}
                        </div>
                        <span className="font-semibold text-gray-900">{std.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-6 text-sm text-gray-500 font-medium">
                      {std.email || '—'}
                    </td>

                    {/* Joined Date */}
                    <td className="py-4 px-6 text-sm text-gray-500 font-medium">
                      {std.joinedDate || '—'}
                    </td>

                    {/* Progress */}
                    <td className="py-4 px-6">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500 font-medium">
                            {std.completedCount}/{std.totalProblems} completed
                          </span>
                          <span className="text-gray-900 font-bold">
                            {std.progress}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, Math.max(0, std.progress))}%`,
                            }}
                          />
                        </div>
                      </div>
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
