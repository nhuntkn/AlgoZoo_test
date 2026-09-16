import type { ProblemType, Difficulty, Resource, Problem, ProblemDraft } from '../types/problem'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

type BackendProblemType = 'OS' | 'DB' | 'DSA' | 'OTHER'
type BackendDifficulty = 'Easy' | 'Medium' | 'Hard'

const typeToFE: Record<BackendProblemType, ProblemType> = {
  DSA: 'DSA',
  OS: 'OS',
  DB: 'Database',
  OTHER: 'Other',
}
const typeToBE: Record<ProblemType, BackendProblemType> = {
  DSA: 'DSA',
  OS: 'OS',
  Database: 'DB',
  Other: 'OTHER',
}
const difficultyToFE: Record<BackendDifficulty, Difficulty> = {
  Easy: 'easy',
  Medium: 'medium',
  Hard: 'hard',
}
const difficultyToBE: Record<Difficulty, BackendDifficulty> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

let nextResourceId = 9000

function toResources(problemUrl?: string): Resource[] {
  if (!problemUrl) return []
  return [{ id: nextResourceId++, label: 'Link', url: problemUrl }]
}

type BackendListItem = {
  problem_id: string
  title: string
  difficulty: BackendDifficulty | null
  problemType: BackendProblemType
}
type BackendDetail = BackendListItem & { description?: string; problemUrl?: string }

export function mapProblemType(problemType: string | null | undefined): ProblemType {
  return typeToFE[problemType as BackendProblemType] ?? 'Other'
}

function fromListItem(p: BackendListItem): Problem {
  return {
    id: p.problem_id,
    title: p.title,
    type: typeToFE[p.problemType] ?? 'Other',
    difficulty: p.difficulty ? difficultyToFE[p.difficulty] : 'medium',
    description: '',
    resources: [],
  }
}

function fromDetail(p: BackendDetail): Problem {
  return {
    ...fromListItem(p),
    description: p.description ?? '',
    resources: toResources(p.problemUrl),
    resource_url: p.problemUrl,
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}/api${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.message || 'Request failed')
  }
  return data
}

export async function listProblems(params?: { search?: string; difficulty?: Difficulty }): Promise<Problem[]> {
  const query = new URLSearchParams()
  if (params?.search) query.set('search', params.search)
  if (params?.difficulty) query.set('difficulty', difficultyToBE[params.difficulty])
  const qs = query.toString()
  const data = await request<{ data: BackendListItem[] }>(`/problems${qs ? `?${qs}` : ''}`)
  return data.data.map(fromListItem)
}

export async function getProblemDetail(id: string): Promise<Problem> {
  const data = await request<{ data: BackendDetail }>(`/problems/${id}`)
  return fromDetail(data.data)
}

// The composer only lets trainers pick a difficulty for DSA problems (disabled otherwise) —
// don't let its unused 'medium' default leak into the DB for OS/Database/Other problems.
function difficultyForBackend(draft: ProblemDraft): BackendDifficulty | null {
  return draft.type === 'DSA' ? difficultyToBE[draft.difficulty] : null
}

export async function createProblem(draft: ProblemDraft): Promise<Problem> {
  const data = await request<{ data: BackendDetail }>('/problems', {
    method: 'POST',
    body: JSON.stringify({
      title: draft.title,
      description: draft.description,
      problemType: typeToBE[draft.type],
      difficulty: difficultyForBackend(draft),
      problemUrl: draft.resources[0]?.url || undefined,
    }),
  })
  return fromDetail(data.data)
}

export async function updateProblem(id: string, draft: ProblemDraft): Promise<Problem> {
  const data = await request<{ data: BackendDetail }>(`/problems/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      title: draft.title,
      description: draft.description,
      problemType: typeToBE[draft.type],
      difficulty: difficultyForBackend(draft),
      problemUrl: draft.resources[0]?.url || undefined,
    }),
  })
  return fromDetail(data.data)
}

export async function deleteProblem(id: string): Promise<void> {
  await request(`/problems/${id}`, { method: 'DELETE' })
}
