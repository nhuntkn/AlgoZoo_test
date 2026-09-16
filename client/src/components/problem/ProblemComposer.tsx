import { useState, useRef } from 'react'
import {
  ChevronLeft, X, Send, Settings, Lightbulb,
  Bold, Italic, Underline, Strikethrough,
  ChevronDown, List, ListOrdered,
  Link2, ImageIcon, Code2, MoreHorizontal, Undo2, Redo2,
  Paperclip, ExternalLink, FileText,
} from 'lucide-react'
import { TypeBadge } from '../ui/Badge'
import { Button } from '../ui/Button'

export type ProblemType = 'DSA' | 'OS' | 'Database' | 'Other'
export type Difficulty = 'easy' | 'medium' | 'hard'

export type Resource = {
  id: number
  label: string
  url: string
  filename?: string
}

export type ProblemDraft = {
  title: string
  type: ProblemType
  difficulty: Difficulty
  description: string
  resources: Resource[]
}

interface ProblemComposerProps {
  mode: 'create' | 'edit'
  initial?: ProblemDraft
  onSave: (draft: ProblemDraft) => void
  onClose: () => void
}

let nextResourceId = 2000

const TOPIC_ICONS: Record<ProblemType, string> = {
  DSA: '</>',
  OS: '⚙',
  Database: '🗄',
  Other: '•',
}

export function ProblemComposer({ mode, initial, onSave, onClose }: ProblemComposerProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [titleError, setTitleError] = useState(false)
  const [type, setType] = useState<ProblemType>(initial?.type ?? 'DSA')
  const [difficulty, setDifficulty] = useState<Difficulty>(initial?.difficulty ?? 'medium')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [resources, setResources] = useState<Resource[]>(initial?.resources ?? [])
  const [topicOpen, setTopicOpen] = useState(false)
  const [addLinkOpen, setAddLinkOpen] = useState(false)
  const [linkForm, setLinkForm] = useState({ label: '', url: '' })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isEdit = mode === 'edit'

  /* ── resource helpers ── */
  const addLink = () => {
    if (!linkForm.url.trim()) return
    setResources((prev) => [
      ...prev,
      { id: nextResourceId++, label: linkForm.label, url: linkForm.url.trim() },
    ])
    setLinkForm({ label: '', url: '' })
    setAddLinkOpen(false)
  }

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setResources((prev) => [
      ...prev,
      { id: nextResourceId++, label: file.name, url: '', filename: file.name },
    ])
    e.target.value = ''
  }

  const removeResource = (id: number) =>
    setResources((prev) => prev.filter((r) => r.id !== id))

  /* ── publish ── */
  const handlePublish = () => {
    const trimmed = title.trim()
    if (!trimmed) { setTitleError(true); return }
    onSave({ title: trimmed, type, difficulty, description, resources })
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f0f2f5]">
      {/* ── Top bar ── */}
      <div className="bg-white border-b border-gray-200 h-14 px-6 flex items-center justify-between flex-shrink-0 shadow-sm">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors"
        >
          <ChevronLeft size={16} />
          Back to Problem Bank
        </button>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handlePublish}>
            <Send size={13} />
            {isEdit ? 'Save Changes' : 'Publish'}
          </Button>
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-8 pt-7 pb-3">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Problem' : 'Create New Problem'}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Write a new problem to add to your problem bank.{' '}
            <span className="text-gray-400">You can use rich text, code blocks, and attach resources.</span>
          </p>
        </div>

        {/* ── Two-column layout ── */}
        <div className="px-8 pb-10 grid grid-cols-[1fr_308px] gap-5 items-start">
          {/* LEFT: main form card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-7">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                value={title}
                onChange={(e) => { setTitle(e.target.value); setTitleError(false) }}
                placeholder="e.g. Two Sum, Process vs Thread, Database Normalization..."
                maxLength={200}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors ${
                  titleError
                    ? 'border-red-400 bg-red-50 placeholder:text-red-300 focus:border-red-400'
                    : 'border-gray-200 bg-gray-50 focus:border-accent/60 focus:bg-white'
                }`}
              />
              <div className="flex items-center justify-between mt-1.5">
                {titleError
                  ? <p className="text-xs text-red-500">Title is required.</p>
                  : <span />
                }
                <span className="text-xs text-gray-400 ml-auto">{title.length}/200</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Description</label>
              <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:border-accent/40 transition-colors">
                {/* Toolbar */}
                <div className="flex items-center gap-0.5 px-3 py-2 border-b border-gray-100 bg-white flex-wrap">
                  <ToolbarGroup>
                    <ToolbarBtn icon={<Bold size={13} />} label="Bold" />
                    <ToolbarBtn icon={<Italic size={13} />} label="Italic" />
                    <ToolbarBtn icon={<Underline size={13} />} label="Underline" />
                    <ToolbarBtn icon={<Strikethrough size={13} />} label="Strikethrough" />
                  </ToolbarGroup>
                  <ToolbarDivider />
                  <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                    Normal <ChevronDown size={11} className="text-gray-400" />
                  </button>
                  <ToolbarDivider />
                  <ToolbarGroup>
                    <ToolbarBtn icon={<span className="text-xs font-bold">H1</span>} label="Heading 1" />
                    <ToolbarBtn icon={<span className="text-xs font-bold">H2</span>} label="Heading 2" />
                  </ToolbarGroup>
                  <ToolbarDivider />
                  <ToolbarGroup>
                    <ToolbarBtn icon={<List size={13} />} label="Bullet list" />
                    <ToolbarBtn icon={<ListOrdered size={13} />} label="Numbered list" />
                  </ToolbarGroup>
                  <ToolbarDivider />
                  <ToolbarGroup>
                    <ToolbarBtn icon={<Link2 size={13} />} label="Link" />
                    <ToolbarBtn icon={<ImageIcon size={13} />} label="Image" />
                    <ToolbarBtn icon={<Code2 size={13} />} label="Code block" />
                  </ToolbarGroup>
                  <ToolbarDivider />
                  <ToolbarBtn icon={<MoreHorizontal size={13} />} label="More" />
                  <div className="flex-1" />
                  <ToolbarGroup>
                    <ToolbarBtn icon={<Undo2 size={13} />} label="Undo" />
                    <ToolbarBtn icon={<Redo2 size={13} />} label="Redo" />
                  </ToolbarGroup>
                </div>
                {/* Editor area */}
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Start writing your problem description here..."
                  rows={12}
                  className="w-full px-4 py-3.5 text-sm text-gray-700 resize-y focus:outline-none leading-relaxed bg-white placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Resources */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Resources</label>
              <p className="text-xs text-gray-400 mb-3">
                Attach files or add links to provide additional materials for this problem.
              </p>
              <div className="flex items-center gap-2 mb-3">
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileAttach} />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Paperclip size={14} /> Attach file
                </button>
                <button
                  onClick={() => { setAddLinkOpen(true); setLinkForm({ label: '', url: '' }) }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Link2 size={14} /> Add link
                </button>
              </div>

              {/* Add link inline form */}
              {addLinkOpen && (
                <div className="mb-3 bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
                  <input
                    value={linkForm.label}
                    onChange={(e) => setLinkForm({ ...linkForm, label: e.target.value })}
                    placeholder="Label (e.g. LeetCode)"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-accent/60"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <input
                      value={linkForm.url}
                      onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-accent/60"
                      onKeyDown={(e) => { if (e.key === 'Enter') addLink() }}
                    />
                    <button
                      onClick={addLink}
                      disabled={!linkForm.url.trim()}
                      className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-semibold disabled:opacity-40 hover:bg-accent-hover transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setAddLinkOpen(false)}
                      className="px-3 py-2 text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* Resource list / empty state */}
              <div className={`border-2 border-dashed rounded-xl transition-colors ${
                resources.length === 0 ? 'border-gray-200 py-10' : 'border-gray-100 p-3 space-y-2'
              }`}>
                {resources.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                      <FileText size={18} className="text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-500">No resources added yet</p>
                    <p className="text-xs text-gray-400">Attach files or links to help students better understand this problem.</p>
                  </div>
                ) : (
                  resources.map((r) => (
                    <div key={r.id} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                        {r.filename ? <Paperclip size={14} className="text-gray-400" /> : <ExternalLink size={14} className="text-accent" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{r.label || r.url}</p>
                        {r.url && r.label && (
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-accent hover:underline truncate block"
                          >
                            {r.url}
                          </a>
                        )}
                        {r.filename && <p className="text-xs text-gray-400">File attachment</p>}
                      </div>
                      <button
                        onClick={() => removeResource(r.id)}
                        className="text-gray-300 hover:text-red-400 flex-shrink-0 transition-colors"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: settings card */}
          <div className="bg-white rounded-2xl shadow-sm p-5 space-y-5 sticky top-4">
            {/* Header */}
            <div className="flex items-center gap-2.5 pb-1">
              <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
                <Settings size={15} className="text-gray-500" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Problem Settings</h3>
            </div>

            <div className="w-full h-px bg-gray-100" />

            {/* Topic */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Topic <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  onClick={() => setTopicOpen((v) => !v)}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 hover:border-gray-300 transition-colors"
                >
                  <span className="font-mono text-xs text-gray-500 w-5 text-center flex-shrink-0">
                    {TOPIC_ICONS[type]}
                  </span>
                  <span className="flex-1 text-left">{type}</span>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${topicOpen ? 'rotate-180' : ''}`} />
                </button>
                {topicOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                    {(['DSA', 'OS', 'Database', 'Other'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => { setType(t); setTopicOpen(false) }}
                        className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors hover:bg-gray-50 ${
                          type === t ? 'text-accent font-semibold bg-red-50/50' : 'text-gray-700'
                        }`}
                      >
                        <span className="font-mono text-xs text-gray-400 w-5 text-center flex-shrink-0">
                          {TOPIC_ICONS[t]}
                        </span>
                        <span className="flex-1 text-left">{t}</span>
                        <span className="flex items-center"><TypeBadge type={t} /></span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${type === 'DSA' ? 'text-gray-800' : 'text-gray-400'}`}>
                Difficulty
                {type !== 'DSA' && <span className="ml-1.5 text-xs font-normal text-gray-400">(DSA only)</span>}
              </label>
              <div className={`flex rounded-xl border overflow-hidden ${type !== 'DSA' ? 'border-gray-100 opacity-40 pointer-events-none' : 'border-gray-200'}`}>
                {(['easy', 'medium', 'hard'] as Difficulty[]).map((d, i) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    disabled={type !== 'DSA'}
                    className={`flex-1 py-2 text-xs font-semibold capitalize transition-colors ${
                      i > 0 ? 'border-l border-gray-200' : ''
                    } ${
                      difficulty === d && type === 'DSA'
                        ? d === 'easy'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : d === 'medium'
                          ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                        : 'text-gray-400 bg-gray-50'
                    }`}
                  >
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tip card */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
              <Lightbulb size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-blue-700 mb-1">Tip</p>
                <p className="text-xs text-blue-600 leading-relaxed">
                  Choose the right topic and difficulty level to help students find your problem easily.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Toolbar helpers ── */
function ToolbarBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      title={label}
      className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
    >
      {icon}
    </button>
  )
}

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0">{children}</div>
}

function ToolbarDivider() {
  return <div className="w-px h-4 bg-gray-200 mx-1.5 flex-shrink-0" />
}
