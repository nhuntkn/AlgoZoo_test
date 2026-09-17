import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, FileImage, Loader2, Send, X } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { TypeBadge } from '../../components/ui/Badge'
import { studentService } from '../../services/studentService'
import { uploadFile } from '../../services/fileService'
import type { StudentProblemDetail } from '../../types/classProblem'

export function ProblemWorkspace() {
  const { classId = '', problemId = '' } = useParams()
  const navigate = useNavigate()
  const [detail, setDetail] = useState<StudentProblemDetail | null>(null)
  const [content, setContent] = useState('')
  const [language, setLanguage] = useState('Python')
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [proofPreview, setProofPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    studentService.getProblem(problemId).then((response) => setDetail(response.data)).catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Unable to load problem')).finally(() => setLoading(false))
  }, [problemId])

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
      return file && file.type.startsWith('image/') ? URL.createObjectURL(file) : null
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

  const submit = async () => {
    if (!content.trim() || submitting) return
    if (problemType === 'DSA' && !proofFile) {
      setError('DSA submissions require a screenshot or solution file.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const blocks: Array<{ type: 'code' | 'file'; content?: string; language?: string; file_id?: string; filename?: string }> = [{ type: 'code', content, language }]
      if (proofFile) {
        const uploaded = await uploadFile(proofFile)
        blocks.push({ type: 'file' as const, file_id: uploaded.data.file_id, filename: uploaded.data.filename })
      }
      await studentService.createSubmission({ class_problem_id: problemId, content_blocks: blocks })
      navigate(`/student/classes/${classId}/problems`)
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Unable to submit solution') }
    finally { setSubmitting(false) }
  }

  if (loading) return <div className="py-16 flex justify-center gap-2 text-sm text-gray-400"><Loader2 size={16} className="animate-spin" /> Loading problem...</div>
  if (error && !detail) return <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
  if (!detail || !detail.problem) return <p className="text-sm text-gray-500">Problem not found.</p>

  const problem = detail.problem
  const backendProblemType = problem.problemType as string
  const problemType = backendProblemType === 'DB' ? 'Database' : backendProblemType === 'OTHER' ? 'Other' : backendProblemType
  const submitted = Boolean(detail.submission)
  return (
    <div>
      <Link to={`/student/classes/${classId}/problems`} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-accent mb-5">
        <ArrowLeft size={15} /> Back to Problems
      </Link>
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-3">
            <TypeBadge type={problemType} />
            <h1 className="text-2xl font-bold text-gray-900">{problem.title}</h1>
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{problem.description || 'No description available.'}</p>
          {problem.problemUrl && (
            <a href={problem.problemUrl} target="_blank" rel="noreferrer" className="inline-block mt-5 text-sm text-accent hover:underline">
              Open problem resource
            </a>
          )}
        </section>
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-1">{submitted ? 'Submission' : 'Submit Solution'}</h2>
          <p className="text-xs text-gray-400 mb-4">Deadline: {detail.deadline ? new Date(detail.deadline).toLocaleString() : 'No deadline'}</p>
          {submitted ? (
            <div className="rounded-xl bg-green-50 p-4 text-sm text-green-700">Your solution has been submitted. Status: {detail.submission?.status}.</div>
          ) : (
            <>
              <select value={language} onChange={(event) => setLanguage(event.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mb-3">
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
              <input ref={fileInputRef} type="file" accept=".png,.jpg,.jpeg,.gif,.pdf" onChange={handleFileChange} className="hidden" />
              {proofPreview ? (
                <div className="mt-3 relative">
                  <img src={proofPreview} alt="Submission preview" className="w-full max-h-48 rounded-xl border border-gray-200 object-contain bg-gray-50" />
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
              {proofFile && !proofPreview && (
                <div className="mt-2 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
                  <span className="truncate">{proofFile.name}</span>
                  <button type="button" onClick={clearProofFile}><X size={14} /></button>
                </div>
              )}
              {problemType === 'DSA' && <p className="mt-2 text-xs text-gray-500">DSA submissions require code plus a screenshot or solution file.</p>}
              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
              <Button onClick={submit} disabled={!content.trim() || submitting || (problemType === 'DSA' && !proofFile)} className="mt-4 w-full justify-center">
                <Send size={14} /> {submitting ? 'Submitting...' : 'Submit Solution'}
              </Button>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
