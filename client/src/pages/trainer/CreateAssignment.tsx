import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, GripVertical, X, CheckCircle2, BookOpen } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { problemBank } from './TrainerProblems'

const classNames: Record<string, string> = {
  '1': 'WeCamp Batch 15',
  '2': 'StarCamp Batch 2',
}

type Problem = typeof problemBank[number]

const DRAG_BANK = 'bank'
const DRAG_REORDER = 'reorder'

export function CreateAssignment() {
  const { classId } = useParams<{ classId: string }>()
  const navigate = useNavigate()
  const className = classNames[classId ?? '1'] ?? 'Unknown Class'

  const [assignmentName, setAssignmentName] = useState('')
  const [assigned, setAssigned] = useState<Problem[]>([])
  const [bankSearch, setBankSearch] = useState('')
  const [bankDiff, setBankDiff] = useState('all')
  const [isDragOver, setIsDragOver] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const assignedIds = new Set(assigned.map((p) => p.id))

  const bankFiltered = problemBank.filter(
    (p) =>
      p.title.toLowerCase().includes(bankSearch.toLowerCase()) &&
      (bankDiff === 'all' || p.difficulty === bankDiff)
  )

  // ── bank drag ────────────────────────────────────────────
  const onBankDragStart = (p: Problem, e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('dragType', DRAG_BANK)
    e.dataTransfer.setData('problemId', String(p.id))
  }

  // ── reorder drag ─────────────────────────────────────────
  const onRowDragStart = (idx: number, e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('dragType', DRAG_REORDER)
    e.dataTransfer.setData('fromIdx', String(idx))
  }

  // ── canvas drop (handles both types) ─────────────────────
  const onCanvasDrop = (e: React.DragEvent, insertIdx?: number) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    const dragType = e.dataTransfer.getData('dragType')

    if (dragType === DRAG_BANK) {
      const id = Number(e.dataTransfer.getData('problemId'))
      const p = problemBank.find((x) => x.id === id)
      if (p && !assignedIds.has(p.id)) {
        setAssigned((prev) =>
          insertIdx !== undefined
            ? [...prev.slice(0, insertIdx), p, ...prev.slice(insertIdx)]
            : [...prev, p]
        )
      }
    } else if (dragType === DRAG_REORDER && insertIdx !== undefined) {
      const from = Number(e.dataTransfer.getData('fromIdx'))
      if (from === insertIdx || from === insertIdx - 1) return
      setAssigned((prev) => {
        const next = [...prev]
        const [moved] = next.splice(from, 1)
        const to = from < insertIdx ? insertIdx - 1 : insertIdx
        next.splice(to, 0, moved)
        return next
      })
    }
  }

  const remove = (id: number) => setAssigned((prev) => prev.filter((p) => p.id !== id))

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true) }
  const onDragLeave = (e: React.DragEvent) => {
    // only clear if leaving the container entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragOver(false)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle2 size={32} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Assignment Published!</h2>
        <p className="text-gray-500 text-sm max-w-sm">
          <strong>"{assignmentName || 'Untitled Assignment'}"</strong> with {assigned.length} problem{assigned.length !== 1 ? 's' : ''} is now available to all students in <strong>{className}</strong>.
        </p>
        <Link to={`/trainer/classes/${classId}`} className="mt-2">
          <Button variant="secondary">← Back to Class</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-5 text-sm text-gray-400">
        <Link to="/trainer/classes" className="hover:text-accent flex items-center gap-1">
          <ArrowLeft size={14} /> Classes
        </Link>
        <span>/</span>
        <Link to={`/trainer/classes/${classId}`} className="hover:text-accent">{className}</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">New Assignment</span>
      </div>

      {/* Assignment name */}
      <input
        value={assignmentName}
        onChange={(e) => setAssignmentName(e.target.value)}
        placeholder="Assignment name..."
        className="text-2xl font-bold text-gray-900 placeholder:text-gray-300 border-none outline-none bg-transparent mb-6 w-full"
      />

      <div className="flex gap-5 items-start">
        {/* ── LEFT: Problem Bank ── */}
        <div className="w-72 flex-shrink-0 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3.5 border-b border-gray-100">
            <BookOpen size={15} className="text-accent" />
            <span className="text-sm font-bold text-gray-900">Problem Bank</span>
            <span className="ml-auto text-xs text-gray-400">{bankFiltered.length}</span>
          </div>

          <div className="px-3 py-3 border-b border-gray-50 space-y-2">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={bankSearch}
                onChange={(e) => setBankSearch(e.target.value)}
                placeholder="Search..."
                className="pl-7 pr-2 py-1.5 border border-gray-200 rounded-lg bg-gray-50 text-xs w-full focus:outline-none"
              />
            </div>
            <div className="flex gap-1">
              {['all', 'easy', 'medium', 'hard'].map((d) => (
                <button
                  key={d}
                  onClick={() => setBankDiff(d)}
                  className={`flex-1 py-1 rounded-md text-[10px] font-semibold capitalize transition-colors ${bankDiff === d ? 'bg-accent text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                  {d === 'all' ? 'All' : d}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-y-auto max-h-[520px]">
            {bankFiltered.map((p) => {
              const added = assignedIds.has(p.id)
              return (
                <div
                  key={p.id}
                  draggable={!added}
                  onDragStart={(e) => { if (!added) onBankDragStart(p, e) }}
                  className={`flex items-center gap-2.5 px-3 py-2.5 border-b border-gray-50 last:border-0 select-none transition-colors
                    ${added ? 'opacity-35 cursor-default' : 'cursor-grab hover:bg-accent/5 active:cursor-grabbing'}`}
                >
                  <GripVertical size={13} className="text-gray-300 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate leading-tight">{p.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{p.topic}</p>
                  </div>
                  <Badge variant={p.difficulty as 'easy' | 'medium' | 'hard'}>
                    {p.difficulty === 'easy' ? 'E' : p.difficulty === 'medium' ? 'M' : 'H'}
                  </Badge>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── RIGHT: Assignment canvas ── */}
        <div className="flex-1">
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={(e) => onCanvasDrop(e)}
            className={`min-h-[520px] rounded-2xl border-2 border-dashed p-4 transition-colors ${
              isDragOver
                ? 'border-accent bg-accent/5'
                : assigned.length === 0
                ? 'border-gray-200 bg-gray-50'
                : 'border-gray-100 bg-transparent'
            }`}
          >
            {assigned.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[480px] gap-3 text-center pointer-events-none">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center">
                  <BookOpen size={22} className={isDragOver ? 'text-accent' : 'text-gray-300'} />
                </div>
                <p className={`font-semibold text-sm ${isDragOver ? 'text-accent' : 'text-gray-400'}`}>
                  {isDragOver ? 'Drop to add' : 'Drag problems here from the bank'}
                </p>
                <p className="text-gray-300 text-xs">Problems appear in the order you drop them</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {assigned.map((p, i) => (
                  <div key={p.id}>
                    {/* drop zone between items */}
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => onCanvasDrop(e, i)}
                      className="h-1.5 rounded-full mx-4 transition-colors hover:bg-accent/20"
                    />
                    <div
                      draggable
                      onDragStart={(e) => onRowDragStart(i, e)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => { e.stopPropagation(); onCanvasDrop(e, i + 1) }}
                      className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing active:opacity-60 transition-opacity select-none"
                    >
                      <GripVertical size={15} className="text-gray-300 flex-shrink-0" />
                      <span className="w-6 h-6 rounded-lg bg-gray-100 text-[11px] font-bold text-gray-500 flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{p.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{p.topic}</p>
                      </div>
                      <Badge variant={p.difficulty as 'easy' | 'medium' | 'hard'}>{p.difficulty.toUpperCase()}</Badge>
                      <button
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={() => remove(p.id)}
                        className="p-1 text-gray-300 hover:text-red-400 flex-shrink-0 transition-colors ml-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {/* drop zone at end */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => onCanvasDrop(e, assigned.length)}
                  className="h-1.5 rounded-full mx-4"
                />
                <div className="rounded-xl border border-dashed border-gray-200 py-3 text-center text-xs text-gray-300 mt-2">
                  Drop more problems here
                </div>
              </div>
            )}
          </div>

          {assigned.length > 0 && (
            <div className="flex items-center justify-between mt-4 px-1">
              <p className="text-sm text-gray-400">
                {assigned.length} problem{assigned.length !== 1 ? 's' : ''} in this assignment
              </p>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => navigate(`/trainer/classes/${classId}`)}>
                  Cancel
                </Button>
                <Button onClick={() => setSubmitted(true)}>Publish Assignment</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
