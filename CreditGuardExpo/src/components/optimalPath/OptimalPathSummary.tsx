import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {OptimalPathProgress} from '../../types/optimalPath';

interface OptimalPathSummaryProps {
  progress: OptimalPathProgress;
  actionsCompleted: number;
  totalActions: number;
}

export const OptimalPathSummary: React.FC<OptimalPathSummaryProps> = ({
  progress,
  actionsCompleted,
  totalActions,
}) => {
  const {theme} = useTheme();

  const completionPercentage = totalActions > 0
    ? Math.round((actionsCompleted / totalActions) * 100)
    : 0;

  const getMotivationalMessage = () => {
    if (completionPercentage === 100) {
      return "Outstanding! You've completed all recommended actions!";
    } else if (completionPercentage >= 75) {
      return "Great progress! You're almost there!";
    } else if (completionPercentage >= 50) {
      return "You're halfway there! Keep it up!";
    } else if (completionPercentage >= 25) {
      return "Good start! Stay consistent to reach your goal.";
    } else if (actionsCompleted > 0) {
      return "You've taken the first step! Keep building momentum.";
    } else {
      return "Let's get started on your credit improvement journey!";
    }
  };

  const getStatusColor = () => {
    if (progress.onTrack) {
      return theme.colors.success;
    } else {
      return theme.colors.warning;
    }
  };

  const pointsRemaining = progress.totalPotentialPoints - progress.pointsBuilt;

  return (
    <View style={styles(theme).container}>
      {/* Header */}
      <View style={styles(theme).header}>
        <Text style={styles(theme).title}>Your Progress</Text>
        <View
          style={[
            styles(theme).statusBadge,
            {backgroundColor: getStatusColor() + '15'},
          ]}>
          <Ionicons
            name={progress.onTrack ? 'checkmark-circle' : 'time'}
            size={14}
            color={getStatusColor()}
          />
          <Text style={[styles(theme).statusText, {color: getStatusColor()}]}>
            {progress.onTrack ? 'On Track' : 'Behind Schedule'}
          </Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles(theme).statsGrid}>
        {/* Points Built */}
        <View style={styles(theme).statCard}>
          <View style={styles(theme).statIconContainer}>
            <Ionicons name="trending-up" size={24} color={theme.colors.success} />
          </View>
          <Text style={styles(theme).statValue}>+{progress.pointsBuilt}</Text>
          <Text style={styles(theme).statLabel}>Points Built</Text>
        </View>

        {/* Actions Completed */}
        <View style={styles(theme).statCard}>
          <View style={styles(theme).statIconContainer}>
            <Ionicons name="checkmark-done" size={24} color={theme.colors.primary} />
          </View>
          <Text style={styles(theme).statValue}>
            {actionsCompleted}/{totalActions}
          </Text>
          <Text style={styles(theme).statLabel}>Actions Done</Text>
        </View>

        {/* Progress Percentage */}
        <View style={styles(theme).statCard}>
          <View style={styles(theme).statIconContainer}>
            <Ionicons name="pie-chart" size={24} color={theme.colors.warning} />
          </View>
          <Text style={styles(theme).statValue}>{completionPercentage}%</Text>
          <Text style={styles(theme).statLabel}>Complete</Text>
        </View>
      </View>

      {/* Motivational Message */}
      <View style={styles(theme).motivationalSection}>
        <Ionicons name="sparkles" size={20} color={theme.colors.primary} />
        <Text style={styles(theme).motivationalText}>{getMotivationalMessage()}</Text>
      </View>

      {/* Points Potential */}
      {pointsRemaining > 0 && (
        <View style={styles(theme).potentialSection}>
          <View style={styles(theme).potentialRow}>
            <Ionicons
              name="arrow-up-circle-outline"
              size={18}
              color={theme.colors.text.secondary}
            />
            <Text style={styles(theme).potentialText}>
              <Text style={styles(theme).potentialValue}>
                +{pointsRemaining} points
              </Text>
              {' '}remaining potential
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = (theme: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    title: {
      ...theme.textStyles.headline3,
      fontWeight: '700',
      color: theme.colors.text.primary,
      letterSpacing: 0.3,
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.sm + 2,
      paddingVertical: 5,
      borderRadius: 8,
      gap: 5,
    },
    statusText: {
      ...theme.textStyles.caption,
      fontWeight: '700',
      fontSize: 12,
      letterSpacing: 0.3,
    },
    statsGrid: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      padding: theme.spacing.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border.subtle,
    },
    statIconContainer: {
      marginBottom: theme.spacing.xs,
    },
    statValue: {
      ...theme.textStyles.headline2,
      fontWeight: '800',
      color: theme.colors.text.primary,
      marginBottom: 2,
      letterSpacing: 0.3,
    },
    statLabel: {
      ...theme.textStyles.caption,
      color: theme.colors.text.secondary,
      fontSize: 11,
      textAlign: 'center',
      fontWeight: '600',
      letterSpacing: 0.2,
    },
    motivationalSection: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.primary + '08',
      borderRadius: 12,
      padding: theme.spacing.md,
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.primary + '15',
    },
    motivationalText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.primary,
      fontWeight: '600',
      flex: 1,
      lineHeight: 20,
      letterSpacing: 0.2,
    },
    potentialSection: {
      paddingTop: theme.spacing.md,
      borderTopWidth: 0.5,
      borderTopColor: theme.colors.border.subtle,
    },
    potentialRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    potentialText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
      fontWeight: '500',
      letterSpacing: 0.2,
    },
    potentialValue: {
      fontWeight: '700',
      color: theme.colors.primary,
      letterSpacing: 0.3,
    },
  });
