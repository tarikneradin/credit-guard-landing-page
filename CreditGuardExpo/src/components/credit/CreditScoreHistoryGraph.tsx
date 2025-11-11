import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {Svg, Path, Circle, Defs, LinearGradient, Stop, Line} from 'react-native-svg';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {ScoreHistoryPoint} from '../../data/mockData';
import type {Theme} from '../../constants/Themes';

const {width: screenWidth} = Dimensions.get('window');

interface CreditScoreHistoryGraphProps {
  data: ScoreHistoryPoint[];
}

const GRAPH_PADDING = 30;

export const CreditScoreHistoryGraph: React.FC<CreditScoreHistoryGraphProps> = ({data}) => {
  const {theme} = useTheme();

  if (!data || data.length === 0) {
    return null;
  }

  // Validate data to prevent NaN/Invalid Date rendering
  const hasInvalidData = data.some(
    point =>
      !point.date ||
      isNaN(point.date.getTime()) ||
      typeof point.score !== 'number' ||
      isNaN(point.score),
  );

  if (hasInvalidData) {
    return null;
  }

  // Graph dimensions with space for Y-axis labels
  const containerWidth = screenWidth - 48;
  const yAxisWidth = 50; // Space for Y-axis labels
  const graphWidth = containerWidth - yAxisWidth - 32;
  const graphHeight = 180;

  // Calculate scores
  const minScore = 300;
  const maxScore = 850;
  const scoreRange = maxScore - minScore;
  // const highestScore = Math.max(...data.map(d => d.score));
  // const lowestScore = Math.min(...data.map(d => d.score));
  const startScore = data[0].score;
  const endScore = data[data.length - 1].score;
  const overallChange = endScore - startScore;
  const changePercentage = ((overallChange / startScore) * 100).toFixed(1);

  // Y-axis ticks (show 5 values evenly distributed)
  const yAxisTicks = [
    maxScore,
    Math.round(maxScore - scoreRange * 0.25),
    Math.round(maxScore - scoreRange * 0.5),
    Math.round(maxScore - scoreRange * 0.75),
    minScore,
  ];

  // Create SVG path
  const createPath = () => {
    const points = data.map((point, index) => {
      const x = GRAPH_PADDING + (index / (data.length - 1)) * (graphWidth - GRAPH_PADDING * 2);
      const y =
        graphHeight - ((point.score - minScore) / scoreRange) * (graphHeight - GRAPH_PADDING - 10);
      return {x, y, ...point};
    });

    const pathData = points
      .map((point, index) => {
        if (index === 0) {
          return `M ${point.x} ${point.y}`;
        }
        const prevPoint = points[index - 1];
        const controlX = (prevPoint.x + point.x) / 2;
        return `Q ${controlX} ${prevPoint.y}, ${point.x} ${point.y}`;
      })
      .join(' ');

    const areaPathData =
      pathData +
      ` L ${points[points.length - 1].x} ${graphHeight} L ${GRAPH_PADDING} ${graphHeight} Z`;

    return {pathData, areaPathData, points};
  };

  const {pathData, areaPathData, points} = createPath();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {month: 'short'});
  };

  return (
    <View style={styles(theme).container}>
      {/* Header with Stats */}
      <View style={styles(theme).header}>
        <View style={styles(theme).headerLeft}>
          <View style={styles(theme).iconCircle}>
            <Ionicons name="trending-up" size={20} color={theme.colors.accent} />
          </View>
          <View>
            <Text style={styles(theme).title}>Score Trend</Text>
            <Text style={styles(theme).subtitle}>Last {data.length} months</Text>
          </View>
        </View>
        <View style={styles(theme).headerRight}>
          <Text style={styles(theme).currentScore}>{endScore}</Text>
          <View style={styles(theme).changeContainer}>
            <Ionicons
              name={overallChange >= 0 ? 'arrow-up' : 'arrow-down'}
              size={14}
              color={overallChange >= 0 ? theme.colors.success : theme.colors.error}
            />
            <Text
              style={[
                styles(theme).changeText,
                {color: overallChange >= 0 ? theme.colors.success : theme.colors.error},
              ]}>
              {overallChange >= 0 ? '+' : ''}
              {overallChange} ({changePercentage}%)
            </Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={styles(theme).divider} />

      {/* Graph with Y-axis */}
      <View style={styles(theme).chartWrapper}>
        {/* Y-axis labels */}
        <View style={styles(theme).yAxis}>
          {yAxisTicks.map((tick, index) => (
            <Text key={index} style={styles(theme).yAxisLabel}>
              {tick}
            </Text>
          ))}
        </View>

        {/* Graph */}
        <View style={styles(theme).graphContainer}>
          <Svg width={graphWidth} height={graphHeight}>
            <Defs>
              <LinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={theme.colors.accent} stopOpacity="0.3" />
                <Stop offset="1" stopColor={theme.colors.accent} stopOpacity="0.0" />
              </LinearGradient>
            </Defs>

            {/* Horizontal grid lines */}
            {yAxisTicks.map((tick, index) => {
              const y = (index / (yAxisTicks.length - 1)) * (graphHeight - GRAPH_PADDING - 10) + 10;
              return (
                <Line
                  key={index}
                  x1={GRAPH_PADDING}
                  y1={y}
                  x2={graphWidth - GRAPH_PADDING}
                  y2={y}
                  stroke={theme.colors.border.light}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.5"
                />
              );
            })}

            {/* Area fill */}
            <Path d={areaPathData} fill="url(#areaGradient)" />

            {/* Score line */}
            <Path
              d={pathData}
              stroke={theme.colors.accent}
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {points.map((point, index) => (
              <Circle
                key={index}
                cx={point.x}
                cy={point.y}
                r={5}
                fill={theme.colors.surface}
                stroke={theme.colors.accent}
                strokeWidth="3"
              />
            ))}
          </Svg>
        </View>
      </View>

      {/* X-axis labels */}
      <View style={styles(theme).xAxis}>
        {data.map((point, index) => {
          // Show first, last, and every other point for 6-7 months
          const showLabel =
            index === 0 || index === data.length - 1 || (data.length <= 7 && index % 2 === 0);

          if (!showLabel) return null;

          return (
            <Text key={index} style={styles(theme).xAxisLabel}>
              {formatDate(point.date)}
            </Text>
          );
        })}
      </View>
    </View>
  );
};

const styles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      padding: theme.spacing.xl,
      marginBottom: theme.spacing.lg,
      shadowColor: theme.colors.shadow.medium,
      shadowOffset: {width: 0, height: 6},
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 5,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.lg,
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
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    subtitle: {
      ...theme.textStyles.caption,
      color: theme.colors.text.secondary,
      fontSize: 12,
    },
    headerRight: {
      alignItems: 'flex-end',
    },
    currentScore: {
      ...theme.textStyles.headline2,
      fontWeight: '800',
      color: theme.colors.accent,
      marginBottom: 4,
      fontSize: 32,
    },
    changeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    changeText: {
      ...theme.textStyles.bodySmall,
      fontWeight: '700',
      fontSize: 12,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border.light,
      marginBottom: theme.spacing.lg,
    },
    chartWrapper: {
      flexDirection: 'row',
      alignItems: 'stretch',
      marginBottom: theme.spacing.md,
    },
    yAxis: {
      width: 50,
      justifyContent: 'space-between',
      paddingTop: 10,
      paddingBottom: GRAPH_PADDING + 10,
      paddingRight: 12,
    },
    yAxisLabel: {
      ...theme.textStyles.caption,
      color: theme.colors.text.tertiary,
      fontSize: 11,
      fontWeight: '600',
      textAlign: 'right',
    },
    graphContainer: {
      flex: 1,
    },
    xAxis: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: GRAPH_PADDING,
      paddingLeft: 50 + GRAPH_PADDING, // Account for Y-axis width
    },
    xAxisLabel: {
      ...theme.textStyles.caption,
      color: theme.colors.text.tertiary,
      fontSize: 11,
      fontWeight: '600',
    },
  });
