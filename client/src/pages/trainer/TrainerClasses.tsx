import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Users, Loader2, Clock } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { getTrainerClasses, getClassDetail, type TrainerClass, type ClassDetail } from '../../services/classroomService'

export function TrainerClasses() {
  const [classes, setClasses] = useState<TrainerClass[]>([])
  const [details, setDetails] = useState<Record<string, ClassDetail>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    getTrainerClasses()
      .then((data) => { if (!cancelled) setClasses(data) })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load classes') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (classes.length === 0) return
    Promise.all(
      classes.map(async (c) => {
        try {
          const detail = await getClassDetail(String(c.class_id))
          return [String(c.class_id), detail] as const
        } catch { return null }
      })
    ).then((results) => {
      const map: Record<string, ClassDetail> = {}
      results.forEach((r) => { if (r) map[r[0]] = r[1] })
      setDetails(map)
    })
  }, [classes])

  return (
    <div>
      <div className="mb-7">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Trainer</p>
        <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5 text-sm text-red-600">{error}</div>
      )}

      {loading ? (
        <div className="py-16 flex items-center justify-center text-sm text-gray-400 gap-2">
          <Loader2 size={16} className="animate-spin" /> Loading classes...
        </div>
      ) : (
        <div className="space-y-4">
          {classes.map((c) => (
            <div key={c.class_id} className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1">
                  <h2 className="font-bold text-gray-900 text-lg">{c.className}</h2>
                  <Badge variant={c.is_active ? 'ACTIVE' : 'INACTIVE'}>{c.is_active ? 'Active' : 'Inactive'}</Badge>
                </div>

                {details[String(c.class_id)]?.description && (
                  <p className="text-sm text-gray-400 mb-3">{details[String(c.class_id)].description}</p>
                )}

                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Users size={13} className="text-gray-400" />
                    <span className="text-sm text-gray-500">{c.student_count} students</span>
                  </div>
                  {c.pending_review_count > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-orange-400" />
                      <span className="text-sm text-orange-600 font-medium">{c.pending_review_count} pending review</span>
                    </div>
                  )}
                </div>

                {(() => {
                  const detail = details[String(c.class_id)]
                  if (!detail) return null
                  const total = detail.students.length || c.student_count
                  const submitted = detail.students.filter((s) => s.completed_tasks > 0).length
                  const percent = total > 0 ? Math.round((submitted / total) * 100) : 0
                  return (
                    <div className="max-w-xs">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-400">{submitted} / {total} submitted</span>
                        <span className="text-xs font-semibold text-gray-700">{percent}%</span>
                      </div>
                      <ProgressBar value={percent} />
                    </div>
                  )
                })()}
              </div>

              <Link to={`/trainer/classes/${c.class_id}/overview`}>
                <button className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors flex-shrink-0">
                  Open Class <ArrowRight size={14} />
                </button>
              </Link>
            </div>
          ))}
          {classes.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm py-16 text-center text-sm text-gray-400">
              You're not assigned to any classes yet.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
