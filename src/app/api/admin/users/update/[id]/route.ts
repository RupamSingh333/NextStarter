import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminToken = (await cookies()).get('admin_token')?.value;

    if (!adminToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin token missing.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const userId = params.id;

    if (!body?.onlyStatus && (!body.name || !body.email || !userId)) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: name, email, or user ID.' },
        { status: 400 }
      );
    }
    delete body.onlyStatus;


    const response = await fetch(`${API_BASE_URL}/users/update`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _id: userId,
        ...body,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: result?.message || 'Failed to update user.',
        },
        { status: response.status }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Update user error:', errorMessage);
    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong while updating user. Please try again.',
      },
      { status: 500 }
    );
  }
}
