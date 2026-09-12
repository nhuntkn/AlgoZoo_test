import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronLeft } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'

type UserItem = {
  id: number
  name: string
  username: string
  role: 'admin' | 'trainer' | 'student'
  classes: string[]
}

const initialUsers: UserItem[] = [
  { id: 1, name: 'Maya Tran', username: 'maya_admin', role: 'admin', classes: [] },
  { id: 2, name: 'Alex Nguyen', username: 'alexn', role: 'trainer', classes: ['Batch 21', 'Batch 22'] },
  { id: 3, name: 'Sarah Tran', username: 'sarah_tran', role: 'trainer', classes: ['Batch 21'] },
  { id: 4, name: 'Alice Nguyen', username: 'alice123', role: 'student', classes: ['Batch 21', 'Batch 25'] },
  { id: 5, name: 'Bob Tran', username: 'bob_t', role: 'student', classes: ['Batch 21'] },
  { id: 6, name: 'Minh Le', username: 'minh_le', role: 'student', classes: ['Batch 22'] },
  { id: 7, name: 'Sarah Lee', username: 'sarah_lee', role: 'student', classes: ['Batch 21', 'Batch 22'] },
  { id: 8, name: 'Huy Pham', username: 'huy_p', role: 'student', classes: ['Batch 25'] },
]

export function AdminUsers() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const filtered = initialUsers.filter((u) => {
    const q = search.toLowerCase()
    const matchSearch = u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q)
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-accent font-medium transition-colors mb-2"
          >
            <ChevronLeft size={15} /> Back
          </button>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Admin</p>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-400 mt-0.5">{initialUsers.length} total</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:border-accent/50"
          />
        </div>
        <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {(['all', 'admin', 'trainer', 'student'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-4 py-2 text-xs font-semibold capitalize transition-colors ${
                roleFilter === r ? 'bg-accent text-white' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1fr_160px_100px_1fr] border-b border-gray-100 px-6 py-3">
          {['NAME', 'USERNAME', 'ROLE', 'CLASSES'].map((h) => (
            <span key={h} className="text-[10px] font-bold text-gray-400 tracking-widest">{h}</span>
          ))}
        </div>
        {filtered.map((u, i) => (
          <div
            key={u.id}
            className={`grid grid-cols-[1fr_160px_100px_1fr] items-center px-6 py-4 hover:bg-gray-50 ${
              i < filtered.length - 1 ? 'border-b border-gray-50' : ''
            }`}
          >
            <span className="text-sm font-semibold text-gray-900">{u.name}</span>
            <span className="text-sm text-gray-500">@{u.username}</span>
            <div className="flex items-center">
              <Badge variant={`role-${u.role}`}>
                {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
              </Badge>
            </div>
            <span className="text-sm text-gray-500">
              {u.classes.length > 0 ? u.classes.join(', ') : <span className="text-gray-300">—</span>}
            </span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-400">No users match your search</div>
        )}
      </div>
    </div>
  )
}
