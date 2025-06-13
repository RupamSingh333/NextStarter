// File: app/api/admin/users/create/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(request: NextRequest) {
  try {
    const adminToken = (await cookies()).get('admin_token')?.value;
    // const adminToken = request.cookies.get('admin_token')?.value
    // console.log('adminToken', adminToken);

    if (!adminToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin token missing.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: name, email, password.' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/users/create`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: result?.message || 'Failed to create user.',
        },
        { status: response.status }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Create user error:', error.message);
    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong while creating user. Please try again.',
      },
      { status: 500 }
    );
  }
}
