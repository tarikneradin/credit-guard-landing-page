import {SubscriptionTier} from '../types/subscription';

/**
 * Feature Categories for CreditGuard App
 * Based on actual implemented features
 */
export enum FeatureCategory {
  SCORE = 'score',
  REPORT = 'report',
  AI_TOOLS = 'ai_tools',
  OFFERS = 'offers',
  ALERTS = 'alerts',
  GAMIFICATION = 'gamification',
  SUPPORT = 'support',
}

/**
 * Individual Features within the app
 */
export enum Feature {
  // Score Features
  SCORE_MONITORING = 'score_monitoring',
  SCORE_TREND = 'score_trend',
  SCORE_IMPROVEMENTS_PLAN = 'score_improvements_plan',
  SCORE_ACHIEVEMENTS = 'score_achievements',
  SCORE_HISTORY = 'score_history',
  SCORE_FACTORS = 'score_factors',

  // Report Features
  REPORT_SUMMARY = 'report_summary',
  REPORT_ACCOUNTS = 'report_accounts',
  REPORT_INQUIRIES = 'report_inquiries',
  REPORT_RECORDS = 'report_records',
  REPORT_PERSONAL_INFO = 'report_personal_info',
  REPORT_EXPORT = 'report_export',
  REPORT_DISPUTES = 'report_disputes',

  // AI Tools
  AI_SMART_ACTIONS = 'ai_smart_actions',
  AI_OPTIMAL_PATH = 'ai_optimal_path',
  AI_ASSISTANT = 'ai_assistant',
  AI_SCORE_PREDICTOR = 'ai_score_predictor',
  AI_SPENDING_ANALYZER = 'ai_spending_analyzer',

  // Offers
  OFFERS_CREDIT_CARDS = 'offers_credit_cards',
  OFFERS_LOANS = 'offers_loans',
  OFFERS_MORTGAGES = 'offers_mortgages',
  OFFERS_PERSONALIZED = 'offers_personalized',

  // Alerts
  ALERTS_SCORE_CHANGES = 'alerts_score_changes',
  ALERTS_NEW_ACCOUNTS = 'alerts_new_accounts',
  ALERTS_INQUIRIES = 'alerts_inquiries',
  ALERTS_PAYMENT_DUE = 'alerts_payment_due',
  ALERTS_REALTIME = 'alerts_realtime',
  ALERTS_CUSTOM = 'alerts_custom',

  // Gamification
  GAMIFICATION_BADGES = 'gamification_badges',
  GAMIFICATION_STREAKS = 'gamification_streaks',
  GAMIFICATION_LEVELS = 'gamification_levels',
  GAMIFICATION_GOALS = 'gamification_goals',

  // Support
  SUPPORT_EMAIL = 'support_email',
  SUPPORT_PHONE = 'support_phone',
  SUPPORT_PRIORITY = 'support_priority',
  SUPPORT_IDENTITY_THEFT = 'support_identity_theft',
}

/**
 * Feature metadata and descriptions
 */
export interface FeatureMetadata {
  id: Feature;
  name: string;
  description: string;
  category: FeatureCategory;
  icon: string;
  requiredTier: SubscriptionTier;
  isNew?: boolean;
  comingSoon?: boolean;
}

/**
 * Complete feature catalog
 */
export const FEATURE_CATALOG: Record<Feature, FeatureMetadata> = {
  // Score Features
  [Feature.SCORE_MONITORING]: {
    id: Feature.SCORE_MONITORING,
    name: 'Credit Score Monitoring',
    description: 'Track your credit score in real-time',
    category: FeatureCategory.SCORE,
    icon: 'speedometer',
    requiredTier: 'free',
  },
  [Feature.SCORE_TREND]: {
    id: Feature.SCORE_TREND,
    name: 'Score Trend Analysis',
    description: '30-day score history and trend graphs',
    category: FeatureCategory.SCORE,
    icon: 'trending-up',
    requiredTier: 'free',
  },
  [Feature.SCORE_IMPROVEMENTS_PLAN]: {
    id: Feature.SCORE_IMPROVEMENTS_PLAN,
    name: 'Improvements Plan',
    description: 'Personalized plan to improve your score',
    category: FeatureCategory.SCORE,
    icon: 'clipboard',
    requiredTier: 'plus',
  },
  [Feature.SCORE_ACHIEVEMENTS]: {
    id: Feature.SCORE_ACHIEVEMENTS,
    name: 'Score Achievements',
    description: 'Earn badges for reaching score milestones',
    category: FeatureCategory.SCORE,
    icon: 'trophy',
    requiredTier: 'free',
  },
  [Feature.SCORE_HISTORY]: {
    id: Feature.SCORE_HISTORY,
    name: 'Extended Score History',
    description: 'View up to 24 months of score history',
    category: FeatureCategory.SCORE,
    icon: 'calendar',
    requiredTier: 'premium',
  },
  [Feature.SCORE_FACTORS]: {
    id: Feature.SCORE_FACTORS,
    name: 'Score Factors Analysis',
    description: 'Understand what impacts your score',
    category: FeatureCategory.SCORE,
    icon: 'analytics',
    requiredTier: 'free',
  },

  // Report Features
  [Feature.REPORT_SUMMARY]: {
    id: Feature.REPORT_SUMMARY,
    name: 'Report Summary',
    description: 'Overview of your credit report',
    category: FeatureCategory.REPORT,
    icon: 'document-text',
    requiredTier: 'free',
  },
  [Feature.REPORT_ACCOUNTS]: {
    id: Feature.REPORT_ACCOUNTS,
    name: 'Accounts Detail',
    description: 'Detailed view of all credit accounts',
    category: FeatureCategory.REPORT,
    icon: 'wallet',
    requiredTier: 'free',
  },
  [Feature.REPORT_INQUIRIES]: {
    id: Feature.REPORT_INQUIRIES,
    name: 'Credit Inquiries',
    description: 'View all hard and soft inquiries',
    category: FeatureCategory.REPORT,
    icon: 'search',
    requiredTier: 'free',
  },
  [Feature.REPORT_RECORDS]: {
    id: Feature.REPORT_RECORDS,
    name: 'Public Records',
    description: 'View bankruptcies, liens, and judgments',
    category: FeatureCategory.REPORT,
    icon: 'newspaper',
    requiredTier: 'free',
  },
  [Feature.REPORT_PERSONAL_INFO]: {
    id: Feature.REPORT_PERSONAL_INFO,
    name: 'Personal Information',
    description: 'Review personal info on your credit file',
    category: FeatureCategory.REPORT,
    icon: 'person',
    requiredTier: 'free',
  },
  [Feature.REPORT_EXPORT]: {
    id: Feature.REPORT_EXPORT,
    name: 'Export Reports',
    description: 'Download reports as PDF',
    category: FeatureCategory.REPORT,
    icon: 'download',
    requiredTier: 'premium',
  },
  [Feature.REPORT_DISPUTES]: {
    id: Feature.REPORT_DISPUTES,
    name: 'Credit Disputes',
    description: 'File disputes for inaccurate information',
    category: FeatureCategory.REPORT,
    icon: 'shield-checkmark',
    requiredTier: 'plus',
  },

  // AI Tools
  [Feature.AI_SMART_ACTIONS]: {
    id: Feature.AI_SMART_ACTIONS,
    name: 'Smart Actions',
    description: 'AI-powered recommendations to improve credit',
    category: FeatureCategory.AI_TOOLS,
    icon: 'bulb',
    requiredTier: 'plus',
  },
  [Feature.AI_OPTIMAL_PATH]: {
    id: Feature.AI_OPTIMAL_PATH,
    name: 'Optimal Path',
    description: 'Step-by-step path to reach your credit goals',
    category: FeatureCategory.AI_TOOLS,
    icon: 'compass',
    requiredTier: 'plus',
  },
  [Feature.AI_ASSISTANT]: {
    id: Feature.AI_ASSISTANT,
    name: 'AI Assistant',
    description: 'Chat with AI for credit advice',
    category: FeatureCategory.AI_TOOLS,
    icon: 'chatbubbles',
    requiredTier: 'plus',
  },
  [Feature.AI_SCORE_PREDICTOR]: {
    id: Feature.AI_SCORE_PREDICTOR,
    name: 'AI Score Predictor',
    description: 'Predict future score with what-if scenarios',
    category: FeatureCategory.AI_TOOLS,
    icon: 'telescope',
    requiredTier: 'premium',
  },
  [Feature.AI_SPENDING_ANALYZER]: {
    id: Feature.AI_SPENDING_ANALYZER,
    name: 'AI Spending Analyzer',
    description: 'Analyze spending patterns and suggestions',
    category: FeatureCategory.AI_TOOLS,
    icon: 'pie-chart',
    requiredTier: 'premium',
  },

  // Offers
  [Feature.OFFERS_CREDIT_CARDS]: {
    id: Feature.OFFERS_CREDIT_CARDS,
    name: 'Credit Card Offers',
    description: 'Personalized credit card recommendations',
    category: FeatureCategory.OFFERS,
    icon: 'card',
    requiredTier: 'free',
  },
  [Feature.OFFERS_LOANS]: {
    id: Feature.OFFERS_LOANS,
    name: 'Loan Offers',
    description: 'Personal and auto loan offers',
    category: FeatureCategory.OFFERS,
    icon: 'cash',
    requiredTier: 'free',
  },
  [Feature.OFFERS_MORTGAGES]: {
    id: Feature.OFFERS_MORTGAGES,
    name: 'Mortgage Offers',
    description: 'Home loan and refinance offers',
    category: FeatureCategory.OFFERS,
    icon: 'home',
    requiredTier: 'plus',
  },
  [Feature.OFFERS_PERSONALIZED]: {
    id: Feature.OFFERS_PERSONALIZED,
    name: 'Personalized Offers',
    description: 'AI-matched offers based on your profile',
    category: FeatureCategory.OFFERS,
    icon: 'sparkles',
    requiredTier: 'plus',
  },

  // Alerts
  [Feature.ALERTS_SCORE_CHANGES]: {
    id: Feature.ALERTS_SCORE_CHANGES,
    name: 'Score Change Alerts',
    description: 'Get notified when your score changes',
    category: FeatureCategory.ALERTS,
    icon: 'notifications',
    requiredTier: 'free',
  },
  [Feature.ALERTS_NEW_ACCOUNTS]: {
    id: Feature.ALERTS_NEW_ACCOUNTS,
    name: 'New Account Alerts',
    description: 'Detect when new accounts are opened',
    category: FeatureCategory.ALERTS,
    icon: 'alert-circle',
    requiredTier: 'free',
  },
  [Feature.ALERTS_INQUIRIES]: {
    id: Feature.ALERTS_INQUIRIES,
    name: 'Inquiry Alerts',
    description: 'Get notified of credit inquiries',
    category: FeatureCategory.ALERTS,
    icon: 'eye',
    requiredTier: 'plus',
  },
  [Feature.ALERTS_PAYMENT_DUE]: {
    id: Feature.ALERTS_PAYMENT_DUE,
    name: 'Payment Due Alerts',
    description: 'Reminders for upcoming payments',
    category: FeatureCategory.ALERTS,
    icon: 'time',
    requiredTier: 'plus',
  },
  [Feature.ALERTS_REALTIME]: {
    id: Feature.ALERTS_REALTIME,
    name: 'Real-time Alerts',
    description: 'Instant notifications for all changes',
    category: FeatureCategory.ALERTS,
    icon: 'flash',
    requiredTier: 'premium',
  },
  [Feature.ALERTS_CUSTOM]: {
    id: Feature.ALERTS_CUSTOM,
    name: 'Custom Alerts',
    description: 'Create custom alert rules',
    category: FeatureCategory.ALERTS,
    icon: 'construct',
    requiredTier: 'premium',
  },

  // Gamification
  [Feature.GAMIFICATION_BADGES]: {
    id: Feature.GAMIFICATION_BADGES,
    name: 'Achievement Badges',
    description: 'Earn badges for completing goals',
    category: FeatureCategory.GAMIFICATION,
    icon: 'medal',
    requiredTier: 'free',
  },
  [Feature.GAMIFICATION_STREAKS]: {
    id: Feature.GAMIFICATION_STREAKS,
    name: 'Streaks',
    description: 'Build streaks for consistent actions',
    category: FeatureCategory.GAMIFICATION,
    icon: 'flame',
    requiredTier: 'free',
  },
  [Feature.GAMIFICATION_LEVELS]: {
    id: Feature.GAMIFICATION_LEVELS,
    name: 'User Levels',
    description: 'Level up by earning points',
    category: FeatureCategory.GAMIFICATION,
    icon: 'ribbon',
    requiredTier: 'free',
  },
  [Feature.GAMIFICATION_GOALS]: {
    id: Feature.GAMIFICATION_GOALS,
    name: 'Custom Goals',
    description: 'Set and track personal credit goals',
    category: FeatureCategory.GAMIFICATION,
    icon: 'flag',
    requiredTier: 'plus',
  },

  // Support
  [Feature.SUPPORT_EMAIL]: {
    id: Feature.SUPPORT_EMAIL,
    name: 'Email Support',
    description: 'Email support within 24 hours',
    category: FeatureCategory.SUPPORT,
    icon: 'mail',
    requiredTier: 'free',
  },
  [Feature.SUPPORT_PHONE]: {
    id: Feature.SUPPORT_PHONE,
    name: 'Phone Support',
    description: 'Dedicated phone support line',
    category: FeatureCategory.SUPPORT,
    icon: 'call',
    requiredTier: 'premium',
  },
  [Feature.SUPPORT_PRIORITY]: {
    id: Feature.SUPPORT_PRIORITY,
    name: 'Priority Support',
    description: 'Priority response from support team',
    category: FeatureCategory.SUPPORT,
    icon: 'star',
    requiredTier: 'premium',
  },
  [Feature.SUPPORT_IDENTITY_THEFT]: {
    id: Feature.SUPPORT_IDENTITY_THEFT,
    name: '$1M Identity Theft Insurance',
    description: 'Full identity theft protection and restoration',
    category: FeatureCategory.SUPPORT,
    icon: 'shield',
    requiredTier: 'premium',
  },
};

/**
 * Features available per subscription tier
 */
export const TIER_FEATURES: Record<SubscriptionTier, Feature[]> = {
  free: [
    // Score
    Feature.SCORE_MONITORING,
    Feature.SCORE_TREND,
    Feature.SCORE_ACHIEVEMENTS,
    Feature.SCORE_FACTORS,

    // Report (limited)
    Feature.REPORT_SUMMARY,
    Feature.REPORT_ACCOUNTS,
    Feature.REPORT_INQUIRIES,
    Feature.REPORT_RECORDS,
    Feature.REPORT_PERSONAL_INFO,

    // Offers (basic)
    Feature.OFFERS_CREDIT_CARDS,
    Feature.OFFERS_LOANS,

    // Alerts (basic)
    Feature.ALERTS_SCORE_CHANGES,
    Feature.ALERTS_NEW_ACCOUNTS,

    // Gamification
    Feature.GAMIFICATION_BADGES,
    Feature.GAMIFICATION_STREAKS,
    Feature.GAMIFICATION_LEVELS,

    // Support (basic)
    Feature.SUPPORT_EMAIL,
  ],

  plus: [
    // All Free features
    ...[] as Feature[], // Will be filled by spread

    // Additional Score features
    Feature.SCORE_IMPROVEMENTS_PLAN,

    // AI Tools (core)
    Feature.AI_SMART_ACTIONS,
    Feature.AI_OPTIMAL_PATH,
    Feature.AI_ASSISTANT,

    // Report (full access)
    Feature.REPORT_DISPUTES,

    // Offers (enhanced)
    Feature.OFFERS_MORTGAGES,
    Feature.OFFERS_PERSONALIZED,

    // Alerts (enhanced)
    Feature.ALERTS_INQUIRIES,
    Feature.ALERTS_PAYMENT_DUE,

    // Gamification (enhanced)
    Feature.GAMIFICATION_GOALS,
  ],

  premium: [
    // All Plus features
    ...[] as Feature[], // Will be filled by spread

    // Advanced Score features
    Feature.SCORE_HISTORY,

    // Advanced AI Tools
    Feature.AI_SCORE_PREDICTOR,
    Feature.AI_SPENDING_ANALYZER,

    // Advanced Report features
    Feature.REPORT_EXPORT,

    // Advanced Alerts
    Feature.ALERTS_REALTIME,
    Feature.ALERTS_CUSTOM,

    // Premium Support
    Feature.SUPPORT_PHONE,
    Feature.SUPPORT_PRIORITY,
    Feature.SUPPORT_IDENTITY_THEFT,
  ],
};

// Populate Plus tier with Free tier features
TIER_FEATURES.plus = [
  ...TIER_FEATURES.free,
  Feature.SCORE_IMPROVEMENTS_PLAN,
  Feature.AI_SMART_ACTIONS,
  Feature.AI_OPTIMAL_PATH,
  Feature.AI_ASSISTANT,
  Feature.REPORT_DISPUTES,
  Feature.OFFERS_MORTGAGES,
  Feature.OFFERS_PERSONALIZED,
  Feature.ALERTS_INQUIRIES,
  Feature.ALERTS_PAYMENT_DUE,
  Feature.GAMIFICATION_GOALS,
];

// Populate Premium tier with Plus tier features
TIER_FEATURES.premium = [
  ...TIER_FEATURES.plus,
  Feature.SCORE_HISTORY,
  Feature.AI_SCORE_PREDICTOR,
  Feature.AI_SPENDING_ANALYZER,
  Feature.REPORT_EXPORT,
  Feature.ALERTS_REALTIME,
  Feature.ALERTS_CUSTOM,
  Feature.SUPPORT_PHONE,
  Feature.SUPPORT_PRIORITY,
  Feature.SUPPORT_IDENTITY_THEFT,
];

/**
 * Check if a feature is available for a subscription tier
 */
export const hasFeatureAccess = (tier: SubscriptionTier, feature: Feature): boolean => {
  return TIER_FEATURES[tier].includes(feature);
};

/**
 * Get all features for a category
 */
export const getFeaturesByCategory = (category: FeatureCategory): FeatureMetadata[] => {
  return Object.values(FEATURE_CATALOG).filter(f => f.category === category);
};

/**
 * Get features available for a tier grouped by category
 */
export const getTierFeaturesByCategory = (
  tier: SubscriptionTier
): Record<FeatureCategory, FeatureMetadata[]> => {
  const tierFeatures = TIER_FEATURES[tier];
  const grouped: Record<FeatureCategory, FeatureMetadata[]> = {
    [FeatureCategory.SCORE]: [],
    [FeatureCategory.REPORT]: [],
    [FeatureCategory.AI_TOOLS]: [],
    [FeatureCategory.OFFERS]: [],
    [FeatureCategory.ALERTS]: [],
    [FeatureCategory.GAMIFICATION]: [],
    [FeatureCategory.SUPPORT]: [],
  };

  tierFeatures.forEach(featureId => {
    const feature = FEATURE_CATALOG[featureId];
    grouped[feature.category].push(feature);
  });

  return grouped;
};

/**
 * Get missing features when comparing tiers
 */
export const getMissingFeatures = (
  currentTier: SubscriptionTier,
  targetTier: SubscriptionTier
): FeatureMetadata[] => {
  const currentFeatures = TIER_FEATURES[currentTier];
  const targetFeatures = TIER_FEATURES[targetTier];

  const missingFeatureIds = targetFeatures.filter(f => !currentFeatures.includes(f));

  return missingFeatureIds.map(id => FEATURE_CATALOG[id]);
};
