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

  } catch (error) {
    console.error('Error fetching scratch cards:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 