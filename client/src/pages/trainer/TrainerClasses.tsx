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
