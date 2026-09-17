import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ChevronLeft, Send, Settings, ChevronDown, Lightbulb,
  Paperclip, Link as LinkIcon, FileText, X, Bold, Italic,
  Underline, Strikethrough, Heading1, Heading2, List, ListOrdered,
  Code, Undo, Redo, ExternalLink, Image as ImageIcon, MoreHorizontal
} from 'lucide-react'
import {
  getTrainerProblemBankById,
  createTrainerProblem,
  updateTrainerProblem,
  type BankProblemResource,
} from '../../../utils/trainerStore'

type TopicOption = 'DSA' | 'OS' | 'Database' | 'Other'
type DifficultyOption = 'Easy' | 'Medium' | 'Hard'

const TOPICS: { value: TopicOption; label: string; badge: string; badgeStyle: string }[] = [
  { value: 'DSA', label: 'DSA', badge: 'DSA', badgeStyle: 'bg-sky-50 text-sky-600 font-bold' },
  { value: 'OS', label: 'OS', badge: 'OS', badgeStyle: 'bg-emerald-50 text-emerald-600 font-bold' },
  { value: 'Database', label: 'Database', badge: 'Database', badgeStyle: 'bg-purple-50 text-purple-600 font-bold' },
  { value: 'Other', label: 'Other', badge: 'Other', badgeStyle: 'bg-gray-100 text-gray-600 font-bold' },
]

export function TrainerCreateProblem() {
  const { problemId } = useParams<{ problemId?: string }>()
  const navigate = useNavigate()
  const isEditing = Boolean(problemId)

  // Form states
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [topic, setTopic] = useState<TopicOption>('DSA')
  const [difficulty, setDifficulty] = useState<DifficultyOption>('Medium')
  const [resources, setResources] = useState<BankProblemResource[]>([])

  // UI states
  const [isTopicDropdownOpen, setIsTopicDropdownOpen] = useState(false)
  const [isNormalDropdownOpen, setIsNormalDropdownOpen] = useState(false)
  const [isAddingLink, setIsAddingLink] = useState(false)
  const [linkTitle, setLinkTitle] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  // Load existing problem if editing
  useEffect(() => {
    if (problemId) {
      const existing = getTrainerProblemBankById(problemId)
      if (existing) {
        setTitle(existing.title)
        setDescription(existing.description || '')
        setTopic(existing.subject as TopicOption)
        setDifficulty(existing.difficulty || 'Medium')
        setResources(existing.resources || [])
      }
    }
  }, [problemId])

  // Formatting tools handler
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const selectedText = text.substring(start, end)
    const replacement = `${prefix}${selectedText || 'text'}${suffix}`

    const newText = text.substring(0, start) + replacement + text.substring(end)
    setDescription(newText)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText.length || 4)
      )
    }, 10)
  }

  // Handle Add Link
  const handleAddLink = () => {
    if (!linkTitle.trim() || !linkUrl.trim()) return

    const newRes: BankProblemResource = {
      id: `res-${Date.now()}`,
      type: 'link',
      title: linkTitle.trim(),
      url: linkUrl.startsWith('http') ? linkUrl.trim() : `https://${linkUrl.trim()}`,
    }

    setResources((prev) => [...prev, newRes])
    setLinkTitle('')
    setLinkUrl('')
    setIsAddingLink(false)
  }

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const newRes: BankProblemResource = {
      id: `res-${Date.now()}`,
      type: 'file',
      title: file.name,
      fileName: file.name,
    }

    setResources((prev) => [...prev, newRes])
    e.target.value = ''
  }

  const handleRemoveResource = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id))
  }

  // Handle Publish / Save
  const handlePublish = () => {
    if (!title.trim()) {
      setErrorMessage('Please enter a problem title.')
      return
    }

    setErrorMessage('')

    if (isEditing && problemId) {
      updateTrainerProblem(problemId, {
        title: title.trim(),
        description: description.trim(),
        subject: topic,
        difficulty,
        resources,
      })
    } else {
      createTrainerProblem({
        title: title.trim(),
        description: description.trim(),
        subject: topic,
        difficulty,
        resources,
      })
    }

    navigate('/trainer/problems')
  }

  const selectedTopicMeta = TOPICS.find((t) => t.value === topic) || TOPICS[0]

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between">
        <Link
          to="/trainer/problems"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft size={16} />
          Back to Problem Bank
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/trainer/problems')}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePublish}
            className="px-5 py-2 rounded-xl bg-accent text-white text-sm font-semibold hover:opacity-95 shadow-sm shadow-red-200 flex items-center gap-2 transition-all"
          >
            <Send size={14} className="rotate-45" />
            {isEditing ? 'Save Changes' : 'Publish'}
          </button>
        </div>
      </div>

      {/* ── Page Header ── */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          {isEditing ? 'Edit Problem' : 'Create New Problem'}
        </h1>
        <p className="text-sm text-gray-400 font-medium mt-1">
          Write a new problem to add to your problem bank. You can use rich text, code blocks, and attach resources.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
          {errorMessage}
        </div>
      )}

      {/* ── 2-Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left Column (2/3) Main Form ── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
            {/* Title Field */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-gray-900">
                Title <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={200}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Two Sum, Process vs Thread, Database Normalization..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:border-accent bg-white transition-colors"
                />
              </div>
              <div className="text-right text-xs text-gray-400 font-medium">
                {title.length}/200
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-gray-900">
                Description
              </label>

              {/* Formatting Toolbar */}
              <div className="border border-gray-200 rounded-t-xl bg-gray-50/80 px-3 py-2 flex items-center gap-1.5 flex-wrap text-gray-600">
                <button
                  type="button"
                  onClick={() => insertFormatting('**', '**')}
                  title="Bold"
                  className="w-7 h-7 rounded hover:bg-gray-200/70 flex items-center justify-center transition-colors"
                >
                  <Bold size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('*', '*')}
                  title="Italic"
                  className="w-7 h-7 rounded hover:bg-gray-200/70 flex items-center justify-center transition-colors"
                >
                  <Italic size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('<u>', '</u>')}
                  title="Underline"
                  className="w-7 h-7 rounded hover:bg-gray-200/70 flex items-center justify-center transition-colors"
                >
                  <Underline size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('~~', '~~')}
                  title="Strikethrough"
                  className="w-7 h-7 rounded hover:bg-gray-200/70 flex items-center justify-center transition-colors"
                >
                  <Strikethrough size={14} />
                </button>

                <div className="h-4 w-[1px] bg-gray-300 mx-1" />

                {/* Normal Text Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsNormalDropdownOpen(!isNormalDropdownOpen)}
                    className="px-2 h-7 rounded hover:bg-gray-200/70 flex items-center gap-1 text-xs font-semibold text-gray-700 transition-colors"
                  >
                    <span>Normal</span>
                    <ChevronDown size={11} className="text-gray-400" />
                  </button>

                  {isNormalDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-30 w-32 text-xs">
                      <button
                        type="button"
                        onClick={() => setIsNormalDropdownOpen(false)}
                        className="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-gray-700 font-medium"
                      >
                        Normal
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          insertFormatting('\n# ')
                          setIsNormalDropdownOpen(false)
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-bold text-gray-900"
                      >
                        Heading 1
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          insertFormatting('\n## ')
                          setIsNormalDropdownOpen(false)
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-semibold text-gray-800"
                      >
                        Heading 2
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          insertFormatting('```\n', '\n```')
                          setIsNormalDropdownOpen(false)
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-gray-50 font-mono text-gray-700"
                      >
                        Code Block
                      </button>
                    </div>
                  )}
                </div>

                <div className="h-4 w-[1px] bg-gray-300 mx-1" />

                <button
                  type="button"
                  onClick={() => insertFormatting('\n# ')}
                  title="Heading 1"
                  className="px-2 h-7 rounded hover:bg-gray-200/70 flex items-center justify-center text-xs font-bold transition-colors"
                >
                  H1
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('\n## ')}
                  title="Heading 2"
                  className="px-2 h-7 rounded hover:bg-gray-200/70 flex items-center justify-center text-xs font-bold transition-colors"
                >
                  H2
                </button>

                <div className="h-4 w-[1px] bg-gray-300 mx-1" />

                <button
                  type="button"
                  onClick={() => insertFormatting('\n- ')}
                  title="Bullet List"
                  className="w-7 h-7 rounded hover:bg-gray-200/70 flex items-center justify-center transition-colors"
                >
                  <List size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('\n1. ')}
                  title="Numbered List"
                  className="w-7 h-7 rounded hover:bg-gray-200/70 flex items-center justify-center transition-colors"
                >
                  <ListOrdered size={14} />
                </button>

                <div className="h-4 w-[1px] bg-gray-300 mx-1" />

                <button
                  type="button"
                  onClick={() => insertFormatting('[', '](url)')}
                  title="Insert Link"
                  className="w-7 h-7 rounded hover:bg-gray-200/70 flex items-center justify-center transition-colors"
                >
                  <LinkIcon size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('![alt](', ')') }
                  title="Insert Image"
                  className="w-7 h-7 rounded hover:bg-gray-200/70 flex items-center justify-center transition-colors"
                >
                  <ImageIcon size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('```\n', '\n```')}
                  title="Code Block"
                  className="w-7 h-7 rounded hover:bg-gray-200/70 flex items-center justify-center transition-colors"
                >
                  <Code size={14} />
                </button>
                <button
                  type="button"
                  title="More options"
                  className="w-7 h-7 rounded hover:bg-gray-200/70 flex items-center justify-center transition-colors"
                >
                  <MoreHorizontal size={14} />
                </button>

                <div className="ml-auto flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => document.execCommand('undo')}
                    title="Undo"
                    className="w-7 h-7 rounded hover:bg-gray-200/70 flex items-center justify-center transition-colors"
                  >
                    <Undo size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => document.execCommand('redo')}
                    title="Redo"
                    className="w-7 h-7 rounded hover:bg-gray-200/70 flex items-center justify-center transition-colors"
                  >
                    <Redo size={14} />
                  </button>
                </div>
              </div>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                rows={10}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Start writing your problem description here..."
                className="w-full p-4 rounded-b-xl border border-t-0 border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:border-accent bg-white transition-colors leading-relaxed"
              />
            </div>

            {/* Resources Section */}
            <div className="space-y-4 pt-2">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Resources</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Attach files or add links to provide additional materials for this problem.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 bg-white transition-colors"
                >
                  <Paperclip size={13} />
                  Attach file
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => setIsAddingLink(!isAddingLink)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 bg-white transition-colors"
                >
                  <LinkIcon size={13} />
                  Add link
                </button>
              </div>

              {/* Inline Add Link Form */}
              {isAddingLink && (
                <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700">Add External Link</span>
                    <button
                      type="button"
                      onClick={() => setIsAddingLink(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Link Title (e.g. Leetcode, Reference Documentation)"
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs placeholder:text-gray-400 bg-white focus:outline-none focus:border-accent"
                  />

                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="https://..."
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 text-xs placeholder:text-gray-400 bg-white focus:outline-none focus:border-accent"
                    />
                    <button
                      type="button"
                      onClick={handleAddLink}
                      className="px-4 py-2 rounded-xl bg-accent text-white text-xs font-semibold hover:opacity-95 shadow-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {/* Empty Resources State */}
              {resources.length === 0 && !isAddingLink && (
                <div className="border border-dashed border-gray-200 rounded-2xl p-8 text-center bg-gray-50/30">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-2">
                    <FileText size={20} />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">No resources added yet</p>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                    Attach files or links to help students better understand this problem.
                  </p>
                </div>
              )}

              {/* Added Resources List in Dashed Container (Matching Figma Image 1) */}
              {resources.length > 0 && (
                <div className="border border-dashed border-gray-200 rounded-2xl p-3 sm:p-4 space-y-2.5">
                  {resources.map((res) => (
                    <div
                      key={res.id}
                      className="border border-gray-100 rounded-xl p-3 flex items-center justify-between bg-white shadow-xs hover:border-gray-200 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100/60 flex items-center justify-center text-accent flex-shrink-0">
                          {res.type === 'link' ? <ExternalLink size={16} /> : <Paperclip size={16} />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 leading-tight truncate">{res.title}</p>
                          {res.type === 'link' ? (
                            <a
                              href={res.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-accent font-medium hover:underline block mt-0.5 truncate"
                            >
                              {res.url}
                            </a>
                          ) : (
                            <p className="text-xs text-gray-400 font-medium mt-0.5 truncate">{res.fileName}</p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveResource(res.id)}
                        className="text-gray-400 hover:text-gray-600 p-1.5 transition-colors flex-shrink-0"
                        title="Remove resource"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Right Column (1/3) Problem Settings ── */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2.5 pb-2 border-b border-gray-50">
              <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                <Settings size={15} />
              </div>
              <h2 className="text-sm font-bold text-gray-900">Problem Settings</h2>
            </div>

            {/* Topic Select */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Topic <span className="text-accent">*</span>
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsTopicDropdownOpen(!isTopicDropdownOpen)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white flex items-center justify-between text-sm text-gray-900 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-gray-400">&lt;/&gt;</span>
                    <span className="font-semibold text-gray-900">{selectedTopicMeta.label}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${
                      isTopicDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Options */}
                {isTopicDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-gray-100 shadow-xl z-20 py-1 overflow-hidden">
                    {TOPICS.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => {
                          setTopic(item.value)
                          setIsTopicDropdownOpen(false)
                        }}
                        className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-gray-400">&lt;/&gt;</span>
                          <span
                            className={`text-xs font-semibold ${
                              topic === item.value ? 'text-accent' : 'text-gray-800'
                            }`}
                          >
                            {item.label}
                          </span>
                        </div>
                        <span className={`text-[11px] px-2 py-0.5 rounded ${item.badgeStyle}`}>
                          {item.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Difficulty Control (Segmented Control matching Figma Image 1) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Difficulty
              </label>

              <div className="border border-gray-200 rounded-xl p-1 grid grid-cols-3 gap-1 bg-white shadow-xs">
                {(['Easy', 'Medium', 'Hard'] as DifficultyOption[]).map((level) => {
                  const isSelected = difficulty === level
                  let activeClasses = ''
                  if (isSelected) {
                    if (level === 'Easy') {
                      activeClasses = 'bg-emerald-50 text-emerald-700 font-semibold'
                    } else if (level === 'Medium') {
                      activeClasses = 'bg-amber-50 text-amber-700 font-semibold'
                    } else {
                      activeClasses = 'bg-rose-50 text-rose-700 font-semibold'
                    }
                  } else {
                    activeClasses = 'text-gray-500 hover:text-gray-800 font-medium'
                  }

                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setDifficulty(level)}
                      className={`py-2 rounded-lg text-xs transition-all text-center ${activeClasses}`}
                    >
                      {level}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Tip Callout */}
            <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
              <Lightbulb size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-0.5 text-xs text-blue-800 leading-relaxed">
                <span className="font-bold">Tip</span>
                <p className="text-blue-600">
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
