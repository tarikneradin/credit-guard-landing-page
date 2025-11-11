import {AppConfig} from '../environment';

export const developmentConfig: AppConfig = {
  api: {
    baseUrl: 'http://localhost:3000/api',
    timeout: 15000, // Longer timeout for development
    enableMockData: true, // Enable mock data by default in development
  },
  features: {
    aiAssistant: true,
    biometricAuth: false, // Disabled in development for easier testing
    pushNotifications: false, // Disabled in development
    premiumFeatures: false, // Disabled by default
    offlineMode: true,
  },
  external: {
    openai: {
      apiKey: undefined, // Will be loaded from environment
      model: 'gpt-4',
      maxTokens: 2000,
    },
    creditBureaus: {
      experian: {
        apiKey: undefined, // Will be loaded from environment
        sandboxMode: true, // Always sandbox in development
      },
      transunion: {
        apiKey: undefined,
        sandboxMode: true,
      },
      equifax: {
        apiKey: undefined,
        sandboxMode: true,
      },
    },
    firebase: {
      apiKey: undefined,
      projectId: undefined,
      messagingSenderId: undefined,
      appId: undefined,
    },
  },
  security: {
    enableTokenRefresh: true,
    tokenRefreshThreshold: 5, // 5 minutes before expiry
    maxRetryAttempts: 3,
  },
  development: {
    enableLogging: true,
    enableDebugMode: true,
    logLevel: 'debug',
  },
};
