// Gamification types for CreditGuard

export type BadgeCategory = 'score' | 'action' | 'payment' | 'engagement' | 'milestone';
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Ionicons name
  category: BadgeCategory;
  rarity: BadgeRarity;
  color: string;
  requirement: string; // Human-readable requirement
  points: number; // Points awarded when unlocked
}

export interface UserBadge {
  badgeId: string;
  unlockedAt: Date;
  isNew?: boolean; // For showing "NEW" indicator
}

export interface Streak {
  type: 'login' | 'payment' | 'action' | 'utilization';
  count: number;
  lastDate: Date;
  bestStreak: number;
}

export interface Goal {
  id: string;
  type: 'score' | 'debt' | 'utilization' | 'payment' | 'custom';
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string; // 'points', 'dollars', 'percent', etc.
  deadline?: Date;
  completed: boolean;
  completedAt?: Date;
  reward?: {
    points: number;
    badge?: string;
  };
}

export interface UserLevel {
  level: number;
  title: string;
  pointsRequired: number;
  color: string;
  icon: string;
}

export interface GamificationState {
  userId: string;
  points: number;
  level: number;
  badges: UserBadge[];
  streaks: Streak[];
  goals: Goal[];
  totalActionsCompleted: number;
  totalScoreIncrease: number;
  totalDebtPaid: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Achievement {
  id: string;
  type: 'badge' | 'streak' | 'goal' | 'level';
  title: string;
  message: string;
  icon: string;
  color: string;
  points?: number;
  timestamp: Date;
}
