import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Users, BookOpen, Clock, CheckCircle, Loader2 } from 'lucide-react'
import { ClassTabNav } from '../../../components/layout/ClassTabNav'
import { StatCard } from '../../../components/ui/StatCard'
import { useClassDetail } from '../../../hooks/useClassDetail'
import { getSubmissions } from '../../../services/submissionService'
import type { SubmissionListItem } from '../../../types/submission'

export function ClassOverview() {
  const { classId = '' } = useParams()
  const { classDetail, loading, error } = useClassDetail(classId)
  const [submissions, setSubmissions] = useState<SubmissionListItem[]>([])

  useEffect(() => {
    let cancelled = false
    getSubmissions()
      .then((all) => { if (!cancelled) setSubmissions(all.filter((s) => s.class?.id === classId)) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [classId])

  const tabs = [
    { label: 'Overview', to: `/trainer/classes/${classId}/overview` },
    { label: 'Problems', to: `/trainer/classes/${classId}/problems` },
    { label: 'Submissions', to: `/trainer/classes/${classId}/submissions` },
    { label: 'Students', to: `/trainer/classes/${classId}/students` },
  ]

  // Pending here must mean the same thing as the Dashboard's "Pending Review" KPI —
  // late-and-unreviewed submissions are their own bucket, not part of "pending".
  const reviewed = submissions.filter((s) => s.status === 'review').length
  const pending = submissions.filter((s) => s.status === 'pending').length

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

  return (
    <div>
      <ClassTabNav
        crumbs={[{ label: 'My Classes', to: '/trainer/classes' }, { label: classDetail.className }]}
        title={classDetail.className}
        tabs={tabs}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Problems" value={classDetail.total_problems} icon={<BookOpen size={16} className="text-accent" />} color="bg-red-50" />
        <StatCard label="Total Submissions" value={submissions.length} icon={<CheckCircle size={16} className="text-green-600" />} color="bg-green-50" />
        <StatCard label="Reviewed" value={reviewed} icon={<CheckCircle size={16} className="text-blue-600" />} color="bg-blue-50" />
        <StatCard label="Pending" value={pending} icon={<Clock size={16} className="text-amber-600" />} color="bg-amber-50" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Class Information */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
          <h3 className="font-bold text-gray-900">Class Information</h3>

          {classDetail.description && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Description</p>
              <p className="text-sm text-gray-600">{classDetail.description}</p>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Students</p>
            <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900">
              <Users size={14} className="text-gray-400" /> {classDetail.students.length}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
          {submissions.length === 0 ? (
            <p className="text-sm text-gray-400">No submissions yet.</p>
          ) : (
            <div className="space-y-3">
              {submissions.slice(0, 5).map((s) => (
                <div key={s.submission_id} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">
                      {s.student?.name ?? 'A student'} submitted {s.problem?.title ?? 'a problem'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(s.submitted_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}