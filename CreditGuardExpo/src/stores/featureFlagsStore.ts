import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FeatureFlags {
  // Main Features
  creditScore: boolean;
  creditReport: boolean;
  collections: boolean;
  identityMonitoring: boolean;
  disputes: boolean;

  // Score Sub-features
  scoreTrend: boolean;
  improvementPlan: boolean;
  achievements: boolean;

  // Report Sub-features
  accounts: boolean;
  paymentHistory: boolean;
  creditInquiries: boolean;
  publicRecords: boolean;
  personalInfo: boolean;

  // AI Tools
  aiAssistant: boolean;
  smartActions: boolean;
  optimalPath: boolean;

  // Offers
  offers: boolean;

  // Tools & Utilities
  darkMode: boolean;
  notifications: boolean;
}

interface FeatureFlagsState {
  flags: FeatureFlags;
  isLoading: boolean;
  loadFlags: () => Promise<void>;
  toggleFeature: (feature: keyof FeatureFlags) => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

const DEFAULT_FLAGS: FeatureFlags = {
  // Main Features - All enabled by default
  creditScore: true,
  creditReport: true,
  collections: true,
  identityMonitoring: true,
  disputes: true,

  // Score Sub-features
  scoreTrend: true,
  improvementPlan: true,
  achievements: true,

  // Report Sub-features
  accounts: true,
  paymentHistory: true,
  creditInquiries: true,
  publicRecords: true,
  personalInfo: true,

  // AI Tools
  aiAssistant: true,
  smartActions: true,
  optimalPath: true,

  // Offers
  offers: true,

  // Tools & Utilities
  darkMode: true,
  notifications: true,
};

const STORAGE_KEY = '@credit_guard:feature_flags';

export const useFeatureFlagsStore = create<FeatureFlagsState>((set, get) => ({
  flags: DEFAULT_FLAGS,
  isLoading: true,

  loadFlags: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedFlags = JSON.parse(stored);
        set({flags: {...DEFAULT_FLAGS, ...parsedFlags}, isLoading: false});
      } else {
        set({flags: DEFAULT_FLAGS, isLoading: false});
      }
    } catch {
      set({flags: DEFAULT_FLAGS, isLoading: false});
    }
  },

  toggleFeature: async (feature: keyof FeatureFlags) => {
    const currentFlags = get().flags;
    const newFlags = {
      ...currentFlags,
      [feature]: !currentFlags[feature],
    };

    set({flags: newFlags});

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newFlags));
    } catch {
      // Silently fail
    }
  },

  resetToDefaults: async () => {
    set({flags: DEFAULT_FLAGS});
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_FLAGS));
    } catch {
      // Silently fail
    }
  },
}));
