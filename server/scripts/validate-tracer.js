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

// Collects every heap snapshot of a list of the given length across all steps, as arrays
// of raw values — used to confirm a container's *mutation over time* was actually
// captured, not just its final state (the whole point of visualizing an in-place sort).
function listSnapshots(trace, len) {
  const snaps = [];
  for (const step of trace.steps) {
    for (const entry of Object.values(step.heap)) {
      if (entry.type === 'list' && entry.items.length === len) {
        snaps.push(JSON.stringify(entry.items.map((it) => it.value)));
      }
    }
  }
  return snaps;
}

function hasHeapType(trace, type) {
  return trace.steps.some((s) => Object.values(s.heap).some((entry) => entry.type === type));
}

function hasVarValue(trace, needle) {
  return trace.steps.some((s) =>
    s.frames.some((f) => f.vars.some(([, v]) => v.kind === 'value' && v.value === needle))
  );
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
    name: 'bubble-sort',
    code:
      'def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr\n\n' +
      'print(bubble_sort([5, 2, 4, 1, 3]))\n',
    check: (trace) => {
      if (trace.error) throw new Error(`unexpected error: ${JSON.stringify(trace.error)}`);
      if (trace.stdout.trim() !== '[1, 2, 3, 4, 5]') throw new Error(`expected sorted output, got ${JSON.stringify(trace.stdout)}`);
      const snaps = listSnapshots(trace, 5);
      const distinct = new Set(snaps);
      if (distinct.size < 2) throw new Error(`expected the array to visibly change across steps, got ${distinct.size} distinct snapshot(s)`);
      if (snaps[snaps.length - 1] !== JSON.stringify([1, 2, 3, 4, 5])) {
        throw new Error(`expected final array snapshot to be sorted, got ${snaps[snaps.length - 1]}`);
      }
    },
  },
  {
    name: 'binary-search',
    code:
      'def binary_search(arr, target, lo, hi):\n    if lo > hi:\n        return -1\n    mid = (lo + hi) // 2\n    if arr[mid] == target:\n        return mid\n    elif arr[mid] < target:\n        return binary_search(arr, target, mid + 1, hi)\n    else:\n        return binary_search(arr, target, lo, mid - 1)\n\n' +
      'nums = [1, 3, 5, 7, 9, 11, 13]\nprint(binary_search(nums, 11, 0, len(nums) - 1))\n',
    check: (trace) => {
      if (trace.error) throw new Error(`unexpected error: ${JSON.stringify(trace.error)}`);
      if (maxFrameCount(trace) < 3) throw new Error(`expected multiple nested binary_search frames, got max ${maxFrameCount(trace)} frame(s)`);
      if (trace.stdout.trim() !== '5') throw new Error(`expected stdout '5' (index of 11), got ${JSON.stringify(trace.stdout)}`);
    },
  },
  {
    name: 'graph-bfs',
    code:
      'def bfs(graph, start):\n    visited = {start}\n    order = []\n    queue = [start]\n    while queue:\n        node = queue.pop(0)\n        order.append(node)\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)\n    return order\n\n' +
      "graph = {'A': ['B', 'C'], 'B': ['A', 'D'], 'C': ['A', 'D'], 'D': ['B', 'C']}\nprint(bfs(graph, 'A'))\n",
    check: (trace) => {
      if (trace.error) throw new Error(`unexpected error: ${JSON.stringify(trace.error)}`);
      if (trace.stdout.trim() !== "['A', 'B', 'C', 'D']") throw new Error(`expected BFS order, got ${JSON.stringify(trace.stdout)}`);
      if (!hasHeapType(trace, 'dict')) throw new Error('expected the adjacency-list dict to appear in the heap');
      if (!hasHeapType(trace, 'set')) throw new Error('expected the visited set to appear in the heap');
    },
  },
  {
    name: 'binary-tree-inorder',
    code:
      'class TreeNode:\n    def __init__(self, val, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\n' +
      'def inorder(node, result):\n    if node is None:\n        return\n    inorder(node.left, result)\n    result.append(node.val)\n    inorder(node.right, result)\n\n' +
      'root = TreeNode(2, TreeNode(1), TreeNode(3))\nresult = []\ninorder(root, result)\nprint(result)\n',
    check: (trace) => {
      if (trace.error) throw new Error(`unexpected error: ${JSON.stringify(trace.error)}`);
      if (maxFrameCount(trace) < 3) throw new Error(`expected nested inorder() recursion, got max ${maxFrameCount(trace)} frame(s)`);
      if (!hasHeapType(trace, 'TreeNode')) throw new Error('expected TreeNode objects to appear in the heap');
      if (trace.stdout.trim() !== '[1, 2, 3]') throw new Error(`expected in-order traversal, got ${JSON.stringify(trace.stdout)}`);
    },
  },
  {
    name: 'validate-bst',
    code:
      'class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\n\n' +
      'class Solution:\n    def isValidBST(self, root):\n\n        def dfs(node, low, high):\n            if node is None:\n                return True\n\n            if node.val <= low or node.val >= high:\n                return False\n\n            return dfs(node.left, low, node.val) and \\\n                   dfs(node.right, node.val, high)\n\n        return dfs(root, float("-inf"), float("inf"))\n\n\n' +
      'root = TreeNode(\n    5,\n    TreeNode(3, TreeNode(2), TreeNode(4)),\n    TreeNode(7, TreeNode(6), TreeNode(8))\n)\n\n' +
      'solution = Solution()\n\nprint(solution.isValidBST(root))\n',
    check: (trace) => {
      if (trace.error) throw new Error(`unexpected error: ${JSON.stringify(trace.error)}`);
      if (trace.stdout.trim() !== 'True') throw new Error(`expected stdout 'True', got ${JSON.stringify(trace.stdout)}`);
      if (!hasHeapType(trace, 'TreeNode')) throw new Error('expected TreeNode objects to appear in the heap');
      if (maxFrameCount(trace) < 4) throw new Error(`expected nested dfs() recursion inside a method, got max ${maxFrameCount(trace)} frame(s)`);
      // float("-inf")/float("inf") serialize as bare Infinity/-Infinity tokens via json.dumps,
      // which JSON.parse on the client rejects outright — this is what actually broke without
      // the fix (JSON.parse(run.stdout) below would throw), not just a value-correctness issue.
      if (!hasVarValue(trace, '-Infinity') || !hasVarValue(trace, 'Infinity')) {
        throw new Error('expected float("-inf")/float("inf") to be sanitized into Infinity/-Infinity labels');
      }
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
