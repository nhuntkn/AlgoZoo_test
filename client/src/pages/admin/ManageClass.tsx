import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Copy, Check, X, UserMinus, Link2, CheckCircle2, AlertCircle } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import * as adminService from '../../services/adminService'

const emptyClass = {
  id: '',
  name: '',
  description: '',
  status: 'INACTIVE' as 'ACTIVE' | 'INACTIVE',
  studentJoinToken: '',
  trainerInviteToken: '',
}

type ClassMember = { id: string; name: string; email: string }

type RemoveTarget = { type: 'student' | 'trainer'; id: string; name: string; email: string }

export function ManageClass() {
  const { classId } = useParams()
  const [tab, setTab] = useState<'general' | 'students' | 'trainers'>('general')
  const [cls, setCls] = useState(emptyClass)
  const [form, setForm] = useState({ name: cls.name, description: cls.description, status: cls.status })
  const [saved, setSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [students, setStudents] = useState<ClassMember[]>([])
  const [trainers, setTrainers] = useState<ClassMember[]>([])
  const [copiedStudent, setCopiedStudent] = useState(false)
  const [copiedTrainer, setCopiedTrainer] = useState(false)
  const [showStudentLink, setShowStudentLink] = useState(false)
  const [showTrainerLink, setShowTrainerLink] = useState(false)
  const [studentJoinLink, setStudentJoinLink] = useState('')
  const [trainerInviteLink, setTrainerInviteLink] = useState('')
  const [generatingLink, setGeneratingLink] = useState<'student' | 'trainer' | null>(null)

  // Remove Modal State
  const [removeTarget, setRemoveTarget] = useState<RemoveTarget | null>(null)
  const [removeSuccess, setRemoveSuccess] = useState<Omit<RemoveTarget, 'id'> | null>(null)
  const [isRemoving, setIsRemoving] = useState(false)
  // fixDoubleSlash
  function fixDoubleSlash(url: string) {
  return url.replace(/([^:]\/)\/+/g, '$1')
}

  useEffect(() => {
    const loadClass = async () => {
      if (!classId) {
        setError('Class ID is missing')
        setIsLoading(false)
        return
      }

      try {
        const classRecord = await adminService.getClassDetail(classId)

        const loadedClass = {
          id: classRecord.id,
          name: classRecord.name,
          description: classRecord.description,
          status: classRecord.isActive ? ('ACTIVE' as const) : ('INACTIVE' as const),
          studentJoinToken: '',
          trainerInviteToken: '',
        }

        setCls(loadedClass)
        setForm({ name: loadedClass.name, description: loadedClass.description, status: loadedClass.status })
        
        // Handle missing name properties with fallbacks
        setStudents(
          classRecord.students.map((member: any) => ({
            id: member.id,
            name: member.name || member.fullName || member.email?.split('@')[0] || 'Unnamed Student',
            email: member.email || member.username || '',
          }))
        )
        setTrainers(
          classRecord.trainers.map((member: any) => ({
            id: member.id,
            name: member.name || member.fullName || member.email?.split('@')[0] || 'Unnamed Trainer',
            email: member.email || member.username || '',
          }))
        )
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load class')
      } finally {
        setIsLoading(false)
      }
    }

    loadClass()
  }, [classId])

  const generateJoinLink = async (role: 'student' | 'trainer') => {
    if (!classId || generatingLink) return

    setError('')
    setGeneratingLink(role)

    try {
      const data = await adminService.generateJoinLink(classId, role)
      const rawJoinUrl = (data.data as { joinUrl?: string } | undefined)?.joinUrl
      if (!rawJoinUrl) {
        throw new Error('The server did not return an invitation link')
      }
      const joinUrl = fixDoubleSlash(rawJoinUrl)


      if (role === 'student') {
        setStudentJoinLink(joinUrl)
        setShowStudentLink(true)
      } else {
        setTrainerInviteLink(joinUrl)
        setShowTrainerLink(true)
      }
    } catch (linkError) {
      setError(linkError instanceof Error ? linkError.message : 'Unable to generate invitation link')
    } finally {
      setGeneratingLink(null)
    }
  }

  const handleSave = async () => {
    if (!classId || !form.name.trim() || isSaving) return

    setError('')
    setSaved(false)
    setIsSaving(true)

    try {
      const detailsChanged = form.name.trim() !== cls.name || form.description !== cls.description
      const statusChanged = form.status !== cls.status

      if (detailsChanged) {
        const data = await adminService.updateClass(classId, form.name.trim(), form.description)

        setCls((prev) => ({
          ...prev,
          name: (data.data as { name?: string } | undefined)?.name || form.name.trim(),
          description: (data.data as { description?: string } | undefined)?.description || form.description,
        }))
      }

      if (statusChanged) {
        const data = await adminService.updateClassActive(classId, form.status === 'ACTIVE')

        setCls((prev) => ({
          ...prev,
          status: (data.data as { class?: { isActive?: boolean } } | undefined)?.class?.isActive ? 'ACTIVE' : 'INACTIVE',
        }))
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to update class')
    } finally {
      setIsSaving(false)
    }
  }

  const openRemoveConfirm = (type: 'student' | 'trainer', id: string, name: string, email: string) => {
    setRemoveTarget({ type, id, name, email })
  }

  const confirmRemove = async () => {
    if (!classId || !removeTarget || isRemoving) return

    setIsRemoving(true)
    setError('')

    try {
      if (removeTarget.type === 'student') {
        await adminService.removeStudent(classId, removeTarget.id)
        setStudents((prev) => prev.filter((s) => s.id !== removeTarget.id))
      } else {
        await adminService.removeTrainer(classId, removeTarget.id)
        setTrainers((prev) => prev.filter((t) => t.id !== removeTarget.id))
      }

      setRemoveSuccess({ type: removeTarget.type, name: removeTarget.name, email: removeTarget.email })
      setRemoveTarget(null)
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : `Unable to remove ${removeTarget.type}`)
    } finally {
      setIsRemoving(false)
    }
  }

  const closeRemoveModals = () => {
    setRemoveTarget(null)
    setRemoveSuccess(null)
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
        <Link
        to="/admin/classes"
        className="hover:text-accent flex items-center gap-1"
      >
        <ArrowLeft size={14} /> Classes
      </Link>

        <span>/</span>
        <span className="text-gray-700 font-medium">Manage Class</span>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Loading class...</p>}
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 mb-4">{error}</p>}

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
        {(
          [
            { key: 'general', label: 'General Information' },
            { key: 'students', label: 'Students' },
            { key: 'trainers', label: 'Trainers' },
          ] as const
        ).map((t) => (
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
            <Button onClick={handleSave} disabled={isSaving || isLoading || !form.name.trim()}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
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
            <h2 className="font-semibold text-gray-900">
              Students <span className="text-gray-400 font-normal ml-1">{students.length} students</span>
            </h2>
            <Button variant="secondary" onClick={() => generateJoinLink('student')} disabled={generatingLink !== null}>
              <Link2 size={14} /> {generatingLink === 'student' ? 'Generating...' : 'Get Student Join Link'}
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
            <div className="grid grid-cols-[1.5fr_2fr_120px] items-center border-b border-gray-100 px-6 py-3">
              {['NAME', 'USERNAME', 'ACTION'].map((h) => (
                <span key={h} className="text-[10px] font-bold text-gray-400 tracking-widest">{h}</span>
              ))}
            </div>
            {students.map((s, i) => (
              <div key={s.id} className={`grid grid-cols-[1.5fr_2fr_120px] items-center px-6 py-4 hover:bg-gray-50 ${i < students.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <span className="text-sm font-semibold text-gray-900 truncate pr-4">{s.name}</span>
                <span className="text-sm text-gray-500 truncate pr-4">@{s.email}</span>
                <button
                  onClick={() => openRemoveConfirm('student', s.id, s.name, s.email)}
                  className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-medium whitespace-nowrap"
                >
                  <UserMinus size={14} /> Remove
                </button>
              </div>
            ))}
            {students.length === 0 && <div className="py-10 text-center text-sm text-gray-400">No students yet</div>}
          </div>
        </div>
      )}

      {/* Trainers */}
      {tab === 'trainers' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">
              Trainers <span className="text-gray-400 font-normal ml-1">{trainers.length} trainers</span>
            </h2>
            <Button onClick={() => generateJoinLink('trainer')} disabled={generatingLink !== null}>
              {generatingLink === 'trainer' ? 'Generating...' : '+ Invite Trainer'}
            </Button>
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
            <div className="grid grid-cols-[1.5fr_2fr_120px] items-center border-b border-gray-100 px-6 py-3">
              {['NAME', 'USERNAME', 'ACTION'].map((h) => (
                <span key={h} className="text-[10px] font-bold text-gray-400 tracking-widest">{h}</span>
              ))}
            </div>
            {trainers.map((t, i) => (
              <div key={t.id} className={`grid grid-cols-[1.5fr_2fr_120px] items-center px-6 py-4 hover:bg-gray-50 ${i < trainers.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <span className="text-sm font-semibold text-gray-900 truncate pr-4">{t.name}</span>
                <span className="text-sm text-gray-500 truncate pr-4">@{t.email}</span>
                <button
                  onClick={() => openRemoveConfirm('trainer', t.id, t.name, t.email)}
                  className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-medium whitespace-nowrap"
                >
                  <UserMinus size={14} /> Remove
                </button>
              </div>
            ))}
            {trainers.length === 0 && <div className="py-10 text-center text-sm text-gray-400">No trainers yet</div>}
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
              {removeTarget.type === 'student' && <> (@{removeTarget.email})</>} from <strong>{cls.name}</strong>. They will lose access to class materials, assignments, and discussions. This action can be undone by re-inviting the {removeTarget.type === 'student' ? 'student' : 'trainer'}.
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={closeRemoveModals}>
                Cancel
              </Button>
              <Button onClick={confirmRemove} disabled={isRemoving}>
                {isRemoving ? 'Removing...' : 'Yes, Remove'}
              </Button>
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
                {removeSuccess.type === 'student' && <span className="text-gray-500">(@{removeSuccess.email})</span>}{' '}
                has been removed from <strong>{cls.name}</strong>.
              </p>
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 flex items-start gap-2.5 mb-5 text-sm text-orange-700">
              <AlertCircle size={16} className="text-orange-500 flex-shrink-0 mt-0.5" />
              <span>
                The {removeSuccess.type} will no longer have access to class materials, assignments, and discussions. You can invite them back at any time using the join link.
              </span>
            </div>
            <Button className="w-full justify-center" onClick={closeRemoveModals}>
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}