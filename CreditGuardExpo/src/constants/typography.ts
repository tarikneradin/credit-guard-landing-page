import {Platform} from 'react-native';

export const Typography = {
  fontFamily: {
    regular: Platform.select({
      ios: 'SF Pro Text',
      android: 'Roboto',
      default: 'System',
    }),
    medium: Platform.select({
      ios: 'SF Pro Text Medium',
      android: 'Roboto-Medium',
      default: 'System',
    }),
    semibold: Platform.select({
      ios: 'SF Pro Text Semibold',
      android: 'Roboto-Medium',
      default: 'System',
    }),
    bold: Platform.select({
      ios: 'SF Pro Text Bold',
      android: 'Roboto-Bold',
      default: 'System',
    }),
    // Display fonts for credit scores and hero text
    display: Platform.select({
      ios: 'SF Pro Display',
      android: 'Roboto',
      default: 'System',
    }),
    displayBold: Platform.select({
      ios: 'SF Pro Display Bold',
      android: 'Roboto-Bold',
      default: 'System',
    }),
    // Monospace for numbers and codes
    mono: Platform.select({
      ios: 'SF Mono',
      android: 'Roboto Mono',
      default: 'monospace',
    }),
  },

  fontSize: {
    // Micro text
    micro: 10,
    // Small text
    xs: 12,
    sm: 14,
    // Body text
    md: 16,
    lg: 18,
    // Headings
    xl: 20,
    xxl: 24,
    xxxl: 28,
    xxxxl: 32,
    // Display
    display1: 36,
    display2: 42,
    display3: 48,
    display4: 56,
    // Special credit score display
    scoreDisplay: 64,
  },

  lineHeight: {
    micro: 14,
    xs: 16,
    sm: 20,
    md: 24,
    lg: 26,
    xl: 28,
    xxl: 32,
    xxxl: 36,
    xxxxl: 40,
    display1: 44,
    display2: 50,
    display3: 56,
    display4: 64,
    scoreDisplay: 72,
  },

  fontWeight: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
    black: '900' as const,
  },

  letterSpacing: {
    tighter: -0.8,
    tight: -0.4,
    normal: 0,
    wide: 0.3,
    wider: 0.5,
    widest: 1.5,
  },
} as const;

// Pre-defined text styles for consistency
export const TextStyles = {
  // Credit Score Display - Hero text for main score
  scoreDisplay: {
    fontFamily: Typography.fontFamily.displayBold,
    fontSize: Typography.fontSize.scoreDisplay,
    lineHeight: Typography.lineHeight.scoreDisplay,
    fontWeight: Typography.fontWeight.extrabold,
    letterSpacing: Typography.letterSpacing.tighter,
  },

  // Display text hierarchy
  display1: {
    fontFamily: Typography.fontFamily.displayBold,
    fontSize: Typography.fontSize.display1,
    lineHeight: Typography.lineHeight.display1,
    fontWeight: Typography.fontWeight.extrabold,
    letterSpacing: Typography.letterSpacing.tighter,
  },

  display2: {
    fontFamily: Typography.fontFamily.displayBold,
    fontSize: Typography.fontSize.display2,
    lineHeight: Typography.lineHeight.display2,
    fontWeight: Typography.fontWeight.bold,
    letterSpacing: Typography.letterSpacing.tight,
  },

  display3: {
    fontFamily: Typography.fontFamily.display,
    fontSize: Typography.fontSize.display3,
    lineHeight: Typography.lineHeight.display3,
    fontWeight: Typography.fontWeight.bold,
    letterSpacing: Typography.letterSpacing.tight,
  },

  // Headlines hierarchy
  headline1: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.xxxxl,
    lineHeight: Typography.lineHeight.xxxxl,
    fontWeight: Typography.fontWeight.extrabold,
    letterSpacing: Typography.letterSpacing.tight,
  },

  headline2: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.xxxl,
    lineHeight: Typography.lineHeight.xxxl,
    fontWeight: Typography.fontWeight.bold,
    letterSpacing: Typography.letterSpacing.tight,
  },

  headline3: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.fontSize.xxl,
    lineHeight: Typography.lineHeight.xxl,
    fontWeight: Typography.fontWeight.bold,
    letterSpacing: Typography.letterSpacing.tight,
  },

  headline4: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.fontSize.xl,
    lineHeight: Typography.lineHeight.xl,
    fontWeight: Typography.fontWeight.semibold,
    letterSpacing: Typography.letterSpacing.normal,
  },

  // Body text hierarchy
  bodyXLarge: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xl,
    lineHeight: Typography.lineHeight.xl,
    fontWeight: Typography.fontWeight.regular,
    letterSpacing: Typography.letterSpacing.normal,
  },

  bodyLarge: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.lg,
    lineHeight: 26,
    fontWeight: Typography.fontWeight.regular,
    letterSpacing: Typography.letterSpacing.normal,
  },

  bodyRegular: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.md,
    lineHeight: 24,
    fontWeight: Typography.fontWeight.regular,
    letterSpacing: Typography.letterSpacing.normal,
  },

  bodyMedium: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.md,
    lineHeight: 24,
    fontWeight: Typography.fontWeight.medium,
    letterSpacing: Typography.letterSpacing.normal,
  },

  bodySmall: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.sm,
    lineHeight: 20,
    fontWeight: Typography.fontWeight.regular,
    letterSpacing: Typography.letterSpacing.normal,
  },

  // Labels and captions
  labelLarge: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.fontSize.md,
    lineHeight: Typography.lineHeight.md,
    fontWeight: Typography.fontWeight.semibold,
    letterSpacing: Typography.letterSpacing.wide,
  },

  labelMedium: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.lineHeight.sm,
    fontWeight: Typography.fontWeight.semibold,
    letterSpacing: Typography.letterSpacing.wide,
  },

  labelSmall: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.fontSize.xs,
    lineHeight: Typography.lineHeight.xs,
    fontWeight: Typography.fontWeight.semibold,
    letterSpacing: Typography.letterSpacing.wider,
  },

  caption: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    lineHeight: 18,
    fontWeight: Typography.fontWeight.regular,
    letterSpacing: Typography.letterSpacing.normal,
  },

  captionMedium: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.xs,
    lineHeight: 18,
    fontWeight: Typography.fontWeight.medium,
    letterSpacing: Typography.letterSpacing.normal,
  },

  micro: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.micro,
    lineHeight: Typography.lineHeight.micro,
    fontWeight: Typography.fontWeight.medium,
    letterSpacing: Typography.letterSpacing.normal,
  },

  // Button text hierarchy
  buttonLarge: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.fontSize.lg,
    lineHeight: Typography.lineHeight.lg,
    fontWeight: Typography.fontWeight.bold,
    letterSpacing: Typography.letterSpacing.wide,
  },

  buttonMedium: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.fontSize.md,
    lineHeight: Typography.lineHeight.md,
    fontWeight: Typography.fontWeight.semibold,
    letterSpacing: Typography.letterSpacing.wide,
  },

  buttonSmall: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.lineHeight.sm,
    fontWeight: Typography.fontWeight.semibold,
    letterSpacing: Typography.letterSpacing.wide,
  },

  // Monospace for numbers, codes, and data
  monoLarge: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.fontSize.lg,
    lineHeight: Typography.lineHeight.lg,
    fontWeight: Typography.fontWeight.medium,
    letterSpacing: Typography.letterSpacing.normal,
  },

  monoRegular: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.fontSize.md,
    lineHeight: Typography.lineHeight.md,
    fontWeight: Typography.fontWeight.regular,
    letterSpacing: Typography.letterSpacing.normal,
  },

  monoSmall: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.lineHeight.sm,
    fontWeight: Typography.fontWeight.regular,
    letterSpacing: Typography.letterSpacing.normal,
  },

  // Legacy support - keeping for backward compatibility
  label: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.lineHeight.sm,
    fontWeight: Typography.fontWeight.medium,
  },

  button: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.md,
    lineHeight: Typography.lineHeight.md,
    fontWeight: Typography.fontWeight.medium,
  },
} as const;

export type TypographyKeys = keyof typeof Typography;
export type TextStyleKeys = keyof typeof TextStyles;
