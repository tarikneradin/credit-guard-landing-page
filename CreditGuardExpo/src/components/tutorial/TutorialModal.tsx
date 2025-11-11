import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {Colors} from '../../constants/colors';

const {width, height} = Dimensions.get('window');

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  features: string[];
}

interface TutorialModalProps {
  visible: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to CreditGuard',
    description: 'Your personal AI-powered credit optimization platform',
    icon: 'shield-checkmark',
    iconColor: Colors.accent,
    iconBg: Colors.accent + '15',
    features: [
      'Real-time credit monitoring',
      'AI-powered insights',
      'Personalized action plans',
      'Identity theft protection',
    ],
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Track your credit score and get insights at a glance',
    icon: 'analytics',
    iconColor: Colors.info,
    iconBg: Colors.info + '15',
    features: [
      'View your current credit score',
      'Monitor score changes over time',
      'See credit utilization and balances',
      'Track account age and inquiries',
    ],
  },
  {
    id: 'credit_report',
    title: 'Credit Report',
    description: 'Detailed breakdown of your credit history',
    icon: 'document-text',
    iconColor: Colors.warning,
    iconBg: Colors.warning + '15',
    features: [
      'View all your credit accounts',
      'See payment history calendar',
      'Check account balances and limits',
      'Monitor credit inquiries',
    ],
  },
  {
    id: 'ai_tools',
    title: 'AI Tools',
    description: 'Smart recommendations to improve your credit',
    icon: 'sparkles',
    iconColor: Colors.accent,
    iconBg: Colors.accent + '15',
    features: [
      'Get personalized smart actions',
      'Follow your optimal credit path',
      'AI-powered score predictions',
      'Step-by-step action plans',
    ],
  },
  {
    id: 'alerts',
    title: 'Alerts & Notifications',
    description: 'Stay informed about important credit changes',
    icon: 'notifications',
    iconColor: Colors.error,
    iconBg: Colors.error + '15',
    features: [
      'Real-time score change alerts',
      'New account notifications',
      'Payment reminder alerts',
      'Suspicious activity detection',
    ],
  },
  {
    id: 'offers',
    title: 'Personalized Offers',
    description: 'Financial products tailored to your credit profile',
    icon: 'gift',
    iconColor: Colors.success,
    iconBg: Colors.success + '15',
    features: [
      'Credit card recommendations',
      'Loan pre-approvals',
      'Balance transfer offers',
      'Rewards optimization tips',
    ],
  },
];

export const TutorialModal: React.FC<TutorialModalProps> = ({visible, onClose, onComplete}) => {
  const {theme} = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
    }
  }, [visible, currentStep]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      // Animate out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -20,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentStep(currentStep + 1);
        slideAnim.setValue(50);
      });
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 20,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentStep(currentStep - 1);
        slideAnim.setValue(-50);
      });
    }
  };

  const handleSkip = () => {
    onClose();
    setCurrentStep(0);
  };

  const handleComplete = () => {
    onComplete();
    onClose();
    setCurrentStep(0);
  };

  const step = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleSkip}
      statusBarTranslucent>
      <View style={styles(theme).overlay}>
        <View style={styles(theme).container}>
          {/* Close Button */}
          <TouchableOpacity style={styles(theme).closeButton} onPress={handleSkip}>
            <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
          </TouchableOpacity>

          {/* Progress Bar */}
          <View style={styles(theme).progressContainer}>
            <View style={styles(theme).progressBarBackground}>
              <View style={[styles(theme).progressBarFill, {width: `${progress}%`}]} />
            </View>
            <Text style={styles(theme).progressText}>
              {currentStep + 1} of {tutorialSteps.length}
            </Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles(theme).scrollContent}>
            <Animated.View
              style={[
                styles(theme).content,
                {
                  opacity: fadeAnim,
                  transform: [{translateY: slideAnim}],
                },
              ]}>
              {/* Icon */}
              <View style={[styles(theme).iconContainer, {backgroundColor: step.iconBg}]}>
                <Ionicons name={step.icon} size={48} color={step.iconColor} />
              </View>

              {/* Title */}
              <Text style={styles(theme).title}>{step.title}</Text>

              {/* Description */}
              <Text style={styles(theme).description}>{step.description}</Text>

              {/* Features List */}
              <View style={styles(theme).featuresList}>
                {step.features.map((feature, index) => (
                  <View key={index} style={styles(theme).featureItem}>
                    <View style={styles(theme).featureBullet}>
                      <Ionicons name="checkmark-circle" size={20} color={step.iconColor} />
                    </View>
                    <Text style={styles(theme).featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          </ScrollView>

          {/* Navigation Buttons */}
          <View style={styles(theme).buttonsContainer}>
            {currentStep > 0 && (
              <TouchableOpacity style={styles(theme).backButton} onPress={handleBack}>
                <Ionicons name="chevron-back" size={20} color={theme.colors.text.primary} />
                <Text style={styles(theme).backButtonText}>Back</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles(theme).nextButton, currentStep === 0 && {flex: 1}]}
              onPress={handleNext}>
              <Text style={styles(theme).nextButtonText}>
                {currentStep === tutorialSteps.length - 1 ? "Get Started" : 'Next'}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {/* Dots Indicator */}
          <View style={styles(theme).dotsContainer}>
            {tutorialSteps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles(theme).dot,
                  index === currentStep && styles(theme).dotActive,
                  {
                    backgroundColor:
                      index === currentStep ? theme.colors.accent : theme.colors.border.medium,
                  },
                ]}
              />
            ))}
          </View>

          {/* Skip Button */}
          {currentStep < tutorialSteps.length - 1 && (
            <TouchableOpacity style={styles(theme).skipButton} onPress={handleSkip}>
              <Text style={styles(theme).skipButtonText}>Skip Tutorial</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = (theme: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      width: width - 48,
      maxHeight: height - 120,
      backgroundColor: theme.colors.surface,
      borderRadius: 28,
      padding: 28,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 12},
      shadowOpacity: 0.35,
      shadowRadius: 24,
      elevation: 12,
    },
    closeButton: {
      position: 'absolute',
      top: 16,
      right: 16,
      zIndex: 10,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surfaceSecondary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    progressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
      gap: 12,
    },
    progressBarBackground: {
      flex: 1,
      height: 4,
      backgroundColor: theme.colors.border.light,
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: theme.colors.accent,
      borderRadius: 2,
    },
    progressText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.text.secondary,
    },
    scrollContent: {
      paddingBottom: 20,
    },
    content: {
      alignItems: 'center',
    },
    iconContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 6},
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 6,
    },
    title: {
      fontSize: 24,
      fontWeight: '800',
      color: theme.colors.text.primary,
      textAlign: 'center',
      marginBottom: 10,
      letterSpacing: -0.5,
    },
    description: {
      fontSize: 15,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 24,
    },
    featuresList: {
      width: '100%',
      gap: 12,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 2,
    },
    featureBullet: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.surfaceSecondary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    featureText: {
      flex: 1,
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text.primary,
      lineHeight: 20,
    },
    buttonsContainer: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 24,
      marginBottom: 12,
    },
    backButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      borderRadius: 12,
      backgroundColor: theme.colors.surfaceSecondary,
      gap: 8,
    },
    backButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.text.primary,
    },
    nextButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      borderRadius: 12,
      backgroundColor: theme.colors.accent,
      gap: 8,
      shadowColor: theme.colors.accent,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    nextButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: Colors.white,
    },
    dotsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
      marginBottom: 12,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    dotActive: {
      width: 24,
    },
    skipButton: {
      alignSelf: 'center',
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    skipButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text.tertiary,
    },
  });
