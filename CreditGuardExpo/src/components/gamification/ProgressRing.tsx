import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Svg, Circle} from 'react-native-svg';
import {useTheme} from '../../contexts/ThemeContext';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  value?: string | number;
  showPercentage?: boolean;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 10,
  color,
  label,
  value,
  showPercentage = false,
}) => {
  const {theme} = useTheme();

  const progressColor = color || theme.colors.accent;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={[styles(theme).container, {width: size, height: size}]}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.colors.border.light}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      {/* Center content */}
      <View style={styles(theme).centerContent}>
        {value !== undefined ? (
          <>
            <Text style={[styles(theme).value, {color: progressColor}]}>{value}</Text>
            {label && <Text style={styles(theme).label}>{label}</Text>}
          </>
        ) : showPercentage ? (
          <>
            <Text style={[styles(theme).percentage, {color: progressColor}]}>
              {Math.round(progress)}%
            </Text>
            {label && <Text style={styles(theme).label}>{label}</Text>}
          </>
        ) : null}
      </View>
    </View>
  );
};

const styles = (theme: any) =>
  StyleSheet.create({
    container: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
    },
    centerContent: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
    },
    value: {
      ...theme.textStyles.headline2,
      fontWeight: '800',
      fontSize: 32,
    },
    percentage: {
      ...theme.textStyles.headline3,
      fontWeight: '800',
    },
    label: {
      ...theme.textStyles.caption,
      color: theme.colors.text.secondary,
      marginTop: 4,
    },
  });
