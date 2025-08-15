import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, extractTokenFromHeader, TokenPayload } from './jwt'

export interface AuthenticatedRequest extends NextRequest {
  user?: TokenPayload
}

export function createApiResponse<T>(
  success: boolean,
  message: string,
  data?: T,
  statusCode: number = 200
) {
  return NextResponse.json(
    {
      success,
      message,
      ...(data && { data })
    },
    { status: statusCode }
  )
}

// Simple auth function that can be called manually in handlers
export async function authenticate(req: NextRequest): Promise<{ user?: TokenPayload; error?: NextResponse }> {
  try {
    const authorization = req.headers.get('authorization')
    const token = extractTokenFromHeader(authorization || '')

    if (!token) {
      return {
        error: NextResponse.json(
          { 
            success: false, 
            message: 'Token authorization diperlukan. Sertakan header: Authorization: Bearer <token>' 
          },
          { status: 401 }
        )
      }
    }

    const user = verifyToken(token)
    if (!user) {
      return {
        error: NextResponse.json(
          { 
            success: false, 
            message: 'Token tidak valid atau sudah expired' 
          },
          { status: 401 }
        )
      }
    }

    return { user }
  } catch (error) {
    console.error('Authentication error:', error)
    return {
      error: NextResponse.json(
        { 
          success: false, 
          message: 'Terjadi kesalahan dalam proses authentication' 
        },
        { status: 500 }
      )
    }
  }
}