import { Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Code2 } from 'lucide-react'
import { Badge, StatusDot } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

const problem = {
  id: 1,
  title: 'Two Sum',
  difficulty: 'easy',
  topic: 'Array',
  status: 'not-started',
  leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
  description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
  example: 'Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].',
  constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', '-10⁹ ≤ target ≤ 10⁹', 'Only one valid answer exists.'],
  addedAt: 'Jun 20, 2025',
}

const submissions = [
  { status: 'submitted', date: 'Jun 20, 2025 11:32 AM' },
  { status: 'reviewed', date: 'Jun 18, 2025 04:21 PM' },
]

const statusSteps = ['Not Started', 'Submitted', 'Reviewed']
const statusIndex: Record<string, number> = { 'not-started': 0, submitted: 1, reviewed: 2 }

export function ProblemDetail() {
  const currentStep = statusIndex[problem.status] ?? 0

  return (
    <div>
      <div className="flex items-center gap-2 mb-5 text-sm text-gray-500">
        <Link to="/student/problems" className="flex items-center gap-1 hover:text-accent">
          <ArrowLeft size={14} /> Back to Problems
        </Link>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{problem.title}</h1>
          <div className="flex items-center gap-2">
            <Badge variant={problem.difficulty}>{problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}</Badge>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-600">{problem.topic}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-sm text-gray-500 mr-2">
            <StatusDot status={problem.status} />
            <span className="capitalize">{problem.status.replace('-', ' ')}</span>
          </div>
          <a href={problem.leetcodeUrl} target="_blank" rel="noreferrer">
            <Button variant="secondary" size="sm">
              <ExternalLink size={13} /> LeetCode
            </Button>
          </a>
          <Link to={`/student/problems/${problem.id}/workspace`}>
            <Button size="sm">
              <Code2 size={13} /> Submit Solution
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left — description */}
        <div className="flex-1 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5 text-sm text-gray-700 leading-relaxed">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p style={{ whiteSpace: 'pre-line' }}>{problem.description}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Example</h3>
              <pre className="bg-gray-50 rounded-lg p-4 text-xs font-mono text-gray-800 whitespace-pre-wrap">{problem.example}</pre>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Constraints</h3>
              <ul className="list-disc list-inside space-y-1">
                {problem.constraints.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <ExternalLink size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Solve this problem on LeetCode first</p>
              <p className="text-xs text-blue-700 mt-1">
                Open the problem on LeetCode, run your code until all test cases pass, then come back here to submit your code and a screenshot as evidence.
              </p>
              <a href={problem.leetcodeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-blue-600 hover:underline">
                <ExternalLink size={11} /> {problem.leetcodeUrl}
              </a>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="w-72 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Problem Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Difficulty</span><Badge variant={problem.difficulty}>{problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}</Badge></div>
              <div className="flex justify-between"><span className="text-gray-500">Topic</span><span className="text-gray-900">{problem.topic}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Added</span><span className="text-gray-900">{problem.addedAt}</span></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Your Status</h3>
            <div className="relative flex items-center justify-between mb-3">
              <div className="absolute left-0 right-0 h-0.5 bg-gray-200 top-3 z-0" />
              <div className="absolute left-0 h-0.5 bg-accent top-3 z-0 transition-all" style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }} />
              {statusSteps.map((step, i) => (
                <div key={step} className="flex flex-col items-center z-10">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    i <= currentStep ? 'border-accent bg-accent' : 'border-gray-300 bg-white'
                  }`}>
                    {i <= currentStep && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1 text-center w-14 leading-tight">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {submissions.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800">Submissions</h3>
                <Link to="/student/submissions" className="text-xs text-accent hover:underline">View All →</Link>
              </div>
              <div className="space-y-2">
                {submissions.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <StatusDot status={s.status} />
                    <span className="text-gray-600">{s.date}</span>
                    <span className="ml-auto text-gray-500 capitalize">{s.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Link to={`/student/problems/${problem.id}/workspace`} className="block">
            <Button className="w-full justify-center">
              <Code2 size={15} /> Submit My Solution
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
