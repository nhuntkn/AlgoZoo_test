import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Inbox, Loader2 } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { studentService } from '../../services/studentService'
import type { RecentSubmission } from '../../types/studentDashboard'

export function StudentSubmissions() {
  const [items, setItems] = useState<RecentSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const classes = (await studentService.getClasses()).data
        const dashboards = await Promise.all(classes.map(async (item) => { try { return (await studentService.getDashboard(item.classId)).data.recentSubmissions } catch { return [] } }))
        setItems(dashboards.flat())
      } catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Unable to load submissions') }
      finally { setLoading(false) }
    }
    void load()
  }, [])

  return <div><div className="mb-7"><p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Student</p><h1 className="text-2xl font-bold text-gray-900">My Submissions</h1></div>{error && <p className="mb-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}{loading ? <div className="py-16 flex justify-center gap-2 text-sm text-gray-400"><Loader2 size={16} className="animate-spin" /> Loading submissions...</div> : items.length === 0 ? <div className="flex flex-col items-center py-24 text-center"><Inbox size={48} className="text-gray-300 mb-4" /><h3 className="text-lg font-semibold text-gray-700">No submissions yet</h3><p className="text-sm text-gray-500">Submit a solution from an assigned problem to see it here.</p></div> : <div className="bg-white rounded-2xl shadow-sm overflow-hidden"><div className="grid grid-cols-[1fr_1fr_120px_140px] px-6 py-3 border-b border-gray-100 text-[10px] font-bold text-gray-400 tracking-widest"><span>PROBLEM</span><span>CLASS</span><span>STATUS</span><span>SUBMITTED</span></div>{items.map((item) => <Link key={item.submissionId} to={`/student/submissions/${item.classProblemId}`} className="grid grid-cols-[1fr_1fr_120px_140px] items-center px-6 py-4 border-b border-gray-50 hover:bg-gray-50"><span className="text-sm font-semibold text-gray-900">{item.title}</span><span className="text-sm text-gray-500">{item.className}</span><Badge variant={item.status === 'Reviewed' ? 'reviewed' : item.status === 'Late' ? 'late' : 'pending'}>{item.status}</Badge><span className="text-sm text-gray-400">{new Date(item.submittedAt).toLocaleDateString()}</span></Link>)}</div>}</div>
}
