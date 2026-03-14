import axios, { type AxiosInstance } from 'axios'
import { supabase } from '@/lib/supabase'

const baseURL = import.meta.env.VITE_API_URL ?? ''

function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
  })

  client.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`
    }
    return config
  })

  client.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        supabase.auth.signOut().then(() => {
          window.location.href = '/login'
        })
      }
      return Promise.reject(err)
    }
  )

  return client
}

export const api = createApiClient()

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  limit: number
}

export interface ApiErrorLike {
  message: string
  status?: number
  code?: string
  name: string
}

export function createApiError(
  message: string,
  status?: number,
  code?: string
): ApiErrorLike {
  return { message, status, code, name: 'ApiError' }
}
