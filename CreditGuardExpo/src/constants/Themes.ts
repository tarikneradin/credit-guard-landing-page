import {Colors} from './colors';
import {Typography, TextStyles} from './typography';
import {Spacing, SpacingScale} from './spacing';

// Theme interface for type safety - flexible color structure
export interface Theme {
  colors: any; // Allow flexible color overrides for dark theme
  typography: typeof Typography;
  spacing: typeof Spacing;
  spacingScale: typeof SpacingScale;
  textStyles: typeof TextStyles;
  isDark: boolean;
}

// Light theme definition
export const LightTheme: Theme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  spacingScale: SpacingScale,
  textStyles: TextStyles,
  isDark: false,
};

// Light theme original colors definition for reference
export const LightThemeDetailed = {
  colors: {
    // Primary brand colors
    primary: Colors.primary,
    primaryLight: Colors.primaryLight,
    primaryDark: Colors.primaryDark,
    secondary: Colors.secondary,
    secondaryLight: Colors.secondaryLight,
    secondaryDark: Colors.secondaryDark,
    accent: Colors.accent,
    accentLight: Colors.accentLight,
    accentDark: Colors.accentDark,

    // Semantic colors
    success: Colors.success,
    successLight: Colors.successLight,
    successDark: Colors.successDark,
    warning: Colors.warning,
    warningLight: Colors.warningLight,
    warningDark: Colors.warningDark,
    error: Colors.error,
    errorLight: Colors.errorLight,
    errorDark: Colors.errorDark,
    info: Colors.info,
    infoLight: Colors.infoLight,
    infoDark: Colors.infoDark,

    // Background system
    background: Colors.background,
    backgroundSecondary: Colors.backgroundSecondary,
    surface: Colors.surface,
    surfaceElevated: Colors.surfaceElevated,
    surfaceSecondary: Colors.surfaceSecondary,
    surfaceTertiary: Colors.surfaceTertiary,

    // Text colors
    text: Colors.text,

    // Border colors
    border: Colors.border,

    // Interactive states
    interactive: Colors.interactive,

    // Shadows
    shadow: Colors.shadow,

    // Credit score colors
    score: Colors.score,

    // Alert colors
    alert: Colors.alert,

    // Status colors
    status: Colors.status,

    // Glass effects
    glass: Colors.glass,

    // Gradients
    gradients: Colors.gradients,

    // Transparent colors
    transparent: Colors.transparent,

    // Tab bar specific
    tabBar: {
      background: Colors.surface,
      backgroundSecondary: Colors.surfaceSecondary,
      activeIcon: Colors.accent,
      inactiveIcon: Colors.text.tertiary,
      activeText: Colors.accent,
      inactiveText: Colors.text.secondary,
      border: Colors.border.light,
      shadow: Colors.shadow.medium,
    },

    // Navigation specific
    navigation: {
      background: Colors.surface,
      headerBackground: Colors.surface,
      headerText: Colors.text.primary,
      cardBackground: Colors.surface,
      cardShadow: Colors.shadow.medium,
    },
  },
  typography: Typography,
  spacing: Spacing,
  spacingScale: SpacingScale,
  textStyles: TextStyles,
  isDark: false,
};

// Dark theme definition
// Dark theme colors
const DarkColors = {
  ...Colors,
  // Override specific colors for dark mode
  primary: '#F3F4F6',
  primaryLight: '#FFFFFF',
  primaryDark: '#E5E7EB',
  background: '#0F1419',
  backgroundSecondary: '#1F2937',
  surface: '#1F2937',
  surfaceElevated: '#374151',
  surfaceSecondary: '#2D3748',
  surfaceTertiary: '#374151',
  text: {
    ...Colors.text,
    primary: '#F9FAFB',
    secondary: '#D1D5DB',
    tertiary: '#9CA3AF',
    quaternary: '#6B7280',
    onBackground: '#F9FAFB',
  },
  border: {
    ...Colors.border,
    heavy: '#4B5563',
    focus: '#8B5CF6',
  },
  interactive: {
    ...Colors.interactive,
    primary: '#8B5CF6',
    secondary: '#10B981',
    black: 'rgba(0, 0, 0, 0.8)',
    white: 'rgba(255, 255, 255, 0.9)',
  },
  tabBar: {
    ...Colors.tabBar,
    background: '#1F2937',
    activeIcon: '#8B5CF6',
    inactiveIcon: '#6B7280',
    activeBg: 'rgba(139, 92, 246, 0.1)',
  },
};

export const DarkTheme: Theme = {
  colors: DarkColors,
  typography: Typography,
  spacing: Spacing,
  spacingScale: SpacingScale,
  textStyles: TextStyles,
  isDark: true,
};

// Original dark theme definition for reference
export const DarkThemeDetailed = {
  colors: {
    // Primary brand colors - adjusted for dark mode
    primary: '#F3F4F6',
    primaryLight: '#FFFFFF',
    primaryDark: '#E5E7EB',
    secondary: '#10B981',
    secondaryLight: '#34D399',
    secondaryDark: '#059669',
    accent: '#8B5CF6',
    accentLight: '#A78BFA',
    accentDark: '#7C3AED',

    // Semantic colors - enhanced for dark mode
    success: '#10B981',
    successLight: '#34D399',
    successDark: '#059669',
    warning: '#FBBF24',
    warningLight: '#FCD34D',
    warningDark: '#F59E0B',
    error: '#F87171',
    errorLight: '#FCA5A5',
    errorDark: '#EF4444',
    info: '#60A5FA',
    infoLight: '#93C5FD',
    infoDark: '#3B82F6',

    // Background system - dark mode specific
    background: '#0F1419',
    backgroundSecondary: '#1F2937',
    surface: '#1F2937',
    surfaceElevated: '#374151',
    surfaceSecondary: '#2D3748',
    surfaceTertiary: '#374151',

    // Text colors for dark mode
    text: {
      primary: '#F9FAFB',
      secondary: '#D1D5DB',
      tertiary: '#9CA3AF',
      quaternary: '#6B7280',
      disabled: '#4B5563',
      inverse: '#111827',
      onPrimary: '#111827',
      onSecondary: '#111827',
      onSurface: '#F9FAFB',
    },

    // Border colors for dark mode
    border: {
      subtle: '#374151',
      light: '#4B5563',
      medium: '#6B7280',
      dark: '#9CA3AF',
      primary: '#8B5CF6',
      error: '#F87171',
      success: '#10B981',
    },

    // Interactive states for dark mode
    interactive: {
      hover: '#374151',
      pressed: '#4B5563',
      focused: '#2D3748',
      disabled: '#1F2937',
      primaryHover: '#E5E7EB',
      primaryPressed: '#D1D5DB',
      secondaryHover: '#34D399',
      secondaryPressed: '#10B981',
    },

    // Shadows for dark mode
    shadow: {
      light: 'rgba(0, 0, 0, 0.3)',
      medium: 'rgba(0, 0, 0, 0.4)',
      heavy: 'rgba(0, 0, 0, 0.5)',
      primary: 'rgba(139, 92, 246, 0.3)',
    },

    // Credit score colors - adjusted for dark mode
    score: {
      excellent: '#10B981',
      good: '#34D399',
      fair: '#FBBF24',
      poor: '#F87171',
      excellentBg: 'rgba(16, 185, 129, 0.2)',
      goodBg: 'rgba(52, 211, 153, 0.2)',
      fairBg: 'rgba(251, 191, 36, 0.2)',
      poorBg: 'rgba(248, 113, 113, 0.2)',
    },

    // Alert colors for dark mode
    alert: {
      info: '#60A5FA',
      infoBg: '#1E3A8A',
      infoText: '#BFDBFE',

      success: '#10B981',
      successBg: '#022C22',
      successText: '#A7F3D0',

      warning: '#FBBF24',
      warningBg: '#451A03',
      warningText: '#FDE68A',

      error: '#F87171',
      errorBg: '#450A0A',
      errorText: '#FECACA',
    },

    // Status indicators for dark mode
    status: {
      online: '#10B981',
      offline: '#6B7280',
      pending: '#FBBF24',
      inactive: '#4B5563',
    },

    // Glass effects for dark mode
    glass: {
      light: 'rgba(31, 41, 55, 0.8)',
      medium: 'rgba(31, 41, 55, 0.9)',
      dark: 'rgba(15, 20, 25, 0.8)',
    },

    // Gradients for dark mode
    gradients: {
      primary: ['#8B5CF6', '#A78BFA'],
      secondary: ['#10B981', '#34D399'],
      warm: ['#FBBF24', '#F87171'],
      cool: ['#60A5FA', '#8B5CF6'],
      subtle: ['#1F2937', '#374151'],
    },

    // Transparent colors for dark mode
    transparent: {
      primary: 'rgba(139, 92, 246, 0.05)',
      secondary: 'rgba(16, 185, 129, 0.05)',
      black: 'rgba(0, 0, 0, 0)',
      white: 'rgba(255, 255, 255, 0)',
    },

    // Tab bar specific for dark mode
    tabBar: {
      background: '#1F2937',
      backgroundSecondary: '#374151',
      activeIcon: '#8B5CF6',
      inactiveIcon: '#6B7280',
      activeText: '#8B5CF6',
      inactiveText: '#9CA3AF',
      border: '#374151',
      shadow: 'rgba(0, 0, 0, 0.4)',
    },

    // Navigation specific for dark mode
    navigation: {
      background: '#1F2937',
      headerBackground: '#1F2937',
      headerText: '#F9FAFB',
      cardBackground: '#1F2937',
      cardShadow: 'rgba(0, 0, 0, 0.4)',
    },
  },
  typography: Typography,
  spacing: Spacing,
  spacingScale: SpacingScale,
  textStyles: TextStyles,
  isDark: true,
} as const;

// Default theme
export const DefaultTheme = LightTheme;

// Theme types
export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorScheme = 'light' | 'dark';

// Helper functions
export const getTheme = (mode: ThemeMode, systemColorScheme?: ColorScheme | null): Theme => {
  if (mode === 'system') {
    return systemColorScheme === 'dark' ? DarkTheme : LightTheme;
  }
  return mode === 'dark' ? DarkTheme : LightTheme;
};

export const isThemeDark = (theme: Theme): boolean => theme.isDark;

// Theme constants
export const THEME_STORAGE_KEY = '@creditguard/theme';
export const DEFAULT_THEME_MODE: ThemeMode = 'system';
