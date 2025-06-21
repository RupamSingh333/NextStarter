import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function PUT(request: NextRequest) {
  try {
    const adminToken = (await cookies()).get('admin_token')?.value;

    if (!adminToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin token missing.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    if (!body || !body.payment_type || !body.customer_id) {
      return NextResponse.json(
        { success: false, message: 'Invalid request body.' },
        { status: 400 }
      );
    }

    // console.log('Updating customer payment type:', body);
    // return NextResponse.json(
    //   { success: true, message: 'Updating customer payment type...' },
    //   { status: 200 }
    // );
    
    const response = await fetch(`${API_BASE_URL}/coupons/create-coupon-update-payment`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // If API fails (400/422/500), return friendly message
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      return NextResponse.json(
        {
          success: false,
          message:
            errorData?.message ||
            `Failed to update payment type. External API responded with status ${response.status}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error updating customer payment type:', errorMessage);

    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong while updating payment type. Please try again later.',
      },
      { status: 500 }
    );
  }
}
