import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronLeft, UserCheck, UserX } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'

type UserItem = {
  id: string
  name: string
  email: string
  role: 'admin' | 'trainer' | 'student'
  isActive: boolean
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function AdminUsers() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<UserItem[]>([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [error, setError] = useState('')
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/get-user`, { credentials: 'include' })
        const data = await response.json()
        if (!response.ok) throw new Error(data?.message || 'Unable to load users')

        setUsers((data?.data?.users || []).map((user: { _id: string; fullname?: string; email: string; role: UserItem['role']; isActive: boolean }) => ({
          id: user._id,
          name: user.fullname || 'Unnamed user',
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        })))
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load users')
      }
    }

    loadUsers()
  }, [])

  const toggleStudentStatus = async (user: UserItem) => {
    if (user.role !== 'student' || updatingUserId) return

    setError('')
    setUpdatingUserId(user.id)
    try {
      const response = await fetch(`${API_URL}/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isActive: !user.isActive }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data?.message || 'Unable to update student status')

      const updatedUser = data?.data?.user
      setUsers((currentUsers) => currentUsers.map((currentUser) => currentUser.id === user.id
        ? { ...currentUser, isActive: updatedUser?.isActive ?? !user.isActive }
        : currentUser
      ))
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Unable to update student status')
    } finally {
      setUpdatingUserId(null)
    }
  }

  const filtered = users.filter((u) => {
    const q = search.toLowerCase()
    const matchSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
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
          <p className="text-sm text-gray-400 mt-0.5">{users.length} total</p>
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
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 m-4">{error}</p>}
        <div className="grid grid-cols-[1fr_220px_110px_120px] border-b border-gray-100 px-6 py-3">
          {['NAME', 'EMAIL', 'ROLE', 'STATUS'].map((h) => (
            <span key={h} className="text-[10px] font-bold text-gray-400 tracking-widest">{h}</span>
          ))}
        </div>
        {filtered.map((u, i) => (
          <div
            key={u.id}
            className={`grid grid-cols-[1fr_220px_110px_120px] items-center px-6 py-4 hover:bg-gray-50 ${
              i < filtered.length - 1 ? 'border-b border-gray-50' : ''
            }`}
          >
            <span className="text-sm font-semibold text-gray-900">{u.name}</span>
            <span className="text-sm text-gray-500 truncate">{u.email}</span>
            <div className="flex items-center">
              <Badge variant={`role-${u.role}`}>
                {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={u.isActive ? 'active' : 'disabled'}>{u.isActive ? 'Active' : 'Inactive'}</Badge>
              {u.role === 'student' && (
                <button
                  onClick={() => toggleStudentStatus(u)}
                  disabled={updatingUserId === u.id}
                  title={u.isActive ? 'Deactivate student' : 'Activate student'}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-accent disabled:opacity-50"
                >
                  {u.isActive ? <UserX size={15} /> : <UserCheck size={15} />}
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-400">No users match your search</div>
        )}
      </div>
    </div>
  )
}
