import {StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {Animated} from 'react-native';
import {Theme} from '../../../constants/Themes';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
    },
    title: {
      ...theme.textStyles.headline1,
      color: theme.colors.text.primary,
      fontWeight: 'bold',
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      ...theme.textStyles.bodyLarge,
      color: theme.colors.text.secondary,
    },
    tabGridContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing.md,
      gap: theme.spacing.xs,
    },
    tabRow: {
      flexDirection: 'row',
      gap: theme.spacing.xs,
    },
    compactTabButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: 12,
      borderWidth: 1,
      gap: 4,
      minHeight: 36,
    },
    compactTabText: {
      ...theme.textStyles.bodySmall,
      fontSize: 12,
      letterSpacing: 0.1,
    },
    compactCountBadge: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 10,
      minWidth: 18,
      alignItems: 'center',
    },
    compactCountText: {
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    content: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.xxxl,
    },
    loadingText: {
      ...theme.textStyles.bodyLarge,
      color: theme.colors.text.secondary,
    },
    sectionContainer: {
      paddingHorizontal: theme.spacing.md,
    },
    sectionHeader: {
      marginBottom: theme.spacing.lg,
    },
    sectionHeaderTitle: {
      ...theme.textStyles.headline3,
      color: theme.colors.text.primary,
      fontWeight: '700',
      marginBottom: theme.spacing.xs,
    },
    sectionHeaderSubtitle: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.secondary,
    },
    standardSectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.xl,
    },
    headerIconCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.accent + '15',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTextContainer: {
      flex: 1,
    },
    standardSectionTitle: {
      ...theme.textStyles.headline3,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    standardSectionSubtitle: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
    },
    summaryContainer: {
      paddingHorizontal: theme.spacing.md,
    },
    summaryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -theme.spacing.xs,
    },
    summaryItem: {
      width: '50%',
      paddingHorizontal: theme.spacing.xs,
      marginBottom: theme.spacing.md,
    },
    summaryLabel: {
      ...theme.textStyles.caption,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xs,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    summaryValue: {
      ...theme.textStyles.headline3,
      color: theme.colors.text.primary,
      fontWeight: 'bold',
    },
    accountCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    accountHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
    },
    accountName: {
      ...theme.textStyles.headline3,
      color: theme.colors.text.primary,
      fontWeight: '600',
      flex: 1,
    },
    statusBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: 6,
    },
    statusText: {
      ...theme.textStyles.caption,
      color: theme.colors.surface,
      fontWeight: '600',
      fontSize: 10,
    },
    accountType: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.md,
    },
    accountDetails: {
      gap: theme.spacing.sm,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    detailLabel: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.secondary,
    },
    detailValue: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.primary,
      fontWeight: '600',
    },
    inquiryCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    inquiryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    inquiryName: {
      ...theme.textStyles.bodyLarge,
      color: theme.colors.text.primary,
      fontWeight: '600',
      flex: 1,
    },
    inquiryTypeBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: 6,
    },
    hardInquiry: {
      backgroundColor: theme.colors.warning,
    },
    softInquiry: {
      backgroundColor: theme.colors.info,
    },
    inquiryTypeText: {
      ...theme.textStyles.caption,
      color: theme.colors.surface,
      fontWeight: '600',
      fontSize: 10,
    },
    inquiryDate: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.secondary,
    },
    inquiryInfo: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: theme.spacing.lg,
      marginTop: theme.spacing.md,
    },
    infoTitle: {
      ...theme.textStyles.bodyLarge,
      color: theme.colors.text.primary,
      fontWeight: '600',
      marginBottom: theme.spacing.sm,
    },
    infoText: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.secondary,
      lineHeight: 20,
    },
    bottomPadding: {
      height: 100, // Space for tab bar
    },
    errorBanner: {
      margin: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.alert?.errorBg || '#FEF2F2',
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.error || '#DC2626',
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    errorContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.md,
    },
    errorTextContainer: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    errorTitle: {
      ...theme.textStyles.bodyLarge,
      color: theme.colors.error,
      fontWeight: '600',
      marginBottom: theme.spacing.xs,
    },
    errorText: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.alert?.errorText || theme.colors.error || '#DC2626',
      lineHeight: 18,
    },
    retryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.error,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderRadius: 8,
      alignSelf: 'flex-start',
    },
    retryButtonText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.surface,
      fontWeight: '600',
      marginLeft: theme.spacing.xs,
    },
    // Empty states
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.xxxl * 2,
    },
    emptyStateText: {
      ...theme.textStyles.headline3,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing.lg,
      fontWeight: '600',
    },
    emptyStateSubtext: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.tertiary,
      textAlign: 'center',
      marginTop: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xl,
    },
    // Modern account cards
    modernAccountCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
    },
    accountCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    accountIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.surfaceSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    accountInfo: {
      flex: 1,
    },
    modernAccountName: {
      ...theme.textStyles.headline4,
      color: theme.colors.text.primary,
      fontWeight: '600',
      marginBottom: 2,
    },
    modernAccountType: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.secondary,
      fontSize: 13,
    },
    modernStatusBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: 12,
      borderWidth: 1,
    },
    modernStatusText: {
      ...theme.textStyles.caption,
      fontWeight: '600',
      fontSize: 10,
    },
    // Utilization bar
    utilizationContainer: {
      marginBottom: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.subtle,
    },
    utilizationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    utilizationLabel: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.secondary,
      fontWeight: '500',
    },
    utilizationPercentage: {
      ...theme.textStyles.bodyRegular,
      fontWeight: '700',
    },
    utilizationBar: {
      height: 8,
      backgroundColor: theme.colors.surfaceSecondary,
      borderRadius: 4,
      overflow: 'hidden',
    },
    utilizationFill: {
      height: '100%',
      borderRadius: 4,
    },
    // Modern account details
    modernAccountDetails: {
      gap: theme.spacing.md,
    },
    detailItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    detailIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.surfaceSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    detailContent: {
      flex: 1,
    },
    // Modern inquiry cards
    modernInquiryCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
    },
    inquiryCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    inquiryIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    inquiryContent: {
      flex: 1,
    },
    modernInquiryName: {
      ...theme.textStyles.bodyLarge,
      color: theme.colors.text.primary,
      fontWeight: '600',
      marginBottom: 2,
    },
    inquiryDateText: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.secondary,
      fontSize: 13,
    },
    modernInquiryBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: 12,
      borderWidth: 1,
    },
    modernInquiryTypeText: {
      ...theme.textStyles.caption,
      fontWeight: '600',
      fontSize: 10,
    },
    impactIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.md,
      paddingTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.subtle,
    },
    impactText: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.secondary,
      marginLeft: theme.spacing.sm,
      fontSize: 13,
      fontStyle: 'italic',
    },
    // Modern info card
    modernInfoCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: theme.spacing.lg,
      marginTop: theme.spacing.lg,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
    },
    infoCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    infoIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surfaceSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    modernInfoTitle: {
      ...theme.textStyles.headline4,
      color: theme.colors.text.primary,
      fontWeight: '600',
    },
    infoContent: {
      gap: theme.spacing.md,
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    infoBullet: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.colors.surfaceSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.sm,
      marginTop: 2,
    },
    infoBold: {
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    // Standardized Info Box Styles (matching Collections and Public Records)
    infoBox: {
      flexDirection: 'row',
      backgroundColor: theme.colors.accent + '10',
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.accent,
      padding: theme.spacing.md,
      borderRadius: 12,
      gap: theme.spacing.sm,
      marginTop: theme.spacing.lg,
    },
    infoBoxContent: {
      flex: 1,
    },
    infoBoxHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    infoBoxTitle: {
      ...theme.textStyles.bodySmall,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    seeMoreText: {
      ...theme.textStyles.caption,
      color: theme.colors.accent,
      fontWeight: '600',
    },
    infoBoxText: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.text.secondary,
      lineHeight: 18,
      marginTop: 8,
    },
    // Enhanced Summary Section Styles
    enhancedSummaryContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
    },
    summaryHeader: {
      marginBottom: theme.spacing.xl,
      alignItems: 'center',
    },
    summaryHeaderTitle: {
      ...theme.textStyles.headline2,
      color: theme.colors.text.primary,
      fontWeight: '700',
      marginBottom: theme.spacing.xs,
    },
    summaryHeaderSubtitle: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
    enhancedSummaryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -theme.spacing.sm,
    },
    enhancedSummaryCard: {
      width: '50%',
      paddingHorizontal: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
    },
    cardGradientBorder: {
      borderRadius: 20,
      borderWidth: 1.5,
      padding: 2,
      shadowColor: theme.colors.shadow.medium,
      shadowOffset: {width: 0, height: 8},
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
    cardContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: 18,
      padding: theme.spacing.lg,
      alignItems: 'center',
      minHeight: 140,
      justifyContent: 'space-between',
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: theme.spacing.md,
    },
    enhancedIconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
    },
    trendIndicator: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.colors.surfaceSecondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    enhancedCardLabel: {
      ...theme.textStyles.labelSmall,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
      fontWeight: '500',
      fontSize: 11,
      letterSpacing: 0.5,
    },
    enhancedCardValue: {
      ...theme.textStyles.headline3,
      fontWeight: '800',
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    cardLoadingContainer: {
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.sm,
    },
    progressContainer: {
      width: '100%',
      marginTop: theme.spacing.sm,
    },
    progressTrack: {
      height: 6,
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 3,
    },
    // Derogatory Marks Card Styles
    derogatoryMarksCard: {
      marginTop: theme.spacing.xl,
      marginHorizontal: theme.spacing.lg,
    },
    derogatoryCardBorder: {
      borderRadius: 20,
      borderWidth: 2,
      overflow: 'hidden',
      shadowColor: theme.colors.shadow.medium,
      shadowOffset: {width: 0, height: 6},
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 5,
    },
    derogatoryCardContent: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.xl,
    },
    derogatoryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    derogatoryHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      flex: 1,
    },
    derogatoryIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    derogatoryTitle: {
      ...theme.textStyles.headline3,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    derogatorySubtitle: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.text.secondary,
    },
    derogatoryBadge: {
      width: 56,
      height: 56,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    derogatoryBadgeText: {
      ...theme.textStyles.headline2,
      fontWeight: '800',
      fontSize: 28,
    },
    derogatoryDivider: {
      height: 1,
      backgroundColor: theme.colors.border.light,
      marginVertical: theme.spacing.lg,
    },
    derogatoryBreakdown: {
      gap: theme.spacing.md,
    },
    derogatoryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    derogatoryItemText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.primary,
      fontWeight: '500',
    },
    derogatoryImpact: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      marginTop: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.light,
    },
    derogatoryImpactText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.error,
      fontWeight: '700',
    },
    bureauDropdownContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing.md,
    },
  });

// Helper functions for dynamic styles
export const getTabButtonStyle = (theme: Theme, isActive: boolean): ViewStyle => ({
  backgroundColor: isActive ? theme.colors.accent : theme.colors.surface,
  borderColor: isActive ? theme.colors.accent : theme.colors.border.medium,
});

export const getTabTextStyle = (theme: Theme, isActive: boolean): TextStyle => ({
  color: isActive ? theme.colors.surface : theme.colors.text.primary,
  fontWeight: isActive ? ('700' as const) : ('600' as const),
});

export const getTabIconColor = (theme: Theme, isActive: boolean): string => {
  return isActive ? theme.colors.surface : theme.colors.text.secondary;
};

export const getCountBadgeStyle = (theme: Theme, isActive: boolean): ViewStyle => ({
  backgroundColor: isActive ? theme.colors.surface + '25' : theme.colors.accent + '20',
});

export const getCountTextStyle = (theme: Theme, isActive: boolean): TextStyle => ({
  color: isActive ? theme.colors.surface : theme.colors.accent,
});

export const getErrorTextStyle = (theme: Theme): TextStyle => ({
  color: theme.colors.error,
});

export const getRetryButtonStyle = (theme: Theme): ViewStyle => ({
  marginTop: theme.spacing.lg,
  backgroundColor: theme.colors.accent,
});

export const getCardGradientBorderStyle = (color: string): ViewStyle => ({
  borderColor: color + '30',
});

export const getEnhancedIconContainerStyle = (color: string): ViewStyle => ({
  backgroundColor: color + '15',
});

export const getCardValueStyle = (color: string): TextStyle => ({
  color,
});

export const getProgressTrackStyle = (color: string): ViewStyle => ({
  backgroundColor: color + '20',
});

export const getProgressFillStyle = (color: string, percentage: string): ViewStyle => ({
  backgroundColor: color,
  width: percentage.includes('%') ? `${parseInt(percentage.replace('%', ''), 10)}%` : '0%',
});

export const getAnimatedCardStyle = (
  animRef: Animated.Value,
): {
  opacity: Animated.Value;
  transform: Array<
    | {
        translateY: Animated.AnimatedInterpolation<number>;
      }
    | {
        scale: Animated.AnimatedInterpolation<number>;
      }
  >;
} => ({
  opacity: animRef,
  transform: [
    {
      translateY: animRef.interpolate({
        inputRange: [0, 1],
        outputRange: [50, 0],
      }),
    },
    {
      scale: animRef.interpolate({
        inputRange: [0, 1],
        outputRange: [0.9, 1],
      }),
    },
  ],
});

export const getAnimatedInquiryCardStyle = (
  cardAnimation: Animated.Value,
): {
  opacity: Animated.Value;
  transform: Array<{
    translateY: Animated.AnimatedInterpolation<number>;
  }>;
} => ({
  opacity: cardAnimation,
  transform: [
    {
      translateY: cardAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [50, 0],
      }),
    },
  ],
});

export const getInquiryIconContainerStyle = (theme: Theme, isHardInquiry: boolean): ViewStyle => ({
  backgroundColor: isHardInquiry ? theme.colors.warning + '20' : theme.colors.info + '20',
});

export const getInquiryIconColor = (theme: Theme, isHardInquiry: boolean): string => {
  return isHardInquiry ? theme.colors.warning : theme.colors.info;
};

export const getInquiryBadgeStyle = (theme: Theme, isHardInquiry: boolean): ViewStyle => ({
  backgroundColor: isHardInquiry ? theme.colors.warning + '20' : theme.colors.info + '20',
  borderColor: isHardInquiry ? theme.colors.warning : theme.colors.info,
});

export const getInquiryTypeTextStyle = (theme: Theme, isHardInquiry: boolean): TextStyle => ({
  color: isHardInquiry ? theme.colors.warning : theme.colors.info,
});

export const getAnimatedInfoCardStyle = (
  cardAnimation: Animated.Value | number,
): {
  opacity: Animated.Value | number;
  transform: Array<{
    translateY: Animated.AnimatedInterpolation<number> | number;
  }>;
} => ({
  opacity: cardAnimation,
  transform: [
    {
      translateY:
        typeof cardAnimation === 'number'
          ? 0
          : cardAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
    },
  ],
});
