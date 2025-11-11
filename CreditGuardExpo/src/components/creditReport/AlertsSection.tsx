import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {EmptyState} from '../common/EmptyState';
import {CreditAlert} from '../../types';

interface AlertsSectionProps {
  alerts: CreditAlert[];
}

export const AlertsSection: React.FC<AlertsSectionProps> = ({alerts}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);

  const getAlertIcon = (type: CreditAlert['type']) => {
    switch (type) {
      case 'score_change':
        return 'trending-up';
      case 'new_account':
        return 'add-circle';
      case 'hard_inquiry':
        return 'search';
      case 'suspicious_activity':
        return 'warning';
      case 'payment_missed':
        return 'close-circle';
      case 'credit_limit_change':
        return 'resize';
      default:
        return 'notifications';
    }
  };

  const getSeverityColor = (severity: CreditAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return theme.colors.error;
      case 'warning':
        return theme.colors.warning;
      case 'info':
        return theme.colors.accent;
      default:
        return theme.colors.text.secondary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
  };

  return (
    <View style={styles.container}>
      {/* Alerts Section */}
      <View style={styles.section}>
        {alerts.length === 0 ? (
          <EmptyState
            icon="folder-open-outline"
            title="No Alerts Found"
            description="Great news! You don't have any credit alerts at this time. We'll notify you immediately of any important changes to your credit report."
            decorativeIcon="search-outline"
            iconColor={theme.colors.text.tertiary}
          />
        ) : (
          <View style={styles.alertsList}>
            {alerts.map(alert => {
              const severityColor = getSeverityColor(alert.severity);
              return (
                <TouchableOpacity key={alert.id} style={styles.alertCard} activeOpacity={0.7}>
                  <View style={[styles.alertIndicator, {backgroundColor: severityColor}]} />

                  <View style={[styles.alertIcon, {backgroundColor: severityColor + '15'}]}>
                    <Ionicons
                      name={getAlertIcon(alert.type) as any}
                      size={22}
                      color={severityColor}
                    />
                  </View>

                  <View style={styles.alertContent}>
                    <View style={styles.alertHeader}>
                      <Text style={styles.alertTitle}>{alert.title}</Text>
                      {!alert.isRead && <View style={styles.newDot} />}
                    </View>
                    <Text style={styles.alertDescription}>{alert.description}</Text>
                    <View style={styles.alertFooter}>
                      <Text style={styles.alertDate}>{formatDate(alert.date)}</Text>
                      {alert.actionRequired && (
                        <View style={styles.actionBadge}>
                          <Text style={styles.actionText}>Action Required</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={20} color={theme.colors.accent} />
        <View style={styles.infoBoxContent}>
          <Text style={styles.infoBoxTitle}>About Credit Alerts</Text>
          <Text style={styles.infoBoxText}>
            Stay informed about changes to your credit report. Critical alerts require immediate
            attention to protect your credit and prevent identity theft. Review all alerts regularly
            to maintain good credit health.
          </Text>
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      padding: theme.spacing.lg,
    },
    section: {
      marginBottom: theme.spacing.xxxl,
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
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    sectionHeaderTitle: {
      ...theme.textStyles.headline3,
      fontWeight: '700',
      color: theme.colors.text.primary,
    },
    unreadBadge: {
      backgroundColor: theme.colors.error,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: 12,
    },
    unreadText: {
      ...theme.textStyles.caption,
      fontSize: 11,
      fontWeight: '700',
      color: theme.colors.surface,
    },
    alertsList: {
      gap: theme.spacing.md,
    },
    alertCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      flexDirection: 'row',
      overflow: 'hidden',
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    alertIndicator: {
      width: 4,
    },
    alertIcon: {
      width: 56,
      alignItems: 'center',
      justifyContent: 'center',
      margin: theme.spacing.md,
      borderRadius: 12,
    },
    alertContent: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      paddingRight: theme.spacing.md,
    },
    alertHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
    },
    alertTitle: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '700',
      color: theme.colors.text.primary,
      flex: 1,
    },
    newDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.error,
    },
    alertDescription: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
      lineHeight: 20,
      marginBottom: theme.spacing.sm,
    },
    alertFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    alertDate: {
      ...theme.textStyles.caption,
      color: theme.colors.text.tertiary,
      fontSize: 11,
    },
    actionBadge: {
      backgroundColor: theme.colors.warning + '15',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: 8,
    },
    actionText: {
      ...theme.textStyles.caption,
      fontSize: 10,
      fontWeight: '700',
      color: theme.colors.warning,
    },
    goodStandingCard: {
      backgroundColor: theme.colors.success + '08',
      borderRadius: 16,
      padding: theme.spacing.xxxl,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.success + '20',
    },
    goodStandingIcon: {
      marginBottom: theme.spacing.md,
    },
    goodStandingTitle: {
      ...theme.textStyles.headline3,
      fontWeight: '700',
      color: theme.colors.success,
      marginBottom: theme.spacing.sm,
    },
    goodStandingText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    recordsList: {
      gap: theme.spacing.md,
    },
    recordCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: theme.spacing.lg,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    recordHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    recordTypeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    recordType: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '700',
      color: theme.colors.text.primary,
    },
    statusBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: 8,
    },
    statusText: {
      ...theme.textStyles.caption,
      fontSize: 10,
      fontWeight: '700',
    },
    recordDescription: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.md,
      lineHeight: 20,
    },
    recordDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.light,
      marginBottom: theme.spacing.sm,
    },
    recordDetail: {
      flex: 1,
    },
    recordDetailLabel: {
      ...theme.textStyles.caption,
      color: theme.colors.text.tertiary,
      marginBottom: 4,
      fontSize: 11,
    },
    recordDetailValue: {
      ...theme.textStyles.bodyMedium,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    courtInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingTop: theme.spacing.sm,
    },
    courtText: {
      ...theme.textStyles.caption,
      color: theme.colors.text.tertiary,
      fontSize: 11,
    },
    infoBox: {
      flexDirection: 'row',
      backgroundColor: theme.colors.accent + '10',
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.accent,
      padding: theme.spacing.md,
      borderRadius: 12,
      gap: theme.spacing.sm,
    },
    infoBoxContent: {
      flex: 1,
    },
    infoBoxTitle: {
      ...theme.textStyles.bodyMedium,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    infoBoxText: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.text.secondary,
      lineHeight: 18,
    },
  });
