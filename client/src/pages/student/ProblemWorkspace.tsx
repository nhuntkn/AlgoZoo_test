<<<<<<< HEAD
import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Upload, X, Send, ImageIcon } from 'lucide-react'
import { Badge, StatusDot } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

const problem = {
  id: 1,
  title: 'Two Sum',
  difficulty: 'easy',
  topic: 'Array',
  status: 'not-started',
  leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
  description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
  example: 'Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].',
  constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', '-10⁹ ≤ target ≤ 10⁹', 'Only one valid answer exists.'],
}

export function ProblemWorkspace() {
  const [code, setCode] = useState('// Paste your solution code here after running it successfully on LeetCode\n\nfunction twoSum(nums, target) {\n  \n}')
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)
  const [descTab, setDescTab] = useState<'description' | 'example' | 'constraints'>('description')
  const [submitted, setSubmitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setScreenshot(file)
    const reader = new FileReader()
    reader.onload = (ev) => setScreenshotPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    setScreenshot(file)
    const reader = new FileReader()
    reader.onload = (ev) => setScreenshotPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = () => {
    if (!code.trim() || !screenshot) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <Send size={28} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Submitted!</h2>
        <p className="text-gray-500 mb-6">Your solution has been submitted for Trainer review.</p>
        <div className="flex gap-3">
          <Link to="/student/problems"><Button variant="secondary">Back to Problems</Button></Link>
          <Link to="/student/submissions"><Button>View Submissions</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/student/problems" className="flex items-center gap-1 text-sm text-gray-500 hover:text-accent">
            <ArrowLeft size={14} /> Problems
          </Link>
          <span className="text-gray-300">›</span>
          <span className="font-semibold text-gray-900">{problem.title}</span>
          <Badge variant={problem.difficulty}>{problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}</Badge>
          <Badge variant={problem.topic.toLowerCase().replace(/\s+/g, '-')}>{problem.topic}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <StatusDot status={problem.status} />
          <span className="text-sm text-gray-600 capitalize">{problem.status.replace('-', ' ')}</span>
        </div>
      </div>

      <div className="flex gap-6 min-h-[calc(100vh-200px)]">
        {/* Left — Problem Description */}
        <div className="w-[45%] flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex gap-4 px-5 pt-4 border-b border-gray-200">
            {(['description', 'example', 'constraints'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setDescTab(t)}
                className={`pb-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                  descTab === t ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-auto p-5 text-sm text-gray-700 leading-relaxed">
            {descTab === 'description' && (
              <div className="space-y-3">
                <p style={{ whiteSpace: 'pre-line' }}>{problem.description}</p>
              </div>
            )}
            {descTab === 'example' && (
              <pre className="bg-gray-50 rounded-lg p-4 text-xs font-mono text-gray-800 whitespace-pre-wrap">{problem.example}</pre>
            )}
            {descTab === 'constraints' && (
              <ul className="list-disc list-inside space-y-1">
                {problem.constraints.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            )}
          </div>

          {/* LeetCode link */}
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
            <a
              href={problem.leetcodeUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-accent font-medium hover:underline"
            >
              <ExternalLink size={14} />
              Open on LeetCode to solve &amp; test
            </a>
            <p className="text-xs text-gray-400 mt-1">Solve the problem on LeetCode, then paste your code and screenshot below.</p>
          </div>
        </div>

        {/* Right — Submission Area */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Code input */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col flex-1">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800 text-sm">Your Code</h3>
              <select className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none">
                <option>JavaScript</option>
                <option>Python</option>
                <option>Java</option>
                <option>C++</option>
              </select>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-4 font-mono text-sm bg-gray-900 text-gray-200 resize-none focus:outline-none min-h-[240px]"
              placeholder="Paste your successfully executed code here..."
              spellCheck={false}
            />
          </div>

          {/* Screenshot upload */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">Execution Evidence</h3>
                <p className="text-xs text-gray-400 mt-0.5">Screenshot of your code running successfully on LeetCode</p>
              </div>
              {screenshot && (
                <button
                  onClick={() => { setScreenshot(null); setScreenshotPreview(null) }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {screenshotPreview ? (
              <div className="p-4">
                <img src={screenshotPreview} alt="Evidence screenshot" className="max-h-48 rounded-lg border border-gray-200 object-contain w-full" />
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <ImageIcon size={12} /> {screenshot?.name}
                </p>
              </div>
            ) : (
              <div
                className="p-6 m-4 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-accent/50 hover:bg-accent/5 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <Upload size={24} className="text-gray-300" />
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700">Drop screenshot here or <span className="text-accent">browse</span></p>
                  <p className="text-xs text-gray-400 mt-0.5">PNG, JPG — screenshot of LeetCode showing "Accepted"</p>
                </div>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-5 py-4">
            <div className="text-sm text-gray-500">
              {!code.trim() && <span className="text-red-500">Code is required. </span>}
              {!screenshot && <span className="text-red-500">Screenshot evidence is required. </span>}
              {code.trim() && screenshot && <span className="text-green-600 font-medium">Ready to submit!</span>}
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!code.trim() || !screenshot}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={15} /> Submit for Review
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
=======
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    studentService.getProblem(problemId).then((response) => setDetail(response.data)).catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Unable to load problem')).finally(() => setLoading(false))
  }, [problemId])

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
  return <div><Link to={`/student/classes/${classId}/problems`} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-accent mb-5"><ArrowLeft size={15} /> Back to Problems</Link><div className="grid lg:grid-cols-[1.4fr_1fr] gap-5"><section className="bg-white rounded-2xl shadow-sm p-6"><div className="flex items-center gap-2 mb-3"><TypeBadge type={problemType} /><h1 className="text-2xl font-bold text-gray-900">{problem.title}</h1></div><p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{problem.description || 'No description available.'}</p>{problem.problemUrl && <a href={problem.problemUrl} target="_blank" rel="noreferrer" className="inline-block mt-5 text-sm text-accent hover:underline">Open problem resource</a>}</section><section className="bg-white rounded-2xl shadow-sm p-6"><h2 className="font-bold text-gray-900 mb-1">{submitted ? 'Submission' : 'Submit Solution'}</h2><p className="text-xs text-gray-400 mb-4">Deadline: {detail.deadline ? new Date(detail.deadline).toLocaleString() : 'No deadline'}</p>{submitted ? <div className="rounded-xl bg-green-50 p-4 text-sm text-green-700">Your solution has been submitted. Status: {detail.submission?.status}.</div> : <><select value={language} onChange={(event) => setLanguage(event.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mb-3"><option>Python</option><option>JavaScript</option><option>Java</option><option>C++</option><option>TypeScript</option></select><textarea value={content} onChange={(event) => setContent(event.target.value)} rows={12} placeholder="Write your solution..." className="w-full border border-gray-200 rounded-xl p-3 font-mono text-sm resize-y focus:outline-none focus:border-accent/60" /><input ref={fileInputRef} type="file" accept=".png,.jpg,.jpeg,.gif,.pdf" onChange={(event) => setProofFile(event.target.files?.[0] || null)} className="hidden" /><button type="button" onClick={() => fileInputRef.current?.click()} className="mt-3 w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-500 hover:border-accent/50 hover:text-accent"><FileImage size={16} /> {proofFile ? 'Replace screenshot or file' : 'Add screenshot or solution file'}</button>{proofFile && <div className="mt-2 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600"><span className="truncate">{proofFile.name}</span><button type="button" onClick={() => { setProofFile(null); if (fileInputRef.current) fileInputRef.current.value = '' }}><X size={14} /></button></div>}{problemType === 'DSA' && <p className="mt-2 text-xs text-gray-500">DSA submissions require code plus a screenshot or solution file.</p>}{error && <p className="mt-3 text-sm text-red-600">{error}</p>}<Button onClick={submit} disabled={!content.trim() || submitting || (problemType === 'DSA' && !proofFile)} className="mt-4 w-full justify-center"><Send size={14} /> {submitting ? 'Submitting...' : 'Submit Solution'}</Button></>}</section></div></div>
>>>>>>> d96b4f5600f620774943785cb2d6e27f419a5d6e
}
