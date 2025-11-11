import React, {useEffect, useRef, useState} from 'react';
import {View, Text, Animated, Dimensions} from 'react-native';
import Svg, {Circle, Defs, LinearGradient, Stop} from 'react-native-svg';
import {useTheme} from '../../contexts/ThemeContext';

interface ScoreGaugeProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  animated?: boolean;
  showLabel?: boolean;
  category?: string;
}

const {width: screenWidth} = Dimensions.get('window');

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  maxScore = 850,
  size = Math.min(screenWidth - 80, 280),
  strokeWidth = 10,
  animated = true,
  showLabel = true,
}) => {
  const {theme} = useTheme();
  const [displayScore, setDisplayScore] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const scoreAnimValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const glowValue = useRef(new Animated.Value(0)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;

  const radius = (size - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;

  // Convert score to percentage for the gauge (using 0.75 arc instead of full circle)
  const scorePercentage = score / maxScore;
  const arcLength = circumference * 0.75; // 270 degrees
  const progress = scorePercentage * arcLength;

  // Enhanced color mapping with gradients - VantageScore ranges
  const getScoreColorInfo = (score: number) => {
    if (score >= 781)
      return {
        primary: '#059669', // Dark Green for Excellent
        secondary: '#047857',
        background: theme.colors.score.excellentBg,
        label: 'Excellent', // 781-850
        gradientId: 'excellentGradient',
      };
    if (score >= 661)
      return {
        primary: '#10B981', // Light Green for Good
        secondary: '#34D399',
        background: theme.colors.score.goodBg,
        label: 'Good', // 661-780
        gradientId: 'goodGradient',
      };
    if (score >= 601)
      return {
        primary: theme.colors.score.fair,
        secondary: '#FCD34D',
        background: theme.colors.score.fairBg,
        label: 'Fair', // 601-660
        gradientId: 'fairGradient',
      };
    return {
      primary: theme.colors.score.poor,
      secondary: '#FCA5A5',
      background: theme.colors.score.poorBg,
      label: 'Poor', // 300-600
      gradientId: 'poorGradient',
    };
  };

  const colorInfo = getScoreColorInfo(score);

  useEffect(() => {
    if (animated) {
      // Enhanced staggered animations with more dynamic effects
      Animated.sequence([
        // First, scale in the component with bounce effect
        Animated.spring(scaleValue, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        // Then fade in the content
        Animated.timing(fadeValue, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Start pulsing animation after initial animations
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseValue, {
              toValue: 1.05,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseValue, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]),
        ).start();
      });

      // Animate the score number counting up with easing
      Animated.timing(scoreAnimValue, {
        toValue: score,
        duration: 2500,
        useNativeDriver: false,
      }).start();

      // Add listener for score counting animation
      const listener = scoreAnimValue.addListener(({value}) => {
        setDisplayScore(Math.round(value));
      });

      // Animate the progress arc with spring effect
      Animated.spring(animatedValue, {
        toValue: progress,
        friction: 8,
        tension: 40,
        useNativeDriver: false,
      }).start();

      // Glow animation for visual impact
      Animated.timing(glowValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();

      // Subtle rotation for dynamic feel
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }).start();
    } else {
      scaleValue.setValue(1);
      fadeValue.setValue(1);
      scoreAnimValue.setValue(score);
      animatedValue.setValue(progress);
      pulseValue.setValue(1);
      glowValue.setValue(1);
      rotateValue.setValue(1);
      setDisplayScore(score);
    }

    // Cleanup function
    return () => {
      scoreAnimValue.removeAllListeners();
    };
  }, [score, animated, progress]);

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  return (
    <Animated.View
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 20,
        },
        {
          transform: [{scale: scaleValue}],
          opacity: fadeValue,
        },
      ]}>
      {/* Main Score Display */}
      <View
        style={{
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
        {/* Enhanced Background Circle with Glow */}
        <Animated.View
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colorInfo.background,
            shadowColor: colorInfo.primary,
            shadowOffset: {width: 0, height: 8},
            shadowOpacity: glowValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.15, 0.25],
            }),
            shadowRadius: glowValue.interpolate({
              inputRange: [0, 1],
              outputRange: [16, 24],
            }),
            elevation: 8,
            transform: [{scale: pulseValue}],
          }}
        />

        {/* Enhanced SVG Progress Circle with Rotation */}
        <Animated.View
          style={{
            position: 'absolute',
            transform: [
              {
                rotate: rotateValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '5deg'],
                }),
              },
            ],
          }}>
          <Svg width={size} height={size}>
            <Defs>
              <LinearGradient id={colorInfo.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={colorInfo.primary} />
                <Stop offset="100%" stopColor={colorInfo.secondary} />
              </LinearGradient>
            </Defs>

            {/* Background Track */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={theme.colors.border.subtle}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeDashoffset={circumference * 0.125} // Start from top-left
              strokeLinecap="round"
            />

            {/* Progress Track */}
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={`url(#${colorInfo.gradientId})`}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeDashoffset={animatedValue.interpolate({
                inputRange: [0, arcLength],
                outputRange: [arcLength + circumference * 0.125, circumference * 0.125],
              })}
              strokeLinecap="round"
            />
          </Svg>
        </Animated.View>

        {/* Center Content */}
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
          }}>
          {/* Animated Score Number */}
          <Text
            style={{
              fontSize: 64,
              fontWeight: '800',
              color: colorInfo.primary,
              fontFamily: theme.typography.fontFamily.displayBold,
              lineHeight: 72,
              textShadowColor: colorInfo.primary + '1A',
              textShadowOffset: {width: 0, height: 2},
              textShadowRadius: 4,
            }}>
            {displayScore}
          </Text>

          {showLabel && (
            <View style={{alignItems: 'center', marginTop: 8}}>
              <Text
                style={{
                  fontSize: 14,
                  color: theme.colors.text.tertiary,
                  fontFamily: theme.typography.fontFamily.medium,
                  letterSpacing: 0.5,
                }}>
                out of {maxScore}
              </Text>
              <View
                style={{
                  marginTop: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 6,
                  backgroundColor: colorInfo.background,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: colorInfo.primary + '20',
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: colorInfo.primary,
                    fontFamily: theme.typography.fontFamily.semibold,
                    letterSpacing: 0.5,
                  }}>
                  {colorInfo.label}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Score Range Indicators */}
      <View
        style={
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: size - 40,
            marginTop: 32,
            paddingHorizontal: 8,
          } as any
        }>
        {[
          {range: '300-600', label: 'Poor', color: theme.colors.score.poor},
          {range: '601-660', label: 'Fair', color: theme.colors.score.fair},
          {range: '661-780', label: 'Good', color: '#10B981'},
          {range: '781-850', label: 'Excellent', color: '#059669'},
        ].map((item, index) => (
          <View key={index} style={{alignItems: 'center', flex: 1}}>
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: item.color,
                marginBottom: 6,
                shadowColor: item.color,
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 3,
              }}
            />
            <Text
              style={{
                fontSize: 11,
                fontWeight: '600',
                color: theme.colors.text.primary,
                marginBottom: 2,
                fontFamily: theme.typography.fontFamily.semibold,
              }}>
              {item.label}
            </Text>
            <Text
              style={{
                fontSize: 9,
                color: theme.colors.text.tertiary,
                fontFamily: theme.typography.fontFamily.regular,
                textAlign: 'center',
              }}>
              {item.range}
            </Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
};
