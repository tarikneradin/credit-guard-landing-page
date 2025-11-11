# CreditGuard Mobile App - Technical Specification

## Executive Summary

This specification outlines the development of a React Native mobile application for iOS (with Android compatibility) that transforms the existing consumer credit widget into a standalone mobile app called **CreditGuard**. The app will provide credit monitoring, identity verification, and account management with enhanced mobile-first features and seamless API integration.

## Technical Architecture

### Core Technology Stack
- **Framework**: React Native 0.72+ with TypeScript
- **State Management**: Zustand (lightweight, mobile-optimized)
- **Navigation**: React Navigation 6
- **UI Framework**: Custom Design System (no dependency on existing web UI)
- **Charts**: Victory Native for credit score visualizations
- **Authentication**: React Native Keychain + Biometric authentication
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **Camera/Scanning**: React Native Vision Camera + ML Kit OCR
- **HTTP Client**: Axios with interceptors (reusing existing API layer)
- **Testing**: Jest + Detox for E2E
- **Build Tools**: Flipper for debugging, Fastlane for deployment

### Architecture Patterns
- **Clean Architecture** with separation of concerns
- **Feature-based folder structure**
- **Custom hooks** for business logic
- **Provider pattern** for cross-cutting concerns
- **API-first design** leveraging existing backend services

---

## Implementation Tasks

### Task 1: Project Setup & Foundation

**Objective**: Set up React Native project with TypeScript, navigation, API integration, and industry-standard tooling

**Technical Requirements**:
```bash
# Core dependencies
react-native init CreditGuard --template react-native-template-typescript
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install zustand react-native-keychain react-native-biometrics
npm install react-native-vector-icons @react-native-async-storage/async-storage
npm install axios react-native-config

# Styling & UI
npm install react-native-reanimated react-native-gesture-handler
npm install react-native-svg react-native-linear-gradient
npm install react-native-safe-area-view react-native-device-info

# Error Monitoring & Analytics
npm install @sentry/react-native @react-native-firebase/app
npm install @react-native-firebase/crashlytics @react-native-firebase/analytics
npm install @react-native-firebase/messaging flipper-plugin-async-storage

# Development & Quality Tools
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install --save-dev eslint-plugin-react eslint-plugin-react-hooks
npm install --save-dev eslint-plugin-react-native eslint-config-prettier
npm install --save-dev prettier @react-native-community/eslint-config
npm install --save-dev husky lint-staged @commitlint/cli @commitlint/config-conventional
npm install --save-dev detox jest-circus metro-react-native-babel-preset
npm install --save-dev reactotron-react-native reactotron-redux
```

**Linting & Code Quality Setup**:
```json
// .eslintrc.js
module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'react-native'],
  rules: {
    // React Native specific
    'react-native/no-unused-styles': 'error',
    'react-native/split-platform-components': 'error',
    'react-native/no-inline-styles': 'error',
    'react-native/no-color-literals': 'error',
    'react-native/no-raw-text': 'error',

    // TypeScript
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',

    // React Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // General code quality
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-var': 'error'
  }
};
```

**Prettier Configuration**:
```json
// .prettierrc
{
  "arrowParens": "avoid",
  "bracketSameLine": true,
  "bracketSpacing": false,
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": true,
  "printWidth": 80
}
```

**Git Hooks Setup**:
```json
// package.json scripts
{
  "scripts": {
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx}\"",
    "prepare": "husky install"
  },
  "lint-staged": {
    "src/**/*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

**Enhanced File Structure** (API-focused with monitoring):
```
src/
├── api/                 # API service layer (mirror web app structure)
│   ├── endpoints.ts     # API endpoint definitions
│   ├── client.ts        # Axios configuration with error monitoring
│   └── services/        # Feature-specific API services
├── screens/             # Screen components
├── components/          # Reusable UI components
│   ├── design-system/   # Design system components
│   └── common/          # Shared components
├── navigation/          # Navigation configuration
├── stores/             # Zustand stores (mirror AppStore/UserStore logic)
├── hooks/              # Custom hooks for business logic
├── utils/              # Helper functions and token management
│   ├── monitoring/      # Error monitoring utilities
│   ├── styling/         # Style utilities and theme
│   └── validation/      # Form validation helpers
├── types/              # TypeScript definitions (mirror web interfaces)
├── constants/          # App constants and configuration
│   ├── colors.ts        # Color palette
│   ├── spacing.ts       # Spacing scale
│   └── typography.ts    # Typography definitions
├── services/           # Business logic services
│   ├── errorTracking.ts # Error monitoring service
│   └── analytics.ts     # Analytics service
└── assets/             # Images, fonts, etc.
```

**Error Monitoring Setup**:
```typescript
// src/services/errorTracking.ts
import * as Sentry from '@sentry/react-native';
import crashlytics from '@react-native-firebase/crashlytics';

export class ErrorTrackingService {
  static initialize(): void {
    // Sentry for detailed error tracking
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: __DEV__ ? 'development' : 'production',
      enableAutoSessionTracking: true,
      sessionTrackingIntervalMillis: 30000,
      beforeSend: (event) => {
        // Filter out development errors
        if (__DEV__) return null;
        return event;
      }
    });

    // Firebase Crashlytics for crash reporting
    crashlytics().setCrashlyticsCollectionEnabled(!__DEV__);
  }

  static logError(error: Error, context?: Record<string, any>): void {
    console.error('App Error:', error);

    // Log to Sentry
    Sentry.withScope(scope => {
      if (context) {
        scope.setContext('errorContext', context);
      }
      Sentry.captureException(error);
    });

    // Log to Crashlytics
    crashlytics().recordError(error);
  }

  static logApiFailure(
    endpoint: string,
    method: string,
    status: number,
    error: any
  ): void {
    const apiError = new Error(`API Failure: ${method} ${endpoint}`);

    this.logError(apiError, {
      endpoint,
      method,
      status,
      response: error.response?.data,
      timestamp: new Date().toISOString()
    });
  }

  static setUserContext(user: { id: string; email: string }): void {
    Sentry.setUser(user);
    crashlytics().setUserId(user.id);
  }
}
```

**Enhanced API Integration Setup**:
```typescript
// src/api/client.ts - Enhanced with error monitoring
import axios, { AxiosError } from 'axios';
import { getAccessToken, setAccessToken } from '../utils/token';
import { ErrorTrackingService } from '../services/errorTracking';

export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

// Request interceptor with token and monitoring
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracking
    config.metadata = {
      startTime: Date.now(),
      requestId: Math.random().toString(36).substr(2, 9)
    };

    return config;
  },
  (error) => {
    ErrorTrackingService.logError(error, { type: 'request_interceptor' });
    return Promise.reject(error);
  }
);

// Response interceptor with comprehensive error handling
apiClient.interceptors.response.use(
  (response) => {
    const duration = Date.now() - response.config.metadata?.startTime;

    // Log slow API calls
    if (duration > 5000) {
      ErrorTrackingService.logError(
        new Error('Slow API Response'),
        {
          endpoint: response.config.url,
          method: response.config.method,
          duration,
          status: response.status
        }
      );
    }

    return response;
  },
  (error: AxiosError) => {
    const { config, response } = error;

    // Log API failures with context
    ErrorTrackingService.logApiFailure(
      config?.url || 'unknown',
      config?.method?.toUpperCase() || 'unknown',
      response?.status || 0,
      error
    );

    // Handle specific error cases
    if (response?.status === 401) {
      // Token refresh logic here
      setAccessToken(null);
    }

    return Promise.reject(error);
  }
);
```

**Styling System Setup**:
```typescript
// src/constants/colors.ts
export const Colors = {
  // Credit monitoring theme
  primary: '#2563EB',
  secondary: '#059669',
  accent: '#7C3AED',
  warning: '#D97706',
  error: '#DC2626',
  surface: '#FFFFFF',
  background: '#F8FAFC',

  // Credit score colors
  scoreExcellent: '#059669',
  scoreGood: '#65A30D',
  scoreFair: '#D97706',
  scorePoor: '#DC2626',

  // Semantic colors
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    disabled: '#D1D5DB'
  },

  // Component states
  states: {
    hover: '#F3F4F6',
    pressed: '#E5E7EB',
    focused: '#DBEAFE',
    disabled: '#F9FAFB'
  }
} as const;

// src/constants/spacing.ts
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48
} as const;

// src/constants/typography.ts
import { Platform } from 'react-native';

export const Typography = {
  fontFamily: {
    regular: Platform.select({
      ios: 'SF Pro Text',
      android: 'Inter-Regular'
    }),
    medium: Platform.select({
      ios: 'SF Pro Text Medium',
      android: 'Inter-Medium'
    }),
    bold: Platform.select({
      ios: 'SF Pro Text Bold',
      android: 'Inter-Bold'
    })
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 48
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75
  }
} as const;

// src/utils/styling/createStyles.ts
import { StyleSheet } from 'react-native';

export const createStyles = <T extends Record<string, any>>(
  styles: T
): T => StyleSheet.create(styles);

// Type-safe style helper
export const combineStyles = <T>(...styles: (T | undefined | false)[]): T =>
  Object.assign({}, ...styles.filter(Boolean)) as T;
```

**Failure Detection & Monitoring Setup**:
```typescript
// src/utils/monitoring/healthCheck.ts
export class HealthCheckService {
  private static checkInterval: NodeJS.Timeout | null = null;

  static startMonitoring(): void {
    this.checkInterval = setInterval(() => {
      this.performHealthChecks();
    }, 60000); // Check every minute
  }

  static stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  private static async performHealthChecks(): Promise<void> {
    try {
      // API Health Check
      await this.checkAPIHealth();

      // Storage Health Check
      await this.checkStorageHealth();

      // Memory Health Check
      this.checkMemoryUsage();

    } catch (error) {
      ErrorTrackingService.logError(error, { type: 'health_check' });
    }
  }

  private static async checkAPIHealth(): Promise<void> {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/health`, {
        timeout: 5000
      });

      if (!response.ok) {
        throw new Error(`API Health Check Failed: ${response.status}`);
      }
    } catch (error) {
      ErrorTrackingService.logError(
        new Error('API Health Check Failed'),
        { originalError: error }
      );
    }
  }

  private static async checkStorageHealth(): Promise<void> {
    try {
      const testKey = 'health_check_test';
      const testValue = Date.now().toString();

      await AsyncStorage.setItem(testKey, testValue);
      const retrieved = await AsyncStorage.getItem(testKey);

      if (retrieved !== testValue) {
        throw new Error('Storage read/write mismatch');
      }

      await AsyncStorage.removeItem(testKey);
    } catch (error) {
      ErrorTrackingService.logError(
        new Error('Storage Health Check Failed'),
        { originalError: error }
      );
    }
  }

  private static checkMemoryUsage(): void {
    // Use performance monitoring for memory tracking
    const memoryInfo = performance.memory;

    if (memoryInfo.usedJSHeapSize > 100 * 1024 * 1024) { // 100MB threshold
      ErrorTrackingService.logError(
        new Error('High Memory Usage Detected'),
        {
          usedMemory: memoryInfo.usedJSHeapSize,
          totalMemory: memoryInfo.totalJSHeapSize,
          timestamp: new Date().toISOString()
        }
      );
    }
  }
}

// src/utils/monitoring/networkMonitor.ts
import NetInfo from '@react-native-community/netinfo';

export class NetworkMonitor {
  private static listeners: Array<(isConnected: boolean) => void> = [];

  static initialize(): void {
    NetInfo.addEventListener(state => {
      const isConnected = state.isConnected && state.isInternetReachable;

      if (!isConnected) {
        ErrorTrackingService.logError(
          new Error('Network Connection Lost'),
          {
            connectionType: state.type,
            isConnected: state.isConnected,
            isInternetReachable: state.isInternetReachable,
            timestamp: new Date().toISOString()
          }
        );
      }

      this.listeners.forEach(listener => listener(isConnected));
    });
  }

  static addListener(callback: (isConnected: boolean) => void): void {
    this.listeners.push(callback);
  }

  static removeListener(callback: (isConnected: boolean) => void): void {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }
}
```

**Global Error Boundary**:
```typescript
// src/components/common/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text } from 'react-native';
import { ErrorTrackingService } from '../../services/errorTracking';
import { CreditButton } from '../design-system/CreditButton';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    ErrorTrackingService.logError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
      timestamp: new Date().toISOString()
    });
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
          <Text style={{ textAlign: 'center', marginBottom: 20 }}>
            Something went wrong. Please try again.
          </Text>
          <CreditButton
            title="Try Again"
            onPress={this.handleRetry}
            variant="primary"
          />
        </View>
      );
    }

    return this.props.children;
  }
}
```

**Performance Monitoring**:
```typescript
// src/utils/monitoring/performance.ts
export class PerformanceMonitor {
  private static screenLoadTimes = new Map<string, number>();

  static markScreenStart(screenName: string): void {
    this.screenLoadTimes.set(screenName, Date.now());
  }

  static markScreenEnd(screenName: string): void {
    const startTime = this.screenLoadTimes.get(screenName);
    if (startTime) {
      const loadTime = Date.now() - startTime;
      this.screenLoadTimes.delete(screenName);

      // Log slow screen loads
      if (loadTime > 3000) {
        ErrorTrackingService.logError(
          new Error('Slow Screen Load'),
          {
            screenName,
            loadTime,
            timestamp: new Date().toISOString()
          }
        );
      }
    }
  }

  static measureAsyncOperation<T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();

    return operation()
      .then(result => {
        const duration = Date.now() - startTime;

        // Log slow operations
        if (duration > 5000) {
          ErrorTrackingService.logError(
            new Error('Slow Async Operation'),
            {
              operationName,
              duration,
              timestamp: new Date().toISOString()
            }
          );
        }

        return result;
      })
      .catch(error => {
        const duration = Date.now() - startTime;

        ErrorTrackingService.logError(error, {
          operationName,
          duration,
          type: 'async_operation_failure'
        });

        throw error;
      });
  }
}
```

**Deliverables**:
- ✅ Configured React Native project with TypeScript
- ✅ Comprehensive error monitoring with Sentry + Firebase Crashlytics
- ✅ API client setup with detailed error tracking
- ✅ Industry-standard linting and formatting (ESLint + Prettier)
- ✅ Git hooks for code quality enforcement
- ✅ Health monitoring system for API, storage, and memory
- ✅ Network connectivity monitoring
- ✅ Global error boundary for graceful failure handling
- ✅ Performance monitoring for slow operations
- ✅ Complete styling system with design tokens
- ✅ Type-safe styling utilities

---

### Task 2: Design System & UI Components

**Objective**: Create a credit-focused design system with reusable components

**Design Specifications** (Credit Monitoring Theme):
- **Primary Colors**:
  - Primary: #2563EB (Professional Blue - Trust & Security)
  - Secondary: #059669 (Success Green - Positive Growth)
  - Accent: #7C3AED (Purple - Premium Features)
  - Warning: #D97706 (Amber - Caution)
  - Error: #DC2626 (Red - Alerts & Negative Impact)
  - Background: #F8FAFC (Light Gray - Clean & Modern)
  - Surface: #FFFFFF (White - Cards & Containers)
- **Credit Score Colors**:
  - Excellent (740+): #059669 (Green)
  - Good (670-739): #65A30D (Light Green)
  - Fair (580-669): #D97706 (Orange)
  - Poor (300-579): #DC2626 (Red)
- **Typography**: San Francisco (iOS), Inter (Android) - Financial clarity
- **Spacing**: 8px base unit (8, 16, 24, 32, 40, 48)
- **Border Radius**: 12px standard, 16px for cards, 24px for modals

**Components to Build** (No Stitch branding):
1. **CreditButton** - Primary, secondary, ghost variants
2. **CreditInput** - Text input with validation states
3. **CreditCard** - Elevated cards for content sections
4. **CreditHeader** - Navigation headers with back buttons
5. **CreditLoader** - Loading states and spinners
6. **CreditAlert** - Toast notifications and alerts
7. **CreditModal** - Bottom sheets and modals
8. **ScoreGauge** - Circular progress for credit scores
9. **ScoreChart** - Line chart for score history
10. **ScoreTrend** - Up/down indicators with animations

**Business Logic Focus**:
```typescript
// src/components/ScoreGauge.tsx - Focus on credit logic, not styling
interface ScoreGaugeProps {
  score: number;
  previousScore?: number;
  scoreRange: { min: number; max: number };
  onScorePress?: () => void;
  showTrend?: boolean;
}

// Business logic for score categorization
const getScoreCategory = (score: number): ScoreCategory => {
  if (score >= 740) return 'excellent';
  if (score >= 670) return 'good';
  if (score >= 580) return 'fair';
  return 'poor';
};
```

---

### Task 3: Authentication & Security Foundation

**Objective**: Implement secure authentication with biometric support using existing API endpoints

**API Endpoints Integration**:
```typescript
// src/api/services/authService.ts - Mirror web app API calls
export const authService = {
  // POST /users/login
  login: (username: string, password: string) =>
    apiClient.post('/users/login', { username, password }),

  // POST /users/register
  register: (data: IRegisterUserDTO) =>
    apiClient.post('/users/register', data),

  // GET /users/refresh-token
  refreshToken: (token: string) =>
    apiClient.get('/users/refresh-token', { params: { token } }),

  // POST /users/password-recovery
  passwordRecovery: (email: string) =>
    apiClient.post('/users/password-recovery', { email }),

  // GET /users/preauth-token/{token}
  preauthLogin: (token: string) =>
    apiClient.get(`/users/preauth-token/${token}`)
};
```

**Business Logic Implementation**:
1. **Login Flow** - Mirror UserStore.userLogin logic:
   ```typescript
   const handleLogin = async (username: string, password: string) => {
     try {
       const response = await authService.login(username, password);
       await setAccessToken(response.data.token);
       await setRefreshToken(response.data.refresh);

       // Handle identity completion status
       if (response.data.idpass) {
         setIdentityCompleted(true);
       }

       // Handle enrollment status
       if (response.data.just_enrolled) {
         setJustEnrolled(true);
       }

       setUser(response.data);
     } catch (error) {
       throw new Error(error.message);
     }
   };
   ```

2. **Registration Flow** - Mirror UserStore.registerUser logic:
   ```typescript
   const handleRegister = async (data: IRegisterUserDTO) => {
     try {
       const response = await authService.register(data);
       await setAccessToken(response.data.token);
       await setRefreshToken(response.data.refresh);
       // Navigate to identity verification
     } catch (error) {
       if (error.response?.status === 409) {
         throw new Error('Email already registered');
       }
     }
   };
   ```

**Mobile Screen Flow**:
```
SplashScreen →
  ↓ (Check stored tokens)
BiometricAuthScreen (if enabled) →
  ↓ (Biometric success)
DashboardScreen

OR

LoginScreen →
  ↓ (Login success)
IdentityVerificationFlow (if !idpass) →
  ↓ (Identity complete)
DashboardScreen

OR

RegisterScreen →
  ↓ (Registration success)
IdentityVerificationFlow →
  ↓ (Identity complete)
DashboardScreen
```

**State Management** (Mirror AppStore/UserStore):
```typescript
// src/stores/authStore.ts - Reuse web app business logic
interface AuthState {
  isAuthenticated: boolean;
  user: IUserInfo | null;
  isIdentityCompleted: boolean;
  justEnrolled: boolean;
  biometricsEnabled: boolean;

  // Mirror web app methods
  login: (username: string, password: string) => Promise<void>;
  register: (data: IRegisterUserDTO) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: IUserInfo) => void;
  setIdentityCompleted: (completed: boolean) => void;
}
```

**Screens & Components**:
- `LoginScreen` - Email/password + biometric option
- `RegisterScreen` - Account creation with recovery questions
- `ForgotPasswordScreen` - Password recovery flow
- `BiometricSetupScreen` - Enable Face ID/Touch ID

---

### Task 4: Identity Verification System

**Objective**: Build comprehensive identity verification using existing API endpoints with mobile enhancements

**API Endpoints Integration**:
```typescript
// src/api/services/identityService.ts - Mirror UserStore verification logic
export const identityService = {
  // POST /users/identity - Submit personal information
  submitIdentity: (data: IUserIdentityReqDTO) =>
    apiClient.post('/users/identity', data),

  // GET /users/get-quiz - Get knowledge-based questions
  getQuiz: () => apiClient.get('/users/get-quiz'),

  // POST /users/verify-quiz - Submit quiz answers
  verifyQuiz: (data: IQuizVerifyReqDTO) =>
    apiClient.post('/users/verify-quiz', data),

  // GET /users/get-mobile - Verify phone number
  verifyPhone: () => apiClient.get('/users/get-mobile'),

  // POST /users/send-code/{token} - Send SMS verification code
  sendCode: (token: string) =>
    apiClient.post(`/users/send-code/${token}`),

  // POST /users/verify-code - Verify SMS code
  verifyCode: (data: IVerifyCodeReqDTO) =>
    apiClient.post('/users/verify-code', data),

  // GET /users/dit-identity - Document identity verification
  verifyDITIdentity: () => apiClient.get('/users/dit-identity'),

  // POST /users/smfa-send-link/{token} - Send secure mobile link
  sendSMFALink: (token: string, type: string) =>
    apiClient.post(`/users/smfa-send-link/${token}?type=${type}`),

  // POST /users/smfa-verify-status/{token} - Verify SMFA
  verifySMFA: (token: string, type: string) =>
    apiClient.post(`/users/smfa-verify-status/${token}?type=${type}`)
};
```

**Business Logic Implementation** (Mirror UserStore methods):
```typescript
// src/hooks/useIdentityVerification.ts
export const useIdentityVerification = () => {
  const handleIdentitySubmission = async (data: IUserIdentityReqDTO) => {
    try {
      const response = await identityService.submitIdentity(data);

      if (response.data.just_enrolled) {
        return { success: true, enrolled: true, route: 'IdSuccess' };
      }

      return { success: true, idpass: response.data.idpass };
    } catch (error) {
      const status = error?.response?.status;

      if (status >= 500) {
        return { success: false, route: 'ServiceFailure' };
      }

      return { success: false, message: 'Identity verification failed' };
    }
  };

  const handleQuizVerification = async (answers: IQuizVerifyReqDTO) => {
    try {
      const response = await identityService.verifyQuiz(answers);

      if (response.data.idpass) {
        return { success: true, route: 'IdSuccess' };
      }

      return { success: true };
    } catch (error) {
      const code = error?.response?.data?.codes?.[0];
      const status = error?.response?.status;

      if (code === 'SC313') {
        return { success: false, route: 'IdSuccessEidFailed' };
      }

      if (status === 409) {
        return {
          success: false,
          retry: true,
          data: error.response.data
        };
      }

      return { success: false, route: 'EidFailed' };
    }
  };
};
```

**Enhanced Mobile Screen Flow**:
```
PersonalInfoScreen (IUserIdentityReqDTO) →
  ↓ (Submit identity - POST /users/identity)
MobileVerificationScreen →
  ↓ (Send code - POST /users/send-code/{token})
  ↓ (Verify code - POST /users/verify-code)
QuizScreen →
  ↓ (Get quiz - GET /users/get-quiz)
  ↓ (Submit answers - POST /users/verify-quiz)
SuccessScreen / Alternative flows based on API responses
```

**Mobile Enhancements**:
1. **Document Scanning** (Optional enhancement):
   - Camera integration for ID capture
   - OCR for auto-populating IUserIdentityReqDTO fields
   - Validation against manual input

2. **Smart Forms**:
   - Pre-fill from document scan
   - Address autocomplete
   - Real-time validation for SSN, phone formats

3. **SMS Integration**:
   - Auto-fill SMS codes (iOS/Android)
   - Countdown timers for resend functionality
   - Multiple verification methods (SMS, SMFA)

**Error Handling** (Mirror web app logic):
```typescript
const handleVerificationError = (error: any, method: string) => {
  const status = error?.response?.status;
  const code = error?.response?.data?.codes?.[0];

  switch (status) {
    case 428: return { route: 'Identity', retry: true };
    case 409: return { route: 'EidFailed' };
    case 503: return { route: 'ServiceFailure' };
    default: return { message: 'Verification failed' };
  }
};
```

---

### Task 5: Dashboard & Credit Monitoring

**Objective**: Create an engaging dashboard using existing credit monitoring API endpoints

**API Endpoints Integration**:
```typescript
// src/api/services/creditService.ts - Mirror web app credit endpoints
export const creditService = {
  // GET /users/efx-latest-scores - Get current credit score
  getLatestScore: () => apiClient.get('/users/efx-latest-scores'),

  // GET /users/efx-score-history - Get score history data
  getScoreHistory: () => apiClient.get('/users/efx-score-history'),

  // GET /users/efx-score-up - Get score improvement suggestions
  getScoreUp: (scoreInc = 10, timeHorizon = 6) =>
    apiClient.get('/users/efx-score-up', {
      params: { scoreInc, timeHorizon }
    }),

  // GET /users/efx-latest-report - Get full credit report
  getLatestReport: () => apiClient.get('/users/efx-latest-report'),

  // GET /users/efx-latest-report/summary - Get report summary
  getReportSummary: () => apiClient.get('/users/efx-latest-report/summary'),

  // GET /users/efx-alerts - Get monitoring alerts
  getMonitoringAlerts: () => apiClient.get('/users/efx-alerts'),

  // GET /users - Get user profile data
  getUserProfile: () => apiClient.get('/users')
};
```

**Business Logic Implementation** (Mirror existing patterns):
```typescript
// src/hooks/useCreditData.ts
export const useCreditData = () => {
  const [creditData, setCreditData] = useState({
    score: null,
    scoreHistory: [],
    reportSummary: null,
    alerts: [],
    lastUpdated: null,
    isLoading: false
  });

  const refreshCreditData = async () => {
    try {
      setCreditData(prev => ({ ...prev, isLoading: true }));

      // Parallel API calls for dashboard data
      const [
        scoreResponse,
        historyResponse,
        summaryResponse,
        alertsResponse
      ] = await Promise.all([
        creditService.getLatestScore(),
        creditService.getScoreHistory(),
        creditService.getReportSummary(),
        creditService.getMonitoringAlerts()
      ]);

      setCreditData({
        score: scoreResponse.data,
        scoreHistory: historyResponse.data,
        reportSummary: summaryResponse.data,
        alerts: alertsResponse.data,
        lastUpdated: new Date(),
        isLoading: false
      });

    } catch (error) {
      setCreditData(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  return { creditData, refreshCreditData };
};
```

**Mobile Dashboard Layout** (Credit-focused UI):
```
┌─ Header (Welcome + Notifications) ─┐
├─ Credit Score Card               ─┤
│  • Large score number            │
│  • Score category (Poor→Excellent)│
│  • Change indicator (+/- points) │
│  • Last updated time             │
├─ Quick Stats Row                 ─┤
│  • Credit Utilization            │
│  • Payment History               │
│  • Account Mix                   │
├─ Score History Chart (6 months)  ─┤
├─ Recent Alerts/Changes           ─┤
├─ Score Improvement Tips          ─┤
└─ Action Buttons                  ─┘
   • View Full Report
   • Monitor Credit
   • Settings
```

**Dashboard Components**:
1. **ScoreCard Component**:
   ```typescript
   interface ScoreCardProps {
     score: number;
     previousScore?: number;
     scoreCategory: 'poor' | 'fair' | 'good' | 'excellent';
     lastUpdated: Date;
     onRefresh: () => Promise<void>;
   }
   ```

2. **ScoreHistoryChart Component**:
   ```typescript
   interface ScoreHistoryProps {
     data: Array<{ date: string; score: number }>;
     timeRange: '6m' | '1y' | '2y';
     onRangeChange: (range: string) => void;
   }
   ```

3. **AlertsSection Component**:
   ```typescript
   interface AlertsSectionProps {
     alerts: Array<{
       id: string;
       type: 'new_account' | 'score_change' | 'inquiry';
       message: string;
       date: Date;
       severity: 'info' | 'warning' | 'critical';
     }>;
     onAlertPress: (alertId: string) => void;
   }
   ```

4. **OptimalPathCard Component** (NEW):
   ```typescript
   interface OptimalPathCardProps {
     goal: {
       currentScore: number;
       targetScore: number;
       scoreGap: number;
       timeHorizon: number;
     };
     actions: Array<{
       id: string;
       title: string;
       description: string;
       estimatedImpact: number;
       completed: boolean;
       tags: string[];
     }>;
     progress: {
       pointsBuilt: number;
       totalPotentialPoints: number;
       percentComplete: number;
     };
     onActionToggle: (actionId: string) => void;
     onViewDetails: () => void;
   }
   ```

5. **EquifaxWebView Component** (NEW):
   ```typescript
   interface EquifaxWebViewProps {
     featureType: 'freeze' | 'fraud-alert' | 'dispute';
     onClose: () => void;
     onSuccess?: () => void;
   }
   ```

**State Management** (Mirror web app stores):
```typescript
// src/stores/dashboardStore.ts
interface DashboardState {
  user: IUserInfo | null;
  creditScore: number | null;
  scoreHistory: ScorePoint[];
  reportSummary: any;
  alerts: Alert[];
  lastUpdated: Date | null;
  isRefreshing: boolean;

  // Mirror web app methods
  refreshAllData: () => Promise<void>;
  getScoreCategory: (score: number) => ScoreCategory;
  formatScoreChange: (current: number, previous: number) => string;
}
```

**Pull-to-Refresh Implementation**:
```typescript
const DashboardScreen = () => {
  const { creditData, refreshCreditData } = useCreditData();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshCreditData();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Dashboard content */}
    </ScrollView>
  );
};
```

---

### Task 5.5: Equifax Security Features Integration

**Objective**: Enable users to access Equifax security features via WebView integration

**Features to Integrate**:
1. **Credit Freeze/Unfreeze Management**
2. **Fraud Alert & Active Duty Alert**
3. **Credit Report Dispute Submission**

#### **WebView Implementation Strategy**

**Security Considerations**:
- Secure session handoff to Equifax
- Authentication token management
- HTTPS enforcement
- Certificate pinning
- User data protection during WebView navigation

```typescript
// src/components/equifax/EquifaxWebView.tsx
import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

interface EquifaxWebViewProps {
  featureType: 'freeze' | 'fraud-alert' | 'dispute';
  onClose: () => void;
  onSuccess?: () => void;
}

export const EquifaxWebView: React.FC<EquifaxWebViewProps> = ({
  featureType,
  onClose,
  onSuccess
}) => {
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchEquifaxUrl();
  }, [featureType]);

  const fetchEquifaxUrl = async () => {
    try {
      // Get authenticated URL from backend
      const response = await apiClient.get(`/api/equifax/webview/${featureType}`);
      setUrl(response.data.url);
    } catch (error) {
      ErrorTrackingService.logError(error, {
        context: 'EquifaxWebView',
        featureType
      });
    }
  };

  const handleNavigationStateChange = (navState: any) => {
    // Detect completion or cancellation
    if (navState.url.includes('success')) {
      onSuccess?.();
      onClose();
    } else if (navState.url.includes('cancel')) {
      onClose();
    }
  };

  if (!url) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>
          Connecting to Equifax securely...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="close" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {featureType === 'freeze' && 'Manage Credit Freeze'}
          {featureType === 'fraud-alert' && 'Fraud Alert'}
          {featureType === 'dispute' && 'Submit Dispute'}
        </Text>
      </View>

      <WebView
        source={{ uri: url }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={handleNavigationStateChange}
        // Security settings
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        allowsBackForwardNavigationGestures={true}
        // HTTPS enforcement
        onShouldStartLoadWithRequest={(request) => {
          return request.url.startsWith('https://');
        }}
        renderLoading={() => (
          <ActivityIndicator
            color={Colors.primary}
            size="large"
            style={styles.loader}
          />
        )}
      />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.states.hover
  },
  closeButton: {
    padding: Spacing.sm
  },
  headerTitle: {
    flex: 1,
    fontSize: Typography.fontSize.lg,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.primary,
    marginLeft: Spacing.md
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.md,
    color: Colors.text.secondary
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)'
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20
  }
});
```

#### **Integration Points in Smart Actions Screen**

```typescript
// src/screens/main/SmartActionsScreen.tsx - Updated with Equifax features
export const SmartActionsScreen: React.FC = () => {
  const [showEquifaxWebView, setShowEquifaxWebView] = useState(false);
  const [equifaxFeature, setEquifaxFeature] = useState<'freeze' | 'fraud-alert' | 'dispute'>('freeze');

  const openEquifaxFeature = (feature: 'freeze' | 'fraud-alert' | 'dispute') => {
    setEquifaxFeature(feature);
    setShowEquifaxWebView(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Equifax Security Features Section */}
        <View style={styles.securitySection}>
          <Text style={styles.sectionTitle}>Equifax Security Features</Text>

          <TouchableOpacity
            style={styles.securityCard}
            onPress={() => openEquifaxFeature('freeze')}
          >
            <Icon name="lock" size={32} color={Colors.primary} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Manage Credit Freeze</Text>
              <Text style={styles.cardDescription}>
                Freeze or unfreeze your credit to prevent unauthorized access
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color={Colors.text.tertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.securityCard}
            onPress={() => openEquifaxFeature('fraud-alert')}
          >
            <Icon name="shield-alert" size={32} color={Colors.warning} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Fraud & Active Duty Alert</Text>
              <Text style={styles.cardDescription}>
                Add fraud protection or active duty military alerts
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color={Colors.text.tertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.securityCard}
            onPress={() => openEquifaxFeature('dispute')}
          >
            <Icon name="file-document-edit" size={32} color={Colors.accent} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Submit Dispute</Text>
              <Text style={styles.cardDescription}>
                Dispute inaccurate information on your credit report
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color={Colors.text.tertiary} />
          </TouchableOpacity>
        </View>

        {/* Optimal Path Tab Section */}
        <View style={styles.tabBar}>
          <TabButton
            title="Smart Actions"
            active={activeTab === 'recommendations'}
            onPress={() => setActiveTab('recommendations')}
          />
          <TabButton
            title="Optimal Path"
            active={activeTab === 'optimalPath'}
            onPress={() => setActiveTab('optimalPath')}
          />
        </View>

        {activeTab === 'recommendations' ? (
          <SmartActionsRecommendations />
        ) : (
          <OptimalPathView />
        )}
      </ScrollView>

      {/* Equifax WebView Modal */}
      <Modal
        visible={showEquifaxWebView}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <EquifaxWebView
          featureType={equifaxFeature}
          onClose={() => setShowEquifaxWebView(false)}
          onSuccess={() => {
            // Show success message
            showSuccessToast('Action completed successfully');
          }}
        />
      </Modal>
    </SafeAreaView>
  );
};
```

#### **API Service Layer**

```typescript
// src/api/services/equifaxService.ts
export const equifaxService = {
  // Get WebView URL for freeze management
  getFreezeUrl: () => apiClient.get('/api/equifax/webview/freeze'),

  // Get WebView URL for fraud alert
  getFraudAlertUrl: () => apiClient.get('/api/equifax/webview/fraud-alert'),

  // Get WebView URL for dispute submission
  getDisputeUrl: () => apiClient.get('/api/equifax/webview/dispute'),

  // Optimal Path endpoints
  getOptimalPath: (userId: string, targetScore: number) =>
    apiClient.get('/api/equifax/optimal-path', {
      params: { userId, targetScore }
    }),

  setScoreGoal: (userId: string, targetScore: number, timeframe: number) =>
    apiClient.post('/api/equifax/optimal-path/goal', {
      userId,
      targetScore,
      timeframe
    }),

  completeAction: (userId: string, actionId: string) =>
    apiClient.post('/api/equifax/optimal-path/complete', {
      userId,
      actionId,
      completedDate: new Date()
    }),

  getProgress: (userId: string) =>
    apiClient.get('/api/equifax/optimal-path/progress', {
      params: { userId }
    })
};
```

#### **Success Criteria**
- ✅ Users can access Equifax freeze management via WebView
- ✅ Fraud alert submission flows smoothly
- ✅ Dispute submission process works end-to-end
- ✅ Secure authentication handoff to Equifax
- ✅ Loading states and error handling implemented
- ✅ FCRA compliance maintained for dispute features
- ✅ Navigation back to app after completion

---

### Task 6: Push Notifications & Background Processing

**Objective**: Implement intelligent notification system

**Notification Types**:
1. **Score Changes**
   - Significant score increases/decreases
   - Monthly score updates
   - New information on credit report

2. **Account Alerts**
   - New accounts opened
   - Credit inquiries
   - Payment reminders
   - Identity monitoring alerts

3. **App Engagement**
   - Weekly score check reminders
   - Tips for score improvement
   - Feature announcements

**Implementation Features**:
- **Firebase Cloud Messaging** integration
- **Local notifications** for reminders
- **Deep linking** from notifications
- **Notification preferences** in settings
- **Background score checks** (when permitted)

**Technical Setup**:
```typescript
// src/services/notificationService.ts
class NotificationService {
  requestPermissions(): Promise<boolean>
  subscribeToTopic(topic: string): Promise<void>
  scheduleLocalNotification(notification: LocalNotification): void
  handleBackgroundMessage(message: FirebaseMessage): void
}
```

---

### Task 7: Settings & Account Management

**Objective**: Comprehensive account management with mobile-optimized controls

**Settings Sections**:

1. **Profile Management**
   - Edit personal information
   - Change email address
   - Update phone number
   - Profile photo upload

2. **Security Settings**
   - Change password
   - Enable/disable biometrics
   - Two-factor authentication
   - Active sessions management

3. **Notification Preferences**
   - Push notification toggles by category
   - Email notification preferences
   - Frequency settings (immediate, daily, weekly)
   - Quiet hours configuration

4. **Privacy & Legal**
   - Privacy policy
   - Terms of service
   - Data export/deletion requests
   - Account deactivation

**Settings UI Pattern**:
- **Section headers** with clear categorization
- **Toggle switches** for binary options
- **Disclosure indicators** for navigation
- **Confirmation dialogs** for destructive actions

---

### Task 8: Offline Support & Data Synchronization

**Objective**: Provide graceful offline experience

**Offline Capabilities**:
1. **Cached Data Access**
   - Last known credit score
   - Recent score history
   - Account information
   - Settings preferences

2. **Offline Actions**
   - Queue settings changes
   - Store notification preferences
   - Cache user inputs for forms

3. **Synchronization**
   - Background sync when connection restored
   - Conflict resolution for simultaneous changes
   - Sync status indicators

**Technical Implementation**:
```typescript
// src/services/syncService.ts
class SyncService {
  isOnline(): boolean
  queueAction(action: OfflineAction): void
  syncPendingActions(): Promise<void>
  getCachedData<T>(key: string): T | null
  cacheData<T>(key: string, data: T): void
}
```

---

### Task 9: Performance Optimization & Analytics

**Objective**: Ensure optimal performance and user experience tracking

**Performance Features**:
1. **Image Optimization**
   - Lazy loading for images
   - WebP format support
   - Image caching strategies

2. **State Optimization**
   - Selective component re-renders
   - Memoization for expensive calculations
   - Virtual lists for large datasets

3. **Bundle Optimization**
   - Code splitting for features
   - Tree shaking for unused code
   - Asset optimization

**Analytics Integration**:
- **Firebase Analytics** for user behavior
- **Crash reporting** with detailed stack traces
- **Performance monitoring** for screen load times
- **Custom events** for feature usage tracking

---

### Task 10: Testing Strategy & Quality Assurance

**Objective**: Comprehensive testing coverage for reliability

**Testing Levels**:

1. **Unit Testing**
   - Business logic functions
   - Utility functions
   - Custom hooks
   - State management

2. **Integration Testing**
   - API service integration
   - Navigation flows
   - State management integration
   - Authentication flows

3. **E2E Testing**
   - Complete user journeys
   - Identity verification flow
   - Dashboard interactions
   - Settings management

**Testing Tools**:
```bash
# Testing dependencies
npm install --save-dev jest @testing-library/react-native
npm install --save-dev detox detox-cli
npm install --save-dev @testing-library/jest-native
```

**Test Coverage Goals**:
- **Unit Tests**: 90%+ coverage
- **Integration Tests**: Critical user flows
- **E2E Tests**: Primary user journeys

---

## Implementation Roadmap

### Phase 1: Foundation (2-3 weeks)
- Project setup and core dependencies
- Design system and UI components
- Basic navigation structure
- Authentication foundation

### Phase 2: Core Features (3-4 weeks)
- Identity verification system
- Dashboard and credit monitoring
- Push notifications setup
- Settings and account management

### Phase 2.5: Equifax Integration (1-2 weeks)
- Equifax WebView component implementation
- Security features integration (Freeze, Fraud Alert, Dispute)
- Optimal Path UI with mock data
- Smart Actions screen enhancement

### Phase 3: Enhancement (2-3 weeks)
- Optimal Path Equifax API integration
- Offline support and synchronization
- Performance optimization
- Analytics integration
- Comprehensive testing

### Phase 4: Launch Preparation (1-2 weeks)
- App Store optimization
- Beta testing and feedback
- Production deployment setup
- Documentation and handover

---

## Success Metrics

### Technical KPIs
- **App Performance**: < 2s initial load time
- **Crash Rate**: < 0.1% crash-free sessions
- **Memory Usage**: < 150MB average
- **Bundle Size**: < 25MB total

### User Experience KPIs
- **Authentication**: < 30s biometric setup
- **Score Refresh**: < 3s score update time
- **Identity Verification**: < 90% completion rate
- **User Retention**: > 70% after 30 days

### Security Standards
- **OWASP Mobile Security** compliance
- **PCI DSS** requirements for payment data
- **GDPR/CCPA** compliance for data privacy
- **SOC 2 Type II** security standards

This specification provides a comprehensive roadmap for building a world-class mobile credit monitoring application that enhances the existing web platform with mobile-first features and native capabilities.