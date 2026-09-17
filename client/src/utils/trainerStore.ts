export interface TrainerSubmission {
  id: string
  studentId: string
  studentName: string
  studentInitials: string
  classId: string
  className: string
  problemId: string
  problemTitle: string
  subject: 'DSA' | 'OS' | 'Database'
  submittedAt: string
  dateGroup: 'Last 7 days' | 'Last 14 days' | 'Last 30 days'
  status: 'pending' | 'reviewed' | 'late'
}

export const INITIAL_TRAINER_SUBMISSIONS: TrainerSubmission[] = [
  {
    id: 'sub-1',
    studentId: 'std-1',
    studentName: 'Alice Nguyen',
    studentInitials: 'AN',
    classId: 'wecamp-15',
    className: 'WeCamp Batch 15',
    problemId: 'prob-1',
    problemTitle: 'Two Sum',
    subject: 'DSA',
    submittedAt: '2 hours ago',
    dateGroup: 'Last 7 days',
    status: 'pending',
  },
  {
    id: 'sub-2',
    studentId: 'std-1',
    studentName: 'Alice Nguyen',
    studentInitials: 'AN',
    classId: 'wecamp-15',
    className: 'WeCamp Batch 15',
    problemId: 'prob-1',
    problemTitle: 'Two Sum',
    subject: 'DSA',
    submittedAt: '3 hours ago',
    dateGroup: 'Last 7 days',
    status: 'pending',
  },
  {
    id: 'sub-3',
    studentId: 'std-1',
    studentName: 'Alice Nguyen',
    studentInitials: 'AN',
    classId: 'wecamp-15',
    className: 'WeCamp Batch 15',
    problemId: 'prob-1',
    problemTitle: 'Two Sum',
    subject: 'DSA',
    submittedAt: '5 hours ago',
    dateGroup: 'Last 7 days',
    status: 'pending',
  },
  {
    id: 'sub-4',
    studentId: 'std-1',
    studentName: 'Alice Nguyen',
    studentInitials: 'AN',
    classId: 'wecamp-15',
    className: 'WeCamp Batch 15',
    problemId: 'prob-1',
    problemTitle: 'Two Sum',
    subject: 'DSA',
    submittedAt: 'Yesterday',
    dateGroup: 'Last 7 days',
    status: 'pending',
  },
  {
    id: 'sub-5',
    studentId: 'std-1',
    studentName: 'Alice Nguyen',
    studentInitials: 'AN',
    classId: 'wecamp-15',
    className: 'WeCamp Batch 15',
    problemId: 'prob-1',
    problemTitle: 'Two Sum',
    subject: 'DSA',
    submittedAt: '2 days ago',
    dateGroup: 'Last 7 days',
    status: 'pending',
  },
  {
    id: 'sub-6',
    studentId: 'std-1',
    studentName: 'Alice Nguyen',
    studentInitials: 'AN',
    classId: 'wecamp-15',
    className: 'WeCamp Batch 15',
    problemId: 'prob-1',
    problemTitle: 'Two Sum',
    subject: 'DSA',
    submittedAt: '3 days ago',
    dateGroup: 'Last 7 days',
    status: 'pending',
  },
  {
    id: 'sub-7',
    studentId: 'std-1',
    studentName: 'Alice Nguyen',
    studentInitials: 'AN',
    classId: 'wecamp-15',
    className: 'WeCamp Batch 15',
    problemId: 'prob-1',
    problemTitle: 'Two Sum',
    subject: 'DSA',
    submittedAt: '4 days ago',
    dateGroup: 'Last 7 days',
    status: 'pending',
  },
  {
    id: 'sub-8',
    studentId: 'std-1',
    studentName: 'Alice Nguyen',
    studentInitials: 'AN',
    classId: 'wecamp-15',
    className: 'WeCamp Batch 15',
    problemId: 'prob-1',
    problemTitle: 'Two Sum',
    subject: 'DSA',
    submittedAt: '5 days ago',
    dateGroup: 'Last 7 days',
    status: 'pending',
  },
  // Reviewed (6)
  {
    id: 'sub-9',
    studentId: 'std-2',
    studentName: 'Bob Tran',
    studentInitials: 'BT',
    classId: 'wecamp-15',
    className: 'WeCamp Batch 15',
    problemId: 'prob-2',
    problemTitle: 'Binary Search',
    subject: 'DSA',
    submittedAt: 'Yesterday',
    dateGroup: 'Last 7 days',
    status: 'reviewed',
  },
  {
    id: 'sub-10',
    studentId: 'std-3',
    studentName: 'Charlie Le',
    studentInitials: 'CL',
    classId: 'wecamp-22',
    className: 'WeCamp Batch 22',
    problemId: 'prob-3',
    problemTitle: 'Process Scheduling',
    subject: 'OS',
    submittedAt: '2 days ago',
    dateGroup: 'Last 7 days',
    status: 'reviewed',
  },
  {
    id: 'sub-11',
    studentId: 'std-4',
    studentName: 'David Pham',
    studentInitials: 'DP',
    classId: 'wecamp-22',
    className: 'WeCamp Batch 22',
    problemId: 'prob-4',
    problemTitle: 'SQL Queries',
    subject: 'Database',
    submittedAt: '3 days ago',
    dateGroup: 'Last 7 days',
    status: 'reviewed',
  },
  {
    id: 'sub-12',
    studentId: 'std-5',
    studentName: 'Emma Vu',
    studentInitials: 'EV',
    classId: 'starcamp-2',
    className: 'StarCamp Batch 2',
    problemId: 'prob-5',
    problemTitle: 'Merge Sort',
    subject: 'DSA',
    submittedAt: '4 days ago',
    dateGroup: 'Last 7 days',
    status: 'reviewed',
  },
  {
    id: 'sub-13',
    studentId: 'std-6',
    studentName: 'Frank Hoang',
    studentInitials: 'FH',
    classId: 'starcamp-2',
    className: 'StarCamp Batch 2',
    problemId: 'prob-6',
    problemTitle: 'Deadlock Detection',
    subject: 'OS',
    submittedAt: '5 days ago',
    dateGroup: 'Last 7 days',
    status: 'reviewed',
  },
  {
    id: 'sub-14',
    studentId: 'std-7',
    studentName: 'Grace Vo',
    studentInitials: 'GV',
    classId: 'wecamp-15',
    className: 'WeCamp Batch 15',
    problemId: 'prob-7',
    problemTitle: 'Indexing & B-Tree',
    subject: 'Database',
    submittedAt: '6 days ago',
    dateGroup: 'Last 7 days',
    status: 'reviewed',
  },
  // Late
  {
    id: 'sub-15',
    studentId: 'std-8',
    studentName: 'Henry Dinh',
    studentInitials: 'HD',
    classId: 'wecamp-15',
    className: 'WeCamp Batch 15',
    problemId: 'prob-8',
    problemTitle: 'Quick Sort',
    subject: 'DSA',
    submittedAt: 'Yesterday',
    dateGroup: 'Last 7 days',
    status: 'late',
  },
  {
    id: 'sub-16',
    studentId: 'std-9',
    studentName: 'Ivy Nguyen',
    studentInitials: 'IN',
    classId: 'wecamp-22',
    className: 'WeCamp Batch 22',
    problemId: 'prob-9',
    problemTitle: 'Virtual Memory',
    subject: 'OS',
    submittedAt: '3 days ago',
    dateGroup: 'Last 7 days',
    status: 'late',
  },
  {
    id: 'sub-17',
    studentId: 'std-10',
    studentName: 'Jack Do',
    studentInitials: 'JD',
    classId: 'starcamp-2',
    className: 'StarCamp Batch 2',
    problemId: 'prob-10',
    problemTitle: 'Transactions & ACID',
    subject: 'Database',
    submittedAt: '5 days ago',
    dateGroup: 'Last 7 days',
    status: 'late',
  },
  {
    id: 'sub-18',
    studentId: 'std-11',
    studentName: 'Kelly Bui',
    studentInitials: 'KB',
    classId: 'wecamp-15',
    className: 'WeCamp Batch 15',
    problemId: 'prob-11',
    problemTitle: 'Graph BFS & DFS',
    subject: 'DSA',
    submittedAt: '6 days ago',
    dateGroup: 'Last 7 days',
    status: 'late',
  },
]

const STORAGE_KEY = 'algozoo_trainer_submissions_v2'

export function getTrainerSubmissions(): TrainerSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length >= INITIAL_TRAINER_SUBMISSIONS.length) {
        return parsed
      }
    }
  } catch {
    // fallback
  }
  return INITIAL_TRAINER_SUBMISSIONS
}

export function saveTrainerSubmissions(subs: TrainerSubmission[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subs))
  } catch {
    // ignore
  }
}

// ─── Trainer Classes & Problems ─────────────────────────────────────────────

export interface TrainerClass {
  id: string
  name: string
  program: string
  status: 'Active' | 'Inactive'
  studentsCount: number
  submittedCount: number
  totalRequired: number
  progress: number
  description: string
  trainersCount: number
  totalProblems: number
  totalSubmissions: number
  reviewedCount: number
  pendingCount: number
  recentActivity: { id: string; text: string; time: string }[]
}

export const INITIAL_TRAINER_CLASSES: TrainerClass[] = [
  {
    id: 'wecamp-21',
    name: 'WeCamp Batch 21',
    program: 'NAB WeCamp Batch 21 — DSA Training',
    status: 'Active',
    studentsCount: 25,
    submittedCount: 18,
    totalRequired: 25,
    progress: 72,
    description: 'NAB WeCamp Batch 21 — DSA Training Program',
    trainersCount: 2,
    totalProblems: 8,
    totalSubmissions: 45,
    reviewedCount: 30,
    pendingCount: 15,
    recentActivity: [
      { id: '1', text: 'Alice Nguyen submitted Two Sum', time: '2h ago' },
      { id: '2', text: "Bob Tran's Binary Search was reviewed", time: '5h ago' },
      { id: '3', text: 'Carol Lee submitted Process Scheduling', time: '1d ago' },
      { id: '4', text: 'Minh Pham joined the class', time: '1d ago' },
      { id: '5', text: 'Two Sum deadline extended to Sep 25', time: '2d ago' },
    ],
  },
  {
    id: 'wecamp-22',
    name: 'WeCamp Batch 22',
    program: 'NAB WeCamp Batch 22 — DSA Training',
    status: 'Active',
    studentsCount: 23,
    submittedCount: 10,
    totalRequired: 23,
    progress: 43,
    description: 'NAB WeCamp Batch 22 — DSA Training Program',
    trainersCount: 2,
    totalProblems: 6,
    totalSubmissions: 28,
    reviewedCount: 18,
    pendingCount: 10,
    recentActivity: [
      { id: '1', text: 'David Pham submitted SQL Queries', time: '1d ago' },
      { id: '2', text: 'Kelly Bui joined the class', time: '2d ago' },
    ],
  },
]

export interface TrainerAssignedProblem {
  id: string
  classId: string
  title: string
  subject: 'DSA' | 'OS' | 'Database'
  deadline: string
  submitted: number
  total: number
  progress: number
}

export const INITIAL_ASSIGNED_PROBLEMS: TrainerAssignedProblem[] = [
  {
    id: 'prob-1',
    classId: 'wecamp-21',
    title: 'Two Sum',
    subject: 'DSA',
    deadline: 'Sep 20',
    submitted: 18,
    total: 25,
    progress: 72,
  },
  {
    id: 'prob-2',
    classId: 'wecamp-21',
    title: 'Binary Search',
    subject: 'DSA',
    deadline: 'Sep 22',
    submitted: 10,
    total: 25,
    progress: 40,
  },
  {
    id: 'prob-3',
    classId: 'wecamp-21',
    title: 'Reverse Linked List',
    subject: 'DSA',
    deadline: 'Sep 25',
    submitted: 6,
    total: 25,
    progress: 24,
  },
  {
    id: 'prob-4',
    classId: 'wecamp-21',
    title: 'Process Scheduling',
    subject: 'OS',
    deadline: 'Sep 18',
    submitted: 20,
    total: 25,
    progress: 80,
  },
  {
    id: 'prob-5',
    classId: 'wecamp-21',
    title: 'Memory Management',
    subject: 'OS',
    deadline: 'Sep 28',
    submitted: 3,
    total: 25,
    progress: 12,
  },
]

export interface BankProblemResource {
  id: string
  type: 'link' | 'file'
  title: string
  url?: string
  fileName?: string
}

export interface BankProblem {
  id: string
  title: string
  subject: 'DSA' | 'OS' | 'Database' | 'Other'
  difficulty: 'Easy' | 'Medium' | 'Hard'
  description: string
  resource?: string
  example?: string
  constraints?: string[]
  resources?: BankProblemResource[]
  createdAt?: string
}

export const INITIAL_PROBLEM_BANK: BankProblem[] = [
  {
    id: 'bank-1',
    title: 'Two Sum',
    subject: 'DSA',
    difficulty: 'Easy',
    description: `Given an array of integers nums and an integer target , return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]

Constraints:
  2 ≤ nums.length ≤ 10⁴
  -10⁹ < nums[i] < 10⁹`,
    example: 'Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]',
    constraints: [
      '2 ≤ nums.length ≤ 10⁴',
      '-10⁹ < nums[i] < 10⁹',
      'Only one valid answer exists',
    ],
    resource: 'https://leetcode.com/problems/two-sum/',
    resources: [
      { id: 'res-1', type: 'link', title: 'LeetCode', url: 'https://leetcode.com/problems/two-sum/' },
    ],
    createdAt: '2026-09-01',
  },
  {
    id: 'bank-2',
    title: 'Binary Search',
    subject: 'DSA',
    difficulty: 'Easy',
    description:
      'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.',
    example: 'Input: nums = [-1,0,3,5,9,12], target = 9\nOutput: 4',
    constraints: [
      '1 ≤ nums.length ≤ 10⁴',
      '-10⁴ < nums[i], target < 10⁴',
      'All integers in nums are unique.',
      'nums is sorted in ascending order.',
    ],
    resource: 'https://leetcode.com/problems/binary-search/',
    resources: [
      { id: 'res-2', type: 'link', title: 'LeetCode', url: 'https://leetcode.com/problems/binary-search/' },
    ],
    createdAt: '2026-09-02',
  },
  {
    id: 'bank-3',
    title: 'Reverse Linked List',
    subject: 'DSA',
    difficulty: 'Easy',
    description:
      'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    example: 'Input: head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]',
    constraints: [
      'The number of nodes in the list is the range [0, 5000].',
      '-5000 ≤ Node.val ≤ 5000',
    ],
    resource: 'https://leetcode.com/problems/reverse-linked-list/',
    resources: [
      { id: 'res-3', type: 'link', title: 'LeetCode', url: 'https://leetcode.com/problems/reverse-linked-list/' },
    ],
    createdAt: '2026-09-03',
  },
  {
    id: 'bank-4',
    title: 'Binary Tree Level Order Traversal',
    subject: 'DSA',
    difficulty: 'Medium',
    description:
      'Given the root of a binary tree, return the level order traversal of its nodes values. (i.e., from left to right, level by level).',
    example: 'Input: root = [3,9,20,null,null,15,7]\nOutput: [[3],[9,20],[15,7]]',
    constraints: [
      'The number of nodes in the tree is in the range [0, 2000].',
      '-1000 ≤ Node.val ≤ 1000',
    ],
    resource: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
    resources: [
      { id: 'res-4', type: 'link', title: 'LeetCode', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
    ],
    createdAt: '2026-09-04',
  },
  {
    id: 'bank-5',
    title: 'Course Schedule',
    subject: 'DSA',
    difficulty: 'Medium',
    description:
      'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return true if you can finish all courses.',
    example: 'Input: numCourses = 2, prerequisites = [[1,0]]\nOutput: true',
    constraints: [
      '1 ≤ numCourses ≤ 2000',
      '0 ≤ prerequisites.length ≤ 5000',
    ],
    resource: 'https://leetcode.com/problems/course-schedule/',
    resources: [
      { id: 'res-5', type: 'link', title: 'LeetCode', url: 'https://leetcode.com/problems/course-schedule/' },
    ],
    createdAt: '2026-09-05',
  },
  {
    id: 'bank-6',
    title: 'Process Scheduling',
    subject: 'OS',
    difficulty: 'Medium',
    description:
      'Implement CPU scheduling algorithms including First-Come, First-Served (FCFS), Shortest Job First (SJF), and Round Robin (RR). Calculate average turnaround and waiting times for a set of given processes.',
    example: 'Input: processes = [{pid: 1, arrival: 0, burst: 5}, {pid: 2, arrival: 1, burst: 3}]\nOutput: Average Waiting Time = 2.5',
    constraints: [
      'Process arrival times ≥ 0',
      'Burst times > 0',
      'Non-negative time units',
    ],
    resource: 'https://en.wikipedia.org/wiki/Scheduling_(computing)',
    resources: [
      { id: 'res-6', type: 'link', title: 'Wikipedia - CPU Scheduling', url: 'https://en.wikipedia.org/wiki/Scheduling_(computing)' },
    ],
    createdAt: '2026-09-06',
  },
  {
    id: 'bank-7',
    title: 'Memory Management',
    subject: 'OS',
    difficulty: 'Medium',
    description:
      'Simulate virtual memory paging and page replacement algorithms such as FIFO, LRU, and Optimal. Track page hits, misses, and page fault rates given a reference string and fixed frame allocation.',
    example: 'Input: pages = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3], frames = 3\nOutput: Page Faults = 7',
    constraints: [
      'Reference string length ≤ 100',
      'Frame capacity 2 ≤ frames ≤ 10',
    ],
    resource: 'https://en.wikipedia.org/wiki/Page_replacement_algorithm',
    resources: [
      { id: 'res-7', type: 'link', title: 'Wikipedia - Page Replacement', url: 'https://en.wikipedia.org/wiki/Page_replacement_algorithm' },
    ],
    createdAt: '2026-09-07',
  },
  {
    id: 'bank-8',
    title: 'Deadlock Detection',
    subject: 'OS',
    difficulty: 'Hard',
    description:
      'Implement the Banker algorithm or cycle detection on a Resource Allocation Graph (RAG) to determine whether a given system state contains a deadlock or if it is in a safe execution state.',
    example: 'Input: Allocation = [[0,1,0],[2,0,0]], Max = [[7,5,3],[3,2,2]], Available = [3,3,2]\nOutput: Safe state = true, Sequence = [P1, P0]',
    constraints: [
      'Number of processes ≤ 20',
      'Number of resource types ≤ 10',
    ],
    resource: 'https://en.wikipedia.org/wiki/Banker%27s_algorithm',
    resources: [
      { id: 'res-8', type: 'link', title: 'Wikipedia - Deadlock Detection', url: 'https://en.wikipedia.org/wiki/Banker%27s_algorithm' },
    ],
    createdAt: '2026-09-08',
  },
  {
    id: 'bank-9',
    title: 'SQL Queries',
    subject: 'Database',
    difficulty: 'Easy',
    description:
      'Write an SQL query to find employees who have the highest salary in each of the departments from an Employee and Department table schema.',
    example: 'Input: Employee = [{id: 1, name: "Joe", salary: 85000, departmentId: 1}]\nOutput: Department | Employee | Salary',
    constraints: [
      'Table contains non-null IDs',
      'Salaries are positive integers',
    ],
    resource: 'https://leetcode.com/problems/department-highest-salary/',
    resources: [
      { id: 'res-9', type: 'link', title: 'LeetCode', url: 'https://leetcode.com/problems/department-highest-salary/' },
    ],
    createdAt: '2026-09-09',
  },
  {
    id: 'bank-10',
    title: 'Joins & Aggregations',
    subject: 'Database',
    difficulty: 'Medium',
    description:
      'Write an SQL query to combine records from multiple relational tables using INNER, LEFT, and FULL OUTER joins with GROUP BY and aggregate functions like COUNT, SUM, and AVG.',
    example: 'Input: Customers table, Orders table\nOutput: CustomerName | TotalOrders | TotalSpent',
    constraints: [
      'Customer IDs are foreign keys in Orders',
      'Group by CustomerId and CustomerName',
    ],
    resource: 'https://leetcode.com/problems/combine-two-tables/',
    resources: [
      { id: 'res-10', type: 'link', title: 'LeetCode', url: 'https://leetcode.com/problems/combine-two-tables/' },
    ],
    createdAt: '2026-09-10',
  },
  {
    id: 'bank-11',
    title: 'Database Normalization',
    subject: 'Database',
    difficulty: 'Medium',
    description:
      'Analyze an unnormalized database relation, determine functional dependencies, identify candidate keys, and decompose relations into 1NF, 2NF, 3NF, and BCNF while preserving dependencies and lossless join.',
    example: 'Input: R(A, B, C, D), F = {A -> B, B -> C, C -> D}\nOutput: Candidate Key: A, Highest Normal Form: 2NF, Decomposed to BCNF',
    constraints: [
      'Lossless join decomposition required',
      'Identify all functional dependencies',
    ],
    resource: 'https://en.wikipedia.org/wiki/Database_normalization',
    resources: [
      { id: 'res-11', type: 'link', title: 'Wikipedia - Normalization', url: 'https://en.wikipedia.org/wiki/Database_normalization' },
    ],
    createdAt: '2026-09-11',
  },
]

export const PROBLEM_BANK: BankProblem[] = INITIAL_PROBLEM_BANK

const PROBLEM_BANK_STORAGE_KEY = 'algozoo_trainer_problem_bank_v2'

export function getTrainerProblemBank(): BankProblem[] {
  try {
    const raw = localStorage.getItem(PROBLEM_BANK_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as BankProblem[]
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // fallback
  }
  return INITIAL_PROBLEM_BANK
}

export function getTrainerProblemBankById(id: string): BankProblem | undefined {
  const all = getTrainerProblemBank()
  return all.find((p) => p.id === id)
}

export function createTrainerProblem(
  data: Omit<BankProblem, 'id' | 'createdAt'>
): BankProblem {
  const all = getTrainerProblemBank()
  const newProblem: BankProblem = {
    ...data,
    id: `bank-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
  }
  const updated = [newProblem, ...all]
  try {
    localStorage.setItem(PROBLEM_BANK_STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new Event('algozoo_problem_bank_updated'))
  } catch (e) {
    console.error(e)
  }
  return newProblem
}

export function updateTrainerProblem(
  id: string,
  updates: Partial<BankProblem>
): BankProblem | null {
  const all = getTrainerProblemBank()
  const idx = all.findIndex((p) => p.id === id)
  if (idx === -1) return null

  const updatedProblem = { ...all[idx], ...updates }
  all[idx] = updatedProblem
  try {
    localStorage.setItem(PROBLEM_BANK_STORAGE_KEY, JSON.stringify(all))
    window.dispatchEvent(new Event('algozoo_problem_bank_updated'))
  } catch (e) {
    console.error(e)
  }
  return updatedProblem
}

export function deleteTrainerProblem(id: string): boolean {
  const all = getTrainerProblemBank()
  const filtered = all.filter((p) => p.id !== id)
  try {
    localStorage.setItem(PROBLEM_BANK_STORAGE_KEY, JSON.stringify(filtered))
    window.dispatchEvent(new Event('algozoo_problem_bank_updated'))
  } catch (e) {
    console.error(e)
  }
  return true
}

const CLASSES_STORAGE_KEY = 'algozoo_trainer_classes'
const PROBLEMS_STORAGE_KEY = 'algozoo_trainer_assigned_problems'

export function getTrainerClasses(): TrainerClass[] {
  try {
    const raw = localStorage.getItem(CLASSES_STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // fallback
  }
  return INITIAL_TRAINER_CLASSES
}

export function getTrainerClassById(classId: string): TrainerClass | undefined {
  const classes = getTrainerClasses()
  return classes.find((c) => c.id === classId) ?? classes[0]
}

export function getTrainerAssignedProblems(classId: string): TrainerAssignedProblem[] {
  try {
    const raw = localStorage.getItem(PROBLEMS_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return parsed.filter((p: TrainerAssignedProblem) => p.classId === classId)
    }
  } catch {
    // fallback
  }
  return INITIAL_ASSIGNED_PROBLEMS.filter((p) => p.classId === classId)
}

export function assignProblemsToClass(
  classId: string,
  newProblems: { title: string; subject: 'DSA' | 'OS' | 'Database'; deadline: string }[]
): TrainerAssignedProblem[] {
  const current = (() => {
    try {
      const raw = localStorage.getItem(PROBLEMS_STORAGE_KEY)
      if (raw) return JSON.parse(raw) as TrainerAssignedProblem[]
    } catch {
      // fallback
    }
    return [...INITIAL_ASSIGNED_PROBLEMS]
  })()

  const created: TrainerAssignedProblem[] = newProblems.map((np, idx) => ({
    id: `assigned-${Date.now()}-${idx}`,
    classId,
    title: np.title,
    subject: np.subject,
    deadline: np.deadline || 'Sep 30',
    submitted: 0,
    total: 25,
    progress: 0,
  }))

  const updated = [...current, ...created]
  try {
    localStorage.setItem(PROBLEMS_STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // ignore
  }

  return updated.filter((p) => p.classId === classId)
}

export function removeAssignedProblem(problemId: string, classId: string): TrainerAssignedProblem[] {
  const current = (() => {
    try {
      const raw = localStorage.getItem(PROBLEMS_STORAGE_KEY)
      if (raw) return JSON.parse(raw) as TrainerAssignedProblem[]
    } catch {
      // fallback
    }
    return [...INITIAL_ASSIGNED_PROBLEMS]
  })()

  const updated = current.filter((p) => p.id !== problemId)
  try {
    localStorage.setItem(PROBLEMS_STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // ignore
  }

  return updated.filter((p) => p.classId === classId)
}

// ─── Class-scoped Submissions (for Submissions tab & detail) ────────────────

export interface TrainerClassSubmission {
  id: string
  classId: string
  problemId: string
  problemTitle: string
  subject: 'DSA' | 'OS' | 'Database'
  studentId: string
  studentName: string
  studentInitials: string
  submittedDate: string
  submittedFull: string
  status: 'pending' | 'reviewed'
  isLate: boolean
  feedback: string
  explanation: string
  code: string
  language: string
  screenshotFile: string
  resourceUrl: string
  problemDescription: string
  problemConstraints: string[]
  problemExamples: { input: string; output: string }[]
}

export const INITIAL_CLASS_SUBMISSIONS: TrainerClassSubmission[] = [
  {
    id: 'csub-1',
    classId: 'wecamp-21',
    problemId: 'prob-5',
    problemTitle: 'Memory Management',
    subject: 'OS',
    studentId: 'std-6',
    studentName: 'An Tran',
    studentInitials: 'AT',
    submittedDate: 'Sep 7',
    submittedFull: 'Sep 7, 2026 at 10:20 AM',
    status: 'reviewed',
    isLate: true,
    feedback: 'Good understanding of paging concepts.',
    explanation: 'Implemented page replacement algorithms including FIFO and LRU.',
    code: `def fifo_page_replacement(pages, frame_count):
    frames = []
    faults = 0
    for page in pages:
        if page not in frames:
            faults += 1
            if len(frames) >= frame_count:
                frames.pop(0)
            frames.append(page)
    return faults`,
    language: 'Python',
    screenshotFile: 'memory-paging-test.png',
    resourceUrl: 'https://en.wikipedia.org/wiki/Page_replacement_algorithm',
    problemDescription: 'Implement page replacement algorithms (FIFO, LRU) for virtual memory management.',
    problemConstraints: ['Fixed number of frames.', 'Track page faults.'],
    problemExamples: [
      { input: 'Input: pages = [1,2,3,4,1,2,5], frames = 3', output: 'Output: faults = 5' },
    ],
  },
  {
    id: 'csub-2',
    classId: 'wecamp-21',
    problemId: 'prob-4',
    problemTitle: 'Process Scheduling',
    subject: 'OS',
    studentId: 'std-5',
    studentName: 'Ha Le',
    studentInitials: 'HL',
    submittedDate: 'Sep 8',
    submittedFull: 'Sep 8, 2026 at 1:45 PM',
    status: 'pending',
    isLate: false,
    feedback: '',
    explanation: 'Implemented Priority Scheduling with aging to prevent starvation.',
    code: `def priority_scheduling(processes):
    processes.sort(key=lambda p: p['priority'])
    time = 0
    for p in processes:
        if time < p['arrival']:
            time = p['arrival']
        p['wait'] = time - p['arrival']
        time += p['burst']
    return processes`,
    language: 'Python',
    screenshotFile: '',
    resourceUrl: 'https://en.wikipedia.org/wiki/Scheduling_(computing)',
    problemDescription: 'Implement First-Come-First-Served (FCFS) and Shortest Job First (SJF) CPU scheduling algorithms.',
    problemConstraints: ['Processes have arrival time and burst time.', 'Non-preemptive scheduling.'],
    problemExamples: [
      { input: 'Input: processes = [{pid:1, arrival:0, burst:4}, {pid:2, arrival:1, burst:3}]', output: 'Output: [{pid:1, wait:0}, {pid:2, wait:3}]' },
    ],
  },
  {
    id: 'csub-3',
    classId: 'wecamp-21',
    problemId: 'prob-2',
    problemTitle: 'Binary Search',
    subject: 'DSA',
    studentId: 'std-2',
    studentName: 'Bob Tran',
    studentInitials: 'BT',
    submittedDate: 'Sep 9',
    submittedFull: 'Sep 9, 2026 at 4:00 PM',
    status: 'reviewed',
    isLate: false,
    feedback: 'Clean iterative solution, well done!',
    explanation: 'Used iterative approach with two pointers.',
    code: `def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
    language: 'Python',
    screenshotFile: 'leetcode-accepted.png',
    resourceUrl: 'https://leetcode.com/problems/binary-search/',
    problemDescription:
      'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.',
    problemConstraints: [
      '1 ≤ nums.length ≤ 10⁴',
      '-10⁴ < nums[i], target < 10⁴',
      'All integers in nums are unique.',
      'nums is sorted in ascending order.',
    ],
    problemExamples: [
      { input: 'Input: nums = [-1,0,3,5,9,12], target = 9', output: 'Output: 4' },
      { input: 'Input: nums = [-1,0,3,5,9,12], target = 2', output: 'Output: -1' },
    ],
  },
  {
    id: 'csub-4',
    classId: 'wecamp-21',
    problemId: 'prob-1',
    problemTitle: 'Two Sum',
    subject: 'DSA',
    studentId: 'std-1',
    studentName: 'Alice Nguyen',
    studentInitials: 'AN',
    submittedDate: 'Sep 10',
    submittedFull: 'Sep 10, 2026 at 4:32 PM',
    status: 'pending',
    isLate: false,
    feedback: '',
    explanation:
      'My approach is to use a hash map to store previously seen numbers. For each number, I check if the complement (target - current) already exists in the map. This gives us O(n) time complexity.',
    code: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    language: 'Python',
    screenshotFile: 'leetcode-accepted.png',
    resourceUrl: 'https://leetcode.com/problems/two-sum/',
    problemDescription:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
    problemConstraints: [
      '2 ≤ nums.length ≤ 10⁴',
      '-10⁹ ≤ nums[i] ≤ 10⁹',
      'Only one valid answer exists.',
    ],
    problemExamples: [
      { input: 'Input: nums = [2,7,11,15], target = 9', output: 'Output: [0,1]' },
      { input: 'Input: nums = [3,2,4], target = 6', output: 'Output: [1,2]' },
    ],
  },
  {
    id: 'csub-5',
    classId: 'wecamp-21',
    problemId: 'prob-1',
    problemTitle: 'Two Sum',
    subject: 'DSA',
    studentId: 'std-3',
    studentName: 'Carol Lee',
    studentInitials: 'CL',
    submittedDate: 'Sep 11',
    submittedFull: 'Sep 11, 2026 at 9:15 AM',
    status: 'pending',
    isLate: true,
    feedback: '',
    explanation:
      'I used a brute force approach with two nested loops to check every pair of numbers.',
    code: `def two_sum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`,
    language: 'Python',
    screenshotFile: 'leetcode-accepted.png',
    resourceUrl: 'https://leetcode.com/problems/two-sum/',
    problemDescription:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
    problemConstraints: [
      '2 ≤ nums.length ≤ 10⁴',
      '-10⁹ ≤ nums[i] ≤ 10⁹',
      'Only one valid answer exists.',
    ],
    problemExamples: [
      { input: 'Input: nums = [2,7,11,15], target = 9', output: 'Output: [0,1]' },
      { input: 'Input: nums = [3,2,4], target = 6', output: 'Output: [1,2]' },
    ],
  },
  {
    id: 'csub-6',
    classId: 'wecamp-21',
    problemId: 'prob-2',
    problemTitle: 'Binary Search',
    subject: 'DSA',
    studentId: 'std-4',
    studentName: 'Minh Pham',
    studentInitials: 'MP',
    submittedDate: 'Sep 12',
    submittedFull: 'Sep 12, 2026 at 8:30 AM',
    status: 'reviewed',
    isLate: false,
    feedback: 'Good recursive approach.',
    explanation: 'Recursive binary search implementation.',
    code: `def binary_search(arr, target, lo=0, hi=None):
    if hi is None: hi = len(arr) - 1
    if lo > hi: return -1
    mid = (lo + hi) // 2
    if arr[mid] == target: return mid
    elif arr[mid] < target: return binary_search(arr, target, mid+1, hi)
    else: return binary_search(arr, target, lo, mid-1)`,
    language: 'Python',
    screenshotFile: 'leetcode-accepted.png',
    resourceUrl: 'https://leetcode.com/problems/binary-search/',
    problemDescription:
      'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.',
    problemConstraints: [
      '1 ≤ nums.length ≤ 10⁴',
      '-10⁴ < nums[i], target < 10⁴',
      'All integers in nums are unique.',
      'nums is sorted in ascending order.',
    ],
    problemExamples: [
      { input: 'Input: nums = [-1,0,3,5,9,12], target = 9', output: 'Output: 4' },
      { input: 'Input: nums = [-1,0,3,5,9,12], target = 2', output: 'Output: -1' },
    ],
  },
]

const CLASS_SUBMISSIONS_KEY = 'algozoo_trainer_class_submissions_v3'


export function getTrainerClassSubmissions(classId: string): TrainerClassSubmission[] {
  try {
    const raw = localStorage.getItem(CLASS_SUBMISSIONS_KEY)
    if (raw) {
      const all: TrainerClassSubmission[] = JSON.parse(raw)
      return all.filter((s) => s.classId === classId)
    }
  } catch {
    // fallback
  }
  return INITIAL_CLASS_SUBMISSIONS.filter((s) => s.classId === classId)
}

export function getTrainerSubmissionById(submissionId: string): TrainerClassSubmission | undefined {
  try {
    const raw = localStorage.getItem(CLASS_SUBMISSIONS_KEY)
    if (raw) {
      const all: TrainerClassSubmission[] = JSON.parse(raw)
      const found = all.find((s) => s.id === submissionId)
      if (found) return found
    }
  } catch {
    // fallback
  }
  return INITIAL_CLASS_SUBMISSIONS.find((s) => s.id === submissionId)
}

export function markSubmissionReviewed(submissionId: string, feedback: string): TrainerClassSubmission | null {
  const all = (() => {
    try {
      const raw = localStorage.getItem(CLASS_SUBMISSIONS_KEY)
      if (raw) return JSON.parse(raw) as TrainerClassSubmission[]
    } catch {
      // fallback
    }
    return [...INITIAL_CLASS_SUBMISSIONS]
  })()

  const idx = all.findIndex((s) => s.id === submissionId)
  if (idx === -1) return null

  all[idx] = { ...all[idx], status: 'reviewed', feedback, isLate: all[idx].isLate }

  try {
    localStorage.setItem(CLASS_SUBMISSIONS_KEY, JSON.stringify(all))
    window.dispatchEvent(new Event('algozoo_trainer_classes_updated'))
  } catch {
    // ignore
  }

  return all[idx]
}
