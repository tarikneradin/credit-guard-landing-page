import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {Colors, TextStyles, Spacing} from '../../constants';
import {createStyles} from '../../utils/styles';

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: string;
  isRead?: boolean;
}

interface AlertsCardProps {
  alerts: Alert[];
  isLoading?: boolean;
  onAlertPress?: (alert: Alert) => void;
  onViewAll?: () => void;
}

export const AlertsCard: React.FC<AlertsCardProps> = ({
  alerts,
  isLoading = false,
  onAlertPress,
  onViewAll,
}) => {
  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'success':
        return '✅';
      case 'error':
        return '🚨';
      default:
        return 'ℹ️';
    }
  };

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'warning':
        return Colors.warning;
      case 'info':
        return Colors.info;
      case 'success':
        return Colors.success;
      case 'error':
        return Colors.error;
      default:
        return Colors.text.secondary;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Alerts</Text>
        </View>
        <View style={styles.loadingState}>
          <Text style={styles.loadingText}>Loading alerts...</Text>
        </View>
      </View>
    );
  }

  if (alerts.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Alerts</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🎉</Text>
          <Text style={styles.emptyText}>All clear!</Text>
          <Text style={styles.emptySubtext}>No alerts at this time</Text>
        </View>
      </View>
    );
  }

  const displayAlerts = alerts.slice(0, 3);
  const hasMoreAlerts = alerts.length > 3;
  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Alerts</Text>
        <View style={styles.headerRight}>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView style={styles.alertsList} showsVerticalScrollIndicator={false}>
        {displayAlerts.map(alert => (
          <TouchableOpacity
            key={alert.id}
            style={[styles.alertItem, !alert.isRead && styles.unreadAlert]}
            onPress={() => onAlertPress?.(alert)}>
            <View style={styles.alertIcon}>
              <Text style={styles.iconText}>{getAlertIcon(alert.type)}</Text>
            </View>

            <View style={styles.alertContent}>
              <View style={styles.alertHeader}>
                <Text style={styles.alertTitle}>{alert.title}</Text>
                <Text style={styles.alertTime}>{formatTimestamp(alert.timestamp)}</Text>
              </View>
              <Text style={styles.alertMessage} numberOfLines={2}>
                {alert.message}
              </Text>
            </View>

            <View style={[styles.typeIndicator, {backgroundColor: getAlertColor(alert.type)}]} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {hasMoreAlerts && onViewAll && (
        <TouchableOpacity style={styles.viewAllButton} onPress={onViewAll}>
          <Text style={styles.viewAllText}>View all {alerts.length} alerts</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = createStyles({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    elevation: 2,
    shadowColor: Colors.shadow.light,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    ...TextStyles.headline3,
    color: Colors.text.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: Colors.error,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    ...TextStyles.caption,
    color: Colors.surface,
    fontSize: 11,
    fontWeight: '600',
  },
  alertsList: {
    maxHeight: 200,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: 8,
    marginBottom: Spacing.xs,
  },
  unreadAlert: {
    backgroundColor: Colors.background,
  },
  alertIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.border.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  iconText: {
    fontSize: 16,
  },
  alertContent: {
    flex: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  alertTitle: {
    ...TextStyles.bodyLarge,
    color: Colors.text.primary,
    fontWeight: '600',
    flex: 1,
    marginRight: Spacing.sm,
  },
  alertTime: {
    ...TextStyles.caption,
    color: Colors.text.tertiary,
  },
  alertMessage: {
    ...TextStyles.bodyRegular,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  typeIndicator: {
    width: 3,
    height: '100%',
    borderRadius: 1.5,
    marginLeft: Spacing.sm,
  },
  viewAllButton: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  viewAllText: {
    ...TextStyles.bodyRegular,
    color: Colors.primary,
    fontWeight: '600',
  },
  loadingState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  loadingText: {
    ...TextStyles.bodyRegular,
    color: Colors.text.secondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    ...TextStyles.bodyLarge,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    ...TextStyles.bodyRegular,
    color: Colors.text.secondary,
  },
});
