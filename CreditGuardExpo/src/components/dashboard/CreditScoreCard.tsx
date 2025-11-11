import React from 'react';
import {View, Text} from 'react-native';
import {Colors, TextStyles, Spacing} from '../../constants';
import {createStyles} from '../../utils/styles';

interface CreditScoreCardProps {
  score: number;
  previousScore?: number;
  isLoading?: boolean;
}

export const CreditScoreCard: React.FC<CreditScoreCardProps> = ({
  score,
  previousScore,
  isLoading = false,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 781) return '#059669'; // Excellent: 781-850 - Dark Green
    if (score >= 661) return '#10B981'; // Good: 661-780 - Light Green
    if (score >= 601) return '#F59E0B'; // Fair: 601-660 - Orange
    return '#EF4444'; // Poor: 300-600 - Red
  };

  const getScoreText = (score: number) => {
    if (score >= 781) return 'Excellent'; // 781-850
    if (score >= 661) return 'Good'; // 661-780
    if (score >= 601) return 'Fair'; // 601-660
    return 'Poor'; // 300-600
  };

  const scoreChange = previousScore ? score - previousScore : 0;
  const hasIncrease = scoreChange > 0;
  const hasDecrease = scoreChange < 0;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingState}>
          <Text style={styles.loadingText}>Loading credit score...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Credit Score</Text>
        <Text style={styles.subtitle}>Updated today</Text>
      </View>

      <View style={styles.scoreContainer}>
        <Text style={[styles.score, {color: getScoreColor(score)}]}>{score}</Text>
        <Text style={styles.scoreText}>{getScoreText(score)}</Text>
      </View>

      {previousScore && scoreChange !== 0 && (
        <View style={styles.changeContainer}>
          <Text
            style={[
              styles.changeText,
              {
                color: hasIncrease
                  ? Colors.success
                  : hasDecrease
                    ? Colors.error
                    : Colors.text.secondary,
              },
            ]}>
            {hasIncrease ? '+' : ''}
            {scoreChange} from last month
          </Text>
        </View>
      )}

      <View style={styles.progressBar}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${(score / 850) * 100}%`,
                backgroundColor: getScoreColor(score),
              },
            ]}
          />
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabel}>300</Text>
          <Text style={styles.progressLabel}>850</Text>
        </View>
      </View>
    </View>
  );
};

const styles = createStyles({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
    marginHorizontal: Spacing.md,
    elevation: 2,
    shadowColor: Colors.shadow.light,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...TextStyles.headline3,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
    lineHeight: 56,
  },
  scoreText: {
    ...TextStyles.bodyLarge,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
    fontWeight: '600',
  },
  changeContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  changeText: {
    ...TextStyles.bodyRegular,
    fontWeight: '500',
  },
  progressBar: {
    marginTop: Spacing.md,
  },
  progressTrack: {
    height: 6,
    backgroundColor: Colors.border.light,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  progressLabel: {
    ...TextStyles.caption,
    color: Colors.text.tertiary,
  },
  loadingState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  loadingText: {
    ...TextStyles.bodyRegular,
    color: Colors.text.secondary,
  },
});
