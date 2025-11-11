import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {Achievement} from '../../types/gamification';
import {BlurView} from 'expo-blur';

const {width, height} = Dimensions.get('window');

interface CelebrationModalProps {
  visible: boolean;
  achievement: Achievement | null;
  onClose: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  visible,
  achievement,
  onClose,
}) => {
  const {theme} = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const confettiAnims = useRef(
    Array.from({length: 20}, () => ({
      translateY: new Animated.Value(-100),
      translateX: new Animated.Value(0),
      rotate: new Animated.Value(0),
      opacity: new Animated.Value(1),
    })),
  ).current;

  useEffect(() => {
    if (visible && achievement) {
      // Reset animations
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
      confettiAnims.forEach(anim => {
        anim.translateY.setValue(-100);
        anim.opacity.setValue(1);
      });

      // Start animations
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Animate confetti
      confettiAnims.forEach((anim, index) => {
        const delay = Math.random() * 200;
        const translateX = (Math.random() - 0.5) * width;
        const duration = 1500 + Math.random() * 1000;

        setTimeout(() => {
          Animated.parallel([
            Animated.timing(anim.translateY, {
              toValue: height,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(anim.translateX, {
              toValue: translateX,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(anim.rotate, {
              toValue: Math.random() * 720 - 360,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(anim.opacity, {
              toValue: 0,
              duration: duration * 0.8,
              delay: duration * 0.2,
              useNativeDriver: true,
            }),
          ]).start();
        }, delay);
      });

      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible, achievement]);

  if (!achievement) return null;

  const confettiColors = [
    theme.colors.accent,
    theme.colors.success,
    theme.colors.warning,
    '#F59E0B',
    '#8B5CF6',
    '#EF4444',
  ];

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles(theme).overlay}>
        {/* Confetti particles */}
        {confettiAnims.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles(theme).confetti,
              {
                backgroundColor: confettiColors[index % confettiColors.length],
                left: width / 2 + (Math.random() - 0.5) * 100,
                transform: [
                  {translateY: anim.translateY},
                  {translateX: anim.translateX},
                  {
                    rotate: anim.rotate.interpolate({
                      inputRange: [0, 360],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
                opacity: anim.opacity,
              },
            ]}
          />
        ))}

        {/* Achievement Card */}
        <Animated.View
          style={[
            styles(theme).card,
            {
              opacity: fadeAnim,
              transform: [{scale: scaleAnim}],
            },
          ]}>
          <TouchableOpacity
            style={styles(theme).closeButton}
            onPress={onClose}
            activeOpacity={0.7}>
            <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
          </TouchableOpacity>

          <View style={[styles(theme).iconContainer, {backgroundColor: achievement.color + '20'}]}>
            <Ionicons name={achievement.icon as any} size={64} color={achievement.color} />
          </View>

          <Text style={styles(theme).title}>{achievement.title}</Text>
          <Text style={styles(theme).message}>{achievement.message}</Text>

          {achievement.points && (
            <View style={styles(theme).pointsBadge}>
              <Ionicons name="star" size={16} color={theme.colors.warning} />
              <Text style={styles(theme).pointsText}>+{achievement.points} points</Text>
            </View>
          )}

          <TouchableOpacity style={styles(theme).button} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles(theme).buttonText}>Awesome!</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = (theme: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
    },
    confetti: {
      position: 'absolute',
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 24,
      padding: theme.spacing.xxxl,
      alignItems: 'center',
      width: '100%',
      maxWidth: 400,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 20},
      shadowOpacity: 0.3,
      shadowRadius: 30,
      elevation: 10,
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
      top: theme.spacing.md,
      right: theme.spacing.md,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surfaceSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
    },
    iconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.xl,
    },
    title: {
      ...theme.textStyles.headline2,
      fontWeight: '800',
      color: theme.colors.text.primary,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    message: {
      ...theme.textStyles.bodyLarge,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
      lineHeight: 24,
    },
    pointsBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.warning + '20',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderRadius: 20,
      marginBottom: theme.spacing.lg,
      gap: 6,
    },
    pointsText: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '700',
      color: theme.colors.warning,
    },
    button: {
      backgroundColor: theme.colors.accent,
      paddingHorizontal: theme.spacing.xxxl,
      paddingVertical: theme.spacing.md + 2,
      borderRadius: 24,
      shadowColor: theme.colors.accent,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    buttonText: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '700',
      color: theme.colors.surface,
    },
  });
