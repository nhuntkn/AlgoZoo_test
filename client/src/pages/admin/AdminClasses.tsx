import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Pencil, Users, X, CheckCircle2 } from 'lucide-react'

import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/ProgressBar'

type ClassItem = {
  id: number
  name: string
  description?: string
  trainers: string[]
  students: number
  problems: number
  status: 'active' | 'disabled'
  progress: number
}

const initialClasses: ClassItem[] = [
  { id: 1, name: 'WeCamp Batch 15', trainers: ['Nguyen Van Hung'], students: 24, problems: 35, status: 'active', progress: 62 },
  { id: 2, name: 'StarCamp Batch 2', trainers: ['Tran Thi Mai'], students: 18, problems: 28, status: 'active', progress: 45 },
  { id: 3, name: 'WeCamp Batch 14', trainers: ['Le Van An'], students: 22, problems: 30, status: 'active', progress: 88 },
  { id: 4, name: 'StarCamp Batch 1', trainers: ['Pham Thi Huong'], students: 20, problems: 25, status: 'disabled', progress: 100 },
]

const emptyForm = { name: '', description: '' }

export function AdminClasses() {
  const [classes, setClasses] = useState<ClassItem[]>(initialClasses)
  const [search, setSearch] = useState('')

  const [modal, setModal] = useState<'create' | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [done, setDone] = useState(false)

  const filtered = classes.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => {
    setForm(emptyForm)
    setEditing(null)
    setDone(false)
    setModal('create')
  }

  const closeModal = () => { setModal(null); setDone(false) }

  const handleCreate = () => {
    if (!form.name.trim()) return
    const newClass: ClassItem = {
      id: Date.now(),
      name: form.name,
      description: form.description,
      trainers: [],
      students: 0,
      problems: 0,
      status: 'active',
      progress: 0,
    }
    setClasses((prev) => [newClass, ...prev])
    setDone(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Admin</p>
          <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
        </div>
        <Button onClick={openCreate}><Plus size={15} /> Create Class</Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search classes..."
            className="pl-8 pr-3 py-2 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:border-accent/50 w-56" />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-accent" />
                <h3 className="font-bold text-gray-900">{c.name}</h3>
                <Badge variant={c.status}>{c.status === 'active' ? 'Active' : 'Inactive'}</Badge>
              </div>
              <Link
                to={`/admin/classes/${c.id}/manage`}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <Pencil size={14} />
              </Link>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-1"><Users size={13} className="text-gray-400" />{c.students} students</span>
              <span>{c.problems} problems</span>
              <span className="text-gray-400">Trainer: {c.trainers.join(', ') || '—'}</span>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>Progress</span><span>{c.progress}%</span>
              </div>
              <ProgressBar value={c.progress} height="h-1.5" />
            </div>
          </div>
        ))}
      </div>

      {/* ── Create modal ── */}
      {modal === 'create' && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[480px]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Create New Class</h3>
              <button onClick={closeModal}><X size={18} className="text-gray-400 hover:text-gray-700" /></button>
            </div>

            {done ? (
              <div className="p-8 flex flex-col items-center gap-3 text-center">
                <div className="w-14 h-14 rounded-full border-2 border-green-500 flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-green-500" />
                </div>
                <p className="font-bold text-gray-900 text-lg">Class created!</p>
                <p className="text-sm text-gray-500">{form.name}</p>
                <Button onClick={closeModal} className="mt-1">Done</Button>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Class Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. WeCamp Batch 16"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-accent/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="e.g. A software engineering class for WeCamp Batch 16 students"
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-accent/60 resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="secondary" onClick={closeModal}>Cancel</Button>
                  <Button onClick={handleCreate} disabled={!form.name.trim()}>
                    Create Class
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
