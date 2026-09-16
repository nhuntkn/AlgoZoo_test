import type { User as BackendUser } from './user'

export type Role = 'student' | 'trainer' | 'admin'

export interface User {
  name: string
  email: string
  role: Role
  initials: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  time: string
  access_token_expires: string
  refresh_token_expires: string
  access_token: string
  refresh_token: string
  result: {
    status: string
    message: string
    data: BackendUser
  }
}

export interface RegisterRequest {
  token: string
  fullname: string
  email: string
  password: string
}

export interface RegisterResponse {
  status: string
  message: string
  data: {
    user: BackendUser & {
      classId: string
      className: string
    }
  }
}

export interface CurrentUserResponse {
  status: string
  message: string
  data: {
    user: BackendUser
  }
}

export interface LogoutResponse {
  status: string
  message: string
}

export interface RefreshTokenResponse {
  status: string
  message: string
}