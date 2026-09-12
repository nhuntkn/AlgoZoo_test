import { useState } from 'react'
import { Search } from 'lucide-react'
import { ProgressBar } from '../../components/ui/ProgressBar'

const students = [
  { name: 'Trang Nguyen', initials: 'TN', completed: 11, total: 18, progress: 61, needsRevision: 2, lastActive: '2h ago' },
  { name: 'Minh Le', initials: 'ML', completed: 9, total: 18, progress: 55, needsRevision: 1, lastActive: '4h ago' },
  { name: 'Huy Pham', initials: 'HP', completed: 8, total: 18, progress: 48, needsRevision: 0, lastActive: '5h ago' },
  { name: 'An Tran', initials: 'AT', completed: 13, total: 18, progress: 70, needsRevision: 0, lastActive: '1d ago' },
  { name: 'Linh Vo', initials: 'LV', completed: 7, total: 18, progress: 40, needsRevision: 3, lastActive: '1d ago' },
  { name: 'Bao Le', initials: 'BL', completed: 12, total: 18, progress: 65, needsRevision: 1, lastActive: '2d ago' },
]

export function TrainerStudents() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
    return matchSearch
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        <p className="text-sm text-gray-500">NAB DSA Class — Cohort 4, {students.length} students</p>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Student</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Problems Completed</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Progress</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Needs Revision</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Last Active</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.name} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold">{s.initials}</div>
                    <span className="text-sm font-medium text-gray-900">{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">{s.completed}/{s.total}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24">
                      <ProgressBar value={s.progress} height="h-1.5" />
                    </div>
                    <span className="text-sm text-gray-700">{s.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">{s.needsRevision}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{s.lastActive}</td>
                <td className="px-4 py-4">
                  <button className="text-accent text-sm hover:underline font-medium">View Profile</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center px-5 py-3 border-t border-gray-100 text-sm text-gray-500">
          <span>Showing 1-{filtered.length} of {students.length}</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
