import { NextResponse,NextRequest } from 'next/server';
// import { cookies } from 'next/headers';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function GET(req: NextRequest) {
  try {
    // const cookieStore = cookies();
    // const token = cookieStore.get('token')?.value;
    // console.log(token);

    const token = req.cookies.get('token')?.value
    //   console.log(token)
      if (!token) {
        return NextResponse.json({
          success: false,
          message: 'Unauthorized. No token found.',
        }, { status: 401 })
      }
    
    
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }


    const userCouponRes = await fetch(`${API_BASE_URL}/clients/get-coupon`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const userCouponData = await userCouponRes.json()
  //   console.log(userCou)
    if (!userCouponData.success) {
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch user Coupon',
      }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      data: userCouponData.coupon,
    })


    // Example scratch cards data - replace with your actual API call
    const mockCards = [
      {
        _id: '1',
        amount: '0.25',
        couponCode: 'RPa36d8590d03',
        validDays: 30,
        isScratched: true,
        isRedeemed: false,
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        amount: '0.07',
        couponCode: 'RP3fd50ed38c2',
        validDays: 180,
        isScratched: true,
        isRedeemed: true,
        createdAt: new Date().toISOString()
      },
      {
        _id: '3',
        amount: '5.02',
        couponCode: 'RP1f6589a4d1e',
        validDays: 365,
        isScratched: true,
        isRedeemed: false,
        createdAt: new Date().toISOString()
      }
    ];

    return NextResponse.json({ success: true, cards: mockCards });
  } catch (error) {
    console.error('Error fetching scratch cards:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 