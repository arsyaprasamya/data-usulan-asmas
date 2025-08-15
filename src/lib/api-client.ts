import { ApiResponse, UsulanListResponse, Usulan, MasterData, AuthTokenResponse } from '@/types'

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || ''
    // Try to get token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}/api${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {})
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const config: RequestInit = {
      ...options,
      headers
    }

    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
  }

  // Authentication
  async generateToken(email: string, password: string): Promise<ApiResponse<AuthTokenResponse>> {
    return this.request<ApiResponse<AuthTokenResponse>>('/auth/token', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
  }

  // Master Data
  async getMasterData(): Promise<ApiResponse<MasterData>> {
    return this.request<ApiResponse<MasterData>>('/master')
  }

  // Usulan operations
  async getUsulan(params: {
    tahun?: number
    status_id?: number
    skpd_id?: number
    search?: string
    page?: number
    limit?: number
  } = {}): Promise<ApiResponse<UsulanListResponse>> {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString())
      }
    })

    const queryString = searchParams.toString()
    const endpoint = `/usulan${queryString ? `?${queryString}` : ''}`
    
    return this.request<ApiResponse<UsulanListResponse>>(endpoint)
  }

  async getUsulanById(id: number): Promise<ApiResponse<Usulan>> {
    return this.request<ApiResponse<Usulan>>(`/usulan/${id}`)
  }

  async createUsulan(data: Record<string, unknown>): Promise<ApiResponse<Usulan>> {
    return this.request<ApiResponse<Usulan>>('/usulan', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async updateUsulan(id: number, data: Record<string, unknown>): Promise<ApiResponse<Usulan>> {
    return this.request<ApiResponse<Usulan>>(`/usulan/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async deleteUsulan(id: number): Promise<ApiResponse<Record<string, unknown>>> {
    return this.request<ApiResponse<Record<string, unknown>>>(`/usulan/${id}`, {
      method: 'DELETE'
    })
  }
}

export const apiClient = new ApiClient()
