import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Clock, Download, FileText, ImageIcon, Loader2, Paperclip } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { studentService } from '../../services/studentService'
import { getFileUrl } from '../../services/fileService'
import type { StudentProblemDetail } from '../../types/classProblem'
import type { SubmissionContentBlock } from '../../types/submission'
import { useEffect, useState } from 'react'

function ContentBlockView({ block }: { block: SubmissionContentBlock }) {
  if (block.type === 'image') {
    const src = block.file_id ? getFileUrl(block.file_id) : undefined
    return (
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <ImageIcon size={13} className="text-gray-400" />
          <span className="text-xs text-gray-500">{block.filename || 'Uploaded image'}</span>
          {src && (
            <a href={src} download={block.filename} className="ml-auto inline-flex items-center gap-1 text-xs text-accent hover:underline">
              <Download size={12} /> Download
            </a>
          )}
        </div>
        {src ? (
          <img src={src} alt={block.filename ?? 'Submitted screenshot'} className="max-w-full max-h-96 rounded-lg" />
        ) : (
          <p className="text-sm text-gray-400">{block.filename || 'Uploaded file'}</p>
        )}
      </div>
    )
  }

  if (block.type === 'file') {
    const src = block.file_id ? getFileUrl(block.file_id) : undefined
    const isPdf = block.filename?.toLowerCase().endsWith('.pdf')
    return (
      <div>
        <div className="p-5 flex items-center gap-3">
          <Paperclip size={15} className="text-gray-400 flex-shrink-0" />
          {src ? (
            <a href={src} download={block.filename} className="text-sm text-accent hover:underline inline-flex items-center gap-1.5">
              {block.filename}
              <Download size={13} />
            </a>
          ) : (
            <span className="text-sm text-gray-700">{block.filename || 'Uploaded file'}</span>
          )}
        </div>
        {src && isPdf && (
          <iframe src={src} title={block.filename ?? 'PDF preview'} className="w-full h-96 border-t border-gray-100" />
        )}
      </div>
    )
  }

  return null
}

export function SubmissionStatus() {
  const { id = '' } = useParams()
  const [detail, setDetail] = useState<StudentProblemDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    studentService.getProblem(id)
      .then((response) => setDetail(response.data))
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Unable to load submission'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="py-16 flex justify-center gap-2 text-sm text-gray-400"><Loader2 size={16} className="animate-spin" /> Loading submission...</div>
  if (error) return <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
  if (!detail || !detail.problem || !detail.submission) return <p className="text-sm text-gray-500">Submission not found.</p>

  const submission = detail.submission
  const reviewed = submission.status === 'review'
  return <div><Link to="/student/submissions" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-accent mb-5"><ArrowLeft size={15} /> My Submissions</Link><div className="flex items-center justify-between mb-6"><div><h1 className="text-2xl font-bold text-gray-900">{detail.problem.title}</h1><p className="text-sm text-gray-400 mt-1">Submitted {new Date(submission.createdAt).toLocaleString()}</p></div><Badge variant={reviewed ? 'reviewed' : 'pending'}>{reviewed ? 'Reviewed' : 'Pending review'}</Badge></div><div className="grid lg:grid-cols-[1.5fr_1fr] gap-5"><section className="bg-white rounded-2xl shadow-sm overflow-hidden"><div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2"><FileText size={14} className="text-gray-400" /><span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Submitted content</span></div>{submission.contentBlocks.map((block, index) => <div key={index} className="border-b border-gray-100 last:border-0">{block.type === 'code' ? <><div className="px-5 py-3 bg-gray-900 text-xs text-gray-400">Code · {block.language || 'unknown'}</div><pre className="bg-gray-900 text-gray-200 p-5 overflow-auto text-sm"><code>{block.content}</code></pre></> : block.type === 'text' ? <p className="p-5 text-sm text-gray-700 whitespace-pre-line">{block.content}</p> : <ContentBlockView block={block} />}</div>)}</section><aside className="space-y-4"><div className="bg-white rounded-2xl shadow-sm p-5"><h2 className="font-bold text-gray-900 mb-4">Submission Info</h2><p className="text-sm text-gray-500">Status</p><div className="flex items-center gap-2 mt-1 text-sm font-medium">{reviewed ? <CheckCircle2 size={15} className="text-green-500" /> : <Clock size={15} className="text-amber-500" />}{reviewed ? 'Reviewed' : 'Pending review'}</div></div><div className="bg-white rounded-2xl shadow-sm p-5"><h2 className="font-bold text-gray-900 mb-3">Trainer Feedback</h2>{reviewed && submission.feedback ? <p className="rounded-xl bg-green-50 p-4 text-sm text-gray-700 whitespace-pre-line">{submission.feedback}</p> : <p className="text-sm text-gray-400">Your trainer has not left feedback yet.</p>}</div></aside></div></div>
}
