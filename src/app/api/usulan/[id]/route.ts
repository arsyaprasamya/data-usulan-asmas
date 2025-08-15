import { NextRequest } from 'next/server'
import { authenticate, createApiResponse } from '@/lib/middleware'
import { DatabaseService, UsulanData } from '@/lib/database'

// GET - Mengambil detail usulan berdasarkan ID
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  // Authenticate first
  const { user, error } = await authenticate(request)
  if (error) return error

  try {
    const id = parseInt(context.params.id)
    
    if (isNaN(id)) {
      return createApiResponse(
        false,
        'ID usulan tidak valid',
        null,
        400
      )
    }

    const result = await DatabaseService.getUsulanById(id)

    if (!result) {
      return createApiResponse(
        false,
        'Usulan tidak ditemukan',
        null,
        404
      )
    }

    return createApiResponse(
      true,
      'Detail usulan berhasil diambil',
      result,
      200
    )

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error fetching usulan detail:', error)
    return createApiResponse(
      false,
      `Gagal mengambil detail usulan: ${errorMessage}`,
      null,
      500
    )
  }
}

// PUT - Mengubah Data Usulan lengkap
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  // Authenticate first
  const { user, error } = await authenticate(request)
  if (error) return error

  try {
    const id = parseInt(context.params.id)
    
    if (isNaN(id)) {
      return createApiResponse(
        false,
        'ID usulan tidak valid',
        null,
        400
      )
    }

    const body: Partial<UsulanData> = await request.json()

    // Validasi bahwa usulan exists
    const existingUsulan = await DatabaseService.getUsulanById(id)
    if (!existingUsulan) {
      return createApiResponse(
        false,
        'Usulan tidak ditemukan',
        null,
        404
      )
    }

    const result = await DatabaseService.updateUsulan(id, body)

    return createApiResponse(
      true,
      'Usulan berhasil diperbarui',
      result,
      200
    )

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error updating usulan:', error)
    return createApiResponse(
      false,
      `Gagal memperbarui usulan: ${errorMessage}`,
      null,
      500
    )
  }
}

// DELETE - Menghapus Data Usulan (soft delete)
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  // Authenticate first
  const { user, error } = await authenticate(request)
  if (error) return error

  try {
    const id = parseInt(context.params.id)
    
    if (isNaN(id)) {
      return createApiResponse(
        false,
        'ID usulan tidak valid',
        null,
        400
      )
    }

    // Validasi bahwa usulan exists
    const existingUsulan = await DatabaseService.getUsulanById(id)
    if (!existingUsulan) {
      return createApiResponse(
        false,
        'Usulan tidak ditemukan',
        null,
        404
      )
    }

    const result = await DatabaseService.deleteUsulan(id)

    return createApiResponse(
      true,
      'Usulan berhasil dihapus',
      result,
      200
    )

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error deleting usulan:', error)
    return createApiResponse(
      false,
      `Gagal menghapus usulan: ${errorMessage}`,
      null,
      500
    )
  }
}