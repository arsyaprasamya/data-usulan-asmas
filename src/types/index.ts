export interface Usulan {
  id: number
  judul: string
  deskripsi: string
  pengusul: string
  kode_wilayah: string
  latitude: number
  longitude: number
  skpd_id: number
  periode_id: number
  status_id: number
  created_at: string
  updated_at: string
  deleted_at: string | null
  skpd: SKPD
  periode: Periode
  status_usulan: StatusUsulan
  gambar_usulan: GambarUsulan[]
}

export interface SKPD {
  id: number
  nama: string
  alamat: string
  created_at: string
  updated_at: string
}

export interface Periode {
  id: number
  tahun: number
  created_at: string
  updated_at: string
}

export interface StatusUsulan {
  id: number
  nama: string
  created_at: string
  updated_at: string
}

export interface GambarUsulan {
  id: number
  usulan_id: number
  file_path: string
  keterangan: string
  created_at: string
  updated_at: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  total_pages: number
}

export interface UsulanListResponse {
  data: Usulan[]
  pagination: PaginationMeta
}

export interface AuthTokenResponse {
  token: string
  user: {
    userId: string
    email: string
    role: string
  }
  expires_in: string
}

export interface MasterData {
  skpd: SKPD[]
  periode: Periode[]
  status_usulan: StatusUsulan[]
}
