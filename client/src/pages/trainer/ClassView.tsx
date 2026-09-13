import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronRight, Search, X, Check, Plus } from 'lucide-react'
import { TypeBadge, Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

const classInfo = { id: 1, name: 'WeCamp Batch 21' }

type ProblemType = 'DSA' | 'OS' | 'Database' | 'Other'

const problemTypes: { type: ProblemType; pending: number; total: number }[] = [
  { type: 'DSA', pending: 10, total: 8 },
  { type: 'OS', pending: 5, total: 4 },
  { type: 'Database', pending: 0, total: 3 },
]

type Submission = {
  id: number
  student: string
  initials: string
  problem: string
  status: 'PENDING' | 'REVIEWED'
  submittedAt: string
  sortTs: number
  isLate: boolean
}

const allSubmissions: Record<ProblemType, Submission[]> = {
  DSA: [
    { id: 1, student: 'Alice Nguyen', initials: 'AN', problem: 'Two Sum', status: 'PENDING', submittedAt: 'Sep 10', sortTs: 10, isLate: false },
    { id: 2, student: 'Bob Tran', initials: 'BT', problem: 'Binary Search', status: 'REVIEWED', submittedAt: 'Sep 9', sortTs: 9, isLate: false },
    { id: 3, student: 'Carol Lee', initials: 'CL', problem: 'Two Sum', status: 'PENDING', submittedAt: 'Sep 11', sortTs: 11, isLate: true },
    { id: 4, student: 'Minh Pham', initials: 'MP', problem: 'Binary Search', status: 'PENDING', submittedAt: 'Sep 12', sortTs: 12, isLate: false },
  ],
  OS: [
    { id: 5, student: 'Alice Nguyen', initials: 'AN', problem: 'Process Scheduling', status: 'PENDING', submittedAt: 'Sep 8', sortTs: 8, isLate: false },
    { id: 6, student: 'Bob Tran', initials: 'BT', problem: 'Memory Management', status: 'REVIEWED', submittedAt: 'Sep 7', sortTs: 7, isLate: true },
  ],
  Database: [
    { id: 7, student: 'Carol Lee', initials: 'CL', problem: 'SQL Queries', status: 'REVIEWED', submittedAt: 'Sep 5', sortTs: 5, isLate: false },
  ],
  Other: [],
}

type ProblemBank = { id: number; title: string; type: ProblemType }
const problemBankItems: ProblemBank[] = [
  { id: 1, title: 'Two Sum', type: 'DSA' },
  { id: 2, title: 'Binary Search', type: 'DSA' },
  { id: 3, title: 'Process Scheduling', type: 'OS' },
  { id: 4, title: 'Memory Management', type: 'OS' },
  { id: 5, title: 'SQL Queries', type: 'Database' },
  { id: 6, title: 'Joins & Aggregations', type: 'Database' },
]


export function ClassView() {
  useParams()
  const [selectedType, setSelectedType] = useState<ProblemType | null>(null)
  const [tab, setTab] = useState<'all' | 'pending' | 'reviewed'>('all')
  const [showProblemBank, setShowProblemBank] = useState(false)
  const [bankSearch, setBankSearch] = useState('')
  const [selectedProblem, setSelectedProblem] = useState<number | null>(null)
  const [deadline, setDeadline] = useState('')
  const [added, setAdded] = useState(false)

  const submissions = selectedType ? allSubmissions[selectedType] : []
  const filtered = [...submissions]
    .filter((s) => tab === 'all' ? true : tab === 'pending' ? s.status === 'PENDING' : s.status === 'REVIEWED')
    .sort((a, b) => a.sortTs - b.sortTs)

  const filteredBank = problemBankItems.filter((p) =>
    p.title.toLowerCase().includes(bankSearch.toLowerCase())
  )

  const handleAddToClass = () => {
    if (!selectedProblem) return
    setAdded(true)
    setDeadline('')
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-5 text-sm text-gray-400">
        <Link to="/trainer/dashboard" className="hover:text-accent flex items-center gap-1">
          <ArrowLeft size={14} /> Classes
        </Link>
        {selectedType && (
          <>
            <span>/</span>
            <button onClick={() => setSelectedType(null)} className="hover:text-accent text-gray-700 font-medium">
              {classInfo.name}
            </button>
            <span>/</span>
            <span className="text-gray-700 font-medium">{selectedType}</span>
          </>
        )}
        {!selectedType && (
          <>
            <span>/</span>
            <span className="text-gray-700 font-medium">{classInfo.name}</span>
          </>
        )}
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">{classInfo.name}</h1>

      {/* Type buckets view */}
      {!selectedType && (
        <div className="space-y-3">
          {problemTypes.map(({ type, pending, total }) => (
            <button
              key={type}
              onClick={() => { setSelectedType(type); setTab('all') }}
              className="w-full bg-white rounded-2xl px-6 py-5 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow text-left group"
            >
              <div className="flex items-center gap-3">
                <TypeBadge type={type} />
                <span className="font-semibold text-gray-900">{total} problems assigned</span>
              </div>
              <div className="flex items-center gap-3">
                {pending > 0 ? (
                  <span className="text-sm text-yellow-700 bg-yellow-100 font-semibold px-3 py-1 rounded-full">
                    {pending} pending submissions
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">0 pending</span>
                )}
                <ChevronRight size={16} className="text-gray-400 group-hover:text-accent transition-colors" />
              </div>
            </button>
          ))}

          <button
            onClick={() => setShowProblemBank(true)}
            className="w-full border-2 border-dashed border-gray-200 rounded-2xl px-6 py-4 text-sm text-gray-500 hover:border-accent/40 hover:text-accent hover:bg-accent/5 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add problem from problem bank
          </button>
        </div>
      )}

      {/* Submissions view for a type */}
      {selectedType && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="font-bold text-xl text-gray-900">{selectedType} Submissions</h2>
            <TypeBadge type={selectedType} />
          </div>

          <div className="flex gap-1 mb-4">
            {(['all', 'pending', 'reviewed'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-colors capitalize ${
                  tab === t ? 'bg-accent text-white' : 'bg-white text-gray-500 hover:bg-gray-50 shadow-sm'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-[1fr_200px_140px_100px] border-b border-gray-100 px-6 py-3">
              {['STUDENT', 'PROBLEM', 'SUBMITTED', 'STATUS'].map((h) => (
                <span key={h} className="text-[10px] font-bold text-gray-400 tracking-widest">{h}</span>
              ))}
            </div>
            {filtered.map((s, i) => (
              <div
                key={s.id}
                className={`grid grid-cols-[1fr_200px_140px_100px] items-center px-6 py-4 hover:bg-gray-50 transition-colors ${
                  i < filtered.length - 1 ? 'border-b border-gray-50' : ''
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                    {s.initials}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-900">{s.student}</span>
                    {s.isLate && (
                      <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-medium">Late</span>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-600">{s.problem}</span>
                <span className="text-sm text-gray-400">{s.submittedAt}</span>
                <div className="flex items-center gap-2">
                  <Badge variant={s.status === 'PENDING' ? 'pending' : 'reviewed'}>
                    {s.status === 'PENDING' ? 'Pending' : 'Reviewed'}
                  </Badge>
                  {s.status === 'PENDING' && (
                    <Link to={`/trainer/submissions/${s.id}`}>
                      <button className="text-xs text-accent font-semibold hover:underline">Review</button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="py-10 text-center text-sm text-gray-400">No {tab === 'all' ? '' : tab} submissions</div>
            )}
          </div>
        </div>
      )}

      {/* Add from Problem Bank modal */}
      {showProblemBank && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[500px] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Pick from Problem Bank</h3>
              <button onClick={() => { setShowProblemBank(false); setAdded(false); setSelectedProblem(null) }}>
                <X size={18} className="text-gray-400 hover:text-gray-700" />
              </button>
            </div>

            {added ? (
              <div className="p-8 flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Check size={22} className="text-green-600" />
                </div>
                <p className="font-bold text-gray-900">Problem added to class!</p>
                <Button onClick={() => { setShowProblemBank(false); setAdded(false); setSelectedProblem(null) }}>
                  Done
                </Button>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={bankSearch}
                    onChange={(e) => setBankSearch(e.target.value)}
                    placeholder="Search problems..."
                    className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:border-accent/50"
                  />
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredBank.map((p) => (
                    <label
                      key={p.id}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-colors ${
                        selectedProblem === p.id
                          ? 'border-accent bg-accent/5'
                          : 'border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="problem"
                        checked={selectedProblem === p.id}
                        onChange={() => setSelectedProblem(p.id)}
                        className="accent-accent"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{p.title}</p>
                        <p className="text-xs text-gray-400">Type: {p.type}</p>
                      </div>
                    </label>
                  ))}
                </div>
                  <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Deadline <span className="text-gray-300">(optional)</span></label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:border-accent/60"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <Button variant="secondary" onClick={() => { setShowProblemBank(false); setSelectedProblem(null); setDeadline('') }}>Cancel</Button>
                  <Button onClick={handleAddToClass} disabled={!selectedProblem}>Add to Class</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
