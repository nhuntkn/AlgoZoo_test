import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, X, RotateCcw, ArrowRight, Clock, CheckCircle, Percent, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

type Subject = 'DSA' | 'Database' | 'OS'
type SubmissionStatus = 'pending' | 'reviewed' | 'returned'
type QueueTab = 'pending' | 'reviewed' | 'returned'
type LocalFilter = 'all' | 'ongoing' | 'done'

// ─── Queue data ───────────────────────────────────────────────────────────────

type QueueItem = {
  id: number
  student: string
  initials: string
  problem: string
  subject: Subject
  class: string
  status: SubmissionStatus
  date: string
}

const allItems: QueueItem[] = [
  { id: 1, student: 'Alice Nguyen', initials: 'AN', problem: 'Two Sum', subject: 'DSA', class: 'Batch 21', status: 'pending', date: 'Sep 10' },
  { id: 2, student: 'Bob Tran', initials: 'BT', problem: 'Binary Search', subject: 'DSA', class: 'Batch 21', status: 'pending', date: 'Sep 9' },
  { id: 3, student: 'Carol Lee', initials: 'CL', problem: 'SQL Query', subject: 'Database', class: 'Batch 22', status: 'pending', date: 'Sep 11' },
  { id: 4, student: 'Ha Pham', initials: 'HP', problem: 'Process Scheduling', subject: 'OS', class: 'Batch 21', status: 'pending', date: 'Sep 8' },
  { id: 5, student: 'Minh Le', initials: 'ML', problem: 'DFS', subject: 'DSA', class: 'Batch 22', status: 'pending', date: 'Sep 12' },
  { id: 6, student: 'Lan Pham', initials: 'LP', problem: 'Graph BFS', subject: 'DSA', class: 'Batch 21', status: 'pending', date: 'Sep 7' },
  { id: 7, student: 'Nam Tran', initials: 'NT', problem: 'SQL Join', subject: 'Database', class: 'Batch 22', status: 'pending', date: 'Sep 6' },
  { id: 8, student: 'Hoa Le', initials: 'HL', problem: 'Memory Management', subject: 'OS', class: 'Batch 22', status: 'pending', date: 'Sep 13' },
  { id: 9, student: 'Tuan Nguyen', initials: 'TN', problem: 'Two Sum', subject: 'DSA', class: 'Batch 21', status: 'reviewed', date: 'Sep 8' },
  { id: 10, student: 'Mai Tran', initials: 'MT', problem: 'Linked List', subject: 'DSA', class: 'Batch 22', status: 'reviewed', date: 'Sep 7' },
  { id: 11, student: 'Long Le', initials: 'LL', problem: 'SQL Aggregation', subject: 'Database', class: 'Batch 21', status: 'reviewed', date: 'Sep 9' },
  { id: 12, student: 'Bao Pham', initials: 'BP', problem: 'Thread Sync', subject: 'OS', class: 'Batch 22', status: 'reviewed', date: 'Sep 10' },
  { id: 13, student: 'Kim Nguyen', initials: 'KN', problem: 'Merge Sort', subject: 'DSA', class: 'Batch 21', status: 'reviewed', date: 'Sep 9' },
  { id: 14, student: 'Duc Tran', initials: 'DT', problem: 'SQL Index', subject: 'Database', class: 'Batch 22', status: 'reviewed', date: 'Sep 8' },
  { id: 15, student: 'An Nguyen', initials: 'AQ', problem: 'Two Sum', subject: 'DSA', class: 'Batch 22', status: 'returned', date: 'Sep 9' },
  { id: 16, student: 'Phu Tran', initials: 'PT', problem: 'Deadlock', subject: 'OS', class: 'Batch 21', status: 'returned', date: 'Sep 8' },
  { id: 17, student: 'Thu Le', initials: 'TL', problem: 'SQL Index', subject: 'Database', class: 'Batch 22', status: 'returned', date: 'Sep 7' },
  { id: 18, student: 'Viet Pham', initials: 'VP', problem: 'Binary Search', subject: 'DSA', class: 'Batch 21', status: 'returned', date: 'Sep 11' },
]

// ─── Subject Completion data ──────────────────────────────────────────────────

const CLASS_SIZES: Record<string, number> = {
  'Batch 21': 30,
  'Batch 22': 28,
}

type ProblemDatum = {
  id: string
  name: string
  subject: Subject
  submissions: Record<string, number>
}

const PROBLEMS: ProblemDatum[] = [
  { id: 'two-sum', name: 'Two Sum', subject: 'DSA', submissions: { 'Batch 21': 24, 'Batch 22': 20 } },
  { id: 'binary-search', name: 'Binary Search', subject: 'DSA', submissions: { 'Batch 21': 18, 'Batch 22': 15 } },
  { id: 'dfs', name: 'DFS', subject: 'DSA', submissions: { 'Batch 21': 30, 'Batch 22': 28 } },
  { id: 'graph-bfs', name: 'Graph BFS', subject: 'DSA', submissions: { 'Batch 21': 12, 'Batch 22': 10 } },
  { id: 'linked-list', name: 'Linked List', subject: 'DSA', submissions: { 'Batch 21': 8, 'Batch 22': 14 } },
  { id: 'merge-sort', name: 'Merge Sort', subject: 'DSA', submissions: { 'Batch 21': 20, 'Batch 22': 22 } },
  { id: 'sql-query', name: 'SQL Query', subject: 'Database', submissions: { 'Batch 21': 30, 'Batch 22': 28 } },
  { id: 'sql-join', name: 'SQL Join', subject: 'Database', submissions: { 'Batch 21': 25, 'Batch 22': 20 } },
  { id: 'sql-agg', name: 'SQL Aggregation', subject: 'Database', submissions: { 'Batch 21': 18, 'Batch 22': 16 } },
  { id: 'sql-index', name: 'SQL Index', subject: 'Database', submissions: { 'Batch 21': 10, 'Batch 22': 8 } },
  { id: 'scheduling', name: 'Process Scheduling', subject: 'OS', submissions: { 'Batch 21': 15, 'Batch 22': 10 } },
  { id: 'memory-mgmt', name: 'Memory Management', subject: 'OS', submissions: { 'Batch 21': 20, 'Batch 22': 18 } },
  { id: 'deadlock', name: 'Deadlock', subject: 'OS', submissions: { 'Batch 21': 8, 'Batch 22': 5 } },
  { id: 'thread-sync', name: 'Thread Sync', subject: 'OS', submissions: { 'Batch 21': 12, 'Batch 22': 14 } },
]

function getTotalStudents(classFilter: string): number {
  if (classFilter === 'All Classes') {
    return Object.values(CLASS_SIZES).reduce((a, b) => a + b, 0)
  }
  return CLASS_SIZES[classFilter] ?? 0
}

function getProblemCompletion(p: ProblemDatum, classFilter: string) {
  const total = getTotalStudents(classFilter)
  const submitted =
    classFilter === 'All Classes'
      ? Object.values(p.submissions).reduce((a, b) => a + b, 0)
      : (p.submissions[classFilter] ?? 0)
  const pct = total > 0 ? Math.round((submitted / total) * 100) : 0
  return { pct, submitted, total }
}

function getSubjectCompletion(subject: Subject, classFilter: string) {
  const problems = PROBLEMS.filter((p) => p.subject === subject)
  if (problems.length === 0) return { pct: 0 }
  const rates = problems.map((p) => getProblemCompletion(p, classFilter).pct)
  const avg = Math.round(rates.reduce((a, b) => a + b, 0) / rates.length)
  return { pct: avg }
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CLASSES = ['All Classes', 'Batch 21', 'Batch 22']
const DATE_OPTIONS = ['Last 7 days', 'Last 30 days', 'All time']
const SUBJECTS: Subject[] = ['DSA', 'Database', 'OS']
const PAGE_SIZE = 5

const subjectStyle: Record<Subject, { bar: string; text: string }> = {
  DSA: { bar: 'bg-orange-400', text: 'text-orange-600' },
  Database: { bar: 'bg-green-500', text: 'text-green-700' },
  OS: { bar: 'bg-purple-500', text: 'text-purple-700' },
}

const statusBadgeClass: Record<SubmissionStatus, string> = {
  pending: 'bg-orange-100 text-orange-600',
  reviewed: 'bg-green-100 text-green-700',
  returned: 'bg-gray-100 text-gray-600',
}

const TAB_LABELS: Record<QueueTab, string> = {
  pending: 'Pending',
  reviewed: 'Reviewed',
  returned: 'Returned',
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
      className={`w-full text-left bg-white rounded-2xl shadow-sm px-5 py-5 flex items-center gap-4 transition-all ${
        active ? 'ring-2 ring-accent shadow-md' : 'hover:shadow-md'
      } ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest truncate">{label}</p>
        <p className="text-3xl font-bold text-gray-900 leading-tight mt-0.5">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {onClick && <ArrowRight size={14} className="text-gray-300 flex-shrink-0" />}
    </button>
  )
}

// ─── Subject Completion ───────────────────────────────────────────────────────

type SubjectCompletionProps = {
  classFilter: string
  subjectFilter: Subject | 'all'
  setSubjectFilter: (s: Subject | 'all') => void
  problemFilter: string | null
  setProblemFilter: (p: string | null) => void
}

function SubjectCompletion({
  classFilter,
  subjectFilter,
  setSubjectFilter,
  setProblemFilter,
}: SubjectCompletionProps) {
  const [localFilter, setLocalFilter] = useState<LocalFilter>('all')
  const [page, setPage] = useState(1)

  const isLevel2 = subjectFilter !== 'all'

  // Build rows for current level
  type Row = { key: string; label: string; pct: number; submitted?: number; total?: number }

  let rows: Row[]

  if (isLevel2) {
    // Level 2: problems inside selected subject
    rows = PROBLEMS.filter((p) => p.subject === subjectFilter).map((p) => {
      const { pct, submitted, total } = getProblemCompletion(p, classFilter)
      return { key: p.id, label: p.name, pct, submitted, total }
    })
  } else {
    // Level 1: subjects
    rows = SUBJECTS.map((sub) => {
      const { pct } = getSubjectCompletion(sub, classFilter)
      return { key: sub, label: sub, pct }
    })
  }

  // Apply local filter
  const filtered = rows.filter((r) => {
    if (localFilter === 'done') return r.pct === 100
    if (localFilter === 'ongoing') return r.pct < 100
    return true
  })

  // Paginate
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const barStyle = isLevel2 && subjectFilter !== 'all' ? subjectStyle[subjectFilter] : null

  function handleRowClick(row: Row) {
    if (isLevel2) {
      setProblemFilter(row.label)
    } else {
      setSubjectFilter(row.key as Subject)
    }
  }

  const breadcrumb =
    isLevel2 && classFilter !== 'All Classes'
      ? `${classFilter} · ${subjectFilter}`
      : isLevel2
      ? subjectFilter
      : null

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h2 className="font-bold text-gray-900">Subject Completion</h2>
          {breadcrumb && (
            <p className="text-xs text-gray-400 mt-0.5">{breadcrumb}</p>
          )}
        </div>
        <button className="text-xs text-accent font-semibold hover:underline flex items-center gap-1 flex-shrink-0">
          View all <ArrowRight size={12} />
        </button>
      </div>

      {/* Local filter pills */}
      <div className="flex gap-1.5 px-5 pt-4 pb-2">
        {(['all', 'ongoing', 'done'] as LocalFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => { setLocalFilter(f); setPage(1) }}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors capitalize ${
              localFilter === f
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {f === 'all' ? 'All' : f === 'ongoing' ? 'On-going' : 'Done'}
          </button>
        ))}
      </div>

      {/* Rows */}
      <div className="flex-1 px-5 pb-3 space-y-4 pt-2">
        {pageRows.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">No items found</div>
        ) : (
          pageRows.map((row) => {
            const style = isLevel2
              ? subjectStyle[subjectFilter as Subject]
              : subjectStyle[row.key as Subject] ?? subjectStyle.DSA
            return (
              <button
                key={row.key}
                onClick={() => handleRowClick(row)}
                className="w-full text-left group"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-semibold text-gray-800 group-hover:text-accent transition-colors truncate pr-2">
                    {row.label}
                  </span>
                  <span className={`text-sm font-bold flex-shrink-0 ${style.text}`}>
                    {row.pct}%
                  </span>
                </div>
                {isLevel2 && row.submitted !== undefined && row.total !== undefined && (
                  <p className="text-xs text-gray-400 mb-1">
                    {row.submitted} / {row.total} students
                  </p>
                )}
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${style.bar}`}
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
              </button>
            )
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 px-5 py-3 border-t border-gray-100">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 disabled:opacity-30"
          >
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-6 h-6 rounded text-xs font-semibold transition-colors ${
                n === safePage
                  ? 'bg-accent text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 disabled:opacity-30"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Level hint */}
      {!isLevel2 && (
        <div className="px-5 pb-4">
          <p className="text-xs text-gray-400">Click a subject to drill down into its exercises.</p>
        </div>
      )}
    </div>
  )
}

// ─── Trainer Dashboard ────────────────────────────────────────────────────────

export function TrainerDashboard() {
  const { user } = useAuth()
  const firstName = user.name.split(' ')[0]

  const [classFilter, setClassFilter] = useState('All Classes')
  const [subjectFilter, setSubjectFilter] = useState<Subject | 'all'>('all')
  const [dateFilter, setDateFilter] = useState('Last 7 days')
  const [activeTab, setActiveTab] = useState<QueueTab>('pending')
  const [problemFilter, setProblemFilter] = useState<string | null>(null)

  // Clear problem filter when subject changes
  function handleSetSubjectFilter(s: Subject | 'all') {
    setSubjectFilter(s)
    setProblemFilter(null)
  }

  const filtered = allItems.filter((s) => {
    if (classFilter !== 'All Classes' && s.class !== classFilter) return false
    if (subjectFilter !== 'all' && s.subject !== subjectFilter) return false
    if (problemFilter && s.problem !== problemFilter) return false
    return true
  })

  const pending = filtered.filter((s) => s.status === 'pending')
  const reviewed = filtered.filter((s) => s.status === 'reviewed')
  const returned = filtered.filter((s) => s.status === 'returned')
  const total = filtered.length
  const reviewedCount = reviewed.length
  const reviewRate = total > 0 ? ((reviewedCount / total) * 100).toFixed(1) : '0.0'

  const queueRows =
    activeTab === 'pending' ? pending : activeTab === 'reviewed' ? reviewed : returned

  const hasActiveFilters =
    classFilter !== 'All Classes' || subjectFilter !== 'all' || dateFilter !== 'Last 7 days'

  function handleResetFilters() {
    setClassFilter('All Classes')
    setSubjectFilter('all')
    setDateFilter('Last 7 days')
    setProblemFilter(null)
  }

  return (
    <div>
      {/* Greeting */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Good morning, {firstName}</h1>
        <p className="text-sm text-gray-400 mt-1">Here's what's happening in your classes.</p>
      </div>

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
              {CLASSES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Subject */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subject</span>
          {subjectFilter !== 'all' ? (
            <button
              onClick={() => handleSetSubjectFilter('all')}
              className="flex items-center gap-1.5 pl-3 pr-2.5 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg bg-gray-50 min-w-[130px]"
            >
              <span className="flex-1 text-left">{subjectFilter}</span>
              <X size={12} className="text-gray-500 flex-shrink-0" />
            </button>
          ) : (
            <div className="relative">
              <select
                value="all"
                onChange={(e) => handleSetSubjectFilter(e.target.value as Subject | 'all')}
                className="appearance-none pl-3 pr-8 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/30 min-w-[130px]"
              >
                <option value="all">All Subjects</option>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Problem filter pill (appears when drilling down) */}
        {problemFilter && (
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Problem</span>
            <button
              onClick={() => setProblemFilter(null)}
              className="flex items-center gap-1.5 pl-3 pr-2.5 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg bg-gray-50"
            >
              <span className="flex-1 text-left">{problemFilter}</span>
              <X size={12} className="text-gray-500 flex-shrink-0" />
            </button>
          </div>
        )}

        {/* Date */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</span>
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/30 min-w-[120px]"
            >
              {DATE_OPTIONS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 pb-1.5 ml-auto transition-colors"
          >
            <RotateCcw size={13} />
            Reset filters
          </button>
        )}
      </div>

      {/* KPI stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <KpiCard
          label="Total Submissions"
          value={total}
          iconBg="bg-blue-100"
          icon={<CheckCircle size={18} className="text-blue-500" />}
        />
        <KpiCard
          label="Pending Review"
          value={pending.length}
          iconBg="bg-orange-100"
          icon={<Clock size={18} className="text-orange-500" />}
          active={activeTab === 'pending'}
          onClick={() => setActiveTab('pending')}
        />
        <KpiCard
          label="Review Rate"
          value={`${reviewRate}%`}
          subtitle={`${reviewedCount} / ${total} reviewed`}
          iconBg="bg-green-100"
          icon={<Percent size={18} className="text-green-500" />}
        />
      </div>

      {/* Main 2-col grid */}
      <div className="grid lg:grid-cols-[3fr_2fr] gap-5">
        {/* Review Queue */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Review Queue</h2>
            <Link
              to="/trainer/classes"
              className="text-xs text-accent font-semibold hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-[1fr_140px_90px_110px_80px] px-6 py-2.5 border-b border-gray-50">
            {['STUDENT', 'PROBLEM', 'SUBJECT', 'STATUS', ''].map((h, i) => (
              <span key={i} className="text-[10px] font-bold text-gray-400 tracking-widest">
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          <div className="flex-1 min-h-[200px]">
            {queueRows.length === 0 ? (
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
                  <span className={`text-xs font-semibold ${subjectStyle[s.subject].text}`}>
                    {s.subject}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold w-fit ${statusBadgeClass[s.status]}`}
                  >
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

          {/* Tabs */}
          <div className="flex gap-1 px-5 py-3 border-t border-gray-100">
            {(['pending', 'reviewed', 'returned'] as QueueTab[]).map((tab) => {
              const count =
                tab === 'pending' ? pending.length : tab === 'reviewed' ? reviewed.length : returned.length
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
        </div>

        {/* Subject Completion — re-mounts on filter change to reset local state */}
        <SubjectCompletion
          key={`${classFilter}-${subjectFilter}`}
          classFilter={classFilter}
          subjectFilter={subjectFilter}
          setSubjectFilter={handleSetSubjectFilter}
          problemFilter={problemFilter}
          setProblemFilter={setProblemFilter}
        />
      </div>
    </div>
  )
}
