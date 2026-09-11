import { ArrowRight } from 'lucide-react'
import { ProgressBar } from '../../components/ui/ProgressBar'

const classes = [
  { id: 1, name: 'Algorithms 101', trainer: 'Nguyen Van Hung', problems: 20, progress: 60, cohort: 'Cohort 4' },
  { id: 2, name: 'Data Structures', trainer: 'Nguyen Van Hung', problems: 15, progress: 45, cohort: 'Cohort 4' },
  { id: 3, name: 'Competitive Programming', trainer: 'Tran Thi Mai', problems: 25, progress: 20, cohort: 'Cohort 3' },
  { id: 4, name: 'Graph Algorithms', trainer: 'Le Van An', problems: 18, progress: 72, cohort: 'Cohort 5' },
  { id: 5, name: 'Dynamic Programming', trainer: 'Pham Thi Huong', problems: 22, progress: 35, cohort: 'Cohort 4' },
]

export function StudentClasses() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
        <p className="text-gray-500 text-sm mt-1">Classes you are enrolled in</p>
      </div>
      <div className="grid grid-cols-3 gap-5">
        {classes.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border-t-4 border-accent shadow-sm hover:shadow-md transition-shadow p-5">
            <div className="mb-4">
              <h3 className="font-bold text-gray-900 text-lg">{c.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{c.cohort}</p>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-gray-400">Trainer:</span> {c.trainer}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-gray-400">Problems:</span> {c.problems}
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{c.progress}%</span>
              </div>
              <ProgressBar value={c.progress} />
            </div>
            <button className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium py-2 rounded-lg transition-colors">
              VIEW CLASS <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
