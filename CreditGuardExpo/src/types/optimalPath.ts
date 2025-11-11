/**
 * Optimal Path Type Definitions
 * Score improvement system with actionable recommendations
 */

export type ActionPriority = 'high' | 'medium' | 'low';
export type ActionCategory = 'payment' | 'utilization' | 'inquiries' | 'accounts' | 'habits' | 'disputes';
export type ActionDifficulty = 'easy' | 'medium' | 'hard';
export type GoalStatus = 'active' | 'completed' | 'expired' | 'abandoned';
export type TimeHorizon = 1 | 3 | 6 | 12; // months

/**
 * User's score improvement goal
 */
export interface OptimalPathGoal {
  id: string;
  userId: string;
  currentScore: number;
  targetScore: number;
  scoreGap: number;
  timeHorizon: TimeHorizon; // in months
  achievabilityScore: number; // 0-100, likelihood of achieving goal
  createdAt: Date;
  expiresAt: Date;
  status: GoalStatus;
}

/**
 * Individual action item to improve credit score
 */
export interface OptimalPathAction {
  id: string;
  goalId: string;
  title: string;
  description: string;
  detailedExplanation: string;

  // Classification
  priority: ActionPriority;
  category: ActionCategory;
  difficulty: ActionDifficulty;

  // Impact
  estimatedImpact: number; // Points this action could add
  estimatedTimeframe: string; // "30 days", "2-3 months"
  successRate: number; // 0-100, likelihood of success

  // Status
  completed: boolean;
  completedDate?: Date;
  verifiedDate?: Date; // When the impact was verified on credit report

  // Instructions
  steps: string[]; // Step-by-step how-to
  tags: string[]; // ['High Priority', 'Utilization', 'Good Habit']

  // Related data
  relatedAccounts?: string[]; // IDs of credit accounts this affects
  order: number; // Display order in the list
}

/**
 * Progress tracking for an Optimal Path goal
 */
export interface OptimalPathProgress {
  goalId: string;
  userId: string;

  // Score tracking
  startScore: number;
  currentScore: number;
  targetScore: number;
  pointsBuilt: number; // Actual points gained so far
  totalPotentialPoints: number; // Max points if all actions completed

  // Completion tracking
  percentComplete: number; // 0-100
  actionsCompleted: number;
  totalActions: number;

  // Time tracking
  daysElapsed: number;
  daysRemaining: number;
  estimatedCompletionDate: Date;

  // Status
  onTrack: boolean; // Whether user is on pace to hit goal
  velocity: number; // Points gained per month at current rate

  lastUpdated: Date;
}

/**
 * Complete Optimal Path data for a user
 */
export interface OptimalPathData {
  goal: OptimalPathGoal;
  actions: OptimalPathAction[];
  progress: OptimalPathProgress;
}

/**
 * Goal setup request
 */
export interface OptimalPathGoalSetupRequest {
  userId: string;
  currentScore: number;
  targetScore: number;
  timeHorizon: TimeHorizon;
}

/**
 * Action completion request
 */
export interface OptimalPathActionCompletionRequest {
  actionId: string;
  goalId: string;
  userId: string;
  completedDate: Date;
  notes?: string;
}

/**
 * Priority tag display configuration
 */
export interface PriorityTagConfig {
  label: string;
  color: string;
  backgroundColor: string;
  icon: string; // Ionicons name
}

/**
 * Action category metadata for UI display
 */
export interface ActionCategoryMetadata {
  category: ActionCategory;
  displayName: string;
  description: string;
  icon: string; // Ionicons name
  color: string;
}
