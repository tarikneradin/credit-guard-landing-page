# Equifax Optimal Path Feature Specification

## Executive Summary

The **Optimal Path** feature is a goal-oriented credit score improvement system that provides users with personalized, actionable recommendations to achieve their target credit score. Inspired by Equifax's score improvement algorithms, this feature complements the existing Smart Action Engine by offering structured goal tracking with estimated point impacts for each action.

---

## 🎯 Feature Overview

### Core Value Proposition
Transform credit improvement from passive monitoring to active goal achievement through:
- **Clear Goal Setting**: Users set specific score targets
- **Visual Progress Tracking**: See real-time progress toward goals
- **Actionable Checklist**: Complete specific tasks with estimated impacts
- **Gamified Experience**: Checkbox completion and progress bars for engagement
- **Equifax-Backed**: Leverages industry-standard scoring models

### Relationship with Smart Action Engine
- **Smart Action Engine**: Provides AI-driven recommendations for general credit improvement exploration
- **Optimal Path**: Offers goal-oriented tracking with commitment to specific score targets
- **Complementary Design**: Users can browse recommendations OR commit to measurable goals

---

## 📱 User Experience Design

### UI Mockups (Text-Based)

#### **Main Optimal Path View**
```
┌──────────────────────────────────────────────────────┐
│  < Back          Your Path to a Higher Score        │
│──────────────────────────────────────────────────────│
│                                                      │
│  THIS MONTH'S GOAL                                   │
│                                                      │
│    CURRENT                                 TARGET    │
│      674                                     686     │
│       |                                        |     │
│       V                                        V     │
│    [██████████|▓▓▓▓▓▓▓▓▓▓|......................]    │
│     (Your     ^                                      │
│      Score)   |                                      │
│            (Impact of Action 1)                      │
│                                                      │
│    "You're 6 points closer to your monthly goal!"   │
│                                                      │
│──────────────────────────────────────────────────────│
│  YOUR ACTION CHECKLIST                               │
│  *Check an action to see its impact*                 │
│──────────────────────────────────────────────────────│
│                                          IMPACT      │
│  [✓] 1. Pay BANK-M Past Due             [~+6 pts]   │
│      <Tag: High Priority>                            │
│      "This account is $1339 past due. Pay it         │
│       off to secure these points."                   │
│  ──────────────────────────────────────────────────  │
│  [ ] 2. Pay down ONE OF THE BANK Card   [~+4 pts]   │
│      <Tag: Utilization>                              │
│      "Your balance is over the limit. Pay it         │
│       down to $7000 or less."                        │
│  ──────────────────────────────────────────────────  │
│  [ ] 3. No new hard inquiries           [~+2 pts]   │
│      <Tag: Good Habit>                               │
│      "Avoid applying for new credit this month."     │
│                                                      │
│──────────────────────────────────────────────────────│
│  (i) Score projections are estimates based on the    │
│      Equifax Optimal Path model. Actual results vary.│
└──────────────────────────────────────────────────────┘
```

#### **Goal Setting Screen**
```
┌──────────────────────────────────────────────────────┐
│  < Back               Set Your Goal                  │
│──────────────────────────────────────────────────────│
│                                                      │
│  Your Current Score: 674                             │
│                                                      │
│  What's your target score?                           │
│  ┌──────────────────────────────────────────────┐   │
│  │                    686                       │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  [━━━━━━━━●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━]      │
│  650                   700                   750     │
│                                                      │
│  When do you want to achieve this?                   │
│  ○  1 month                                          │
│  ○  3 months                                         │
│  ●  6 months  (Recommended)                          │
│  ○  12 months                                        │
│                                                      │
│  ┌────────────────────────────────────────────┐     │
│  │  Goal Summary                              │     │
│  │  • Target: +12 points in 6 months          │     │
│  │  • Achievability: 85% (Very Achievable)    │     │
│  │  • Estimated Actions: 3-4 steps            │     │
│  └────────────────────────────────────────────┘     │
│                                                      │
│  [         Set My Goal & Get Started         ]      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### **Action Detail View**
```
┌──────────────────────────────────────────────────────┐
│  < Back              Action Details                  │
│──────────────────────────────────────────────────────│
│                                                      │
│  [✓]  Pay BANK-M Past Due                  ~+6 pts  │
│       <Tag: High Priority> <Tag: Payment History>   │
│                                                      │
│──────────────────────────────────────────────────────│
│  WHY THIS MATTERS                                    │
│                                                      │
│  This account is currently $1,339 past due. Past-due│
│  balances have one of the highest negative impacts   │
│  on your credit score. Bringing this account current │
│  can yield significant score improvement.            │
│                                                      │
│──────────────────────────────────────────────────────│
│  WHAT YOU NEED TO DO                                 │
│                                                      │
│  1. Make a payment of $1,339 to BANK-M              │
│  2. Allow 30-45 days for reporting to credit bureaus│
│  3. Verify the account shows as current              │
│                                                      │
│──────────────────────────────────────────────────────│
│  ESTIMATED IMPACT                                    │
│                                                      │
│  Score Increase:      ~6 points                      │
│  Timeframe:           30-45 days after payment       │
│  Difficulty:          Medium                         │
│  Success Rate:        95% (when completed as stated) │
│                                                      │
│──────────────────────────────────────────────────────│
│                                                      │
│  [   Mark as Completed   ]    [   Get Help   ]      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 🏗️ Technical Architecture

### Data Models

```typescript
// src/types/optimalPath.ts

/**
 * User's credit score improvement goal
 */
export interface OptimalPathGoal {
  id: string;
  userId: string;
  currentScore: number;
  targetScore: number;
  scoreGap: number;
  timeHorizon: 1 | 3 | 6 | 12; // months
  achievabilityScore: number; // 0-100, likelihood of success
  createdAt: Date;
  expiresAt: Date;
  status: 'active' | 'completed' | 'expired' | 'abandoned';
}

/**
 * Individual action item in the improvement path
 */
export interface OptimalPathAction {
  id: string;
  goalId: string;
  title: string;
  description: string;
  detailedExplanation: string;
  priority: 'high' | 'medium' | 'low';
  category: 'payment' | 'utilization' | 'inquiries' | 'accounts' | 'habits' | 'disputes';
  estimatedImpact: number; // Points
  estimatedTimeframe: string; // "30 days", "2-3 months"
  difficulty: 'easy' | 'medium' | 'hard';
  successRate: number; // 0-100, percentage
  completed: boolean;
  completedDate?: Date;
  verifiedDate?: Date;
  steps: string[]; // Step-by-step instructions
  tags: string[]; // ['High Priority', 'Utilization', 'Good Habit']
  relatedAccounts?: string[]; // Account IDs this action affects
  order: number; // Display order in the list
}

/**
 * User's progress toward their goal
 */
export interface OptimalPathProgress {
  goalId: string;
  userId: string;
  startScore: number;
  currentScore: number;
  targetScore: number;
  pointsBuilt: number;
  totalPotentialPoints: number;
  percentComplete: number;
  actionsCompleted: number;
  totalActions: number;
  daysElapsed: number;
  daysRemaining: number;
  estimatedCompletionDate: Date;
  onTrack: boolean; // Is user on pace to meet goal?
  velocity: number; // Points gained per month
  lastUpdated: Date;
}

/**
 * Complete Optimal Path data bundle
 */
export interface OptimalPathData {
  goal: OptimalPathGoal;
  actions: OptimalPathAction[];
  progress: OptimalPathProgress;
  historicalSnapshots: OptimalPathSnapshot[]; // Weekly progress snapshots
}

/**
 * Weekly snapshot of progress for trending
 */
export interface OptimalPathSnapshot {
  snapshotDate: Date;
  score: number;
  actionsCompleted: number;
  pointsGained: number;
}

/**
 * Goal achievability analysis
 */
export interface GoalAchievabilityAnalysis {
  targetScore: number;
  currentScore: number;
  scoreGap: number;
  timeHorizon: number;
  achievabilityScore: number; // 0-100
  achievabilityCategory: 'very_easy' | 'achievable' | 'challenging' | 'unlikely';
  estimatedActions: number;
  recommendedTimeframe?: number; // Suggested timeframe if current is unrealistic
  reasoning: string;
}
```

---

## 🔌 API Integration

### Equifax Score-Up API

#### **Get Optimal Path Recommendations**
```typescript
// GET /api/equifax/optimal-path
interface OptimalPathRequest {
  userId: string;
  currentScore: number;
  targetScore: number;
  timeHorizon: 1 | 3 | 6 | 12;
}

interface OptimalPathResponse {
  goal_id: string;
  current_score: number;
  target_score: number;
  time_horizon: number;
  achievability_percent: number;
  achievability_category: string;
  recommended_actions: Array<{
    action_id: string;
    title: string;
    description: string;
    detailed_explanation: string;
    priority_level: number; // 1-10
    category: string;
    estimated_points: number;
    timeframe: string;
    difficulty: string;
    success_rate: number;
    steps: string[];
    related_accounts?: string[];
  }>;
  historical_data?: {
    average_time_to_similar_goals: number;
    success_rate_for_similar_profiles: number;
  };
}
```

#### **Set Score Goal**
```typescript
// POST /api/equifax/optimal-path/goal
interface SetGoalRequest {
  userId: string;
  targetScore: number;
  timeframe: number;
}

interface SetGoalResponse {
  goalId: string;
  goal: OptimalPathGoal;
  initialActions: OptimalPathAction[];
}
```

#### **Mark Action as Completed**
```typescript
// POST /api/equifax/optimal-path/complete
interface CompleteActionRequest {
  userId: string;
  actionId: string;
  completedDate: Date;
  notes?: string;
}

interface CompleteActionResponse {
  success: boolean;
  updatedProgress: OptimalPathProgress;
  nextRecommendedAction?: OptimalPathAction;
  celebrationMessage?: string; // Motivational message
}
```

#### **Get Progress**
```typescript
// GET /api/equifax/optimal-path/progress
interface ProgressRequest {
  userId: string;
  goalId?: string; // Optional, defaults to active goal
}

interface ProgressResponse {
  progress: OptimalPathProgress;
  recentAchievements: string[];
  upcomingMilestones: Array<{
    milestone: string;
    pointsRequired: number;
    pointsRemaining: number;
  }>;
}
```

---

## 🎨 Component Specifications

### OptimalPathCard Component

```typescript
// src/components/optimalPath/OptimalPathCard.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';

interface OptimalPathCardProps {
  goal: OptimalPathGoal;
  actions: OptimalPathAction[];
  progress: OptimalPathProgress;
  onActionToggle: (actionId: string) => void;
  onActionPress: (action: OptimalPathAction) => void;
  onRefresh: () => void;
  loading?: boolean;
}

export const OptimalPathCard: React.FC<OptimalPathCardProps> = ({
  goal,
  actions,
  progress,
  onActionToggle,
  onActionPress,
  onRefresh,
  loading = false
}) => {
  const sortedActions = actions.sort((a, b) => a.order - b.order);

  return (
    <CreditCard elevation={2} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Path to a Higher Score</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Icon name="refresh" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Progress Visualization */}
      <OptimalPathProgressBar
        currentScore={progress.currentScore}
        targetScore={progress.targetScore}
        pointsBuilt={progress.pointsBuilt}
        totalPoints={progress.totalPotentialPoints}
        onTrack={progress.onTrack}
      />

      {/* Motivational Message */}
      <Text style={styles.motivationText}>
        {progress.pointsBuilt === 0
          ? `Let's get started on your ${progress.totalPotentialPoints}-point goal!`
          : `You've built ${progress.pointsBuilt} of ${progress.totalPotentialPoints} potential points!`}
      </Text>

      {/* Action Checklist */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>YOUR ACTION PLAN</Text>
        <Text style={styles.sectionSubtitle}>
          *Check an action to see its impact*
        </Text>

        {sortedActions.map((action, index) => (
          <OptimalPathActionItem
            key={action.id}
            action={action}
            index={index + 1}
            onToggle={() => onActionToggle(action.id)}
            onPress={() => onActionPress(action)}
          />
        ))}
      </View>

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Icon name="information-outline" size={16} color={Colors.text.tertiary} />
        <Text style={styles.disclaimerText}>
          Score projections are estimates based on the Equifax Optimal Path
          model and are not guaranteed. Actual results vary.
        </Text>
      </View>
    </CreditCard>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    marginBottom: Spacing.md
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text.primary
  },
  motivationText: {
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.primary,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    textAlign: 'center'
  },
  actionsSection: {
    marginTop: Spacing.lg
  },
  sectionTitle: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text.secondary,
    letterSpacing: 1,
    marginBottom: Spacing.xs
  },
  sectionSubtitle: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.tertiary,
    fontStyle: 'italic',
    marginBottom: Spacing.md
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: Spacing.lg,
    padding: Spacing.sm,
    backgroundColor: Colors.states.hover,
    borderRadius: 8
  },
  disclaimerText: {
    flex: 1,
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.tertiary,
    marginLeft: Spacing.xs,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.xs
  }
});
```

### OptimalPathProgressBar Component

```typescript
// src/components/optimalPath/OptimalPathProgressBar.tsx
interface OptimalPathProgressBarProps {
  currentScore: number;
  targetScore: number;
  pointsBuilt: number;
  totalPoints: number;
  onTrack: boolean;
}

export const OptimalPathProgressBar: React.FC<OptimalPathProgressBarProps> = ({
  currentScore,
  targetScore,
  pointsBuilt,
  totalPoints,
  onTrack
}) => {
  const progressPercent = totalPoints > 0 ? (pointsBuilt / totalPoints) * 100 : 0;

  return (
    <View style={styles.container}>
      {/* Score Labels */}
      <View style={styles.scoreRow}>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>CURRENT</Text>
          <Text style={styles.scoreValue}>{currentScore}</Text>
        </View>

        <View style={styles.arrow}>
          <Icon name="arrow-forward" size={32} color={Colors.primary} />
        </View>

        <View style={styles.scoreItem}>
          <Text style={styles.scoreLabel}>TARGET</Text>
          <Text style={styles.scoreValue}>{targetScore}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          {/* Completed progress (filled) */}
          <View
            style={[
              styles.progressBarCompleted,
              { width: `${progressPercent}%` },
              !onTrack && styles.progressBarBehind
            ]}
          />

          {/* Expected progress (striped) */}
          {progressPercent < 100 && (
            <View
              style={[
                styles.progressBarExpected,
                {
                  left: `${progressPercent}%`,
                  width: `${Math.min(20, 100 - progressPercent)}%`
                }
              ]}
            />
          )}

          {/* Current position marker */}
          <View
            style={[
              styles.currentMarker,
              { left: `${progressPercent}%` }
            ]}
          >
            <View style={styles.markerPin} />
            <Text style={styles.markerText}>You are here</Text>
          </View>
        </View>
      </View>

      {/* On Track Indicator */}
      {onTrack ? (
        <View style={styles.onTrackBadge}>
          <Icon name="check-circle" size={16} color={Colors.scoreExcellent} />
          <Text style={styles.onTrackText}>On Track</Text>
        </View>
      ) : (
        <View style={[styles.onTrackBadge, styles.behindTrackBadge]}>
          <Icon name="alert-circle" size={16} color={Colors.warning} />
          <Text style={[styles.onTrackText, styles.behindTrackText]}>
            Needs Attention
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md
  },
  scoreItem: {
    alignItems: 'center'
  },
  scoreLabel: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
    letterSpacing: 1
  },
  scoreValue: {
    fontSize: Typography.fontSize.xxxl,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primary
  },
  arrow: {
    marginHorizontal: Spacing.md
  },
  progressBarContainer: {
    width: '100%',
    height: 60,
    marginVertical: Spacing.md
  },
  progressBarBackground: {
    width: '100%',
    height: 20,
    backgroundColor: Colors.states.disabled,
    borderRadius: 10,
    overflow: 'visible',
    position: 'relative'
  },
  progressBarCompleted: {
    height: '100%',
    backgroundColor: Colors.scoreExcellent,
    borderRadius: 10,
    position: 'absolute',
    left: 0,
    top: 0
  },
  progressBarBehind: {
    backgroundColor: Colors.warning
  },
  progressBarExpected: {
    height: '100%',
    backgroundColor: Colors.scoreExcellent,
    opacity: 0.3,
    borderRadius: 10,
    position: 'absolute',
    top: 0
  },
  currentMarker: {
    position: 'absolute',
    top: -5,
    transform: [{ translateX: -10 }],
    alignItems: 'center'
  },
  markerPin: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    borderWidth: 3,
    borderColor: Colors.surface
  },
  markerText: {
    marginTop: Spacing.sm,
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.secondary
  },
  onTrackBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.scoreExcellent + '20',
    borderRadius: 12
  },
  behindTrackBadge: {
    backgroundColor: Colors.warning + '20'
  },
  onTrackText: {
    marginLeft: Spacing.xs,
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.scoreExcellent
  },
  behindTrackText: {
    color: Colors.warning
  }
});
```

### OptimalPathActionItem Component

```typescript
// src/components/optimalPath/OptimalPathActionItem.tsx
interface OptimalPathActionItemProps {
  action: OptimalPathAction;
  index: number;
  onToggle: () => void;
  onPress: () => void;
}

export const OptimalPathActionItem: React.FC<OptimalPathActionItemProps> = ({
  action,
  index,
  onToggle,
  onPress
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        action.completed && styles.containerCompleted
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        {/* Checkbox */}
        <TouchableOpacity
          onPress={onToggle}
          style={styles.checkboxContainer}
        >
          <Checkbox
            checked={action.completed}
            onPress={onToggle}
            color={action.completed ? Colors.scoreExcellent : Colors.primary}
          />
        </TouchableOpacity>

        {/* Title and Impact */}
        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              action.completed && styles.titleCompleted
            ]}
          >
            {index}. {action.title}
          </Text>

          <View style={styles.impactBadge}>
            <Text style={styles.impactText}>
              ~+{action.estimatedImpact} pts
            </Text>
          </View>
        </View>

        {/* Chevron */}
        <Icon name="chevron-right" size={20} color={Colors.text.tertiary} />
      </View>

      {/* Tags */}
      <View style={styles.tagsContainer}>
        {action.tags.map((tag) => (
          <View
            key={tag}
            style={[
              styles.tag,
              tag.includes('High Priority') && styles.tagHighPriority,
              tag.includes('Utilization') && styles.tagUtilization,
              tag.includes('Good Habit') && styles.tagGoodHabit
            ]}
          >
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      {/* Description */}
      <Text
        style={[
          styles.description,
          action.completed && styles.descriptionCompleted
        ]}
        numberOfLines={2}
      >
        {action.description}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.states.hover
  },
  containerCompleted: {
    backgroundColor: Colors.scoreExcellent + '10',
    borderColor: Colors.scoreExcellent
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm
  },
  checkboxContainer: {
    marginRight: Spacing.sm
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    flex: 1,
    fontSize: Typography.fontSize.md,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.primary
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.text.secondary
  },
  impactBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.primary + '20',
    borderRadius: 8,
    marginLeft: Spacing.sm,
    marginRight: Spacing.sm
  },
  impactText: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primary
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm
  },
  tag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.states.hover,
    borderRadius: 6,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs
  },
  tagHighPriority: {
    backgroundColor: Colors.error + '20'
  },
  tagUtilization: {
    backgroundColor: Colors.warning + '20'
  },
  tagGoodHabit: {
    backgroundColor: Colors.scoreExcellent + '20'
  },
  tagText: {
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.text.secondary
  },
  description: {
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm
  },
  descriptionCompleted: {
    color: Colors.text.tertiary
  }
});
```

---

## 🗂️ Mock Data for Development

```typescript
// src/services/mock/mockOptimalPathData.ts

export const MOCK_OPTIMAL_PATH_DATA: OptimalPathData = {
  goal: {
    id: 'goal_mock_1',
    userId: 'user_123',
    currentScore: 674,
    targetScore: 686,
    scoreGap: 12,
    timeHorizon: 6,
    achievabilityScore: 85,
    createdAt: new Date('2024-01-15'),
    expiresAt: new Date('2024-07-15'),
    status: 'active'
  },
  actions: [
    {
      id: 'action_mock_1',
      goalId: 'goal_mock_1',
      title: 'Pay past due on BANK-M Card',
      description: 'This account has a $1339 past due balance. Paying it off is a key step.',
      detailedExplanation:
        'Your BANK-M credit card account is currently $1,339 past due. Past-due balances have one of the highest negative impacts on your credit score because payment history accounts for 35% of your FICO score. Bringing this account current by making the full payment will immediately stop further damage to your score and should result in a score increase of approximately 6 points within 30-45 days after the payment is reported to the credit bureaus.',
      priority: 'high',
      category: 'payment',
      estimatedImpact: 6,
      estimatedTimeframe: '30-45 days',
      difficulty: 'medium',
      successRate: 95,
      completed: false,
      steps: [
        'Contact BANK-M customer service at 1-800-XXX-XXXX',
        'Make a payment of $1,339 to bring account current',
        'Request written confirmation that account will be reported as current',
        'Allow 30-45 days for credit bureau reporting',
        'Verify account shows as current on credit report'
      ],
      tags: ['High Priority', 'Payment History'],
      relatedAccounts: ['account_bankm_123'],
      order: 1
    },
    {
      id: 'action_mock_2',
      goalId: 'goal_mock_1',
      title: 'Pay down ONE OF THE BANK Card',
      description: 'Your balance is over the limit. Pay it down to $7000 or less.',
      detailedExplanation:
        'Your ONE OF THE BANK credit card has a balance that exceeds your credit limit, resulting in an over-limit status. This creates two problems: (1) over-limit penalties and fees, and (2) extremely high utilization ratio. Credit utilization accounts for 30% of your score. Paying down the balance to $7,000 or less will bring your utilization below 70% and should yield approximately 4 points improvement.',
      priority: 'high',
      category: 'utilization',
      estimatedImpact: 4,
      estimatedTimeframe: '45-60 days',
      difficulty: 'medium',
      successRate: 90,
      completed: false,
      steps: [
        'Make a payment of at least $3,000 to bring balance under limit',
        'Ideally, pay down to $7,000 or less for best impact',
        'Set up autopay for minimum payment to prevent future issues',
        'Wait for next statement cycle (30 days)',
        'Verify updated utilization on credit report'
      ],
      tags: ['Utilization', 'High Impact'],
      relatedAccounts: ['account_onebank_456'],
      order: 2
    },
    {
      id: 'action_mock_3',
      goalId: 'goal_mock_1',
      title: 'Resolve collection account',
      description: 'This $250 collection is hurting your score. Resolving it will help.',
      detailedExplanation:
        'You have a collection account for $250 that is negatively impacting your credit score. Collections indicate to lenders that you have unpaid debts, which significantly damages your creditworthiness. While paying the collection won\'t remove it from your report immediately, it will change the status to "Paid Collection" which is viewed more favorably by lenders and should result in approximately 3 points improvement. You may also negotiate a "pay for delete" agreement.',
      priority: 'medium',
      category: 'accounts',
      estimatedImpact: 3,
      estimatedTimeframe: '60 days',
      difficulty: 'medium',
      successRate: 85,
      completed: false,
      steps: [
        'Contact collection agency to verify debt',
        'Negotiate settlement or request pay-for-delete agreement',
        'Get written agreement before making payment',
        'Make payment via certified check with tracking',
        'Request written confirmation of payment and account closure',
        'Dispute with credit bureaus if not removed after 30 days (if pay-for-delete was agreed)'
      ],
      tags: ['Collections', 'Medium Priority'],
      order: 3
    },
    {
      id: 'action_mock_4',
      goalId: 'goal_mock_1',
      title: 'No new hard inquiries',
      description: 'Avoid applying for new credit this month.',
      detailedExplanation:
        'Every time you apply for credit, it results in a hard inquiry on your credit report. Hard inquiries account for 10% of your credit score and each inquiry can reduce your score by 2-5 points. The impact is highest in the first 6 months. To maximize your score improvement, avoid all new credit applications for at least 6 months. This includes credit cards, loans, and even some service applications.',
      priority: 'low',
      category: 'habits',
      estimatedImpact: 2,
      estimatedTimeframe: 'Ongoing',
      difficulty: 'easy',
      successRate: 98,
      completed: false,
      steps: [
        'Decline all credit card offers',
        'Avoid retail store credit applications',
        'Research loans using "soft pull" pre-qualification tools',
        'Wait at least 6 months before any new credit applications',
        'Review credit report monthly to ensure no unauthorized inquiries'
      ],
      tags: ['Good Habit', 'Easy Win'],
      order: 4
    }
  ],
  progress: {
    goalId: 'goal_mock_1',
    userId: 'user_123',
    startScore: 674,
    currentScore: 674,
    targetScore: 686,
    pointsBuilt: 0,
    totalPotentialPoints: 12,
    percentComplete: 0,
    actionsCompleted: 0,
    totalActions: 4,
    daysElapsed: 0,
    daysRemaining: 180,
    estimatedCompletionDate: new Date('2024-07-15'),
    onTrack: true,
    velocity: 0,
    lastUpdated: new Date()
  },
  historicalSnapshots: []
};

/**
 * Mock data with some progress
 */
export const MOCK_OPTIMAL_PATH_DATA_WITH_PROGRESS: OptimalPathData = {
  ...MOCK_OPTIMAL_PATH_DATA,
  actions: [
    { ...MOCK_OPTIMAL_PATH_DATA.actions[0], completed: true, completedDate: new Date('2024-02-01') },
    ...MOCK_OPTIMAL_PATH_DATA.actions.slice(1)
  ],
  progress: {
    ...MOCK_OPTIMAL_PATH_DATA.progress,
    currentScore: 680,
    pointsBuilt: 6,
    percentComplete: 50,
    actionsCompleted: 1,
    daysElapsed: 15,
    daysRemaining: 165,
    velocity: 12, // 6 points in 0.5 months = 12 points per month
    onTrack: true,
    lastUpdated: new Date()
  },
  historicalSnapshots: [
    { snapshotDate: new Date('2024-01-15'), score: 674, actionsCompleted: 0, pointsGained: 0 },
    { snapshotDate: new Date('2024-02-01'), score: 680, actionsCompleted: 1, pointsGained: 6 }
  ]
};
```

---

## 🔄 User Flows

### Flow 1: Setting a New Goal

```
1. User navigates to Smart Actions screen
2. User taps "Optimal Path" tab
3. System displays "Set Your Goal" prompt if no active goal
4. User adjusts target score slider (e.g., 686)
5. User selects timeframe (e.g., 6 months)
6. System shows achievability analysis:
   - Achievability: 85% (Very Achievable)
   - Estimated actions: 3-4 steps
   - Estimated impact: +12 points
7. User taps "Set My Goal & Get Started"
8. System creates goal via API POST /api/equifax/optimal-path/goal
9. System displays Optimal Path card with personalized actions
```

### Flow 2: Completing an Action

```
1. User views Optimal Path card with action checklist
2. User completes action in real life (e.g., pays past-due balance)
3. User taps checkbox next to completed action
4. System shows confirmation modal:
   "Mark 'Pay past due on BANK-M Card' as completed?"
   [Yes, mark as done] [Not yet]
5. User taps "Yes, mark as done"
6. System calls API POST /api/equifax/optimal-path/complete
7. System updates progress bar
8. System displays celebration message:
   "Great work! 🎉 You just gained ~6 points toward your goal!"
9. System refreshes action list with next recommended action
```

### Flow 3: Viewing Action Details

```
1. User taps on action item in checklist
2. System navigates to Action Detail screen
3. Screen displays:
   - Full explanation of why action matters
   - Step-by-step instructions
   - Estimated impact and timeframe
   - Success rate and difficulty
   - Related accounts (if applicable)
4. User reads details
5. User taps "Mark as Completed" or goes back
```

### Flow 4: Progress Tracking

```
1. User opens Optimal Path tab weekly
2. System displays updated progress:
   - Current score (refreshed from credit monitoring)
   - Points gained so far
   - Actions completed
   - On-track indicator
3. If behind schedule, system displays:
   "You're behind pace. Complete 1 more action this month to stay on track."
4. System shows historical snapshots chart (optional)
```

---

## 📋 Implementation Phases

### Phase 1: Mock Data & UI (Week 1-2)
**Goal**: Fully functional UI with mock data

- ✅ Create all TypeScript interfaces and types
- ✅ Implement mock data service with realistic scenarios
- ✅ Build OptimalPathCard component
- ✅ Build OptimalPathProgressBar component
- ✅ Build OptimalPathActionItem component
- ✅ Build GoalSettingScreen
- ✅ Build ActionDetailScreen
- ✅ Integrate into Smart Actions screen with tab navigation
- ✅ Add celebration animations and motivational messaging
- ✅ Test all user flows with mock data

**Success Criteria**:
- Users can set goals (mock)
- Users can view personalized action checklists
- Users can mark actions as completed
- Progress bar updates correctly
- All animations and transitions work smoothly

---

### Phase 2: Equifax API Integration (Week 3-4)
**Goal**: Replace mock data with real Equifax API

- ✅ Implement equifaxService API client
- ✅ Create API request/response transformers
- ✅ Integrate GET /api/equifax/optimal-path endpoint
- ✅ Integrate POST /api/equifax/optimal-path/goal endpoint
- ✅ Integrate POST /api/equifax/optimal-path/complete endpoint
- ✅ Integrate GET /api/equifax/optimal-path/progress endpoint
- ✅ Implement fallback to mock data on API errors
- ✅ Add comprehensive error handling
- ✅ Add loading states for all API calls
- ✅ Test with real user data from Equifax sandbox

**Success Criteria**:
- Real score improvement paths load from Equifax
- Actions are personalized based on user's credit profile
- Progress tracking reflects real credit score updates
- Graceful fallback to mock data if API unavailable

---

### Phase 3: Enhanced Features (Week 5-6)
**Goal**: Polish and advanced features

- ✅ Add historical progress tracking (weekly snapshots)
- ✅ Implement on-track vs. behind-schedule detection
- ✅ Add push notifications for action reminders
- ✅ Create motivational messaging system
- ✅ Add achievement badges and milestones
- ✅ Implement goal abandonment detection and re-engagement
- ✅ Add analytics tracking for feature usage
- ✅ Performance optimization for large action lists
- ✅ Accessibility improvements (screen reader support)
- ✅ Comprehensive unit and integration tests

**Success Criteria**:
- Users receive timely reminders
- Progress tracking shows weekly trends
- Motivational messages increase engagement
- Feature analytics show high adoption rates
- Performance remains smooth with large datasets

---

## 🛡️ Compliance Considerations

### FCRA Compliance
- **Adverse Action Notices**: If goal is deemed "unlikely" to achieve, provide clear explanation
- **Accuracy**: All score impact estimates must include disclaimers about variability
- **Dispute Rights**: Users must be able to access dispute process from action items
- **Data Privacy**: Sensitive credit information must be encrypted and secure

### Disclaimers Required
```
"Score projections are estimates based on the Equifax Optimal Path model
and are not guaranteed. Actual results vary based on individual credit
profiles, reporting timing, and other factors. Completing recommended
actions does not guarantee specific score improvements."
```

### Data Retention
- Goal data retained for 12 months after goal completion or expiration
- Progress snapshots stored for historical trend analysis
- User can request deletion of all Optimal Path data at any time

---

## 📊 Success Metrics

### Engagement Metrics
- **Goal Setting Rate**: % of users who set an Optimal Path goal
- **Action Completion Rate**: % of actions marked as completed
- **Goal Achievement Rate**: % of users who reach their target score
- **Average Time to Goal**: Days from goal creation to achievement
- **Feature Retention**: % of users who return to Optimal Path weekly

### Business Metrics
- **Premium Conversion**: % of free users who upgrade due to Optimal Path
- **User Satisfaction**: NPS score for Optimal Path feature
- **Support Tickets**: Reduction in "how to improve score" support requests
- **Referral Rate**: % of Optimal Path users who refer friends

### Technical Metrics
- **API Response Time**: <500ms for all Optimal Path API calls
- **Error Rate**: <1% API failures with successful mock data fallback
- **App Performance**: No degradation in screen load times
- **Crash Rate**: <0.1% crashes related to Optimal Path feature

---

## 🎯 Future Enhancements

### V2 Features (6-12 months)
- **AI-Powered Recommendations**: Use machine learning to personalize action suggestions beyond Equifax data
- **Social Features**: Allow users to share progress anonymously and motivate each other
- **Financial Product Recommendations**: Suggest specific credit cards or loans that align with goals
- **Automated Action Execution**: Auto-pay bills, request credit limit increases automatically
- **Multiple Goal Tracking**: Support concurrent goals (e.g., "Buy a house" + "Get a new car")

### Integration Opportunities
- **Financial Coach Integration**: Connect Optimal Path goals with AI Financial Coach for personalized guidance
- **Calendar Integration**: Sync action due dates with user's calendar
- **Spending Analysis**: Correlate spending patterns with credit score impacts
- **Document Upload**: Allow users to upload payment confirmations for verification

---

## 📄 Appendix

### Glossary

- **Optimal Path**: Equifax's proprietary algorithm for score improvement recommendations
- **Score-Up API**: Equifax API endpoint that provides personalized credit improvement paths
- **Achievability Score**: 0-100 metric indicating likelihood of reaching goal in timeframe
- **Action Velocity**: Rate of score improvement measured in points per month
- **Historical Snapshot**: Weekly record of score and progress for trend analysis

### References

- [Equifax Developer Documentation](https://developer.equifax.com/)
- [FCRA Compliance Guide](https://www.ftc.gov/legal-library/browse/statutes/fair-credit-reporting-act)
- [FICO Score Factors](https://www.myfico.com/credit-education/whats-in-your-credit-score)

---

*Last Updated: January 2025*
*Document Version: 1.0*
*Next Review: Q2 2025*
