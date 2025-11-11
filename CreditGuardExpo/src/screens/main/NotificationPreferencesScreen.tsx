import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {
  mockNotificationPreferences,
  alertTypeMetadata,
} from '../../data/notificationMockData';
import {NotificationType, NotificationFrequency} from '../../types/notification';

export const NotificationPreferencesScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const [preferences, setPreferences] = useState(mockNotificationPreferences);

  const handleToggleGlobal = () => {
    setPreferences((prev) => ({...prev, globalEnabled: !prev.globalEnabled}));
  };

  const handleToggleQuietHours = () => {
    setPreferences((prev) => ({
      ...prev,
      quietHoursEnabled: !prev.quietHoursEnabled,
    }));
  };

  const handleToggleChannel = (
    alertType: NotificationType,
    channel: 'pushEnabled' | 'emailEnabled' | 'smsEnabled',
  ) => {
    setPreferences((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [alertType]: {
          ...prev.preferences[alertType]!,
          [channel]: !prev.preferences[alertType]![channel],
        },
      },
    }));
  };

  const handleFrequencyChange = (
    alertType: NotificationType,
    frequency: NotificationFrequency,
  ) => {
    setPreferences((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [alertType]: {
          ...prev.preferences[alertType]!,
          frequency,
        },
      },
    }));
  };

  const renderAlertTypeSection = (alertType: NotificationType) => {
    const metadata = alertTypeMetadata[alertType];
    const pref = preferences.preferences[alertType];

    if (!metadata || !pref) return null;

    return (
      <View key={alertType} style={styles(theme).alertTypeCard}>
        <View style={styles(theme).alertTypeHeader}>
          <View style={styles(theme).alertTypeIconContainer}>
            <Ionicons name={metadata.icon as any} size={24} color={metadata.color} />
          </View>
          <View style={styles(theme).alertTypeInfo}>
            <Text style={styles(theme).alertTypeName}>{metadata.displayName}</Text>
            <Text style={styles(theme).alertTypeDescription}>
              {metadata.description}
            </Text>
          </View>
        </View>

        {/* Channel Toggles */}
        <View style={styles(theme).channelsContainer}>
          <View style={styles(theme).channelRow}>
            <Ionicons name="phone-portrait" size={20} color={theme.colors.text.secondary} />
            <Text style={styles(theme).channelLabel}>Push Notifications</Text>
            <Switch
              value={pref.pushEnabled}
              onValueChange={() => handleToggleChannel(alertType, 'pushEnabled')}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary + '60',
              }}
              thumbColor={pref.pushEnabled ? theme.colors.primary : theme.colors.surface}
            />
          </View>

          <View style={styles(theme).channelRow}>
            <Ionicons name="mail" size={20} color={theme.colors.text.secondary} />
            <Text style={styles(theme).channelLabel}>Email</Text>
            <Switch
              value={pref.emailEnabled}
              onValueChange={() => handleToggleChannel(alertType, 'emailEnabled')}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary + '60',
              }}
              thumbColor={pref.emailEnabled ? theme.colors.primary : theme.colors.surface}
            />
          </View>

          <View style={styles(theme).channelRow}>
            <Ionicons name="chatbubble" size={20} color={theme.colors.text.secondary} />
            <Text style={styles(theme).channelLabel}>SMS (Premium)</Text>
            <Switch
              value={pref.smsEnabled}
              onValueChange={() => handleToggleChannel(alertType, 'smsEnabled')}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary + '60',
              }}
              thumbColor={pref.smsEnabled ? theme.colors.primary : theme.colors.surface}
            />
          </View>
        </View>

        {/* Frequency Selector */}
        <View style={styles(theme).frequencyContainer}>
          <Text style={styles(theme).frequencyLabel}>Delivery Frequency</Text>
          <View style={styles(theme).frequencyButtons}>
            {(['immediate', 'daily_digest', 'weekly_digest', 'disabled'] as const).map(
              (freq) => (
                <TouchableOpacity
                  key={freq}
                  style={[
                    styles(theme).frequencyButton,
                    pref.frequency === freq && styles(theme).frequencyButtonActive,
                  ]}
                  onPress={() => handleFrequencyChange(alertType, freq)}>
                  <Text
                    style={[
                      styles(theme).frequencyButtonText,
                      pref.frequency === freq &&
                        styles(theme).frequencyButtonTextActive,
                    ]}>
                    {freq.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </View>
        </View>
      </View>
    );
  };

  const criticalAlerts: NotificationType[] = [
    'LatePaymentAlert',
    'CollectionAlert',
    'PublicRecordAlert',
  ];

  const highPriorityAlerts: NotificationType[] = [
    'AccountStatusChangeAlert',
    'TradeLineAlert',
    'ScoreChangeAlert',
    'NewInquiryAlert',
  ];

  const mediumPriorityAlerts: NotificationType[] = [
    'AccountNarrativeChangeAlert',
    'AccountActivityDesignatorChangeAlert',
    'BalanceChangeAlert',
    'UtilizationChangeAlert',
  ];

  return (
    <SafeAreaView style={styles(theme).container} edges={['top']}>
      {/* Header */}
      <View style={styles(theme).header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles(theme).headerTitle}>Notification Settings</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView
        style={styles(theme).scrollView}
        contentContainerStyle={styles(theme).scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Global Settings */}
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>Global Settings</Text>

          <View style={styles(theme).settingCard}>
            <View style={styles(theme).settingRow}>
              <View style={styles(theme).settingInfo}>
                <Text style={styles(theme).settingLabel}>
                  Enable All Notifications
                </Text>
                <Text style={styles(theme).settingDescription}>
                  Master switch for all notification types
                </Text>
              </View>
              <Switch
                value={preferences.globalEnabled}
                onValueChange={handleToggleGlobal}
                trackColor={{false: theme.colors.border, true: theme.colors.primary + '60'}}
                thumbColor={
                  preferences.globalEnabled ? theme.colors.primary : theme.colors.surface
                }
              />
            </View>

            <View style={styles(theme).settingRow}>
              <View style={styles(theme).settingInfo}>
                <Text style={styles(theme).settingLabel}>Quiet Hours</Text>
                <Text style={styles(theme).settingDescription}>
                  {preferences.quietHoursStart} - {preferences.quietHoursEnd} (no
                  notifications)
                </Text>
              </View>
              <Switch
                value={preferences.quietHoursEnabled}
                onValueChange={handleToggleQuietHours}
                trackColor={{false: theme.colors.border, true: theme.colors.primary + '60'}}
                thumbColor={
                  preferences.quietHoursEnabled ? theme.colors.primary : theme.colors.surface
                }
              />
            </View>
          </View>
        </View>

        {/* Critical Alerts */}
        <View style={styles(theme).section}>
          <View style={styles(theme).sectionTitleRow}>
            <Text style={styles(theme).sectionTitle}>Critical Alerts</Text>
            <View style={[styles(theme).priorityBadge, {backgroundColor: '#FF3B3015'}]}>
              <Text style={[styles(theme).priorityBadgeText, {color: '#FF3B30'}]}>
                CRITICAL
              </Text>
            </View>
          </View>
          {criticalAlerts.map((alertType) => renderAlertTypeSection(alertType))}
        </View>

        {/* High Priority Alerts */}
        <View style={styles(theme).section}>
          <View style={styles(theme).sectionTitleRow}>
            <Text style={styles(theme).sectionTitle}>High Priority Alerts</Text>
            <View style={[styles(theme).priorityBadge, {backgroundColor: '#FF950015'}]}>
              <Text style={[styles(theme).priorityBadgeText, {color: '#FF9500'}]}>HIGH</Text>
            </View>
          </View>
          {highPriorityAlerts.map((alertType) => renderAlertTypeSection(alertType))}
        </View>

        {/* Medium Priority Alerts */}
        <View style={styles(theme).section}>
          <View style={styles(theme).sectionTitleRow}>
            <Text style={styles(theme).sectionTitle}>Medium Priority Alerts</Text>
            <View style={[styles(theme).priorityBadge, {backgroundColor: '#007AFF15'}]}>
              <Text style={[styles(theme).priorityBadgeText, {color: '#007AFF'}]}>
                MEDIUM
              </Text>
            </View>
          </View>
          {mediumPriorityAlerts.map((alertType) => renderAlertTypeSection(alertType))}
        </View>

        {/* System Notifications */}
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>System Notifications</Text>
          {renderAlertTypeSection('CreditScoreRefreshNotification')}
          {renderAlertTypeSection('CreditReportRefreshNotification')}
        </View>

        {/* Smart Action Notifications */}
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>Smart Actions</Text>
          {renderAlertTypeSection('OptimalPathProgressNotification')}
          {renderAlertTypeSection('GoalAchievedNotification')}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = (theme: any) =>
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
    headerTitle: {
      ...theme.textStyles.headline2,
      fontWeight: '700',
      color: theme.colors.text.primary,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: theme.spacing.lg,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    sectionTitle: {
      ...theme.textStyles.headline3,
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.md,
    },
    priorityBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      marginLeft: theme.spacing.sm,
    },
    priorityBadgeText: {
      fontSize: 11,
      fontWeight: '700',
    },
    settingCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: theme.spacing.md,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    settingInfo: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    settingLabel: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.xs,
    },
    settingDescription: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
    },
    alertTypeCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    alertTypeHeader: {
      flexDirection: 'row',
      marginBottom: theme.spacing.md,
    },
    alertTypeIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    alertTypeInfo: {
      flex: 1,
    },
    alertTypeName: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.xs,
    },
    alertTypeDescription: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
      lineHeight: 18,
    },
    channelsContainer: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingTop: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    channelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
    },
    channelLabel: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.primary,
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    frequencyContainer: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingTop: theme.spacing.md,
    },
    frequencyLabel: {
      ...theme.textStyles.bodyMedium,
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.sm,
    },
    frequencyButtons: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    frequencyButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: 8,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    frequencyButtonActive: {
      backgroundColor: theme.colors.primary + '15',
      borderColor: theme.colors.primary,
    },
    frequencyButtonText: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.text.secondary,
      fontWeight: '500',
      textTransform: 'capitalize',
    },
    frequencyButtonTextActive: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
  });
