export const API_BASE_URL = 'https://repaykarobackend.onrender.com/api/v1';

export const API_ENDPOINTS = {
  LOGIN: '/clientAuth/login',
  VALIDATE_OTP: '/clientAuth/validate-otp',
  // Add other endpoints here as needed
};

// API response types
export interface LoginResponse {
  success: boolean;
  message: string;
  // Add other response fields as needed
}

export interface ValidateOTPResponse {
  success: boolean;
  message: string;
  // Add other response fields as needed
}

export interface APIError {
  success: boolean;
  message: string;
}

// Create a type-safe API client
export const apiClient = {
  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result;
  },

  // Add other methods (GET, PUT, DELETE) as needed
}; 