import {create} from 'zustand';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  profilePicture?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  dateOfBirth?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: string;
}

export interface SecuritySettings {
  biometricEnabled: boolean;
  pinEnabled: boolean;
  twoFactorEnabled: boolean;
  sessionTimeout: number; // minutes
}

export interface NotificationSettings {
  scoreUpdates: boolean;
  accountChanges: boolean;
  paymentReminders: boolean;
  marketingEmails: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

interface UserProfileState {
  profile: UserProfile | null;
  securitySettings: SecuritySettings;
  notificationSettings: NotificationSettings;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateProfilePicture: (imageUri: string) => Promise<void>;
  updateSecuritySettings: (settings: Partial<SecuritySettings>) => Promise<void>;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  changePassword: (currentPassword: string, _newPassword: string) => Promise<void>;
  clearError: () => void;
}

// Mock user profile data
const mockUserProfile: UserProfile = {
  id: 'user_123',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1 (555) 123-4567',
  profilePicture: undefined,
  isEmailVerified: true,
  isPhoneVerified: true,
  dateOfBirth: '1990-05-15',
  address: {
    street: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
  },
  createdAt: '2024-01-15T10:00:00Z',
};

const mockSecuritySettings: SecuritySettings = {
  biometricEnabled: true,
  pinEnabled: false,
  twoFactorEnabled: false,
  sessionTimeout: 15,
};

const mockNotificationSettings: NotificationSettings = {
  scoreUpdates: true,
  accountChanges: true,
  paymentReminders: true,
  marketingEmails: false,
  pushNotifications: true,
  emailNotifications: true,
  smsNotifications: false,
};

export const useUserProfileStore = create<UserProfileState>((_set, _get) => ({
  profile: null,
  securitySettings: mockSecuritySettings,
  notificationSettings: mockNotificationSettings,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    try {
      set({isLoading: true, error: null});

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      set({
        profile: mockUserProfile,
        isLoading: false,
      });
    } catch (_error) {
      set({
        error: 'Failed to fetch profile',
        isLoading: false,
      });
    }
  },

  updateProfile: async (updates: Partial<UserProfile>) => {
    try {
      set({isLoading: true, error: null});

      await new Promise(resolve => setTimeout(resolve, 800));

      set(state => ({
        profile: state.profile ? {...state.profile, ...updates} : null,
        isLoading: false,
      }));
    } catch (_error) {
      set({
        error: 'Failed to update profile',
        isLoading: false,
      });
      throw error;
    }
  },

  updateProfilePicture: async (imageUri: string) => {
    try {
      set({isLoading: true, error: null});

      await new Promise(resolve => setTimeout(resolve, 1000));

      set(state => ({
        profile: state.profile ? {...state.profile, profilePicture: imageUri} : null,
        isLoading: false,
      }));
    } catch (_error) {
      set({
        error: 'Failed to update profile picture',
        isLoading: false,
      });
      throw error;
    }
  },

  updateSecuritySettings: async (settings: Partial<SecuritySettings>) => {
    try {
      set({isLoading: true, error: null});

      await new Promise(resolve => setTimeout(resolve, 500));

      set(state => ({
        securitySettings: {...state.securitySettings, ...settings},
        isLoading: false,
      }));
    } catch (_error) {
      set({
        error: 'Failed to update security settings',
        isLoading: false,
      });
      throw error;
    }
  },

  updateNotificationSettings: async (settings: Partial<NotificationSettings>) => {
    try {
      set({isLoading: true, error: null});

      await new Promise(resolve => setTimeout(resolve, 500));

      set(state => ({
        notificationSettings: {...state.notificationSettings, ...settings},
        isLoading: false,
      }));
    } catch (_error) {
      set({
        error: 'Failed to update notification settings',
        isLoading: false,
      });
      throw error;
    }
  },

  changePassword: async (currentPassword: string, _newPassword: string) => {
    try {
      set({isLoading: true, error: null});

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation
      if (currentPassword === 'wrong') {
        throw new Error('Current password is incorrect');
      }

      set({isLoading: false});
    } catch (_error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to change password',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => {
    set({error: null});
  },
}));
