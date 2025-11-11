import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface CreditScoreCircleProps {
  score: number;
  maxScore?: number;
  size?: number;
}

export const CreditScoreCircle: React.FC<CreditScoreCircleProps> = ({
  score,
  maxScore = 850,
  size = 120,
}) => {
  const percentage = (score / maxScore) * 100;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 781) return '#059669'; // Excellent: 781-850 - Dark Green
    if (score >= 661) return '#10B981'; // Good: 661-780 - Light Green
    if (score >= 601) return '#F59E0B'; // Fair: 601-660 - Orange
    return '#DC2626'; // Poor: 300-600 - Red
  };

  const getScoreCategory = () => {
    if (score >= 781) return 'Excellent'; // 781-850
    if (score >= 661) return 'Good'; // 661-780
    if (score >= 601) return 'Fair'; // 601-660
    return 'Poor'; // 300-600
  };

  const scoreColor = getScoreColor();

  return (
    <View style={[styles.container, {width: size, height: size}]}>
      {/* Background Circle */}
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: '#E5E7EB',
          },
        ]}
      />

      {/* Progress Circle */}
      <View
        style={[
          styles.circle,
          styles.progressCircle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: scoreColor,
            transform: [{rotate: '-90deg'}],
          },
        ]}
      />

      {/* Score Text */}
      <View style={styles.textContainer}>
        <Text style={[styles.scoreText, {color: scoreColor}]}>{score}</Text>
        <Text style={styles.categoryText}>{getScoreCategory()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
  },
  progressCircle: {
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
    lineHeight: 42,
  },
  categoryText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
});
