'use client'

import { useState, useEffect } from 'react'
import { Usulan, MasterData, PaginationMeta } from '@/types'
import { apiClient } from '@/lib/api-client'
import UsulanCard from '@/components/UsulanCard'
import FilterBar from '@/components/FilterBar'
import Pagination from '@/components/Pagination'
import { AlertCircle, Loader2, LogIn, Database } from 'lucide-react'

export default function Home() {
  const [usulan, setUsulan] = useState<Usulan[]>([])
  const [masterData, setMasterData] = useState<MasterData | null>(null)
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 12,
    total: 0,
    total_pages: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)

  // Authentication form
  const [email, setEmail] = useState('admin@usulan-asmas.com')
  const [password, setPassword] = useState('admin123')

  // Check if user is already authenticated
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      setIsAuthenticated(true)
      loadData()
    } else {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAuth = async () => {
    setAuthLoading(true)
    setError(null)
    
    try {
      const response = await apiClient.generateToken(email, password)
      
      if (response.success && response.data) {
        apiClient.setToken(response.data.token)
        setIsAuthenticated(true)
        await loadData()
      } else {
        setError(response.message || 'Gagal melakukan authentication')
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat authentication'
      setError(errorMessage)
    } finally {
      setAuthLoading(false)
    }
  }

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Load master data and usulan data in parallel
      const [masterResponse, usulanResponse] = await Promise.all([
        apiClient.getMasterData(),
        apiClient.getUsulan({ page: pagination.page, limit: pagination.limit })
      ])

      if (masterResponse.success && masterResponse.data) {
        setMasterData(masterResponse.data)
      }

      if (usulanResponse.success && usulanResponse.data) {
        setUsulan(usulanResponse.data.data)
        setPagination(usulanResponse.data.pagination)
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal memuat data'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = async (filters: {
    search?: string
    tahun?: number
    status_id?: number
    skpd_id?: number
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiClient.getUsulan({
        ...filters,
        page: 1,
        limit: pagination.limit
      })

      if (response.success && response.data) {
        setUsulan(response.data.data)
        setPagination(response.data.pagination)
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal memfilter data'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = async (page: number) => {
    setLoading(true)
    
    try {
      const response = await apiClient.getUsulan({
        page,
        limit: pagination.limit
      })

      if (response.success && response.data) {
        setUsulan(response.data.data)
        setPagination(response.data.pagination)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal memuat halaman'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleUsulanDetail = (usulan: Usulan) => {
    // In a real app, this would navigate to detail page
    alert(`Detail usulan: ${usulan.judul}\n\nDeskripsi: ${usulan.deskripsi}`)
  }

  // Authentication Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <Database className="mx-auto h-12 w-12 text-blue-600 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Data Usulan ASMAS</h1>
            <p className="text-gray-600 mt-2">Masuk untuk mengakses sistem</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleAuth(); }} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={authLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={authLoading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              {authLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin mr-2" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  <LogIn size={20} className="mr-2" />
                  Masuk
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-sm text-gray-500 text-center">
            <p>Demo credentials sudah diisi otomatis</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Data Usulan ASMAS</h1>
              <p className="text-gray-600 mt-1">Sistem Pengelolaan Data Usulan Aset Modal</p>
            </div>
            
            <button
              onClick={() => {
                apiClient.clearToken()
                setIsAuthenticated(false)
                setUsulan([])
                setMasterData(null)
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <FilterBar 
          masterData={masterData}
          onFilter={handleFilter}
          loading={loading}
        />

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6 flex items-center">
            <AlertCircle size={20} className="mr-3 flex-shrink-0" />
            <div>
              <p className="font-medium">Terjadi kesalahan</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 size={32} className="animate-spin text-blue-600 mr-3" />
            <span className="text-gray-600">Memuat data usulan...</span>
          </div>
        )}

        {/* Cards Grid - Responsif: 1 kolom mobile, 3 kolom desktop */}
        {!loading && usulan.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {usulan.map((item) => (
                <UsulanCard 
                  key={item.id} 
                  usulan={item}
                  onDetail={handleUsulanDetail}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination 
              pagination={pagination}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </>
        )}

        {/* Empty State */}
        {!loading && usulan.length === 0 && !error && (
          <div className="text-center py-12">
            <Database size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada data usulan</h3>
            <p className="text-gray-600">Tidak ditemukan usulan yang sesuai dengan filter yang dipilih.</p>
          </div>
        )}
      </main>
    </div>
  )
}