import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Copy, Check, X, UserMinus, Link2, CheckCircle2, AlertCircle } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

const classData = {
  id: 1,
  name: 'WeCamp Batch 21',
  description: 'NAB WeCamp Batch 21',
  status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
  studentJoinToken: '8f3k2mxp9qlz',
  trainerInviteToken: 'tr7n4vw1yabs',
}

const initialStudents = [
  { id: 1, name: 'Alice Nguyen', username: 'alice123' },
]

const initialTrainers = [
  { id: 1, name: 'Alex Nguyen', username: 'alexn' },
]

export function ManageClass() {
  const [tab, setTab] = useState<'general' | 'students' | 'trainers'>('general')
  const [cls, setCls] = useState(classData)
  const [form, setForm] = useState({ name: cls.name, description: cls.description, status: cls.status })
  const [saved, setSaved] = useState(false)
  const [students, setStudents] = useState(initialStudents)
  const [trainers, setTrainers] = useState(initialTrainers)
  const [copiedStudent, setCopiedStudent] = useState(false)
  const [copiedTrainer, setCopiedTrainer] = useState(false)
  const [showStudentLink, setShowStudentLink] = useState(false)
  const [showTrainerLink, setShowTrainerLink] = useState(false)

  type RemoveTarget = { type: 'student' | 'trainer'; id: number; name: string; username: string }
  const [removeTarget, setRemoveTarget] = useState<RemoveTarget | null>(null)
  const [removeSuccess, setRemoveSuccess] = useState<Omit<RemoveTarget, 'id'> | null>(null)

  const openRemoveConfirm = (type: 'student' | 'trainer', id: number, name: string, username: string) => {
    setRemoveTarget({ type, id, name, username })
  }

  const confirmRemove = () => {
    if (!removeTarget) return
    if (removeTarget.type === 'student') {
      setStudents((prev) => prev.filter((s) => s.id !== removeTarget.id))
    } else {
      setTrainers((prev) => prev.filter((t) => t.id !== removeTarget.id))
    }
    setRemoveSuccess({ type: removeTarget.type, name: removeTarget.name, username: removeTarget.username })
    setRemoveTarget(null)
  }

  const closeRemoveModals = () => {
    setRemoveTarget(null)
    setRemoveSuccess(null)
  }

  const studentJoinLink = `https://algozoo.com/join/student/${cls.studentJoinToken}`
  const trainerInviteLink = `https://algozoo.com/join/trainer/${cls.trainerInviteToken}`

  const handleSave = () => {
    setCls((prev) => ({ ...prev, ...form }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const copyStudentLink = () => {
    navigator.clipboard.writeText(studentJoinLink).catch(() => {})
    setCopiedStudent(true)
    setTimeout(() => setCopiedStudent(false), 2000)
  }

  const copyTrainerLink = () => {
    navigator.clipboard.writeText(trainerInviteLink).catch(() => {})
    setCopiedTrainer(true)
    setTimeout(() => setCopiedTrainer(false), 2000)
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-5 text-sm text-gray-400">
        <Link to="/admin/dashboard" className="hover:text-accent flex items-center gap-1">
          <ArrowLeft size={14} /> Classes
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">Manage Class</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-7">
        <h1 className="text-2xl font-bold text-gray-900">{cls.name}</h1>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${cls.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-400'}`} />
          <Badge variant={cls.status}>{cls.status === 'ACTIVE' ? 'Active' : 'Inactive'}</Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {([
          { key: 'general', label: 'General Information' },
          { key: 'students', label: 'Students' },
          { key: 'trainers', label: 'Trainers' },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === t.key ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* General Information */}
      {tab === 'general' && (
        <div className="bg-white rounded-2xl shadow-sm p-6 max-w-lg space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Class Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-accent/60"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-accent/60"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Button onClick={handleSave}>Save Changes</Button>
            {saved && (
              <span className="flex items-center gap-1 text-sm text-green-600">
                <Check size={14} /> Saved
              </span>
            )}
          </div>
        </div>
      )}

      {/* Students */}
      {tab === 'students' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Students <span className="text-gray-400 font-normal ml-1">{students.length} students</span></h2>
            <Button variant="secondary" onClick={() => setShowStudentLink(true)}>
              <Link2 size={14} /> Get Student Join Link
            </Button>
          </div>

          {showStudentLink && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-blue-900 mb-1">Student Registration Link</p>
                <p className="text-sm text-blue-700 font-mono break-all">{studentJoinLink}</p>
                <p className="text-xs text-blue-600 mt-2">Share this link with students in the WeCamp Zalo group.</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={copyStudentLink}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                >
                  {copiedStudent ? <Check size={13} /> : <Copy size={13} />}
                  {copiedStudent ? 'Copied' : 'Copy Link'}
                </button>
                <button onClick={() => setShowStudentLink(false)} className="text-blue-400 hover:text-blue-600">
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-[1fr_160px_100px] border-b border-gray-100 px-6 py-3">
              {['NAME', 'USERNAME', 'ACTION'].map((h) => (
                <span key={h} className="text-[10px] font-bold text-gray-400 tracking-widest">{h}</span>
              ))}
            </div>
            {students.map((s, i) => (
              <div key={s.id} className={`grid grid-cols-[1fr_160px_100px] items-center px-6 py-4 hover:bg-gray-50 ${i < students.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <span className="text-sm font-semibold text-gray-900">{s.name}</span>
                <span className="text-sm text-gray-500">@{s.username}</span>
                <button
                  onClick={() => openRemoveConfirm('student', s.id, s.name, s.username)}
                  className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-medium"
                >
                  <UserMinus size={14} /> Remove
                </button>
              </div>
            ))}
            {students.length === 0 && (
              <div className="py-10 text-center text-sm text-gray-400">No students yet</div>
            )}
          </div>
        </div>
      )}

      {/* ── Remove confirmation modal (student & trainer) ── */}
      {removeTarget && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[480px] p-6 relative">
            <button onClick={closeRemoveModals} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
              <X size={18} />
            </button>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <UserMinus size={18} className="text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  {removeTarget.type === 'student' ? 'Remove Student from Class' : 'Remove Trainer from Class'}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {removeTarget.type === 'student'
                    ? 'Are you sure you want to remove this student from the class?'
                    : 'Are you sure you want to remove this trainer from the class?'}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-600 mb-5">
              You are about to remove <strong>{removeTarget.name}</strong>
              {removeTarget.type === 'student' && <> (@{removeTarget.username})</>} from{' '}
              <strong>{cls.name}</strong>. They will lose access to class materials, assignments, and discussions.
              This action can be undone by re-inviting the{' '}
              {removeTarget.type === 'student' ? 'student' : 'trainer'}.
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={closeRemoveModals}>Cancel</Button>
              <Button onClick={confirmRemove}>Yes, Remove</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Remove success modal (student & trainer) ── */}
      {removeSuccess && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[480px] p-6 relative">
            <button onClick={closeRemoveModals} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
              <X size={18} />
            </button>
            <div className="flex flex-col items-center text-center mb-5 pt-2">
              <div className="w-12 h-12 rounded-full border-2 border-green-500 flex items-center justify-center mb-3">
                <CheckCircle2 size={28} className="text-green-500" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1">
                {removeSuccess.type === 'student' ? 'Student Removed Successfully' : 'Trainer Removed Successfully'}
              </h3>
              <p className="text-sm text-gray-600">
                <strong>{removeSuccess.name}</strong>{' '}
                {removeSuccess.type === 'student' && <span className="text-gray-500">(@{removeSuccess.username})</span>}{' '}
                has been removed from <strong>{cls.name}</strong>.
              </p>
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 flex items-start gap-2.5 mb-5 text-sm text-orange-700">
              <AlertCircle size={16} className="text-orange-500 flex-shrink-0 mt-0.5" />
              <span>
                The {removeSuccess.type} will no longer have access to class materials, assignments, and discussions.
                You can invite them back at any time using the join link.
              </span>
            </div>
            <Button className="w-full justify-center" onClick={closeRemoveModals}>Done</Button>
          </div>
        </div>
      )}

      {/* Trainers */}
      {tab === 'trainers' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Trainers <span className="text-gray-400 font-normal ml-1">{trainers.length} trainers</span></h2>
            <Button onClick={() => setShowTrainerLink(true)}>+ Invite Trainer</Button>
          </div>

          {showTrainerLink && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-purple-900 mb-1">Trainer Invitation Link</p>
                <p className="text-sm text-purple-700 font-mono break-all">{trainerInviteLink}</p>
                <p className="text-xs text-purple-600 mt-2">Send this link directly to the trainer. Valid for 2 days.</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={copyTrainerLink}
                  className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                >
                  {copiedTrainer ? <Check size={13} /> : <Copy size={13} />}
                  {copiedTrainer ? 'Copied' : 'Copy Link'}
                </button>
                <button onClick={() => setShowTrainerLink(false)} className="text-purple-400 hover:text-purple-600">
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-[1fr_160px_100px] border-b border-gray-100 px-6 py-3">
              {['NAME', 'USERNAME', 'ACTION'].map((h) => (
                <span key={h} className="text-[10px] font-bold text-gray-400 tracking-widest">{h}</span>
              ))}
            </div>
            {trainers.map((t, i) => (
              <div key={t.id} className={`grid grid-cols-[1fr_160px_100px] items-center px-6 py-4 hover:bg-gray-50 ${i < trainers.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <span className="text-sm font-semibold text-gray-900">{t.name}</span>
                <span className="text-sm text-gray-500">@{t.username}</span>
                <button
                  onClick={() => openRemoveConfirm('trainer', t.id, t.name, t.username)}
                  className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-medium"
                >
                  <UserMinus size={14} /> Remove
                </button>
              </div>
            ))}
            {trainers.length === 0 && (
              <div className="py-10 text-center text-sm text-gray-400">No trainers yet</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
