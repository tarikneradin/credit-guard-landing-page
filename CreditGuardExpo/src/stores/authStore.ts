import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authService} from '../api/services/authService';
import {handleApiError} from '../api/client';
import {setAccessToken, setRefreshToken, getHostId, setHostId} from '../utils/storage';
import {newAuthService} from '../api/services/newAuthService';
import {equifaxService} from '../api/services/equifaxService';

export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  profilePicture?: string;
  isVerified: boolean;
  verificationLevel: 'basic' | 'identity' | 'full';
}

export interface AuthState {
  // State
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  isIdentityCompleted: boolean;
  authStep: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name?: string, phone?: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setIdentityCompleted: (completed: boolean) => void;
  setAuthStep: (step: string | null) => void;
  checkAuthState: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
      token: null,
      isIdentityCompleted: true, // SET TO FALSE IN PROD
      authStep: null,

      // Actions
      login: async (email: string, password: string) => {
        set({isLoading: true, error: null, authStep: null});

        // Set up step callback
        newAuthService.setStepCallback((step: string) => {
          set({authStep: step});
        });

        try {
          // Demo bypass option - allows testing without real API
          if (email === 'demo@creditguard.com' || email === 'demo') {
            set({authStep: 'Demo mode - Loading...'});
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            const demoUser: User = {
              id: 'demo-user-123',
              email: 'demo@creditguard.com',
              name: 'Demo User',
              phone: '+1 (555) 123-4567',
              isVerified: true,
              verificationLevel: 'full',
            };

            // Store demo tokens
            await setAccessToken('demo-token-123');
            await setRefreshToken('demo-refresh-123');

            set({
              isAuthenticated: true,
              user: demoUser,
              token: 'demo-token-123',
              isIdentityCompleted: true,
              isLoading: false,
            });
            return;
          }

          try {
            // Use new authentication flow
            const authResult = await newAuthService.authenticate(email, password);

            // Store Equifax user token as access token (apiClient uses this for Equifax API calls)
            // The apiClient is configured for Equifax API, so it needs the equifaxUserToken
            await setAccessToken(authResult.equifaxUserToken);
            await setRefreshToken(authResult.preauthToken);

            // Also store backend token in the store for backend API calls if needed
            // Set Equifax token for equifaxService (used by equifaxService directly)
            equifaxService.setUserToken(authResult.equifaxUserToken);

            // Get identity verification status from idpass field in preauth-token response
            // idpass indicates whether identity verification is complete
            const isIdentityCompleted = authResult.idpass === true;
            const verificationLevel: 'basic' | 'identity' | 'full' = isIdentityCompleted
              ? 'full'
              : 'basic';

            // Create user object from login response
            const user: User = {
              id: authResult.loginResponse.user.id,
              email: authResult.loginResponse.user.email,
              name: `${authResult.loginResponse.user.fname} ${authResult.loginResponse.user.lname}`.trim(),
              firstName: authResult.loginResponse.user.fname,
              lastName: authResult.loginResponse.user.lname,
              phone: authResult.loginResponse.user.mobile,
              isVerified: authResult.loginResponse.user.active,
              verificationLevel,
            };

            set({
              isAuthenticated: true,
              user,
              token: authResult.equifaxUserToken, // Store Equifax token in store as well
              isIdentityCompleted,
              isLoading: false,
              authStep: null,
            });
          } catch (authError) {
            // If Step 3 (Equifax) fails, we can still proceed with basic login
            const tokens = newAuthService.getTokens();
            if (tokens.backendToken && tokens.userId && tokens.loginResponse) {
              // Try to get Equifax token if we have preauth token
              let equifaxToken = tokens.equifaxUserToken;
              if (!equifaxToken && tokens.preauthToken) {
                try {
                  const equifaxTokenResult = await newAuthService.getEquifaxUserToken();
                  equifaxToken = equifaxTokenResult.token;
                } catch {
                  // If Equifax token fetch fails, we'll use backend token as fallback
                  // Note: Equifax API calls won't work with backend token
                }
              }

              // Store Equifax token if available, otherwise fallback to backend token
              if (equifaxToken) {
                await setAccessToken(equifaxToken);
                equifaxService.setUserToken(equifaxToken);
              } else {
                await setAccessToken(tokens.backendToken);
              }
              if (tokens.preauthToken) {
                await setRefreshToken(tokens.preauthToken);
              }

              // Get identity verification status from idpass field
              // Try to get it from the Equifax token response if available
              let isIdentityCompleted = false;
              let verificationLevel: 'basic' | 'identity' | 'full' = 'basic';

              // If we have a preauth token, try to get idpass from it
              if (tokens.preauthToken) {
                try {
                  const equifaxTokenResult = await newAuthService.getEquifaxUserToken();
                  isIdentityCompleted = equifaxTokenResult.idpass === true;
                  verificationLevel = isIdentityCompleted ? 'full' : 'basic';
                } catch {
                  // If we can't get idpass, assume not verified
                  if (__DEV__) {
                    // eslint-disable-next-line no-console
                    console.warn('Failed to get idpass from preauth-token response');
                  }
                  isIdentityCompleted = false;
                  verificationLevel = 'basic';
                }
              }

              // Get user from login response stored in service
              const user: User = {
                id: tokens.loginResponse.user.id,
                email: tokens.loginResponse.user.email,
                name: `${tokens.loginResponse.user.fname} ${tokens.loginResponse.user.lname}`.trim(),
                firstName: tokens.loginResponse.user.fname,
                lastName: tokens.loginResponse.user.lname,
                phone: tokens.loginResponse.user.mobile,
                isVerified: tokens.loginResponse.user.active,
                verificationLevel,
              };

              set({
                isAuthenticated: true,
                user,
                token: tokens.equifaxUserToken || tokens.backendToken, // Prefer Equifax token
                isIdentityCompleted,
                isLoading: false,
                authStep: null,
                error: 'Limited functionality: Credit bureau connection failed',
              });
            } else {
              // Complete failure
              throw authError;
            }
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('❌ Login failed:', error);
          const errorMessage = handleApiError(error);
          set({
            error: errorMessage,
            isLoading: false,
            authStep: null,
          });
        } finally {
          // Clean up step callback
          newAuthService.clearStepCallback();
        }
      },

      logout: async () => {
        // Clear tokens from storage
        await setAccessToken(null);
        await setRefreshToken(null);

        // Clear auth service tokens
        newAuthService.clearTokens();
        equifaxService.clearToken();

        // Clear auth state
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          isIdentityCompleted: false,
          error: null,
        });
      },

      register: async (email: string, password: string, name?: string, phone?: string) => {
        set({isLoading: true, error: null});
        try {
          // Demo bypass option - allows testing without real API
          const lowerName = name?.toLowerCase() ?? '';
          if (email.includes('demo') || lowerName.includes('demo')) {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1200));

            const demoUser: User = {
              id: 'demo-user-new-123',
              email: email,
              name: name?.trim() || email || 'Demo User',
              phone: phone || '+1 (555) 123-4567',
              isVerified: false,
              verificationLevel: 'basic', // New users need identity verification
            };

            // Store demo tokens
            await setAccessToken('demo-token-new-123');
            await setRefreshToken('demo-refresh-new-123');

            set({
              isAuthenticated: true,
              user: demoUser,
              token: 'demo-token-new-123',
              isIdentityCompleted: false, // New users go to identity verification
              isLoading: false,
            });
            return;
          }

          // Split name into first and last name if provided
          const nameParts = name?.trim() ? name.trim().split(' ') : [];
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';

          // Step 1: Get or retrieve hostId
          // Require EXPO_PUBLIC_HOST_ID to be configured for production
          let hostId = await getHostId();

          if (!hostId) {
            hostId = process.env.EXPO_PUBLIC_HOST_ID || null;

            if (!hostId) {
              throw new Error(
                'Host ID not configured. Set EXPO_PUBLIC_HOST_ID in your environment before registering users.',
              );
            }

            await setHostId(hostId);
          }

          if (!hostId) {
            throw new Error(
              'Host ID not configured. Set EXPO_PUBLIC_HOST_ID in your environment before registering users.',
            );
          }

          // Step 2: Get customer token using hostId
          const customerTokenResponse = await authService.getCustomerToken(hostId);
          const customerToken = customerTokenResponse.token;

          // Step 3: Register user with customer token
          const registerResponse = await authService.register(
            {
              email,
              password,
              firstName: firstName || undefined,
              lastName: lastName || undefined,
              phone: phone,
            },
            customerToken,
            hostId,
          );

          // Step 4: After registration, login to get backend token
          const loginResponse = await newAuthService.login(email, password);

          // Step 5: Get pre-auth token
          const preauthToken = await newAuthService.getPreauthToken();

          // Step 6: Get Equifax user token
          let equifaxUserToken: string | null = null;
          try {
            equifaxUserToken = (await newAuthService.getEquifaxUserToken())?.token;
          } catch (error) {
            // If Equifax token fails, we can still proceed but identity verification won't work
            if (__DEV__) {
              // eslint-disable-next-line no-console
              console.warn('Failed to get Equifax user token:', error);
            }
          }

          // Store Equifax user token as access token (apiClient uses this for Equifax API calls)
          if (equifaxUserToken) {
            await setAccessToken(equifaxUserToken);
            equifaxService.setUserToken(equifaxUserToken);
          } else {
            // Fallback to backend token if Equifax token unavailable
            await setAccessToken(loginResponse.token);
          }
          await setRefreshToken(preauthToken);

          const user: User = {
            id: registerResponse.user.id || loginResponse.user.id,
            email: registerResponse.user.email,
            name:
              registerResponse.user.firstName || registerResponse.user.lastName
                ? `${registerResponse.user.firstName || ''} ${
                    registerResponse.user.lastName || ''
                  }`.trim()
                : registerResponse.user.email?.split('@')[0] || 'New User',
            phone: registerResponse.user.phone,
            isVerified: false,
            verificationLevel: 'basic',
          };

          set({
            isAuthenticated: true,
            user,
            token: equifaxUserToken || loginResponse.token, // Prefer Equifax token
            isIdentityCompleted: false,
            isLoading: false,
          });
        } catch (error) {
          const errorMessage = handleApiError(error);
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      forgotPassword: async (email: string) => {
        set({isLoading: true, error: null});
        try {
          // Demo mode - simulate forgot password
          if (email.includes('demo') || email === 'demo@creditguard.com') {
            await new Promise(resolve => setTimeout(resolve, 1000));
            set({isLoading: false});
            return;
          }

          // Call real API
          await authService.forgotPassword(email);
          set({isLoading: false});
        } catch (error) {
          const errorMessage = handleApiError(error);
          set({
            error: errorMessage,
            isLoading: false,
          });
        }
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {...currentUser, ...updates},
          });
        }
      },

      clearError: () => {
        set({error: null});
      },

      setLoading: (loading: boolean) => {
        set({isLoading: loading});
      },

      setIdentityCompleted: (completed: boolean) => {
        set({isIdentityCompleted: completed});
      },

      setAuthStep: (step: string | null) => {
        set({authStep: step});
      },

      checkAuthState: async () => {
        set({isLoading: true});
        try {
          const currentState = get();

          if (currentState.token && currentState.user) {
            // Validate token with real API call
            const userProfile = await authService.getCurrentUser();

            // Update user data from API
            const user: User = {
              id: userProfile.id,
              email: userProfile.email,
              name:
                userProfile.name ||
                `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim(),
              phone: userProfile.phone,
              profilePicture: userProfile.profilePicture,
              isVerified: userProfile.isVerified || false,
              verificationLevel: userProfile.verificationLevel || 'basic',
            };

            set({
              isAuthenticated: true,
              user,
              isIdentityCompleted: user.verificationLevel === 'full',
              isLoading: false,
            });
          } else {
            // No stored auth data
            set({
              isAuthenticated: false,
              isIdentityCompleted: false,
              isLoading: false,
            });
          }
        } catch {
          // Auth check failed, clear auth state
          await setAccessToken(null);
          await setRefreshToken(null);

          set({
            isAuthenticated: false,
            user: null,
            token: null,
            isIdentityCompleted: false,
            isLoading: false,
            error: null, // Don't show error for failed auth check
          });
        }
      },
    }),
    {
      name: 'creditguard-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
        isIdentityCompleted: state.isIdentityCompleted,
      }),
    },
  ),
);
