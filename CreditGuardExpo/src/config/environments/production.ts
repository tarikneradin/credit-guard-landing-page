import {AppConfig} from '../environment';

export const productionConfig: AppConfig = {
  api: {
    baseUrl: 'https://api.creditguard.com/api',
    timeout: 8000,
    enableMockData: false, // Never use mock data in production
  },
  features: {
    aiAssistant: true,
    biometricAuth: true,
    pushNotifications: true,
    premiumFeatures: true, // Premium features enabled in production
    offlineMode: true,
  },
  external: {
    openai: {
      apiKey: undefined, // Must be set via environment variables
      model: 'gpt-4',
      maxTokens: 1000, // Conservative token usage in production
    },
    creditBureaus: {
      experian: {
        apiKey: undefined, // Must be set via environment variables
        sandboxMode: false, // Real credit bureau APIs in production
      },
      transunion: {
        apiKey: undefined,
        sandboxMode: false,
      },
      equifax: {
        apiKey: undefined,
        sandboxMode: false,
      },
    },
    firebase: {
      apiKey: undefined, // Must be set via environment variables
      projectId: undefined,
      messagingSenderId: undefined,
      appId: undefined,
    },
  },
  security: {
    enableTokenRefresh: true,
    tokenRefreshThreshold: 10, // 10 minutes before expiry for production stability
    maxRetryAttempts: 2, // Fewer retries in production
  },
  development: {
    enableLogging: false, // Minimal logging in production
    enableDebugMode: false,
    logLevel: 'error', // Only log errors in production
  },
};
