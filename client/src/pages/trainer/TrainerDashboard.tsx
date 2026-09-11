import { Link } from 'react-router-dom'
import { ArrowRight, Users, Clock, CheckCircle2, CalendarDays } from 'lucide-react'

const myClasses = [
  { id: 1, name: 'WeCamp Batch 15', startDate: 'Jan 15, 2025', endDate: 'Mar 30, 2025', students: 24, pending: 7, reviewed: 52, total: 35 },
  { id: 2, name: 'StarCamp Batch 2', startDate: 'Feb 1, 2025', endDate: 'Apr 15, 2025', students: 18, pending: 3, reviewed: 31, total: 28 },
]

export function TrainerDashboard() {
  return (
    <div>
      <div className="mb-7">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Overview</p>
        <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
        <p className="text-sm text-gray-400 mt-0.5">Classes you are assigned to manage</p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {myClasses.map((c) => (
          <Link key={c.id} to={`/trainer/classes/${c.id}`} className="block group">
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="w-3 h-3 rounded-sm bg-accent mb-3" />
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-accent transition-colors">{c.name}</h2>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                    <CalendarDays size={12} />
                    <span>{c.startDate} — {c.endDate}</span>
                  </div>
                </div>
                <span className="text-accent text-sm font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Open <ArrowRight size={13} />
                </span>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center bg-gray-50 rounded-xl py-3">
                  <div className="flex justify-center mb-1"><Users size={14} className="text-gray-400" /></div>
                  <p className="text-xl font-bold text-gray-900">{c.students}</p>
                  <p className="text-[11px] text-gray-400">Students</p>
                </div>
                <div className="text-center bg-yellow-50 rounded-xl py-3">
                  <div className="flex justify-center mb-1"><Clock size={14} className="text-yellow-500" /></div>
                  <p className="text-xl font-bold text-gray-900">{c.pending}</p>
                  <p className="text-[11px] text-gray-400">To Review</p>
                </div>
                <div className="text-center bg-green-50 rounded-xl py-3">
                  <div className="flex justify-center mb-1"><CheckCircle2 size={14} className="text-green-500" /></div>
                  <p className="text-xl font-bold text-gray-900">{c.reviewed}</p>
                  <p className="text-[11px] text-gray-400">Reviewed</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{c.total} problems assigned</span>
                <span className="text-accent font-semibold">View Class →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
