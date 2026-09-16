import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  ChevronLeft, ChevronRight, Code2, FileText, CheckCircle2, Clock,
  Pencil, Trash2, Check, MessageSquare, ExternalLink,
} from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

type SubmissionData = {
  id: number
  problem: string
  problemType: 'DSA' | 'OS' | 'Database' | 'Other'
  problemDescription: string
  problemConstraints: string[]
  problemExamples: { input: string; output: string }[]
  problemResourceUrl?: string
  class: string
  submittedAt: string
  status: 'PENDING' | 'REVIEWED'
  explanation: string
  code: string
  language: string
  feedback?: { trainer: string; trainerInitials: string; reviewedAt: string; text: string }
}

const submissionsMap: Record<string, SubmissionData> = {
  '1': {
    id: 1,
    problem: 'Two Sum',
    problemType: 'DSA',
    problemDescription:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
    problemConstraints: [
      '2 ≤ nums.length ≤ 10⁴',
      '-10⁹ ≤ nums[i] ≤ 10⁹',
      'Only one valid answer exists',
    ],
    problemExamples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
    ],
    problemResourceUrl: 'https://leetcode.com/problems/two-sum/',
    class: 'WeCamp Batch 22',
    submittedAt: 'Sep 10, 2026 at 4:32 PM',
    status: 'REVIEWED',
    explanation:
      'My approach is to use a hash map to store previously seen numbers. For each number, I check if the complement (target - current) already exists in the map. This gives O(n) time complexity.',
    code: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    language: 'Python',
    feedback: {
      trainer: 'Alex Nguyen',
      trainerInitials: 'AN',
      reviewedAt: 'Sep 15, 2026',
      text: 'Great use of hash map for O(n) solution! The code is clean and readable. Consider adding a comment about the time/space complexity trade-off. Well done!',
    },
  },
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <div className="text-sm font-medium text-gray-900">{value}</div>
    </div>
  )
}

export function SubmissionStatus() {
  const { id = '1' } = useParams()
  const navigate = useNavigate()
  const initial = submissionsMap[id] ?? submissionsMap['1']

  const [sub, setSub] = useState(initial)
  const [editMode, setEditMode] = useState(false)
  const [draftExplanation, setDraftExplanation] = useState(sub.explanation)
  const [draftCode, setDraftCode] = useState(sub.code)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleSave = () => {
    setSub((prev) => ({ ...prev, explanation: draftExplanation, code: draftCode }))
    setEditMode(false)
  }

  const handleCancelEdit = () => {
    setDraftExplanation(sub.explanation)
    setDraftCode(sub.code)
    setEditMode(false)
  }

  return (
    <div>
      {/* Back + Breadcrumb */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <Link
          to="/student/submissions"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-accent font-medium transition-colors"
        >
          <ChevronLeft size={15} /> My Submissions
        </Link>
        <span className="text-gray-200">|</span>
        <div className="flex items-center gap-1.5 text-sm text-gray-400 flex-wrap">
          <Link to="/student/submissions" className="hover:text-accent">My Submissions</Link>
          <ChevronRight size={13} className="text-gray-300" />
          <span className="text-gray-700 font-medium">{sub.problem}</span>
        </div>
      </div>

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{sub.problem}</h1>
            <p className="text-sm text-gray-400 mt-0.5">{sub.class} · Submitted {sub.submittedAt}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={sub.status === 'PENDING' ? 'pending' : 'reviewed'}>
            {sub.status === 'PENDING' ? 'Pending Review' : 'Reviewed'}
          </Badge>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-5 items-start">

        {/* LEFT: problem description + my solution */}
        <div className="flex-1 min-w-0 space-y-3">

          {/* Problem description card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50">
              <FileText size={13} className="text-gray-400" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Problem</span>
              <span className="ml-1 text-xs font-bold text-gray-700">{sub.problem}</span>
            </div>
            <div className="px-5 py-4 space-y-3">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{sub.problemDescription}</p>

              {sub.problemConstraints.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1.5">Constraints</p>
                  <ul className="space-y-1">
                    {sub.problemConstraints.map((c, i) => (
                      <li key={i} className="text-xs text-gray-600 flex gap-2">
                        <span className="text-gray-300 flex-shrink-0">•</span>{c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {sub.problemExamples.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1.5">Examples</p>
                  <div className="space-y-1.5">
                    {sub.problemExamples.map((ex, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl px-3 py-2 text-xs font-mono">
                        <p className="text-gray-500">Input: <span className="text-gray-800">{ex.input}</span></p>
                        <p className="text-gray-500">Output: <span className="text-gray-800">{ex.output}</span></p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {sub.problemResourceUrl && (
                <a
                  href={sub.problemResourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                >
                  View on LeetCode <ExternalLink size={11} />
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
            {editMode && (
              <span className="ml-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Editing</span>
            )}
          </div>

          {/* Explanation block */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50">
              <FileText size={13} className="text-gray-400" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Explanation</span>
            </div>
            {editMode ? (
              <div className="p-4">
                <textarea
                  value={draftExplanation}
                  onChange={(e) => setDraftExplanation(e.target.value)}
                  rows={5}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 leading-relaxed focus:outline-none focus:border-accent/60 resize-none"
                />
              </div>
            ) : (
              <div className="px-5 py-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {sub.explanation}
              </div>
            )}
          </div>

          {/* Code block */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700 bg-gray-900">
              <div className="flex items-center gap-2">
                <Code2 size={13} className="text-gray-400" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Code</span>
              </div>
              <span className="text-xs text-gray-500">{sub.language}</span>
            </div>
            {editMode ? (
              <div className="bg-gray-900 p-4">
                <textarea
                  value={draftCode}
                  onChange={(e) => setDraftCode(e.target.value)}
                  rows={14}
                  spellCheck={false}
                  className="w-full bg-gray-800 text-gray-200 font-mono text-sm px-3 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:border-accent/60 resize-none"
                />
              </div>
            ) : (
              <div className="bg-gray-900 p-4 font-mono text-sm overflow-auto">
                {sub.code.split('\n').map((line, i) => (
                  <div key={i} className="flex hover:bg-gray-800/40">
                    <span className="text-gray-600 w-7 flex-shrink-0 text-right mr-4 select-none text-xs leading-6">{i + 1}</span>
                    <span className="text-gray-200 leading-6">{line || ' '}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save / Cancel bar (edit mode) */}
          {editMode && (
            <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between gap-3">
              <p className="text-xs text-gray-400">Changes are saved only when you click Save.</p>
              <div className="flex gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <Button variant="success" onClick={handleSave}>
                  <Check size={14} /> Save Changes
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT sidebar */}
        <div className="w-[300px] flex-shrink-0 space-y-4 sticky top-4">

          {/* Submission info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h3 className="font-semibold text-gray-800 text-sm">Submission Info</h3>
            <InfoRow label="Problem" value={sub.problem} />
            <InfoRow label="Class" value={sub.class} />
            <InfoRow label="Submitted" value={sub.submittedAt} />
            <InfoRow
              label="Status"
              value={
                <div className="flex items-center gap-1.5 mt-0.5">
                  {sub.status === 'REVIEWED' ? (
                    <CheckCircle2 size={13} className="text-green-500" />
                  ) : (
                    <Clock size={13} className="text-yellow-500" />
                  )}
                  <Badge variant={sub.status === 'PENDING' ? 'pending' : 'reviewed'}>
                    {sub.status === 'PENDING' ? 'Pending Review' : 'Reviewed'}
                  </Badge>
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

            {sub.status === 'REVIEWED' && sub.feedback ? (
              <>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-accent text-white text-[10px] flex items-center justify-center font-bold flex-shrink-0">
                    {sub.feedback.trainerInitials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{sub.feedback.trainer}</p>
                    <p className="text-xs text-gray-400">{sub.feedback.reviewedAt}</p>
                  </div>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-sm text-gray-700 leading-relaxed">
                  {sub.feedback.text}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 py-4 text-center">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                  <Clock size={16} className="text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-500">Waiting for feedback</p>
                <p className="text-xs text-gray-400">Your trainer will review your submission and leave feedback here.</p>
              </div>
            )}
          </div>

          {/* Actions — only for PENDING, not during edit */}
          {sub.status === 'PENDING' && !editMode && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Actions</p>
              <button
                onClick={() => setEditMode(true)}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-accent/40 hover:text-accent transition-colors"
              >
                <Pencil size={14} /> Edit Submission
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-red-100 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={14} /> Delete Submission
              </button>
            </div>
          )}

          {sub.status === 'PENDING' && editMode && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <p className="text-xs font-semibold text-amber-700 flex items-center gap-1.5 mb-1">
                <Pencil size={12} /> Editing mode
              </p>
              <p className="text-xs text-amber-600">Update your explanation and code, then click Save Changes.</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                  <Trash2 size={18} className="text-red-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Delete this submission?</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Your submission for <span className="font-medium text-gray-800">"{sub.problem}"</span> will be permanently deleted. You can submit a new one afterward.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => navigate('/student/submissions')}
                  className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
