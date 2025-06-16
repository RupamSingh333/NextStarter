import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GET: Fetch all screenshots
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized. No token found.',
      }, { status: 401 });
    }

    const response = await fetch(`${API_BASE_URL}/clients/get-screenshot`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    
    
    const data = await response.json();
    if (!data.success) {
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch screenshots',
      }, { status: data.status || 400 });
    }
    // console.log(data.screen_shot);
    
    return NextResponse.json({
      success: true,
      screenshots: data.screen_shot,
    });

  } catch (error) {
    console.error('Get screenshots API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
}

// POST: Upload a new screenshot
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized. No token found.',
      }, { status: 401 });
    }

    const formData = await req.formData();
    const screenshot = formData.get('screenshot');

    if (!screenshot) {
      return NextResponse.json({
        success: false,
        message: 'No screenshot file provided',
      }, { status: 400 });
    }

    const uploadFormData = new FormData();
    uploadFormData.append('screenshot', screenshot);

    const response = await fetch(`${API_BASE_URL}/clients/upload-payment-screenshot`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: uploadFormData,
    });

    const data = await response.json();
    if (!data.success) {
      return NextResponse.json({
        success: false,
        message: data.message || 'Failed to upload screenshot',
      }, { status: data.status || 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Screenshot uploaded successfully',
      screenshot: data.screenshot,
    });

  } catch (error) {
    console.error('Upload screenshot API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
} 