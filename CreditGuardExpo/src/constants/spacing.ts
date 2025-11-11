export const Spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
  xxxxxl: 48,
  xxxxxxl: 64,
} as const;

// Design system spacing scale for consistent layouts
export const SpacingScale = {
  // Base unit (4px)
  unit: 4,

  // Common measurements
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 20,
    full: 9999,
  },

  // Component-specific spacing
  component: {
    // Cards and containers
    cardPadding: Spacing.lg,
    cardMargin: Spacing.lg,
    cardRadius: 12,
    cardShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',

    // Buttons
    buttonPaddingVertical: Spacing.md,
    buttonPaddingHorizontal: Spacing.xl,
    buttonRadius: 8,
    buttonShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',

    // Inputs
    inputPaddingVertical: Spacing.md,
    inputPaddingHorizontal: Spacing.lg,
    inputRadius: 8,
    inputBorderWidth: 1,

    // Headers
    headerPadding: Spacing.xl,
    headerHeight: 56,

    // Tab bar
    tabBarHeight: 84,
    tabBarPadding: Spacing.sm,

    // Navigation
    navigationPadding: Spacing.lg,
    navigationHeight: 44,
  },

  // Layout spacing
  layout: {
    screenPaddingHorizontal: Spacing.lg,
    screenPaddingVertical: Spacing.xl,
    sectionSpacing: Spacing.xxxl,
    componentSpacing: Spacing.xl,
    contentSpacing: Spacing.lg,
    itemSpacing: Spacing.md,
    inlineSpacing: Spacing.sm,
  },

  // Typography spacing
  typography: {
    paragraphSpacing: Spacing.lg,
    headingSpacing: Spacing.xl,
    listItemSpacing: Spacing.sm,
    letterSpacing: {
      tight: -0.5,
      normal: 0,
      wide: 0.5,
      wider: 1,
    },
  },

  // Responsive breakpoints (for future use)
  breakpoints: {
    mobile: 0,
    tablet: 768,
    desktop: 1024,
    wide: 1440,
  },
} as const;

export type SpacingKeys = keyof typeof Spacing;
