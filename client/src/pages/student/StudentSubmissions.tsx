import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Inbox, Loader2 } from 'lucide-react'
import { TypeBadge } from '../../components/ui/Badge'
import { studentService } from '../../services/studentService'
import type { RecentSubmission } from '../../types/studentDashboard'

interface ProblemRow {
  classProblemId: string
  title: string
  problemType: string
  className: string
  status: string | null
  feedback: string
  submittedAt: string | null
}

function normalizeType(raw: string | undefined): string {
  if (!raw) return 'Other'
  if (raw === 'DB') return 'Database'
  if (raw === 'OTHER') return 'Other'
  return raw
}

function StatusCell({ status }: { status: string | null }) {
  if (status === 'Reviewed') {
    return (
      <span className="flex items-center gap-1.5 text-green-600 font-medium text-sm">
        <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" /> Reviewed
      </span>
    )
  }
  if (status === 'Pending') {
    return (
      <span className="flex items-center gap-1.5 text-amber-500 font-medium text-sm">
        <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" /> Pending review
      </span>
    )
  }
  if (status === 'Late') {
    return (
      <span className="flex items-center gap-1.5 text-orange-500 font-medium text-sm">
        <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" /> Late
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1.5 text-gray-400 text-sm">
      <span className="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0" /> Not started
    </span>
  )
}

export function StudentSubmissions() {
  const [rows, setRows] = useState<ProblemRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const classes = (await studentService.getClasses()).data

        const results = await Promise.all(
          classes.map(async (cls) => {
            try {
              const [problemsResponse, dashboardResponse] = await Promise.all([
                studentService.getClassProblems(cls.classId),
                studentService.getDashboard(cls.classId),
              ])

              const submissionMap = new Map<string, RecentSubmission>()
              dashboardResponse.data.recentSubmissions.forEach((sub) => {
                submissionMap.set(sub.classProblemId, sub)
              })

              return problemsResponse.data.map((p): ProblemRow => {
                const sub = submissionMap.get(p.classProblemId)
                return {
                  classProblemId: p.classProblemId,
                  title: p.problem?.title ?? 'Untitled',
                  problemType: normalizeType(p.problem?.problemType as string | undefined),
                  className: cls.name,
                  status: p.status,
                  feedback: sub?.feedback ?? '',
                  submittedAt: sub?.submittedAt ?? null,
                }
              })
            } catch {
              return []
            }
          })
        )

        setRows(results.flat())
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : 'Unable to load submissions')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  return (
    <div>
      <div className="mb-7">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Student</p>
        <h1 className="text-2xl font-bold text-gray-900">My Submissions</h1>
      </div>

      {error && <p className="mb-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      {loading ? (
        <div className="py-16 flex justify-center gap-2 text-sm text-gray-400">
          <Loader2 size={16} className="animate-spin" /> Loading submissions...
        </div>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center">
          <Inbox size={48} className="text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">No problems found</h3>
          <p className="text-sm text-gray-500">Enroll in a class to see your problems here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[2fr_90px_160px_160px_100px_60px] px-6 py-3 border-b border-gray-100 text-[10px] font-bold text-gray-400 tracking-widest">
            <span>PROBLEM</span>
            <span>TYPE</span>
            <span>CLASS</span>
            <span>STATUS</span>
            <span>SUBMITTED</span>
            <span />
          </div>

          {/* Table rows */}
          {rows.map((row) => (
            <div
              key={row.classProblemId}
              className="grid grid-cols-[2fr_90px_160px_160px_100px_60px] items-center px-6 py-4 border-b border-gray-50 last:border-b-0"
            >
              <div className="min-w-0 pr-4">
                <p className="text-sm font-semibold text-gray-900 truncate">{row.title}</p>
                {row.feedback && (
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{row.feedback}</p>
                )}
              </div>
              <div>
                <TypeBadge type={row.problemType} />
              </div>
              <span className="text-sm text-gray-600 truncate">{row.className}</span>
              <StatusCell status={row.status} />
              <span className="text-sm text-gray-400">
                {row.submittedAt
                  ? new Date(row.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : '—'}
              </span>
              <span>
                {row.status && (
                  <Link
                    to={`/student/submissions/${row.classProblemId}`}
                    className="text-sm font-semibold text-accent hover:underline"
                  >
                    View
                  </Link>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
