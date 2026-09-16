import { Link } from 'react-router-dom'
import { ArrowRight, Users } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { ProgressBar } from '../../components/ui/ProgressBar'

type ClassItem = {
  id: number
  name: string
  description: string
  students: number
  submitted: number
  total: number
  status: 'ACTIVE' | 'INACTIVE'
}

const classes: ClassItem[] = [
  { id: 1, name: 'WeCamp Batch 21', description: 'NAB WeCamp Batch 21 — DSA Training', students: 25, submitted: 18, total: 25, status: 'ACTIVE' },
]

export function TrainerClasses() {
  return (
    <div>
      <div className="mb-7">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Trainer</p>
        <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
      </div>

      <div className="space-y-4">
        {classes.map((c) => {
          const pct = Math.round((c.submitted / c.total) * 100)
          return (
            <div key={c.id} className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1">
                  <h2 className="font-bold text-gray-900 text-lg">{c.name}</h2>
                  <Badge variant={c.status}>{c.status === 'ACTIVE' ? 'Active' : 'Inactive'}</Badge>
                </div>
                <p className="text-sm text-gray-400 mb-3">{c.description}</p>

                <div className="flex items-center gap-1.5 mb-2">
                  <Users size={13} className="text-gray-400" />
                  <span className="text-sm text-gray-500">{c.students} students</span>
                </div>

                <div className="max-w-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">{c.submitted} / {c.total} submitted</span>
                    <span className="text-xs font-semibold text-gray-700">{pct}%</span>
                  </div>
                  <ProgressBar value={pct} />
                </div>
              </div>

              <Link to={`/trainer/classes/${c.id}/overview`}>
                <button className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors flex-shrink-0">
                  Open Class <ArrowRight size={14} />
                </button>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
