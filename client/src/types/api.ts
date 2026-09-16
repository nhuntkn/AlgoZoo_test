export interface ApiPayload {
  status?: string
  message?: string
  count?: number
  data?: Record<string, unknown>
  result?: {
    status?: string
    message?: string
    data?: Record<string, unknown>
  }
}

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}
