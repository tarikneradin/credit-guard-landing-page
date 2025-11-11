export const Colors = {
  // Base colors
  white: '#FFFFFF',
  black: '#000000',

  // Primary brand colors - Modern fintech palette
  primary: '#1F2937', // Dark charcoal for premium feel
  primaryLight: '#374151',
  primaryDark: '#111827',

  secondary: '#059669', // Trust green
  secondaryLight: '#10B981',
  secondaryDark: '#047857',

  accent: '#6366F1', // Modern indigo
  accentLight: '#8B5CF6',
  accentDark: '#4F46E5',

  // Semantic colors
  warning: '#F59E0B',
  warningLight: '#FCD34D',
  warningDark: '#D97706',

  error: '#EF4444',
  errorLight: '#F87171',
  errorDark: '#DC2626',

  success: '#059669',
  successLight: '#10B981',
  successDark: '#047857',

  info: '#3B82F6',
  infoLight: '#60A5FA',
  infoDark: '#2563EB',

  // Background system - Modern layered approach
  background: '#FAFBFC', // Subtle off-white
  backgroundSecondary: '#F3F4F6',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceSecondary: '#F9FAFB',
  surfaceTertiary: '#F3F4F6',

  // Credit score colors - More vibrant and distinct
  score: {
    excellent: '#059669', // Premium green - 740-850
    good: '#16A34A', // Fresh green - 670-739
    fair: '#F59E0B', // Warm amber - 580-669
    poor: '#EF4444', // Alert red - 300-579
    excellentBg: 'rgba(5, 150, 105, 0.1)',
    goodBg: 'rgba(22, 163, 74, 0.1)',
    fairBg: 'rgba(245, 158, 11, 0.1)',
    poorBg: 'rgba(239, 68, 68, 0.1)',
  },

  // Text system - Enhanced contrast and hierarchy
  text: {
    primary: '#111827', // High contrast
    secondary: '#4B5563', // Medium contrast
    tertiary: '#6B7280', // Lower contrast
    quaternary: '#9CA3AF', // Subtle
    disabled: '#D1D5DB',
    inverse: '#FFFFFF',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onSurface: '#111827',
  },

  // Border system - More nuanced
  border: {
    subtle: '#F3F4F6',
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#9CA3AF',
    primary: '#6366F1',
    error: '#EF4444',
    success: '#059669',
  },

  // Interactive states
  interactive: {
    hover: '#F9FAFB',
    pressed: '#F3F4F6',
    focused: '#EEF2FF',
    disabled: '#F9FAFB',
    primaryHover: '#374151',
    primaryPressed: '#111827',
    secondaryHover: '#10B981',
    secondaryPressed: '#047857',
  },

  // Elevation shadows
  shadow: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.1)',
    heavy: 'rgba(0, 0, 0, 0.15)',
    primary: 'rgba(99, 102, 241, 0.2)',
  },

  // Glass and transparency effects
  glass: {
    light: 'rgba(255, 255, 255, 0.8)',
    medium: 'rgba(255, 255, 255, 0.9)',
    dark: 'rgba(31, 41, 55, 0.8)',
  },

  // Alert and notification colors
  alert: {
    info: '#3B82F6',
    infoBg: '#EFF6FF',
    infoText: '#1E40AF',

    success: '#059669',
    successBg: '#ECFDF5',
    successText: '#047857',

    warning: '#F59E0B',
    warningBg: '#FFFBEB',
    warningText: '#D97706',

    error: '#EF4444',
    errorBg: '#FEF2F2',
    errorText: '#DC2626',
  },

  // Status indicators
  status: {
    online: '#10B981',
    offline: '#6B7280',
    pending: '#F59E0B',
    inactive: '#9CA3AF',
  },

  // Gradient definitions
  gradients: {
    primary: ['#6366F1', '#8B5CF6'],
    secondary: ['#059669', '#10B981'],
    warm: ['#F59E0B', '#EF4444'],
    cool: ['#3B82F6', '#6366F1'],
    subtle: ['#F9FAFB', '#F3F4F6'],
  },

  // Transparent colors
  transparent: {
    primary: 'rgba(99, 102, 241, 0.05)',
    secondary: 'rgba(5, 150, 105, 0.05)',
    black: 'rgba(0, 0, 0, 0)',
    white: 'rgba(255, 255, 255, 0)',
    error: 'rgba(239, 68, 68, 0.05)',
  },

  // Tab bar colors
  tabBar: {
    background: '#FFFFFF',
    activeIcon: '#6366F1',
    inactiveIcon: '#6B7280',
    activeBg: 'rgba(99, 102, 241, 0.1)',
    border: '#E5E7EB',
  },
} as const;

export type ColorKeys = keyof typeof Colors;
