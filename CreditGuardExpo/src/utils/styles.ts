import {StyleSheet, ViewStyle, TextStyle, ImageStyle} from 'react-native';

// Type-safe style creation helper - DEPRECATED: Use theme context instead
export const createStyles = <T extends Record<string, ViewStyle | TextStyle | ImageStyle>>(
  styles: T,
): T => StyleSheet.create(styles);

// Combine multiple styles safely
export const combineStyles = <T extends ViewStyle | TextStyle | ImageStyle>(
  ...styles: (T | undefined | false | null)[]
): T => {
  const validStyles = styles.filter(Boolean) as T[];
  return Object.assign({}, ...validStyles) as T;
};

// Shadow helper for consistent shadows across platform
export const createShadow = (
  elevation: number = 2,
  shadowColor: string = '#000000',
  shadowOpacity: number = 0.1,
) => ({
  shadowColor,
  shadowOffset: {
    width: 0,
    height: elevation,
  },
  shadowOpacity,
  shadowRadius: elevation * 2,
  elevation, // Android
});

// Border radius helper
export const createBorderRadius = (radius: number) => ({
  borderRadius: radius,
});

// Create responsive size based on screen dimensions
export const responsiveSize = (baseSize: number, screenWidth: number) => {
  const scale = screenWidth / 375; // iPhone X width as base
  return Math.round(baseSize * scale);
};

// Helper for creating flex layouts
export const flexStyles = {
  flex1: {flex: 1} as ViewStyle,
  flexRow: {flexDirection: 'row' as const} as ViewStyle,
  flexColumn: {flexDirection: 'column' as const} as ViewStyle,
  justifyCenter: {justifyContent: 'center' as const} as ViewStyle,
  justifyBetween: {justifyContent: 'space-between' as const} as ViewStyle,
  justifyAround: {justifyContent: 'space-around' as const} as ViewStyle,
  alignCenter: {alignItems: 'center' as const} as ViewStyle,
  alignStart: {alignItems: 'flex-start' as const} as ViewStyle,
  alignEnd: {alignItems: 'flex-end' as const} as ViewStyle,
  centered: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  } as ViewStyle,
};

// Common layout styles
export const layoutStyles = {
  fullWidth: {width: '100%'} as ViewStyle,
  fullHeight: {height: '100%'} as ViewStyle,
  fullScreen: {flex: 1, width: '100%', height: '100%'} as ViewStyle,
};
