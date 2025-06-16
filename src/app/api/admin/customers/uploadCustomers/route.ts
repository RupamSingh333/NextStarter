import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(req: Request) {
  try {
    const adminToken = (await cookies()).get('admin_token')?.value;

    if (!adminToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin token missing.' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded.' }, { status: 400 });
    }

    // Check if file is an Excel file
    const validExcelTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel.sheet.macroEnabled.12'
    ];

    if (!validExcelTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Please upload an Excel file.' },
        { status: 400 }
      );
    }

    // Create new FormData for the API request
    const apiFormData = new FormData();
    apiFormData.append('file', file);

    // Send file directly to backend API
    const backendResponse = await fetch(`${API_BASE_URL}/customers/uploadCustomers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      },
      body: apiFormData,
    });
    const backendData = await backendResponse.json();
    // console.log('>>>>>>>>>',backendData);
    
    if (!backendResponse.ok || !backendData.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: backendData.message || 'Failed to upload file to backend.',
          missingHeaders: backendData.missingHeaders || [],
          responseTime: backendData.responseTime
        },
        { status: backendResponse.ok ? 400 : backendResponse.status }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: backendData.message || 'Excel file uploaded successfully.', 
      data: backendData,
      responseTime: backendData.responseTime
    });

  } catch (error) {
    console.error('Error uploading Excel file:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload Excel file.' },
      { status: 500 }
    );
  }
} 