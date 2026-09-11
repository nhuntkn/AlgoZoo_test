import { useState, useRef } from 'react'
import { Search, Plus, Pencil, UserX, UserCheck, Upload, X, FileSpreadsheet, CheckCircle2 } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

type User = {
  id: number
  name: string
  email: string
  role: 'admin' | 'trainer' | 'student'
  status: 'active' | 'disabled'
  created: string
}

const initialUsers: User[] = [
  { id: 1, name: 'Maya Tran', email: 'maya@algozoo.com', role: 'admin', status: 'active', created: 'Jan 1, 2025' },
  { id: 2, name: 'Nguyen Van Hung', email: 'hung@algozoo.com', role: 'trainer', status: 'active', created: 'Jan 5, 2025' },
  { id: 3, name: 'Tran Thi Mai', email: 'mai@algozoo.com', role: 'trainer', status: 'active', created: 'Jan 8, 2025' },
  { id: 4, name: 'Trang Nguyen', email: 'trang@algozoo.com', role: 'student', status: 'active', created: 'Feb 1, 2025' },
  { id: 5, name: 'Minh Le', email: 'minh@algozoo.com', role: 'student', status: 'active', created: 'Feb 1, 2025' },
  { id: 6, name: 'Huy Pham', email: 'huy@algozoo.com', role: 'student', status: 'active', created: 'Feb 2, 2025' },
  { id: 7, name: 'Nguyen Thi Lan', email: 'lan@algozoo.com', role: 'student', status: 'disabled', created: 'Mar 1, 2025' },
]

const previewRows = [
  { name: 'An Tran', email: 'an@algozoo.com' },
  { name: 'Linh Vo', email: 'linh@algozoo.com' },
  { name: 'Bao Le', email: 'bao@algozoo.com' },
]

const emptyForm = { name: '', email: '', role: 'student' as User['role'], password: '' }

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  // Import modal
  const [showImport, setShowImport] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importDone, setImportDone] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // Create / Edit modal
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [editing, setEditing] = useState<User | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [formDone, setFormDone] = useState(false)
  const [errors, setErrors] = useState<Partial<typeof emptyForm>>({})

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  // ── CRUD ──────────────────────────────────────
  const openCreate = () => {
    setForm(emptyForm)
    setEditing(null)
    setErrors({})
    setFormDone(false)
    setModal('create')
  }

  const openEdit = (u: User) => {
    setEditing(u)
    setForm({ name: u.name, email: u.email, role: u.role, password: '' })
    setErrors({})
    setFormDone(false)
    setModal('edit')
  }

  const closeModal = () => { setModal(null); setEditing(null); setFormDone(false) }

  const validate = () => {
    const e: Partial<typeof emptyForm> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (modal === 'create' && !form.password.trim()) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleCreate = () => {
    if (!validate()) return
    const newUser: User = {
      id: Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      status: 'active',
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    }
    setUsers((prev) => [newUser, ...prev])
    setFormDone(true)
  }

  const handleEdit = () => {
    if (!editing || !validate()) return
    setUsers((prev) =>
      prev.map((u) =>
        u.id === editing.id ? { ...u, name: form.name.trim(), email: form.email.trim(), role: form.role } : u
      )
    )
    setFormDone(true)
  }

  const toggleStatus = (id: number) => {
    setUsers((prev) =>
      prev.map((u) => u.id === id ? { ...u, status: u.status === 'active' ? 'disabled' : 'active' } : u)
    )
  }

  const finishImport = () => {
    const imported: User[] = previewRows.map((r, i) => ({
      id: Date.now() + i,
      name: r.name,
      email: r.email,
      role: 'student',
      status: 'active',
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    }))
    setUsers((prev) => [...prev, ...imported])
    setImportDone(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Admin</p>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => { setShowImport(true); setImportFile(null); setImportDone(false) }}>
            <FileSpreadsheet size={15} /> Import from Excel
          </Button>
          <Button onClick={openCreate}><Plus size={15} /> Create User</Button>
        </div>
      </div>

      {/* ── Import modal ── */}
      {showImport && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[520px] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Import Students from Excel</h3>
              <button onClick={() => setShowImport(false)}><X size={18} className="text-gray-400 hover:text-gray-700" /></button>
            </div>
            {!importFile ? (
              <div className="p-6">
                <div onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-10 flex flex-col items-center gap-3 cursor-pointer hover:border-accent/50 hover:bg-accent/5 transition-colors">
                  <Upload size={28} className="text-gray-300" />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-700">Drop Excel file or <span className="text-accent">browse</span></p>
                    <p className="text-xs text-gray-400 mt-1">Columns: Name, Email (required)</p>
                  </div>
                </div>
                <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden"
                  onChange={(e) => e.target.files?.[0] && setImportFile(e.target.files[0])} />
                <p className="text-xs text-gray-400 mt-4">A default password will be generated and sent to each student's email.</p>
              </div>
            ) : importDone ? (
              <div className="p-8 flex flex-col items-center text-center gap-3">
                <CheckCircle2 size={40} className="text-green-500" />
                <p className="font-bold text-gray-900">{previewRows.length} students imported</p>
                <p className="text-sm text-gray-400">Students can log in now.</p>
                <Button onClick={() => setShowImport(false)}>Done</Button>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <FileSpreadsheet size={16} className="text-green-500" />
                  <span className="font-medium">{importFile.name}</span>
                  <span className="text-gray-400">— {previewRows.length} students found</span>
                </div>
                <div className="border border-gray-100 rounded-xl overflow-hidden mb-4">
                  <div className="grid grid-cols-2 bg-gray-50 px-4 py-2.5 text-xs font-bold text-gray-400 uppercase tracking-wide">
                    <span>Name</span><span>Email</span>
                  </div>
                  {previewRows.map((r, i) => (
                    <div key={i} className="grid grid-cols-2 px-4 py-2.5 text-sm border-t border-gray-50">
                      <span className="font-medium text-gray-800">{r.name}</span>
                      <span className="text-gray-500">{r.email}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mb-4">Role will be set to <strong>Student</strong>.</p>
                <div className="flex gap-2 justify-end">
                  <Button variant="secondary" onClick={() => setImportFile(null)}>Back</Button>
                  <Button onClick={finishImport}>Import {previewRows.length} Students</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Create / Edit user modal ── */}
      {modal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[460px]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">{modal === 'create' ? 'Create User' : 'Edit User'}</h3>
              <button onClick={closeModal}><X size={18} className="text-gray-400 hover:text-gray-700" /></button>
            </div>

            {formDone ? (
              <div className="p-8 flex flex-col items-center gap-3 text-center">
                <CheckCircle2 size={36} className="text-green-500" />
                <p className="font-bold text-gray-900">{modal === 'create' ? 'User created!' : 'User updated!'}</p>
                <p className="text-sm text-gray-400">{form.name} · {form.role}</p>
                <Button onClick={closeModal}>Done</Button>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <Field label="Full Name *" error={errors.name}>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Trang Nguyen"
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none ${errors.name ? 'border-red-300' : 'border-gray-200 focus:border-accent/60'}`} />
                </Field>
                <Field label="Email Address *" error={errors.email}>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="e.g. trang@algozoo.com"
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none ${errors.email ? 'border-red-300' : 'border-gray-200 focus:border-accent/60'}`} />
                </Field>
                <Field label="Role">
                  <div className="flex gap-2">
                    {(['student', 'trainer', 'admin'] as const).map((r) => (
                      <button key={r} onClick={() => setForm({ ...form, role: r })}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize border transition-colors ${form.role === r ? 'bg-accent text-white border-accent' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </button>
                    ))}
                  </div>
                </Field>
                {modal === 'create' && (
                  <Field label="Password *" error={errors.password}>
                    <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Temporary password"
                      className={`w-full border rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none ${errors.password ? 'border-red-300' : 'border-gray-200 focus:border-accent/60'}`} />
                    <p className="text-xs text-gray-400 mt-1">User will be asked to change this on first login.</p>
                  </Field>
                )}
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="secondary" onClick={closeModal}>Cancel</Button>
                  <Button onClick={modal === 'create' ? handleCreate : handleEdit}>
                    {modal === 'create' ? 'Create User' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..."
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:border-accent/50" />
        </div>
        <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {['all', 'admin', 'trainer', 'student'].map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-4 py-2 text-xs font-semibold capitalize transition-colors ${roleFilter === r ? 'bg-accent text-white' : 'text-gray-500 hover:text-gray-800'}`}>
              {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1fr_200px_100px_80px_110px_90px] border-b border-gray-100 px-6 py-3">
          {['NAME', 'EMAIL', 'ROLE', 'STATUS', 'CREATED', 'ACTIONS'].map((h) => (
            <span key={h} className="text-[10px] font-bold text-gray-400 tracking-widest">{h}</span>
          ))}
        </div>
        {filtered.map((u, i) => (
          <div key={u.id}
            className={`grid grid-cols-[1fr_200px_100px_80px_110px_90px] items-center px-6 py-4 hover:bg-gray-50 transition-colors ${i < filtered.length - 1 ? 'border-b border-gray-50' : ''}`}
          >
            <span className="text-sm font-semibold text-gray-900">{u.name}</span>
            <span className="text-sm text-gray-500">{u.email}</span>
            <Badge variant={`role-${u.role}` as 'role-admin' | 'role-trainer' | 'role-student'}>
              {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
            </Badge>
            <Badge variant={u.status}>{u.status.charAt(0).toUpperCase() + u.status.slice(1)}</Badge>
            <span className="text-sm text-gray-400">{u.created}</span>
            <span className="flex items-center gap-1">
              <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700" title="Edit">
                <Pencil size={14} />
              </button>
              <button onClick={() => toggleStatus(u.id)}
                className={`p-1.5 rounded-lg transition-colors ${u.status === 'active' ? 'hover:bg-red-50 text-gray-400 hover:text-red-500' : 'hover:bg-green-50 text-gray-400 hover:text-green-600'}`}
                title={u.status === 'active' ? 'Disable user' : 'Enable user'}>
                {u.status === 'active' ? <UserX size={14} /> : <UserCheck size={14} />}
              </button>
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
