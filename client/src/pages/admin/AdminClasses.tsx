import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Pencil, X, CheckCircle2 } from 'lucide-react'

import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import * as adminService from '../../services/adminService'
import { useAdminClasses } from '../../hooks/useAdminClasses'
import type { AdminClass } from '../../types/admin'

const emptyForm = { name: '', description: '' }

export function AdminClasses() {
  const { classes, isLoading, error: loadError, createClass } = useAdminClasses()
  const [search, setSearch] = useState('')

  // Modal State
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [editing, setEditing] = useState<AdminClass | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [done, setDone] = useState(false)
  const [error, setLocalError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const displayError = error || loadError

  const filtered = classes.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => {
    setForm(emptyForm)
    setEditing(null)
    setDone(false)
    setLocalError('')
    setModal('create')
  }

  const openEdit = (c: AdminClass) => {
    setEditing(c)
    setForm({
      name: c.name,
      description: c.description || '',
    })
    setDone(false)
    setLocalError('')
    setModal('edit')
  }

  const closeModal = () => {
    setModal(null)
    setEditing(null)
    setDone(false)
    setLocalError('')
  }

  const handleCreate = async () => {
    const name = form.name.trim()
    if (!name || isSubmitting) return

    setLocalError('')
    setIsSubmitting(true)

    try {
      await createClass(name, form.description.trim())
      setDone(true)
    } catch (requestError) {
      setLocalError(requestError instanceof Error ? requestError.message : 'Unable to create class')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async () => {
    if (!editing || !form.name.trim() || isSubmitting) return

    setLocalError('')
    setIsSubmitting(true)
    try {
      await adminService.updateClass(editing.id, form.name.trim(), form.description.trim())
      setDone(true)
    } catch (requestError) {
      setLocalError(requestError instanceof Error ? requestError.message : 'Unable to update class')
    } finally {
      setIsSubmitting(false)
    }
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
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search classes..."
            className="pl-8 pr-3 py-2 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:border-accent/50 w-56"
          />
        </div>
      </div>

      {/* Cards */}
      {displayError && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{displayError}</p>}
      {isLoading && <p className="text-sm text-gray-500">Loading classes...</p>}
      {!isLoading && !displayError && filtered.length === 0 && <p className="text-sm text-gray-500">No classes found.</p>}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-sm bg-accent" />
                  <h3 className="font-bold text-gray-900">{c.name}</h3>
                  <Badge variant={c.isActive ? 'active' : 'disabled'}>{c.isActive ? 'Active' : 'Inactive'}</Badge>
                </div>
                {c.description && <p className="text-sm text-gray-400">{c.description}</p>}
              </div>

              <div className="flex items-center gap-1">
                {/* Router Link for Manage Route */}
                <Link
                  to={`/admin/classes/${c.id}/manage`}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                  title="Manage Class"
                >
                  <Pencil size={14} />
                </Link>
                <button
                  onClick={() => openEdit(c)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700"
                  title="Edit Class"
                >
                  <Pencil size={14} />
                </button>
              </div>
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
                <div className="w-14 h-14 rounded-full border-2 border-green-500 flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-green-500" />
                </div>
                <p className="font-bold text-gray-900 text-lg">{modal === 'create' ? 'Class created!' : 'Class updated!'}</p>
                <p className="text-sm text-gray-500">{form.name}</p>
                <Button onClick={closeModal} className="mt-1">Done</Button>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
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
                    placeholder="Describe this class"
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-accent/60 resize-none"
                  />
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

    </div>
  )
}