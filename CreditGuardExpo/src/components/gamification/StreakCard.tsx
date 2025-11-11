import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {Streak} from '../../types/gamification';

interface StreakCardProps {
  streak: Streak;
  compact?: boolean;
}

export const StreakCard: React.FC<StreakCardProps> = ({streak, compact = false}) => {
  const {theme} = useTheme();

  const getStreakIcon = (type: string) => {
    switch (type) {
      case 'login':
        return 'log-in';
      case 'payment':
        return 'card';
      case 'action':
        return 'checkmark-done';
      case 'utilization':
        return 'pie-chart';
      default:
        return 'flame';
    }
  };

  const getStreakTitle = (type: string) => {
    switch (type) {
      case 'login':
        return 'Login Streak';
      case 'payment':
        return 'On-Time Payments';
      case 'action':
        return 'Action Streak';
      case 'utilization':
        return 'Low Utilization';
      default:
        return 'Streak';
    }
  };

  const getStreakColor = (count: number) => {
    if (count >= 30) return '#F59E0B'; // Gold
    if (count >= 14) return '#8B5CF6'; // Purple
    if (count >= 7) return '#10B981'; // Green
    return theme.colors.accent; // Blue
  };

  if (compact) {
    return (
      <View style={styles(theme).compactContainer}>
        <Ionicons name="flame" size={20} color={getStreakColor(streak.count)} />
        <Text style={[styles(theme).compactCount, {color: getStreakColor(streak.count)}]}>
          {streak.count}
        </Text>
        <Text style={styles(theme).compactLabel}>day streak</Text>
      </View>
    );
  }

  return (
    <View style={styles(theme).container}>
      <View style={styles(theme).header}>
        <View style={styles(theme).iconContainer}>
          <Ionicons
            name={getStreakIcon(streak.type) as any}
            size={24}
            color={theme.colors.accent}
          />
        </View>
        <View style={styles(theme).info}>
          <Text style={styles(theme).title}>{getStreakTitle(streak.type)}</Text>
          <Text style={styles(theme).subtitle}>Keep it going!</Text>
        </View>
      </View>

      <View style={styles(theme).statsContainer}>
        <View style={styles(theme).statItem}>
          <View style={styles(theme).flameContainer}>
            <Ionicons name="flame" size={32} color={getStreakColor(streak.count)} />
            <Text style={[styles(theme).streakCount, {color: getStreakColor(streak.count)}]}>
              {streak.count}
            </Text>
          </View>
          <Text style={styles(theme).statLabel}>Current</Text>
        </View>

        <View style={styles(theme).divider} />

        <View style={styles(theme).statItem}>
          <View style={styles(theme).bestContainer}>
            <Ionicons name="trophy" size={24} color={theme.colors.warning} />
            <Text style={styles(theme).bestCount}>{streak.bestStreak}</Text>
          </View>
          <Text style={styles(theme).statLabel}>Best</Text>
        </View>
      </View>

      {streak.count >= 7 && (
        <View style={styles(theme).encouragement}>
          <Ionicons name="rocket" size={16} color={theme.colors.success} />
          <Text style={styles(theme).encouragementText}>
            {streak.count >= 30
              ? "Amazing! You're unstoppable! 🔥"
              : streak.count >= 14
              ? "You're on fire! Keep it up! 💪"
              : 'Great streak! Keep going! 🎯'}
          </Text>
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
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
    },
    compactContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceSecondary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: 20,
      gap: 6,
    },
    compactCount: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '800',
    },
    compactLabel: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.text.secondary,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.accent + '20',
      alignItems: 'center',
      justifyContent: 'center',
    },
    info: {
      flex: 1,
    },
    title: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    subtitle: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.text.secondary,
    },
    statsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingVertical: theme.spacing.lg,
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
    },
    flameContainer: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.sm,
    },
    streakCount: {
      position: 'absolute',
      ...theme.textStyles.headline3,
      fontWeight: '800',
      top: '50%',
      marginTop: -12,
    },
    bestContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    bestCount: {
      ...theme.textStyles.headline3,
      fontWeight: '800',
      color: theme.colors.text.primary,
      marginTop: 4,
    },
    statLabel: {
      ...theme.textStyles.caption,
      color: theme.colors.text.secondary,
      fontWeight: '600',
    },
    divider: {
      width: 1,
      height: 60,
      backgroundColor: theme.colors.border.light,
    },
    encouragement: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.success + '15',
      padding: theme.spacing.md,
      borderRadius: 12,
      gap: theme.spacing.sm,
    },
    encouragementText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.success,
      fontWeight: '600',
      flex: 1,
    },
  });
