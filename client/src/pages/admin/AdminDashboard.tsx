import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, X, CheckCircle2 } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { useAdminClasses } from '../../hooks/useAdminClasses'

export function AdminDashboard() {
  const { classes, isLoading, error, setError, createClass } = useAdminClasses()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [done, setDone] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreate = async () => {
    const name = form.name.trim()
    if (!name || isSubmitting) return

    setError('')
    setIsSubmitting(true)

    try {
      await createClass(name, form.description.trim())
      setDone(true)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to create class')
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setForm({ name: '', description: '' })
    setDone(false)
    setError('')
  }

  return (
    <div>
      <div className="mb-7">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Admin</p>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Top action buttons */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/problems">
          <Button variant="secondary">Problem Bank</Button>
        </Link>
        <Link to="/admin/users">
          <Button variant="secondary">Users</Button>
        </Link>
      </div>

      {/* Classes section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Classes</h2>
        <Button onClick={() => { setShowModal(true); setDone(false); setError(''); setForm({ name: '', description: '' }) }}>
          <Plus size={15} /> Add Class
        </Button>
      </div>

      <div className="space-y-3">
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        {isLoading && <p className="text-sm text-gray-500">Loading classes...</p>}
        {!isLoading && !error && classes.length === 0 && <p className="text-sm text-gray-500">No classes found.</p>}
        {classes.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl px-6 py-5 shadow-sm flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-900">{c.name}</h3>
                <Badge variant={c.isActive ? 'ACTIVE' : 'INACTIVE'}>{c.isActive ? 'Active' : 'Inactive'}</Badge>
              </div>
              {c.description && (
                <p className="text-sm text-gray-400">{c.description}</p>
              )}
            </div>
            <Link to={`/admin/classes/${c.id}/manage`}>
              <Button variant="secondary" size="sm">Manage Class</Button>
            </Link>
          </div>
        ))}
      </div>

      {/* Create Class Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[480px]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Create New Class</h3>
              <button onClick={closeModal}><X size={18} className="text-gray-400 hover:text-gray-700" /></button>
            </div>

            {done ? (
              <div className="p-8 flex flex-col items-center gap-3 text-center">
                <CheckCircle2 size={36} className="text-green-500" />
                <p className="font-bold text-gray-900">Class created!</p>
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
                    placeholder="e.g. WeCamp Batch 23"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-accent/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
                  <input
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="e.g. NAB WeCamp Batch 23"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-accent/60"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="secondary" onClick={closeModal}>Cancel</Button>
                  <Button onClick={handleCreate} disabled={!form.name.trim() || isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Class'}
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
