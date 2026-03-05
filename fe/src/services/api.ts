import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/useAuthStore'
import type { ApiErrorResponse, RefreshTokenResponse } from '@/types/api.types'
import { API_ENDPOINTS } from './endpoints'

// ─── Axios Instance ────────────────────────────────────────────────────────

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Token Refresh Logic ───────────────────────────────────────────────────

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  })
  failedQueue = []
}

// ─── Request Interceptor ──────────────────────────────────────────────────

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── Response Interceptor ──────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(api(originalRequest))
            },
            reject,
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = useAuthStore.getState().token
        const { data } = await axios.post<RefreshTokenResponse>(
          `${import.meta.env.VITE_API_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
          { refreshToken },
        )

        useAuthStore.getState().setToken(data.accessToken)
        processQueue(null, data.accessToken)

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        useAuthStore.getState().logout()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Extract error message
    const message =
      error.response?.data?.message ??
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