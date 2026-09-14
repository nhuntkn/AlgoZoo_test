import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Search, X, Users, ChevronLeft, ChevronRight, MoreHorizontal, ChevronDown,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Subject = 'DSA' | 'OS' | 'Database'
type SubStatus = 'pending' | 'reviewed'

type StudentSub = { problem: string; subject: Subject; submittedAt: string; status: SubStatus }
type StudentClassData = {
  name: string; trainer: string; trainerInitials: string
  submitted: number; total: number
  subjects: { subject: Subject; submitted: number; total: number }[]
  submissions: StudentSub[]
}
type StudentUser = { name: string; initials: string; email: string; role: 'student'; classes: StudentClassData[] }
type StaffUser = { name: string; initials: string; email: string; role: 'admin' | 'trainer'; classes: string[] }
type UserItem = StudentUser | StaffUser

// ─── Mock data ────────────────────────────────────────────────────────────────

const STAFF_USERS: StaffUser[] = [
  { name: 'Maya Tran', initials: 'MT', email: 'maya@algozoo.edu', role: 'admin', classes: [] },
  { name: 'Alex Nguyen', initials: 'AN', email: 'alex@algozoo.edu', role: 'trainer', classes: ['WeCamp Batch 15', 'StarCamp Batch 2'] },
  { name: 'Sarah Tran', initials: 'ST', email: 'sarah@algozoo.edu', role: 'trainer', classes: ['WeCamp Batch 15'] },
  { name: 'Le Van An', initials: 'LA', email: 'le.an@algozoo.edu', role: 'trainer', classes: ['WeCamp Batch 14'] },
  { name: 'Pham Thi Huong', initials: 'PH', email: 'pham.huong@algozoo.edu', role: 'trainer', classes: ['StarCamp Batch 1'] },
]

const STUDENT_USERS: StudentUser[] = [
  {
    name: 'Alice Nguyen', initials: 'AN', email: 'alice.nguyen@wecamp.edu', role: 'student',
    classes: [{
      name: 'WeCamp Batch 15', trainer: 'Nguyen Van Hung', trainerInitials: 'NH',
      submitted: 28, total: 35,
      subjects: [{ subject: 'DSA', submitted: 11, total: 14 }, { subject: 'OS', submitted: 10, total: 12 }, { subject: 'Database', submitted: 7, total: 9 }],
      submissions: [
        { problem: 'Two Sum', subject: 'DSA', submittedAt: 'Sep 14, 10:30', status: 'pending' },
        { problem: 'Binary Search', subject: 'DSA', submittedAt: 'Sep 13, 15:20', status: 'reviewed' },
      ],
    }],
  },
  {
    name: 'Kim Nguyen', initials: 'KN', email: 'kim.nguyen@wecamp.edu', role: 'student',
    classes: [{
      name: 'WeCamp Batch 15', trainer: 'Nguyen Van Hung', trainerInitials: 'NH',
      submitted: 35, total: 35,
      subjects: [{ subject: 'DSA', submitted: 14, total: 14 }, { subject: 'OS', submitted: 12, total: 12 }, { subject: 'Database', submitted: 9, total: 9 }],
      submissions: [
        { problem: 'Two Sum', subject: 'DSA', submittedAt: 'Sep 14, 08:00', status: 'reviewed' },
        { problem: 'Thread Sync', subject: 'OS', submittedAt: 'Sep 12, 16:00', status: 'reviewed' },
      ],
    }],
  },
  {
    name: 'Duc Tran', initials: 'DT', email: 'duc.tran@wecamp.edu', role: 'student',
    classes: [{
      name: 'WeCamp Batch 15', trainer: 'Nguyen Van Hung', trainerInitials: 'NH',
      submitted: 20, total: 35,
      subjects: [{ subject: 'DSA', submitted: 8, total: 14 }, { subject: 'OS', submitted: 7, total: 12 }, { subject: 'Database', submitted: 5, total: 9 }],
      submissions: [
        { problem: 'DFS', subject: 'DSA', submittedAt: 'Sep 13, 11:00', status: 'reviewed' },
        { problem: 'Memory Mgmt', subject: 'OS', submittedAt: 'Sep 11, 10:00', status: 'reviewed' },
      ],
    }],
  },
  {
    name: 'Long Tran', initials: 'LT', email: 'long.tran@wecamp.edu', role: 'student',
    classes: [{
      name: 'WeCamp Batch 15', trainer: 'Nguyen Van Hung', trainerInitials: 'NH',
      submitted: 14, total: 35,
      subjects: [{ subject: 'DSA', submitted: 5, total: 14 }, { subject: 'OS', submitted: 5, total: 12 }, { subject: 'Database', submitted: 4, total: 9 }],
      submissions: [
        { problem: 'Deadlock', subject: 'OS', submittedAt: 'Sep 14, 09:00', status: 'pending' },
        { problem: 'Two Sum', subject: 'DSA', submittedAt: 'Sep 12, 13:00', status: 'reviewed' },
      ],
    }],
  },
  {
    name: 'Viet Nguyen', initials: 'VN', email: 'viet.nguyen@starcamp.edu', role: 'student',
    classes: [{
      name: 'StarCamp Batch 2', trainer: 'Tran Thi Mai', trainerInitials: 'TM',
      submitted: 20, total: 28,
      subjects: [{ subject: 'DSA', submitted: 8, total: 11 }, { subject: 'OS', submitted: 7, total: 10 }, { subject: 'Database', submitted: 5, total: 7 }],
      submissions: [
        { problem: 'Graph BFS', subject: 'DSA', submittedAt: 'Sep 14, 09:30', status: 'pending' },
        { problem: 'Binary Search', subject: 'DSA', submittedAt: 'Sep 13, 14:00', status: 'reviewed' },
      ],
    }],
  },
  {
    name: 'Trang Nguyen', initials: 'TN', email: 'trang.nguyen@starcamp.edu', role: 'student',
    classes: [{
      name: 'StarCamp Batch 2', trainer: 'Tran Thi Mai', trainerInitials: 'TM',
      submitted: 28, total: 28,
      subjects: [{ subject: 'DSA', submitted: 11, total: 11 }, { subject: 'OS', submitted: 10, total: 10 }, { subject: 'Database', submitted: 7, total: 7 }],
      submissions: [
        { problem: 'Two Sum', subject: 'DSA', submittedAt: 'Sep 14, 08:30', status: 'reviewed' },
        { problem: 'Deadlock', subject: 'OS', submittedAt: 'Sep 12, 15:00', status: 'reviewed' },
      ],
    }],
  },
  {
    name: 'Hieu Tran', initials: 'HT', email: 'hieu.tran@starcamp.edu', role: 'student',
    classes: [{
      name: 'StarCamp Batch 2', trainer: 'Tran Thi Mai', trainerInitials: 'TM',
      submitted: 12, total: 28,
      subjects: [{ subject: 'DSA', submitted: 5, total: 11 }, { subject: 'OS', submitted: 4, total: 10 }, { subject: 'Database', submitted: 3, total: 7 }],
      submissions: [
        { problem: 'Memory Mgmt', subject: 'OS', submittedAt: 'Sep 14, 11:00', status: 'pending' },
        { problem: 'DFS', subject: 'DSA', submittedAt: 'Sep 12, 14:00', status: 'reviewed' },
      ],
    }],
  },
  {
    name: 'Son Nguyen', initials: 'SN', email: 'son.nguyen@wecamp.edu', role: 'student',
    classes: [{
      name: 'WeCamp Batch 14', trainer: 'Le Van An', trainerInitials: 'LA',
      submitted: 25, total: 30,
      subjects: [{ subject: 'DSA', submitted: 10, total: 12 }, { subject: 'OS', submitted: 8, total: 10 }, { subject: 'Database', submitted: 7, total: 8 }],
      submissions: [
        { problem: 'Linked List', subject: 'DSA', submittedAt: 'Sep 13, 10:00', status: 'pending' },
        { problem: 'Process Scheduling', subject: 'OS', submittedAt: 'Sep 11, 11:00', status: 'reviewed' },
      ],
    }],
  },
  {
    name: 'Dat Pham', initials: 'DP', email: 'dat.pham@wecamp.edu', role: 'student',
    classes: [{
      name: 'WeCamp Batch 14', trainer: 'Le Van An', trainerInitials: 'LA',
      submitted: 30, total: 30,
      subjects: [{ subject: 'DSA', submitted: 12, total: 12 }, { subject: 'OS', submitted: 10, total: 10 }, { subject: 'Database', submitted: 8, total: 8 }],
      submissions: [
        { problem: 'Merge Sort', subject: 'DSA', submittedAt: 'Sep 14, 09:00', status: 'reviewed' },
        { problem: 'SQL Agg', subject: 'Database', submittedAt: 'Sep 11, 15:00', status: 'reviewed' },
      ],
    }],
  },
  {
    name: 'Nga Nguyen', initials: 'NN', email: 'nga.nguyen@wecamp.edu', role: 'student',
    classes: [{
      name: 'WeCamp Batch 14', trainer: 'Le Van An', trainerInitials: 'LA',
      submitted: 18, total: 30,
      subjects: [{ subject: 'DSA', submitted: 7, total: 12 }, { subject: 'OS', submitted: 6, total: 10 }, { subject: 'Database', submitted: 5, total: 8 }],
      submissions: [
        { problem: 'DFS', subject: 'DSA', submittedAt: 'Sep 13, 16:00', status: 'reviewed' },
        { problem: 'SQL Join', subject: 'Database', submittedAt: 'Sep 11, 10:30', status: 'reviewed' },
      ],
    }],
  },
  {
    name: 'Em Nguyen', initials: 'EN', email: 'em.nguyen@starcamp.edu', role: 'student',
    classes: [{
      name: 'StarCamp Batch 1', trainer: 'Pham Thi Huong', trainerInitials: 'PH',
      submitted: 25, total: 25,
      subjects: [{ subject: 'DSA', submitted: 10, total: 10 }, { subject: 'OS', submitted: 8, total: 8 }, { subject: 'Database', submitted: 7, total: 7 }],
      submissions: [
        { problem: 'Two Sum', subject: 'DSA', submittedAt: 'Dec 15, 10:00', status: 'reviewed' },
        { problem: 'Memory Mgmt', subject: 'OS', submittedAt: 'Dec 13, 11:00', status: 'reviewed' },
      ],
    }],
  },
  {
    name: 'Gia Tran', initials: 'GT', email: 'gia.tran@starcamp.edu', role: 'student',
    classes: [{
      name: 'StarCamp Batch 1', trainer: 'Pham Thi Huong', trainerInitials: 'PH',
      submitted: 20, total: 25,
      subjects: [{ subject: 'DSA', submitted: 8, total: 10 }, { subject: 'OS', submitted: 7, total: 8 }, { subject: 'Database', submitted: 5, total: 7 }],
      submissions: [
        { problem: 'Binary Search', subject: 'DSA', submittedAt: 'Dec 15, 09:30', status: 'reviewed' },
        { problem: 'Thread Sync', subject: 'OS', submittedAt: 'Dec 14, 13:00', status: 'reviewed' },
      ],
    }],
  },
]

const ALL_USERS: UserItem[] = [...STAFF_USERS, ...STUDENT_USERS]

const ALL_BATCHES = [...new Set(STUDENT_USERS.flatMap((u) => u.classes.map((c) => c.name)))]

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

function DonutRing({ value, size = 32 }: { value: number; size?: number }) {
  const sw = size < 40 ? 3.5 : size < 100 ? 5.5 : 9
  const r = size / 2 - sw / 2 - 2
  const cx = size / 2, cy = size / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - value / 100)
  const isGreen = value >= 70
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      className={isGreen ? 'text-green-600' : 'text-accent'}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={sw} />
      <circle cx={cx} cy={cy} r={r} fill="none"
        stroke="currentColor" strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={`${circ}`} strokeDashoffset={`${offset}`}
        transform={`rotate(-90 ${cx} ${cy})`} />
    </svg>
  )
}

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-purple-50 text-purple-700',
  trainer: 'bg-blue-50 text-blue-600',
  student: 'bg-accent/10 text-accent',
}

// ─── Student Detail ───────────────────────────────────────────────────────────

function StudentDetail({
  student,
  onBack,
}: {
  student: StudentUser
  onBack: () => void
}) {
  const [selectedClass, setSelectedClass] = useState(student.classes[0].name)
  const classData = student.classes.find((c) => c.name === selectedClass) ?? student.classes[0]
  const overallPct = Math.round((classData.submitted / classData.total) * 100)
  const status = getStudentStatus(overallPct)
  const pendingCount = classData.submissions.filter((s) => s.status === 'pending').length

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Back button */}
      <div className="px-6 py-4 border-b border-gray-100 flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft size={16} /> Back to Users
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-6 space-y-5">

        {/* Student identity + class info */}
        <div className="flex items-start justify-between gap-6 pb-5 border-b border-gray-100">
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
          </div>
        </div>

        {/* Large center ring */}
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

        {/* Subject rows */}
        <div className="border-t border-gray-100">
          {classData.subjects.map(({ subject, submitted, total }, i) => (
            <div
              key={subject}
              className={`flex items-center justify-between py-3 ${i < classData.subjects.length - 1 ? 'border-b border-gray-50' : ''}`}
            >
              <span className={`text-sm font-semibold ${subjectStyle[subject].text}`}>{subject}</span>
              <span className="text-sm text-gray-600 tabular-nums font-medium">{submitted} / {total} problems</span>
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

// ─── Admin Users ──────────────────────────────────────────────────────────────

const PAGE_SIZE = 8

export function AdminUsers() {
  const [searchParams] = useSearchParams()

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'trainer' | 'student'>(
    (searchParams.get('role') as 'all' | 'admin' | 'trainer' | 'student') ?? 'all'
  )
  const [batchFilter, setBatchFilter] = useState(searchParams.get('batch') ?? 'all')
  const [page, setPage] = useState(1)
  const [selectedStudent, setSelectedStudent] = useState<StudentUser | null>(null)
  const [activeMap, setActiveMap] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(ALL_USERS.map((u) => [u.email, true]))
  )

  function toggleActive(email: string) {
    setActiveMap((prev) => ({ ...prev, [email]: !prev[email] }))
  }

  const showBatchFilter = roleFilter === 'student' || roleFilter === 'all'

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return ALL_USERS.filter((u) => {
      const matchSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      const matchRole = roleFilter === 'all' || u.role === roleFilter
      const matchBatch =
        batchFilter === 'all' ||
        u.role !== 'student' ||
        (u as StudentUser).classes.some((c) => c.name === batchFilter)
      return matchSearch && matchRole && matchBatch
    })
  }, [search, roleFilter, batchFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageUsers = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleSearch(val: string) {
    setSearch(val)
    setPage(1)
  }

  function handleRoleFilter(r: typeof roleFilter) {
    setRoleFilter(r)
    setPage(1)
    setSelectedStudent(null)
  }

  function handleBatchFilter(b: string) {
    setBatchFilter(b)
    setPage(1)
  }

  const isStudentRow = roleFilter === 'student' || roleFilter === 'all'

  if (selectedStudent) {
    return (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ minHeight: 500 }}>
        <StudentDetail student={selectedStudent} onBack={() => setSelectedStudent(null)} />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Users size={18} className="text-accent" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Users</h2>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Search */}
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search users..."
                className="pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 w-48"
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
            {/* Role filter tabs */}
            <div className="flex bg-gray-100 rounded-xl p-0.5 gap-0.5">
              {(['all', 'admin', 'trainer', 'student'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleFilter(r)}
                  className={`px-3 py-1.5 text-xs font-semibold capitalize rounded-lg transition-colors ${
                    roleFilter === r
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1) + 's'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Batch filter — only when students are visible */}
        {showBatchFilter && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Batch</span>
            <div className="relative">
              <select
                value={batchFilter}
                onChange={(e) => handleBatchFilter(e.target.value)}
                className="appearance-none pl-3 pr-7 py-1.5 text-xs font-medium text-gray-700 border border-gray-200 rounded-lg bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/30"
              >
                <option value="all">All Batches</option>
                {ALL_BATCHES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
              <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {batchFilter !== 'all' && (
              <button
                onClick={() => handleBatchFilter('all')}
                className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
              >
                <X size={11} /> Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Table header */}
      {isStudentRow ? (
        <div className="grid grid-cols-[2fr_76px_1.2fr_80px_1fr_76px_36px] px-6 py-2.5 bg-gray-50 border-b border-gray-100 flex-shrink-0">
          {['USER', 'ROLE', 'CLASS', 'COMPLETED', 'PROGRESS', 'STATUS', ''].map((h) => (
            <span key={h} className="text-[10px] font-bold text-gray-400 tracking-widest">{h}</span>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-[2fr_100px_1fr_76px] px-6 py-2.5 bg-gray-50 border-b border-gray-100 flex-shrink-0">
          {['USER', 'ROLE', 'CLASSES', 'STATUS'].map((h) => (
            <span key={h} className="text-[10px] font-bold text-gray-400 tracking-widest">{h}</span>
          ))}
        </div>
      )}

      {/* Rows */}
      <div className="flex-1">
        {filtered.length === 0 ? (
          <div className="py-14 text-center text-sm text-gray-400">No users found</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {pageUsers.map((u) => {
              const isActive = activeMap[u.email]

              if (u.role === 'student' && isStudentRow) {
                const classData = u.classes[0]
                const pct = Math.round((classData.submitted / classData.total) * 100)
                return (
                  <div
                    key={u.email}
                    className="grid grid-cols-[2fr_76px_1.2fr_80px_1fr_76px_36px] items-center px-6 py-3.5 hover:bg-gray-50/70 transition-colors group"
                  >
                    {/* USER */}
                    <button
                      onClick={() => setSelectedStudent(u)}
                      className="flex items-center gap-3 min-w-0 text-left"
                    >
                      <div className={`w-9 h-9 rounded-full text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-accent' : 'bg-gray-300'}`}>
                        {u.initials}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-bold group-hover:text-accent transition-colors truncate ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                          {u.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{u.email}</p>
                      </div>
                    </button>
                    {/* ROLE */}
                    <div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${ROLE_COLORS['student']}`}>
                        Student
                      </span>
                    </div>
                    {/* CLASS */}
                    <span className="text-sm text-gray-600 truncate pr-3">{classData.name}</span>
                    {/* COMPLETED */}
                    <span className="text-sm text-gray-600 tabular-nums">{classData.submitted} / {classData.total}</span>
                    {/* PROGRESS */}
                    <div className="pr-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-gray-400 tabular-nums">{classData.submitted}/{classData.total}</span>
                        <span className="text-xs font-bold text-gray-700 tabular-nums">{pct}%</span>
                      </div>
                      <div className="h-[3px] rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-accent transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    {/* STATUS */}
                    <button
                      onClick={() => toggleActive(u.email)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                        isActive ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      {isActive ? 'Active' : 'Inactive'}
                    </button>
                    {/* ACTION */}
                    <button className="flex items-center justify-center w-7 h-7 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors">
                      <MoreHorizontal size={15} />
                    </button>
                  </div>
                )
              }

              // Admin / Trainer row
              const staff = u as StaffUser
              return (
                <div
                  key={u.email}
                  className={`items-center px-6 py-3.5 hover:bg-gray-50/70 transition-colors ${
                    isStudentRow
                      ? 'grid grid-cols-[2fr_76px_1.2fr_80px_1fr_76px_36px]'
                      : 'grid grid-cols-[2fr_100px_1fr_76px]'
                  }`}
                >
                  {/* USER */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-full text-[11px] font-bold flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-gray-200 text-gray-600' : 'bg-gray-100 text-gray-300'}`}>
                      {u.initials}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-bold truncate ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{u.name}</p>
                      <p className="text-xs text-gray-400 truncate">{u.email}</p>
                    </div>
                  </div>
                  {/* ROLE */}
                  <div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${ROLE_COLORS[u.role]}`}>
                      {u.role}
                    </span>
                  </div>
                  {/* CLASS(ES) */}
                  <span className={`text-sm text-gray-500 truncate ${isStudentRow ? 'pr-3' : ''}`}>
                    {staff.classes.length > 0 ? staff.classes.join(', ') : <span className="text-gray-300">—</span>}
                  </span>
                  {/* COMPLETED + PROGRESS — empty for staff in All view */}
                  {isStudentRow && <span />}
                  {isStudentRow && <span />}
                  {/* STATUS */}
                  <button
                    onClick={() => toggleActive(u.email)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                      isActive ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {isActive ? 'Active' : 'Inactive'}
                  </button>
                  {/* ACTION placeholder for alignment */}
                  {isStudentRow && <span />}
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
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} users
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
                  p === page ? 'bg-accent text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
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
