import apiClient from '../client';
import {
  PersonalInfoRequest,
  PersonalInfoResponse,
  PhoneVerificationRequest,
  PhoneVerificationInitResponse,
  PhoneVerificationResponse,
  MessageResponse,
  ApiResponse,
  VerificationStatusResponse,
  SMFASendLinkResponse,
  SMFAVerifyStatusResponse,
} from '../../types';

export const identityService = {
  // Submit personal information for identity verification
  submitPersonalInfo: async (personalInfo: PersonalInfoRequest): Promise<PersonalInfoResponse> => {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('📡 Calling POST /users/dit-identity with:', personalInfo);
    }
    const response = await apiClient.post<ApiResponse<PersonalInfoResponse>>(
      '/users/dit-identity',
      personalInfo,
    );
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('📡 Raw response from /users/dit-identity:', {
        status: response.status,
        data: response.data,
        dataType: typeof response.data,
        hasData: !!response.data,
        dataKeys: response.data ? Object.keys(response.data) : 'no data',
      });
    }
    // Handle both ApiResponse wrapper and direct response
    // If response.data has a 'data' property, use it (ApiResponse wrapper)
    // Otherwise, use response.data directly
    const result =
      response.data?.data !== undefined
        ? response.data.data
        : (response.data as unknown as PersonalInfoResponse);
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('📡 Processed identity response:', result);
    }
    return result;
  },

  // Initiate phone verification
  initiatePhoneVerification: async (): Promise<PhoneVerificationInitResponse> => {
    const response =
      await apiClient.get<ApiResponse<PhoneVerificationInitResponse>>('/users/get-mobile');
    return response.data.data;
  },

  // Send SMS verification code
  sendVerificationCode: async (token: string): Promise<MessageResponse> => {
    const response = await apiClient.post<ApiResponse<MessageResponse>>(
      `/users/send-code/${token}`,
    );
    return response.data.data;
  },

  // Verify SMS code
  verifyCode: async (
    verificationData: PhoneVerificationRequest,
  ): Promise<PhoneVerificationResponse> => {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('📡 Calling POST /users/verify-code with:', verificationData);
    }
    const response = await apiClient.post<ApiResponse<PhoneVerificationResponse>>(
      '/users/verify-code',
      verificationData,
    );
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('📡 Response from /users/verify-code:', response.data);
    }
    return response.data.data;
  },

  // Get identity verification status
  getVerificationStatus: async (): Promise<VerificationStatusResponse> => {
    const response = await apiClient.get<ApiResponse<VerificationStatusResponse>>(
      '/users/verification-status',
    );
    return response.data.data;
  },

  // Send SMFA link via SMS or Email
  sendSMFALink: async (
    mtoken: string,
    channel: 'phone' | 'email' = 'phone',
  ): Promise<SMFASendLinkResponse> => {
    const response = await apiClient.post<ApiResponse<SMFASendLinkResponse>>(
      `/users/smfa-send-link/${mtoken}`,
      {
        type: channel,
      },
    );
    // Handle both ApiResponse wrapper and direct response
    // If response.data has a 'data' property, use it (ApiResponse wrapper)
    // Otherwise, use response.data directly
    const result =
      response.data?.data !== undefined
        ? response.data.data
        : (response.data as unknown as SMFASendLinkResponse);
    return result;
  },

  // Verify SMFA status
  verifySMFAStatus: async (smfaToken: string): Promise<SMFAVerifyStatusResponse> => {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log(
        '📡 Calling POST /users/smfa-verify-status with smfaToken:',
        smfaToken.substring(0, 20) + '...',
      );
    }
    const response = await apiClient.post<ApiResponse<SMFAVerifyStatusResponse>>(
      `/users/smfa-verify-status/${smfaToken}`,
    );
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('📡 Response from /users/smfa-verify-status:', response.data);
    }
    return response.data.data;
  },
};

export default identityService;
