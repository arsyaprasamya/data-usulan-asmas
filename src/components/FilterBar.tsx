'use client'

import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { MasterData } from '@/types'

interface FilterBarProps {
  masterData: MasterData | null
  onFilter: (filters: {
    search?: string
    tahun?: number
    status_id?: number
    skpd_id?: number
  }) => void
  loading?: boolean
}

export default function FilterBar({ masterData, onFilter, loading }: FilterBarProps) {
  const [search, setSearch] = useState('')
  const [tahun, setTahun] = useState<number | undefined>()
  const [statusId, setStatusId] = useState<number | undefined>()
  const [skpdId, setSkpdId] = useState<number | undefined>()
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = () => {
    onFilter({
      search: search || undefined,
      tahun,
      status_id: statusId,
      skpd_id: skpdId
    })
  }

  const handleClear = () => {
    setSearch('')
    setTahun(undefined)
    setStatusId(undefined)
    setSkpdId(undefined)
    onFilter({})
  }

  const hasActiveFilters = search || tahun || statusId || skpdId

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan judul atau pengusul..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 border rounded-lg font-medium transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            disabled={loading}
          >
            <Filter size={20} className="inline mr-2" />
            Filter
          </button>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
          >
            {loading ? 'Mencari...' : 'Cari'}
          </button>

          {hasActiveFilters && (
            <button
              onClick={handleClear}
              disabled={loading}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && masterData && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filter Tahun */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tahun Periode
              </label>
              <select
                value={tahun || ''}
                onChange={(e) => setTahun(e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="">Semua Tahun</option>
                {masterData.periode.map(periode => (
                  <option key={periode.id} value={periode.tahun}>
                    {periode.tahun}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Usulan
              </label>
              <select
                value={statusId || ''}
                onChange={(e) => setStatusId(e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="">Semua Status</option>
                {masterData.status_usulan.map(status => (
                  <option key={status.id} value={status.id}>
                    {status.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter SKPD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKPD Terkait
              </label>
              <select
                value={skpdId || ''}
                onChange={(e) => setSkpdId(e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="">Semua SKPD</option>
                {masterData.skpd.map(skpd => (
                  <option key={skpd.id} value={skpd.id}>
                    {skpd.nama}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
