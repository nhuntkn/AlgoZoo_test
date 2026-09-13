import { useState } from 'react'
import { Search, Plus, Pencil, Trash2, UserPlus, CalendarDays, Users, X, CheckCircle2 } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/ProgressBar'

type ClassItem = {
  id: number | string
  name: string
  description?: string
  startDate: string
  endDate: string
  trainers: string[]
  students: number
  problems: number
  status: 'active' | 'disabled'
  progress: number
}

const allTrainers = ['Nguyen Van Hung', 'Tran Thi Mai', 'Le Van An', 'Pham Thi Huong']

const emptyForm = { name: '', description: '', startDate: '', endDate: '', trainer: allTrainers[0] }
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function AdminClasses() {
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [search, setSearch] = useState('')

  // modal state
  const [modal, setModal] = useState<'create' | 'edit' | 'delete' | null>(null)
  const [editing, setEditing] = useState<ClassItem | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filtered = classes.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => {
    setForm(emptyForm)
    setEditing(null)
    setDone(false)
    setError('')
    setModal('create')
  }

  const openEdit = (c: ClassItem) => {
    setEditing(c)
    setForm({
      name: c.name,
      description: c.description || '',
      startDate: c.startDate,
      endDate: c.endDate,
      trainer: c.trainers[0],
    })
    setDone(false)
    setError('')
    setModal('edit')
  }

  const openDelete = (c: ClassItem) => {
    setEditing(c)
    setModal('delete')
  }

  const closeModal = () => { setModal(null); setEditing(null); setDone(false) }

  const handleCreate = async () => {
    const name = form.name.trim()
    if (!name || isSubmitting) return

    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_URL}/api/admin/classes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name,
          description: form.description.trim(),
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || 'Unable to create class')
      }

      const createdClass = data?.data
      const newClass: ClassItem = {
        id: createdClass?.class_id || Date.now(),
        name: createdClass?.name || name,
        description: createdClass?.description || form.description.trim(),
        startDate: form.startDate || 'TBD',
        endDate: form.endDate || 'TBD',
        trainers: [form.trainer],
        students: 0,
        problems: 0,
        status: 'active',
        progress: 0,
      }

      setClasses((prev) => [newClass, ...prev])
      setDone(true)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to create class')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = () => {
    if (!editing || !form.name.trim()) return
    setClasses((prev) =>
      prev.map((c) =>
        c.id === editing.id
          ? { ...c, name: form.name, startDate: form.startDate || c.startDate, endDate: form.endDate || c.endDate, trainers: [form.trainer] }
          : c
      )
    )
    setDone(true)
  }

  const handleDelete = () => {
    if (!editing) return
    setClasses((prev) => prev.filter((c) => c.id !== editing.id))
    closeModal()
  }

  const toggleStatus = (id: number | string) => {
    setClasses((prev) =>
      prev.map((c) => c.id === id ? { ...c, status: c.status === 'active' ? 'disabled' : 'active' } : c)
    )
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
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-sm bg-accent" />
                  <h3 className="font-bold text-gray-900">{c.name}</h3>
                  <Badge variant={c.status}>{c.status === 'active' ? 'Active' : 'Archived'}</Badge>
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <CalendarDays size={11} />{c.startDate} — {c.endDate}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700"><Pencil size={14} /></button>
                <button onClick={() => toggleStatus(c.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-accent"><UserPlus size={14} /></button>
                <button onClick={() => openDelete(c)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-1"><Users size={13} className="text-gray-400" />{c.students} students</span>
              <span>{c.problems} problems</span>
              <span className="text-gray-400">Trainer: {c.trainers.join(', ')}</span>
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

      {/* ── Create / Edit modal ── */}
      {(modal === 'create' || modal === 'edit') && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[480px]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">{modal === 'create' ? 'Create New Class' : 'Edit Class'}</h3>
              <button onClick={closeModal}><X size={18} className="text-gray-400 hover:text-gray-700" /></button>
            </div>

            {done ? (
              <div className="p-8 flex flex-col items-center gap-3 text-center">
                <CheckCircle2 size={36} className="text-green-500" />
                <p className="font-bold text-gray-900">{modal === 'create' ? 'Class created!' : 'Class updated!'}</p>
                <p className="text-sm text-gray-400">{form.name}</p>
                <Button onClick={closeModal}>Done</Button>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Class Name <span className="text-red-400">*</span></label>
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
                    placeholder="Describe this class"
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-accent/60 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Start Date</label>
                    <input type="date" value={form.startDate}
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">End Date</label>
                    <input type="date" value={form.endDate}
                      onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Assign Trainer</label>
                  <select value={form.trainer} onChange={(e) => setForm({ ...form, trainer: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none">
                    {allTrainers.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="secondary" onClick={closeModal}>Cancel</Button>
                  <Button onClick={modal === 'create' ? handleCreate : handleEdit} disabled={!form.name.trim() || isSubmitting}>
                    {isSubmitting ? 'Creating...' : modal === 'create' ? 'Create Class' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Delete confirmation modal ── */}
      {modal === 'delete' && editing && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[400px] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <Trash2 size={18} className="text-red-500" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Delete Class</p>
                <p className="text-sm text-gray-400">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to delete <strong>{editing.name}</strong>? All associated data will be removed.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={closeModal}>Cancel</Button>
              <Button variant="danger" onClick={handleDelete}>Delete Class</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
