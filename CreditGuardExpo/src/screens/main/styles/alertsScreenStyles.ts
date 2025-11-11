import {StyleSheet} from 'react-native';
import {Theme} from '../../../constants/Themes';

export const createAlertsScreenStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: theme.spacing.lg,
      paddingBottom: theme.spacing.sm,
    },
    title: {
      ...theme.textStyles.headline1,
      color: theme.colors.text.primary,
      fontWeight: '700',
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      ...theme.textStyles.bodyLarge,
      color: theme.colors.text.secondary,
    },
    scrollView: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
    contentContainer: {
      paddingTop: theme.spacing.lg,
    },
    contentContainerCentered: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    alertCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      shadowColor: theme.colors.shadow.medium,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    alertContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    alertText: {
      flex: 1,
    },
    alertHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    alertTitle: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '600',
      color: theme.colors.text.primary,
      flex: 1,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.error,
      marginLeft: theme.spacing.sm,
    },
    alertMessage: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xs,
      lineHeight: 20,
    },
    alertFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: theme.spacing.xs,
    },
    alertDate: {
      ...theme.textStyles.caption,
      color: theme.colors.text.tertiary,
    },
    bureauBadge: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: theme.colors.text.tertiary + '40',
    },
    bureauBadgeText: {
      ...theme.textStyles.caption,
      fontSize: 10,
      fontWeight: '600',
      color: theme.colors.text.secondary,
      letterSpacing: 0.5,
    },
    bottomPadding: {
      height: 100,
    },
    loadingState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.xxl,
    },
    loadingText: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing.md,
    },
    errorState: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xxl,
      paddingHorizontal: theme.spacing.lg,
    },
    errorTitle: {
      ...theme.textStyles.headline4,
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
    },
    errorText: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
      lineHeight: 20,
    },
    retryButton: {
      backgroundColor: theme.colors.accent,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.md,
      borderRadius: 8,
      marginTop: theme.spacing.md,
    },
    retryButtonText: {
      ...theme.textStyles.bodyLarge,
      color: '#FFFFFF',
      fontWeight: '600',
    },
  });
