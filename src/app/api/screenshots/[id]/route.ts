import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// DELETE: Delete a screenshot
export async function DELETE(
  req: NextRequest
) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized. No token found.',
      }, { status: 401 });
    }

    // Get the ID from the URL path
    const id = req.url.split('/').pop();
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Screenshot ID is required',
      }, { status: 400 });
    }

    const response = await fetch(`${API_BASE_URL}/clients/delete-screenshot/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!data.success) {
      return NextResponse.json({
        success: false,
        message: data.message || 'Failed to delete screenshot',
      }, { status: data.status || 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Screenshot deleted successfully',
    });

  } catch (error) {
    console.error('Delete screenshot API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
} 