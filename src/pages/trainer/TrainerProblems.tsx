import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, X, CheckCircle2, ChevronLeft } from 'lucide-react'
import { TypeBadge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

type ProblemType = 'DSA' | 'OS' | 'Database' | 'Other'

type Problem = {
  id: number
  title: string
  type: ProblemType
  description: string
  resource_url: string
}

export const problemBank: Problem[] = [
  { id: 1, title: 'Two Sum', type: 'DSA', description: 'Given an array of integers and a target, return indices of the two numbers that add up to the target.', resource_url: 'https://leetcode.com/problems/two-sum/' },
  { id: 2, title: 'Binary Search', type: 'DSA', description: 'Implement binary search on a sorted array.', resource_url: 'https://leetcode.com/problems/binary-search/' },
  { id: 3, title: 'Reverse Linked List', type: 'DSA', description: 'Reverse a singly linked list.', resource_url: 'https://leetcode.com/problems/reverse-linked-list/' },
  { id: 4, title: 'Binary Tree Level Order Traversal', type: 'DSA', description: 'Return the level order traversal of a binary tree\'s nodes.', resource_url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
  { id: 5, title: 'Course Schedule', type: 'DSA', description: 'Determine if you can finish all courses given prerequisites.', resource_url: 'https://leetcode.com/problems/course-schedule/' },
  { id: 6, title: 'Process Scheduling', type: 'OS', description: 'Implement and compare FCFS, SJF, and Round Robin scheduling algorithms.', resource_url: '' },
  { id: 7, title: 'Memory Management', type: 'OS', description: 'Understand paging and segmentation concepts in OS memory management.', resource_url: '' },
  { id: 8, title: 'Deadlock Detection', type: 'OS', description: 'Implement Banker\'s algorithm for deadlock avoidance.', resource_url: '' },
  { id: 9, title: 'SQL Queries', type: 'Database', description: 'Write SQL queries to solve common database problems using SELECT, JOIN, and aggregation.', resource_url: '' },
  { id: 10, title: 'Joins & Aggregations', type: 'Database', description: 'Practice complex JOIN operations and aggregation functions in SQL.', resource_url: '' },
  { id: 11, title: 'Database Normalization', type: 'Database', description: 'Normalize a given database schema to 3NF.', resource_url: '' },
]

export function TrainerProblems() {
  const navigate = useNavigate()
  const [problems, setProblems] = useState<Problem[]>(problemBank)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | ProblemType>('all')
  const [detail, setDetail] = useState<Problem | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ title: '', type: 'DSA' as ProblemType, description: '', resource_url: '' })
  const [createDone, setCreateDone] = useState(false)

  const filtered = problems.filter((p) => {
    const q = search.toLowerCase()
    const matchSearch = p.title.toLowerCase().includes(q)
    const matchType = typeFilter === 'all' || p.type === typeFilter
    return matchSearch && matchType
  })

  const handleCreate = () => {
    if (!form.title.trim()) return
    const newProblem: Problem = {
      id: Date.now(),
      title: form.title.trim(),
      type: form.type,
      description: form.description.trim(),
      resource_url: form.resource_url.trim(),
    }
    setProblems((prev) => [newProblem, ...prev])
    setCreateDone(true)
  }

  const closeCreate = () => {
    setShowCreate(false)
    setForm({ title: '', type: 'DSA', description: '', resource_url: '' })
    setCreateDone(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-accent font-medium transition-colors mb-2"
          >
            <ChevronLeft size={15} /> Back
          </button>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Problem Bank</p>
          <h1 className="text-2xl font-bold text-gray-900">Problems</h1>
          <p className="text-sm text-gray-400 mt-0.5">{problems.length} problems</p>
        </div>
        <Button onClick={() => { setShowCreate(true); setCreateDone(false) }}>
          <Plus size={15} /> Create New Problem
        </Button>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems..."
            className="pl-8 pr-3 py-2 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:border-accent/50 w-56"
          />
        </div>
        <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {(['all', 'DSA', 'OS', 'Database', 'Other'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-2 text-xs font-semibold transition-colors ${
                typeFilter === t ? 'bg-accent text-white' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {t === 'all' ? 'All' : t}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-[48px_1fr_120px] border-b border-gray-100 px-6 py-3">
          {['#', 'TITLE', 'TYPE'].map((h) => (
            <span key={h} className="text-[10px] font-bold text-gray-400 tracking-widest">{h}</span>
          ))}
        </div>
        {filtered.map((p, i) => (
          <div
            key={p.id}
            className={`grid grid-cols-[48px_1fr_120px] items-center px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${
              i < filtered.length - 1 ? 'border-b border-gray-50' : ''
            }`}
            onClick={() => setDetail(p)}
          >
            <span className="text-sm text-gray-400">{i + 1}</span>
            <span className="text-sm font-semibold text-gray-900">{p.title}</span>
            <TypeBadge type={p.type} />
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-400">No problems found</div>
        )}
      </div>

      {/* Detail drawer */}
      {detail && (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-50" onClick={() => setDetail(null)}>
          <div className="w-[480px] bg-white h-full shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
              <h3 className="font-bold text-gray-900">Problem Details</h3>
              <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-5">
              <TypeBadge type={detail.type} />
              <h2 className="text-xl font-bold text-gray-900">{detail.title}</h2>
              {detail.description && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{detail.description}</p>
                </div>
              )}
              {detail.resource_url && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Resource</p>
                  <a href={detail.resource_url} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-accent font-medium hover:underline break-all">
                    {detail.resource_url}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create problem modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[520px]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Create New Problem</h3>
              <button onClick={closeCreate}><X size={18} className="text-gray-400 hover:text-gray-700" /></button>
            </div>

            {createDone ? (
              <div className="p-8 flex flex-col items-center gap-3 text-center">
                <CheckCircle2 size={36} className="text-green-500" />
                <p className="font-bold text-gray-900">Problem created!</p>
                <p className="text-sm text-gray-400">{form.title}</p>
                <Button onClick={closeCreate}>Done</Button>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Title <span className="text-red-400">*</span></label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Two Sum"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-accent/60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as ProblemType })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none"
                  >
                    <option value="DSA">DSA</option>
                    <option value="OS">OS</option>
                    <option value="Database">Database</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Problem description..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-accent/60 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Resource URL</label>
                  <input
                    value={form.resource_url}
                    onChange={(e) => setForm({ ...form, resource_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-accent/60"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="secondary" onClick={closeCreate}>Cancel</Button>
                  <Button onClick={handleCreate} disabled={!form.title.trim()}>Create</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
