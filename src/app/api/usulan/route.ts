import { NextRequest } from 'next/server'
import { authenticate, createApiResponse } from '@/lib/middleware'
import { DatabaseService, UsulanData } from '@/lib/database'

// GET - Menampilkan Data Usulan dengan filter dan pagination
export async function GET(request: NextRequest) {
  // Authenticate first
  const { user, error } = await authenticate(request)
  if (error) return error
  try {
    const { searchParams } = new URL(request.url)
    
    const query = {
      tahun: searchParams.get('tahun') ? parseInt(searchParams.get('tahun')!) : undefined,
      status_id: searchParams.get('status_id') ? parseInt(searchParams.get('status_id')!) : undefined,
      skpd_id: searchParams.get('skpd_id') ? parseInt(searchParams.get('skpd_id')!) : undefined,
      search: searchParams.get('search') || undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10
    }

    const result = await DatabaseService.getUsulan(query)

    return createApiResponse(
      true,
      'Data usulan berhasil diambil',
      result,
      200
    )

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error fetching usulan:', error)
    return createApiResponse(
      false,
      `Gagal mengambil data usulan: ${errorMessage}`,
      null,
      500
    )
  }
}

// POST - Menyimpan Data Usulan baru dengan gambar
export async function POST(request: NextRequest) {
  // Authenticate first
  const { user, error } = await authenticate(request)
  if (error) return error
  try {
    const body: UsulanData = await request.json()

    // Validasi field required
    const requiredFields = ['judul', 'deskripsi', 'pengusul', 'kode_wilayah', 'latitude', 'longitude', 'skpd_id', 'periode_id', 'status_id']
    const missingFields = requiredFields.filter(field => !body[field as keyof UsulanData])

    if (missingFields.length > 0) {
      return createApiResponse(
        false,
        `Field berikut diperlukan: ${missingFields.join(', ')}`,
        null,
        400
      )
    }

    // Validasi gambar (minimal 1)
    if (!body.gambar || body.gambar.length === 0) {
      return createApiResponse(
        false,
        'Minimal 1 gambar diperlukan untuk usulan',
        null,
        400
      )
    }

    const result = await DatabaseService.createUsulan(body)

    return createApiResponse(
      true,
      'Usulan berhasil disimpan',
      result,
      201
    )

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error creating usulan:', error)
    return createApiResponse(
      false,
      `Gagal menyimpan usulan: ${errorMessage}`,
      null,
      500
    )
  }
}

// Functions exported above as GET and POST
