import { NextRequest } from 'next/server'
import { authenticate, createApiResponse } from '@/lib/middleware'
import { DatabaseService } from '@/lib/database'

// GET - Mengambil semua master data untuk form
export async function GET(request: NextRequest) {
  // Authenticate first
  const { user, error } = await authenticate(request)
  if (error) return error

  try {
    const [skpd, periode, statusUsulan] = await Promise.all([
      DatabaseService.getSkpd(),
      DatabaseService.getPeriode(), 
      DatabaseService.getStatusUsulan()
    ])

    return createApiResponse(
      true,
      'Master data berhasil diambil',
      {
        skpd,
        periode,
        status_usulan: statusUsulan
      },
      200
    )

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error fetching master data:', error)
    return createApiResponse(
      false,
      `Gagal mengambil master data: ${errorMessage}`,
      null,
      500
    )
  }
}
