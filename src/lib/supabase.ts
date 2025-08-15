import { createClient } from '@supabase/supabase-js'

// Fallback values for build time when env vars are not available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Only create client if we have valid URL (not placeholder)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      skpd: {
        Row: {
          id: number
          nama: string
          alamat: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          nama: string
          alamat: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          nama?: string
          alamat?: string
          created_at?: string
          updated_at?: string
        }
      }
      usulan: {
        Row: {
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
        }
        Insert: {
          id?: number
          judul: string
          deskripsi: string
          pengusul: string
          kode_wilayah: string
          latitude: number
          longitude: number
          skpd_id: number
          periode_id: number
          status_id: number
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: number
          judul?: string
          deskripsi?: string
          pengusul?: string
          kode_wilayah?: string
          latitude?: number
          longitude?: number
          skpd_id?: number
          periode_id?: number
          status_id?: number
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      gambar_usulan: {
        Row: {
          id: number
          usulan_id: number
          file_path: string
          keterangan: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          usulan_id: number
          file_path: string
          keterangan: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          usulan_id?: number
          file_path?: string
          keterangan?: string
          created_at?: string
          updated_at?: string
        }
      }
      periode: {
        Row: {
          id: number
          tahun: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          tahun: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          tahun?: number
          created_at?: string
          updated_at?: string
        }
      }
      status_usulan: {
        Row: {
          id: number
          nama: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          nama: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          nama?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
