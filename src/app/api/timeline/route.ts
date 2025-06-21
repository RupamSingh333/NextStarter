import { NextResponse, NextRequest } from 'next/server';
// import { cookies } from 'next/headers';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('token')?.value
        if (!token) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized. No token found.',
            }, { status: 401 })
        }


        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }


        const timelineResponse = await fetch(`${API_BASE_URL}/clients/get-timeline`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        const tmelineData = await timelineResponse.json()
        if (!tmelineData.success) {
            return NextResponse.json({
                success: false,
                message: 'Failed to fetch Timeline',
            }, { status: 401 })
        }

        return NextResponse.json({
            success: true,
            data: tmelineData.timeline,
        })

    } catch (error) {
        console.error('Error fetching Timeline:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
} 