import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ImageIcon } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

const codeLines = [
  'function twoSum(nums, target) {',
  '  const map = new Map();',
  '  for (let i = 0; i < nums.length; i++) {',
  '    const complement = target - nums[i];',
  '    if (map.has(complement)) {',
  '      return [map.get(complement), i];',
  '    }',
  '    map.set(nums[i], i);',
  '  }',
  '  return [];',
  '}',
]

export function ReviewSubmission() {
  const [codeTab, setCodeTab] = useState<'code' | 'evidence'>('code')
  const [feedback, setFeedback] = useState('')
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <span className="text-3xl">✓</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Submission Reviewed</h2>
        <p className="text-gray-500 mb-6">Your feedback has been saved and the student will be notified.</p>
        <div className="flex gap-3">
          <Link to="/trainer/submissions"><Button variant="secondary">Back to Submissions</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Breadcrumb + header */}
      <div className="flex items-center gap-2 mb-1 text-sm text-gray-500">
        <Link to="/trainer/submissions" className="flex items-center gap-1 hover:text-accent">
          <ArrowLeft size={14} /> Submissions
        </Link>
        <span>›</span>
        <span className="text-gray-700">Trang Nguyen</span>
        <span>›</span>
        <span className="text-gray-700">Two Sum</span>
      </div>

      <div className="flex items-center justify-between mb-6 mt-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent text-white text-sm flex items-center justify-center font-bold">TN</div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Trang Nguyen</h1>
            <p className="text-sm text-gray-500">Two Sum — submitted 2h ago</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="easy">Easy</Badge>
          <Badge variant="awaiting-review">Awaiting Review</Badge>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left — Code + Evidence */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="flex gap-1 mb-4">
            {(['code', 'evidence'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setCodeTab(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                  codeTab === t ? 'bg-gray-900 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {t === 'code' ? 'Submitted Code' : 'Evidence Screenshot'}
              </button>
            ))}
          </div>

          {codeTab === 'code' && (
            <div className="bg-gray-900 rounded-xl overflow-hidden flex-1">
              <div className="px-4 py-2.5 border-b border-gray-700 flex items-center justify-between">
                <span className="text-xs text-gray-400">twoSum.js · JavaScript · Read-only</span>
              </div>
              <div className="p-4 font-mono text-sm overflow-auto">
                {codeLines.map((line, i) => (
                  <div key={i} className="flex hover:bg-gray-800/50">
                    <span className="text-gray-600 w-8 flex-shrink-0 text-right mr-4 select-none">{i + 1}</span>
                    <span className="text-gray-300">{line}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {codeTab === 'evidence' && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex-1 flex flex-col items-center justify-center p-8">
              <div className="w-full max-w-lg border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
                <ImageIcon size={36} />
                <p className="text-sm font-medium text-gray-600">Screenshot evidence</p>
                <p className="text-xs text-gray-400">Student uploaded a screenshot of their LeetCode execution</p>
                <div className="mt-2 bg-gray-50 rounded-lg px-4 py-2 text-xs text-gray-500">
                  [Screenshot preview would appear here]
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right — Feedback */}
        <div className="w-80 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-800 mb-1">Problem</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p className="font-medium text-gray-900">Two Sum</p>
              <div className="flex gap-2"><Badge variant="easy">Easy</Badge><span>Array</span></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 flex-1">
            <h3 className="font-semibold text-gray-800 mb-3">Your Feedback</h3>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={8}
              placeholder="Write feedback for Trang…&#10;&#10;Examples:&#10;- Great use of hash map for O(n) solution&#10;- Check edge case when array is empty&#10;- Line 4: consider using a more descriptive variable name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Button variant="success" className="w-full justify-center" onClick={() => setDone(true)}>
              Mark as Reviewed
            </Button>
            <p className="text-xs text-center text-gray-400">The student will see your feedback after you mark as reviewed.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
