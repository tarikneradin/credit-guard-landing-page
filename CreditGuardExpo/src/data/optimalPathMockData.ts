/**
 * Optimal Path Mock Data
 * Score improvement goals and actionable recommendations
 */

import {
  OptimalPathGoal,
  OptimalPathAction,
  OptimalPathProgress,
  OptimalPathData,
} from '../types/optimalPath';

/**
 * Active goal matching user's UI sample:
 * Current: 674 → Target: 686 (12 point gap)
 */
export const mockOptimalPathGoal: OptimalPathGoal = {
  id: 'goal_001',
  userId: 'user_123456',
  currentScore: 674,
  targetScore: 686,
  scoreGap: 12,
  timeHorizon: 6, // 6 months
  achievabilityScore: 85, // 85% likelihood of success
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  expiresAt: new Date(Date.now() + 5 * 30 * 24 * 60 * 60 * 1000), // 5 months from now
  status: 'active',
};

/**
 * Recommended actions matching user's UI samples
 */
export const mockOptimalPathActions: OptimalPathAction[] = [
  // Action 1: Pay past due on BANK-M Card (HIGH PRIORITY - COMPLETED)
  {
    id: 'action_001',
    goalId: 'goal_001',
    title: 'Pay past due on BANK-M Card',
    description: 'This account has a $1339 past due balance. Paying it off is a key step.',
    detailedExplanation:
      'Your BANK-M Card is currently showing a past due balance of $1,339. This negative mark is significantly impacting your credit score. Bringing this account current will improve your payment history, which accounts for 35% of your credit score.',
    priority: 'high',
    category: 'payment',
    difficulty: 'medium',
    estimatedImpact: 6, // ~+6 pts
    estimatedTimeframe: '30 days',
    successRate: 90,
    completed: true,
    completedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    verifiedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    steps: [
      'Contact BANK-M customer service at 1-800-XXX-XXXX',
      'Request payment arrangement if needed',
      'Make payment of $1,339 to bring account current',
      'Request written confirmation that account is now current',
      'Allow 30-45 days for reporting to credit bureaus',
      'Verify account shows as "Current" on credit report',
    ],
    tags: ['High Priority', 'Payment History'],
    relatedAccounts: ['acc_003'],
    order: 1,
  },

  // Action 2: Lower utilization on BANK-M Card (UTILIZATION - IN PROGRESS)
  {
    id: 'action_002',
    goalId: 'goal_001',
    title: 'Lower utilization on BANK-M Card',
    description: 'Pay down balance to under 30% of your credit limit.',
    detailedExplanation:
      'Your BANK-M Card currently has a high utilization ratio. Credit utilization accounts for 30% of your credit score. Experts recommend keeping utilization under 30% on each card, and ideally under 10% for maximum score benefit.',
    priority: 'high',
    category: 'utilization',
    difficulty: 'medium',
    estimatedImpact: 4, // ~+4 pts
    estimatedTimeframe: '60 days',
    successRate: 75,
    completed: false,
    steps: [
      'Calculate 30% of your credit limit ($X,XXX)',
      'Create payment plan to pay down balance',
      'Make additional payment of $XXX to reach 30% utilization',
      'Set up automatic payments to maintain low balance',
      'Monitor utilization monthly',
    ],
    tags: ['Utilization', 'High Impact'],
    relatedAccounts: ['acc_003'],
    order: 2,
  },

  // Action 3: Keep up good payment habits (GOOD HABIT)
  {
    id: 'action_003',
    goalId: 'goal_001',
    title: 'Keep up good payment habits',
    description: 'Continue making on-time payments across all accounts.',
    detailedExplanation:
      'You\'re doing great with on-time payments! Consistency is key to building a strong credit history. Payment history is the single most important factor in your credit score (35%), so maintaining this habit will gradually improve your score over time.',
    priority: 'medium',
    category: 'habits',
    difficulty: 'easy',
    estimatedImpact: 2, // ~+2 pts
    estimatedTimeframe: '90 days',
    successRate: 95,
    completed: false,
    steps: [
      'Set up automatic minimum payments on all accounts',
      'Set calendar reminders 5 days before due dates',
      'Pay more than the minimum when possible',
      'Review statements monthly for accuracy',
      'Keep payment buffer in checking account',
    ],
    tags: ['Good Habit', 'Long Term'],
    relatedAccounts: ['acc_001', 'acc_002', 'acc_003'],
    order: 3,
  },

  // Action 4: Request credit limit increase on Chase Freedom
  {
    id: 'action_004',
    goalId: 'goal_001',
    title: 'Request credit limit increase on Chase Freedom',
    description: 'Increasing your credit limit will improve your overall utilization ratio.',
    detailedExplanation:
      'Your Chase Freedom Card has been in good standing. Requesting a credit limit increase (without a hard inquiry) can improve your overall utilization ratio, which accounts for 30% of your score. Lower utilization = higher score.',
    priority: 'medium',
    category: 'utilization',
    difficulty: 'easy',
    estimatedImpact: 3, // ~+3 pts
    estimatedTimeframe: '7 days',
    successRate: 80,
    completed: false,
    steps: [
      'Log into Chase account online',
      'Navigate to "Request Credit Limit Increase"',
      'Request increase (typically 10-20% of current limit)',
      'Confirm it\'s a soft pull (no hard inquiry)',
      'Wait 2-5 business days for approval',
      'Maintain same spending but with better utilization',
    ],
    tags: ['Easy Win', 'Utilization'],
    relatedAccounts: ['acc_001'],
    order: 4,
  },

  // Action 5: Dispute incorrect late payment on mortgage
  {
    id: 'action_005',
    goalId: 'goal_001',
    title: 'Dispute incorrect late payment on mortgage',
    description: 'Old late payment may be incorrectly reported - worth disputing.',
    detailedExplanation:
      'Review your mortgage payment history. If you believe a late payment was reported in error, you have the right to dispute it with the credit bureaus. Removing a late payment can significantly boost your score.',
    priority: 'low',
    category: 'disputes',
    difficulty: 'hard',
    estimatedImpact: 8, // ~+8 pts if successful
    estimatedTimeframe: '90 days',
    successRate: 40, // Lower success rate for disputes
    completed: false,
    steps: [
      'Review mortgage payment records for accuracy',
      'Gather documentation (bank statements, payment receipts)',
      'File dispute online with all 3 credit bureaus',
      'Wait for investigation (30-45 days)',
      'Follow up if additional information needed',
      'Verify removal on credit report if successful',
    ],
    tags: ['High Impact', 'Time Intensive'],
    relatedAccounts: ['acc_002'],
    order: 5,
  },
];

/**
 * Current progress on goal
 */
export const mockOptimalPathProgress: OptimalPathProgress = {
  goalId: 'goal_001',
  userId: 'user_123456',

  // Score tracking
  startScore: 674,
  currentScore: 680, // Already gained 6 points from completing Action 1
  targetScore: 686,
  pointsBuilt: 6, // From completed action
  totalPotentialPoints: 23, // Sum of all estimated impacts (6+4+2+3+8)

  // Completion tracking
  percentComplete: 43, // 1 of 3 high priority actions completed
  actionsCompleted: 1,
  totalActions: 5,

  // Time tracking
  daysElapsed: 30,
  daysRemaining: 150, // 5 months left
  estimatedCompletionDate: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000),

  // Status
  onTrack: true, // User is ahead of pace
  velocity: 12, // 6 points in 30 days = 12 points/month velocity

  lastUpdated: new Date(),
};

/**
 * Complete Optimal Path data for active goal
 */
export const mockOptimalPathData: OptimalPathData = {
  goal: mockOptimalPathGoal,
  actions: mockOptimalPathActions,
  progress: mockOptimalPathProgress,
};

/**
 * Alternative: New goal setup (no progress yet)
 */
export const mockOptimalPathNewGoal: OptimalPathData = {
  goal: {
    id: 'goal_002',
    userId: 'user_123456',
    currentScore: 742,
    targetScore: 780,
    scoreGap: 38,
    timeHorizon: 12, // 12 months for bigger goal
    achievabilityScore: 70,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000),
    status: 'active',
  },
  actions: [
    {
      id: 'action_101',
      goalId: 'goal_002',
      title: 'Pay off credit card debt completely',
      description: 'Eliminate all revolving debt to maximize score impact.',
      detailedExplanation:
        'Paying off all credit card debt will drop your utilization to 0%, which can have a dramatic positive impact on your credit score.',
      priority: 'high',
      category: 'utilization',
      difficulty: 'hard',
      estimatedImpact: 20,
      estimatedTimeframe: '6 months',
      successRate: 60,
      completed: false,
      steps: [
        'List all credit card debts with interest rates',
        'Create debt payoff plan (avalanche or snowball method)',
        'Allocate extra funds to highest interest card first',
        'Make all minimum payments on other cards',
        'Celebrate each card paid off',
        'Keep accounts open after paying off',
      ],
      tags: ['High Priority', 'Long Term'],
      relatedAccounts: ['acc_001', 'acc_003'],
      order: 1,
    },
    {
      id: 'action_102',
      goalId: 'goal_002',
      title: 'Become an authorized user on well-managed account',
      description: 'Add positive payment history from someone else\'s account.',
      detailedExplanation:
        'If a family member or friend has a credit card with a long, positive payment history and low utilization, being added as an authorized user can boost your score.',
      priority: 'medium',
      category: 'accounts',
      difficulty: 'easy',
      estimatedImpact: 15,
      estimatedTimeframe: '30 days',
      successRate: 85,
      completed: false,
      steps: [
        'Identify someone with excellent credit willing to add you',
        'Verify their account has 10+ years of history',
        'Confirm they have low utilization (under 10%)',
        'Have them call card issuer to add you as authorized user',
        'Wait 30-60 days for account to appear on your credit report',
        'You don\'t need to use the card for score benefit',
      ],
      tags: ['Easy Win', 'Quick Impact'],
      order: 2,
    },
  ],
  progress: {
    goalId: 'goal_002',
    userId: 'user_123456',
    startScore: 742,
    currentScore: 742,
    targetScore: 780,
    pointsBuilt: 0,
    totalPotentialPoints: 35,
    percentComplete: 0,
    actionsCompleted: 0,
    totalActions: 2,
    daysElapsed: 0,
    daysRemaining: 365,
    estimatedCompletionDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    onTrack: true,
    velocity: 0,
    lastUpdated: new Date(),
  },
};

/**
 * Sample completed goal for history
 */
export const mockOptimalPathCompletedGoal: OptimalPathData = {
  goal: {
    id: 'goal_000',
    userId: 'user_123456',
    currentScore: 650,
    targetScore: 700,
    scoreGap: 50,
    timeHorizon: 6,
    achievabilityScore: 75,
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: 'completed',
  },
  actions: [
    {
      id: 'action_001_old',
      goalId: 'goal_000',
      title: 'Pay off collection account',
      description: 'Settled and paid collection account in full.',
      detailedExplanation: 'Paid off $1,200 medical collection.',
      priority: 'high',
      category: 'payment',
      difficulty: 'medium',
      estimatedImpact: 35,
      estimatedTimeframe: '60 days',
      successRate: 90,
      completed: true,
      completedDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      verifiedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      steps: ['Contact collector', 'Negotiate settlement', 'Pay in full', 'Get deletion letter'],
      tags: ['High Priority'],
      order: 1,
    },
    {
      id: 'action_002_old',
      goalId: 'goal_000',
      title: 'Lower credit card utilization',
      description: 'Paid down cards to under 30%.',
      detailedExplanation: 'Reduced overall utilization from 80% to 20%.',
      priority: 'high',
      category: 'utilization',
      difficulty: 'medium',
      estimatedImpact: 15,
      estimatedTimeframe: '90 days',
      successRate: 80,
      completed: true,
      completedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      verifiedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      steps: ['Pay down balances', 'Keep utilization low'],
      tags: ['Utilization'],
      order: 2,
    },
  ],
  progress: {
    goalId: 'goal_000',
    userId: 'user_123456',
    startScore: 650,
    currentScore: 705, // Exceeded target!
    targetScore: 700,
    pointsBuilt: 55,
    totalPotentialPoints: 50,
    percentComplete: 100,
    actionsCompleted: 2,
    totalActions: 2,
    daysElapsed: 180,
    daysRemaining: 0,
    estimatedCompletionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    onTrack: true,
    velocity: 9.2, // 55 points in 6 months = ~9 points/month
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
};
