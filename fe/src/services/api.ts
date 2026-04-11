import axios, { type AxiosError } from 'axios'
import { ROUTES } from '@/lib/constants'
import { useAuthStore } from '@/stores/useAuthStore'
import type { ApiErrorResponse } from '@/types/api.types'
import { API_ENDPOINTS } from './endpoints'

const SKIP_AUTH_FAILURE_URLS = [
  API_ENDPOINTS.AUTH.LOGIN,
  API_ENDPOINTS.AUTH.REGISTER,
  API_ENDPOINTS.AUTH.LOGOUT,
  API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
  API_ENDPOINTS.AUTH.RESET_PASSWORD,
  API_ENDPOINTS.AUTH.ME,
]

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  timeout: 1500000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Response Interceptor ──────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const requestUrl = error.config?.url ?? ''
    const isAuthUrl = SKIP_AUTH_FAILURE_URLS.some((url) => requestUrl.includes(url))

    if (error.response?.status === 401 && !isAuthUrl) {
      useAuthStore.getState().logout()
      if (window.location.pathname !== ROUTES.LOGIN) {
        window.location.assign(ROUTES.LOGIN)
      }
    }

    const responseData = error.response?.data
    const detailMessage =
      typeof responseData?.detail === 'string'
        ? responseData.detail
        : undefined

    const message =
      detailMessage ??
      responseData?.message ??
      error.message ??
      'Đã xảy ra lỗi không xác định'

    return Promise.reject(new Error(message))
  },
)

// ─── Helper Functions ──────────────────────────────────────────────────────

export async function apiGet<T>(url: string, params?: object): Promise<T> {
  const { data } = await api.get<T>(url, { params })
  return data
}

export async function apiPost<T>(url: string, body?: object): Promise<T> {
  const { data } = await api.post<T>(url, body)
  return data
}

export async function apiPut<T>(url: string, body?: object): Promise<T> {
  const { data } = await api.put<T>(url, body)
  return data
}

export async function apiDelete<T>(url: string): Promise<T> {
  const { data } = await api.delete<T>(url)
  return data
}