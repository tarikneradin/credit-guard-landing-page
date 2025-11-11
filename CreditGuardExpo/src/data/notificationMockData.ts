/**
 * Notification Mock Data
 * Comprehensive mock notifications for all alert types
 */

import {
  CreditNotification,
  NotificationPreferences,
  AlertTypeMetadata,
  NotificationType,
} from '../types/notification';

/**
 * Mock notification history with all alert types
 */
export const mockNotifications: CreditNotification[] = [
  // CRITICAL: Late Payment Alert
  {
    id: 'notif_001',
    userId: 'user_123456',
    type: 'LatePaymentAlert',
    category: 'credit_alert',
    priority: 'critical',
    title: '30-Day Late Payment Detected',
    message: 'Chase Freedom Card shows a 30-day late payment',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    alertData: {
      alertCode: '90008553401',
      accountId: 'acc_001',
      accountName: 'Chase Freedom Card',
      oldValue: 'Current',
      newValue: '30 Days Past Due',
      changeDescription: 'Payment status changed from Current to 30 days past due',
      impactScore: -15,
    },
    deliveryStatus: {
      push: 'sent',
      email: 'sent',
      sms: 'sent',
      inApp: 'unread',
    },
    actionUrl: '/accounts/acc_001',
    actionLabel: 'View Account',
    read: false,
    dismissed: false,
  },

  // HIGH: Account Status Change Alert
  {
    id: 'notif_002',
    userId: 'user_123456',
    type: 'AccountStatusChangeAlert',
    category: 'credit_alert',
    priority: 'high',
    title: 'Account Status Changed',
    message: 'BANK-M Card account status updated',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    alertData: {
      alertCode: '80008553452',
      accountId: 'acc_003',
      accountName: 'BANK-M Card',
      oldValue: 'Past Due',
      newValue: 'Current',
      changeDescription: 'Account status improved from Past Due to Current',
      impactScore: 12,
    },
    deliveryStatus: {
      push: 'sent',
      email: 'sent',
      sms: 'not_sent',
      inApp: 'unread',
    },
    actionUrl: '/accounts/acc_003',
    actionLabel: 'View Account',
    read: false,
    dismissed: false,
  },

  // HIGH: Tradeline Alert
  {
    id: 'notif_003',
    userId: 'user_123456',
    type: 'TradeLineAlert',
    category: 'credit_alert',
    priority: 'high',
    title: 'New Credit Account Opened',
    message: 'Capital One Quicksilver Card added to your credit report',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    alertData: {
      alertCode: '40008544452',
      accountId: 'acc_005',
      accountName: 'Capital One Quicksilver Card',
      changeDescription: 'New tradeline opened on your credit report',
      impactScore: -3, // Small initial decrease from new account
    },
    deliveryStatus: {
      push: 'sent',
      email: 'sent',
      sms: 'not_sent',
      inApp: 'read',
    },
    actionUrl: '/accounts/acc_005',
    actionLabel: 'View New Account',
    read: true,
    dismissed: false,
  },

  // MEDIUM: Account Narrative Change Alert
  {
    id: 'notif_004',
    userId: 'user_123456',
    type: 'AccountNarrativeChangeAlert',
    category: 'credit_alert',
    priority: 'medium',
    title: 'Account Description Updated',
    message: 'BANK-M Card account narrative has been modified',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    alertData: {
      alertCode: '10600246472',
      accountId: 'acc_003',
      accountName: 'BANK-M Card',
      oldValue: 'Original narrative',
      newValue: 'Updated narrative with additional details',
      changeDescription: 'Account narrative updated by creditor',
      impactScore: 0,
    },
    deliveryStatus: {
      push: 'not_sent',
      email: 'sent',
      sms: 'not_sent',
      inApp: 'read',
    },
    actionUrl: '/accounts/acc_003',
    actionLabel: 'View Details',
    read: true,
    dismissed: false,
  },

  // MEDIUM: Account Activity Designator Change Alert
  {
    id: 'notif_005',
    userId: 'user_123456',
    type: 'AccountActivityDesignatorChangeAlert',
    category: 'credit_alert',
    priority: 'medium',
    title: 'Account Activity Status Changed',
    message: 'Student Loan account marked as Paid Off',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    alertData: {
      alertCode: '70108552402',
      accountId: 'acc_004',
      accountName: 'Federal Student Loan',
      oldValue: 'Active',
      newValue: 'Paid Off - Closed',
      changeDescription: 'Account successfully paid off and closed',
      impactScore: 5,
    },
    deliveryStatus: {
      push: 'sent',
      email: 'sent',
      sms: 'not_sent',
      inApp: 'read',
    },
    actionUrl: '/accounts/acc_004',
    actionLabel: 'View Account',
    read: true,
    dismissed: false,
  },

  // HIGH: Score Change Alert
  {
    id: 'notif_006',
    userId: 'user_123456',
    type: 'ScoreChangeAlert',
    category: 'credit_alert',
    priority: 'high',
    title: 'Credit Score Increased',
    message: 'Your credit score went up by 12 points to 742',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    alertData: {
      changeDescription: 'Credit score increased due to improved payment history',
      oldValue: 730,
      newValue: 742,
      impactScore: 12,
    },
    deliveryStatus: {
      push: 'sent',
      email: 'sent',
      sms: 'not_sent',
      inApp: 'read',
    },
    actionUrl: '/dashboard',
    actionLabel: 'View Score Details',
    read: true,
    dismissed: false,
  },

  // HIGH: New Inquiry Alert
  {
    id: 'notif_007',
    userId: 'user_123456',
    type: 'NewInquiryAlert',
    category: 'credit_alert',
    priority: 'high',
    title: 'New Credit Inquiry Detected',
    message: 'Hard inquiry from Capital One on your credit report',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    alertData: {
      changeDescription: 'New hard inquiry added to credit report',
      accountName: 'Capital One',
      impactScore: -2,
    },
    deliveryStatus: {
      push: 'sent',
      email: 'sent',
      sms: 'not_sent',
      inApp: 'read',
    },
    actionUrl: '/report/inquiries',
    actionLabel: 'View Inquiries',
    read: true,
    dismissed: false,
  },

  // MEDIUM: Balance Change Alert
  {
    id: 'notif_008',
    userId: 'user_123456',
    type: 'BalanceChangeAlert',
    category: 'credit_alert',
    priority: 'medium',
    title: 'Significant Balance Change',
    message: 'Chase Freedom Card balance increased by $850',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    alertData: {
      accountId: 'acc_001',
      accountName: 'Chase Freedom Card',
      oldValue: '$400',
      newValue: '$1,250',
      changeDescription: 'Balance increased significantly',
      impactScore: 0,
    },
    deliveryStatus: {
      push: 'not_sent',
      email: 'sent',
      sms: 'not_sent',
      inApp: 'read',
    },
    actionUrl: '/accounts/acc_001',
    actionLabel: 'View Account',
    read: true,
    dismissed: false,
  },

  // MEDIUM: Utilization Change Alert
  {
    id: 'notif_009',
    userId: 'user_123456',
    type: 'UtilizationChangeAlert',
    category: 'credit_alert',
    priority: 'medium',
    title: 'Credit Utilization Increased',
    message: 'Overall utilization rose from 18% to 25%',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    alertData: {
      oldValue: '18%',
      newValue: '25%',
      changeDescription: 'Credit card utilization increased',
      impactScore: -3,
    },
    deliveryStatus: {
      push: 'sent',
      email: 'sent',
      sms: 'not_sent',
      inApp: 'read',
    },
    actionUrl: '/report/utilization',
    actionLabel: 'View Utilization',
    read: true,
    dismissed: false,
  },

  // CRITICAL: Collection Alert
  {
    id: 'notif_010',
    userId: 'user_123456',
    type: 'CollectionAlert',
    category: 'credit_alert',
    priority: 'critical',
    title: 'Collection Account Added',
    message: 'New collection account detected on your credit report',
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    alertData: {
      accountName: 'ABC Collections',
      changeDescription: 'Collection account for medical bill',
      impactScore: -45,
      oldValue: 'None',
      newValue: '$1,200 Collection',
    },
    deliveryStatus: {
      push: 'sent',
      email: 'sent',
      sms: 'sent',
      inApp: 'read',
    },
    actionUrl: '/report/collections',
    actionLabel: 'Dispute Collection',
    read: true,
    dismissed: false,
  },

  // LOW: Credit Score Refresh Notification
  {
    id: 'notif_011',
    userId: 'user_123456',
    type: 'CreditScoreRefreshNotification',
    category: 'system',
    priority: 'low',
    title: 'Credit Score Updated',
    message: 'Your latest credit score is now available',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    alertData: {
      changeDescription: 'Monthly credit score refresh completed',
    },
    deliveryStatus: {
      push: 'sent',
      email: 'not_sent',
      sms: 'not_sent',
      inApp: 'read',
    },
    actionUrl: '/dashboard',
    actionLabel: 'View Score',
    read: true,
    dismissed: false,
  },

  // MEDIUM: Optimal Path Progress Notification
  {
    id: 'notif_012',
    userId: 'user_123456',
    type: 'OptimalPathProgressNotification',
    category: 'smart_action',
    priority: 'medium',
    title: 'Score Goal Progress Update',
    message: 'You\'re 50% of the way to your 686 target score!',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    alertData: {
      changeDescription: 'Completed 1 of 3 recommended actions',
      oldValue: '0% complete',
      newValue: '50% complete',
    },
    deliveryStatus: {
      push: 'sent',
      email: 'not_sent',
      sms: 'not_sent',
      inApp: 'unread',
    },
    actionUrl: '/smart-actions/optimal-path',
    actionLabel: 'View Progress',
    read: false,
    dismissed: false,
  },

  // HIGH: Goal Achieved Notification
  {
    id: 'notif_013',
    userId: 'user_123456',
    type: 'GoalAchievedNotification',
    category: 'smart_action',
    priority: 'high',
    title: 'Congratulations! Goal Achieved',
    message: 'You reached your target score of 750!',
    timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    alertData: {
      changeDescription: 'Target credit score achieved ahead of schedule',
      targetValue: 750,
      achievedValue: 752,
    },
    deliveryStatus: {
      push: 'sent',
      email: 'sent',
      sms: 'not_sent',
      inApp: 'read',
    },
    actionUrl: '/smart-actions/optimal-path',
    actionLabel: 'Celebrate',
    read: true,
    dismissed: true,
  },
];

/**
 * Default notification preferences
 */
export const mockNotificationPreferences: NotificationPreferences = {
  userId: 'user_123456',
  globalEnabled: true,
  quietHoursEnabled: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
  preferences: {
    // Critical alerts - all channels enabled
    LatePaymentAlert: {
      pushEnabled: true,
      emailEnabled: true,
      smsEnabled: true,
      inAppEnabled: true,
      frequency: 'immediate',
    },
    CollectionAlert: {
      pushEnabled: true,
      emailEnabled: true,
      smsEnabled: true,
      inAppEnabled: true,
      frequency: 'immediate',
    },
    PublicRecordAlert: {
      pushEnabled: true,
      emailEnabled: true,
      smsEnabled: true,
      inAppEnabled: true,
      frequency: 'immediate',
    },

    // High priority alerts
    AccountStatusChangeAlert: {
      pushEnabled: true,
      emailEnabled: true,
      smsEnabled: false,
      inAppEnabled: true,
      frequency: 'immediate',
    },
    TradeLineAlert: {
      pushEnabled: true,
      emailEnabled: true,
      smsEnabled: false,
      inAppEnabled: true,
      frequency: 'immediate',
    },
    ScoreChangeAlert: {
      pushEnabled: true,
      emailEnabled: true,
      smsEnabled: false,
      inAppEnabled: true,
      frequency: 'immediate',
    },
    NewInquiryAlert: {
      pushEnabled: true,
      emailEnabled: true,
      smsEnabled: false,
      inAppEnabled: true,
      frequency: 'immediate',
    },

    // Medium priority alerts - daily digest
    AccountNarrativeChangeAlert: {
      pushEnabled: false,
      emailEnabled: true,
      smsEnabled: false,
      inAppEnabled: true,
      frequency: 'daily_digest',
    },
    AccountActivityDesignatorChangeAlert: {
      pushEnabled: true,
      emailEnabled: true,
      smsEnabled: false,
      inAppEnabled: true,
      frequency: 'immediate',
    },
    BalanceChangeAlert: {
      pushEnabled: false,
      emailEnabled: true,
      smsEnabled: false,
      inAppEnabled: true,
      frequency: 'daily_digest',
    },
    UtilizationChangeAlert: {
      pushEnabled: false,
      emailEnabled: true,
      smsEnabled: false,
      inAppEnabled: true,
      frequency: 'daily_digest',
    },

    // System notifications
    CreditScoreRefreshNotification: {
      pushEnabled: true,
      emailEnabled: false,
      smsEnabled: false,
      inAppEnabled: true,
      frequency: 'immediate',
    },
    CreditReportRefreshNotification: {
      pushEnabled: true,
      emailEnabled: false,
      smsEnabled: false,
      inAppEnabled: true,
      frequency: 'immediate',
    },

    // Smart action notifications
    OptimalPathProgressNotification: {
      pushEnabled: true,
      emailEnabled: false,
      smsEnabled: false,
      inAppEnabled: true,
      frequency: 'weekly_digest',
    },
    GoalAchievedNotification: {
      pushEnabled: true,
      emailEnabled: true,
      smsEnabled: false,
      inAppEnabled: true,
      frequency: 'immediate',
    },
  },
  updatedAt: new Date(),
};

/**
 * Alert type metadata for UI display
 */
export const alertTypeMetadata: Record<NotificationType, AlertTypeMetadata> = {
  // Credit Alerts
  AccountStatusChangeAlert: {
    type: 'AccountStatusChangeAlert',
    displayName: 'Account Status Change',
    description: 'Get notified when an account payment status changes',
    defaultPriority: 'high',
    defaultFrequency: 'immediate',
    category: 'credit_alert',
    icon: 'card-outline',
    color: '#FF9500',
  },
  TradeLineAlert: {
    type: 'TradeLineAlert',
    displayName: 'New Account/Tradeline',
    description: 'Alert when a new account is added to your credit report',
    defaultPriority: 'high',
    defaultFrequency: 'immediate',
    category: 'credit_alert',
    icon: 'add-circle-outline',
    color: '#007AFF',
  },
  AccountNarrativeChangeAlert: {
    type: 'AccountNarrativeChangeAlert',
    displayName: 'Account Description Change',
    description: 'Notify when account narratives are updated',
    defaultPriority: 'medium',
    defaultFrequency: 'daily_digest',
    category: 'credit_alert',
    icon: 'document-text-outline',
    color: '#5AC8FA',
  },
  AccountActivityDesignatorChangeAlert: {
    type: 'AccountActivityDesignatorChangeAlert',
    displayName: 'Account Activity Status',
    description: 'Changes in account activity status (closed, paid off, etc.)',
    defaultPriority: 'medium',
    defaultFrequency: 'immediate',
    category: 'credit_alert',
    icon: 'swap-horizontal-outline',
    color: '#34C759',
  },
  NewInquiryAlert: {
    type: 'NewInquiryAlert',
    displayName: 'Credit Inquiry',
    description: 'New hard inquiry detected on your credit report',
    defaultPriority: 'high',
    defaultFrequency: 'immediate',
    category: 'credit_alert',
    icon: 'search-outline',
    color: '#FF9500',
  },
  ScoreChangeAlert: {
    type: 'ScoreChangeAlert',
    displayName: 'Credit Score Change',
    description: 'Significant changes to your credit score (±5 points)',
    defaultPriority: 'high',
    defaultFrequency: 'immediate',
    category: 'credit_alert',
    icon: 'trending-up-outline',
    color: '#34C759',
  },
  BalanceChangeAlert: {
    type: 'BalanceChangeAlert',
    displayName: 'Balance Change',
    description: 'Large balance changes on revolving accounts',
    defaultPriority: 'medium',
    defaultFrequency: 'daily_digest',
    category: 'credit_alert',
    icon: 'wallet-outline',
    color: '#5AC8FA',
  },
  UtilizationChangeAlert: {
    type: 'UtilizationChangeAlert',
    displayName: 'Utilization Change',
    description: 'Credit utilization ratio changed significantly (±10%)',
    defaultPriority: 'medium',
    defaultFrequency: 'daily_digest',
    category: 'credit_alert',
    icon: 'pie-chart-outline',
    color: '#5856D6',
  },
  AccountOpenedAlert: {
    type: 'AccountOpenedAlert',
    displayName: 'New Account Opened',
    description: 'New credit account opened in your name',
    defaultPriority: 'high',
    defaultFrequency: 'immediate',
    category: 'credit_alert',
    icon: 'key-outline',
    color: '#007AFF',
  },
  AccountClosedAlert: {
    type: 'AccountClosedAlert',
    displayName: 'Account Closed',
    description: 'Credit account closed or paid off',
    defaultPriority: 'medium',
    defaultFrequency: 'immediate',
    category: 'credit_alert',
    icon: 'close-circle-outline',
    color: '#8E8E93',
  },
  LatePaymentAlert: {
    type: 'LatePaymentAlert',
    displayName: 'Late Payment',
    description: 'Late payment reported (30/60/90 days)',
    defaultPriority: 'critical',
    defaultFrequency: 'immediate',
    category: 'credit_alert',
    icon: 'alert-circle-outline',
    color: '#FF3B30',
  },
  CollectionAlert: {
    type: 'CollectionAlert',
    displayName: 'Collection Account',
    description: 'New collection account added to credit report',
    defaultPriority: 'critical',
    defaultFrequency: 'immediate',
    category: 'credit_alert',
    icon: 'warning-outline',
    color: '#FF3B30',
  },
  PublicRecordAlert: {
    type: 'PublicRecordAlert',
    displayName: 'Public Record',
    description: 'Public records (bankruptcy, lien, judgment)',
    defaultPriority: 'critical',
    defaultFrequency: 'immediate',
    category: 'credit_alert',
    icon: 'hammer-outline',
    color: '#FF3B30',
  },

  // System Notifications
  CreditScoreRefreshNotification: {
    type: 'CreditScoreRefreshNotification',
    displayName: 'Score Refresh Complete',
    description: 'Credit score refresh completed',
    defaultPriority: 'low',
    defaultFrequency: 'immediate',
    category: 'system',
    icon: 'refresh-outline',
    color: '#34C759',
  },
  CreditReportRefreshNotification: {
    type: 'CreditReportRefreshNotification',
    displayName: 'Report Refresh Complete',
    description: 'Full credit report refresh completed',
    defaultPriority: 'low',
    defaultFrequency: 'immediate',
    category: 'system',
    icon: 'document-outline',
    color: '#34C759',
  },
  MonitoringActiveNotification: {
    type: 'MonitoringActiveNotification',
    displayName: 'Monitoring Active',
    description: 'Credit monitoring is active and running',
    defaultPriority: 'low',
    defaultFrequency: 'daily_digest',
    category: 'system',
    icon: 'shield-checkmark-outline',
    color: '#34C759',
  },
  MonitoringErrorNotification: {
    type: 'MonitoringErrorNotification',
    displayName: 'Monitoring Error',
    description: 'Credit monitoring encountered an error',
    defaultPriority: 'high',
    defaultFrequency: 'immediate',
    category: 'system',
    icon: 'shield-outline',
    color: '#FF3B30',
  },
  DataSyncCompleteNotification: {
    type: 'DataSyncCompleteNotification',
    displayName: 'Data Sync Complete',
    description: 'All credit data synchronized',
    defaultPriority: 'low',
    defaultFrequency: 'immediate',
    category: 'system',
    icon: 'sync-outline',
    color: '#5AC8FA',
  },

  // Smart Action Notifications
  OptimalPathProgressNotification: {
    type: 'OptimalPathProgressNotification',
    displayName: 'Optimal Path Progress',
    description: 'Progress update on score improvement goal',
    defaultPriority: 'medium',
    defaultFrequency: 'weekly_digest',
    category: 'smart_action',
    icon: 'stats-chart-outline',
    color: '#5856D6',
  },
  SmartActionRecommendation: {
    type: 'SmartActionRecommendation',
    displayName: 'New Smart Action',
    description: 'New personalized action recommended',
    defaultPriority: 'medium',
    defaultFrequency: 'immediate',
    category: 'smart_action',
    icon: 'bulb-outline',
    color: '#FF9500',
  },
  ActionCompletionReminderNotification: {
    type: 'ActionCompletionReminderNotification',
    displayName: 'Action Reminder',
    description: 'Reminder to complete pending actions',
    defaultPriority: 'low',
    defaultFrequency: 'weekly_digest',
    category: 'smart_action',
    icon: 'checkmark-circle-outline',
    color: '#8E8E93',
  },
  GoalAchievedNotification: {
    type: 'GoalAchievedNotification',
    displayName: 'Goal Achieved',
    description: 'Target credit score achieved',
    defaultPriority: 'high',
    defaultFrequency: 'immediate',
    category: 'smart_action',
    icon: 'trophy-outline',
    color: '#FFD60A',
  },
};
