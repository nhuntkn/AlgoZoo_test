import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ExternalLink, FileText, Code2, Image, CheckCircle2 } from 'lucide-react'
import {
  getTrainerClassById,
  getTrainerSubmissionById,
  markSubmissionReviewed,
  type TrainerClass,
  type TrainerClassSubmission,
} from '../../../utils/trainerStore'

// Avatar color palette
const AVATAR_COLORS = [
  'bg-amber-500',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-rose-500',
  'bg-violet-500',
  'bg-cyan-500',
  'bg-orange-500',
  'bg-teal-500',
]

function getAvatarColor(initials: string) {
  let hash = 0
  for (let i = 0; i < initials.length; i++) {
    hash = initials.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function getSubjectBadgeStyle(subj: string) {
  switch (subj) {
    case 'DSA':
      return 'bg-sky-50 text-sky-600'
    case 'OS':
      return 'bg-emerald-50 text-emerald-600'
    case 'Database':
      return 'bg-amber-50 text-amber-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

export function TrainerSubmissionDetail() {
  const { classId = 'wecamp-21', submissionId = '' } = useParams<{
    classId: string
    submissionId: string
  }>()

  const [cls, setCls] = useState<TrainerClass | null>(null)
  const [submission, setSubmission] = useState<TrainerClassSubmission | null>(null)
  const [feedback, setFeedback] = useState('')
  const [isReviewed, setIsReviewed] = useState(false)

  useEffect(() => {
    const found = getTrainerClassById(classId)
    if (found) setCls(found)

    const sub = getTrainerSubmissionById(submissionId)
    if (sub) {
      setSubmission(sub)
      setFeedback(sub.feedback || '')
      setIsReviewed(sub.status === 'reviewed')
    }
  }, [classId, submissionId])

  if (!cls || !submission) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm max-w-2xl mx-auto">
        <p className="text-gray-500 font-medium mb-3">Submission not found.</p>
        <Link
          to={`/trainer/classes/${classId}/submissions`}
          className="text-sm text-accent font-semibold hover:underline"
        >
          ← Back to Submissions
        </Link>
      </div>
    )
  }

  const handleMarkReviewed = () => {
    const updated = markSubmissionReviewed(submission.id, feedback)
    if (updated) {
      setSubmission(updated)
      setIsReviewed(true)
    }
  }

  const crumbs = [
    { label: 'My Classes', to: '/trainer/classes' },
    { label: cls.name, to: `/trainer/classes/${cls.id}/overview` },
    { label: 'Submissions', to: `/trainer/classes/${cls.id}/submissions` },
    { label: submission.studentName },
  ]

  // Render code with line numbers
  const codeLines = submission.code.split('\n')

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-1.5 text-xs sm:text-sm mb-4 flex-wrap">
        <Link
          to={`/trainer/classes/${cls.id}/submissions`}
          className="flex items-center gap-1 text-gray-400 hover:text-accent font-medium transition-colors"
        >
          <ChevronLeft size={15} />
          Back to Submissions
        </Link>
        <span className="text-gray-300 mx-1">|</span>
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={13} className="text-gray-300" />}
            {c.to ? (
              <Link
                to={c.to}
                className="text-gray-400 hover:text-accent font-medium transition-colors"
              >
                {c.label}
              </Link>
            ) : (
              <span className="text-gray-700 font-medium">{c.label}</span>
            )}
          </span>
        ))}
      </div>

      {/* ── Student Header ── */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
        >
          {submission.studentInitials}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{submission.studentName}</h1>
          <p className="text-sm text-gray-400">
            {submission.problemTitle} · Submitted {submission.submittedFull}
          </p>
        </div>
      </div>

      {/* ── Two-column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left Column (2/3) — Main Content ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Problem Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Problem Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-50">
              <div className="flex items-center gap-2.5">
                <FileText size={16} className="text-gray-400" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  PROBLEM
                </span>
                <span className="text-sm font-bold text-gray-900 ml-1">
                  {submission.problemTitle}
                </span>
              </div>
              <span
                className={`text-xs px-2.5 py-0.5 rounded font-bold uppercase ${getSubjectBadgeStyle(
                  submission.subject
                )}`}
              >
                {submission.subject}
              </span>
            </div>

            {/* Problem Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Description */}
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {submission.problemDescription}
              </div>

              {/* Constraints */}
              {submission.problemConstraints.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2">Constraints</h4>
                  <ul className="space-y-1">
                    {submission.problemConstraints.map((c, i) => (
                      <li key={i} className="text-sm text-gray-600 pl-4 relative">
                        <span className="absolute left-0 text-gray-400">•</span>
                        <code className="bg-gray-50 px-1.5 py-0.5 rounded text-xs font-mono text-gray-700">
                          {c}
                        </code>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Examples */}
              {submission.problemExamples.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2">Examples</h4>
                  <div className="space-y-3">
                    {submission.problemExamples.map((ex, i) => (
                      <div
                        key={i}
                        className="bg-gray-50 rounded-xl p-4 font-mono text-xs text-gray-700 space-y-1 border border-gray-100"
                      >
                        <p>{ex.input}</p>
                        <p>{ex.output}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resource Link */}
              <a
                href={submission.resourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-accent font-semibold hover:underline"
              >
                View on LeetCode
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* ── Student's Submission ── */}
          <div className="flex items-center gap-3 mt-2">
            <div
              className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            >
              {submission.studentInitials}
            </div>
            <h2 className="text-base font-bold text-gray-900">Student's Submission</h2>
          </div>

          {/* Explanation */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-3 border-b border-gray-50 flex items-center gap-2">
              <FileText size={15} className="text-gray-400" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                EXPLANATION
              </span>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-gray-700 leading-relaxed">
                {submission.explanation}
              </p>
            </div>
          </div>

          {/* Code */}
          <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-800">
            {/* Code Header */}
            <div className="bg-gray-800 px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 size={15} className="text-gray-400" />
                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  {'</>'} CODE
                </span>
              </div>
              <span className="text-xs text-gray-400 font-medium">
                {submission.language}
              </span>
            </div>

            {/* Code Body */}
            <div className="bg-gray-900 p-5 overflow-x-auto">
              <table className="w-full text-left">
                <tbody>
                  {codeLines.map((line, i) => (
                    <tr key={i} className="leading-relaxed">
                      <td className="pr-4 text-right text-gray-500 select-none font-mono text-xs w-8 align-top">
                        {i + 1}
                      </td>
                      <td className="font-mono text-sm text-emerald-300 whitespace-pre">
                        {renderPythonSyntax(line)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Screenshot */}
          {submission.screenshotFile && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-3 border-b border-gray-50 flex items-center gap-2">
                <Image size={15} className="text-gray-400" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  SCREENSHOT
                </span>
                <span className="text-xs text-gray-400 ml-1">
                  {submission.screenshotFile}
                </span>
              </div>
              <div className="p-6 flex items-center justify-center">
                <div className="w-full max-w-md h-40 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                  <Image size={32} className="mb-2 text-gray-300" />
                  <span className="text-xs font-medium">{submission.screenshotFile}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Right Column (1/3) — Sidebar ── */}
        <div className="space-y-6">
          {/* Submission Info Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-base font-bold text-gray-900 mb-5">Submission Info</h3>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 font-medium mb-0.5">Student</p>
                <p className="text-sm font-bold text-gray-900">
                  {submission.studentName}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-0.5">Problem</p>
                <p className="text-sm font-bold text-gray-900">
                  {submission.problemTitle}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-0.5">Class</p>
                <p className="text-sm font-bold text-gray-900">{cls.name}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-0.5">Submitted</p>
                <p className="text-sm font-bold text-gray-900">
                  {submission.submittedFull}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-0.5">Status</p>
                {isReviewed ? (
                  <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-sm">
                    <CheckCircle2 size={15} />
                    Reviewed
                  </div>
                ) : (
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-amber-50 text-amber-600 border border-amber-200/60">
                    Pending
                  </span>
                )}
              </div>

              <div>
                <p className="text-xs text-gray-400 font-medium mb-0.5">Resource</p>
                <a
                  href={submission.resourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-accent font-medium hover:underline break-all"
                >
                  {submission.resourceUrl}
                </a>
              </div>
            </div>
          </div>

          {/* Feedback Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">Feedback</h3>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              disabled={isReviewed}
              placeholder={`Write feedback for ${submission.studentName}...`}
              className={`w-full min-h-[120px] rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-accent resize-none transition-colors ${
                isReviewed ? 'bg-gray-50 cursor-default' : 'bg-white'
              }`}
            />

            {!isReviewed && (
              <>
                <div className="text-xs text-gray-400 mt-2 mb-4 px-1 space-y-0.5">
                  <p>Examples:</p>
                  <p>- Great approach using hash map</p>
                  <p>- Check edge case: empty array</p>
                  <p>- Clean, readable code</p>
                </div>

                <button
                  onClick={handleMarkReviewed}
                  className="w-full py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent/90 shadow-sm shadow-red-200 transition-all"
                >
                  Mark as Reviewed
                </button>

                <p className="text-xs text-gray-400 text-center mt-2.5">
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

// Simple Python-like syntax highlighting (matching the dark theme in the mockup)
function renderPythonSyntax(line: string): React.ReactNode {
  // Keywords
  const keywords = [
    'def', 'return', 'for', 'in', 'if', 'else', 'elif', 'while', 'import',
    'from', 'class', 'True', 'False', 'None', 'and', 'or', 'not', 'is',
  ]

  const parts: React.ReactNode[] = []
  let remaining = line
  let keyIdx = 0

  // Simple tokenizer: split by word boundaries
  const regex = /(\b\w+\b|[^\w]+)/g
  let match: RegExpExecArray | null

  while ((match = regex.exec(remaining)) !== null) {
    const token = match[0]
    const isKeyword = keywords.includes(token)
    const isNumber = /^\d+$/.test(token)
    const isString = /^['"].*['"]$/.test(token)

    if (isKeyword) {
      parts.push(
        <span key={keyIdx++} className="text-pink-400 font-medium">
          {token}
        </span>
      )
    } else if (isNumber) {
      parts.push(
        <span key={keyIdx++} className="text-amber-300">
          {token}
        </span>
      )
    } else if (isString) {
      parts.push(
        <span key={keyIdx++} className="text-green-300">
          {token}
        </span>
      )
    } else if (token === '(' || token === ')' || token === '[' || token === ']' || token === '{' || token === '}') {
      parts.push(
        <span key={keyIdx++} className="text-sky-300">
          {token}
        </span>
      )
    } else if (token === ':' || token === ',' || token === '=' || token === '+' || token === '-' || token === '*' || token === '/') {
      parts.push(
        <span key={keyIdx++} className="text-gray-300">
          {token}
        </span>
      )
    } else {
      parts.push(
        <span key={keyIdx++} className="text-emerald-300">
          {token}
        </span>
      )
    }
  }

  return <>{parts}</>
}
