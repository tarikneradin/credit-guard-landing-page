import Constants from 'expo-constants';
import {developmentConfig} from './environments/development';
import {stagingConfig} from './environments/staging';
import {productionConfig} from './environments/production';

export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
    enableMockData: boolean;
  };
  features: {
    aiAssistant: boolean;
    biometricAuth: boolean;
    pushNotifications: boolean;
    premiumFeatures: boolean;
    offlineMode: boolean;
  };
  external: {
    openai: {
      apiKey?: string;
      model: string;
      maxTokens: number;
    };
    creditBureaus: {
      experian: {apiKey?: string; sandboxMode: boolean};
      transunion: {apiKey?: string; sandboxMode: boolean};
      equifax: {apiKey?: string; sandboxMode: boolean};
    };
    firebase: {
      apiKey?: string;
      projectId?: string;
      messagingSenderId?: string;
      appId?: string;
    };
  };
  security: {
    enableTokenRefresh: boolean;
    tokenRefreshThreshold: number; // minutes before expiry
    maxRetryAttempts: number;
  };
  development: {
    enableLogging: boolean;
    enableDebugMode: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  };
}

type Environment = 'development' | 'staging' | 'production';

const getEnvironment = (): Environment => {
  // Check if running in production build
  if (Constants.executionEnvironment === 'storeClient') {
    return 'production';
  }

  // Check explicit environment override
  const envOverride = process.env.EXPO_PUBLIC_ENVIRONMENT as Environment;
  if (envOverride && ['development', 'staging', 'production'].includes(envOverride)) {
    return envOverride;
  }

  // Default to development for dev builds
  return __DEV__ ? 'development' : 'production';
};

const getConfigForEnvironment = (env: Environment): AppConfig => {
  switch (env) {
    case 'development':
      return developmentConfig;
    case 'staging':
      return stagingConfig;
    case 'production':
      return productionConfig;
    default:
      return developmentConfig;
  }
};

// Environment detection and validation
const currentEnvironment = getEnvironment();
const baseConfig = getConfigForEnvironment(currentEnvironment);

// Override with environment variables if available
const config: AppConfig = {
  ...baseConfig,
  api: {
    ...baseConfig.api,
    baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || baseConfig.api.baseUrl,
    timeout: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '', 10) || baseConfig.api.timeout,
    enableMockData:
      process.env.EXPO_PUBLIC_USE_MOCK_DATA === 'true' || baseConfig.api.enableMockData,
  },
  features: {
    ...baseConfig.features,
    aiAssistant:
      process.env.EXPO_PUBLIC_ENABLE_AI_FEATURES !== 'false' && baseConfig.features.aiAssistant,
    biometricAuth:
      process.env.EXPO_PUBLIC_ENABLE_BIOMETRIC_AUTH !== 'false' &&
      baseConfig.features.biometricAuth,
    pushNotifications:
      process.env.EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS !== 'false' &&
      baseConfig.features.pushNotifications,
    premiumFeatures:
      process.env.EXPO_PUBLIC_ENABLE_PREMIUM_FEATURES === 'true' ||
      baseConfig.features.premiumFeatures,
  },
  external: {
    ...baseConfig.external,
    openai: {
      ...baseConfig.external.openai,
      apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY || baseConfig.external.openai.apiKey,
      model: process.env.EXPO_PUBLIC_OPENAI_MODEL || baseConfig.external.openai.model,
      maxTokens:
        parseInt(process.env.EXPO_PUBLIC_OPENAI_MAX_TOKENS || '', 10) ||
        baseConfig.external.openai.maxTokens,
    },
    creditBureaus: {
      experian: {
        apiKey:
          process.env.EXPO_PUBLIC_EXPERIAN_API_KEY ||
          baseConfig.external.creditBureaus.experian.apiKey,
        sandboxMode:
          process.env.EXPO_PUBLIC_EXPERIAN_SANDBOX_MODE !== 'false' &&
          baseConfig.external.creditBureaus.experian.sandboxMode,
      },
      transunion: {
        apiKey:
          process.env.EXPO_PUBLIC_TRANSUNION_API_KEY ||
          baseConfig.external.creditBureaus.transunion.apiKey,
        sandboxMode:
          process.env.EXPO_PUBLIC_TRANSUNION_SANDBOX_MODE !== 'false' &&
          baseConfig.external.creditBureaus.transunion.sandboxMode,
      },
      equifax: {
        apiKey:
          process.env.EXPO_PUBLIC_EQUIFAX_API_KEY ||
          baseConfig.external.creditBureaus.equifax.apiKey,
        sandboxMode:
          process.env.EXPO_PUBLIC_EQUIFAX_SANDBOX_MODE !== 'false' &&
          baseConfig.external.creditBureaus.equifax.sandboxMode,
      },
    },
    firebase: {
      apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || baseConfig.external.firebase.apiKey,
      projectId:
        process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || baseConfig.external.firebase.projectId,
      messagingSenderId:
        process.env.EXPO_PUBLIC_FCM_SENDER_ID || baseConfig.external.firebase.messagingSenderId,
      appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || baseConfig.external.firebase.appId,
    },
  },
};

// Configuration validation
const validateConfig = (appConfig: AppConfig): void => {
  const errors: string[] = [];

  if (!appConfig.api.baseUrl) {
    errors.push('API_BASE_URL is required');
  }

  if (
    appConfig.features.aiAssistant &&
    !appConfig.external.openai.apiKey &&
    !appConfig.api.enableMockData
  ) {
    errors.push('OPENAI_API_KEY is required when AI features are enabled');
  }

  if (
    appConfig.features.pushNotifications &&
    !appConfig.external.firebase.apiKey &&
    !appConfig.api.enableMockData
  ) {
    errors.push('FIREBASE_API_KEY is required when push notifications are enabled');
  }

  if (errors.length > 0) {
    // eslint-disable-next-line no-console
    console.error('❌ Configuration validation failed:');
    // eslint-disable-next-line no-console
    errors.forEach(error => console.error(`  - ${error}`));

    if (currentEnvironment === 'production') {
      throw new Error('Invalid configuration for production environment');
    }
  }
};

// Validate configuration
validateConfig(config);

export {config, currentEnvironment};
export default config;
