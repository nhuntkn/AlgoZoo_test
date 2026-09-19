import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  CheckCircle2, ChevronLeft, ChevronRight, Clock,
  Code2, Eye, ExternalLink, FileImage, FileText, Loader2, MessageSquare, Play, Send, Terminal, X,
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { CodeEditor } from '../../components/ui/CodeEditor'
import { TraceVisualizer } from '../../components/problem/TraceVisualizer'
import { useAuth } from '../../hooks/useAuth'
import { studentService } from '../../services/studentService'
import { executionService } from '../../services/executionService'
import { uploadFile } from '../../services/fileService'
import type { StudentProblemDetail } from '../../types/classProblem'
import type { RunCodeResult, TraceResult } from '../../types/execution'

const MONACO_LANGUAGE_MAP: Record<string, string> = {
  Python: 'python',
  JavaScript: 'javascript',
  Java: 'java',
  'C++': 'cpp',
  TypeScript: 'typescript',
}

const VISUALIZABLE_LANGUAGES = ['Python', 'JavaScript']

export function ProblemWorkspace() {
  const { classId = '', problemId = '' } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [detail, setDetail] = useState<StudentProblemDetail | null>(null)
  const [className, setClassName] = useState('')
  const [content, setContent] = useState('')
  const [language, setLanguage] = useState('Python')
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [proofPreview, setProofPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [running, setRunning] = useState(false)
  const [runResult, setRunResult] = useState<RunCodeResult | null>(null)
  const [runError, setRunError] = useState('')
  const [lastSuccessfulRun, setLastSuccessfulRun] = useState<{ code: string; language: string } | null>(null)
  const [visualizing, setVisualizing] = useState(false)
  const [traceResult, setTraceResult] = useState<TraceResult | null>(null)
  const [tracedCode, setTracedCode] = useState<string | null>(null)
  const [traceError, setTraceError] = useState('')

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

  // Preview is a blob URL, not a data URL — needs revoking whenever it's replaced or the component unmounts.
  useEffect(() => {
    return () => {
      if (proofPreview) URL.revokeObjectURL(proofPreview)
    }
  }, [proofPreview])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setProofFile(file)
    setProofPreview((previous) => {
      if (previous) URL.revokeObjectURL(previous)
      return file ? URL.createObjectURL(file) : null
    })
  }

  const clearProofFile = () => {
    setProofFile(null)
    setProofPreview((previous) => {
      if (previous) URL.revokeObjectURL(previous)
      return null
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleRun = async () => {
    if (!content.trim() || running) return
    setRunning(true)
    setRunError('')
    setRunResult(null)
    try {
      const response = await executionService.run({ language, code: content })
      setRunResult(response.data)
      const succeeded = response.data.exitCode === 0 && !response.data.stderr && !response.data.compile?.stderr
      setLastSuccessfulRun(succeeded ? { code: content, language } : null)
    } catch (requestError) {
      setRunError(requestError instanceof Error ? requestError.message : 'Unable to run code')
      setLastSuccessfulRun(null)
    } finally {
      setRunning(false)
    }
  }

  const canVisualize = VISUALIZABLE_LANGUAGES.includes(language) && lastSuccessfulRun?.code === content && lastSuccessfulRun?.language === language

  const handleVisualize = async () => {
    if (!canVisualize || visualizing) return
    setVisualizing(true)
    setTraceError('')
    try {
      const response = await executionService.trace({ code: content, language })
      setTraceResult(response.data)
      setTracedCode(content)
    } catch (requestError) {
      setTraceError(requestError instanceof Error ? requestError.message : 'Unable to visualize code')
    } finally {
      setVisualizing(false)
    }
  }

  const submit = async () => {
    if (!content.trim() || submitting) return
    if (problemType === 'DSA' && !proofFile) {
      setError('DSA submissions require a screenshot or solution file.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const blocks: Array<{ type: 'code' | 'image' | 'file'; content?: string; language?: string; file_id?: string; filename?: string }> = [
        { type: 'code', content, language },
      ]
      if (proofFile) {
        const uploaded = await uploadFile(proofFile)
        const blockType = proofFile.type.startsWith('image/') ? 'image' : 'file'
        blocks.push({ type: blockType, file_id: uploaded.data.file_id, filename: uploaded.data.filename })
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
      <div className="space-y-5">
        {/* Problem card - full width */}
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

        {submitted && submission ? (
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-5">
            {/* My Solution */}
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

            {/* Submission Info + Feedback */}
            <div className="space-y-4">
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
            </div>
          </div>
        ) : (
          /* Submit Solution form - full width */
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
              <CodeEditor
                value={content}
                onChange={setContent}
                language={MONACO_LANGUAGE_MAP[language] || 'plaintext'}
              />
              <div className="flex items-center gap-2 mt-3">
                <Button type="button" variant="secondary" size="sm" onClick={handleRun} disabled={!content.trim() || running}>
                  {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                  {running ? 'Running...' : 'Run Code'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleVisualize}
                  disabled={!canVisualize || visualizing}
                  title={
                    !VISUALIZABLE_LANGUAGES.includes(language)
                      ? `Visualization is available for ${VISUALIZABLE_LANGUAGES.join(' and ')} only`
                      : !canVisualize
                        ? 'Run your code successfully first'
                        : undefined
                  }
                >
                  {visualizing ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />}
                  {visualizing ? 'Visualizing...' : 'Visualize'}
                </Button>
              </div>
              {!VISUALIZABLE_LANGUAGES.includes(language) && (
                <p className="mt-2 text-xs text-gray-400">Step-by-step visualization is available for {VISUALIZABLE_LANGUAGES.join(' and ')} only, for now.</p>
              )}
              {runError && <p className="mt-2 text-sm text-red-600">{runError}</p>}
              {runResult && (
                <div className="mt-3 rounded-xl overflow-hidden bg-[#1e1e2e] text-sm font-mono">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
                    <div className="flex items-center gap-1.5">
                      <Terminal size={13} className="text-gray-400" />
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Output</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {runResult.language} {runResult.version} · exit {runResult.exitCode ?? '—'}
                    </span>
                  </div>
                  {runResult.compile?.stderr && (
                    <pre className="px-4 pt-3 text-amber-300 whitespace-pre-wrap break-words">{runResult.compile.stderr}</pre>
                  )}
                  <pre className="px-4 py-3 text-gray-100 whitespace-pre-wrap break-words">
                    {runResult.stdout || <span className="text-gray-500">(no output)</span>}
                  </pre>
                  {runResult.stderr && (
                    <pre className="px-4 pb-3 text-red-400 whitespace-pre-wrap break-words">{runResult.stderr}</pre>
                  )}
                </div>
              )}
              {traceError && <p className="mt-3 text-sm text-red-600">{traceError}</p>}
              {traceResult && tracedCode === content && (
                <div className="mt-3">
                  <TraceVisualizer code={content} trace={traceResult} language={language} />
                </div>
              )}
              <input ref={fileInputRef} type="file" accept=".png,.jpg,.jpeg,.gif,.pdf" onChange={handleFileChange} className="hidden" />
              {proofPreview ? (
                <div className="mt-3 relative">
                  {proofFile?.type === 'application/pdf' ? (
                    <iframe src={proofPreview} title="PDF preview" className="w-full h-64 rounded-xl border border-gray-200 bg-gray-50" />
                  ) : (
                    <img src={proofPreview} alt="Submission preview" className="w-full max-h-48 rounded-xl border border-gray-200 object-contain bg-gray-50" />
                  )}
                  <button
                    type="button"
                    onClick={clearProofFile}
                    className="absolute top-2 right-2 bg-white/90 rounded-full p-1 text-gray-500 hover:text-gray-800 shadow-sm"
                  >
                    <X size={14} />
                  </button>
                  <p className="mt-1 text-xs text-gray-500 truncate">{proofFile?.name}</p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-500 hover:border-accent/50 hover:text-accent"
                >
                  <FileImage size={16} /> {proofFile ? 'Replace screenshot or file' : 'Add screenshot or solution file'}
                </button>
              )}
              {problemType === 'DSA' && <p className="mt-2 text-xs text-gray-500">DSA submissions require code plus a screenshot or solution file.</p>}
              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
              <Button onClick={submit} disabled={!content.trim() || submitting || (problemType === 'DSA' && !proofFile)} className="mt-4 w-full justify-center">
                <Send size={14} /> {submitting ? 'Submitting...' : 'Submit Solution'}
              </Button>
            </div>
        )}
      </div>
    </div>
  )
}
