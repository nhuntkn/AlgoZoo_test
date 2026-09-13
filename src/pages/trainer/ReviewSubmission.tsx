import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Code2, ImageIcon, Paperclip, ChevronLeft, ChevronRight, Check, Pencil } from 'lucide-react'
import { Badge, TypeBadge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { useNotifications } from '../../context/NotificationContext'

type ContentBlock =
  | { type: 'text'; content: string }
  | { type: 'code'; language: string; content: string }
  | { type: 'image'; filename: string; dataUrl: string }
  | { type: 'file'; filename: string }

const submission = {
  id: 1,
  student: 'Alice Nguyen',
  initials: 'AN',
  problem: 'Two Sum',
  problemType: 'DSA' as const,
  problemDescription: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
  problemConstraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', 'Only one valid answer exists'],
  problemExamples: [
    { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
    { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
  ],
  problemResourceUrl: 'https://leetcode.com/problems/two-sum/',
  class: 'WeCamp Batch 21',
  classId: '1',
  submittedAt: 'Sep 10, 2026 at 4:32 PM',
  status: 'PENDING' as const,
  isLate: false,
  contentBlocks: [
    {
      type: 'text' as const,
      content: 'My approach is to use a hash map to store previously seen numbers. For each number, I check if the complement (target - current) already exists in the map. This gives us O(n) time complexity.',
    },
    {
      type: 'code' as const,
      language: 'python',
      content: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    },
    {
      type: 'image' as const,
      filename: 'leetcode-accepted.png',
      dataUrl: '',
    },
  ] as ContentBlock[],
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  )
}

function BlockView({ block }: { block: ContentBlock }) {
  if (block.type === 'text') {
    return (
      <div>
        <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50">
          <FileText size={13} className="text-gray-400" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Explanation</span>
        </div>
        <div className="px-5 py-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">{block.content}</div>
      </div>
    )
  }

  if (block.type === 'code') {
    return (
      <div>
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700 bg-gray-900">
          <div className="flex items-center gap-2">
            <Code2 size={13} className="text-gray-400" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Code</span>
          </div>
          <span className="text-xs text-gray-500 capitalize">{block.language}</span>
        </div>
        <div className="bg-gray-900 px-5 py-4 font-mono text-sm overflow-auto">
          {block.content.split('\n').map((line, i) => (
            <div key={i} className="flex hover:bg-gray-800/40">
              <span className="text-gray-600 w-7 flex-shrink-0 text-right mr-4 select-none text-xs leading-6">{i + 1}</span>
              <span className="text-gray-200 leading-6">{line || ' '}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (block.type === 'image') {
    return (
      <div>
        <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50">
          <ImageIcon size={13} className="text-gray-400" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Screenshot</span>
          <span className="text-xs text-gray-400 ml-1">{block.filename}</span>
        </div>
        <div className="p-5 bg-gray-50 min-h-24 flex items-center justify-center">
          {block.dataUrl ? (
            <img src={block.dataUrl} alt={block.filename} className="max-h-64 rounded-lg object-contain" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <ImageIcon size={28} />
              <p className="text-xs">{block.filename}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (block.type === 'file') {
    return (
      <div className="flex items-center gap-3 px-5 py-4">
        <Paperclip size={15} className="text-gray-400 flex-shrink-0" />
        <span className="text-sm text-gray-700">{block.filename}</span>
        <button className="ml-auto text-xs text-accent font-semibold hover:underline">Download</button>
      </div>
    )
  }

  return null
}

export function ReviewSubmission() {
  const [feedback, setFeedback] = useState('')
  const [done, setDone] = useState(false)
  const [isEditing, setIsEditing] = useState(true)
  const { addNotification } = useNotifications()

  return (
    <div>
      {/* Back + Breadcrumb */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <Link
          to={`/trainer/classes/${submission.classId}/submissions`}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-accent font-medium transition-colors"
        >
          <ChevronLeft size={15} /> Back to Submissions
        </Link>
        <span className="text-gray-200">|</span>
        <div className="flex items-center gap-1.5 text-sm text-gray-400 flex-wrap">
        <Link to="/trainer/classes" className="hover:text-accent">My Classes</Link>
        <ChevronRight size={13} className="text-gray-300" />
        <Link to={`/trainer/classes/${submission.classId}/overview`} className="hover:text-accent">{submission.class}</Link>
        <ChevronRight size={13} className="text-gray-300" />
        <Link to={`/trainer/classes/${submission.classId}/submissions`} className="hover:text-accent">Submissions</Link>
        <ChevronRight size={13} className="text-gray-300" />
        <span className="text-gray-700 font-medium">{submission.student}</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent text-white text-sm flex items-center justify-center font-bold flex-shrink-0">
            {submission.initials}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{submission.student}</h1>
            <p className="text-sm text-gray-400">{submission.problem} · Submitted {submission.submittedAt}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TypeBadge type={submission.problemType} />
          {done ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-green-100 text-green-700">
              <Check size={11} /> Reviewed
            </span>
          ) : (
            <Badge variant="pending">Pending</Badge>
          )}
          {submission.isLate && <Badge variant="late">Late</Badge>}
        </div>
      </div>

      {/* Two-column layout: solution left, feedback right */}
      <div className="flex gap-5 items-start">
        {/* LEFT: problem description + content blocks */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Problem description card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50">
              <FileText size={13} className="text-gray-400" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Problem</span>
              <span className="ml-1 text-xs font-bold text-gray-700">{submission.problem}</span>
              <div className="ml-auto flex items-center">
                <TypeBadge type={submission.problemType} />
              </div>
            </div>
            <div className="px-5 py-4 space-y-3">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{submission.problemDescription}</p>
              {submission.problemConstraints.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1.5">Constraints</p>
                  <ul className="space-y-1">
                    {submission.problemConstraints.map((c, i) => (
                      <li key={i} className="text-xs text-gray-600 flex gap-2">
                        <span className="text-gray-300 flex-shrink-0">•</span>{c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {submission.problemExamples.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1.5">Examples</p>
                  <div className="space-y-1.5">
                    {submission.problemExamples.map((ex, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl px-3 py-2 text-xs font-mono">
                        <p className="text-gray-500">Input: <span className="text-gray-800">{ex.input}</span></p>
                        <p className="text-gray-500">Output: <span className="text-gray-800">{ex.output}</span></p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {submission.problemResourceUrl && (
                <a href={submission.problemResourceUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-accent hover:underline">
                  View on LeetCode →
                </a>
              )}
            </div>
          </div>

          {/* Student submission blocks */}
          <div className="flex items-center gap-2 px-1">
            <div className="w-7 h-7 rounded-full bg-accent text-white text-[10px] flex items-center justify-center font-bold flex-shrink-0">
              {submission.initials}
            </div>
            <span className="text-sm font-semibold text-gray-700">Student's Submission</span>
          </div>
          {submission.contentBlocks.map((block, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <BlockView block={block} />
            </div>
          ))}
        </div>

        {/* RIGHT: submission info + feedback */}
        <div className="w-[300px] flex-shrink-0 space-y-4">
          {/* Submission info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h3 className="font-semibold text-gray-800 text-sm">Submission Info</h3>
            <InfoRow label="Student" value={submission.student} />
            <InfoRow label="Problem" value={submission.problem} />
            <InfoRow label="Class" value={submission.class} />
            <InfoRow label="Submitted" value={submission.submittedAt} />
            <InfoRow
              label="Status"
              value={
                done
                  ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700"><Check size={11} /> Reviewed</span>
                  : <Badge variant="pending">Pending</Badge>
              }
            />
            {submission.problemResourceUrl && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Resource</p>
                <a
                  href={submission.problemResourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-accent hover:underline break-all"
                >
                  {submission.problemResourceUrl}
                </a>
              </div>
            )}
          </div>

          {/* Feedback */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800 text-sm">Feedback</h3>
              {done && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1 text-xs text-accent font-semibold hover:underline"
                >
                  <Pencil size={11} /> Edit
                </button>
              )}
            </div>

            {done && !isEditing ? (
              /* Read-only feedback display */
              <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-sm text-gray-700 leading-relaxed whitespace-pre-line min-h-[80px]">
                {feedback || <span className="text-gray-400 italic">No feedback written.</span>}
              </div>
            ) : (
              /* Editable textarea */
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={10}
                placeholder={`Write feedback for ${submission.student}…\n\nExamples:\n- Great approach using hash map\n- Check edge case: empty array\n- Clean, readable code`}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-accent/60 resize-none"
              />
            )}

            {done && !isEditing ? null : done && isEditing ? (
              <>
                <Button
                  variant="success"
                  className="w-full justify-center"
                  onClick={() => setIsEditing(false)}
                >
                  Save Changes
                </Button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="w-full text-xs text-center text-gray-400 hover:text-gray-600"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <Button
                  variant="success"
                  className="w-full justify-center"
                  onClick={() => {
                    setDone(true)
                    setIsEditing(false)
                    addNotification({
                      recipientRole: 'student',
                      type: 'GRADE_RELEASED',
                      title: 'Submission graded',
                      message: `Your submission for ${submission.problem} has been graded.`,
                      context: `${submission.class} · ${submission.problemType}`,
                      entityType: 'submission',
                      entityId: String(submission.id),
                      linkTo: `/student/submissions/${submission.id}`,
                    })
                  }}
                >
                  Mark as Reviewed
                </Button>
                <p className="text-xs text-center text-gray-400">
                  Student sees feedback after you mark as reviewed.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
