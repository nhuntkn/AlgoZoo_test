import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { BookOpen, FileCheck, CheckCircle2, Clock, Users, UserCheck } from 'lucide-react'
import { ClassTabNav } from '../../../components/layout/ClassTabNav'
import { getTrainerClassById, type TrainerClass } from '../../../utils/trainerStore'

export function TrainerClassOverview() {
  const { classId = 'wecamp-21' } = useParams<{ classId: string }>()
  const [cls, setCls] = useState<TrainerClass | null>(null)

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

  if (!cls) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm max-w-2xl mx-auto">
        <p className="text-gray-500 font-medium mb-3">Class not found.</p>
        <Link to="/trainer/classes" className="text-sm text-accent font-semibold hover:underline">
          ← Back to My Classes
        </Link>
      </div>
    )
  }

  const tabs = [
    { label: 'Overview', to: `/trainer/classes/${cls.id}/overview` },
    { label: 'Problems', to: `/trainer/classes/${cls.id}/problems` },
    { label: 'Submissions', to: `/trainer/classes/${cls.id}/submissions` },
    { label: 'Students', to: `/trainer/classes/${cls.id}/students` },
  ]

  const crumbs = [
    { label: 'My Classes', to: '/trainer/classes' },
    { label: cls.name },
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

      {/* ── 4 Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Problems */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Total Problems</p>
            <p className="text-3xl font-bold text-gray-900">{cls.totalProblems}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-accent flex items-center justify-center">
            <BookOpen size={20} />
          </div>
        </div>

        {/* Total Submissions */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Total Submissions</p>
            <p className="text-3xl font-bold text-gray-900">{cls.totalSubmissions}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileCheck size={20} />
          </div>
        </div>

        {/* Reviewed */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Reviewed</p>
            <p className="text-3xl font-bold text-gray-900">{cls.reviewedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Pending</p>
            <p className="text-3xl font-bold text-gray-900">{cls.pendingCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={20} />
          </div>
        </div>
      </div>

      {/* ── Lower Panels: Class Information & Recent Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Information Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4">Class Information</h2>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                DESCRIPTION
              </p>
              <p className="text-sm text-gray-800">{cls.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  STUDENTS
                </p>
                <div className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm">
                  <Users size={16} className="text-gray-400" />
                  <span>{cls.studentsCount}</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  TRAINERS
                </p>
                <div className="flex items-center gap-1.5 text-gray-800 font-semibold text-sm">
                  <UserCheck size={16} className="text-gray-400" />
                  <span>{cls.trainersCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4">Recent Activity</h2>

          <div className="space-y-3.5">
            {cls.recentActivity.map((act) => (
              <div key={act.id} className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 leading-snug">{act.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
