import { NextRequest } from 'next/server'
import { generateToken } from '@/lib/jwt'
import { createApiResponse } from '@/lib/middleware'

// Demo credentials - in production, this should be from database
const DEMO_CREDENTIALS = {
  email: 'admin@usulan-asmas.com',
  password: 'admin123',
  userId: '1',
  role: 'admin'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return createApiResponse(
        false,
        'Email dan password diperlukan',
        null,
        400
      )
    }

    // Demo authentication - in production, verify against database
    if (email !== DEMO_CREDENTIALS.email || password !== DEMO_CREDENTIALS.password) {
      return createApiResponse(
        false,
        'Email atau password tidak valid',
        null,
        401
      )
    }

    // Generate JWT token
    const token = generateToken({
      userId: DEMO_CREDENTIALS.userId,
      email: DEMO_CREDENTIALS.email,
      role: DEMO_CREDENTIALS.role
    })

    return createApiResponse(
      true,
      'Token berhasil dibuat',
      {
        token,
        user: {
          userId: DEMO_CREDENTIALS.userId,
          email: DEMO_CREDENTIALS.email,
          role: DEMO_CREDENTIALS.role
        },
        expires_in: '24h'
      },
      200
    )

  } catch (error) {
    console.error('Token generation error:', error)
    return createApiResponse(
      false,
      'Terjadi kesalahan dalam membuat token',
      null,
      500
    )
  }
}

// GET method untuk documentation
export async function GET() {
  return createApiResponse(
    true,
    'Endpoint untuk generate authentication token',
    {
      endpoint: '/api/auth/token',
      method: 'POST',
      description: 'Generate JWT token untuk API authorization',
      body: {
        email: 'string (required)',
        password: 'string (required)'
      },
      demo_credentials: {
        email: 'admin@usulan-asmas.com',
        password: 'admin123'
      },
      response: {
        success: 'boolean',
        message: 'string',
        data: {
          token: 'JWT token string',
          user: 'user object',
          expires_in: '24h'
        }
      },
      usage: 'Gunakan token dalam header: Authorization: Bearer <token>'
    }
  )
}
