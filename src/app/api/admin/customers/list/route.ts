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
    const customer = searchParams.get('customer') || '';
    const phone = searchParams.get('phone') || '';
    const email = searchParams.get('email') || '';
    const lender = searchParams.get('lender') || '';

    // Build filter query string
    const filterParams = [
      customer && `customer=${encodeURIComponent(customer)}`,
      phone && `phone=${encodeURIComponent(phone)}`,
      email && `email=${encodeURIComponent(email)}`,
      lender && `lender=${encodeURIComponent(lender)}`,
    ].filter(Boolean).join('&');

    // Construct the API URL
    const apiUrl = `${API_BASE_URL}/customers/list?page=${page}&perPage=${perPage}&filter=${filter}${filterParams ? `&${filterParams}` : ''
      }`;


    // Call external API
    const response = await fetch(apiUrl,
      {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );


    const data = await response.json();

    // console.log('response',data);

    if (data && !data.isAuthorized) {
      return NextResponse.json(data);
    }

    if (!response.ok) {
      throw new Error('Failed to fetch customers');
    }

    // console.log('>Response status:', data);  

    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch customers';
    console.error('Error fetching customers:', errorMessage);
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
} 