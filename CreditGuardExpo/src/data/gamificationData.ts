import {Badge, UserLevel, GamificationState, Goal, Streak} from '../types/gamification';

// Badge definitions
export const badges: Badge[] = [
  // Score Milestones
  {
    id: 'first_check',
    name: 'First Check',
    description: 'View your credit score for the first time',
    icon: 'eye',
    category: 'score',
    rarity: 'common',
    color: '#3B82F6',
    requirement: 'Check your credit score',
    points: 10,
  },
  {
    id: 'upward_trend',
    name: 'Upward Trend',
    description: 'Your score increased by 10+ points',
    icon: 'trending-up',
    category: 'score',
    rarity: 'common',
    color: '#10B981',
    requirement: 'Increase score by 10 points',
    points: 25,
  },
  {
    id: 'big_leap',
    name: 'Big Leap',
    description: 'Your score increased by 25+ points',
    icon: 'rocket',
    category: 'score',
    rarity: 'rare',
    color: '#F59E0B',
    requirement: 'Increase score by 25 points',
    points: 50,
  },
  {
    id: 'good_standing',
    name: 'Good Standing',
    description: 'Reached 670+ credit score',
    icon: 'thumbs-up',
    category: 'score',
    rarity: 'rare',
    color: '#10B981',
    requirement: 'Reach 670 credit score',
    points: 100,
  },
  {
    id: 'excellent_credit',
    name: 'Excellent Credit',
    description: 'Reached 740+ credit score',
    icon: 'star',
    category: 'score',
    rarity: 'epic',
    color: '#8B5CF6',
    requirement: 'Reach 740 credit score',
    points: 200,
  },
  {
    id: 'elite_status',
    name: 'Elite Status',
    description: 'Reached 800+ credit score',
    icon: 'trophy',
    category: 'score',
    rarity: 'legendary',
    color: '#F59E0B',
    requirement: 'Reach 800 credit score',
    points: 500,
  },

  // Action-Based
  {
    id: 'action_taker',
    name: 'Action Taker',
    description: 'Complete your first smart action',
    icon: 'checkmark-circle',
    category: 'action',
    rarity: 'common',
    color: '#3B82F6',
    requirement: 'Complete 1 smart action',
    points: 20,
  },
  {
    id: 'on_fire',
    name: 'On Fire',
    description: 'Complete 3 smart actions in a month',
    icon: 'flame',
    category: 'action',
    rarity: 'rare',
    color: '#F97316',
    requirement: 'Complete 3 actions in one month',
    points: 75,
  },
  {
    id: 'committed',
    name: 'Committed',
    description: 'Complete 10 smart actions total',
    icon: 'medal',
    category: 'action',
    rarity: 'epic',
    color: '#8B5CF6',
    requirement: 'Complete 10 total actions',
    points: 150,
  },
  {
    id: 'learner',
    name: 'Learner',
    description: 'Read 5 educational articles',
    icon: 'book',
    category: 'engagement',
    rarity: 'common',
    color: '#3B82F6',
    requirement: 'Read 5 articles',
    points: 30,
  },

  // Payment Behavior
  {
    id: 'perfect_month',
    name: 'Perfect Month',
    description: '100% on-time payments for a month',
    icon: 'calendar',
    category: 'payment',
    rarity: 'rare',
    color: '#10B981',
    requirement: 'All on-time payments for 1 month',
    points: 100,
  },
  {
    id: 'payment_master',
    name: 'Payment Master',
    description: '6 months of on-time payments',
    icon: 'ribbon',
    category: 'payment',
    rarity: 'epic',
    color: '#8B5CF6',
    requirement: '6 months of perfect payments',
    points: 300,
  },
  {
    id: 'debt_crusher',
    name: 'Debt Crusher',
    description: 'Pay down $1,000 in debt',
    icon: 'hammer',
    category: 'payment',
    rarity: 'rare',
    color: '#EF4444',
    requirement: 'Pay down $1,000 in debt',
    points: 150,
  },

  // Engagement
  {
    id: 'daily_checker',
    name: 'Daily Checker',
    description: 'Login for 7 days in a row',
    icon: 'time',
    category: 'engagement',
    rarity: 'common',
    color: '#3B82F6',
    requirement: '7-day login streak',
    points: 50,
  },
  {
    id: 'ai_friend',
    name: 'AI Friend',
    description: 'Have 10 AI chat conversations',
    icon: 'chatbubbles',
    category: 'engagement',
    rarity: 'common',
    color: '#8B5CF6',
    requirement: 'Chat with AI 10 times',
    points: 40,
  },

  // Milestones
  {
    id: 'debt_free',
    name: 'Debt Free',
    description: 'Pay off all your debt',
    icon: 'happy',
    category: 'milestone',
    rarity: 'legendary',
    color: '#10B981',
    requirement: 'Pay off all debt',
    points: 1000,
  },
];

// User level definitions
export const userLevels: UserLevel[] = [
  {
    level: 1,
    title: 'Credit Beginner',
    pointsRequired: 0,
    color: '#94A3B8',
    icon: 'leaf',
  },
  {
    level: 2,
    title: 'Credit Builder',
    pointsRequired: 500,
    color: '#3B82F6',
    icon: 'construct',
  },
  {
    level: 3,
    title: 'Credit Champion',
    pointsRequired: 1500,
    color: '#10B981',
    icon: 'shield',
  },
  {
    level: 4,
    title: 'Credit Master',
    pointsRequired: 3000,
    color: '#8B5CF6',
    icon: 'school',
  },
  {
    level: 5,
    title: 'Credit Elite',
    pointsRequired: 5000,
    color: '#F59E0B',
    icon: 'diamond',
  },
];

// Helper function to get badge by ID
export const getBadgeById = (badgeId: string): Badge | undefined => {
  return badges.find(badge => badge.id === badgeId);
};

// Helper function to get user's current level
export const getUserLevel = (points: number): UserLevel => {
  // Find the highest level the user has reached
  for (let i = userLevels.length - 1; i >= 0; i--) {
    if (points >= userLevels[i].pointsRequired) {
      return userLevels[i];
    }
  }
  return userLevels[0];
};

// Helper function to get next level
export const getNextLevel = (currentLevel: number): UserLevel | null => {
  if (currentLevel >= userLevels.length) {
    return null;
  }
  return userLevels[currentLevel];
};

// Helper function to calculate points to next level
export const getPointsToNextLevel = (currentPoints: number): number | null => {
  const currentLevel = getUserLevel(currentPoints);
  const nextLevel = getNextLevel(currentLevel.level);

  if (!nextLevel) {
    return null; // Max level reached
  }

  return nextLevel.pointsRequired - currentPoints;
};

// Mock gamification state for demo
export const mockGamificationState: GamificationState = {
  userId: 'user_123456',
  points: 385,
  level: 1,
  badges: [
    {
      badgeId: 'first_check',
      unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      isNew: false,
    },
    {
      badgeId: 'action_taker',
      unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      isNew: false,
    },
    {
      badgeId: 'upward_trend',
      unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      isNew: true,
    },
  ],
  streaks: [
    {
      type: 'login',
      count: 7,
      lastDate: new Date(),
      bestStreak: 12,
    },
    {
      type: 'payment',
      count: 3,
      lastDate: new Date(),
      bestStreak: 6,
    },
  ],
  goals: [
    {
      id: 'goal_1',
      type: 'score',
      title: 'Reach 750 Score',
      description: 'Improve your credit score to 750',
      target: 750,
      current: 742,
      unit: 'points',
      completed: false,
      reward: {
        points: 100,
        badge: 'excellent_credit',
      },
    },
    {
      id: 'goal_2',
      type: 'debt',
      title: 'Pay Down $5,000',
      description: 'Reduce your total debt by $5,000',
      target: 5000,
      current: 3200,
      unit: 'dollars',
      completed: false,
      reward: {
        points: 200,
      },
    },
    {
      id: 'goal_3',
      type: 'utilization',
      title: 'Under 30% Utilization',
      description: 'Keep credit utilization below 30%',
      target: 30,
      current: 32,
      unit: 'percent',
      completed: false,
      reward: {
        points: 75,
      },
    },
  ],
  totalActionsCompleted: 8,
  totalScoreIncrease: 15,
  totalDebtPaid: 3200,
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  updatedAt: new Date(),
};
