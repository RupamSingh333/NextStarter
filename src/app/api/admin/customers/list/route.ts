import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function GET(request: NextRequest) {
  try {
    // Get admin token from cookies
    const adminToken = (await cookies()).get('admin_token')?.value;
    // const adminToken = request.cookies.get('admin_token')?.value
    // console.log('adminToken', adminToken);

    if (!adminToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const perPage = searchParams.get('perPage') || '10';
    const filter = searchParams.get('filter') || '-1';

    // Call external API
    const response = await fetch(
      `${API_BASE_URL}/customers/list?page=${page}&perPage=${perPage}&filter=${filter}`,
      {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch customers');
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
} 