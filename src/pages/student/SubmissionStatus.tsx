import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Code2, FileText, CheckCircle2, Clock, Circle } from 'lucide-react'
import { TypeBadge, Badge } from '../../components/ui/Badge'

type SubmissionData = {
  id: number
  problem: string
  problemType: 'DSA' | 'OS' | 'Database' | 'Other'
  class: string
  submittedAt: string
  status: 'PENDING' | 'REVIEWED'
  explanation: string
  code: string
  language: string
  feedback?: { trainer: string; reviewedAt: string; text: string }
}

const submissionsMap: Record<string, SubmissionData> = {
  '1': {
    id: 1,
    problem: 'Two Sum',
    problemType: 'DSA',
    class: 'WeCamp Batch 22',
    submittedAt: 'Sep 10, 2026 at 4:32 PM',
    status: 'REVIEWED',
    explanation: 'My approach is to use a hash map to store previously seen numbers. For each number, I check if the complement (target - current) already exists in the map. This gives O(n) time complexity.',
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
      reviewedAt: 'Sep 15, 2026',
      text: 'Great use of hash map for O(n) solution! The code is clean and readable. Consider adding a comment about the time/space complexity trade-off. Well done!',
    },
  },
  '2': {
    id: 2,
    problem: 'Binary Search',
    problemType: 'DSA',
    class: 'WeCamp Batch 22',
    submittedAt: 'Sep 14, 2026 at 2:15 PM',
    status: 'PENDING',
    explanation: 'I implemented binary search using left/right pointers, narrowing the range until the target is found or the range is empty.',
    code: `def binary_search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
    language: 'Python',
  },
}

type TimelineStep = { label: string; done: boolean; current: boolean }

export function SubmissionStatus() {
  const { id = '1' } = useParams()
  const sub = submissionsMap[id] ?? submissionsMap['1']

  const steps: TimelineStep[] = [
    { label: 'Submitted', done: true, current: false },
    { label: 'Pending Review', done: sub.status === 'REVIEWED', current: sub.status === 'PENDING' },
    { label: 'Reviewed', done: sub.status === 'REVIEWED', current: false },
  ]

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
        <div className="flex items-center gap-1.5 text-sm text-gray-400">
          <Link to="/student/submissions" className="hover:text-accent">My Submissions</Link>
          <ChevronRight size={13} className="text-gray-300" />
          <span className="text-gray-700 font-medium">{sub.problem}</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <TypeBadge type={sub.problemType} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Submission #{sub.id}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{sub.problem} · {sub.class}</p>
        </div>
        <Badge variant={sub.status === 'PENDING' ? 'pending' : 'reviewed'}>
          {sub.status === 'PENDING' ? 'Pending Review' : 'Reviewed'}
        </Badge>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-5">
        <div className="flex items-center gap-0">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  step.done ? 'bg-green-100' : step.current ? 'bg-yellow-100' : 'bg-gray-100'
                }`}>
                  {step.done ? (
                    <CheckCircle2 size={16} className="text-green-600" />
                  ) : step.current ? (
                    <Clock size={16} className="text-yellow-600" />
                  ) : (
                    <Circle size={16} className="text-gray-400" />
                  )}
                </div>
                <p className={`text-xs mt-1.5 font-medium ${
                  step.done ? 'text-green-600' : step.current ? 'text-yellow-600' : 'text-gray-400'
                }`}>
                  {step.label}
                </p>
                {i === 0 && (
                  <p className="text-[10px] text-gray-400">{sub.submittedAt}</p>
                )}
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-5 ${
                  steps[i + 1].done || steps[i + 1].current ? 'bg-green-200' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-5">
        {/* Left: Submission content */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Explanation */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50">
              <FileText size={14} className="text-gray-400" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Explanation</span>
            </div>
            <div className="px-5 py-4 text-sm text-gray-700 leading-relaxed">{sub.explanation}</div>
          </div>

          {/* Code */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700 bg-gray-900">
              <div className="flex items-center gap-2">
                <Code2 size={14} className="text-gray-400" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Code</span>
              </div>
              <span className="text-xs text-gray-500">{sub.language}</span>
            </div>
            <div className="bg-gray-900 p-4 font-mono text-sm overflow-auto">
              {sub.code.split('\n').map((line, i) => (
                <div key={i} className="flex hover:bg-gray-800/50">
                  <span className="text-gray-600 w-8 flex-shrink-0 text-right mr-4 select-none">{i + 1}</span>
                  <span className="text-gray-300">{line}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback (if reviewed) */}
          {sub.status === 'REVIEWED' && sub.feedback && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Trainer Feedback</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold">
                  AN
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{sub.feedback.trainer}</p>
                  <p className="text-xs text-gray-400">{sub.feedback.reviewedAt}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-700 leading-relaxed">{sub.feedback.text}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="w-64 flex-shrink-0 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3 text-sm">
            <h3 className="font-semibold text-gray-800">Submission Info</h3>
            <InfoRow label="Problem" value={sub.problem} />
            <InfoRow label="Class" value={sub.class} />
            <InfoRow label="Submitted" value={sub.submittedAt} />
            <InfoRow label="Status" value={
              <Badge variant={sub.status === 'PENDING' ? 'pending' : 'reviewed'}>
                {sub.status === 'PENDING' ? 'Pending Review' : 'Reviewed'}
              </Badge>
            } />
          </div>

          <Link
            to="/student/submissions"
            className="flex items-center justify-center gap-1 w-full text-sm text-gray-500 hover:text-accent font-medium py-2 transition-colors"
          >
            <ChevronLeft size={14} /> All Submissions
          </Link>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm text-gray-800 font-medium">{value}</p>
    </div>
  )
}
