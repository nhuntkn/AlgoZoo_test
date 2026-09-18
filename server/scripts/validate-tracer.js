// Exercises the Python tracer (server/src/utils/pythonTracer.js) against a self-hosted
// Piston instance and asserts the output is actually correct — in particular that
// multi-frame traces (function calls, recursion, custom objects) work, since that's the
// exact thing we could never validate on the WSL2/Docker Desktop dev setup (see the
// "Known Blocker" section of the Code Visualizer status doc).
//
// Run with PISTON_API_URL pointing at a running Piston instance, e.g.:
//   PISTON_API_URL=http://localhost:2000/api/v2 node scripts/validate-tracer.js
const fs = require('fs');
const path = require('path');
const { buildTraceHarness } = require('../src/utils/pythonTracer');
const { executeCode } = require('../src/utils/piston');

const OUT_DIR = path.join(__dirname, 'tracer-validation-output');
fs.mkdirSync(OUT_DIR, { recursive: true });

function maxFrameCount(trace) {
  return Math.max(...trace.steps.map((s) => s.frames.length));
}

const CASES = [
  {
    name: 'straight-line',
    code: 'x = 1\ny = 2\nz = x + y\nprint(z)\n',
    check: (trace) => {
      if (trace.error) throw new Error(`unexpected error: ${JSON.stringify(trace.error)}`);
      if (trace.steps.length < 4) throw new Error(`expected >=4 steps, got ${trace.steps.length}`);
      if (trace.stdout.trim() !== '3') throw new Error(`expected stdout '3', got ${JSON.stringify(trace.stdout)}`);
    },
  },
  {
    name: 'function-call',
    code: 'def add(a, b):\n    return a + b\n\nprint(add(1, 2))\n',
    check: (trace) => {
      if (trace.error) throw new Error(`unexpected error: ${JSON.stringify(trace.error)}`);
      if (maxFrameCount(trace) < 2) throw new Error(`expected a multi-frame trace, got max ${maxFrameCount(trace)} frame(s)`);
      if (trace.stdout.trim() !== '3') throw new Error(`expected stdout '3', got ${JSON.stringify(trace.stdout)}`);
    },
  },
  {
    name: 'loop',
    code: 'def total(arr):\n    result = 0\n    for x in arr:\n        result += x\n    return result\n\nprint(total([4, 1, 7]))\n',
    check: (trace) => {
      if (trace.error) throw new Error(`unexpected error: ${JSON.stringify(trace.error)}`);
      if (maxFrameCount(trace) < 2) throw new Error(`expected a multi-frame trace, got max ${maxFrameCount(trace)} frame(s)`);
      if (trace.stdout.trim() !== '12') throw new Error(`expected stdout '12', got ${JSON.stringify(trace.stdout)}`);
    },
  },
  {
    name: 'recursive-factorial',
    code: 'def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nprint(factorial(4))\n',
    check: (trace) => {
      if (trace.error) throw new Error(`unexpected error: ${JSON.stringify(trace.error)}`);
      // module frame + 4 nested factorial() calls at the deepest point
      if (maxFrameCount(trace) < 5) throw new Error(`expected recursion depth >=5, got max ${maxFrameCount(trace)} frame(s)`);
      if (trace.stdout.trim() !== '24') throw new Error(`expected stdout '24', got ${JSON.stringify(trace.stdout)}`);
    },
  },
  {
    name: 'linked-list-reversal',
    code:
      'class Node:\n    def __init__(self, val, next=None):\n        self.val = val\n        self.next = next\n\n' +
      'def reverse(head):\n    prev = None\n    curr = head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev\n\n' +
      'head = Node(1, Node(2, Node(3, None)))\nnew_head = reverse(head)\nprint(new_head.val)\n',
    check: (trace) => {
      if (trace.error) throw new Error(`unexpected error: ${JSON.stringify(trace.error)}`);
      if (maxFrameCount(trace) < 2) throw new Error(`expected a multi-frame trace, got max ${maxFrameCount(trace)} frame(s)`);
      const hasNodeInHeap = trace.steps.some((s) => Object.values(s.heap).some((entry) => entry.type === 'Node'));
      if (!hasNodeInHeap) throw new Error('expected at least one Node object to appear in the heap');
      if (trace.stdout.trim() !== '3') throw new Error(`expected stdout '3' (reversed head.val), got ${JSON.stringify(trace.stdout)}`);
    },
  },
  {
    name: 'runtime-error',
    code: 'x = 1\ny = 0\nprint(x / y)\n',
    check: (trace) => {
      if (!trace.error) throw new Error('expected an error for division by zero');
      if (trace.error.type !== 'ZeroDivisionError') throw new Error(`expected ZeroDivisionError, got ${trace.error.type}`);
    },
  },
];

async function main() {
  let failed = 0;

  for (const testCase of CASES) {
    process.stdout.write(`\n=== ${testCase.name} ===\n`);
    try {
      const harness = buildTraceHarness(testCase.code);
      const result = await executeCode({ language: 'python', code: harness, stdin: '' });
      const run = result.run || {};
      fs.writeFileSync(path.join(OUT_DIR, `${testCase.name}.raw.json`), JSON.stringify(result, null, 2));

      if (typeof run.code !== 'number' || run.code !== 0 || !run.stdout) {
        throw new Error(
          `sandbox did not exit cleanly (code=${run.code}, signal=${run.signal}, stderr=${(run.stderr || '').slice(0, 500)})`
        );
      }

      const trace = JSON.parse(run.stdout);
      fs.writeFileSync(path.join(OUT_DIR, `${testCase.name}.trace.json`), JSON.stringify(trace, null, 2));

      testCase.check(trace);
      console.log(`PASS — ${trace.steps.length} steps, up to ${maxFrameCount(trace)} frame(s) at once`);
    } catch (err) {
      failed += 1;
      console.error(`FAIL — ${err.message}`);
    }
  }

  console.log(`\n${CASES.length - failed}/${CASES.length} cases passed`);
  if (failed > 0) process.exit(1);
}

main();
