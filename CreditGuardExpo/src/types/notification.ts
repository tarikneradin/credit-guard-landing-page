/**
 * Notification Type Definitions
 * Comprehensive notification system for CreditGuard
 */

export type NotificationCategory = 'credit_alert' | 'system' | 'smart_action';
export type NotificationPriority = 'critical' | 'high' | 'medium' | 'low';
export type ChannelDeliveryStatus = 'sent' | 'failed' | 'not_sent';
export type InAppStatus = 'read' | 'unread' | 'dismissed';
export type NotificationFrequency = 'immediate' | 'daily_digest' | 'weekly_digest' | 'disabled';

/**
 * Core alert types matching credit bureau monitoring
 */
export type CreditAlertType =
  | 'AccountStatusChangeAlert'
  | 'TradeLineAlert'
  | 'AccountNarrativeChangeAlert'
  | 'AccountActivityDesignatorChangeAlert'
  | 'NewInquiryAlert'
  | 'ScoreChangeAlert'
  | 'BalanceChangeAlert'
  | 'UtilizationChangeAlert'
  | 'AccountOpenedAlert'
  | 'AccountClosedAlert'
  | 'LatePaymentAlert'
  | 'CollectionAlert'
  | 'PublicRecordAlert';

/**
 * System notification types
 */
export type SystemNotificationType =
  | 'CreditScoreRefreshNotification'
  | 'CreditReportRefreshNotification'
  | 'MonitoringActiveNotification'
  | 'MonitoringErrorNotification'
  | 'DataSyncCompleteNotification';

/**
 * Smart action notification types
 */
export type SmartActionNotificationType =
  | 'OptimalPathProgressNotification'
  | 'SmartActionRecommendation'
  | 'ActionCompletionReminderNotification'
  | 'GoalAchievedNotification';

export type NotificationType =
  | CreditAlertType
  | SystemNotificationType
  | SmartActionNotificationType;

/**
 * Alert data structure containing change details
 */
export interface AlertData {
  alertCode?: string; // e.g., '80008553452'
  accountId?: string;
  accountName?: string;
  oldValue?: any;
  newValue?: any;
  changeDescription: string;
  impactScore?: number; // How much this impacts credit score (positive or negative)
  targetValue?: number; // For goal-related notifications
  achievedValue?: number; // For goal-related notifications
}

/**
 * Delivery status across all channels
 */
export interface DeliveryStatus {
  push: ChannelDeliveryStatus;
  email: ChannelDeliveryStatus;
  sms: ChannelDeliveryStatus;
  inApp: InAppStatus;
}

/**
 * Complete notification object
 */
export interface CreditNotification {
  id: string;
  userId: string;
  type: NotificationType;
  category: NotificationCategory;
  priority: NotificationPriority;

  // Content
  title: string;
  message: string;
  timestamp: Date;

  // Alert details
  alertData: AlertData;

  // Delivery tracking
  deliveryStatus: DeliveryStatus;

  // Actions
  actionUrl?: string; // Deep link to relevant screen
  actionLabel?: string; // "View Account", "Check Report", etc.

  // Metadata
  read: boolean;
  dismissed: boolean;
  expiresAt?: Date;
}

/**
 * Notification channel preferences
 */
export interface NotificationChannelPreference {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  inAppEnabled: boolean;
  frequency: NotificationFrequency;
}

/**
 * Complete notification preferences for a user
 */
export interface NotificationPreferences {
  userId: string;

  // Global settings
  globalEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // "22:00"
  quietHoursEnd: string;   // "08:00"

  // Per-alert-type preferences
  preferences: {
    [key in NotificationType]?: NotificationChannelPreference;
  };

  // Last updated
  updatedAt: Date;
}

/**
 * Notification settings update request
 */
export interface NotificationSettingsUpdate {
  alertType: NotificationType;
  preferences: Partial<NotificationChannelPreference>;
}

/**
 * Alert type metadata for UI display
 */
export interface AlertTypeMetadata {
  type: NotificationType;
  displayName: string;
  description: string;
  defaultPriority: NotificationPriority;
  defaultFrequency: NotificationFrequency;
  category: NotificationCategory;
  icon: string; // Ionicons name
  color: string;
}
