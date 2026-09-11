import { useState } from 'react'
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
            </button>
          ))}
        </div>
      </div>

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
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
