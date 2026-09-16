import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, RotateCcw, ArrowRight, Clock, CheckCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getSubmissions } from '../../services/submissionService'
import type { SubmissionListItem } from '../../types/submission'
import { getTrainerClasses } from '../../services/classroomService'
import { mapProblemType } from '../../services/problemService'

type Subject = 'DSA' | 'Database' | 'OS' | 'Other'
type SubmissionStatus = 'pending' | 'reviewed' | 'late'
type QueueTab = 'pending' | 'reviewed' | 'late'

type QueueItem = {
  id: string
  student: string
  initials: string
  problem: string
  subject: Subject
  class: string
  status: SubmissionStatus
  date: string
}

function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

function toQueueItem(s: SubmissionListItem): QueueItem {
  return {
    id: s.submission_id,
    student: s.student?.name ?? 'Unknown',
    initials: s.student ? initials(s.student.name) : '?',
    problem: s.problem?.title ?? 'Unknown problem',
    subject: mapProblemType(s.problem?.problemType),
    class: s.class?.className ?? 'Unknown class',
    status: s.status === 'review' ? 'reviewed' : s.status === 'late' ? 'late' : 'pending',
    date: new Date(s.submitted_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
  }
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SUBJECTS: Subject[] = ['DSA', 'Database', 'OS', 'Other']

const subjectStyle: Record<Subject, { bar: string; text: string }> = {
  DSA: { bar: 'bg-orange-400', text: 'text-orange-600' },
  Database: { bar: 'bg-green-500', text: 'text-green-700' },
  OS: { bar: 'bg-purple-500', text: 'text-purple-700' },
  Other: { bar: 'bg-gray-400', text: 'text-gray-600' },
}

const statusBadgeClass: Record<SubmissionStatus, string> = {
  pending: 'bg-orange-100 text-orange-600',
  reviewed: 'bg-green-100 text-green-700',
  late: 'bg-red-100 text-red-600',
}

const TAB_LABELS: Record<QueueTab, string> = {
  pending: 'Pending',
  reviewed: 'Reviewed',
  late: 'Late',
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

type KpiCardProps = {
  label: string
  value: number | string
  subtitle?: string
  icon: React.ReactNode
  iconBg: string
  active?: boolean
  onClick?: () => void
}

function KpiCard({ label, value, subtitle, icon, iconBg, active, onClick }: KpiCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-white rounded-2xl shadow-sm px-5 py-5 flex items-center justify-center gap-4 transition-all ${
        active ? 'ring-2 ring-accent shadow-md' : 'hover:shadow-md'
      } ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest truncate">{label}</p>
        <p className="text-3xl font-bold text-gray-900 leading-tight mt-0.5">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {onClick && <ArrowRight size={14} className="text-gray-300 flex-shrink-0" />}
    </button>
  )
}

// ─── Trainer Dashboard ────────────────────────────────────────────────────────

export function TrainerDashboard() {
  const { user } = useAuth()
  const firstName = user?.name.split(' ')[0] ?? 'there'

  const [items, setItems] = useState<QueueItem[]>([])
  const [classNames, setClassNames] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    Promise.all([getSubmissions(), getTrainerClasses()])
      .then(([subs, classes]) => {
        setItems(subs.map(toQueueItem))
        setClassNames(classes.map((c) => c.className))
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  const [classFilter, setClassFilter] = useState('All Classes')
  const [subjectFilter, setSubjectFilter] = useState<Subject | 'all'>('all')
  const [activeTab, setActiveTab] = useState<QueueTab>('pending')

  const filtered = items.filter((s) => {
    if (classFilter !== 'All Classes' && s.class !== classFilter) return false
    if (subjectFilter !== 'all' && s.subject !== subjectFilter) return false
    return true
  })

  const hasActiveFilters = classFilter !== 'All Classes' || subjectFilter !== 'all'

  function handleResetFilters() {
    setClassFilter('All Classes')
    setSubjectFilter('all')
  }

  const pending = filtered.filter((s) => s.status === 'pending')
  const reviewed = filtered.filter((s) => s.status === 'reviewed')
  const late = filtered.filter((s) => s.status === 'late')
  const total = filtered.length

  const queueRows =
    activeTab === 'pending' ? pending : activeTab === 'reviewed' ? reviewed : late

  return (
    <div>
      {/* Greeting */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Good morning, {firstName}</h1>
        <p className="text-sm text-gray-400 mt-1">Here's what's happening in your classes.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5 text-sm text-red-600">{error}</div>
      )}

      {/* Filter bar */}
      <div className="bg-white rounded-2xl shadow-sm px-5 py-3.5 mb-5 flex items-end gap-4 flex-wrap">
        {/* Class */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Class</span>
          <div className="relative">
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/30 min-w-[130px]"
            >
              <option>All Classes</option>
              {classNames.map((c) => <option key={c}>{c}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Subject */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subject</span>
          <div className="relative">
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value as Subject | 'all')}
              className="appearance-none pl-3 pr-8 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/30 min-w-[130px]"
            >
              <option value="all">All Subjects</option>
              {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 pb-1.5 ml-auto transition-colors"
          >
            <RotateCcw size={13} /> Reset filters
          </button>
        )}
      </div>

      {/* KPI stat cards */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <KpiCard
          label="Total Submissions"
          value={loading ? '—' : total}
          iconBg="bg-blue-100"
          icon={<CheckCircle size={18} className="text-blue-500" />}
        />
        <KpiCard
          label="Pending Review"
          value={loading ? '—' : pending.length}
          iconBg="bg-orange-100"
          icon={<Clock size={18} className="text-orange-500" />}
          active={activeTab === 'pending'}
          onClick={() => setActiveTab('pending')}
        />
      </div>

      {/* Main grid */}
      <div className="grid gap-5">
        {/* Review Queue */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800">Review Queue</h3>
            <Link
              to="/trainer/classes"
              className="text-xs text-accent font-semibold hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>

          <>
            {/* Column headers */}
              <div className="grid grid-cols-[1fr_140px_90px_110px_80px] px-6 py-2.5 border-b border-gray-50">
                {['STUDENT', 'PROBLEM', 'SUBJECT', 'STATUS', ''].map((h, i) => (
                  <span key={i} className="text-[10px] font-bold text-gray-400 tracking-widest">{h}</span>
                ))}
              </div>

              {/* Rows */}
              <div className="flex-1 min-h-[200px]">
                {loading ? (
                  <div className="py-14 flex items-center justify-center text-sm text-gray-400 gap-2">
                    <Loader2 size={16} className="animate-spin" /> Loading...
                  </div>
                ) : queueRows.length === 0 ? (
                  <div className="py-14 text-center text-sm text-gray-400">No submissions</div>
                ) : (
                  queueRows.map((s, i) => (
                    <div
                      key={s.id}
                      className={`grid grid-cols-[1fr_140px_90px_110px_80px] items-center px-6 py-3.5 hover:bg-gray-50 transition-colors ${
                        i < queueRows.length - 1 ? 'border-b border-gray-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                          {s.initials}
                        </div>
                        <span className="text-sm font-medium text-gray-900 truncate">{s.student}</span>
                      </div>
                      <span className="text-sm text-gray-600 truncate">{s.problem}</span>
                      <span className={`text-xs font-semibold ${subjectStyle[s.subject].text}`}>{s.subject}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold w-fit ${statusBadgeClass[s.status]}`}>
                        {TAB_LABELS[s.status]}
                      </span>
                      <div className="flex justify-end">
                        {s.status === 'pending' && (
                          <Link
                            to={`/trainer/submissions/${s.id}`}
                            className="text-xs text-accent font-semibold hover:underline flex items-center gap-0.5"
                          >
                            Review <ArrowRight size={11} />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Queue tabs */}
              <div className="flex gap-1 px-5 py-3 border-t border-gray-100">
                {(['pending', 'reviewed', 'late'] as QueueTab[]).map((tab) => {
                  const count = tab === 'pending' ? pending.length : tab === 'reviewed' ? reviewed.length : late.length
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        activeTab === tab ? 'bg-accent/10 text-accent' : 'text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {TAB_LABELS[tab]} ({count})
                    </button>
                  )
                })}
              </div>
          </>
        </div>

      </div>
    </div>
  )
}