import { Link } from 'react-router-dom'
import { Users, BookOpen, UserCheck, LayoutDashboard, ArrowRight } from 'lucide-react'
import { ProgressBar } from '../../components/ui/ProgressBar'

const stats = [
  { label: 'Total Users', value: 128, icon: <Users size={18} className="text-gray-400" />, to: '/admin/users' },
  { label: 'Total Classes', value: 6, icon: <BookOpen size={18} className="text-gray-400" />, to: '/admin/classes' },
  { label: 'Active Students', value: 96, icon: <UserCheck size={18} className="text-green-500" />, to: '/admin/users' },
  { label: 'Trainers', value: 5, icon: <LayoutDashboard size={18} className="text-blue-400" />, to: '/admin/users' },
]

const classes = [
  { id: 1, name: 'WeCamp Batch 15', trainer: 'Nguyen Van Hung', students: 24, progress: 62, pending: 7 },
  { id: 2, name: 'StarCamp Batch 2', trainer: 'Tran Thi Mai', students: 18, progress: 45, pending: 3 },
  { id: 3, name: 'WeCamp Batch 14', trainer: 'Le Van An', students: 22, progress: 88, pending: 1 },
]

const recentActivity = [
  { text: 'Trang Nguyen submitted Two Sum', time: '2h ago', dot: 'bg-blue-400' },
  { text: 'New class WeCamp Batch 15 created', time: '1d ago', dot: 'bg-green-400' },
  { text: 'Nguyen Van Hung invited to StarCamp Batch 2', time: '2d ago', dot: 'bg-purple-400' },
  { text: '24 students imported from Excel', time: '3d ago', dot: 'bg-yellow-400' },
  { text: 'Lan Nguyen account disabled', time: '4d ago', dot: 'bg-red-400' },
]

export function AdminDashboard() {
  return (
    <div>
      <div className="mb-7">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Admin</p>
        <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <Link key={s.label} to={s.to}>
            <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">{s.icon}<span className="text-xs text-gray-400 font-medium">{s.label}</span></div>
              <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Classes overview */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">All Classes</h2>
            <Link to="/admin/classes" className="text-accent text-sm font-semibold hover:underline flex items-center gap-1">
              Manage <ArrowRight size={13} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {classes.map((c) => (
              <div key={c.id} className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.trainer} · {c.students} students</p>
                  </div>
                  {c.pending > 0 && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 font-semibold px-2 py-0.5 rounded-full">{c.pending} pending</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1"><ProgressBar value={c.progress} height="h-1.5" /></div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{c.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 px-6 py-4">
                <div className={`w-2 h-2 rounded-full ${a.dot} mt-1.5 flex-shrink-0`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{a.text}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
