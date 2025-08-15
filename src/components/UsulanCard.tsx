'use client'

import { Usulan } from '@/types'
import { Calendar, MapPin, Building2, User, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import Image from 'next/image'

interface UsulanCardProps {
  usulan: Usulan
  onDetail?: (usulan: Usulan) => void
}

export default function UsulanCard({ usulan, onDetail }: UsulanCardProps) {
  const getStatusBadgeColor = (statusNama: string) => {
    switch (statusNama.toLowerCase()) {
      case 'diajukan':
        return 'bg-blue-100 text-blue-800'
      case 'dalam review':
        return 'bg-yellow-100 text-yellow-800'
      case 'disetujui':
        return 'bg-green-100 text-green-800'
      case 'ditolak':
        return 'bg-red-100 text-red-800'
      case 'selesai':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Header dengan gambar atau placeholder */}
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        {usulan.gambar_usulan && usulan.gambar_usulan.length > 0 ? (
          <Image 
            src={usulan.gambar_usulan[0].file_path} 
            alt={usulan.judul}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            <Building2 size={48} className="opacity-70" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(usulan.status_usulan.nama)}`}>
            {usulan.status_usulan.nama}
          </span>
        </div>

        {/* Gambar Count Badge */}
        {usulan.gambar_usulan && usulan.gambar_usulan.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-2 py-1 rounded-md text-xs">
            +{usulan.gambar_usulan.length - 1} foto
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Judul */}
        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
          {usulan.judul}
        </h3>

        {/* Deskripsi */}
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {truncateText(usulan.deskripsi)}
        </p>

        {/* Info Grid */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <User size={16} className="mr-2 flex-shrink-0" />
            <span className="truncate">{usulan.pengusul}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Building2 size={16} className="mr-2 flex-shrink-0" />
            <span className="truncate">{usulan.skpd.nama}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={16} className="mr-2 flex-shrink-0" />
            <span>Tahun {usulan.periode.tahun}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPin size={16} className="mr-2 flex-shrink-0" />
            <span className="truncate">{usulan.kode_wilayah}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            {format(new Date(usulan.created_at), 'dd MMM yyyy', { locale: id })}
          </div>
          
          {onDetail && (
            <button
              onClick={() => onDetail(usulan)}
              className="inline-flex items-center px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition-colors duration-200"
            >
              <Eye size={16} className="mr-1" />
              Detail
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
