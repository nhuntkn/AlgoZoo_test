import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search, Plus, ChevronLeft, X, ExternalLink, Edit3, Trash2,
  FileText, Paperclip, AlertCircle
} from 'lucide-react'
import {
  getTrainerProblemBank,
  deleteTrainerProblem,
  type BankProblem,
} from '../../../utils/trainerStore'

type TopicFilter = 'All' | 'DSA' | 'OS' | 'Database' | 'Other'

const TOPIC_CHIPS: TopicFilter[] = ['All', 'DSA', 'OS', 'Database', 'Other']

export function TrainerProblemBank() {
  const navigate = useNavigate()
  const [problems, setProblems] = useState<BankProblem[]>([])
  const [selectedTopic, setSelectedTopic] = useState<TopicFilter>('All')
  const [search, setSearch] = useState('')
  const [activeProblem, setActiveProblem] = useState<BankProblem | null>(null)
  const [deleteConfirmProblem, setDeleteConfirmProblem] = useState<BankProblem | null>(null)

  const loadData = () => {
    const list = getTrainerProblemBank()
    setProblems(list)
    if (activeProblem) {
      const refreshed = list.find((p) => p.id === activeProblem.id)
      setActiveProblem(refreshed || null)
    }
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('algozoo_problem_bank_updated', handleUpdate)
    return () => window.removeEventListener('algozoo_problem_bank_updated', handleUpdate)
  }, [])

  // Filter problems
  const filteredProblems = useMemo(() => {
    let result = [...problems]

    if (selectedTopic !== 'All') {
      result = result.filter((p) => p.subject === selectedTopic)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.subject.toLowerCase().includes(q)
      )
    }

    return result
  }, [problems, selectedTopic, search])

  const handleDeleteProblem = (id: string) => {
    deleteTrainerProblem(id)
    setDeleteConfirmProblem(null)
    setActiveProblem(null)
  }

  // Type badge styling
  const getTypeBadgeStyle = (subject: string) => {
    switch (subject) {
      case 'DSA':
        return 'bg-sky-100/70 text-sky-700 font-semibold'
      case 'OS':
        return 'bg-emerald-100/70 text-emerald-700 font-semibold'
      case 'Database':
        return 'bg-purple-100/70 text-purple-700 font-semibold'
      default:
        return 'bg-gray-100 text-gray-700 font-semibold'
    }
  }

  // Difficulty badge styling
  const getDifficultyBadgeStyle = (difficulty?: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-emerald-100/70 text-emerald-700 font-semibold'
      case 'Medium':
        return 'bg-amber-100/70 text-amber-700 font-semibold'
      case 'Hard':
        return 'bg-rose-100/70 text-rose-700 font-semibold'
      default:
        return 'bg-gray-100 text-gray-700 font-semibold'
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* ── Top Breadcrumb / Back ── */}
      <div>
        <button
          onClick={() => navigate('/trainer/dashboard')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors mb-1.5"
        >
          <ChevronLeft size={14} />
          Back
        </button>
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          PROBLEM BANK
        </div>
      </div>

      {/* ── Page Header & Action Button ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Problems</h1>
          <p className="text-sm text-gray-500 font-semibold mt-0.5">
            {problems.length} problems
          </p>
        </div>

        <Link
          to="/trainer/problems/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm hover:opacity-95 shadow-sm shadow-red-200 transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          Create New Problem
        </Link>
      </div>

      {/* ── Search Bar & Filter Chips ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:border-accent bg-white shadow-xs transition-colors"
          />
        </div>

        {/* Topic filter chips */}
        <div className="flex items-center p-1 bg-white rounded-xl border border-gray-200 shadow-xs gap-1 overflow-x-auto">
          {TOPIC_CHIPS.map((topic) => {
            const isActive = selectedTopic === topic
            return (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`px-3.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-accent text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {topic}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Problems Table Card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filteredProblems.length === 0 ? (
          <div className="p-16 text-center">
            <FileText size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-semibold text-base">No problems found</p>
            <p className="text-gray-400 text-xs mt-1">
              Try adjusting your search query or topic filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6 w-16">#</th>
                  <th className="py-3.5 px-6">TITLE</th>
                  <th className="py-3.5 px-6 w-36">TYPE</th>
                  <th className="py-3.5 px-6 w-36">DIFFICULTY</th>
                  <th className="py-3.5 px-6 w-16 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {filteredProblems.map((prob, idx) => {
                  const isSelected = activeProblem?.id === prob.id
                  return (
                    <tr
                      key={prob.id}
                      onClick={() => setActiveProblem(prob)}
                      className={`group cursor-pointer transition-colors ${
                        isSelected ? 'bg-red-50/40' : 'hover:bg-gray-50/70'
                      }`}
                    >
                      {/* Index */}
                      <td className="py-4 px-6 text-xs text-gray-400 font-medium">
                        {idx + 1}
                      </td>

                      {/* Title */}
                      <td className="py-4 px-6 font-bold text-gray-900 group-hover:text-accent transition-colors">
                        {prob.title}
                      </td>

                      {/* Type / Subject */}
                      <td className="py-4 px-6">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-md inline-block ${getTypeBadgeStyle(
                            prob.subject
                          )}`}
                        >
                          {prob.subject}
                        </span>
                      </td>

                      {/* Difficulty */}
                      <td className="py-4 px-6">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-md inline-block ${getDifficultyBadgeStyle(
                            prob.difficulty
                          )}`}
                        >
                          {prob.difficulty}
                        </span>
                      </td>

                      {/* Delete Quick Action on Hover */}
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeleteConfirmProblem(prob)
                          }}
                          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 rounded transition-all"
                          title="Delete problem"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Slide-Over Problem Details Drawer ── */}
      {activeProblem && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            onClick={() => setActiveProblem(null)}
            className="fixed inset-0 bg-black/25 backdrop-blur-[2px] transition-opacity"
          />

          {/* Drawer container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-gray-100 transform transition ease-in-out duration-300">
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900">Problem Details</h2>
                <button
                  onClick={() => setActiveProblem(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                {/* Badges */}
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-md ${getTypeBadgeStyle(
                      activeProblem.subject
                    )}`}
                  >
                    {activeProblem.subject}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-md ${getDifficultyBadgeStyle(
                      activeProblem.difficulty
                    )}`}
                  >
                    {activeProblem.difficulty}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 leading-snug">
                    {activeProblem.title}
                  </h1>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    DESCRIPTION
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {activeProblem.description}
                  </div>
                </div>

                {/* Example (if present) */}
                {activeProblem.example && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-gray-700">Example:</div>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 font-mono text-xs text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {activeProblem.example}
                    </div>
                  </div>
                )}

                {/* Constraints (if present) */}
                {activeProblem.constraints && activeProblem.constraints.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-gray-700">Constraints:</div>
                    <ul className="list-disc list-inside space-y-1 text-xs text-gray-600 font-mono">
                      {activeProblem.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Resources */}
                <div className="space-y-2.5">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    RESOURCES
                  </div>
                  <div className="space-y-2">
                    {/* External link / resources */}
                    {activeProblem.resources && activeProblem.resources.length > 0 ? (
                      activeProblem.resources.map((res) => (
                        <div key={res.id}>
                          {res.type === 'link' ? (
                            <a
                              href={res.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm text-accent font-semibold hover:underline"
                            >
                              <ExternalLink size={14} />
                              {res.title || 'Resource Link'}
                            </a>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 text-sm text-gray-700 font-medium">
                              <Paperclip size={14} className="text-gray-400" />
                              {res.fileName || res.title}
                            </div>
                          )}
                        </div>
                      ))
                    ) : activeProblem.resource ? (
                      <a
                        href={activeProblem.resource}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-accent font-semibold hover:underline"
                      >
                        <ExternalLink size={14} />
                        LeetCode
                      </a>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No resources attached.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-6 border-t border-gray-100 bg-white flex items-center gap-3">
                <Link
                  to={`/trainer/problems/${activeProblem.id}/edit`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm hover:opacity-95 shadow-sm shadow-red-200 transition-all"
                >
                  <Edit3 size={15} />
                  Edit
                </Link>

                <button
                  onClick={() => {
                    const toDelete = activeProblem
                    setActiveProblem(null) // closes drawer to show table in background as in Figma Image 2
                    setDeleteConfirmProblem(toDelete)
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Dialog (Matching Figma Image 2) ── */}
      {deleteConfirmProblem && (
        <div className="fixed inset-0 z-60 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={() => setDeleteConfirmProblem(null)}
            className="fixed inset-0 bg-black/30 backdrop-blur-[1px] transition-opacity"
          />

          {/* Modal Card */}
          <div className="relative bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl z-10 text-center flex flex-col items-center space-y-4 border border-gray-100/80 animate-in fade-in zoom-in-95 duration-150">
            {/* Soft Red Icon Container */}
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-1">
              <Trash2 size={24} />
            </div>

            {/* Title & Description */}
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-gray-900">Delete problem?</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                <span className="font-semibold text-gray-800">"{deleteConfirmProblem.title}"</span> will be permanently removed from the problem bank.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3 w-full pt-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmProblem(null)}
                className="px-8 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteProblem(deleteConfirmProblem.id)}
                className="px-8 py-2.5 rounded-full border border-red-500 text-red-500 hover:bg-red-50 font-semibold text-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
