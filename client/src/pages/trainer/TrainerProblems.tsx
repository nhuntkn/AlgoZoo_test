import { useState } from 'react'
<<<<<<< HEAD
import { Search, ExternalLink, X, BookOpen } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { useAuth } from '../../context/AuthContext'

const topics = ['All', 'Array', 'String', 'Linked List', 'Tree', 'Graph', 'DP', 'Binary Search', 'Stack/Queue', 'Hash Map']

export const problemBank = [
  { id: 1, title: 'Two Sum', topic: 'Array', difficulty: 'easy', url: 'https://leetcode.com/problems/two-sum/', desc: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', examples: 'Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]', constraints: '2 ≤ nums.length ≤ 10⁴\n-10⁹ ≤ nums[i] ≤ 10⁹' },
  { id: 2, title: 'Valid Palindrome', topic: 'String', difficulty: 'easy', url: 'https://leetcode.com/problems/valid-palindrome/', desc: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.', examples: 'Input: s = "A man, a plan, a canal: Panama"\nOutput: true', constraints: '1 ≤ s.length ≤ 2 × 10⁵' },
  { id: 3, title: 'Best Time to Buy and Sell Stock', topic: 'Array', difficulty: 'easy', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', desc: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. Find the maximum profit you can achieve.', examples: 'Input: prices = [7,1,5,3,6,4]\nOutput: 5', constraints: '1 ≤ prices.length ≤ 10⁵\n0 ≤ prices[i] ≤ 10⁴' },
  { id: 4, title: 'Reverse Linked List', topic: 'Linked List', difficulty: 'easy', url: 'https://leetcode.com/problems/reverse-linked-list/', desc: 'Given the head of a singly linked list, reverse the list, and return the reversed list.', examples: 'Input: head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]', constraints: '0 ≤ n ≤ 5000\n-5000 ≤ Node.val ≤ 5000' },
  { id: 5, title: 'Merge Two Sorted Lists', topic: 'Linked List', difficulty: 'easy', url: 'https://leetcode.com/problems/merge-two-sorted-lists/', desc: 'Merge two sorted linked lists and return it as a sorted list.', examples: 'Input: list1 = [1,2,4], list2 = [1,3,4]\nOutput: [1,1,2,3,4]', constraints: '0 ≤ n, m ≤ 50\n-100 ≤ Node.val ≤ 100' },
  { id: 6, title: 'Binary Search', topic: 'Binary Search', difficulty: 'easy', url: 'https://leetcode.com/problems/binary-search/', desc: 'Given a sorted array of integers nums and an integer target, write a function to search target in nums.', examples: 'Input: nums = [-1,0,3,5,9,12], target = 9\nOutput: 4', constraints: '1 ≤ nums.length ≤ 10⁴' },
  { id: 7, title: 'Group Anagrams', topic: 'Hash Map', difficulty: 'medium', url: 'https://leetcode.com/problems/group-anagrams/', desc: 'Given an array of strings strs, group the anagrams together.', examples: 'Input: strs = ["eat","tea","tan","ate","nat","bat"]\nOutput: [["bat"],["nat","tan"],["ate","eat","tea"]]', constraints: '1 ≤ strs.length ≤ 10⁴\n0 ≤ strs[i].length ≤ 100' },
  { id: 8, title: 'Longest Substring Without Repeating Characters', topic: 'String', difficulty: 'medium', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', desc: 'Given a string s, find the length of the longest substring without repeating characters.', examples: 'Input: s = "abcabcbb"\nOutput: 3', constraints: '0 ≤ s.length ≤ 5 × 10⁴' },
  { id: 9, title: 'Binary Tree Level Order Traversal', topic: 'Tree', difficulty: 'medium', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', desc: 'Given the root of a binary tree, return the level order traversal of its nodes\' values.', examples: 'Input: root = [3,9,20,null,null,15,7]\nOutput: [[3],[9,20],[15,7]]', constraints: '0 ≤ number of nodes ≤ 2000' },
  { id: 10, title: 'Course Schedule', topic: 'Graph', difficulty: 'medium', url: 'https://leetcode.com/problems/course-schedule/', desc: 'There are numCourses courses you have to take. Given prerequisites, determine if you can finish all courses.', examples: 'Input: numCourses = 2, prerequisites = [[1,0]]\nOutput: true', constraints: '1 ≤ numCourses ≤ 2000' },
  { id: 11, title: 'Merge Intervals', topic: 'Array', difficulty: 'medium', url: 'https://leetcode.com/problems/merge-intervals/', desc: 'Given an array of intervals, merge all overlapping intervals.', examples: 'Input: intervals = [[1,3],[2,6],[8,10],[15,18]]\nOutput: [[1,6],[8,10],[15,18]]', constraints: '1 ≤ intervals.length ≤ 10⁴' },
  { id: 12, title: 'Kth Largest Element in Array', topic: 'Array', difficulty: 'medium', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', desc: 'Given an integer array nums and an integer k, return the kth largest element.', examples: 'Input: nums = [3,2,1,5,6,4], k = 2\nOutput: 5', constraints: '1 ≤ k ≤ nums.length ≤ 10⁵' },
  { id: 13, title: 'Longest Common Subsequence', topic: 'DP', difficulty: 'medium', url: 'https://leetcode.com/problems/longest-common-subsequence/', desc: 'Given two strings text1 and text2, return the length of their longest common subsequence.', examples: 'Input: text1 = "abcde", text2 = "ace"\nOutput: 3', constraints: '1 ≤ text1.length, text2.length ≤ 1000' },
  { id: 14, title: 'Word Search', topic: 'Graph', difficulty: 'hard', url: 'https://leetcode.com/problems/word-search/', desc: 'Given an m x n grid of characters board and a string word, return true if word exists in the grid.', examples: 'Input: board = [["A","B","C","E"],...], word = "ABCCED"\nOutput: true', constraints: '1 ≤ m, n ≤ 6\n1 ≤ word.length ≤ 15' },
  { id: 15, title: 'Trapping Rain Water', topic: 'Stack/Queue', difficulty: 'hard', url: 'https://leetcode.com/problems/trapping-rain-water/', desc: 'Given n non-negative integers representing an elevation map, compute how much water it can trap.', examples: 'Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]\nOutput: 6', constraints: '1 ≤ n ≤ 2 × 10⁴' },
]

type Problem = typeof problemBank[number]

export function TrainerProblems() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [diffFilter, setDiffFilter] = useState('all')
  const [topicFilter, setTopicFilter] = useState('All')
  const [detail, setDetail] = useState<Problem | null>(null)

  const filtered = problemBank.filter((p) => {
    const q = search.toLowerCase()
    return (
      (p.title.toLowerCase().includes(q) || p.topic.toLowerCase().includes(q)) &&
      (diffFilter === 'all' || p.difficulty === diffFilter) &&
      (topicFilter === 'All' || p.topic === topicFilter)
    )
  })

  return (
    <div>
      <div className="mb-7">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
          {user.role === 'admin' ? 'Admin' : 'Trainer'}
        </p>
        <h1 className="text-2xl font-bold text-gray-900">Problem Bank</h1>
        <p className="text-sm text-gray-400 mt-0.5">{problemBank.length} problems available · Create assignments from a class</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
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
        <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex-wrap">
          {topics.map((t) => (
            <button key={t} onClick={() => setTopicFilter(t)}
              className={`px-3 py-2 text-xs font-semibold transition-colors ${topicFilter === t ? 'bg-accent text-white' : 'text-gray-500 hover:text-gray-800'}`}>
              {t}
=======
import { useNavigate } from 'react-router-dom'
import { Search, Plus, X, ChevronLeft, Pencil, Trash2, ExternalLink, Paperclip, Loader2 } from 'lucide-react'
import { TypeBadge, Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { ProblemComposer } from '../../components/problem/ProblemComposer'
import type { ProblemType, Difficulty, ProblemDraft, Problem } from '../../types/problem'
import { useProblems } from '../../hooks/useProblems'
import { getProblemDetail, createProblem, updateProblem, deleteProblem } from '../../services/problemService'

const difficultyVariant: Record<Difficulty, string> = {
  easy: 'easy',
  medium: 'medium',
  hard: 'hard',
}

type Modal =
  | { mode: 'create' }
  | { mode: 'edit'; target: Problem }
  | { mode: 'delete'; target: Problem }

export function TrainerProblems() {
  const navigate = useNavigate()
  const { problems, setProblems, loading, error, refetch } = useProblems()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | ProblemType>('all')
  const [detail, setDetail] = useState<Problem | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [modal, setModal] = useState<Modal | null>(null)
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const filtered = problems.filter((p) => {
    const q = search.toLowerCase()
    return p.title.toLowerCase().includes(q) && (typeFilter === 'all' || p.type === typeFilter)
  })

  const openDetail = async (p: Problem) => {
    setDetail(p)
    setDetailLoading(true)
    try {
      setDetail(await getProblemDetail(p.id))
    } catch {
      // keep the list-shape data if the detail fetch fails
    } finally {
      setDetailLoading(false)
    }
  }

  const openCreate = () => { setActionError(null); setModal({ mode: 'create' }) }
  const openEdit = async (p: Problem) => {
    setDetail(null)
    setActionError(null)
    const full = p.description || p.resources.length ? p : await getProblemDetail(p.id).catch(() => p)
    setModal({ mode: 'edit', target: full })
  }
  const openDelete = (p: Problem) => { setDetail(null); setActionError(null); setModal({ mode: 'delete', target: p }) }
  const closeModal = () => { setModal(null); setActionError(null) }

  const handleSave = async (draft: ProblemDraft) => {
    if (!modal) return
    setSaving(true)
    setActionError(null)
    try {
      if (modal.mode === 'create') {
        const created = await createProblem(draft)
        setProblems((prev) => [created, ...prev])
      } else if (modal.mode === 'edit') {
        const id = modal.target.id
        const updated = await updateProblem(id, draft)
        setProblems((prev) => prev.map((p) => (p.id === id ? updated : p)))
        setDetail((prev) => (prev?.id === id ? updated : prev))
      }
      closeModal()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not save this problem')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (modal?.mode !== 'delete') return
    setSaving(true)
    setActionError(null)
    try {
      await deleteProblem(modal.target.id)
      setProblems((prev) => prev.filter((p) => p.id !== modal.target.id))
      closeModal()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not delete this problem')
    } finally {
      setSaving(false)
    }
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
          <p className="text-sm text-gray-400 mt-0.5">{loading ? 'Loading…' : `${problems.length} problems`}</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={15} /> Create New Problem
        </Button>
      </div>

      {/* Filters */}
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
>>>>>>> d96b4f5600f620774943785cb2d6e27f419a5d6e
            </button>
          ))}
        </div>
      </div>

<<<<<<< HEAD
      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-[48px_1fr_120px_100px] border-b border-gray-100 px-6 py-3">
          {['#', 'TITLE', 'TOPIC', 'DIFFICULTY'].map((h) => (
            <span key={h} className="text-[10px] font-bold text-gray-400 tracking-widest">{h}</span>
          ))}
        </div>
        {filtered.map((p, i) => (
          <div key={p.id}
            className={`grid grid-cols-[48px_1fr_120px_100px] items-center px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${i < filtered.length - 1 ? 'border-b border-gray-50' : ''}`}
            onClick={() => setDetail(p)}
          >
            <span className="text-sm text-gray-400">{i + 1}</span>
            <span className="text-sm font-semibold text-gray-900">{p.title}</span>
            <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2.5 py-1 w-fit">{p.topic}</span>
            <Badge variant={p.difficulty as 'easy' | 'medium' | 'hard'}>{p.difficulty.toUpperCase()}</Badge>
          </div>
        ))}
      </div>

      {/* Detail drawer */}
      {detail && (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-50" onClick={() => setDetail(null)}>
          <div className="w-[500px] bg-white h-full shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-accent" />
                <h3 className="font-bold text-gray-900">Problem Details</h3>
              </div>
              <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-2">
                <Badge variant={detail.difficulty as 'easy' | 'medium' | 'hard'}>{detail.difficulty.toUpperCase()}</Badge>
                <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2.5 py-1">{detail.topic}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{detail.title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{detail.desc}</p>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Example</p>
                <pre className="bg-gray-50 rounded-xl px-4 py-3 text-xs text-gray-700 font-mono whitespace-pre-wrap">{detail.examples}</pre>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Constraints</p>
                <pre className="bg-gray-50 rounded-xl px-4 py-3 text-xs text-gray-700 font-mono whitespace-pre-wrap">{detail.constraints}</pre>
              </div>
              <a href={detail.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-accent font-semibold hover:underline">
                <ExternalLink size={14} /> Open on LeetCode
              </a>
=======
      {error && (
        <div className="flex items-center justify-between gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5 text-sm text-red-600">
          <span>{error}</span>
          <button onClick={() => void refetch()} className="font-semibold hover:underline flex-shrink-0">Retry</button>
        </div>
      )}

      {/* Problem list */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-[48px_1fr_120px_90px_88px] border-b border-gray-100 px-6 py-3">
          {['#', 'TITLE', 'TYPE', 'DIFFICULTY', ''].map((h, i) => (
            <span key={i} className="text-[10px] font-bold text-gray-400 tracking-widest">{h}</span>
          ))}
        </div>
        {loading ? (
          <div className="py-12 flex items-center justify-center text-sm text-gray-400 gap-2">
            <Loader2 size={16} className="animate-spin" /> Loading problems...
          </div>
        ) : (
          <>
            {filtered.map((p, i) => (
              <div
                key={p.id}
                className={`group grid grid-cols-[48px_1fr_120px_90px_88px] items-center px-6 py-4 hover:bg-gray-50 transition-colors ${
                  i < filtered.length - 1 ? 'border-b border-gray-50' : ''
                }`}
              >
                <span className="text-sm text-gray-400 cursor-pointer" onClick={() => void openDetail(p)}>{i + 1}</span>
                <span
                  className="text-sm font-semibold text-gray-900 cursor-pointer hover:text-accent transition-colors"
                  onClick={() => void openDetail(p)}
                >
                  {p.title}
                </span>
                <div className="cursor-pointer" onClick={() => void openDetail(p)}>
                  <TypeBadge type={p.type} />
                </div>
                <div className="flex items-center cursor-pointer" onClick={() => void openDetail(p)}>
                  {p.type === 'DSA' ? (
                    <Badge variant={difficultyVariant[p.difficulty]}>
                      {p.difficulty.charAt(0).toUpperCase() + p.difficulty.slice(1)}
                    </Badge>
                  ) : (
                    <span className="text-xs text-gray-300">—</span>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                  <button
                    onClick={(e) => { e.stopPropagation(); void openEdit(p) }}
                    title="Edit"
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-accent hover:bg-accent/10 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); openDelete(p) }}
                    title="Delete"
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-gray-400">No problems found</div>
            )}
          </>
        )}
      </div>

      {/* ── Detail drawer ── */}
      {detail && (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-40" onClick={() => setDetail(null)}>
          <div className="w-[520px] bg-white h-full shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <h3 className="font-bold text-gray-900">Problem Details</h3>
              <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              <div className="flex items-center gap-2 flex-wrap">
                <TypeBadge type={detail.type} />
                {detail.type === 'DSA' && (
                  <Badge variant={difficultyVariant[detail.difficulty]}>
                    {detail.difficulty.charAt(0).toUpperCase() + detail.difficulty.slice(1)}
                  </Badge>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{detail.title}</h2>
              {detailLoading && (
                <p className="text-xs text-gray-400 flex items-center gap-1.5"><Loader2 size={12} className="animate-spin" /> Loading details...</p>
              )}
              {detail.description && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</p>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{detail.description}</p>
                </div>
              )}
              {detail.resources.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Resources</p>
                  <div className="space-y-1.5">
                    {detail.resources.map((r) => (
                      r.filename ? (
                        <div key={r.id} className="flex items-center gap-2 text-sm text-gray-600">
                          <Paperclip size={13} className="text-gray-400 flex-shrink-0" />
                          {r.filename}
                        </div>
                      ) : (
                        <a
                          key={r.id}
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-accent font-medium hover:underline"
                        >
                          <ExternalLink size={13} className="flex-shrink-0" />
                          {r.label || r.url}
                        </a>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 px-6 py-4 border-t border-gray-100 flex-shrink-0">
              <Button onClick={() => void openEdit(detail)} size="sm"><Pencil size={13} /> Edit</Button>
              <Button variant="danger" onClick={() => openDelete(detail)} size="sm"><Trash2 size={13} /> Delete</Button>
>>>>>>> d96b4f5600f620774943785cb2d6e27f419a5d6e
            </div>
          </div>
        </div>
      )}
<<<<<<< HEAD
    </div>
  )
}
=======

      {/* ── Delete confirmation ── */}
      {modal?.mode === 'delete' && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[400px] p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <Trash2 size={18} className="text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Delete problem?</h3>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="font-semibold text-gray-800">"{modal.target.title}"</span> will be permanently removed from the problem bank.
                </p>
              </div>
            </div>
            {actionError && <p className="text-xs text-red-500 mb-3">{actionError}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={closeModal} disabled={saving}>Cancel</Button>
              <Button variant="danger" onClick={() => void handleDelete()} disabled={saving}>
                {saving ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create / Edit composer (full-screen) ── */}
      {(modal?.mode === 'create' || modal?.mode === 'edit') && (
        <ProblemComposer
          mode={modal.mode}
          initial={
            modal.mode === 'edit'
              ? {
                  title: modal.target.title,
                  type: modal.target.type,
                  difficulty: modal.target.difficulty,
                  description: modal.target.description,
                  resources: modal.target.resources,
                }
              : undefined
          }
          onSave={(draft) => void handleSave(draft)}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
>>>>>>> d96b4f5600f620774943785cb2d6e27f419a5d6e
