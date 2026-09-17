import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Plus, Search, ChevronDown, ChevronRight, Trash2, X,
  Calendar, Clock, ExternalLink, Check
} from 'lucide-react'
import { ClassTabNav } from '../../../components/layout/ClassTabNav'
import {
  getTrainerClassById,
  getTrainerAssignedProblems,
  assignProblemsToClass,
  removeAssignedProblem,
  PROBLEM_BANK,
  type TrainerClass,
  type TrainerAssignedProblem,
  type BankProblem,
} from '../../../utils/trainerStore'

interface SelectedProblemItem {
  bankProblem: BankProblem
  deadlineDate: string
  deadlineTime: string
}

export function TrainerClassProblems() {
  const { classId = 'wecamp-21' } = useParams<{ classId: string }>()
  const [cls, setCls] = useState<TrainerClass | null>(null)
  const [assignedProblems, setAssignedProblems] = useState<TrainerAssignedProblem[]>([])
  const [search, setSearch] = useState('')

  // Accordion open states for subjects (default both open)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    DSA: true,
    OS: true,
    Database: true,
  })

  // Modal states
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [bankSearch, setBankSearch] = useState('')
  const [previewProblem, setPreviewProblem] = useState<BankProblem | null>(null)
  const [selectedItems, setSelectedItems] = useState<SelectedProblemItem[]>([])

  const loadData = () => {
    const foundClass = getTrainerClassById(classId)
    if (foundClass) setCls(foundClass)
    const probs = getTrainerAssignedProblems(classId)
    setAssignedProblems(probs)
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('algozoo_trainer_classes_updated', handleUpdate)
    return () => window.removeEventListener('algozoo_trainer_classes_updated', handleUpdate)
  }, [classId])

  if (!cls) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm max-w-2xl mx-auto">
        <p className="text-gray-500 font-medium mb-3">Class not found.</p>
        <Link to="/trainer/classes" className="text-sm text-accent font-semibold hover:underline">
          ← Back to My Classes
        </Link>
      </div>
    )
  }

  const tabs = [
    { label: 'Overview', to: `/trainer/classes/${cls.id}/overview` },
    { label: 'Problems', to: `/trainer/classes/${cls.id}/problems` },
    { label: 'Submissions', to: `/trainer/classes/${cls.id}/submissions` },
    { label: 'Students', to: `/trainer/classes/${cls.id}/students` },
  ]

  const crumbs = [
    { label: 'My Classes', to: '/trainer/classes' },
    { label: cls.name, to: `/trainer/classes/${cls.id}/overview` },
    { label: 'Problems' },
  ]

  // Filter problems by search
  const filteredProblems = assignedProblems.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  // Group by subjects: DSA, OS, Database
  const subjects: ('DSA' | 'OS' | 'Database')[] = ['DSA', 'OS', 'Database']
  const groupedProblems = subjects
    .map((subj) => {
      const items = filteredProblems.filter((p) => p.subject === subj)
      const totalSubmitted = items.reduce((sum, item) => sum + item.submitted, 0)
      const totalPossible = items.reduce((sum, item) => sum + item.total, 0)
      const groupPct = totalPossible > 0 ? Math.round((totalSubmitted / totalPossible) * 100) : 0
      return {
        subject: subj,
        items,
        totalSubmitted,
        totalPossible,
        groupPct,
      }
    })
    .filter((group) => group.items.length > 0)

  const toggleSection = (subj: string) => {
    setOpenSections((prev) => ({ ...prev, [subj]: !prev[subj] }))
  }

  const handleRemoveProblem = (problemId: string) => {
    if (confirm('Are you sure you want to remove this assigned problem?')) {
      const updated = removeAssignedProblem(problemId, cls.id)
      setAssignedProblems(updated)
    }
  }

  // Modal helpers
  const filteredBankProblems = PROBLEM_BANK.filter((bp) =>
    bp.title.toLowerCase().includes(bankSearch.toLowerCase())
  )

  const isSelected = (bankId: string) => {
    return selectedItems.some((si) => si.bankProblem.id === bankId)
  }

  const toggleSelectProblem = (bp: BankProblem) => {
    if (isSelected(bp.id)) {
      setSelectedItems((prev) => prev.filter((si) => si.bankProblem.id !== bp.id))
    } else {
      setSelectedItems((prev) => [
        ...prev,
        { bankProblem: bp, deadlineDate: '', deadlineTime: '' },
      ])
    }
  }

  const handleAddPreviewToSelection = () => {
    if (!previewProblem) return
    if (!isSelected(previewProblem.id)) {
      setSelectedItems((prev) => [
        ...prev,
        { bankProblem: previewProblem, deadlineDate: '', deadlineTime: '' },
      ])
    }
  }

  const handleRemoveSelectedItem = (bankId: string) => {
    setSelectedItems((prev) => prev.filter((si) => si.bankProblem.id !== bankId))
  }

  const handleDeadlineDateChange = (bankId: string, dateStr: string) => {
    setSelectedItems((prev) =>
      prev.map((si) =>
        si.bankProblem.id === bankId ? { ...si, deadlineDate: dateStr } : si
      )
    )
  }

  const handleDeadlineTimeChange = (bankId: string, timeStr: string) => {
    setSelectedItems((prev) =>
      prev.map((si) =>
        si.bankProblem.id === bankId ? { ...si, deadlineTime: timeStr } : si
      )
    )
  }

  const handleAssignToClass = () => {
    if (selectedItems.length === 0) return

    const newProblemsToAssign = selectedItems.map((si) => {
      let deadlineFormatted = 'Sep 30'
      if (si.deadlineDate) {
        try {
          const d = new Date(si.deadlineDate)
          if (!isNaN(d.getTime())) {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            deadlineFormatted = `${months[d.getMonth()]} ${d.getDate()}`
          }
        } catch {
          // fallback
        }
      }
      return {
        title: si.bankProblem.title,
        subject: si.bankProblem.subject,
        deadline: deadlineFormatted,
      }
    })

    const updated = assignProblemsToClass(cls.id, newProblemsToAssign)
    setAssignedProblems(updated)
    setIsAssignModalOpen(false)
    setSelectedItems([])
    setPreviewProblem(null)
  }

  const getSubjectBadgeStyle = (subj: string) => {
    switch (subj) {
      case 'DSA':
        return 'bg-sky-50 text-sky-600'
      case 'OS':
        return 'bg-emerald-50 text-emerald-600'
      case 'Database':
        return 'bg-amber-50 text-amber-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* ── Top Navigation & Tabs ── */}
      <ClassTabNav
        backLink={{ label: 'My Classes', to: '/trainer/classes' }}
        crumbs={crumbs}
        title={cls.name}
        status={cls.status}
        tabs={tabs}
      />

      {/* ── Assigned Problems Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Assigned Problems</h2>
          <p className="text-xs text-gray-400">{assignedProblems.length} problems assigned</p>
        </div>

        <button
          onClick={() => {
            setIsAssignModalOpen(true)
            if (filteredBankProblems.length > 0 && !previewProblem) {
              setPreviewProblem(filteredBankProblems[0])
            }
          }}
          className="inline-flex items-center justify-center gap-1.5 bg-accent text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-accent/90 shadow-sm shadow-red-200 transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          Assign Problems
        </button>
      </div>

      {/* ── Search Bar ── */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search problems..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:border-accent bg-white shadow-xs transition-colors"
        />
      </div>

      {/* ── Problem Groups Accordions ── */}
      <div className="space-y-4">
        {groupedProblems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-medium">No problems found.</p>
          </div>
        ) : (
          groupedProblems.map((group) => {
            const isOpen = openSections[group.subject] ?? true
            return (
              <div
                key={group.subject}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                {/* Group Accordion Header */}
                <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-50">
                  <div
                    onClick={() => toggleSection(group.subject)}
                    className="flex items-center gap-2.5 cursor-pointer select-none"
                  >
                    {isOpen ? (
                      <ChevronDown size={17} className="text-gray-400" />
                    ) : (
                      <ChevronRight size={17} className="text-gray-400" />
                    )}
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded font-bold uppercase ${getSubjectBadgeStyle(
                        group.subject
                      )}`}
                    >
                      {group.subject}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {group.items.length} {group.items.length === 1 ? 'problem' : 'problems'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-gray-400 font-medium">
                      {group.totalSubmitted} / {group.totalPossible} submitted · {group.groupPct}%
                    </span>
                    <Link
                      to={`/trainer/classes/${cls.id}/submissions?subject=${group.subject}`}
                      className="text-accent font-semibold hover:underline inline-flex items-center gap-0.5"
                    >
                      View Submissions
                      <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>

                {/* Group Problems Table */}
                {isOpen && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                          <th className="py-3 px-6">PROBLEM</th>
                          <th className="py-3 px-6">DEADLINE</th>
                          <th className="py-3 px-6">SUBMISSION PROGRESS</th>
                          <th className="py-3 px-6 text-right">ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 text-sm">
                        {group.items.map((prob) => (
                          <tr key={prob.id} className="hover:bg-gray-50/50 transition-colors">
                            {/* Problem Name */}
                            <td className="py-4 px-6 font-semibold text-gray-900">
                              {prob.title}
                            </td>

                            {/* Deadline */}
                            <td className="py-4 px-6 text-xs text-gray-500 font-medium whitespace-nowrap">
                              {prob.deadline}
                            </td>

                            {/* Progress */}
                            <td className="py-4 px-6">
                              <div className="w-48 sm:w-64 space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-400 font-medium">
                                    {prob.submitted}/{prob.total}
                                  </span>
                                  <span className="text-gray-700 font-bold">{prob.progress}%</span>
                                </div>
                                <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                  <div
                                    className="h-full bg-accent rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(100, Math.max(0, prob.progress))}%` }}
                                  />
                                </div>
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-6 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-3">
                                <Link
                                  to={`/trainer/classes/${cls.id}/submissions?problem=${encodeURIComponent(
                                    prob.title
                                  )}`}
                                  className="text-xs text-accent font-semibold hover:underline inline-flex items-center gap-0.5"
                                >
                                  View Submissions
                                  <ChevronRight size={13} />
                                </Link>
                                <button
                                  onClick={() => handleRemoveProblem(prob.id)}
                                  className="text-accent/80 hover:text-accent p-1 transition-colors"
                                  title="Delete problem"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* ── Assign Problems Modal (Screenshots 4 & 5) ── */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh] animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Assign Problems to {cls.name}
              </h2>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal 3-Column Body */}
            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-gray-100 overflow-y-auto flex-1 min-h-[460px]">
              {/* Column 1: Problem Bank (col-span-4) */}
              <div className="md:col-span-4 p-5 flex flex-col">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  PROBLEM BANK
                </p>

                {/* Bank search */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={bankSearch}
                    onChange={(e) => setBankSearch(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:border-accent"
                  />
                </div>

                {/* Bank list */}
                <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                  {filteredBankProblems.map((bp) => {
                    const checked = isSelected(bp.id)
                    const isPreviewed = previewProblem?.id === bp.id
                    return (
                      <div
                        key={bp.id}
                        onClick={() => setPreviewProblem(bp)}
                        className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors ${
                          isPreviewed ? 'bg-gray-50' : 'hover:bg-gray-50/70'
                        }`}
                      >
                        {/* Custom checkbox */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleSelectProblem(bp)
                          }}
                          className={`w-4 h-4 rounded flex items-center justify-center transition-colors cursor-pointer ${
                            checked
                              ? 'bg-accent border border-accent text-white'
                              : 'border border-gray-300 hover:border-gray-400 bg-white'
                          }`}
                        >
                          {checked && <Check size={12} strokeWidth={3} />}
                        </div>

                        {/* Problem Title */}
                        <span
                          className={`text-sm select-none transition-colors ${
                            checked
                              ? 'text-accent font-bold'
                              : 'text-gray-700 font-medium'
                          }`}
                        >
                          {bp.title}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Column 2: Problem Preview (col-span-4) */}
              <div className="md:col-span-4 p-6 flex flex-col justify-between">
                {previewProblem ? (
                  <div>
                    {/* Badge */}
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded font-bold uppercase inline-block mb-2 ${getSubjectBadgeStyle(
                        previewProblem.subject
                      )}`}
                    >
                      {previewProblem.subject}
                    </span>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {previewProblem.title}
                    </h3>

                    {/* Description */}
                    <div className="mb-4">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                        DESCRIPTION
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {previewProblem.description}
                      </p>
                    </div>

                    {/* Resource link */}
                    <div className="mb-6">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                        RESOURCE
                      </p>
                      <a
                        href={previewProblem.resource}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-accent hover:underline break-all inline-flex items-center gap-1 font-medium"
                      >
                        {previewProblem.resource}
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                    <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center mb-3">
                      <Search size={22} />
                    </div>
                    <p className="text-sm font-bold text-gray-900 mb-1">
                      Select a problem to preview
                    </p>
                    <p className="text-xs text-gray-400">
                      Click any problem on the left to see its details
                    </p>
                  </div>
                )}

                {/* Add to selection button */}
                {previewProblem && (
                  <button
                    onClick={handleAddPreviewToSelection}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      isSelected(previewProblem.id)
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-accent text-white hover:bg-accent/90 shadow-sm shadow-red-200'
                    }`}
                  >
                    {isSelected(previewProblem.id) ? (
                      <>
                        <Check size={16} />
                        Added to selection
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        Add to selection
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Column 3: Selected Problems & Deadlines (col-span-4) */}
              <div className="md:col-span-4 p-5 flex flex-col justify-between bg-gray-50/40">
                <div className="flex-1 overflow-y-auto">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                    SELECTED ({selectedItems.length})
                  </p>

                  {selectedItems.length === 0 ? (
                    <div className="py-20 text-center text-gray-400 text-sm">
                      No problems selected yet
                    </div>
                  ) : (
                    <div className="space-y-3 pr-1">
                      {selectedItems.map(({ bankProblem, deadlineDate, deadlineTime }) => (
                        <div
                          key={bankProblem.id}
                          className="bg-white border border-gray-200 rounded-xl p-3.5 relative shadow-2xs"
                        >
                          {/* Close X */}
                          <button
                            onClick={() => handleRemoveSelectedItem(bankProblem.id)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-0.5"
                          >
                            <X size={14} />
                          </button>

                          {/* Problem title & badge */}
                          <h4 className="text-sm font-bold text-gray-900 pr-5 mb-1">
                            {bankProblem.title}
                          </h4>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase inline-block mb-3 ${getSubjectBadgeStyle(
                              bankProblem.subject
                            )}`}
                          >
                            {bankProblem.subject}
                          </span>

                          {/* Deadline inputs */}
                          <p className="text-xs text-gray-400 mb-1.5">Deadline (optional)</p>
                          <div className="grid grid-cols-2 gap-2">
                            {/* Date input */}
                            <div className="relative">
                              <input
                                type="date"
                                value={deadlineDate}
                                onChange={(e) =>
                                  handleDeadlineDateChange(bankProblem.id, e.target.value)
                                }
                                className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-600 focus:outline-none focus:border-accent bg-white"
                              />
                            </div>
                            {/* Time input */}
                            <div className="relative">
                              <input
                                type="time"
                                value={deadlineTime}
                                onChange={(e) =>
                                  handleDeadlineTimeChange(bankProblem.id, e.target.value)
                                }
                                className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-600 focus:outline-none focus:border-accent bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Assign to Class Button */}
                <div className="pt-4 border-t border-gray-200/80">
                  <button
                    disabled={selectedItems.length === 0}
                    onClick={handleAssignToClass}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold bg-accent text-white hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-red-200 transition-all"
                  >
                    Assign to Class
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
