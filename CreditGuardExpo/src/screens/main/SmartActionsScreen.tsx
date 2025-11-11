import React, {useRef, useEffect, useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, Animated, Dimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {useCreditStore} from '../../stores/creditStore';
import {useFeatureFlagsStore} from '../../stores/featureFlagsStore';
import {HeaderWithOptions, MenuOption} from '../../components/common/HeaderWithOptions';
import {AIChatModal} from '../../components/ai/AIChatModal';
import {OptimalPathActionCard} from '../../components/optimalPath/OptimalPathActionCard';
import {mockOptimalPathActions} from '../../data/optimalPathMockData';
import {Colors} from '../../constants/colors';
import type {Theme} from '../../constants/Themes';

interface SmartAction {
  id: string;
  title: string;
  description: string;
  impact: string;
  timeframe: string;
  priority: 'TOP_PRIORITY' | 'HIGH_IMPACT' | 'EASY_WIN';
  type: 'payment' | 'credit_limit' | 'address' | 'dispute';
  currentValue?: string;
  targetValue?: string;
  amountNeeded?: string;
  cards?: string[];
  buttonText?: string;
  secondaryButtonText?: string;
}

const {width} = Dimensions.get('window');

export const SmartActionsScreen: React.FC = () => {
  const {theme} = useTheme();
  const {creditScore, reportSummary} = useCreditStore();
  const {flags} = useFeatureFlagsStore();
  const [showAIChat, setShowAIChat] = useState(false);
  const [activeTab, setActiveTab] = useState<'smart_actions' | 'optimal_path'>(
    flags.smartActions ? 'smart_actions' : 'optimal_path',
  );
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const tabIndicatorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    Animated.spring(tabIndicatorAnim, {
      toValue: activeTab === 'smart_actions' ? 0 : 1,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start();
  }, [activeTab, tabIndicatorAnim]);

  const currentScore = creditScore?.score || 742;
  const targetScore = 780;
  const scoreGap = targetScore - currentScore;
  const utilizationRate = reportSummary?.utilizationRate
    ? Math.round(reportSummary.utilizationRate * 100)
    : 22;

  const smartActions: SmartAction[] = [
    {
      id: '1',
      title: 'Pay down credit cards to under 10%',
      description: '',
      impact: '+15 pts in 30 days',
      timeframe: '30 days',
      priority: 'TOP_PRIORITY',
      type: 'payment',
      currentValue: `${utilizationRate}%`,
      targetValue: '8%',
      amountNeeded: '$1,847 payment',
      buttonText: 'Start Action',
      secondaryButtonText: 'Learn More',
    },
    {
      id: '2',
      title: 'Request credit limit increases',
      description: '',
      impact: '+8 pts in 45 days',
      timeframe: '45 days',
      priority: 'HIGH_IMPACT',
      type: 'credit_limit',
      cards: ['Chase (+$2K)', 'Capital One'],
      buttonText: 'Auto-Request',
      secondaryButtonText: 'Manual Request',
    },
    {
      id: '3',
      title: 'Update credit card addresses',
      description: 'Ensure all accounts show current address',
      impact: '+5 pts in 14 days',
      timeframe: '14 days',
      priority: 'EASY_WIN',
      type: 'address',
      buttonText: 'Fix Automatically',
    },
  ];

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'TOP_PRIORITY':
        return {
          color: Colors.warning,
          backgroundColor: '#FFF9E6',
          borderColor: Colors.warning + '40',
          icon: 'trophy' as const,
          label: 'TOP PRIORITY',
        };
      case 'HIGH_IMPACT':
        return {
          color: Colors.info,
          backgroundColor: '#EFF6FF',
          borderColor: Colors.info + '40',
          icon: 'trophy' as const,
          label: 'HIGH IMPACT',
        };
      case 'EASY_WIN':
        return {
          color: Colors.success,
          backgroundColor: '#ECFDF5',
          borderColor: Colors.success + '40',
          icon: 'trophy' as const,
          label: 'EASY WIN',
        };
      default:
        return {
          color: theme.colors.text.secondary,
          backgroundColor: theme.colors.border.light,
          borderColor: theme.colors.border.medium,
          icon: 'star' as const,
          label: 'ACTION',
        };
    }
  };

  const totalPotentialImpact = smartActions.reduce((sum, action) => {
    const points = parseInt(action.impact.match(/\+(\d+)/)?.[1] || '0', 10);
    return sum + points;
  }, 0);

  const menuOptions: MenuOption[] = [
    {
      id: 'ai-chat',
      icon: 'chatbubble-ellipses-outline',
      label: 'AI Assistant',
      action: () => setShowAIChat(true),
      color: theme.colors.accent,
    },
    {
      id: 'refresh',
      icon: 'refresh-outline',
      label: 'Refresh Actions',
      action: () => {
        // Refresh logic
      },
      color: theme.colors.success,
    },
  ];

  // Calculate tab width based on number of visible tabs
  const visibleTabs = [flags.smartActions, flags.optimalPath].filter(Boolean).length;
  const tabWidth = (width - 40) / (visibleTabs > 0 ? visibleTabs : 1);
  const indicatorTranslateX = tabIndicatorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, tabWidth],
  });

  const renderSmartActions = () => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{translateY: slideAnim}],
      }}>
      {/* Goal Card */}
      <View style={styles(theme).goalCard}>
        <View style={styles(theme).goalHeader}>
          <Ionicons name="flag" size={18} color={theme.colors.accent} />
          <Text style={styles(theme).goalTitle}>Goal: Reach {targetScore} score for mortgage</Text>
        </View>

        <View style={styles(theme).scoreProgress}>
          <View style={styles(theme).scoreItem}>
            <Text style={styles(theme).scoreValue}>{currentScore}</Text>
            <Text style={styles(theme).scoreLabel}>Current</Text>
          </View>

          <View style={styles(theme).progressBarContainer}>
            <View style={styles(theme).progressBar}>
              <View
                style={[
                  styles(theme).progressBarFill,
                  {width: `${((currentScore - 300) / (targetScore - 300)) * 100}%`},
                ]}
              />
            </View>
          </View>

          <View style={styles(theme).scoreItem}>
            <Text style={[styles(theme).scoreValue, {color: theme.colors.accent}]}>
              {targetScore}
            </Text>
            <Text style={styles(theme).scoreLabel}>Target</Text>
          </View>
        </View>

        <View style={styles(theme).gapContainer}>
          <Text style={styles(theme).gapLabel}>Gap: </Text>
          <Text style={styles(theme).gapValue}>{scoreGap} points</Text>
        </View>
      </View>

      {/* Smart Action Cards */}
      {smartActions.map((action, index) => {
        const priorityConfig = getPriorityConfig(action.priority);
        return (
          <View
            key={action.id}
            style={[
              styles(theme).actionCard,
              {
                borderColor: priorityConfig.borderColor,

                marginBottom: index === smartActions.length - 1 ? 0 : theme.spacing.md,
              },
            ]}>
            {/* Priority Badge */}
            <View
              style={[
                styles(theme).priorityBadge,
                {backgroundColor: priorityConfig.backgroundColor},
              ]}>
              <Ionicons name={priorityConfig.icon} size={14} color={priorityConfig.color} />
              <Text style={[styles(theme).priorityText, {color: priorityConfig.color}]}>
                {priorityConfig.label}
              </Text>
            </View>

            {/* Title */}
            <Text style={styles(theme).actionTitle}>{action.title}</Text>

            {/* Impact */}
            <Text style={styles(theme).impactText}>{action.impact}</Text>

            {/* Details */}
            {action.currentValue && (
              <View style={styles(theme).detailRow}>
                <Text style={styles(theme).detailLabel}>Current utilization:</Text>
                <Text style={[styles(theme).detailValue, {color: Colors.error}]}>
                  {action.currentValue}
                </Text>
              </View>
            )}

            {action.targetValue && (
              <View style={styles(theme).detailRow}>
                <Text style={styles(theme).detailLabel}>Target:</Text>
                <Text style={[styles(theme).detailValue, {color: Colors.success}]}>
                  {action.targetValue}
                </Text>
              </View>
            )}

            {action.amountNeeded && (
              <View style={styles(theme).detailRow}>
                <Text style={styles(theme).detailLabel}>Amount needed:</Text>
                <Text style={styles(theme).detailValue}>{action.amountNeeded}</Text>
              </View>
            )}

            {action.cards && (
              <View style={styles(theme).cardsRow}>
                <Text style={styles(theme).detailLabel}>Recommended cards:</Text>
                <View style={styles(theme).cardsList}>
                  {action.cards.map((card, idx) => (
                    <View key={idx} style={styles(theme).cardChip}>
                      <Text style={styles(theme).cardChipText}>{card}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {action.description && (
              <Text style={styles(theme).actionDescription}>{action.description}</Text>
            )}

            {/* Action Buttons */}
            <View style={styles(theme).buttonsContainer}>
              <TouchableOpacity
                style={[
                  styles(theme).primaryButton,
                  {
                    backgroundColor:
                      action.priority === 'TOP_PRIORITY'
                        ? theme.colors.accent
                        : action.priority === 'EASY_WIN'
                          ? Colors.success
                          : theme.colors.accent,
                  },
                ]}
                activeOpacity={0.8}>
                <Text style={styles(theme).primaryButtonText}>
                  {action.buttonText || 'Start Action'}
                </Text>
              </TouchableOpacity>

              {action.secondaryButtonText && (
                <TouchableOpacity style={styles(theme).secondaryButton} activeOpacity={0.8}>
                  <Text style={styles(theme).secondaryButtonText}>
                    {action.secondaryButtonText}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      })}

      {/* Total Impact */}
      <View style={styles(theme).totalImpactCard}>
        <Text style={styles(theme).totalImpactTitle}>Total Potential Impact</Text>
        <Text style={styles(theme).totalImpactValue}>+{totalPotentialImpact} points</Text>
        <Text style={styles(theme).totalImpactSubtitle}>
          Complete all actions to reach your goal
        </Text>
      </View>
    </Animated.View>
  );

  const renderOptimalPath = () => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{translateY: slideAnim}],
      }}>
      <View style={styles(theme).section}>
        {mockOptimalPathActions.map((action, index) => (
          <OptimalPathActionCard
            key={action.id}
            action={action}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              marginBottom: index === mockOptimalPathActions.length - 1 ? 0 : theme.spacing.md,
            }}
          />
        ))}
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles(theme).container} edges={['top']}>
      <HeaderWithOptions
        title="AI Tools"
        subtitle="Smart recommendations powered by AI"
        icon="sparkles"
        iconColor={theme.colors.accent}
        options={menuOptions}
      />

      {/* Custom Tab Navigation */}
      {visibleTabs > 0 && (
        <View style={styles(theme).tabContainer}>
          <View style={styles(theme).tabButtonsContainer}>
            {flags.smartActions && (
              <TouchableOpacity
                style={[styles(theme).tabButton, {width: tabWidth}]}
                onPress={() => setActiveTab('smart_actions')}
                activeOpacity={0.7}>
                <Ionicons
                  name="sparkles"
                  size={20}
                  color={
                    activeTab === 'smart_actions'
                      ? theme.colors.accent
                      : theme.colors.text.secondary
                  }
                />
                <Text
                  style={[
                    styles(theme).tabText,
                    activeTab === 'smart_actions' && styles(theme).tabTextActive,
                  ]}>
                  Smart Actions
                </Text>
              </TouchableOpacity>
            )}

            {flags.optimalPath && (
              <TouchableOpacity
                style={[styles(theme).tabButton, {width: tabWidth}]}
                onPress={() => setActiveTab('optimal_path')}
                activeOpacity={0.7}>
                <Ionicons
                  name="trending-up"
                  size={20}
                  color={
                    activeTab === 'optimal_path' ? theme.colors.accent : theme.colors.text.secondary
                  }
                />
                <Text
                  style={[
                    styles(theme).tabText,
                    activeTab === 'optimal_path' && styles(theme).tabTextActive,
                  ]}>
                  Optimal Path
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <Animated.View
            style={[
              styles(theme).tabIndicator,
              {
                width: tabWidth,
                transform: [{translateX: indicatorTranslateX}],
              },
            ]}
          />
        </View>
      )}

      <ScrollView
        style={styles(theme).scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles(theme).scrollContent}>
        {activeTab === 'smart_actions' && flags.smartActions && renderSmartActions()}
        {activeTab === 'optimal_path' && flags.optimalPath && renderOptimalPath()}
      </ScrollView>

      <AIChatModal
        visible={showAIChat}
        onClose={() => setShowAIChat(false)}
        initialContext="smart_actions"
      />
    </SafeAreaView>
  );
};

const styles = (theme: Theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  tabContainer: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  tabButtonsContainer: {
    flexDirection: 'row' as const,
    gap: 0,
  },
  tabButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  tabTextActive: {
    color: theme.colors.accent,
    fontWeight: '700',
  },
  tabIndicator: {
    height: 3,
    backgroundColor: theme.colors.accent,
    borderRadius: 2,
    marginTop: theme.spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: 100, // Extra padding for bottom nav bar
  },
  goalCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: 16,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    shadowColor: theme.colors.shadow.light,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: theme.spacing.lg,
    gap: 8,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
    flex: 1,
  },
  scoreProgress: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  scoreItem: {
    alignItems: 'center' as const,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  progressBarContainer: {
    flex: 1,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.border.light,
    borderRadius: 4,
    overflow: 'hidden' as const,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.accent,
    borderRadius: 4,
  },
  gapContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.sm,
    borderRadius: 8,
  },
  gapLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  gapValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.warning,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  actionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: theme.spacing.lg,
    borderWidth: 2,
    shadowColor: theme.colors.shadow.light,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  priorityBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    alignSelf: 'flex-start' as const,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: theme.spacing.md,
    gap: 6,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  impactText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.success,
    marginBottom: theme.spacing.lg,
  },
  detailRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: theme.spacing.sm,
  },
  detailLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  cardsRow: {
    paddingVertical: theme.spacing.sm,
  },
  cardsList: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
    marginTop: theme.spacing.sm,
  },
  cardChip: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  cardChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  actionDescription: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginTop: theme.spacing.sm,
  },
  buttonsContainer: {
    flexDirection: 'row' as const,
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  totalImpactCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: 16,
    alignItems: 'center' as const,
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  totalImpactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  totalImpactValue: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.success,
    marginBottom: theme.spacing.xs,
  },
  totalImpactSubtitle: {
    fontSize: 13,
    color: theme.colors.text.tertiary,
    textAlign: 'center' as const,
  },
});
