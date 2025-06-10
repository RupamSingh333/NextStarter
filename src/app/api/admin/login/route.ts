import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const loginData = await loginRes.json()

    if (!loginData.success || !loginData.jwtToken) {
      return NextResponse.json({
        success: false,
        message: loginData.message || 'Login failed',
      }, { status: 401 })
    }

    const token = loginData.jwtToken

    // Create response with admin data
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        email: loginData.email,
        name: loginData.name,
        adminToken: token,
      },
    })

    // Set admin token in cookie with different name than user token
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: false, // Since we're using HTTP
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    return response

  } catch (error) {
    console.error('Admin Login API error:', error)
    return NextResponse.json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    }, { status: 500 })
  }
}

// GET: Return admin info using token from cookie
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value

    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized. No admin token found.',
      }, { status: 401 })
    }

    // You might want to add an admin verification endpoint here
    // For now, we'll just verify the token exists
    return NextResponse.json({
      success: true,
      isAdmin: true,
    })

  } catch (error) {
    console.error('Get admin API error:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 })
  }
} 