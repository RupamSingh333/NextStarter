import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('cookie')?.split(';')
      .find(c => c.trim().startsWith('token='))?.split('=')[1];

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    console.log("id from scratch card:",id)

    const response = await fetch(`${API_BASE_URL}/coupons/coupon-scratch`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        coupon_id: id
      })
    });

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json({ 
        success: false, 
        message: data.message || 'Failed to scratch card' 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Card scratched successfully', 
      data: data.data 
    }, { status: 200 });

  } catch (error) {
    console.error('Error scratching card:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 