import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {HeaderWithOptions} from '../../components/common/HeaderWithOptions';
import {BadgeCard} from '../../components/gamification/BadgeCard';
import {StreakCard} from '../../components/gamification/StreakCard';
import {ProgressRing} from '../../components/gamification/ProgressRing';
import {CelebrationModal} from '../../components/gamification/CelebrationModal';
import {
  badges,
  getBadgeById,
  getUserLevel,
  getNextLevel,
  getPointsToNextLevel,
  mockGamificationState,
} from '../../data/gamificationData';
import {Achievement} from '../../types/gamification';

export const GamificationScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

  // Use mock data for demo
  const gamification = mockGamificationState;
  const currentLevel = getUserLevel(gamification.points);
  const nextLevel = getNextLevel(currentLevel.level);
  const pointsToNext = getPointsToNextLevel(gamification.points);

  // Calculate progress to next level
  const levelProgress =
    nextLevel && pointsToNext !== null
      ? ((gamification.points - currentLevel.pointsRequired) /
          (nextLevel.pointsRequired - currentLevel.pointsRequired)) *
        100
      : 100;

  // Get unlocked badge IDs
  const unlockedBadgeIds = gamification.badges.map(b => b.badgeId);

  // Filter badges by category
  const scoreBadges = badges.filter(b => b.category === 'score');
  const actionBadges = badges.filter(b => b.category === 'action');
  const paymentBadges = badges.filter(b => b.category === 'payment');
  const engagementBadges = badges.filter(b => b.category === 'engagement');
  const milestoneBadges = badges.filter(b => b.category === 'milestone');

  const handleBadgePress = (badgeId: string) => {
    const badge = getBadgeById(badgeId);
    if (badge) {
      // Show badge details or celebration if newly unlocked
      const userBadge = gamification.badges.find(b => b.badgeId === badgeId);
      if (userBadge?.isNew) {
        setCurrentAchievement({
          id: badge.id,
          type: 'badge',
          title: `${badge.name} Unlocked!`,
          message: badge.description,
          icon: badge.icon,
          color: badge.color,
          points: badge.points,
          timestamp: userBadge.unlockedAt,
        });
        setCelebrationVisible(true);
      }
    }
  };

  const renderBadgeSection = (title: string, badgeList: any[]) => {
    if (badgeList.length === 0) return null;

    return (
      <View style={styles(theme).section}>
        <Text style={styles(theme).sectionTitle}>{title}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles(theme).badgeScroll}>
          {badgeList.map(badge => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              unlocked={unlockedBadgeIds.includes(badge.id)}
              isNew={gamification.badges.find(b => b.badgeId === badge.id)?.isNew}
              onPress={() => handleBadgePress(badge.id)}
            />
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles(theme).container} edges={['top']}>
      <HeaderWithOptions
        title="Achievements"
        subtitle="Track your progress and earn rewards"
        icon="trophy"
        iconColor={theme.colors.warning}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles(theme).scrollView}
        contentContainerStyle={styles(theme).contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Level & Points Card */}
        <View style={styles(theme).levelCard}>
          <View style={styles(theme).levelHeader}>
            <View style={styles(theme).levelInfo}>
              <Text style={styles(theme).levelNumber}>Level {currentLevel.level}</Text>
              <Text style={styles(theme).levelTitle}>{currentLevel.title}</Text>
            </View>
            <ProgressRing
              progress={levelProgress}
              size={100}
              strokeWidth={8}
              color={currentLevel.color}
              value={currentLevel.level}
              label="Level"
            />
          </View>

          <View style={styles(theme).pointsContainer}>
            <View style={styles(theme).pointsRow}>
              <Ionicons name="star" size={20} color={theme.colors.warning} />
              <Text style={styles(theme).pointsText}>{gamification.points} points</Text>
            </View>
            {pointsToNext !== null && (
              <Text style={styles(theme).pointsToNext}>
                {pointsToNext} points to {nextLevel?.title}
              </Text>
            )}
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles(theme).statsGrid}>
          <View style={styles(theme).statCard}>
            <Ionicons name="trophy" size={32} color={theme.colors.warning} />
            <Text style={styles(theme).statValue}>{gamification.badges.length}</Text>
            <Text style={styles(theme).statLabel}>Badges</Text>
          </View>
          <View style={styles(theme).statCard}>
            <Ionicons name="checkmark-done" size={32} color={theme.colors.success} />
            <Text style={styles(theme).statValue}>{gamification.totalActionsCompleted}</Text>
            <Text style={styles(theme).statLabel}>Actions</Text>
          </View>
          <View style={styles(theme).statCard}>
            <Ionicons name="trending-up" size={32} color={theme.colors.accent} />
            <Text style={styles(theme).statValue}>+{gamification.totalScoreIncrease}</Text>
            <Text style={styles(theme).statLabel}>Score Gain</Text>
          </View>
        </View>

        {/* Active Streaks */}
        {gamification.streaks.length > 0 && (
          <View style={styles(theme).section}>
            <Text style={styles(theme).sectionTitle}>Active Streaks</Text>
            {gamification.streaks.map((streak, index) => (
              <View key={index} style={{marginBottom: theme.spacing.md}}>
                <StreakCard streak={streak} />
              </View>
            ))}
          </View>
        )}

        {/* Current Goals */}
        {gamification.goals.length > 0 && (
          <View style={styles(theme).section}>
            <Text style={styles(theme).sectionTitle}>Current Goals</Text>
            {gamification.goals
              .filter(g => !g.completed)
              .map(goal => (
                <View key={goal.id} style={styles(theme).goalCard}>
                  <View style={styles(theme).goalHeader}>
                    <Text style={styles(theme).goalTitle}>{goal.title}</Text>
                    <Text style={styles(theme).goalProgress}>
                      {Math.round((goal.current / goal.target) * 100)}%
                    </Text>
                  </View>
                  <Text style={styles(theme).goalDescription}>{goal.description}</Text>

                  <View style={styles(theme).progressBar}>
                    <View
                      style={[
                        styles(theme).progressBarFill,
                        {width: `${(goal.current / goal.target) * 100}%`},
                      ]}
                    />
                  </View>

                  <View style={styles(theme).goalFooter}>
                    <Text style={styles(theme).goalStats}>
                      {goal.current} / {goal.target} {goal.unit}
                    </Text>
                    {goal.reward && (
                      <View style={styles(theme).rewardBadge}>
                        <Ionicons name="gift" size={14} color={theme.colors.warning} />
                        <Text style={styles(theme).rewardText}>+{goal.reward.points} pts</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
          </View>
        )}

        {/* Badge Collections */}
        {renderBadgeSection('Score Achievements', scoreBadges)}
        {renderBadgeSection('Action Achievements', actionBadges)}
        {renderBadgeSection('Payment Achievements', paymentBadges)}
        {renderBadgeSection('Engagement Achievements', engagementBadges)}
        {renderBadgeSection('Major Milestones', milestoneBadges)}

        <View style={styles(theme).bottomPadding} />
      </ScrollView>

      {/* Celebration Modal */}
      <CelebrationModal
        visible={celebrationVisible}
        achievement={currentAchievement}
        onClose={() => setCelebrationVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    contentContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
    },
    levelCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      padding: theme.spacing.xl,
      marginBottom: theme.spacing.lg,
      shadowColor: theme.colors.shadow.medium,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    levelHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    levelInfo: {
      flex: 1,
    },
    levelNumber: {
      ...theme.textStyles.headline1,
      fontWeight: '800',
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    levelTitle: {
      ...theme.textStyles.bodyLarge,
      color: theme.colors.text.secondary,
      fontWeight: '600',
    },
    pointsContainer: {
      backgroundColor: theme.colors.surfaceSecondary,
      padding: theme.spacing.lg,
      borderRadius: 16,
    },
    pointsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 4,
    },
    pointsText: {
      ...theme.textStyles.headline3,
      fontWeight: '800',
      color: theme.colors.text.primary,
    },
    pointsToNext: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.text.secondary,
    },
    statsGrid: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.xl,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.lg,
      borderRadius: 16,
      alignItems: 'center',
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
    },
    statValue: {
      ...theme.textStyles.headline3,
      fontWeight: '800',
      color: theme.colors.text.primary,
      marginTop: theme.spacing.sm,
    },
    statLabel: {
      ...theme.textStyles.caption,
      color: theme.colors.text.secondary,
      marginTop: 4,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      ...theme.textStyles.headline4,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.lg,
    },
    badgeScroll: {
      gap: theme.spacing.md,
      paddingRight: theme.spacing.lg,
    },
    goalCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
    },
    goalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    goalTitle: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '700',
      color: theme.colors.text.primary,
      flex: 1,
    },
    goalProgress: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '800',
      color: theme.colors.accent,
    },
    goalDescription: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.md,
    },
    progressBar: {
      height: 8,
      backgroundColor: theme.colors.border.light,
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: theme.spacing.md,
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: theme.colors.accent,
      borderRadius: 4,
    },
    goalFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    goalStats: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
      fontWeight: '600',
    },
    rewardBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.warning + '20',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: 12,
      gap: 4,
    },
    rewardText: {
      ...theme.textStyles.caption,
      fontWeight: '700',
      color: theme.colors.warning,
    },
    bottomPadding: {
      height: 100,
    },
  });
