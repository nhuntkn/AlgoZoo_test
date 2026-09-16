export type ProblemType = 'DSA' | 'OS' | 'Database' | 'Other'
export type Difficulty = 'easy' | 'medium' | 'hard'

export type Resource = {
  id: number
  label: string
  url: string
  filename?: string
}

export type ProblemDraft = {
  title: string
  type: ProblemType
  difficulty: Difficulty
  description: string
  resources: Resource[]
}

export type Problem = {
  id: string
  title: string
  type: ProblemType
  difficulty: Difficulty
  description: string
  resources: Resource[]
  resource_url?: string
}
