import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Clock, RotateCcw, ChevronLeft, Search, FileText, ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getTrainerSubmissions, type TrainerSubmission } from '../../utils/trainerStore'

type StatusFilterMode = 'all' | 'pending' | 'reviewed' | 'late'

const STATUS_CHIPS: { value: StatusFilterMode; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'late', label: 'Late' },
]

export function TrainerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  // View mode from URL: if view=review-queue, show full review queue
  const isReviewQueueView = searchParams.get('view') === 'review-queue'
  const activeStatus = (searchParams.get('status') as StatusFilterMode) || 'pending'

  // Data
  const [submissions, setSubmissions] = useState<TrainerSubmission[]>(getTrainerSubmissions)

  useEffect(() => {
    setSubmissions(getTrainerSubmissions())
  }, [])

  // Filters state
  const [selectedClass, setSelectedClass] = useState<string>('All Classes')
  const [selectedSubject, setSelectedSubject] = useState<string>('All Subjects')
  const [searchQuery, setSearchQuery] = useState('')
  const [dashboardStatusTab, setDashboardStatusTab] = useState<'pending' | 'reviewed' | 'late'>('pending')

  // Reset filters
  const handleReset = () => {
    setSelectedClass('All Classes')
    setSelectedSubject('All Subjects')
    setSearchQuery('')
    setDashboardStatusTab('pending')
  }

  // Subject color helper
  const getSubjectColor = (subj: string) => {
    switch (subj) {
      case 'DSA':
        return 'text-orange-600'
      case 'OS':
        return 'text-purple-600'
      case 'Database':
        return 'text-emerald-600'
      default:
        return 'text-gray-700'
    }
  }

  const getSubjectBadgeStyle = (subj: string) => {
    switch (subj) {
      case 'DSA':
        return 'bg-orange-50 text-orange-600 font-semibold'
      case 'OS':
        return 'bg-purple-50 text-purple-600 font-semibold'
      case 'Database':
        return 'bg-emerald-50 text-emerald-600 font-semibold'
      default:
        return 'bg-gray-100 text-gray-700 font-semibold'
    }
  }

  // Filtered by top bar (class, subject)
  const baseFiltered = useMemo(() => {
    return submissions.filter((s) => {
      if (selectedClass !== 'All Classes' && s.className !== selectedClass) return false
      if (selectedSubject !== 'All Subjects' && s.subject !== selectedSubject) return false
      return true
    })
  }, [submissions, selectedClass, selectedSubject])

  // Counts for cards and tabs
  const totalSubmissions = baseFiltered.length
  const pendingCount = baseFiltered.filter((s) => s.status === 'pending').length
  const reviewedCount = baseFiltered.filter((s) => s.status === 'reviewed').length
  const lateCount = baseFiltered.filter((s) => s.status === 'late').length

  // Rows for main dashboard preview table
  const dashboardTableRows = useMemo(() => {
    return baseFiltered.filter((s) => s.status === dashboardStatusTab)
  }, [baseFiltered, dashboardStatusTab])

  // Rows for Full Review Queue view
  const fullQueueRows = useMemo(() => {
    return submissions.filter((s) => {
      // Mode filter: all | pending | reviewed | late
      if (activeStatus !== 'all' && s.status !== activeStatus) return false
      return true
    })
  }, [submissions, activeStatus])

  // Status counts for full view chips
  const fullQueueCounts = useMemo(() => {
    return {
      all: submissions.length,
      pending: submissions.filter((s) => s.status === 'pending').length,
      reviewed: submissions.filter((s) => s.status === 'reviewed').length,
      late: submissions.filter((s) => s.status === 'late').length,
    }
  }, [submissions])

  // Navigate to review detail
  const handleNavigateToDetail = (sub: TrainerSubmission) => {
    navigate(`/trainer/classes/${sub.classId || 'wecamp-21'}/submissions/${sub.id}`)
  }

  // First name greeting
  const firstName = user.name ? user.name.split(' ')[0] : 'Nguyen'

  // ══════════════════════════════════════════════════════════════════════════════
  // VIEW 1: FULL REVIEW QUEUE VIEW (Under Dashboard Tab)
  // ══════════════════════════════════════════════════════════════════════════════
  if (isReviewQueueView) {
    return (
      <div className="p-8 max-w-[1280px] mx-auto space-y-6 pb-16">
        {/* Top Back Breadcrumb */}
        <div>
          <button
            type="button"
            onClick={() => setSearchParams({})}
            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-1.5"
          >
            <ChevronLeft size={16} />
            Back to Dashboard
          </button>
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            DASHBOARD / REVIEWS
          </div>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Review Queue
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-0.5">
              Showing {fullQueueRows.length} {activeStatus !== 'all' ? activeStatus : ''} submissions
            </p>
          </div>
        </div>

        {/* Status Filter Chips: All, Pending, Reviewed, Late */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-gray-100 shadow-sm w-fit overflow-x-auto">
          {STATUS_CHIPS.map((chip) => {
            const isActive = activeStatus === chip.value
            const count = fullQueueCounts[chip.value]
            return (
              <button
                key={chip.value}
                type="button"
                onClick={() =>
                  setSearchParams({ view: 'review-queue', status: chip.value })
                }
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'bg-accent text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span>{chip.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Full Queue Table Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {fullQueueRows.length === 0 ? (
            <div className="p-16 text-center">
              <FileText size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-600 font-bold text-base">No submissions found</p>
              <p className="text-gray-400 text-xs mt-1">
                There are currently no submissions matching your active filter criteria.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-white">
                    <th className="py-3.5 px-6 w-12">#</th>
                    <th className="py-3.5 px-6">STUDENT</th>
                    <th className="py-3.5 px-6">PROBLEM</th>
                    <th className="py-3.5 px-6">CLASS</th>
                    <th className="py-3.5 px-6">SUBJECT</th>
                    <th className="py-3.5 px-6">SUBMITTED</th>
                    <th className="py-3.5 px-6">STATUS</th>
                    <th className="py-3.5 px-6 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {fullQueueRows.map((sub, idx) => (
                    <tr
                      key={sub.id}
                      onClick={() => handleNavigateToDetail(sub)}
                      className="hover:bg-gray-50/70 transition-colors group cursor-pointer"
                    >
                      {/* Index */}
                      <td className="py-4 px-6 text-xs text-gray-400 font-medium">
                        {idx + 1}
                      </td>

                      {/* Student */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {sub.studentInitials}
                          </div>
                          <span className="text-sm font-semibold text-gray-900 group-hover:text-accent transition-colors">
                            {sub.studentName}
                          </span>
                        </div>
                      </td>

                      {/* Problem */}
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-gray-800">
                          {sub.problemTitle}
                        </span>
                      </td>

                      {/* Class */}
                      <td className="py-4 px-6">
                        <span className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                          {sub.className}
                        </span>
                      </td>

                      {/* Subject */}
                      <td className="py-4 px-6">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-md inline-block ${getSubjectBadgeStyle(
                            sub.subject
                          )}`}
                        >
                          {sub.subject}
                        </span>
                      </td>

                      {/* Submitted Time */}
                      <td className="py-4 px-6 text-xs text-gray-500 font-medium">
                        {sub.submittedAt}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        {sub.status === 'pending' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                            Pending
                          </span>
                        )}
                        {sub.status === 'reviewed' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            Reviewed
                          </span>
                        )}
                        {sub.status === 'late' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                            Late
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleNavigateToDetail(sub)
                          }}
                          className={`text-xs font-semibold inline-flex items-center gap-1 transition-colors ${
                            sub.status === 'reviewed'
                              ? 'text-gray-500 hover:text-gray-900'
                              : 'text-accent hover:underline'
                          }`}
                        >
                          {sub.status === 'reviewed' ? 'View' : 'Review'}
                          <ChevronRight size={13} />
                        </button>
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

  // ══════════════════════════════════════════════════════════════════════════════
  // VIEW 2: STANDARD DASHBOARD OVERVIEW
  // ══════════════════════════════════════════════════════════════════════════════
  return (
    <div className="p-8 max-w-[1280px] mx-auto">
      {/* Greeting Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Good morning, {firstName}
        </h1>
        <p className="text-sm text-gray-500 mt-1">Here's what's happening in your classes.</p>
      </div>

      {/* Top Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          {/* Class Filter */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:border-accent/40 cursor-pointer min-w-[130px]"
            >
              <option value="All Classes">All Classes</option>
              <option value="WeCamp Batch 15">WeCamp Batch 15</option>
              <option value="WeCamp Batch 22">WeCamp Batch 22</option>
              <option value="StarCamp Batch 2">StarCamp Batch 2</option>
            </select>
          </div>

          {/* Subject Filter */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:border-accent/40 cursor-pointer min-w-[130px]"
            >
              <option value="All Subjects">All Subjects</option>
              <option value="DSA">DSA</option>
              <option value="OS">OS</option>
              <option value="Database">Database</option>
            </select>
          </div>
        </div>

        {/* Reset Filters */}
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-hover transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
        >
          <RotateCcw size={13} />
          Reset filters
        </button>
      </div>

      {/* Two Stat Cards (Card 2 Pending Review arrow removed) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Card 1: Total Submissions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-500">
            <CheckCircle2 size={24} className="text-blue-500" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Total Submissions
            </p>
            <p className="text-3xl font-extrabold text-gray-900 mt-1">{totalSubmissions}</p>
          </div>
        </div>

        {/* Card 2: Pending Review (No Arrow) */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center flex-shrink-0 text-amber-500">
            <Clock size={24} className="text-amber-500" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Pending Review
            </p>
            <p className="text-3xl font-extrabold text-gray-900 mt-1">{pendingCount}</p>
          </div>
        </div>
      </div>

      {/* Review Queue Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Review Queue</h2>
          <button
            type="button"
            onClick={() => setSearchParams({ view: 'review-queue', status: 'pending' })}
            className="text-xs font-semibold text-accent hover:underline transition-colors flex items-center gap-1"
          >
            View all &rarr;
          </button>
        </div>

        {/* Review Queue Table Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-white">
                  <th className="py-3.5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="py-3.5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Problem
                  </th>
                  <th className="py-3.5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="py-3.5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3.5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {dashboardTableRows.length > 0 ? (
                  dashboardTableRows.map((sub) => (
                    <tr
                      key={sub.id}
                      className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                      onClick={() => handleNavigateToDetail(sub)}
                    >
                      {/* Student */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {sub.studentInitials}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {sub.studentName}
                          </span>
                        </div>
                      </td>

                      {/* Problem */}
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-gray-800">
                          {sub.problemTitle}
                        </span>
                      </td>

                      {/* Subject */}
                      <td className="py-4 px-6">
                        <span className={`text-sm font-semibold ${getSubjectColor(sub.subject)}`}>
                          {sub.subject}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        {sub.status === 'pending' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                            Pending
                          </span>
                        )}
                        {sub.status === 'reviewed' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            Reviewed
                          </span>
                        )}
                        {sub.status === 'late' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200/60">
                            Late
                          </span>
                        )}
                      </td>

                      {/* Review Action */}
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleNavigateToDetail(sub)
                          }}
                          className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
                        >
                          Review &rarr;
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-sm text-gray-400">
                      No submissions found matching the criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom Filter Pills on Dashboard Overview */}
          <div className="p-4 border-t border-gray-100 flex items-center gap-2 bg-white">
            <button
              type="button"
              onClick={() => setDashboardStatusTab('pending')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                dashboardStatusTab === 'pending'
                  ? 'bg-red-50 text-accent font-bold'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setDashboardStatusTab('reviewed')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                dashboardStatusTab === 'reviewed'
                  ? 'bg-red-50 text-accent font-bold'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              Reviewed ({reviewedCount})
            </button>
            <button
              type="button"
              onClick={() => setDashboardStatusTab('late')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                dashboardStatusTab === 'late'
                  ? 'bg-red-50 text-accent font-bold'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              Late ({lateCount})
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
