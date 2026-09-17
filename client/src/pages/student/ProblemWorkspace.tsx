import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  CheckCircle2, ChevronLeft, ChevronRight, Clock,
  Code2, ExternalLink, FileImage, FileText, Loader2, MessageSquare, Send, X,
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { studentService } from '../../services/studentService'
import { uploadFile } from '../../services/fileService'
import type { StudentProblemDetail } from '../../types/classProblem'

export function ProblemWorkspace() {
  const { classId = '', problemId = '' } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [detail, setDetail] = useState<StudentProblemDetail | null>(null)
  const [className, setClassName] = useState('')
  const [content, setContent] = useState('')
  const [language, setLanguage] = useState('Python')
  const [proofFile, setProofFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    studentService.getProblem(problemId)
      .then((response) => setDetail(response.data))
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Unable to load problem'))
      .finally(() => setLoading(false))

    studentService.getClasses()
      .then((response) => {
        const current = response.data.find((c) => c.classId === classId)
        if (current) setClassName(current.name)
      })
      .catch(() => {})
  }, [problemId, classId])

  const submit = async () => {
    if (!content.trim() || submitting) return
    if (problemType === 'DSA' && !proofFile) {
      setError('DSA submissions require a screenshot or solution file.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const blocks: Array<{ type: 'code' | 'file'; content?: string; language?: string; file_id?: string; filename?: string }> = [
        { type: 'code', content, language },
      ]
      if (proofFile) {
        const uploaded = await uploadFile(proofFile)
        blocks.push({ type: 'file' as const, file_id: uploaded.data.file_id, filename: uploaded.data.filename })
      }
      await studentService.createSubmission({ class_problem_id: problemId, content_blocks: blocks })
      navigate(`/student/classes/${classId}/problems`)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to submit solution')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="py-16 flex justify-center gap-2 text-sm text-gray-400"><Loader2 size={16} className="animate-spin" /> Loading problem...</div>
  if (error && !detail) return <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
  if (!detail || !detail.problem) return <p className="text-sm text-gray-500">Problem not found.</p>

  const problem = detail.problem
  const rawType = problem.problemType as string
  const problemType = rawType === 'DB' ? 'Database' : rawType === 'OTHER' ? 'Other' : rawType
  const submitted = Boolean(detail.submission)
  const submission = detail.submission

  const formatSubmitDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return (
      d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' at ' +
      d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    )
  }

  const formatShortDate = (dateStr: string | null) =>
    dateStr ? new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <Link
          to={`/student/classes/${classId}/problems`}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-accent font-medium transition-colors"
        >
          <ChevronLeft size={15} /> Back to Problems
        </Link>
        <span className="text-gray-200 text-sm">|</span>
        <div className="flex items-center gap-1.5 text-sm text-gray-400 flex-wrap">
          <Link to="/student/classes" className="hover:text-accent transition-colors">My Classes</Link>
          {className && (
            <>
              <ChevronRight size={13} className="text-gray-300 flex-shrink-0" />
              <span className="text-gray-700 font-medium">{className}</span>
            </>
          )}
          <ChevronRight size={13} className="text-gray-300 flex-shrink-0" />
          <Link to={`/student/classes/${classId}/problems`} className="hover:text-accent transition-colors">Problems</Link>
          <ChevronRight size={13} className="text-gray-300 flex-shrink-0" />
          <span className="text-gray-700 font-medium">{problem.title}</span>
        </div>
      </div>

      {/* Page title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{problem.title}</h1>

      {/* Main layout */}
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_300px] gap-5">
        {/* Left: problem card + my solution */}
        <div className="space-y-4">
          {/* Problem card */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={13} className="text-gray-400 flex-shrink-0" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Problem</span>
              <span className="text-sm font-semibold text-gray-700">{problem.title}</span>
            </div>
            <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {problem.description || 'No description available.'}
            </div>
            {problem.problemUrl && (
              <a
                href={problem.problemUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 mt-5 text-sm text-accent hover:underline"
              >
                View resource <ExternalLink size={13} />
              </a>
            )}
          </div>

          {/* My Solution (when submitted) */}
          {submitted && submission && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {user?.initials || 'ME'}
                </div>
                <span className="font-semibold text-gray-900">My Solution</span>
                <span className="ml-auto inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full font-medium">
                  <CheckCircle2 size={11} /> Submitted
                </span>
              </div>
              {submission.contentBlocks.map((block, i) => (
                <div key={i}>
                  {block.type === 'text' && (
                    <div className="px-5 py-4 border-b border-gray-50 last:border-b-0">
                      <div className="flex items-center gap-1.5 mb-3">
                        <FileText size={13} className="text-gray-400" />
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Text</span>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{block.content}</p>
                    </div>
                  )}
                  {block.type === 'code' && (
                    <div className="mx-4 my-4 rounded-xl overflow-hidden bg-[#1e1e2e]">
                      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
                        <div className="flex items-center gap-1.5">
                          <Code2 size={13} className="text-gray-400" />
                          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Code</span>
                        </div>
                        {block.language && <span className="text-xs text-gray-400">{block.language}</span>}
                      </div>
                      <pre className="px-4 py-4 text-sm text-gray-100 overflow-x-auto font-mono leading-relaxed">{block.content}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {submitted && submission ? (
            <>
              {/* Submission Info */}
              <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4 text-sm">
                <h3 className="font-semibold text-gray-900">Submission Info</h3>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Problem</p>
                  <p className="font-medium text-gray-900">{problem.title}</p>
                </div>
                {className && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Class</p>
                    <p className="font-medium text-gray-900">{className}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Submitted</p>
                  <p className="font-medium text-gray-900">{formatSubmitDate(submission.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Status</p>
                  {detail.status === 'Reviewed' ? (
                    <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                      <CheckCircle2 size={13} /> Reviewed
                    </span>
                  ) : detail.status === 'Pending' ? (
                    <span className="inline-flex items-center gap-1 text-amber-500 font-medium">
                      <Clock size={13} /> Pending review
                    </span>
                  ) : detail.status === 'Late' ? (
                    <span className="inline-flex items-center gap-1 text-orange-500 font-medium">
                      <Clock size={13} /> Late
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </div>
              </div>

              {/* Trainer Feedback */}
              {submission.feedback && (
                <div className="bg-white rounded-2xl shadow-sm p-5 text-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare size={14} className="text-gray-400 flex-shrink-0" />
                    <h3 className="font-semibold text-gray-900">Trainer Feedback</h3>
                  </div>
                  {submission.reviewedBy && (
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {submission.reviewedBy.fullname
                          .split(' ')
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((n) => n[0]?.toUpperCase() || '')
                          .join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{submission.reviewedBy.fullname}</p>
                        <p className="text-xs text-gray-400">{formatShortDate(submission.reviewedAt)}</p>
                      </div>
                    </div>
                  )}
                  <p className="text-gray-700 leading-relaxed">{submission.feedback}</p>
                </div>
              )}
            </>
          ) : (
            /* Submit Solution form */
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-gray-900 mb-1">Submit Solution</h2>
              <p className="text-xs text-gray-400 mb-4">
                Deadline: {detail.deadline ? new Date(detail.deadline).toLocaleString() : 'No deadline'}
              </p>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mb-3"
              >
                <option>Python</option>
                <option>JavaScript</option>
                <option>Java</option>
                <option>C++</option>
                <option>TypeScript</option>
              </select>
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                rows={12}
                placeholder="Write your solution..."
                className="w-full border border-gray-200 rounded-xl p-3 font-mono text-sm resize-y focus:outline-none focus:border-accent/60"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.gif,.pdf"
                onChange={(event) => setProofFile(event.target.files?.[0] || null)}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-500 hover:border-accent/50 hover:text-accent"
              >
                <FileImage size={16} /> {proofFile ? 'Replace screenshot or file' : 'Add screenshot or solution file'}
              </button>
              {proofFile && (
                <div className="mt-2 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
                  <span className="truncate">{proofFile.name}</span>
                  <button type="button" onClick={() => { setProofFile(null); if (fileInputRef.current) fileInputRef.current.value = '' }}>
                    <X size={14} />
                  </button>
                </div>
              )}
              {problemType === 'DSA' && (
                <p className="mt-2 text-xs text-gray-500">DSA submissions require code plus a screenshot or solution file.</p>
              )}
              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
              <Button
                onClick={submit}
                disabled={!content.trim() || submitting || (problemType === 'DSA' && !proofFile)}
                className="mt-4 w-full justify-center"
              >
                <Send size={14} /> {submitting ? 'Submitting...' : 'Submit Solution'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
