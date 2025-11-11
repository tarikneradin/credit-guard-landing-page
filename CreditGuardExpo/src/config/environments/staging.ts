import {AppConfig} from '../environment';

export const stagingConfig: AppConfig = {
  api: {
    baseUrl: 'https://staging-api.creditguard.com/api',
    timeout: 10000,
    enableMockData: false, // Use real APIs in staging
  },
  features: {
    aiAssistant: true,
    biometricAuth: true,
    pushNotifications: true,
    premiumFeatures: false, // Testing premium features
    offlineMode: true,
  },
  external: {
    openai: {
      apiKey: undefined, // Will be loaded from environment
      model: 'gpt-4',
      maxTokens: 1500,
    },
    creditBureaus: {
      experian: {
        apiKey: undefined,
        sandboxMode: true, // Still sandbox in staging
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
    tokenRefreshThreshold: 5,
    maxRetryAttempts: 3,
  },
  development: {
    enableLogging: true,
    enableDebugMode: false, // Reduced debugging in staging
    logLevel: 'info',
  },
};
