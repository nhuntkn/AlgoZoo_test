import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  BookOpen, Users, ArrowRight,
  CalendarDays, ChevronDown, X, RotateCcw, Search,
  ChevronLeft, ChevronRight, GraduationCap, MoreHorizontal,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Subject = 'DSA' | 'OS' | 'Database'
type SubStatus = 'pending' | 'reviewed'
type ClassStatus = 'active' | 'inactive'

type PlatformClass = {
  id: number
  name: string
  trainers: string[]
  trainerInitials: string
  students: number
  problems: number
  status: ClassStatus
  progress: number
  endDate: string
}

type AdminSub = {
  id: number
  student: string
  problem: string
  subject: Subject
  class: string
  trainer: string
  status: SubStatus
  waitingDays: number
  isLate: boolean
}

type StudentSub = {
  problem: string
  subject: Subject
  submittedAt: string
  status: SubStatus
}

type StudentClassData = {
  name: string
  trainer: string
  trainerInitials: string
  submitted: number
  total: number
  subjects: { subject: Subject; submitted: number; total: number }[]
  submissions: StudentSub[]
}

type Student = {
  name: string
  initials: string
  email: string
  classes: StudentClassData[]
}

// ─── Mock data ────────────────────────────────────────────────────────────────


const PLATFORM_CLASSES: PlatformClass[] = [
  { id: 1, name: 'WeCamp Batch 15', trainers: ['Nguyen Van Hung'], trainerInitials: 'NH', students: 24, problems: 35, status: 'active', progress: 62, endDate: 'Mar 30, 2025' },
]


const ADMIN_SUBS: AdminSub[] = [
  { id: 1, student: 'Alice Nguyen', problem: 'Two Sum', subject: 'DSA', class: 'WeCamp Batch 15', trainer: 'Nguyen Van Hung', status: 'pending', waitingDays: 6, isLate: true },
  { id: 2, student: 'Bob Tran', problem: 'Process Scheduling', subject: 'OS', class: 'WeCamp Batch 15', trainer: 'Nguyen Van Hung', status: 'reviewed', waitingDays: 0, isLate: false },
]

const STUDENTS: Student[] = [
  {
    name: 'Alice Nguyen', initials: 'AN', email: 'alice.nguyen@wecamp.edu',
    classes: [{
      name: 'WeCamp Batch 15', trainer: 'Nguyen Van Hung', trainerInitials: 'NH',
      submitted: 28, total: 35,
      subjects: [{ subject: 'DSA', submitted: 11, total: 14 }, { subject: 'OS', submitted: 10, total: 12 }, { subject: 'Database', submitted: 7, total: 9 }],
      submissions: [
        { problem: 'Two Sum', subject: 'DSA', submittedAt: 'Sep 14, 10:30', status: 'pending' },
        { problem: 'Process Scheduling', subject: 'OS', submittedAt: 'Sep 11, 14:00', status: 'reviewed' },
      ],
    }],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const subjectStyle: Record<Subject, { bar: string; text: string }> = {
  DSA: { bar: 'bg-orange-400', text: 'text-orange-600' },
  Database: { bar: 'bg-green-500', text: 'text-green-700' },
  OS: { bar: 'bg-purple-500', text: 'text-purple-700' },
}

function getStudentStatus(pct: number): { label: string; cls: string } {
  if (pct === 100) return { label: 'Completed', cls: 'bg-green-50 text-green-700' }
  if (pct >= 70)   return { label: 'On track',  cls: 'bg-green-50 text-green-600' }
  if (pct >= 50)   return { label: 'In progress', cls: 'bg-orange-50 text-orange-500' }
  return              { label: 'Behind',      cls: 'bg-red-50 text-red-500' }
}

// Circular donut ring — uses currentColor for the progress stroke
function DonutRing({ value, size = 32 }: { value: number; size?: number }) {
  const sw = size < 40 ? 3.5 : size < 100 ? 5.5 : 9
  const r = size / 2 - sw / 2 - 2
  const cx = size / 2, cy = size / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - value / 100)
  const isGreen = value >= 70
  return (
    <svg
      width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      className={isGreen ? 'text-green-600' : 'text-accent'}
    >
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke="currentColor" strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={`${circ}`} strokeDashoffset={`${offset}`}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
    </svg>
  )
}

type KpiCardProps = {
  label: string
  value: number | string
  subtitle?: string
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  onClick?: () => void
}

function KpiCard({ label, value, subtitle, icon, iconBg, iconColor, onClick }: KpiCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-white rounded-2xl shadow-sm px-5 py-5 flex items-center justify-center gap-4 transition-all ${
        onClick ? 'hover:shadow-md cursor-pointer' : 'cursor-default'
      }`}
    >
      <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 ${iconColor}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-bold text-gray-900 leading-tight mt-0.5">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
      {onClick && <ArrowRight size={14} className="text-gray-300 flex-shrink-0" />}
    </button>
  )
}

// ─── Student Detail ───────────────────────────────────────────────────────────

function StudentDetail({
  student,
  selectedClass,
  setSelectedClass,
  onBack,
}: {
  student: Student
  selectedClass: string
  setSelectedClass: (c: string) => void
  onBack: () => void
}) {
  const classData = student.classes.find((c) => c.name === selectedClass) ?? student.classes[0]
  const overallPct = Math.round((classData.submitted / classData.total) * 100)
  const status = getStudentStatus(overallPct)
  const platformClass = PLATFORM_CLASSES.find((c) => c.name === classData.name)
  const pendingCount = classData.submissions.filter((s) => s.status === 'pending').length

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Back button */}
      <div className="px-6 py-4 border-b border-gray-100 flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft size={16} /> Back to Students
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-6 space-y-5">

        {/* ── Student identity + class info ────────────────────────────── */}
        <div className="flex items-start justify-between gap-6 pb-5 border-b border-gray-100">
          {/* Left: avatar + name + email + status */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-full bg-accent text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
              {student.initials}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-gray-900 leading-tight">{student.name}</h3>
              <p className="text-sm text-gray-400 truncate">{student.email}</p>
              <span className={`inline-block mt-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${status.cls}`}>
                ● {status.label}
              </span>
            </div>
          </div>

          {/* Right: class info */}
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Class</p>
            {student.classes.length > 1 ? (
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="text-sm font-bold text-gray-900 bg-transparent border-none outline-none cursor-pointer text-right"
              >
                {student.classes.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            ) : (
              <p className="text-sm font-bold text-gray-900">{classData.name}</p>
            )}
            <p className="text-xs text-gray-500 mt-0.5">Trainer: {classData.trainer}</p>
            <p className="text-xs text-gray-500 mt-0.5">End date: {platformClass?.endDate ?? '—'}</p>
          </div>
        </div>

        {/* ── Large center ring — overall progress ─────────────────────── */}
        <div className="flex flex-col items-center py-4">
          <div className="relative inline-flex items-center justify-center mb-4">
            <DonutRing value={overallPct} size={160} />
            <div className="absolute flex flex-col items-center select-none">
              <span className="text-4xl font-light text-gray-500 leading-none">{classData.submitted}</span>
              <div className="w-8 h-px bg-gray-300 my-2" />
              <span className="text-2xl font-light text-gray-400 leading-none">{classData.total}</span>
            </div>
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Overall Progress · {overallPct}%</p>
          {pendingCount > 0 && (
            <p className="text-xs text-orange-500 font-semibold mt-1">{pendingCount} pending review</p>
          )}
        </div>

        {/* ── Subject rows ─────────────────────────────────────────────── */}
        <div className="border-t border-gray-100">
          {classData.subjects.map(({ subject, submitted, total }, i) => (
            <div
              key={subject}
              className={`flex items-center justify-between py-3 ${
                i < classData.subjects.length - 1 ? 'border-b border-gray-50' : ''
              }`}
            >
              <span className={`text-sm font-semibold ${subjectStyle[subject].text}`}>{subject}</span>
              <span className="text-sm text-gray-600 tabular-nums font-medium">
                {submitted} / {total} problems
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-3 mt-1 border-t border-gray-200">
            <span className="text-sm font-bold text-gray-700">Total submitted</span>
            <span className="text-sm font-bold text-gray-900 tabular-nums">
              {classData.submitted} / {classData.total} problems
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}

// ─── Students Section ─────────────────────────────────────────────────────────

const PAGE_SIZE = 8

function StudentsSection({ batchFilter }: { batchFilter: string }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedClass, setSelectedClass] = useState<string>('')

  const visibleStudents = useMemo(() => {
    return STUDENTS.filter((s) => {
      const matchesBatch = batchFilter === 'all' || s.classes.some((c) => c.name === batchFilter)
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase())
      return matchesBatch && matchesSearch
    })
  }, [batchFilter, search])

  const totalPages = Math.max(1, Math.ceil(visibleStudents.length / PAGE_SIZE))
  const pageStudents = visibleStudents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleSearch(val: string) {
    setSearch(val)
    setPage(1)
  }

  function handleSelectStudent(student: Student) {
    const defaultClass =
      batchFilter !== 'all'
        ? (student.classes.find((c) => c.name === batchFilter)?.name ?? student.classes[0].name)
        : student.classes[0].name
    setSelectedClass(defaultClass)
    setSelectedStudent(student)
  }

  function handleBack() {
    setSelectedStudent(null)
    setSelectedClass('')
  }

  if (selectedStudent) {
    return (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden h-full">
        <StudentDetail
          student={selectedStudent}
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
          onBack={handleBack}
        />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Users size={18} className="text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Students</h2>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search students..."
                className="pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 w-52"
              />
              {search && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            <button
              onClick={() => {
                const params = new URLSearchParams({ role: 'student' })
                if (batchFilter !== 'all') params.set('batch', batchFilter)
                navigate(`/admin/users?${params.toString()}`)
              }}
              className="text-sm font-semibold text-accent hover:underline whitespace-nowrap flex items-center gap-1"
            >
              View all students <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Table column headers */}
      <div className="grid grid-cols-[2fr_1.2fr_80px_1fr_36px] px-6 py-2.5 bg-gray-50 border-b border-gray-100 flex-shrink-0">
        {['STUDENT', 'CLASS', 'COMPLETED', 'PROGRESS', ''].map((h) => (
          <span key={h} className="text-[10px] font-bold text-gray-400 tracking-widest">{h}</span>
        ))}
      </div>

      {/* Rows */}
      <div className="flex-1">
        {visibleStudents.length === 0 ? (
          <div className="py-14 text-center text-sm text-gray-400">No students found</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {pageStudents.map((student) => {
              const displayClass =
                batchFilter !== 'all'
                  ? (student.classes.find((c) => c.name === batchFilter) ?? student.classes[0])
                  : student.classes[0]
              const pct = Math.round((displayClass.submitted / displayClass.total) * 100)
              const status = getStudentStatus(pct)
              return (
                <div
                  key={student.name}
                  className="grid grid-cols-[2fr_1.2fr_80px_1fr_36px] items-center px-6 py-3.5 hover:bg-gray-50/70 transition-colors group"
                >
                  {/* Student */}
                  <button
                    onClick={() => handleSelectStudent(student)}
                    className="flex items-center gap-3 min-w-0 text-left"
                  >
                    <div className="w-9 h-9 rounded-full bg-accent text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                      {student.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 group-hover:text-accent transition-colors truncate">
                        {student.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{student.email}</p>
                    </div>
                  </button>

                  {/* Class */}
                  <span className="text-sm text-gray-600 truncate pr-3">{displayClass.name}</span>

                  {/* Completed */}
                  <span className="text-sm text-gray-600 tabular-nums">{displayClass.submitted} / {displayClass.total}</span>

                  {/* Progress bar */}
                  <div className="pr-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-400 tabular-nums">
                        {displayClass.submitted}/{displayClass.total}
                      </span>
                      <span className="text-xs font-bold text-gray-700 tabular-nums">{pct}%</span>
                    </div>
                    <div className="h-[3px] rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-accent transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <button className="flex items-center justify-center w-7 h-7 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors">
                    <MoreHorizontal size={15} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 flex-shrink-0">
          <span className="text-xs text-gray-400">
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, visibleStudents.length)} of {visibleStudents.length} students
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                  p === page
                    ? 'bg-accent text-white'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

type Filters = { batch: string }
const DEFAULT_FILTERS: Filters = { batch: 'all' }

export function AdminDashboard() {
  const { user } = useAuth()
  const firstName = user.name.split(' ')[0]

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)

  const filteredSubs = useMemo(() => {
    return ADMIN_SUBS.filter((s) => {
      if (filters.batch !== 'all' && s.class !== filters.batch) return false
      return true
    })
  }, [filters])

  const filteredClasses = useMemo(() => {
    return PLATFORM_CLASSES.filter((c) =>
      filters.batch === 'all' ? true : c.name === filters.batch
    )
  }, [filters.batch])

  const activeClasses = filteredClasses.filter((c) => c.status === 'active')
  const inactiveClasses = filteredClasses.filter((c) => c.status === 'inactive')
  const totalStudents = filteredClasses.reduce((s, c) => s + c.students, 0)
  const activeStudents = activeClasses.reduce((s, c) => s + c.students, 0)
  const inactiveStudents = inactiveClasses.reduce((s, c) => s + c.students, 0)

  const hasActiveFilters = filters.batch !== 'all'

  const batches = PLATFORM_CLASSES.map((c) => c.name)

  return (
    <div>
      {/* Greeting */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Good morning, {firstName}</h1>
        <p className="text-sm text-gray-400 mt-1">Platform overview — here's how things are running.</p>
      </div>

      {/* ── Filter bar ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm px-5 py-3.5 mb-5 flex items-end gap-3 flex-wrap">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Batch</span>
          {filters.batch !== 'all' ? (
            <button
              onClick={() => setFilters((p) => ({ ...p, batch: 'all' }))}
              className="flex items-center gap-1.5 pl-3 pr-2.5 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg bg-gray-50 min-w-[160px]"
            >
              <span className="flex-1 text-left truncate">{filters.batch}</span>
              <X size={12} className="text-gray-500 flex-shrink-0" />
            </button>
          ) : (
            <div className="relative">
              <select
                value="all"
                onChange={(e) => setFilters((p) => ({ ...p, batch: e.target.value }))}
                className="appearance-none pl-3 pr-8 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/30 min-w-[160px]"
              >
                <option value="all">All Classes</option>
                {batches.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 pb-1.5 ml-auto transition-colors"
          >
            <RotateCcw size={13} /> Clear all
          </button>
        )}
      </div>

      {/* ── KPI Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <KpiCard label="Classes" value={filteredClasses.length} subtitle={`${activeClasses.length} active · ${inactiveClasses.length} inactive`} iconBg="bg-accent/10" iconColor="text-accent" icon={<BookOpen size={18} />} />
        <KpiCard label="Students" value={totalStudents} subtitle={`${activeStudents} active · ${inactiveStudents} inactive`} iconBg="bg-blue-50" iconColor="text-blue-500" icon={<Users size={18} />} />
      </div>

      {/* ── Main: Students (left) | Class Progress + Subject Overview (right) ── */}
      <div className="grid lg:grid-cols-[3fr_2fr] gap-5 items-stretch">

        {/* LEFT — Students table */}
        <StudentsSection key={filters.batch} batchFilter={filters.batch} />

        {/* RIGHT — stacked sidebar */}
        <div className="space-y-5">

          {/* Class Progress */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-5 pt-5 pb-4 border-b border-gray-100">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <GraduationCap size={18} className="text-accent" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Class Progress</h2>
                </div>
                <Link
                  to="/admin/classes"
                  className="text-sm font-semibold text-accent hover:underline whitespace-nowrap flex items-center gap-1 flex-shrink-0 pt-1"
                >
                  View all classes <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-[1fr_44px_52px_68px_16px] px-5 py-2.5 bg-gray-50 border-b border-gray-100">
              {['CLASS', 'STUD.', 'PROB.', 'PROGRESS', ''].map((h) => (
                <span key={h} className="text-[9px] font-bold text-gray-400 tracking-widest">{h}</span>
              ))}
            </div>

            {/* Class rows */}
            {filteredClasses.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-400">No classes</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filteredClasses.map((c) => {
                  const classPending = ADMIN_SUBS.filter((s) => s.class === c.name && s.status === 'pending').length
                  const letter = c.name.charAt(0)
                  return (
                    <div
                      key={c.id}
                      className="grid grid-cols-[1fr_44px_52px_68px_16px] items-center px-5 py-3.5 hover:bg-gray-50/70 transition-colors"
                    >
                      {/* Class name */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {letter}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{c.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${
                              c.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {c.status === 'active' ? 'active' : 'inactive'}
                            </span>
                            <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                              <CalendarDays size={9} /> {c.endDate}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Students */}
                      <span className="text-sm text-gray-700 font-medium tabular-nums">{c.students}</span>

                      {/* Problems */}
                      <span className="text-sm text-gray-700 font-medium tabular-nums">{c.problems}</span>

                      {/* Donut + % */}
                      <div className="flex items-center gap-1.5">
                        <DonutRing value={c.progress} />
                        <span className={`text-sm font-bold tabular-nums ${c.progress >= 70 ? 'text-green-600' : 'text-gray-700'}`}>
                          {c.progress}%
                        </span>
                      </div>

                      {/* Arrow */}
                      <Link
                        to={`/admin/classes/${c.id}/manage`}
                        className="text-gray-300 hover:text-accent transition-colors"
                      >
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Subject Overview */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="text-base font-bold text-gray-900 mb-4">Subject Overview</h2>
            <div className="space-y-4">
              {[
                { label: 'DSA', color: 'bg-orange-400', submissions: 142, rate: 78 },
                { label: 'OS', color: 'bg-purple-400', submissions: 98, rate: 65 },
                { label: 'Database', color: 'bg-green-400', submissions: 76, rate: 52 },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-semibold text-gray-700">{s.label}</span>
                    <span className="text-gray-400 text-xs">{s.submissions} submissions · {s.rate}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.rate}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}