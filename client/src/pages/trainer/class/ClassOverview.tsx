import { useParams } from 'react-router-dom'
import { Users, BookOpen, Clock, CheckCircle } from 'lucide-react'
import { ClassTabNav } from '../../../components/layout/ClassTabNav'
import { StatCard } from '../../../components/ui/StatCard'

const classData: Record<string, { name: string; description: string; status: 'ACTIVE' | 'INACTIVE' }> = {
  '1': { name: 'WeCamp Batch 21', description: 'NAB WeCamp Batch 21 — DSA Training Program', status: 'ACTIVE' },
  '2': { name: 'WeCamp Batch 22', description: 'NAB WeCamp Batch 22 — DSA Training Program', status: 'ACTIVE' },
}

const activity = [
  { id: 1, text: 'Alice Nguyen submitted Two Sum', time: '2h ago' },
  { id: 2, text: "Bob Tran's Binary Search was reviewed", time: '5h ago' },
  { id: 3, text: 'Carol Lee submitted Process Scheduling', time: '1d ago' },
  { id: 4, text: 'Minh Pham joined the class', time: '1d ago' },
  { id: 5, text: 'Two Sum deadline extended to Sep 25', time: '2d ago' },
]

export function ClassOverview() {
  const { classId = '1' } = useParams()
  const cls = classData[classId] ?? classData['1']

  const tabs = [
    { label: 'Overview', to: `/trainer/classes/${classId}/overview` },
    { label: 'Problems', to: `/trainer/classes/${classId}/problems` },
    { label: 'Submissions', to: `/trainer/classes/${classId}/submissions` },
    { label: 'Students', to: `/trainer/classes/${classId}/students` },
  ]

  return (
    <div>
      <ClassTabNav
        crumbs={[{ label: 'My Classes', to: '/trainer/classes' }, { label: cls.name }]}
        title={cls.name}
        status={cls.status}
        tabs={tabs}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Problems" value={8} icon={<BookOpen size={16} className="text-accent" />} color="bg-red-50" />
        <StatCard label="Total Submissions" value={45} icon={<CheckCircle size={16} className="text-green-600" />} color="bg-green-50" />
        <StatCard label="Reviewed" value={30} icon={<CheckCircle size={16} className="text-blue-600" />} color="bg-blue-50" />
        <StatCard label="Pending" value={15} icon={<Clock size={16} className="text-amber-600" />} color="bg-amber-50" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Class Information */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
          <h3 className="font-bold text-gray-900">Class Information</h3>

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Description</p>
            <p className="text-sm text-gray-600">{cls.description}</p>
          </div>

          <div className="flex gap-6">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Students</p>
              <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900">
                <Users size={14} className="text-gray-400" /> 25
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Trainers</p>
              <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900">
                <Users size={14} className="text-gray-400" /> 2
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {activity.map((a) => (
              <div key={a.id} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{a.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
