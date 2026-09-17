import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, ArrowRight } from 'lucide-react'
import { getTrainerClasses, type TrainerClass } from '../../utils/trainerStore'

export function TrainerClasses() {
  const [classes, setClasses] = useState<TrainerClass[]>([])

  const loadData = () => {
    setClasses(getTrainerClasses())
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('algozoo_trainer_classes_updated', handleUpdate)
    return () => window.removeEventListener('algozoo_trainer_classes_updated', handleUpdate)
  }, [])

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* ── Page Header ── */}
      <div>
        <p className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-1">TRAINER</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Classes</h1>
      </div>

      {/* ── Class Cards List ── */}
      <div className="space-y-4">
        {classes.map((cls) => {
          const isActive = cls.status === 'Active'
          return (
            <div
              key={cls.id}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-sm hover:shadow-md transition-all relative group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                {/* Title & Badge */}
                <div className="flex items-center gap-3">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-accent transition-colors">
                    {cls.name}
                  </h2>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium inline-flex items-center ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        : 'bg-gray-100 text-gray-600 border border-gray-200/60'
                    }`}
                  >
                    {cls.status}
                  </span>
                </div>

                {/* Open Class Button */}
                <Link
                  to={`/trainer/classes/${cls.id}/overview`}
                  className="inline-flex items-center justify-center gap-1.5 bg-accent text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-accent/90 shadow-sm shadow-red-200 transition-all self-start sm:self-auto"
                >
                  Open Class
                  <ArrowRight size={15} />
                </Link>
              </div>

              {/* Subtitle / Program */}
              <p className="text-sm text-gray-500 mb-3">{cls.program}</p>

              {/* Students count */}
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
                <Users size={15} className="text-gray-400" />
                <span>{cls.studentsCount} students</span>
              </div>

              {/* Submission Progress */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-medium">
                    {cls.submittedCount} / {cls.totalRequired} submitted
                  </span>
                  <span className="text-gray-700 font-bold">{cls.progress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, cls.progress))}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
