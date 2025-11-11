import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import type {Theme} from '../../constants/Themes';

export interface EmptyStateProps {
  /**
   * Icon to display in the center
   * @default 'folder-open-outline'
   */
  icon?: keyof typeof Ionicons.glyphMap;

  /**
   * Title text
   * @default 'No Records Found'
   */
  title?: string;

  /**
   * Description text
   */
  description?: string;

  /**
   * Small decorative icon in top-right corner
   * @default 'search-outline'
   */
  decorativeIcon?: keyof typeof Ionicons.glyphMap;

  /**
   * Custom icon color
   */
  iconColor?: string;
}

/**
 * EmptyState Component
 *
 * A reusable empty state component with animated illustration
 * following the design specification from CREDITGUARD_UI_UX_SPECIFICATION.md
 *
 * @example
 * <EmptyState
 *   icon="notifications-off-outline"
 *   title="No Notifications"
 *   description="You're all caught up! Check back later for new alerts and updates."
 * />
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'folder-open-outline',
  title = 'No Records Found',
  description = "We couldn't find any records. Try adjusting your filters or check back later.",
  decorativeIcon = 'search-outline',
  iconColor,
}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const decorativeFloatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation for background gradient
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Float animation for main icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Float animation for decorative icon (with delay)
    Animated.loop(
      Animated.sequence([
        Animated.timing(decorativeFloatAnim, {
          toValue: -8,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(decorativeFloatAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const finalIconColor = iconColor || theme.colors.text.tertiary;

  return (
    <View style={styles.container}>
      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <View style={styles.iconWrapper}>
          {/* Animated gradient background */}
          <Animated.View
            style={[
              styles.gradientBackground,
              {
                transform: [{scale: pulseAnim}],
              },
            ]}
          />

          {/* Main icon with float animation */}
          <Animated.View
            style={[
              styles.iconCard,
              {
                transform: [{translateY: floatAnim}],
              },
            ]}>
            <Ionicons name={icon} size={48} color={finalIconColor} />
          </Animated.View>
        </View>

        {/* Decorative small icon (top-right) */}
        <Animated.View
          style={[
            styles.decorativeIconContainer,
            {
              transform: [{translateY: decorativeFloatAnim}],
            },
          ]}>
          <Ionicons name={decorativeIcon} size={12} color={theme.colors.warning} />
        </Animated.View>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.xxxl,
      paddingHorizontal: theme.spacing.xl,
    },
    illustrationContainer: {
      width: 128,
      height: 128,
      marginBottom: theme.spacing.xl,
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconWrapper: {
      width: '100%',
      height: '100%',
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
    },
    gradientBackground: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      borderRadius: 32,
      backgroundColor: theme.colors.accent,
      opacity: 0.1,
    },
    iconCard: {
      width: 80,
      height: 80,
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      shadowColor: theme.colors.shadow.medium,
      shadowOffset: {width: 0, height: 8},
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    decorativeIconContainer: {
      position: 'absolute',
      top: -8,
      right: -8,
      width: 24,
      height: 24,
      backgroundColor: theme.colors.warning + '20',
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    contentContainer: {
      maxWidth: 320,
      alignItems: 'center',
    },
    title: {
      ...theme.textStyles.headline3,
      fontWeight: '400',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
      letterSpacing: 0.3,
    },
    description: {
      ...theme.textStyles.bodySmall,
      fontWeight: '300',
      color: theme.colors.text.secondary,
      textAlign: 'center',
      lineHeight: 20,
      paddingHorizontal: theme.spacing.md,
      letterSpacing: 0.2,
    },
  });
