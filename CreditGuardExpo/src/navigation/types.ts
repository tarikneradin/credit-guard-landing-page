import {NavigatorScreenParams} from '@react-navigation/native';

// Auth Stack Navigator
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Identity Verification Stack Navigator
export type IdentityStackParamList = {
  PersonalInfo: undefined;
  PhoneVerification: {token?: string};
  VerificationSuccess: undefined;
  IdentityFailure: {
    message: string;
    details?: string[];
    codes?: string[];
  };
  ServiceFailure:
    | {
        message?: string;
        details?: string[];
        codes?: string[];
        origin?: 'identity' | 'smfaSend' | 'smfaVerify' | 'enrollment' | 'cooldown';
      }
    | undefined;
  SmfaFailure: {
    message: string;
    details?: string[];
    codes?: string[];
  };
  EmailVerification: {
    maskedEmail: string;
  };
};

// Main App Tab Navigator
export type MainTabParamList = {
  Dashboard: undefined;
  CreditReport: undefined;
  SmartActions: undefined;
  AIAssistant: undefined;
  Alerts: undefined;
  Settings: undefined;
  Offers: undefined;
};

// Main Stack Navigator (wraps tabs and includes detail screens)
export type MainStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  GamificationScreen: undefined;
  NotificationCenter: undefined;
  DarkWebMonitoring: undefined;
};

// Settings Stack Navigator
export type SettingsStackParamList = {
  SettingsHome: undefined;
  SubscriptionPlans: undefined;
  Profile: undefined;
  Security: undefined;
  Notifications: undefined;
  FeatureSettings: undefined;
  HelpSupport: undefined;
  About: undefined;
  CreditActions: undefined;
  EquifaxSecurity: undefined;
  EquifaxIDRestoration: undefined;
};

// Root Stack Navigator
export type RootStackParamList = {
  Splash: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Identity: NavigatorScreenParams<IdentityStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
};

// Navigation prop types for type safety
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
