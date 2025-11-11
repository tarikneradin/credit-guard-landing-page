import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {AxiosError} from 'axios';
import {identityService} from '../api/services/identityService';
import {handleApiError} from '../api/client';
import {PersonalInfoRequest} from '../types/api';

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  ssn: string;
  phone: string;
}

export interface IdentityVerificationState {
  // Personal Information
  personalInfo: Partial<PersonalInfo>;

  // Phone Verification
  phoneNumber: string;
  phoneVerificationCode: string;
  // Token flow: After step 1 (identity) → stores mtoken, After step 2 (send-link) → stores smfaToken
  phoneVerificationToken: string | null;
  identityToken: string | null;
  smsMessage: string | null; // SMS message with authentication link from send-link response
  phoneVerified: boolean;
  smfaChannel: 'phone' | 'email';
  smfaCooldownUntil: number | null;

  // Verification Status
  verificationStep: 'personal' | 'phone' | 'completed';
  isVerificationComplete: boolean;
  verificationComplete: boolean; // Alias for isVerificationComplete
  verificationLevel: 'basic' | 'enhanced' | 'full';

  // Loading States
  isLoading: boolean;
  error: string | null;
  identityFailure: IdentityFailureResult | null;
  serviceFailure: boolean;
  smfaFailure: SmfaFailureResult | null;
}

export interface IdentityStore extends IdentityVerificationState {
  // Personal Info Actions
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  submitPersonalInfo: (personalInfo?: Partial<PersonalInfo>) => Promise<void>;

  // Phone Verification Actions
  updatePhoneNumber: (phone: string) => void;
  sendPhoneVerificationCode: () => Promise<void>;
  sendVerificationCode: () => Promise<void>; // Alias for sendPhoneVerificationCode
  verifyPhoneCode: (code: string) => Promise<void>;
  verifyCode: (code: string) => Promise<void>; // Alias for verifyPhoneCode

  // Navigation Actions
  setVerificationStep: (step: IdentityVerificationState['verificationStep']) => void;
  completeVerification: () => void;
  resetVerification: () => void;

  // Utility Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  clearIdentityFailure: () => void;
  clearServiceFailure: () => void;
  clearSmfaFailure: () => void;
  sendEmailVerificationLink: () => Promise<void>;
}

export interface IdentityFailureResult {
  message: string;
  details?: string[];
  codes?: string[];
}

export interface SmfaFailureResult {
  message: string;
  details?: string[];
  codes?: string[];
}

export const useIdentityStore = create<IdentityStore>()(
  persist(
    (set, get) => ({
      // Initial State
      personalInfo: {},
      phoneNumber: '',
      phoneVerificationCode: '',
      phoneVerificationToken: null,
      identityToken: null,
      smsMessage: null,
      phoneVerified: false,
      smfaChannel: 'phone',
      smfaCooldownUntil: null,
      verificationStep: 'personal',
      isVerificationComplete: false,
      get verificationComplete() {
        return get().isVerificationComplete;
      },
      verificationLevel: 'basic',
      isLoading: false,
      error: null,
      identityFailure: null,
      serviceFailure: false,
      smfaFailure: null,

      // Personal Info Actions
      updatePersonalInfo: (info: Partial<PersonalInfo>) => {
        set(state => ({
          personalInfo: {...state.personalInfo, ...info},
        }));
      },

      submitPersonalInfo: async (personalInfoData?: Partial<PersonalInfo>) => {
        set({isLoading: true, error: null, identityFailure: null});
        try {
          // Get personal info from parameter or state
          const info = personalInfoData || get().personalInfo;

          // Validate required fields
          if (
            !info.firstName ||
            !info.lastName ||
            !info.dateOfBirth ||
            !info.ssn ||
            !info.address ||
            !info.city ||
            !info.state ||
            !info.zipCode ||
            !info.phone
          ) {
            throw new Error('All fields are required');
          }

          // Convert date from MM/DD/YYYY to YYYY-MM-DD format
          let dobFormatted = info.dateOfBirth;
          if (info.dateOfBirth && info.dateOfBirth.includes('/')) {
            const [month, day, year] = info.dateOfBirth.split('/');
            dobFormatted = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          }

          // Transform to API format (map to API field names)
          const apiRequest: PersonalInfoRequest = {
            fname: info.firstName,
            lname: info.lastName,
            dob: dobFormatted,
            street1: info.address,
            city: info.city,
            state: info.state,
            zip: info.zipCode,
            mobile: info.phone.replace(/\D/g, ''), // Remove non-digits from phone
            ...(info.ssn && {ssn: info.ssn.replace(/-/g, '')}), // Include SSN if provided (remove dashes)
          };

          // Call real API endpoint
          const identityResponse = await identityService.submitPersonalInfo(apiRequest);

          if (__DEV__) {
            // eslint-disable-next-line no-console
            console.log('🔑 Full identity response:', JSON.stringify(identityResponse, null, 2));
          }

          // Extract mtoken from response (this token is used for SMFA send-link in step 2)
          // Response structure: { mobile: string, token: string, expires: string }
          // The service returns response.data.data, so identityResponse should be the data object
          const mtoken = identityResponse?.token || null;

          if (__DEV__) {
            // eslint-disable-next-line no-console
            console.log('🔑 Token extraction:', {
              hasToken: !!mtoken,
              tokenPreview: mtoken ? mtoken.substring(0, 20) + '...' : 'none',
              responseType: typeof identityResponse,
              responseKeys: identityResponse ? Object.keys(identityResponse) : 'no response',
              rawResponse: identityResponse,
            });
          }

          if (!mtoken) {
            throw new Error(
              `Failed to get token from identity endpoint response. Response: ${JSON.stringify(identityResponse)}`,
            );
          }

          // Update state and store personal info
          set({
            personalInfo: info as PersonalInfo,
            verificationStep: 'phone',
            phoneNumber: info.phone || '',
            // Store tokens for subsequent SMFA steps
            identityToken: mtoken,
            phoneVerificationToken: null,
            isLoading: false,
            identityFailure: null,
            smfaChannel: 'phone',
            smfaCooldownUntil: null,
            // Reset verification complete flag - user must complete SMFA
            isVerificationComplete: false,
            phoneVerified: false,
          });
        } catch (error) {
          const stateUpdate: Partial<IdentityVerificationState> = {
            isLoading: false,
            error: null,
            identityFailure: {
              message: handleApiError(error),
            },
            serviceFailure: false,
          };

          const isAxiosError = (err: unknown): err is AxiosError =>
            typeof err === 'object' && err !== null && (err as AxiosError).isAxiosError === true;

          if (isAxiosError(error)) {
            if (error.response?.status === 503) {
              stateUpdate.serviceFailure = true;
            }

            if (error.response?.status === 400) {
              const data = (error.response.data || {}) as {
                codes?: string[];
                messages?: string[];
                details?: string[];
              };

              stateUpdate.identityFailure = {
                message:
                  data.messages?.[0] ||
                  handleApiError(error) ||
                  "We couldn't verify your identity.",
                details: data.details,
                codes: data.codes,
              };
            }
          }

          set(stateUpdate);
          throw error;
        }
      },

      // Phone Verification Actions
      updatePhoneNumber: (phone: string) => {
        set({phoneNumber: phone});
      },

      sendPhoneVerificationCode: async () => {
        const state = get();
        const now = Date.now();
        if (state.smfaCooldownUntil && now < state.smfaCooldownUntil) {
          const remaining = Math.max(0, Math.ceil((state.smfaCooldownUntil - now) / 1000));
          set({
            error:
              remaining > 0
                ? `Please wait ${remaining} seconds before requesting another verification link.`
                : 'Please wait before requesting another verification link.',
          });
          return;
        }

        set({isLoading: true, error: null});
        try {
          const mtoken = state.identityToken;

          if (!mtoken) {
            throw new Error('Identity token (mtoken) not available. Please complete step 1 first.');
          }

          if (__DEV__) {
            // eslint-disable-next-line no-console
            console.log('📱 Sending SMFA link with mtoken from identity step');
          }

          const sendLinkResponse = await identityService.sendSMFALink(mtoken, 'phone');

          const smfaToken = sendLinkResponse?.token || null;
          const smsMessage = sendLinkResponse?.smsMessage || null;

          if (!smfaToken) {
            throw new Error('Failed to get SMFA token from send-link response');
          }

          if (__DEV__) {
            // eslint-disable-next-line no-console
            console.log('✅ SMFA link sent, received smfaToken and smsMessage');
          }

          set({
            phoneVerificationToken: smfaToken,
            smsMessage: smsMessage,
            isLoading: false,
            serviceFailure: false,
            smfaFailure: null,
            smfaChannel: 'phone',
            smfaCooldownUntil: Date.now() + 30000,
          });
        } catch (error) {
          const isAxiosError = (err: unknown): err is AxiosError =>
            typeof err === 'object' && err !== null && (err as AxiosError).isAxiosError === true;

          const update: Partial<IdentityVerificationState> = {
            error: handleApiError(error),
            isLoading: false,
            serviceFailure: false,
            smfaFailure: null,
          };

          if (isAxiosError(error)) {
            const data = (error.response?.data || {}) as {
              codes?: string[];
              messages?: string[];
              details?: string[];
            };
            const codes = data.codes || [];
            const messages = data.messages || [];
            const details = data.details;
            const textBucket = [...messages, ...(details || []), ...codes.map(String)].map(entry =>
              entry.toLowerCase(),
            );
            const includes = (needle: string) =>
              textBucket.some(entry => entry.includes(needle.toLowerCase()));
            const primaryMessage =
              messages[0] || update.error || 'We could not send the verification link.';

            if (error.response?.status === 503) {
              update.serviceFailure = true;
              update.error = null;
            }

            if (error.response?.status === 400) {
              if (codes.includes('SC324')) {
                update.smfaFailure = {
                  message: primaryMessage,
                  details,
                  codes,
                };
                update.error = null;
              }

              if (codes.includes('SC323')) {
                update.serviceFailure = true;
                update.error = null;
              }
            }

            if (error.response?.status === 425 || codes.includes('SC327')) {
              update.error =
                messages[0] || 'Please wait 30 seconds before requesting another link.';
              update.smfaCooldownUntil = Date.now() + 30000;
            }

            const alreadyHandled = update.serviceFailure || update.smfaFailure !== null;

            if (!alreadyHandled) {
              const isServiceIssue =
                includes('service unavailable') ||
                includes('temporarily unavailable') ||
                includes('enrollment error') ||
                includes('vs3');
              const isSendFailure = includes('send failure') || includes('send failed');
              const isThinFile =
                includes('thinfile') || includes('thin file') || includes('userthinfile');
              const isVerificationDenied =
                includes('verification failed') ||
                includes('not successful') ||
                includes('smfa status failed');
              const isIncomplete = includes('incomplete');

              if (isServiceIssue || isSendFailure) {
                update.serviceFailure = true;
                update.error = null;
              } else if (isThinFile || isVerificationDenied || isIncomplete) {
                update.smfaFailure = {
                  message: primaryMessage,
                  details,
                  codes,
                };
                update.error = null;
              }
            }
          }

          set(update);
          throw error;
        }
      },

      sendEmailVerificationLink: async () => {
        const state = get();
        const now = Date.now();
        if (state.smfaCooldownUntil && now < state.smfaCooldownUntil) {
          const remaining = Math.max(0, Math.ceil((state.smfaCooldownUntil - now) / 1000));
          set({
            error:
              remaining > 0
                ? `Please wait ${remaining} seconds before requesting another verification link.`
                : 'Please wait before requesting another verification link.',
          });
          return;
        }

        set({isLoading: true, error: null});
        try {
          const mtoken = state.identityToken;

          if (!mtoken) {
            throw new Error('Identity token (mtoken) not available. Please complete step 1 first.');
          }

          if (__DEV__) {
            // eslint-disable-next-line no-console
            console.log('📧 Sending SMFA email link with mtoken from identity step');
          }

          const sendLinkResponse = await identityService.sendSMFALink(mtoken, 'email');

          const smfaToken = sendLinkResponse?.token || null;

          if (!smfaToken) {
            throw new Error('Failed to get SMFA token from email verification response');
          }

          set({
            phoneVerificationToken: smfaToken,
            smsMessage: null,
            isLoading: false,
            serviceFailure: false,
            smfaFailure: null,
            smfaChannel: 'email',
            smfaCooldownUntil: Date.now() + 30000,
          });
        } catch (error) {
          const isAxiosError = (err: unknown): err is AxiosError =>
            typeof err === 'object' && err !== null && (err as AxiosError).isAxiosError === true;

          const update: Partial<IdentityVerificationState> = {
            error: handleApiError(error),
            isLoading: false,
            serviceFailure: false,
            smfaFailure: null,
          };

          if (isAxiosError(error)) {
            const data = (error.response?.data || {}) as {
              codes?: string[];
              messages?: string[];
              details?: string[];
            };
            const codes = data.codes || [];
            const messages = data.messages || [];
            const details = data.details;
            const textBucket = [...messages, ...(details || []), ...codes.map(String)].map(entry =>
              entry.toLowerCase(),
            );
            const includes = (needle: string) =>
              textBucket.some(entry => entry.includes(needle.toLowerCase()));
            const primaryMessage =
              messages[0] || update.error || 'We could not send the verification email.';

            if (error.response?.status === 503) {
              update.serviceFailure = true;
              update.error = null;
            }

            if (error.response?.status === 400 && codes.includes('SC323')) {
              update.serviceFailure = true;
              update.error = null;
            }

            if (error.response?.status === 425 || codes.includes('SC327')) {
              update.error =
                messages[0] || 'Please wait 30 seconds before requesting another link.';
              update.smfaCooldownUntil = Date.now() + 30000;
            }

            const alreadyHandled = update.serviceFailure || update.smfaFailure !== null;

            if (!alreadyHandled) {
              const isServiceIssue =
                includes('service unavailable') ||
                includes('temporarily unavailable') ||
                includes('enrollment error') ||
                includes('vs3');
              const isSendFailure = includes('send failure') || includes('send failed');
              const isThinFile =
                includes('thinfile') || includes('thin file') || includes('userthinfile');
              const isVerificationDenied =
                includes('verification failed') ||
                includes('denied') ||
                includes('smfa status failed');
              const isIncomplete = includes('incomplete');

              if (isServiceIssue || isSendFailure) {
                update.serviceFailure = true;
                update.error = null;
              } else if (isThinFile || isVerificationDenied || isIncomplete) {
                update.smfaFailure = {
                  message: primaryMessage,
                  details,
                  codes,
                };
                update.error = null;
              }
            }
          }

          set(update);
          throw error;
        }
      },

      verifyPhoneCode: async (code: string) => {
        set({isLoading: true, error: null});
        try {
          const state = get();
          // Get smfaToken from step 2 (stored in phoneVerificationToken after send-link)
          const smfaToken = state.phoneVerificationToken;

          if (!smfaToken) {
            throw new Error('SMFA token not available. Please send verification link first.');
          }

          if (__DEV__) {
            // eslint-disable-next-line no-console
            console.log('🔐 Verifying SMFA status with smfaToken');
            // Note: code parameter is kept for compatibility but not used in SMFA flow
            // User clicks the SMS link to verify, then clicks continue here
          }

          // Call SMFA verify-status endpoint with smfaToken
          await identityService.verifySMFAStatus(smfaToken);

          if (__DEV__) {
            // eslint-disable-next-line no-console
            console.log('✅ SMFA verification completed successfully');
          }

          // Update state on successful verification
          set({
            phoneVerified: true,
            verificationStep: 'completed',
            phoneVerificationCode: code, // Keep for display purposes
            isVerificationComplete: true,
            isLoading: false,
            serviceFailure: false,
            smfaFailure: null,
            smfaCooldownUntil: null,
          });
        } catch (error) {
          if (__DEV__) {
            // eslint-disable-next-line no-console
            console.error('❌ SMFA verification failed:', error);
          }
          const isAxiosError = (err: unknown): err is AxiosError =>
            typeof err === 'object' && err !== null && (err as AxiosError).isAxiosError === true;

          const update: Partial<IdentityVerificationState> = {
            error: handleApiError(error),
            isLoading: false,
            serviceFailure: false,
            smfaFailure: null,
          };

          if (isAxiosError(error)) {
            const data = (error.response?.data || {}) as {
              codes?: string[];
              messages?: string[];
              details?: string[];
            };
            const codes = data.codes || [];
            const messages = data.messages || [];
            const details = data.details;
            const textBucket = [...messages, ...(details || []), ...codes.map(String)].map(entry =>
              entry.toLowerCase(),
            );
            const includes = (needle: string) =>
              textBucket.some(entry => entry.includes(needle.toLowerCase()));
            const primaryMessage =
              messages[0] || update.error || 'SMFA verification not successful.';

            if (error.response?.status === 503) {
              update.serviceFailure = true;
              update.error = null;
            }

            if (error.response?.status === 400 && codes.includes('SC324')) {
              update.smfaFailure = {
                message: primaryMessage,
                details,
                codes,
              };
              update.error = null;
            }

            const alreadyHandled = update.serviceFailure || update.smfaFailure !== null;

            if (!alreadyHandled) {
              const isServiceIssue =
                includes('service unavailable') ||
                includes('temporarily unavailable') ||
                includes('vs3');
              const isEnrollmentError = includes('enrollment error');
              const isThinFile =
                includes('thinfile') || includes('thin file') || includes('userthinfile');
              const isVerificationDenied =
                includes('verification failed') ||
                includes('denied') ||
                includes('smfa status failed');
              const isIncomplete = includes('incomplete');

              if (isServiceIssue || isEnrollmentError) {
                update.serviceFailure = true;
                update.error = null;
              } else if (isThinFile || isVerificationDenied || isIncomplete) {
                update.smfaFailure = {
                  message: primaryMessage,
                  details,
                  codes,
                };
                update.error = null;
              }
            }
          }

          set(update);
          throw error;
        }
      },

      // Alias for sendPhoneVerificationCode
      sendVerificationCode: async () => {
        return await get().sendPhoneVerificationCode();
      },

      // Alias for verifyPhoneCode
      verifyCode: async (code: string) => {
        return await get().verifyPhoneCode(code);
      },

      // Navigation Actions
      setVerificationStep: (step: IdentityVerificationState['verificationStep']) => {
        set({verificationStep: step});
      },

      completeVerification: () => {
        set({
          isVerificationComplete: true,
          verificationStep: 'completed',
        });
      },

      resetVerification: () => {
        set({
          personalInfo: {},
          phoneNumber: '',
          phoneVerificationCode: '',
          phoneVerificationToken: null,
          identityToken: null,
          smsMessage: null,
          phoneVerified: false,
          smfaChannel: 'phone',
          smfaCooldownUntil: null,
          verificationStep: 'personal',
          isVerificationComplete: false,
          verificationLevel: 'basic',
          error: null,
          identityFailure: null,
          serviceFailure: false,
          smfaFailure: null,
        });
      },

      // Utility Actions
      setLoading: (loading: boolean) => {
        set({isLoading: loading});
      },

      setError: (error: string | null) => {
        set({error});
      },

      clearError: () => {
        set({error: null});
      },

      clearIdentityFailure: () => {
        set({identityFailure: null});
      },

      clearServiceFailure: () => {
        set({serviceFailure: false});
      },

      clearSmfaFailure: () => {
        set({smfaFailure: null});
      },
    }),
    {
      name: 'creditguard-identity',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        personalInfo: state.personalInfo,
        phoneNumber: state.phoneNumber,
        phoneVerified: state.phoneVerified,
        verificationLevel: state.verificationLevel,
        isVerificationComplete: state.isVerificationComplete,
      }),
    },
  ),
);
