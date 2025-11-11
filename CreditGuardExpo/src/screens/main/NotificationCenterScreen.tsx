import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {NotificationCard} from '../../components/notifications/NotificationCard';
import {EmptyState} from '../../components/common/EmptyState';
import {mockNotifications} from '../../data/notificationMockData';
import {CreditNotification, NotificationCategory} from '../../types/notification';
import type {Theme} from '../../constants/Themes';
import {MainStackParamList} from '../../navigation/types';

type FilterType = 'all' | NotificationCategory;
type NotificationCenterScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  'NotificationCenter'
>;

export const NotificationCenterScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<NotificationCenterScreenNavigationProp>();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications =
    activeFilter === 'all' ? notifications : notifications.filter(n => n.category === activeFilter);

  const handleNotificationPress = (notification: CreditNotification) => {
    // Mark as read
    setNotifications(prev => prev.map(n => (n.id === notification.id ? {...n, read: true} : n)));

    // Navigate to relevant screen if actionUrl exists
    if (notification.actionUrl) {
      // In production, handle deep linking here
    }
  };

  const handleNotificationAction = (notification: CreditNotification) => {
    // Handle action button press
    handleNotificationPress(notification);
  };

  const handleDismiss = (notification: CreditNotification) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notification.id ? {...n, dismissed: true} : n)),
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({...n, read: true})));
  };

  const handleClearDismissed = () => {
    setNotifications(prev => prev.filter(n => !n.dismissed));
  };

  const renderFilterButton = (
    filter: FilterType,
    label: string,
    icon: keyof typeof Ionicons.glyphMap,
  ) => {
    const isActive = activeFilter === filter;
    const count =
      filter === 'all'
        ? notifications.length
        : notifications.filter(n => n.category === filter).length;

    return (
      <TouchableOpacity
        key={filter}
        style={[styles(theme).filterButton, isActive && styles(theme).filterButtonActive]}
        onPress={() => setActiveFilter(filter)}>
        <Ionicons
          name={icon}
          size={18}
          color={isActive ? theme.colors.primary : theme.colors.text.secondary}
        />
        <Text
          style={[
            styles(theme).filterButtonText,
            isActive && styles(theme).filterButtonTextActive,
          ]}>
          {label} ({count})
        </Text>
      </TouchableOpacity>
    );
  };

  const dismissedNotifications = filteredNotifications.filter(n => n.dismissed);
  const activeNotifications = filteredNotifications.filter(n => !n.dismissed);

  return (
    <SafeAreaView style={styles(theme).container} edges={['top']}>
      {/* Header */}
      <View style={styles(theme).header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>

        <View style={styles(theme).headerTitleContainer}>
          <Text style={styles(theme).headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles(theme).unreadCountBadge}>
              <Text style={styles(theme).unreadCountText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={() => {
            // Navigate to Settings stack for notification preferences
            // Note: This would require CompositeNavigationProp for nested navigation
            // For now, we'll use goBack() and let user navigate via Settings
            navigation.goBack();
          }}>
          <Ionicons name="settings-outline" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Filter Bar */}
      <View style={styles(theme).filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles(theme).filterScrollContent}>
          {renderFilterButton('all', 'All', 'list')}
          {renderFilterButton('credit_alert', 'Credit Alerts', 'alert-circle')}
          {renderFilterButton('system', 'System', 'notifications')}
          {renderFilterButton('smart_action', 'Smart Actions', 'bulb')}
        </ScrollView>
      </View>

      {/* Quick Actions */}
      {unreadCount > 0 && (
        <View style={styles(theme).quickActions}>
          <TouchableOpacity style={styles(theme).quickActionButton} onPress={handleMarkAllRead}>
            <Ionicons name="checkmark-done" size={18} color={theme.colors.primary} />
            <Text style={styles(theme).quickActionText}>Mark all read</Text>
          </TouchableOpacity>

          {dismissedNotifications.length > 0 && (
            <TouchableOpacity
              style={styles(theme).quickActionButton}
              onPress={handleClearDismissed}>
              <Ionicons name="trash-outline" size={18} color={theme.colors.error} />
              <Text style={[styles(theme).quickActionText, {color: theme.colors.error}]}>
                Clear dismissed ({dismissedNotifications.length})
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Notifications List */}
      <ScrollView
        style={styles(theme).scrollView}
        contentContainerStyle={styles(theme).scrollContent}
        showsVerticalScrollIndicator={false}>
        {activeNotifications.length === 0 ? (
          <EmptyState
            icon="notifications-off-outline"
            title={
              activeFilter === 'all'
                ? 'No Notifications'
                : `No ${activeFilter.replace('_', ' ')} Notifications`
            }
            description={
              activeFilter === 'all'
                ? "You're all caught up! Check back later for new alerts and updates."
                : `You don't have any ${activeFilter.replace('_', ' ')} notifications at this time.`
            }
            decorativeIcon="checkmark-circle-outline"
          />
        ) : (
          <>
            {activeNotifications.map(notification => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onPress={handleNotificationPress}
                onAction={handleNotificationAction}
                onDismiss={handleDismiss}
              />
            ))}
          </>
        )}

        {/* Dismissed Section */}
        {dismissedNotifications.length > 0 && (
          <View style={styles(theme).dismissedSection}>
            <Text style={styles(theme).dismissedSectionTitle}>Dismissed</Text>
            {dismissedNotifications.map(notification => (
              <View key={notification.id} style={styles(theme).dismissedItem}>
                <NotificationCard notification={notification} onPress={handleNotificationPress} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    headerTitle: {
      ...theme.textStyles.headline2,
      fontWeight: '700',
      color: theme.colors.text.primary,
    },
    unreadCountBadge: {
      backgroundColor: theme.colors.error,
      borderRadius: 12,
      minWidth: 24,
      height: 24,
      paddingHorizontal: 6,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: theme.spacing.sm,
    },
    unreadCountText: {
      color: theme.colors.surface,
      fontSize: 12,
      fontWeight: '700',
    },
    filterBar: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    filterScrollContent: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      gap: theme.spacing.sm,
    },
    filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    filterButtonActive: {
      backgroundColor: theme.colors.primary + '15',
      borderColor: theme.colors.primary,
    },
    filterButtonText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
      marginLeft: theme.spacing.xs,
      fontWeight: '500',
    },
    filterButtonTextActive: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
    quickActions: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      gap: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    quickActionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    quickActionText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.primary,
      fontWeight: '600',
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: theme.spacing.lg,
    },
    dismissedSection: {
      marginTop: theme.spacing.xl,
      paddingTop: theme.spacing.lg,
      borderTopWidth: 2,
      borderTopColor: theme.colors.border,
    },
    dismissedSectionTitle: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '600',
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.md,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    dismissedItem: {
      opacity: 0.6,
    },
  });
