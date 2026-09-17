<<<<<<< HEAD
import { Link } from 'react-router-dom'
import { ArrowRight, Users } from 'lucide-react'
import { ProgressBar } from '../../components/ui/ProgressBar'

const myClasses = [
  { id: 1, name: 'WeCamp Batch 4', students: 24, reviewed: 52, pending: 7, total: 35, progress: 62 },
  { id: 2, name: 'StarCamp Batch 2', students: 18, reviewed: 31, pending: 3, total: 28, progress: 45 },
]

export function TrainerClasses() {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Trainer</p>
        <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
        <p className="text-sm text-gray-400 mt-0.5">Classes you are assigned to manage</p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {myClasses.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{c.name}</h2>
                <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
                  <Users size={14} className="text-gray-400" />
                  {c.students} students
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Overall Progress</span>
                <span>{c.progress}%</span>
              </div>
              <ProgressBar value={c.progress} />
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <span><strong className="text-yellow-600">{c.pending}</strong> pending reviews</span>
              <Link to={`/trainer/classes/${c.id}`} className="flex items-center gap-1 text-accent font-medium hover:underline">
                Open Class <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
=======
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Users, Loader2, Clock } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { getTrainerClasses, type TrainerClass } from '../../services/classroomService'

export function TrainerClasses() {
  const [classes, setClasses] = useState<TrainerClass[]>([])
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
                <div className="flex items-center gap-2.5 mb-3">
                  <h2 className="font-bold text-gray-900 text-lg">{c.className}</h2>
                  <Badge variant={c.is_active ? 'ACTIVE' : 'INACTIVE'}>{c.is_active ? 'Active' : 'Inactive'}</Badge>
                </div>

                <div className="flex items-center gap-4">
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
>>>>>>> d96b4f5600f620774943785cb2d6e27f419a5d6e
