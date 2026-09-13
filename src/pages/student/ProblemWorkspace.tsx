import { useState, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ChevronLeft, ChevronRight, ExternalLink,
  Plus, Trash2, Code2, FileText, ImageIcon, Paperclip, Send, CheckCircle2,
  Clock, MessageSquare,
} from 'lucide-react'
import { TypeBadge, Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { useNotifications } from '../../context/NotificationContext'

const problemData: Record<string, {
  title: string; type: string; difficulty: 'Easy' | 'Medium' | 'Hard';
  deadline: string; description: string; constraints: string[]; examples: { input: string; output: string }[];
  resource_url: string; status: 'not-started' | 'pending' | 'reviewed'; isPastDeadline: boolean;
  feedback?: { trainer: string; trainerInitials: string; reviewedAt: string; text: string }
}> = {
  '1': {
    title: 'Two Sum', type: 'DSA', difficulty: 'Easy', deadline: 'September 20, 2026',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
    constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', 'Only one valid answer exists'],
    examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' }, { input: 'nums = [3,2,4], target = 6', output: '[1,2]' }],
    resource_url: 'https://leetcode.com/problems/two-sum/',
    status: 'reviewed', isPastDeadline: false,
    feedback: { trainer: 'Alex Nguyen', trainerInitials: 'AN', reviewedAt: 'Sep 15, 2026', text: 'Great use of hash map for O(n) solution! The code is clean and readable. Consider adding a comment about the time/space complexity trade-off.' },
  },
  '2': {
    title: 'Binary Search', type: 'DSA', difficulty: 'Easy', deadline: 'September 22, 2026',
    description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.',
    constraints: ['1 ≤ nums.length ≤ 10⁴', '-10⁴ < nums[i], target < 10⁴', 'All integers in nums are unique', 'nums is sorted in ascending order'],
    examples: [{ input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' }, { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1' }],
    resource_url: 'https://leetcode.com/problems/binary-search/',
    status: 'pending', isPastDeadline: false,
  },
  '3': {
    title: 'Reverse Linked List', type: 'DSA', difficulty: 'Easy', deadline: 'September 25, 2026',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    constraints: ['The number of nodes in the list is the range [0, 5000]', '-5000 ≤ Node.val ≤ 5000'],
    examples: [{ input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' }],
    resource_url: 'https://leetcode.com/problems/reverse-linked-list/',
    status: 'not-started', isPastDeadline: false,
  },
  '4': {
    title: 'Process Scheduling', type: 'OS', difficulty: 'Medium', deadline: 'September 18, 2026',
    description: 'Implement and compare FCFS, SJF, and Round Robin scheduling algorithms.',
    constraints: ['Support at least FCFS and Round Robin', 'Calculate average metrics'],
    examples: [], resource_url: '', status: 'not-started', isPastDeadline: true,
  },
  '5': {
    title: 'Memory Management', type: 'OS', difficulty: 'Medium', deadline: 'September 28, 2026',
    description: 'Understand paging and segmentation concepts in OS memory management.',
    constraints: [], examples: [], resource_url: '', status: 'not-started', isPastDeadline: false,
  },
  '6': {
    title: 'SQL Queries', type: 'Database', difficulty: 'Easy', deadline: 'October 1, 2026',
    description: 'Write SQL queries to solve common database problems using SELECT, JOIN, and aggregation functions.',
    constraints: ['Use standard SQL', 'Optimize for readability'], examples: [], resource_url: '', status: 'not-started', isPastDeadline: false,
  },
}

const difficultyClass: Record<string, string> = {
  Easy: 'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-800',
  Hard: 'bg-red-100 text-red-700',
}

const LANGUAGES = ['Python', 'JavaScript', 'Java', 'C++', 'Go', 'TypeScript', 'SQL']

type BlockType = 'text' | 'code' | 'image' | 'file'

type Block =
  | { id: number; type: 'text'; content: string }
  | { id: number; type: 'code'; language: string; content: string }
  | { id: number; type: 'image'; filename: string; dataUrl: string }
  | { id: number; type: 'file'; filename: string }

let nextId = 1

export function ProblemWorkspace() {
  const { classId = '2', problemId = '1' } = useParams()
  const navigate = useNavigate()
  const problem = problemData[problemId] ?? problemData['1']
  const className = 'WeCamp Batch 22'
  const { addNotification } = useNotifications()

  const [blocks, setBlocks] = useState<Block[]>([])
  const [submitted, setSubmitted] = useState(problem.status !== 'not-started')
  const [showAddMenu, setShowAddMenu] = useState(false)
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({})
  const imageRefs = useRef<Record<number, HTMLInputElement | null>>({})
  const addMenuRef = useRef<HTMLDivElement>(null)

  const addBlock = (type: BlockType) => {
    const id = nextId++
    setBlocks((prev) => {
      if (type === 'text') return [...prev, { id, type: 'text', content: '' }]
      if (type === 'code') return [...prev, { id, type: 'code', language: 'Python', content: '' }]
      if (type === 'image') return [...prev, { id, type: 'image', filename: '', dataUrl: '' }]
      return [...prev, { id, type: 'file', filename: '' }]
    })
    setShowAddMenu(false)
    if (type === 'image') setTimeout(() => imageRefs.current[id]?.click(), 50)
    if (type === 'file') setTimeout(() => fileRefs.current[id]?.click(), 50)
  }

  const removeBlock = (id: number) => setBlocks((prev) => prev.filter((b) => b.id !== id))

  const updateBlock = (id: number, patch: Partial<Block>) =>
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } as Block : b)))

  const handleImageUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) =>
      updateBlock(id, { filename: file.name, dataUrl: ev.target?.result as string } as Partial<Block>)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleFileUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    updateBlock(id, { filename: file.name } as Partial<Block>)
    e.target.value = ''
  }

  const handleSubmit = () => {
    setSubmitted(true)
    const notifContext = `${className} · ${problem.type}`
    const submissionId = problemId
    if (problem.isPastDeadline) {
      addNotification({
        recipientRole: 'trainer', type: 'SUBMISSION_LATE',
        title: 'Late submission',
        message: `Juliana Silva submitted ${problem.title} after the deadline`,
        context: notifContext, entityType: 'submission', entityId: submissionId,
        linkTo: `/trainer/submissions/${submissionId}`,
      })
    } else {
      addNotification({
        recipientRole: 'trainer', type: 'SUBMISSION_CREATED',
        title: 'New submission',
        message: `Juliana Silva submitted ${problem.title}`,
        context: notifContext, entityType: 'submission', entityId: submissionId,
        linkTo: `/trainer/submissions/${submissionId}`,
      })
    }
    addNotification({
      recipientRole: 'student', type: 'SUBMISSION_SUCCESS',
      title: 'Submission successful',
      message: `Your submission for ${problem.title} was submitted successfully.`,
      context: notifContext, entityType: 'submission', entityId: submissionId,
      linkTo: `/student/submissions/${submissionId}`,
    })
    navigate('/student/submissions')
  }

  const hasContent = blocks.length > 0 && blocks.some((b) => {
    if (b.type === 'text' || b.type === 'code') return b.content.trim() !== ''
    if (b.type === 'image') return b.dataUrl !== ''
    if (b.type === 'file') return b.filename !== ''
    return false
  })

  const isReviewed = problem.status === 'reviewed' && !!problem.feedback

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <Link
          to={`/student/classes/${classId}/problems`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-accent font-medium transition-colors"
        >
          <ChevronLeft size={16} /> Back to Problems
        </Link>
        <span className="text-gray-200">|</span>
        <div className="flex items-center gap-1.5 text-sm text-gray-400 flex-wrap">
          <Link to="/student/classes" className="hover:text-accent">My Classes</Link>
          <ChevronRight size={13} className="text-gray-300" />
          <Link to={`/student/classes/${classId}/overview`} className="hover:text-accent">{className}</Link>
          <ChevronRight size={13} className="text-gray-300" />
          <Link to={`/student/classes/${classId}/problems`} className="hover:text-accent">Problems</Link>
          <ChevronRight size={13} className="text-gray-300" />
          <span className="text-gray-700 font-medium">{problem.title}</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{problem.title}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{className} · Deadline: {problem.deadline}</p>
        </div>
        <div className="flex items-center gap-2">
          <TypeBadge type={problem.type} />
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${difficultyClass[problem.difficulty]}`}>
            {problem.difficulty}
          </span>
          {problem.isPastDeadline && <Badge variant="late">Deadline passed</Badge>}
          {submitted && (
            isReviewed
              ? <Badge variant="reviewed">Reviewed</Badge>
              : <Badge variant="pending">Pending Review</Badge>
          )}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-5 items-start">

        {/* LEFT: problem + solution */}
        <div className="flex-1 min-w-0 space-y-3">

          {/* Problem description card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50">
              <FileText size={13} className="text-gray-400" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Problem</span>
              <span className="ml-1 text-xs font-bold text-gray-700">{problem.title}</span>
              <div className="ml-auto flex items-center gap-2">
                <TypeBadge type={problem.type} />
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${difficultyClass[problem.difficulty]}`}>
                  {problem.difficulty}
                </span>
              </div>
            </div>
            <div className="px-5 py-4 space-y-3">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{problem.description}</p>

              {problem.constraints.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1.5">Constraints</p>
                  <ul className="space-y-1">
                    {problem.constraints.map((c, i) => (
                      <li key={i} className="text-xs text-gray-600 flex gap-2">
                        <span className="text-gray-300 flex-shrink-0">•</span>{c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {problem.examples.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1.5">Examples</p>
                  <div className="space-y-1.5">
                    {problem.examples.map((ex, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl px-3 py-2 text-xs font-mono">
                        <p className="text-gray-500">Input: <span className="text-gray-800">{ex.input}</span></p>
                        <p className="text-gray-500">Output: <span className="text-gray-800">{ex.output}</span></p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {problem.resource_url && (
                <a
                  href={problem.resource_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                >
                  View resource <ExternalLink size={11} />
                </a>
              )}
            </div>
          </div>

          {/* "My Solution" section label */}
          <div className="flex items-center gap-2 px-1 pt-1">
            <div className="w-7 h-7 rounded-full bg-accent text-white text-[10px] flex items-center justify-center font-bold flex-shrink-0">
              ME
            </div>
            <span className="text-sm font-semibold text-gray-700">My Solution</span>
            {submitted && (
              <span className="ml-1 inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
                <CheckCircle2 size={11} /> Submitted
              </span>
            )}
          </div>

          {/* Blocks */}
          {blocks.map((block) => (
            <BlockEditor
              key={block.id}
              block={block}
              disabled={submitted}
              onUpdate={(patch) => updateBlock(block.id, patch)}
              onRemove={() => removeBlock(block.id)}
              imageRef={(el) => { imageRefs.current[block.id] = el }}
              fileRef={(el) => { fileRefs.current[block.id] = el }}
              onImageUpload={(e) => handleImageUpload(block.id, e)}
              onFileUpload={(e) => handleFileUpload(block.id, e)}
            />
          ))}

          {/* Empty submitted state */}
          {blocks.length === 0 && submitted && (
            <div className="bg-white rounded-2xl shadow-sm py-10 text-center text-sm text-gray-400">
              No content blocks recorded for this submission.
            </div>
          )}

          {/* Add content */}
          {!submitted && (
            <div className="relative" ref={addMenuRef}>
              {showAddMenu ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Add content block</p>
                  <div className="flex gap-2 flex-wrap">
                    {([
                      { type: 'text' as BlockType, icon: <FileText size={15} />, label: 'Text' },
                      { type: 'code' as BlockType, icon: <Code2 size={15} />, label: 'Code' },
                      { type: 'image' as BlockType, icon: <ImageIcon size={15} />, label: 'Image' },
                      { type: 'file' as BlockType, icon: <Paperclip size={15} />, label: 'File' },
                    ]).map(({ type, icon, label }) => (
                      <button
                        key={type}
                        onClick={() => addBlock(type)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-accent/10 hover:text-accent border border-gray-200 hover:border-accent/30 rounded-xl text-sm font-medium text-gray-700 transition-colors"
                      >
                        {icon} {label}
                      </button>
                    ))}
                    <button
                      onClick={() => setShowAddMenu(false)}
                      className="ml-auto px-4 py-2.5 text-sm text-gray-400 hover:text-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddMenu(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-medium text-gray-400 hover:border-accent/40 hover:text-accent hover:bg-accent/5 transition-colors"
                >
                  <Plus size={16} /> Add content
                </button>
              )}
            </div>
          )}

          {/* Submit bar */}
          {!submitted && (
            <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm px-5 py-4">
              <p className="text-sm text-gray-400">
                {!hasContent
                  ? 'Add at least one content block before submitting.'
                  : 'Ready to submit. You can only submit once.'}
              </p>
              <Button onClick={handleSubmit} disabled={!hasContent}>
                <Send size={14} /> Submit
              </Button>
            </div>
          )}
        </div>

        {/* RIGHT sidebar */}
        <div className="w-[300px] flex-shrink-0 space-y-4 sticky top-4">

          {/* Problem info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h3 className="font-semibold text-gray-800 text-sm">Problem Info</h3>
            <InfoRow
              label="Topic"
              value={<TypeBadge type={problem.type} />}
            />
            <InfoRow
              label="Difficulty"
              value={
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${difficultyClass[problem.difficulty]}`}>
                  {problem.difficulty}
                </span>
              }
            />
            {problem.deadline && (
              <InfoRow
                label="Deadline"
                value={
                  <span className={`text-sm font-medium ${problem.isPastDeadline ? 'text-red-500' : 'text-gray-900'}`}>
                    {problem.deadline}
                  </span>
                }
              />
            )}
            <InfoRow
              label="Status"
              value={
                <div className="flex items-center gap-1.5 mt-0.5">
                  {isReviewed
                    ? <CheckCircle2 size={13} className="text-green-500" />
                    : submitted
                      ? <Clock size={13} className="text-yellow-500" />
                      : <div className="w-3 h-3 rounded-full bg-gray-200" />
                  }
                  <span className={`text-sm font-medium ${
                    isReviewed ? 'text-green-700' :
                    submitted ? 'text-yellow-700' : 'text-gray-400'
                  }`}>
                    {isReviewed ? 'Reviewed' : submitted ? 'Pending review' : 'Not started'}
                  </span>
                </div>
              }
            />
          </div>

          {/* Feedback card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare size={14} className="text-gray-400" />
              <h3 className="font-semibold text-gray-800 text-sm">Trainer Feedback</h3>
            </div>

            {isReviewed && problem.feedback ? (
              <>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-accent text-white text-[10px] flex items-center justify-center font-bold flex-shrink-0">
                    {problem.feedback.trainerInitials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{problem.feedback.trainer}</p>
                    <p className="text-xs text-gray-400">{problem.feedback.reviewedAt}</p>
                  </div>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-sm text-gray-700 leading-relaxed">
                  {problem.feedback.text}
                </div>
              </>
            ) : submitted ? (
              <div className="flex flex-col items-center gap-2 py-4 text-center">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                  <Clock size={16} className="text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-500">Waiting for feedback</p>
                <p className="text-xs text-gray-400">Your trainer will review your submission and leave feedback here.</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-4 text-center">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                  <MessageSquare size={16} className="text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-500">Not submitted yet</p>
                <p className="text-xs text-gray-400">Submit your solution to receive feedback from your trainer.</p>
              </div>
            )}
          </div>

          {/* Submit shortcut when not yet submitted */}
          {!submitted && (
            <Button
              className="w-full justify-center"
              onClick={handleSubmit}
              disabled={!hasContent}
            >
              <Send size={14} /> Submit Solution
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <div className="text-sm font-medium text-gray-900">{value}</div>
    </div>
  )
}

/* ── Block editor component ── */
function BlockEditor({
  block, disabled, onUpdate, onRemove, imageRef, fileRef, onImageUpload, onFileUpload,
}: {
  block: Block
  disabled: boolean
  onUpdate: (patch: Partial<Block>) => void
  onRemove: () => void
  imageRef: (el: HTMLInputElement | null) => void
  fileRef: (el: HTMLInputElement | null) => void
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  if (block.type === 'text') {
    return (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            <FileText size={13} className="text-gray-400" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Text</span>
          </div>
          {!disabled && (
            <button onClick={onRemove} className="text-gray-300 hover:text-red-500 transition-colors">
              <Trash2 size={14} />
            </button>
          )}
        </div>
        <textarea
          value={block.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Write your explanation, approach, or notes..."
          rows={4}
          disabled={disabled}
          className="w-full px-5 py-4 text-sm text-gray-700 resize-none focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
        />
      </div>
    )
  }

  if (block.type === 'code') {
    return (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700 bg-gray-900">
          <div className="flex items-center gap-2">
            <Code2 size={13} className="text-gray-400" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Code</span>
          </div>
          <div className="flex items-center gap-2">
            {!disabled ? (
              <select
                value={block.language}
                onChange={(e) => onUpdate({ language: e.target.value })}
                className="text-xs bg-gray-800 border border-gray-700 text-gray-300 rounded-lg px-2 py-1 focus:outline-none"
              >
                {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
              </select>
            ) : (
              <span className="text-xs text-gray-500">{block.language}</span>
            )}
            {!disabled && (
              <button onClick={onRemove} className="text-gray-600 hover:text-red-400 transition-colors ml-1">
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
        <textarea
          value={block.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder={`Paste your ${block.language} code here...`}
          rows={10}
          disabled={disabled}
          className="w-full px-5 py-4 font-mono text-sm bg-gray-900 text-gray-300 resize-none focus:outline-none disabled:opacity-70"
          spellCheck={false}
        />
      </div>
    )
  }

  if (block.type === 'image') {
    return (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            <ImageIcon size={13} className="text-gray-400" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Image</span>
            {block.filename && <span className="text-xs text-gray-400 ml-1">{block.filename}</span>}
          </div>
          {!disabled && (
            <button onClick={onRemove} className="text-gray-300 hover:text-red-500 transition-colors">
              <Trash2 size={14} />
            </button>
          )}
        </div>
        <div className="p-5 bg-gray-50">
          <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={onImageUpload} />
          {block.dataUrl ? (
            <img src={block.dataUrl} alt={block.filename} className="max-h-64 rounded-lg object-contain" />
          ) : (
            !disabled && (
              <div
                className="w-full border-2 border-dashed border-gray-200 rounded-xl py-8 flex flex-col items-center gap-2 text-gray-400 hover:border-accent/40 hover:text-accent hover:bg-accent/5 transition-colors cursor-pointer"
              >
                <ImageIcon size={24} />
                <span className="text-sm">Click to upload image</span>
              </div>
            )
          )}
        </div>
      </div>
    )
  }

  if (block.type === 'file') {
    return (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            <Paperclip size={13} className="text-gray-400" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">File</span>
          </div>
          {!disabled && (
            <button onClick={onRemove} className="text-gray-300 hover:text-red-500 transition-colors">
              <Trash2 size={14} />
            </button>
          )}
        </div>
        <div className="px-5 py-4">
          <input ref={fileRef} type="file" className="hidden" onChange={onFileUpload} />
          {block.filename ? (
            <div className="flex items-center gap-3">
              <Paperclip size={15} className="text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-700 flex-1">{block.filename}</span>
              {!disabled && (
                <button className="text-xs text-accent font-semibold hover:underline">Change</button>
              )}
            </div>
          ) : (
            !disabled && (
              <button className="text-sm text-accent font-semibold hover:underline flex items-center gap-1.5">
                <Paperclip size={14} /> Select file to attach
              </button>
            )
          )}
        </div>
      </div>
    )
  }

  return null
}
