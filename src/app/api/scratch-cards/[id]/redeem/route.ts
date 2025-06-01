import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // const cookieStore = cookies();
    // const token = cookieStore.get('token')?.value;
    const token = request.headers.get('cookie')?.split(';')
      .find(c => c.trim().startsWith('token='))?.split('=')[1];

    
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const response = await fetch(`${API_BASE_URL}/clients/coupon-redeem`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        _id: id
      })
    });

    const data = await response.json();
    console.log('Redeem response:', data);

    if (!data.success) {
      return NextResponse.json({ 
        success: false, 
        message: data.message || 'Failed to redeem card' 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Card redeemed successfully', 
      data: data.data 
    }, { status: 200 });
    

    // Here you would typically:
    // 1. Validate the card exists and belongs to the user
    // 2. Check if the card is already redeemed
    // 3. Process the redemption in your database
    // 4. Return the updated card status

    // For now, we'll just return a success response
    return NextResponse.json({
      success: true,
      message: 'Card redeemed successfully'
    });
  } catch (error) {
    console.error('Error redeeming card:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 