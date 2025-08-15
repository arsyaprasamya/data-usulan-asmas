'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PaginationMeta } from '@/types'

interface PaginationProps {
  pagination: PaginationMeta
  onPageChange: (page: number) => void
  loading?: boolean
}

export default function Pagination({ pagination, onPageChange, loading }: PaginationProps) {
  const { page, total_pages, total, limit } = pagination

  if (total_pages <= 1) return null

  const getVisiblePages = () => {
    const delta = 2
    const pages: number[] = []
    const rangeWithDots: (number | string)[] = []

    for (let i = Math.max(2, page - delta); i <= Math.min(total_pages - 1, page + delta); i++) {
      pages.push(i)
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...pages)

    if (page + delta < total_pages - 1) {
      rangeWithDots.push('...', total_pages)
    } else {
      rangeWithDots.push(total_pages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()
  const startItem = (page - 1) * limit + 1
  const endItem = Math.min(page * limit, total)

  return (
    <div className="bg-white px-6 py-4 border-t border-gray-200 rounded-b-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Info */}
        <div className="text-sm text-gray-700 order-2 sm:order-1">
          Menampilkan <span className="font-medium">{startItem}</span> sampai{' '}
          <span className="font-medium">{endItem}</span> dari{' '}
          <span className="font-medium">{total}</span> hasil
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center space-x-1 order-1 sm:order-2">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || loading}
            className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline ml-1">Sebelumnya</span>
          </button>

          {/* Page Numbers */}
          <div className="hidden sm:flex">
            {visiblePages.map((pageNum, index) =>
              typeof pageNum === 'number' ? (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  disabled={loading}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border-t border-b transition-colors ${
                    pageNum === page
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  } ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  {pageNum}
                </button>
              ) : (
                <span
                  key={`dots-${index}`}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border-t border-b border-gray-300"
                >
                  {pageNum}
                </span>
              )
            )}
          </div>

          {/* Mobile: Current Page Indicator */}
          <div className="sm:hidden relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border-t border-b border-gray-300">
            {page} / {total_pages}
          </div>

          {/* Next Button */}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= total_pages || loading}
            className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          >
            <span className="hidden sm:inline mr-1">Selanjutnya</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
