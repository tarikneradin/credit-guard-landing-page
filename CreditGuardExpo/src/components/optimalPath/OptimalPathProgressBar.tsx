import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {OptimalPathProgress} from '../../types/optimalPath';

interface OptimalPathProgressBarProps {
  currentScore: number;
  targetScore: number;
  pointsBuilt: number;
  totalPotentialPoints: number;
  onTrack: boolean;
}

export const OptimalPathProgressBar: React.FC<OptimalPathProgressBarProps> = ({
  currentScore,
  targetScore,
  pointsBuilt,
  totalPotentialPoints,
  onTrack,
}) => {
  const {theme} = useTheme();

  // Calculate progress percentage based on score gap
  const scoreGap = targetScore - (currentScore - pointsBuilt); // Original gap
  const remainingGap = targetScore - currentScore; // Remaining gap to reach target
  const progressPercent =
    totalPotentialPoints > 0 ? (pointsBuilt / totalPotentialPoints) * 100 : 0;

  // Calculate position of current score marker on the bar
  const markerPercent =
    scoreGap > 0 ? ((currentScore - (currentScore - pointsBuilt)) / scoreGap) * 100 : 100;

  return (
    <View style={styles(theme).container}>
      {/* Goal Header */}
      <View style={styles(theme).goalHeader}>
        <View style={styles(theme).goalRow}>
          <Ionicons name="flag" size={18} color={theme.colors.accent} style={{marginRight: theme.spacing.sm}} />
          <Text style={styles(theme).goalText} numberOfLines={1}>
            Goal: Reach {targetScore} score for mortgage
          </Text>
        </View>
      </View>
      {/* Score Labels */}
      <View style={styles(theme).scoreRow}>
        <View style={styles(theme).scoreItem}>
          <Text style={styles(theme).scoreLabel}>CURRENT</Text>
          <Text style={styles(theme).scoreValue}>{currentScore}</Text>
        </View>

        <View style={styles(theme).arrowContainer}>
          <Ionicons name="arrow-forward" size={32} color={theme.colors.primary} />
          <Text style={styles(theme).pointsBuiltText}>+{pointsBuilt} pts built</Text>
        </View>

        <View style={styles(theme).scoreItem}>
          <Text style={styles(theme).scoreLabel}>TARGET</Text>
          <Text style={[styles(theme).scoreValue, {color: theme.colors.primary}]}>
            {targetScore}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles(theme).progressBarContainer}>
        <View style={styles(theme).progressBarBackground}>
          {/* Completed progress (green) */}
          <View
            style={[
              styles(theme).progressBarCompleted,
              {
                width: `${progressPercent}%`,
                backgroundColor: onTrack ? theme.colors.success : theme.colors.warning,
              },
            ]}
          />

          {/* Remaining progress (gray) */}
          <View
            style={[
              styles(theme).progressBarRemaining,
              {
                left: `${progressPercent}%`,
                width: `${100 - progressPercent}%`,
              },
            ]}
          />

          {/* Current position marker - "You are here" */}
          {progressPercent > 0 && progressPercent < 100 && (
            <View
              style={[
                styles(theme).currentMarker,
                {
                  left: `${progressPercent}%`,
                },
              ]}>
              <View style={styles(theme).markerPin} />
              <View style={styles(theme).markerLabelContainer}>
                <Text style={styles(theme).markerLabel}>You are here</Text>
                <View style={styles(theme).markerArrow} />
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Status Text */}
      <View style={styles(theme).statusRow}>
        <View style={styles(theme).statusItem}>
          <Ionicons
            name={onTrack ? 'checkmark-circle' : 'warning'}
            size={16}
            color={onTrack ? theme.colors.success : theme.colors.warning}
          />
          <Text
            style={[
              styles(theme).statusText,
              {color: onTrack ? theme.colors.success : theme.colors.warning},
            ]}>
            {onTrack ? 'On track to reach goal' : 'Behind schedule'}
          </Text>
        </View>
        <Text style={styles(theme).progressText}>
          {Math.round(progressPercent)}% complete
        </Text>
      </View>
    </View>
  );
};

const styles = (theme: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
    },
    goalHeader: {
      marginBottom: theme.spacing.lg,
    },
    goalRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    goalText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text.primary,
      flex: 1,
    },
    scoreRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg,
    },
    scoreItem: {
      alignItems: 'center',
    },
    scoreLabel: {
      ...theme.textStyles.caption,
      fontWeight: '600',
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xs,
      letterSpacing: 0.5,
    },
    scoreValue: {
      ...theme.textStyles.headline1,
      fontWeight: '800',
      color: theme.colors.text.primary,
      letterSpacing: 0.3,
    },
    arrowContainer: {
      alignItems: 'center',
      flex: 1,
      marginHorizontal: theme.spacing.md,
    },
    pointsBuiltText: {
      ...theme.textStyles.caption,
      fontWeight: '700',
      color: theme.colors.success,
      marginTop: theme.spacing.xs,
      letterSpacing: 0.3,
    },
    progressBarContainer: {
      marginBottom: theme.spacing.xl + theme.spacing.md,
    },
    progressBarBackground: {
      height: 12,
      backgroundColor: theme.colors.border,
      borderRadius: 6,
      position: 'relative',
      overflow: 'visible',
    },
    progressBarCompleted: {
      position: 'absolute',
      left: 0,
      top: 0,
      height: 12,
      borderRadius: 6,
    },
    progressBarRemaining: {
      position: 'absolute',
      top: 0,
      height: 12,
      backgroundColor: theme.colors.border,
      borderRadius: 6,
    },
    currentMarker: {
      position: 'absolute',
      top: -8,
      transform: [{translateX: -10}],
      alignItems: 'center',
    },
    markerPin: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.colors.primary,
      borderWidth: 3,
      borderColor: theme.colors.surface,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 4,
    },
    markerLabelContainer: {
      position: 'absolute',
      top: 28,
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: 6,
      minWidth: 80,
      alignItems: 'center',
    },
    markerLabel: {
      ...theme.textStyles.caption,
      fontWeight: '600',
      color: theme.colors.surface,
      fontSize: 10,
    },
    markerArrow: {
      position: 'absolute',
      top: -4,
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: 4,
      borderRightWidth: 4,
      borderBottomWidth: 4,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: theme.colors.primary,
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    statusItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    statusText: {
      ...theme.textStyles.bodyMedium,
      fontWeight: '700',
      letterSpacing: 0.2,
    },
    progressText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
      fontWeight: '600',
      letterSpacing: 0.2,
    },
  });
