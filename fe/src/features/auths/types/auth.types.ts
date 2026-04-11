import type { User } from '@/types/common.types'

// ─── Form Values ───────────────────────────────────────────────────────────

export interface LoginFormValues {
  email: string
  password: string
}

export interface RegisterFormValues {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface ForgotPasswordFormValues {
  email: string
}

export interface ResetPasswordFormValues {
  token: string
  password: string
  confirmPassword: string
}

// ─── API Payloads ──────────────────────────────────────────────────────────

export type LoginPayload = LoginFormValues
export type RegisterPayload = Omit<RegisterFormValues, 'confirmPassword'>

// ─── API Responses ─────────────────────────────────────────────────────────

export interface LoginApiResponse {
  user: User
  expiresIn: number
}

export interface RegisterApiResponse {
  user: User
  message: string
}
