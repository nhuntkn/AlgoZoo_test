import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Search, Plus, Trash2, ExternalLink, BookOpen, X } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

const classNames: Record<string, string> = {
  '1': 'WeCamp Batch 15',
  '2': 'StarCamp Batch 2',
}

// Problems currently assigned to this class
const initialAssigned = [
  { id: 1, title: 'Two Sum', topic: 'Array', difficulty: 'easy', url: 'https://leetcode.com/problems/two-sum/' },
  { id: 2, title: 'Valid Palindrome', topic: 'String', difficulty: 'easy', url: 'https://leetcode.com/problems/valid-palindrome/' },
  { id: 3, title: 'Group Anagrams', topic: 'Hash Map', difficulty: 'medium', url: 'https://leetcode.com/problems/group-anagrams/' },
  { id: 4, title: 'Binary Tree Level Order Traversal', topic: 'Tree', difficulty: 'medium', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
  { id: 5, title: 'Course Schedule', topic: 'Graph', difficulty: 'hard', url: 'https://leetcode.com/problems/course-schedule/' },
]

// Repository to pick from (not yet in class)
const repository = [
  { id: 6, title: 'Longest Substring Without Repeating Characters', topic: 'String', difficulty: 'medium', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
  { id: 7, title: 'Merge Intervals', topic: 'Array', difficulty: 'medium', url: 'https://leetcode.com/problems/merge-intervals/' },
  { id: 8, title: 'Binary Search', topic: 'Binary Search', difficulty: 'easy', url: 'https://leetcode.com/problems/binary-search/' },
  { id: 9, title: 'Word Search', topic: 'Graph', difficulty: 'hard', url: 'https://leetcode.com/problems/word-search/' },
  { id: 10, title: 'Trapping Rain Water', topic: 'Stack/Queue', difficulty: 'hard', url: 'https://leetcode.com/problems/trapping-rain-water/' },
  { id: 11, title: 'Reverse Linked List', topic: 'Linked List', difficulty: 'easy', url: 'https://leetcode.com/problems/reverse-linked-list/' },
  { id: 12, title: 'Kth Largest Element in Array', topic: 'Array', difficulty: 'medium', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
]

export function ClassProblems() {
  const { classId } = useParams<{ classId: string }>()
  const className = classNames[classId ?? '1'] ?? 'Unknown Class'

  const [assigned, setAssigned] = useState(initialAssigned)
  const [search, setSearch] = useState('')
  const [diffFilter, setDiffFilter] = useState('all')
  const [showPicker, setShowPicker] = useState(false)
  const [pickerSearch, setPickerSearch] = useState('')

  const assignedIds = new Set(assigned.map((p) => p.id))

  const filtered = assigned.filter((p) => {
    const q = search.toLowerCase()
    return (
      (p.title.toLowerCase().includes(q) || p.topic.toLowerCase().includes(q)) &&
      (diffFilter === 'all' || p.difficulty === diffFilter)
    )
  })

  const pickerAvailable = repository.filter(
    (p) => !assignedIds.has(p.id) && p.title.toLowerCase().includes(pickerSearch.toLowerCase())
  )

  const remove = (id: number) => setAssigned((prev) => prev.filter((p) => p.id !== id))
  const add = (p: typeof repository[number]) => { setAssigned((prev) => [...prev, p]); setShowPicker(false) }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-5 text-sm text-gray-400">
        <Link to={`/trainer/classes/${classId}`} className="hover:text-accent flex items-center gap-1">
          <ArrowLeft size={14} /> {className}
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">Manage Problems</span>
      </div>

      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Class Problems</h1>
          <p className="text-sm text-gray-400 mt-0.5">{assigned.length} problems assigned to {className}</p>
        </div>
        <Button onClick={() => setShowPicker(true)}><Plus size={15} /> Add Problem</Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search problems..."
            className="pl-8 pr-3 py-2 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:border-accent/50 w-52" />
        </div>
        <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {['all', 'easy', 'medium', 'hard'].map((d) => (
            <button key={d} onClick={() => setDiffFilter(d)}
              className={`px-3 py-2 text-xs font-semibold capitalize transition-colors ${diffFilter === d ? 'bg-accent text-white' : 'text-gray-500 hover:text-gray-800'}`}>
              {d === 'all' ? 'All' : d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Assigned problems table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-[48px_1fr_120px_100px_100px_80px] border-b border-gray-100 px-6 py-3">
          {['#', 'TITLE', 'TOPIC', 'DIFFICULTY', 'LEETCODE', 'REMOVE'].map((h) => (
            <span key={h} className="text-[10px] font-bold text-gray-400 tracking-widest">{h}</span>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No problems match your search</div>
        )}
        {filtered.map((p, i) => (
          <div key={p.id}
            className={`grid grid-cols-[48px_1fr_120px_100px_100px_80px] items-center px-6 py-4 hover:bg-gray-50 transition-colors ${i < filtered.length - 1 ? 'border-b border-gray-50' : ''}`}
          >
            <span className="text-sm text-gray-400">{i + 1}</span>
            <span className="text-sm font-semibold text-gray-900">{p.title}</span>
            <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2.5 py-1 w-fit">{p.topic}</span>
            <span><Badge variant={p.difficulty as 'easy' | 'medium' | 'hard'}>{p.difficulty.toUpperCase()}</Badge></span>
            <a href={p.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-accent text-xs font-semibold hover:underline">
              <ExternalLink size={12} /> LeetCode
            </a>
            <button onClick={() => remove(p.id)}
              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Add problem picker modal */}
      {showPicker && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowPicker(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-[560px] max-h-[70vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-accent" />
                <h3 className="font-bold text-gray-900">Add from Repository</h3>
              </div>
              <button onClick={() => setShowPicker(false)} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
            </div>
            <div className="px-6 py-3 border-b border-gray-50">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={pickerSearch} onChange={(e) => setPickerSearch(e.target.value)} placeholder="Search repository..."
                  className="pl-8 pr-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm w-full focus:outline-none" />
              </div>
            </div>
            <div className="overflow-y-auto flex-1">
              {pickerAvailable.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-sm">All available problems already added</div>
              )}
              {pickerAvailable.map((p, i) => (
                <div key={p.id}
                  className={`flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 ${i < pickerAvailable.length - 1 ? 'border-b border-gray-50' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{p.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">{p.topic}</span>
                        <Badge variant={p.difficulty as 'easy' | 'medium' | 'hard'}>{p.difficulty.toUpperCase()}</Badge>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => add(p)}>Add</Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
