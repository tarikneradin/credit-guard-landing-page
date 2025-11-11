import apiClient from '../client';
import axios from 'axios';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  MessageResponse,
  ApiResponse,
} from '../../types';

// Backend API base URL for registration (different from Equifax API)
const BACKEND_API_URL = 'http://3.143.90.42:8080/api';

// Create a separate axios instance for backend API (no auth required for customer token)
const backendApiClient = axios.create({
  baseURL: BACKEND_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export interface CustomerTokenResponse {
  token: string;
  hostId: string;
  expiresIn?: number;
}

export const authService = {
  // Get customer token from host ID (required before registration)
  getCustomerToken: async (hostId: string): Promise<CustomerTokenResponse> => {
    const response = await backendApiClient.get<CustomerTokenResponse>(`/customer-token/${hostId}`);
    return response.data;
  },

  // Try to get hostId from initialization endpoint (if available)
  // This is a public endpoint that might return host configuration
  tryGetHostIdFromInit: async (): Promise<string | null> => {
    try {
      // Try the backend initialization endpoint
      const response = await backendApiClient.get<{hostId?: string; host?: {id?: string}}>(
        '/initialize',
      );
      return response.data.hostId || response.data.host?.id || null;
    } catch {
      // Endpoint doesn't exist or requires auth - that's okay
      return null;
    }
  },
  // User login
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/users/login', credentials);
    return response.data.data;
  },

  // User registration (backend API - requires customer token)
  register: async (
    userData: RegisterRequest,
    customerToken: string,
    hostId: string,
  ): Promise<RegisterResponse> => {
    // Backend API expects different field names and uses customer token for auth
    const backendPayload: Record<string, unknown> = {
      email: userData.email,
      password: userData.password,
      hostId,
    };

    if (userData.firstName) {
      backendPayload.fname = userData.firstName;
    }

    if (userData.lastName) {
      backendPayload.lname = userData.lastName;
    }

    if (userData.phone) {
      backendPayload.mobile = userData.phone.replace(/\D/g, '');
    }

    // Only include recovery fields if provided
    if (userData.recoveryQuestion && userData.recoveryAnswer) {
      backendPayload.recoveryQuestion = userData.recoveryQuestion;
      backendPayload.recoveryAnswer = userData.recoveryAnswer;
    }

    const response = await backendApiClient.post('/register', backendPayload, {
      headers: {
        Authorization: `Bearer ${customerToken}`,
      },
    });

    // Log full response for debugging
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('📦 Full Registration Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data,
        dataType: typeof response.data,
        dataKeys: response.data ? Object.keys(response.data) : 'no data',
      });
      // eslint-disable-next-line no-console
      console.log('📦 Response Data (stringified):', JSON.stringify(response.data, null, 2));
    }

    // Registration endpoint returns user data, not a token
    // After registration, we need to login to get tokens
    const responseData = response.data;

    // If response.data is null or undefined, log and throw
    if (!responseData) {
      const errorMsg = 'Registration response is empty';
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.error('❌ Empty response:', {
          status: response.status,
          statusText: response.statusText,
        });
      }
      throw new Error(errorMsg);
    }

    // Extract user data from response (response contains user fields directly)
    const data = responseData.data || responseData;
    const userId = data?.id || data?.userId || responseData?.id || responseData?.userId;
    const email = data?.email || responseData?.email || userData.email;
    const firstName = data?.fname || responseData?.fname || userData.firstName;
    const lastName = data?.lname || responseData?.lname || userData.lastName;
    const phone = data?.mobile || responseData?.mobile || userData.phone;

    // Registration successful - return user data (no token yet)
    // Token will be obtained by logging in after registration
    return {
      accessToken: '', // Will be set after login
      refreshToken: undefined,
      user: {
        id: userId || '',
        email: email,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        isVerified: false,
        verificationLevel: 'basic',
      },
    };
  },

  // Password recovery
  forgotPassword: async (email: string): Promise<MessageResponse> => {
    const response = await apiClient.post<ApiResponse<MessageResponse>>(
      '/users/password-recovery',
      {email},
    );
    return response.data.data;
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await apiClient.get<ApiResponse<LoginResponse>>('/users/refresh-token', {
      params: {token: refreshToken},
    });
    return response.data.data;
  },

  // Get current user profile
  getCurrentUser: async (): Promise<unknown> => {
    const response = await apiClient.get<ApiResponse<unknown>>('/users');
    return response.data.data;
  },

  // Logout (if needed for server-side session management)
  logout: async (): Promise<MessageResponse> => {
    const response = await apiClient.post<ApiResponse<MessageResponse>>('/users/logout');
    return response.data.data;
  },

  // Get available recovery questions
  getRecoveryQuestions: async (): Promise<Array<{id: number; question: string}>> => {
    // Hardcoded list of common security questions
    // In the future, this could be fetched from an API endpoint
    return [
      {id: 1, question: 'What was the name of your first pet?'},
      {id: 2, question: 'What city were you born in?'},
      {id: 3, question: "What was your mother's maiden name?"},
      {id: 4, question: 'What was the name of your elementary school?'},
      {id: 5, question: 'What was your childhood nickname?'},
      {id: 6, question: 'What street did you grow up on?'},
      {id: 7, question: "What was your favorite teacher's name?"},
      {id: 8, question: 'What was the make of your first car?'},
      {id: 9, question: 'What was the name of your first employer?'},
      {id: 10, question: 'What is your favorite movie?'},
    ];
  },
};

export default authService;
