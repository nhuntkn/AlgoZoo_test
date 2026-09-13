import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ArrowLeft } from 'lucide-react'
import { Button } from '../../components/ui/Button'

export function CreateProblem() {
  const [examples, setExamples] = useState([{ input: '', output: '', explanation: '' }])
  const [testCases, setTestCases] = useState([{ input: '', expected: '' }, { input: '', expected: '' }])

  return (
    <div>
      <div className="flex items-center gap-2 mb-1 text-sm text-gray-500">
        <Link to="/trainer/problems" className="flex items-center gap-1 hover:text-accent">
          <ArrowLeft size={14} /> Problems
        </Link>
        <span>›</span>
        <span className="text-gray-700">New Problem</span>
      </div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Problem</h1>
        <p className="text-sm text-gray-500">Add a new DSA problem and assign it to your class</p>
      </div>

      <div className="flex gap-6">
        {/* Left - Problem Details */}
        <div className="flex-1 space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="font-semibold text-gray-800">Problem Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                placeholder="e.g. Two Sum II - Input Array Is Sorted"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
                  <option>Two Pointers</option>
                  <option>Array</option>
                  <option>Hash Table</option>
                  <option>Stack</option>
                  <option>Dynamic Programming</option>
                  <option>Graph</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={4}
                placeholder="Describe the problem statement..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Constraints</label>
              <textarea
                rows={3}
                placeholder="List input constraints, one per line..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
              />
            </div>

            {/* Examples */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium text-gray-700">Examples</label>
                <button
                  onClick={() => setExamples([...examples, { input: '', output: '', explanation: '' }])}
                  className="text-accent text-xs hover:underline flex items-center gap-1"
                >
                  <Plus size={12} /> Add Example
                </button>
              </div>
              {examples.map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 mb-3 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Input</label>
                      <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none" placeholder="nums = [2,7,11,15], target = 9" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Output</label>
                      <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none" placeholder="[0,1]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Explanation</label>
                    <textarea rows={2} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none resize-none" placeholder="Explain the example..." />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Test Cases + Assign */}
        <div className="w-80 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">Test Cases</h3>
              <button
                onClick={() => setTestCases([...testCases, { input: '', expected: '' }])}
                className="text-accent text-xs hover:underline flex items-center gap-1"
              >
                <Plus size={12} /> Add Test Case
              </button>
            </div>
            {testCases.map((_, i) => (
              <div key={i} className="mb-3 space-y-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Input</label>
                  <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Expected Output</label>
                  <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none" />
                </div>
                {i < testCases.length - 1 && <hr className="border-gray-100 mt-2" />}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Assign To</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
                  <option>NAB DSA Class — Cohort 4</option>
                  <option>NAB DSA Class — Cohort 3</option>
                  <option>Algorithms 101</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
        <Button variant="secondary">Save as Draft</Button>
        <Button>Publish &amp; Assign</Button>
      </div>
    </div>
  )
}
