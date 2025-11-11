import React, {useEffect, useRef} from 'react';
import {View, Text, StyleProp, ViewStyle, Animated, Easing} from 'react-native';

import {Colors, Spacing, TextStyles} from '../../constants';
import {createStyles} from '../../utils/styles';

export type RegistrationProgressStep = {
  label: string;
  subLabel?: string;
  key?: string;
};

const DEFAULT_STEPS: RegistrationProgressStep[] = [
  {label: 'Register'},
  {label: 'Verify ID'},
  {label: 'Verify Contact'},
];

type RegistrationProgressBarProps = {
  currentStep: number;
  steps?: RegistrationProgressStep[];
  containerStyle?: StyleProp<ViewStyle>;
  compact?: boolean;
};

export const RegistrationProgressBar: React.FC<RegistrationProgressBarProps> = ({
  currentStep,
  steps = DEFAULT_STEPS,
  containerStyle,
  compact = false,
}) => {
  const normalizedStep = Math.max(0, Math.min(currentStep, steps.length));
  const activeIndex = Math.min(normalizedStep, steps.length - 1);
  const isComplete = normalizedStep >= steps.length;
  const connectorCount = Math.max(steps.length - 1, 0);
  const connectorValuesRef = useRef<Animated.Value[]>([]);
  const circleScalesRef = useRef<Animated.Value[]>([]);
  const circlePulsesRef = useRef<Animated.Value[]>([]);

  // Initialize connector animation values
  if (connectorValuesRef.current.length !== connectorCount) {
    const existingValues = connectorValuesRef.current;
    connectorValuesRef.current = Array.from({length: connectorCount}, (_, index) => {
      return existingValues[index] ?? new Animated.Value(0);
    });
  }

  // Initialize circle scale animation values
  if (circleScalesRef.current.length !== steps.length) {
    const existingScales = circleScalesRef.current;
    circleScalesRef.current = Array.from({length: steps.length}, (_, index) => {
      return existingScales[index] ?? new Animated.Value(normalizedStep >= index ? 1 : 0.85);
    });
  }

  // Initialize circle pulse animation values for active state
  if (circlePulsesRef.current.length !== steps.length) {
    const existingPulses = circlePulsesRef.current;
    circlePulsesRef.current = Array.from({length: steps.length}, (_, index) => {
      return existingPulses[index] ?? new Animated.Value(1);
    });
  }

  // Animate connectors
  useEffect(() => {
    connectorValuesRef.current.forEach((value, index) => {
      const target = normalizedStep >= index + 1 ? 1 : 0;

      Animated.spring(value, {
        toValue: target,
        friction: 8,
        tension: 40,
        useNativeDriver: false,
      }).start();
    });
  }, [normalizedStep, connectorCount]);

  // Animate circle scales and pulses
  useEffect(() => {
    circleScalesRef.current.forEach((scale, index) => {
      const isStepCompleted = normalizedStep > index;
      const isStepActive = !isComplete && index === activeIndex;
      const target = isStepCompleted || isStepActive ? 1 : 0.85;

      Animated.spring(scale, {
        toValue: target,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }).start();

      // Pulse animation for active step
      if (isStepActive) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(circlePulsesRef.current[index], {
              toValue: 1.1,
              duration: 1000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(circlePulsesRef.current[index], {
              toValue: 1,
              duration: 1000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
        ).start();
      } else {
        circlePulsesRef.current[index].setValue(1);
      }
    });
  }, [normalizedStep, activeIndex, isComplete, steps.length]);

  const connectorValues = connectorValuesRef.current;
  const circleScales = circleScalesRef.current;
  const circlePulses = circlePulsesRef.current;
  return (
    <View style={[styles.container, compact && styles.compactContainer, containerStyle]}>
      {steps.map((step, index) => {
        const isCompleted = isComplete || normalizedStep > index;
        const isActive = !isComplete && index === activeIndex;

        return (
          <View key={step.key ?? `${step.label}-${index}`} style={styles.stepWrapper}>
            <View style={[styles.stepHeader, compact && styles.stepHeaderCompact]}>
              <View
                style={[
                  styles.connectorWrapper,
                  compact && styles.connectorWrapperCompact,
                  index === 0 && styles.connectorHidden,
                ]}>
                {index > 0 ? (
                  <Animated.View
                    style={[
                      styles.connectorActive,
                      {
                        width: connectorValues[index - 1].interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%'],
                        }),
                      },
                    ]}
                  />
                ) : null}
              </View>
              <Animated.View
                style={[
                  styles.stepCircle,
                  isCompleted && styles.stepCircleCompleted,
                  isActive && styles.stepCircleActive,
                  compact && styles.stepCircleCompact,
                  {
                    transform: [
                      {scale: circleScales[index]},
                      {scale: isActive ? circlePulses[index] : 1},
                    ],
                  },
                ]}>
                {isCompleted ? (
                  <Animated.Text
                    style={[
                      styles.stepCheck,
                      {
                        opacity: circleScales[index],
                      },
                    ]}>
                    ✓
                  </Animated.Text>
                ) : (
                  <Text style={[styles.stepIndex, compact && styles.stepIndexCompact]}>
                    {index + 1}
                  </Text>
                )}
              </Animated.View>
              <View
                style={[
                  styles.connectorWrapper,
                  compact && styles.connectorWrapperCompact,
                  index === steps.length - 1 && styles.connectorHidden,
                ]}>
                {index < steps.length - 1 ? (
                  <Animated.View
                    style={[
                      styles.connectorActive,
                      {
                        width: connectorValues[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%'],
                        }),
                      },
                    ]}
                  />
                ) : null}
              </View>
            </View>

            <Animated.View
              style={[
                styles.stepLabelContainer,
                /* eslint-disable-next-line react-native/no-inline-styles */
                {
                  opacity: isActive || isCompleted ? 1 : 0.6,
                },
              ]}>
              <Text
                style={[
                  styles.stepLabel,
                  isActive && styles.stepLabelActive,
                  compact && styles.stepLabelCompact,
                ]}
                numberOfLines={2}
                adjustsFontSizeToFit
                minimumFontScale={0.8}>
                {step.label}
              </Text>
              {step.subLabel ? (
                <Text
                  style={[
                    styles.stepSubLabel,
                    isActive && styles.stepSubLabelActive,
                    compact && styles.stepSubLabelCompact,
                  ]}
                  numberOfLines={2}
                  adjustsFontSizeToFit
                  minimumFontScale={0.85}>
                  {step.subLabel}
                </Text>
              ) : null}
            </Animated.View>
          </View>
        );
      })}
    </View>
  );
};

const styles = createStyles({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border.light,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: Spacing.lg,
  },
  compactContainer: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 16,
    marginBottom: Spacing.md,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  stepWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
    width: '100%',
  },
  stepHeaderCompact: {
    marginBottom: Spacing.xxs,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: Colors.border.medium,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    marginHorizontal: Spacing.xs,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stepCircleActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.transparent.primary,
    borderWidth: 3,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  stepCircleCompleted: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
    borderWidth: 3,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  stepCircleCompact: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    marginHorizontal: Spacing.xxs,
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  connectorWrapper: {
    flex: 1,
    height: 5,
    backgroundColor: Colors.border.light,
    borderRadius: 3,
    overflow: 'hidden',
  },
  connectorWrapperCompact: {
    height: 3,
    borderRadius: 2,
  },
  connectorActive: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: Colors.primary,
    borderRadius: 3,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  connectorHidden: {
    opacity: 0,
  },
  stepIndex: {
    ...TextStyles.bodyMedium,
    color: Colors.text.secondary,
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 16,
  },
  stepIndexCompact: {
    fontSize: 13,
    fontWeight: '600',
  },
  stepCheck: {
    ...TextStyles.bodyMedium,
    color: Colors.text.inverse,
    fontWeight: '700',
    fontSize: 18,
  },
  stepLabelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
  },
  stepLabel: {
    ...TextStyles.bodySmall,
    fontWeight: '600',
    color: Colors.text.secondary,
    textAlign: 'center',
    flexShrink: 1,
    maxWidth: 96,
    fontSize: 11,
  },
  stepLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  stepLabelCompact: {
    fontSize: 11,
    maxWidth: 72,
  },
  stepSubLabel: {
    ...TextStyles.bodySmall,
    color: Colors.text.tertiary,
    marginTop: Spacing.xxs,
    textAlign: 'center',
    flexShrink: 1,
    maxWidth: 96,
  },
  stepSubLabelActive: {
    color: Colors.text.primary,
    fontWeight: '500',
  },
  stepSubLabelCompact: {
    fontSize: 11,
  },
});

export default RegistrationProgressBar;
