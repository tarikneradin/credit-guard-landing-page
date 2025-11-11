import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {ScoreHistoryPoint} from '../../data/mockData';
import type {Theme} from '../../constants/Themes';

interface ScoreTrendCardProps {
  data: ScoreHistoryPoint[];
}

export const ScoreTrendCard: React.FC<ScoreTrendCardProps> = () => {
  const {theme} = useTheme();

  // Hardcoded test data for demonstration: 560 -> 650 -> 590 -> 670 -> 800
  const testData: ScoreHistoryPoint[] = [
    {date: new Date(2024, 6, 1), score: 560}, // July
    {date: new Date(2024, 7, 1), score: 650}, // August
    {date: new Date(2024, 8, 1), score: 590}, // September
    {date: new Date(2024, 9, 1), score: 670}, // October
    {date: new Date(2024, 10, 1), score: 800}, // November
  ];

  // Use test data instead of props data
  const recentData = testData;

  const startScore = recentData[0].score;
  const endScore = recentData[recentData.length - 1].score;
  const overallChange = endScore - startScore;
  const changePercentage = ((overallChange / startScore) * 100).toFixed(1);

  // Get min and max for the data range
  const scores = recentData.map(d => d.score);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const scoreRange = maxScore - minScore || 1; // Avoid division by zero

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
  };

  const getScoreColor = (score: number) => {
    if (score >= 781) return '#059669'; // Excellent: 781-850 - Dark Green
    if (score >= 661) return '#10B981'; // Good: 661-780 - Light Green
    if (score >= 601) return theme.colors.warning; // Fair: 601-660 - Orange
    return theme.colors.error; // Poor: 300-600 - Red
  };

  const getTrendIcon = () => {
    if (overallChange > 0) return 'trending-up';
    if (overallChange < 0) return 'trending-down';
    return 'remove';
  };

  const getTrendColor = () => {
    if (overallChange > 0) return theme.colors.success;
    if (overallChange < 0) return theme.colors.error;
    return theme.colors.text.secondary;
  };

  // Check if we have enough data to show a journey
  const hasInsufficientData = recentData.length <= 1;

  return (
    <View style={styles(theme).container}>
      {/* Header */}
      <View style={styles(theme).header}>
        <View style={styles(theme).headerLeft}>
          <View style={styles(theme).iconCircle}>
            <Ionicons name="pulse" size={20} color={theme.colors.accent} />
          </View>
          <View>
            <Text style={styles(theme).title}>Score Journey</Text>
            <Text style={styles(theme).subtitle}>
              {hasInsufficientData ? 'Building your history' : `Last ${recentData.length} months`}
            </Text>
          </View>
        </View>
        {!hasInsufficientData && (
          <View style={styles(theme).trendBadge}>
            <Ionicons name={getTrendIcon()} size={16} color={getTrendColor()} />
            <Text style={[styles(theme).trendText, {color: getTrendColor()}]}>
              {overallChange >= 0 ? '+' : ''}
              {overallChange}
            </Text>
          </View>
        )}
      </View>

      <View style={styles(theme).divider} />

      {/* Show empty state if insufficient data */}
      {hasInsufficientData ? (
        <View style={styles(theme).emptyStateContainer}>
          <View style={styles(theme).emptyStateIcon}>
            <Ionicons name="bar-chart-outline" size={48} color={theme.colors.accent + '40'} />
          </View>
          <Text style={styles(theme).emptyStateTitle}>Your Journey Starts Here</Text>
          <Text style={styles(theme).emptyStateDescription}>
            Your score journey will appear once we collect more credit score history. Check back
            soon to see your progress over time!
          </Text>
        </View>
      ) : (
        <>
          {/* Milestone Cards */}
          <View style={styles(theme).milestonesContainer}>
            {recentData.map((point, index) => {
              const isFirst = index === 0;
              const isLast = index === recentData.length - 1;
              const prevScore = index > 0 ? recentData[index - 1].score : point.score;
              const change = point.score - prevScore;
              const barHeight = ((point.score - minScore) / scoreRange) * 60 + 20; // Min 20px, max 80px

              return (
                <View key={index} style={styles(theme).milestoneItem}>
                  {/* Bar */}
                  <View style={styles(theme).barContainer}>
                    <View
                      style={[
                        styles(theme).bar,
                        {
                          height: barHeight,
                          backgroundColor: getScoreColor(point.score) + '20',
                          borderColor: getScoreColor(point.score),
                        },
                      ]}>
                      {/* Score Dot */}
                      <View
                        style={[
                          styles(theme).scoreDot,
                          {
                            backgroundColor: getScoreColor(point.score),
                          },
                        ]}
                      />
                    </View>
                  </View>

                  {/* Score Value */}
                  <Text
                    style={[
                      styles(theme).scoreValue,
                      isLast && styles(theme).scoreValueCurrent,
                      {color: isLast ? theme.colors.accent : theme.colors.text.primary},
                    ]}>
                    {point.score}
                  </Text>

                  {/* Change Indicator */}
                  {!isFirst && change !== 0 && (
                    <View
                      style={[
                        styles(theme).changeIndicator,
                        {
                          backgroundColor:
                            change > 0
                              ? theme.colors.success + '15'
                              : change < 0
                                ? theme.colors.error + '15'
                                : 'transparent',
                        },
                      ]}>
                      <Text
                        style={[
                          styles(theme).changeValue,
                          {color: change > 0 ? theme.colors.success : theme.colors.error},
                        ]}>
                        {change > 0 ? '+' : ''}
                        {change}
                      </Text>
                    </View>
                  )}

                  {/* Date */}
                  <Text style={styles(theme).dateLabel}>{formatDate(point.date)}</Text>
                </View>
              );
            })}
          </View>

          {/* Summary Footer */}
          {!hasInsufficientData && (
            <View style={styles(theme).footer}>
              <View style={styles(theme).footerItem}>
                <Ionicons name="arrow-up-circle" size={16} color={theme.colors.success} />
                <Text style={styles(theme).footerLabel}>Highest</Text>
                <Text style={styles(theme).footerValue}>{maxScore}</Text>
              </View>
              <View style={styles(theme).footerDivider} />
              <View style={styles(theme).footerItem}>
                <Ionicons name="arrow-down-circle" size={16} color={theme.colors.error} />
                <Text style={styles(theme).footerLabel}>Lowest</Text>
                <Text style={styles(theme).footerValue}>{minScore}</Text>
              </View>
              <View style={styles(theme).footerDivider} />
              <View style={styles(theme).footerItem}>
                <Ionicons name="analytics" size={16} color={theme.colors.accent} />
                <Text style={styles(theme).footerLabel}>Overall</Text>
                <Text
                  style={[
                    styles(theme).footerValue,
                    {color: overallChange >= 0 ? theme.colors.success : theme.colors.error},
                  ]}>
                  {changePercentage}%
                </Text>
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      padding: theme.spacing.lg,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 4,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    iconCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.accent + '15',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      ...theme.textStyles.headline4,
      color: theme.colors.text.primary,
      fontWeight: '700',
    },
    subtitle: {
      ...theme.textStyles.caption,
      color: theme.colors.text.secondary,
      marginTop: 2,
    },
    trendBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: theme.colors.surfaceSecondary,
    },
    trendText: {
      ...theme.textStyles.bodyMedium,
      fontWeight: '700',
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border.subtle,
      marginBottom: theme.spacing.lg,
    },
    milestonesContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: theme.spacing.lg,
      paddingHorizontal: theme.spacing.xs,
    },
    milestoneItem: {
      flex: 1,
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    barContainer: {
      height: 100,
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    bar: {
      width: 28,
      borderRadius: 14,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: 4,
    },
    scoreDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    scoreValue: {
      ...theme.textStyles.bodyMedium,
      fontWeight: '700',
      color: theme.colors.text.primary,
    },
    scoreValueCurrent: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '800',
    },
    changeIndicator: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
    },
    changeValue: {
      ...theme.textStyles.caption,
      fontWeight: '700',
      fontSize: 10,
    },
    dateLabel: {
      ...theme.textStyles.caption,
      color: theme.colors.text.tertiary,
      fontSize: 9,
      textAlign: 'center',
    },
    footer: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surfaceSecondary,
      borderRadius: 12,
      padding: theme.spacing.md,
      justifyContent: 'space-around',
    },
    footerItem: {
      flex: 1,
      alignItems: 'center',
      gap: 4,
    },
    footerDivider: {
      width: 1,
      backgroundColor: theme.colors.border.subtle,
      marginHorizontal: theme.spacing.sm,
    },
    footerLabel: {
      ...theme.textStyles.caption,
      color: theme.colors.text.secondary,
      fontSize: 10,
    },
    footerValue: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.primary,
      fontWeight: '700',
    },
    emptyStateContainer: {
      paddingVertical: theme.spacing.xxxl,
      paddingHorizontal: theme.spacing.xl,
      alignItems: 'center',
    },
    emptyStateIcon: {
      marginBottom: theme.spacing.lg,
    },
    emptyStateTitle: {
      ...theme.textStyles.headline4,
      color: theme.colors.text.primary,
      fontWeight: '600',
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    emptyStateDescription: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      lineHeight: 22,
    },
  });
