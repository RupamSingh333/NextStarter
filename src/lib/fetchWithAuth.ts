// lib/fetchWithAuth.ts
import { NextResponse } from 'next/server';

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export async function fetchWithAuth<T = unknown>(
  url: string,
  options: RequestInit = {},
  token: string,
  tokenName: 'admin_token' | 'token'
): Promise<{ data?: ApiResponse<T>; nextResponse?: NextResponse }> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await response.json() as ApiResponse<T>;

    if (!data.success || response.status === 401) {
      const res = NextResponse.json(
        {
          success: false,
          message: data.message || 'Unauthorized: Invalid or expired token',
        },
        { status: 401 }
      );

      // Clear the cookie
      res.cookies.set(tokenName, '', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        expires: new Date(0),
      });

      return { nextResponse: res };
    }

    return { data };
  } catch (err) {
    console.error('fetchWithAuth error:', err);
    const res = NextResponse.json(
      { success: false, message: 'Server error during fetchWithAuth' },
      { status: 500 }
    );
    return { nextResponse: res };
  }
}
