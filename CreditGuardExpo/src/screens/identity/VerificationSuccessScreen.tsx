import React, {useEffect, useMemo, useRef} from 'react';
import {View, Text, Animated, Easing, StyleSheet, useWindowDimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {CreditButton, CreditCard} from '../../components/design-system';
import {useAuthStore} from '../../stores/authStore';
import {verificationSuccessStyles as styles} from '../../styles/identity/verificationSuccessStyles';
import {RegistrationProgressBar} from '../../components/registration/RegistrationProgressBar';

const CONFETTI_COLORS = ['#FF4D6D', '#FFC300', '#4CD964', '#5AC8FA', '#AF52DE'];
const CONFETTI_COUNT = 36;
const SHOOT_ORIGIN_OFFSET = 32;

type ConfettiPieceConfig = {
  id: number;
  size: number;
  heightMultiplier: number;
  hue: string;
  horizontalOffset: number;
  horizontalDrift: number;
  peakHeight: number;
  rotation: number;
  delay: number;
  fallDuration: number;
  riseDuration: number;
};

const ConfettiOverlay: React.FC = () => {
  const {width, height} = useWindowDimensions();
  const confettiPieces = useMemo<ConfettiPieceConfig[]>(() => {
    return Array.from({length: CONFETTI_COUNT}).map((_, index) => {
      const size = 8 + Math.random() * 18;
      const horizontalOffset = (Math.random() - 0.5) * SHOOT_ORIGIN_OFFSET * 2;
      return {
        id: index,
        size,
        heightMultiplier: 0.4 + Math.random() * 0.8,
        hue: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
        horizontalOffset,
        horizontalDrift: (Math.random() - 0.5) * width * 0.6,
        peakHeight: height * (0.35 + Math.random() * 0.25),
        rotation: (Math.random() - 0.5) * 720,
        delay: Math.random() * 350,
        riseDuration: 350 + Math.random() * 180,
        fallDuration: 900 + Math.random() * 600,
      };
    });
  }, [height, width]);

  return (
    <View pointerEvents="none" style={confettiStyles.overlay}>
      {confettiPieces.map(piece => (
        <ConfettiPiece key={piece.id} config={piece} parentWidth={width} parentHeight={height} />
      ))}
    </View>
  );
};

type ConfettiPieceProps = {
  config: ConfettiPieceConfig;
  parentWidth: number;
  parentHeight: number;
};

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({config, parentWidth, parentHeight}) => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;

    const runAnimation = () => {
      animation.setValue(0);
      Animated.sequence([
        Animated.delay(config.delay),
        Animated.timing(animation, {
          toValue: 0.45,
          duration: config.riseDuration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 1,
          duration: config.fallDuration,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(({finished}) => {
        if (finished && isMounted) {
          Animated.delay(200 + Math.random() * 300).start(() => {
            if (isMounted) {
              runAnimation();
            }
          });
        }
      });
    };

    runAnimation();

    return () => {
      isMounted = false;
    };
  }, [animation, config.delay, config.fallDuration, config.riseDuration]);

  const originX = parentWidth / 2 + config.horizontalOffset;
  const startY = parentHeight * 0.15;
  const translateY = animation.interpolate({
    inputRange: [0, 0.45, 1],
    outputRange: [startY, startY - config.peakHeight, parentHeight + 50],
  });
  const translateX = animation.interpolate({
    inputRange: [0, 0.45, 1],
    outputRange: [
      originX,
      originX + config.horizontalDrift * 0.5,
      originX + config.horizontalDrift,
    ],
  });
  const rotate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${config.rotation}deg`],
  });
  const scale = animation.interpolate({
    inputRange: [0, 0.2, 0.8, 1],
    outputRange: [0.5, 1.1, 0.95, 1],
  });

  return (
    <Animated.View
      style={[
        confettiStyles.piece,
        {
          width: config.size,
          height: config.size * config.heightMultiplier,
          backgroundColor: config.hue,
          transform: [{translateX}, {translateY}, {rotate}, {scale}],
          opacity: animation.interpolate({
            inputRange: [0, 0.1, 0.9, 1],
            outputRange: [0, 1, 1, 0],
          }),
        },
      ]}
    />
  );
};

export type VerificationSuccessContentProps = {
  onContinue: () => void;
  showProgressBar?: boolean;
  successIcon?: string;
};

export const VerificationSuccessContent: React.FC<VerificationSuccessContentProps> = ({
  onContinue,
  showProgressBar = true,
  successIcon = '🎉',
}) => {
  return (
    <View style={styles.content}>
      <ConfettiOverlay />
      {showProgressBar ? (
        <View style={styles.progressContainer}>
          <RegistrationProgressBar currentStep={3} />
        </View>
      ) : null}

      <View style={styles.iconContainer}>
        <Text style={styles.successIcon}>{successIcon}</Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Identity Verified!</Text>
        <Text style={styles.subtitle}>You are now ready to access your credit dashboard.</Text>
      </View>

      <CreditCard style={styles.successCard}>
        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📊</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Credit Score Monitoring</Text>
              <Text style={styles.featureDescription}>
                Track your credit score and get alerts for changes
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📈</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Credit Report Access</Text>
              <Text style={styles.featureDescription}>
                View your complete credit report and history
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🔒</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Identity Protection</Text>
              <Text style={styles.featureDescription}>
                Monitor for suspicious activity and fraud alerts
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>💡</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Improvement Tips</Text>
              <Text style={styles.featureDescription}>
                Get personalized recommendations to improve your score
              </Text>
            </View>
          </View>
        </View>

        <CreditButton
          title="Access My Credit Dashboard"
          onPress={onContinue}
          fullWidth
          style={styles.continueButton}
        />
      </CreditCard>

      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>
          Welcome to CreditGuard! Start monitoring and improving your credit today.
        </Text>
      </View>
    </View>
  );
};

export const VerificationSuccessScreen: React.FC = () => {
  const {setIdentityCompleted} = useAuthStore();

  const handleContinue = () => {
    setIdentityCompleted(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <VerificationSuccessContent onContinue={handleContinue} />
    </SafeAreaView>
  );
};

const confettiStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  piece: {
    position: 'absolute',
    borderRadius: 4,
  },
});
