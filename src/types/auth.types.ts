import type { User } from './user.types'

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponseData {
  token: string
  token_type: string
  user: User
}

export interface AuthResponse {
  message: string
  data: AuthResponseData
}

export interface UserResponse {
  data: User
}

export interface LogoutResponse {
  message: string
}

