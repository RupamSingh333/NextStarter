import { NextRequest, NextResponse } from 'next/server'
import { fetchWithAuth } from '@/lib/fetchWithAuth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const loginData = await loginRes.json();
    // console.log('Admin Login Response:', loginData)

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

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized. No admin token found.',
      }, { status: 401 });
    }

    const { data, nextResponse } = await fetchWithAuth(
      `${API_BASE_URL}/profile/profile`,
      {},
      token,
      'admin_token'
    );

    if (nextResponse) return nextResponse;

    return NextResponse.json({
      success: true,
      user: data.user,
      message: data.message || 'Admin info fetched successfully',
    }, { status: 200 });

  } catch (error) {
    console.error('Get admin API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
}
