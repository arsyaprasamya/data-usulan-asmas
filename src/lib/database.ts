import { supabase } from './supabase'

// Check if we're in build time or have proper env vars
const isValidSupabaseConfig = process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'

export interface UsulanQuery {
  tahun?: number
  status_id?: number
  skpd_id?: number
  search?: string
  page?: number
  limit?: number
}

export interface UsulanData {
  judul: string
  deskripsi: string
  pengusul: string
  kode_wilayah: string
  latitude: number
  longitude: number
  skpd_id: number
  periode_id: number
  status_id: number
  gambar?: Array<{
    file_path: string
    keterangan: string
  }>
}

export class DatabaseService {
  // Helper method to check if we can perform database operations
  private static canPerformDatabaseOps(): boolean {
    return isValidSupabaseConfig
  }

  // Get usulan with filters and pagination
  static async getUsulan(query: UsulanQuery) {
    if (!this.canPerformDatabaseOps()) {
      return { data: [], pagination: { page: 1, limit: 10, total: 0, total_pages: 0 } }
    }
    const { tahun, status_id, skpd_id, search, page = 1, limit = 10 } = query
    
    let queryBuilder = supabase
      .from('usulan')
      .select(`
        *,
        skpd:skpd_id (id, nama, alamat),
        periode:periode_id (id, tahun),
        status_usulan:status_id (id, nama),
        gambar_usulan (id, file_path, keterangan)
      `)
      .is('deleted_at', null) // Only non-deleted records
      .order('created_at', { ascending: false })

    // Filter by tahun (periode)
    if (tahun) {
      queryBuilder = queryBuilder.eq('periode.tahun', tahun)
    }

    // Filter by status
    if (status_id) {
      queryBuilder = queryBuilder.eq('status_id', status_id)
    }

    // Filter by SKPD
    if (skpd_id) {
      queryBuilder = queryBuilder.eq('skpd_id', skpd_id)
    }

    // Search by judul or pengusul
    if (search) {
      queryBuilder = queryBuilder.or(`judul.ilike.%${search}%,pengusul.ilike.%${search}%`)
    }

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    queryBuilder = queryBuilder.range(from, to)

    const { data, error, count } = await queryBuilder

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    return {
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / limit)
      }
    }
  }

  // Get single usulan by ID
  static async getUsulanById(id: number) {
    const { data, error } = await supabase
      .from('usulan')
      .select(`
        *,
        skpd:skpd_id (id, nama, alamat),
        periode:periode_id (id, tahun),
        status_usulan:status_id (id, nama),
        gambar_usulan (id, file_path, keterangan)
      `)
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    return data
  }

  // Create new usulan
  static async createUsulan(data: UsulanData) {
    const { gambar, ...usulanData } = data

    // Insert usulan
    const { data: usulan, error: usulanError } = await supabase
      .from('usulan')
      .insert(usulanData)
      .select()
      .single()

    if (usulanError) {
      throw new Error(`Error creating usulan: ${usulanError.message}`)
    }

    // Insert gambar if provided
    if (gambar && gambar.length > 0) {
      const gambarData = gambar.map(img => ({
        usulan_id: usulan.id,
        file_path: img.file_path,
        keterangan: img.keterangan
      }))

      const { error: gambarError } = await supabase
        .from('gambar_usulan')
        .insert(gambarData)

      if (gambarError) {
        // Rollback usulan if gambar insert fails
        await supabase.from('usulan').delete().eq('id', usulan.id)
        throw new Error(`Error creating gambar: ${gambarError.message}`)
      }
    }

    return this.getUsulanById(usulan.id)
  }

  // Update usulan
  static async updateUsulan(id: number, data: Partial<UsulanData>) {
    const { gambar, ...usulanData } = data

    // Update usulan
    const { error: usulanError } = await supabase
      .from('usulan')
      .update(usulanData)
      .eq('id', id)
      .is('deleted_at', null)

    if (usulanError) {
      throw new Error(`Error updating usulan: ${usulanError.message}`)
    }

    // Update gambar if provided
    if (gambar) {
      // Delete existing gambar
      await supabase
        .from('gambar_usulan')
        .delete()
        .eq('usulan_id', id)

      // Insert new gambar
      if (gambar.length > 0) {
        const gambarData = gambar.map(img => ({
          usulan_id: id,
          file_path: img.file_path,
          keterangan: img.keterangan
        }))

        const { error: gambarError } = await supabase
          .from('gambar_usulan')
          .insert(gambarData)

        if (gambarError) {
          throw new Error(`Error updating gambar: ${gambarError.message}`)
        }
      }
    }

    return this.getUsulanById(id)
  }

  // Soft delete usulan
  static async deleteUsulan(id: number) {
    const { error } = await supabase
      .from('usulan')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .is('deleted_at', null)

    if (error) {
      throw new Error(`Error deleting usulan: ${error.message}`)
    }

    return { success: true, message: 'Usulan berhasil dihapus' }
  }

  // Get SKPD list
  static async getSkpd() {
    const { data, error } = await supabase
      .from('skpd')
      .select('*')
      .order('nama')

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    return data || []
  }

  // Get periode list
  static async getPeriode() {
    const { data, error } = await supabase
      .from('periode')
      .select('*')
      .order('tahun', { ascending: false })

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    return data || []
  }

  // Get status usulan list
  static async getStatusUsulan() {
    const { data, error } = await supabase
      .from('status_usulan')
      .select('*')
      .order('nama')

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    return data || []
  }
}
