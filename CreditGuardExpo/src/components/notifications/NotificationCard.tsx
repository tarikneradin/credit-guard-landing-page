import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {CreditNotification} from '../../types/notification';
import {alertTypeMetadata} from '../../data/notificationMockData';

interface NotificationCardProps {
  notification: CreditNotification;
  onPress?: (notification: CreditNotification) => void;
  onAction?: (notification: CreditNotification) => void;
  onDismiss?: (notification: CreditNotification) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onPress,
  onAction,
  onDismiss,
}) => {
  const {theme} = useTheme();

  const metadata = alertTypeMetadata[notification.type];
  const priorityColor = getPriorityColor(notification.priority);
  const iconName = metadata?.icon || 'notifications-outline';
  const iconColor = metadata?.color || theme.colors.text.secondary;

  const formatTimestamp = (timestamp: Date): string => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    const weeks = Math.floor(days / 7);
    if (weeks === 1) return '1 week ago';
    return `${weeks} weeks ago`;
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: notification.read
        ? theme.colors.surface
        : theme.colors.surface + 'F0', // Slightly brighter for unread
      borderRadius: 12,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderLeftWidth: 4,
      borderLeftColor: priorityColor,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: iconColor + '15',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    contentContainer: {
      flex: 1,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    title: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '600',
      color: theme.colors.text.primary,
      flex: 1,
    },
    unreadBadge: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.primary,
      marginLeft: theme.spacing.sm,
    },
    message: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
      lineHeight: 20,
      marginBottom: theme.spacing.xs,
    },
    timestampRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    timestamp: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.text.tertiary,
    },
    priorityBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
      marginLeft: theme.spacing.sm,
    },
    priorityText: {
      ...theme.textStyles.caption,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    impactContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.xs,
      paddingTop: theme.spacing.xs,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    impactText: {
      ...theme.textStyles.bodySmall,
      fontWeight: '600',
      marginLeft: theme.spacing.xs,
    },
    impactPositive: {
      color: theme.colors.success,
    },
    impactNegative: {
      color: theme.colors.error,
    },
    actionsContainer: {
      flexDirection: 'row',
      marginTop: theme.spacing.sm,
      gap: theme.spacing.sm,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: 8,
      backgroundColor: theme.colors.primary,
    },
    actionButtonSecondary: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    actionButtonText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.surface,
      fontWeight: '600',
      marginLeft: theme.spacing.xs,
    },
    actionButtonTextSecondary: {
      color: theme.colors.text.secondary,
    },
  });

  function getPriorityColor(priority: string): string {
    switch (priority) {
      case 'critical':
        return theme.colors.error;
      case 'high':
        return theme.colors.warning;
      case 'medium':
        return theme.colors.accent;
      case 'low':
        return theme.colors.text.tertiary;
      default:
        return theme.colors.text.tertiary;
    }
  }

  const renderPriorityBadge = () => {
    if (notification.priority === 'low') return null;

    const bgColor =
      notification.priority === 'critical'
        ? theme.colors.error + '15'
        : notification.priority === 'high'
          ? theme.colors.warning + '15'
          : theme.colors.accent + '15';

    return (
      <View style={[styles.priorityBadge, {backgroundColor: bgColor}]}>
        <Text
          style={[styles.priorityText, {color: getPriorityColor(notification.priority)}]}>
          {notification.priority}
        </Text>
      </View>
    );
  };

  const renderImpact = () => {
    if (!notification.alertData.impactScore) return null;

    const isPositive = notification.alertData.impactScore > 0;
    const impactValue = Math.abs(notification.alertData.impactScore);

    return (
      <View style={styles.impactContainer}>
        <Ionicons
          name={isPositive ? 'trending-up' : 'trending-down'}
          size={16}
          color={isPositive ? theme.colors.success : theme.colors.error}
        />
        <Text
          style={[
            styles.impactText,
            isPositive ? styles.impactPositive : styles.impactNegative,
          ]}>
          {isPositive ? '+' : '-'}
          {impactValue} pts score impact
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(notification)}
      activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name={iconName as any} size={20} color={iconColor} />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{notification.title}</Text>
            {!notification.read && <View style={styles.unreadBadge} />}
          </View>

          <Text style={styles.message} numberOfLines={2}>
            {notification.message}
          </Text>

          <View style={styles.timestampRow}>
            <Text style={styles.timestamp}>
              {formatTimestamp(notification.timestamp)}
            </Text>
            {renderPriorityBadge()}
          </View>

          {renderImpact()}

          {notification.actionLabel && (
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onAction?.(notification)}>
                <Ionicons name="arrow-forward" size={16} color={theme.colors.surface} />
                <Text style={styles.actionButtonText}>{notification.actionLabel}</Text>
              </TouchableOpacity>

              {onDismiss && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.actionButtonSecondary]}
                  onPress={() => onDismiss(notification)}>
                  <Ionicons
                    name="close"
                    size={16}
                    color={theme.colors.text.secondary}
                  />
                  <Text
                    style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>
                    Dismiss
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
