/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useCreditStore, Bureau as CreditBureau} from '../../stores/creditStore';
import {useAuthStore} from '../../stores/authStore';
import {useFeatureFlagsStore} from '../../stores/featureFlagsStore';
import {getScoreCategory} from '../../types/api';
import {ScoreGauge} from '../../components/credit/ScoreGauge';
import {BureauDropdown} from '../../components/common/BureauDropdown';
import {useTheme} from '../../contexts/ThemeContext';
import {Ionicons} from '@expo/vector-icons';
import {HeaderWithOptions, MenuOption} from '../../components/common/HeaderWithOptions';
import {AIChatModal} from '../../components/ai/AIChatModal';
import {mockOptimalPathProgress} from '../../data/optimalPathMockData';
import {useNavigation} from '@react-navigation/native';
import {
  CreditMetricDetailModal,
  MetricType,
} from '../../components/dashboard/CreditMetricDetailModal';
import {getCreditMetricDetails} from '../../data/creditMetricDetailsMockData';
import {TutorialModal} from '../../components/tutorial/TutorialModal';
import {useTutorial} from '../../hooks/useTutorial';
import {ScoreTrendCard} from '../../components/credit/ScoreTrendCard';
import {StreakCard} from '../../components/gamification/StreakCard';
import {mockGamificationState} from '../../data/gamificationData';
import {ScoreFactorsModal} from '../../components/credit/ScoreFactorsModal';
import {flattenEquifaxAccounts} from '../../utils/equifaxDataExtractors';
import {mapApiAccountToCreditAccount} from '../../utils/apiMappers';
import {CreditAccount} from '../../types';
import {CreditFactorWeightsModal} from '../../components/dashboard/CreditFactorWeightsModal';

export const DashboardScreen: React.FC = () => {
  const {user} = useAuthStore();
  const {theme} = useTheme();
  const navigation = useNavigation();
  const {flags} = useFeatureFlagsStore();
  const [showAIChat, setShowAIChat] = useState(false);
  const [showMetricDetail, setShowMetricDetail] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<MetricType | null>(null);
  const [showScoreFactors, setShowScoreFactors] = useState(false);
  const [showFactorWeights, setShowFactorWeights] = useState(false);
  const {showTutorial, setShowTutorial, completeTutorial} = useTutorial();
  const {
    creditScore,
    reportSummary,
    fullReport,
    scoreHistory,
    isLoading,
    error,
    lastUpdated,
    refreshAllData,
    clearError,
    selectedBureau,
    setSelectedBureau,
    availableBureaus,
  } = useCreditStore();

  // Transform score history from API format to graph format
  const transformedScoreHistory = React.useMemo(() => {
    if (!scoreHistory || scoreHistory.length === 0) {
      return null;
    }

    // Need at least 2 data points to show a trend
    if (scoreHistory.length < 2) {
      return null;
    }

    try {
      // Transform and validate data
      const transformed = scoreHistory.map((item, index, array) => {
        // Parse date - handle both ISO strings and timestamp numbers
        let parsedDate: Date;
        if (typeof item.date === 'number') {
          parsedDate = new Date(item.date);
        } else if (typeof item.date === 'string') {
          parsedDate = new Date(item.date);
        } else {
          throw new Error('Invalid date format');
        }

        // Validate date
        if (isNaN(parsedDate.getTime())) {
          throw new Error('Invalid date');
        }

        // Validate score
        if (typeof item.score !== 'number' || isNaN(item.score)) {
          throw new Error('Invalid score');
        }

        return {
          date: parsedDate,
          score: item.score,
          change: index > 0 ? item.score - array[index - 1].score : undefined,
        };
      });

      return transformed;
    } catch {
      return null; // Return null to show error message instead of broken graph
    }
  }, [scoreHistory]);

  // Animation refs
  const headerFadeAnim = useRef(new Animated.Value(0)).current;
  const contentSlideAnim = useRef(new Animated.Value(50)).current;
  const cardFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Load data on component mount
    refreshAllData();

    // Start entrance animations
    Animated.stagger(200, [
      Animated.timing(headerFadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(contentSlideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(cardFadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const handleRefresh = () => {
    clearError();
    refreshAllData();
  };

  const handleMetricPress = (metricType: MetricType) => {
    setSelectedMetric(metricType);
    setShowMetricDetail(true);
  };

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return 'Never updated';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  const scoreCategory = creditScore ? getScoreCategory(creditScore.score) : 'fair';

  const styles = {
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    contentContainer: {
      paddingTop: theme.spacing.lg, // Consistent top padding
    },
    header: {
      paddingHorizontal: theme.spacing.xl,
      paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing.lg,
    },
    subtleHeader: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      paddingHorizontal: theme.spacing.xl,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.lg,
    },
    headerLeft: {
      flex: 1,
    },
    headerRight: {
      alignItems: 'center' as const,
    },
    timeGreeting: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.secondary,
      marginBottom: 2,
    },
    userName: {
      ...theme.textStyles.headline3,
      color: theme.colors.text.primary,
      fontWeight: '400' as const,
    },
    notificationIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surfaceSecondary,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    greeting: {
      ...theme.textStyles.headline1,
      color: theme.colors.text.primary,
      fontWeight: '700' as const,
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      ...theme.textStyles.bodyLarge,
      color: theme.colors.text.secondary,
    },
    errorBanner: {
      marginHorizontal: theme.spacing.xl,
      marginTop: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.alert.errorBg,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.error,
    },
    errorText: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.alert.errorText,
      fontWeight: '500' as const,
    },
    derogatoryAlert: {
      marginHorizontal: theme.spacing.xl,
      marginTop: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
    },
    derogatoryAlertContent: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: theme.colors.error + '10',
      borderRadius: 16,
      padding: theme.spacing.lg,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.error,
      shadowColor: theme.colors.shadow.medium,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    derogatoryAlertIcon: {
      marginRight: theme.spacing.md,
    },
    derogatoryAlertText: {
      flex: 1,
    },
    derogatoryAlertTitle: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '700' as const,
      color: theme.colors.error,
      marginBottom: 4,
    },
    derogatoryAlertSubtitle: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.text.secondary,
      lineHeight: 18,
    },
    scoreSection: {
      marginHorizontal: theme.spacing.xl,
      marginBottom: theme.spacing.xl,
    },
    scoreSectionHeader: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      marginBottom: theme.spacing.lg,
    },
    scoreSectionTitle: {
      ...theme.textStyles.headline3,
      color: theme.colors.text.primary,
      fontWeight: '700' as const,
    },
    refreshButton: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surfaceSecondary,
      borderRadius: 20,
    },
    refreshText: {
      ...theme.textStyles.caption,
      color: theme.colors.text.secondary,
      marginLeft: theme.spacing.xs,
      fontWeight: '600' as const,
    },
    refreshTextWithMargin: {
      ...theme.textStyles.caption,
      color: theme.colors.text.secondary,
      marginLeft: theme.spacing.xs,
      marginTop: 2,
      fontWeight: '600' as const,
    },
    scoreCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 24,
      padding: theme.spacing.xl,
      alignItems: 'center' as const,
      shadowColor: theme.colors.shadow.medium,
      shadowOffset: {width: 0, height: 12},
      shadowOpacity: 0.15,
      shadowRadius: 24,
      elevation: 8,
    },
    loader: {
      marginVertical: theme.spacing.xxxl,
    },
    loadingContainer: {
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingVertical: theme.spacing.xxl,
    },
    loadingText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing.md,
    },
    noScoreContainer: {
      padding: theme.spacing.xxxl,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    noScoreText: {
      ...theme.textStyles.bodyLarge,
      color: theme.colors.text.tertiary,
      textAlign: 'center' as const,
      fontWeight: '600' as const,
    },
    noScoreSubtext: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.text.tertiary,
      marginTop: theme.spacing.xs,
      textAlign: 'center' as const,
    },
    viewFactorsButton: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      backgroundColor: theme.colors.accent + '10',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: 12,
      marginTop: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.accent + '20',
      gap: theme.spacing.xs,
    },
    viewFactorsText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.accent,
      fontWeight: '600' as const,
    },
    scoreMetadata: {
      alignItems: 'center' as const,
      marginTop: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.subtle,
      width: '100%' as any,
    },
    lastUpdated: {
      ...theme.textStyles.caption,
      color: theme.colors.text.tertiary,
      marginBottom: theme.spacing.xs,
    },
    bureau: {
      ...theme.textStyles.caption,
      color: theme.colors.text.quaternary,
    },
    factorWeightsLink: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      gap: 4,
      marginTop: theme.spacing.xs,
    },
    factorWeightsLinkText: {
      ...theme.textStyles.caption,
      color: theme.colors.accent,
      fontWeight: '600' as const,
    },
    quickStatsSection: {
      marginHorizontal: theme.spacing.xl,
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      ...theme.textStyles.headline4,
      color: theme.colors.text.primary,
      fontWeight: '600' as const,
      marginBottom: theme.spacing.lg,
    },
    quickStats: {
      flexDirection: 'row' as const,
      gap: theme.spacing.md,
    },
    statItem: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.lg,
      borderRadius: 16,
      alignItems: 'center' as const,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    statIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.surfaceSecondary,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginBottom: theme.spacing.md,
    },
    statLabel: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.sm,
      textAlign: 'center' as const,
      lineHeight: 18,
    },
    statValue: {
      ...theme.textStyles.headline3,
      fontWeight: '700' as const,
      color: theme.colors.accent,
      textAlign: 'center' as const,
    },
    impactBadge: {
      backgroundColor: theme.colors.accent + '15',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: 8,
      marginTop: theme.spacing.xs,
    },
    impactText: {
      ...theme.textStyles.caption,
      color: theme.colors.accent,
      fontWeight: '600' as const,
      fontSize: 10,
    },
    additionalStats: {
      marginHorizontal: theme.spacing.xl,
      marginBottom: theme.spacing.xxxl,
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: theme.spacing.lg,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    statRow: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.subtle,
    },
    statRowLast: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 0,
      borderBottomColor: theme.colors.border.subtle,
    },
    statRowLabel: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.secondary,
    },
    statRowLabelWithImpact: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: theme.spacing.xs,
    },
    inlineImpactBadge: {
      backgroundColor: theme.colors.accent + '10',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
    },
    inlineImpactText: {
      ...theme.textStyles.caption,
      color: theme.colors.accent,
      fontWeight: '600' as const,
      fontSize: 9,
    },
    statRowValue: {
      ...theme.textStyles.bodyLarge,
      color: theme.colors.text.primary,
      fontWeight: '600' as const,
    },
    goalCard: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.lg,
      borderRadius: 16,
      marginHorizontal: theme.spacing.xl,
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
      fontWeight: '600' as const,
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
      fontWeight: '800' as const,
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
      height: '100%' as const,
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
      fontWeight: '800' as const,
      color: '#F59E0B', // warning color
    },
    sectionHeader: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      marginBottom: theme.spacing.lg,
    },
    viewAllText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.accent,
      fontWeight: '600' as const,
    },
    achievementGrid: {
      flexDirection: 'row' as const,
      gap: theme.spacing.md,
      marginTop: theme.spacing.lg,
    },
    achievementCard: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.lg,
      borderRadius: 16,
      alignItems: 'center' as const,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2,
    },
    achievementValue: {
      ...theme.textStyles.headline3,
      fontWeight: '800' as const,
      color: theme.colors.text.primary,
      marginTop: theme.spacing.sm,
    },
    achievementLabel: {
      ...theme.textStyles.caption,
      color: theme.colors.text.secondary,
      marginTop: 4,
    },
    bottomPadding: {
      height: 100, // Space for tab bar
    },
    scoreTrendPlaceholder: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      padding: theme.spacing.xxl,
      marginBottom: theme.spacing.lg,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      shadowColor: theme.colors.shadow.medium,
      shadowOffset: {width: 0, height: 6},
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 5,
    },
    scoreTrendPlaceholderText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing.md,
      textAlign: 'center' as const,
      fontWeight: '600' as const,
    },
    scoreTrendPlaceholderSubtext: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.text.tertiary,
      marginTop: theme.spacing.xs,
      textAlign: 'center' as const,
    },
  };

  const menuOptions: MenuOption[] = [
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'notifications',
      action: () => navigation.navigate('NotificationCenter' as never),
      color: theme.colors.warning,
    },
    {
      id: 'ai-chat',
      label: 'AI Assistant',
      icon: 'chatbubbles',
      action: () => setShowAIChat(true),
      color: theme.colors.accent,
    },
    {
      id: 'download-report',
      label: 'Download Report',
      icon: 'download',
      action: () => {
        Alert.alert('Download Report', 'Your credit report will be downloaded as a PDF.', [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Download', onPress: () => {}},
        ]);
      },
      color: theme.colors.success,
    },
  ];

  // Calculate metrics from fullReport (similar to CreditReportScreen)
  const calculatedMetrics = React.useMemo(() => {
    // Extract summary from fullReport based on selected bureau
    let apiSummary: any = null;
    const fullReportAny = fullReport as any;
    if (fullReportAny?.providerViews) {
      const bureauToProvider: Record<CreditBureau, string> = {
        equifax: 'EFX',
        transunion: 'TU',
        experian: 'EXP',
      };
      const providerCode = bureauToProvider[selectedBureau];
      const providerView = fullReportAny.providerViews.find(
        (pv: any) => pv.provider === providerCode,
      );
      apiSummary = providerView?.summary || null;
    }

    // Get accounts from fullReport
    let accounts: any[] = [];
    if (fullReport) {
      accounts = flattenEquifaxAccounts(fullReport, selectedBureau);
    }

    const mappedAccounts = accounts.map(mapApiAccountToCreditAccount);

    // Calculate payment history from account data
    let totalPayments = 0;
    let onTimePayments = 0;

    mappedAccounts.forEach((account: CreditAccount) => {
      if (account.paymentHistory?.payments) {
        account.paymentHistory.payments.forEach((payment: {status: string}) => {
          if (payment.status !== 'unknown') {
            totalPayments++;
            if (payment.status === 'current') {
              onTimePayments++;
            }
          }
        });
      }
    });

    // Calculate on-time payment percentage
    const onTimePercentage =
      mappedAccounts.length > 0 &&
      mappedAccounts.some(
        (acc: CreditAccount) => acc.paymentHistory?.onTimePaymentPercentage !== undefined,
      )
        ? Math.round(
            mappedAccounts
              .filter(
                (acc: CreditAccount) => acc.paymentHistory?.onTimePaymentPercentage !== undefined,
              )
              .reduce(
                (sum: number, acc: CreditAccount) =>
                  sum + (acc.paymentHistory?.onTimePaymentPercentage || 0),
                0,
              ) /
              mappedAccounts.filter(
                (acc: CreditAccount) => acc.paymentHistory?.onTimePaymentPercentage !== undefined,
              ).length,
          )
        : totalPayments > 0
          ? Math.round((onTimePayments / totalPayments) * 100)
          : 0;

    // Calculate totals from accounts
    const totalBalance = mappedAccounts.reduce(
      (sum: number, acc: CreditAccount) => sum + acc.balance,
      0,
    );
    const totalCreditLimit = mappedAccounts.reduce(
      (sum: number, acc: CreditAccount) => sum + (acc.creditLimit || 0),
      0,
    );
    const utilizationRate = totalCreditLimit > 0 ? totalBalance / totalCreditLimit : 0;

    // Get total accounts count
    const totalAccountsCount = mappedAccounts.length;

    // Calculate average account age from accounts
    const now = new Date();
    const accountAges = mappedAccounts.map((acc: CreditAccount) => {
      const openDate = new Date(acc.openDate);
      const months = (now.getTime() - openDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      return months;
    });
    const averageAccountAge =
      accountAges.length > 0
        ? Math.round(
            accountAges.reduce((sum: number, age: number) => sum + age, 0) / accountAges.length,
          )
        : 0;

    // Extract data from API summary with fallback to calculated values
    const apiTotalAccountsFromSummary = apiSummary
      ? (apiSummary.revolvingAccounts?.totalAccounts || 0) +
        (apiSummary.installmentAccounts?.totalAccounts || 0) +
        (apiSummary.mortgageAccounts?.totalAccounts || 0)
      : 0;

    const apiTotalAccounts = totalAccountsCount || apiTotalAccountsFromSummary || 0;

    const apiTotalBalance =
      apiSummary?.totalOpenAccounts?.balance?.amount ||
      apiSummary?.revolvingAccounts?.balance?.amount ||
      totalBalance;

    const apiTotalCreditLimit =
      apiSummary?.totalOpenAccounts?.creditLimit?.amount ||
      apiSummary?.revolvingAccounts?.creditLimit?.amount ||
      totalCreditLimit;

    const apiUtilizationRate = apiSummary?.totalOpenAccounts?.debtToCreditRatio
      ? apiSummary.totalOpenAccounts.debtToCreditRatio / 100
      : apiSummary?.revolvingAccounts?.debtToCreditRatio
        ? apiSummary.revolvingAccounts.debtToCreditRatio / 100
        : utilizationRate;

    const apiAverageAge = apiSummary?.averageAccountAgeMonths || averageAccountAge;

    return {
      utilizationRate: apiUtilizationRate,
      onTimePercentage,
      totalAccounts: apiTotalAccounts,
      totalBalance: apiTotalBalance,
      totalCreditLimit: apiTotalCreditLimit,
      availableCredit: apiTotalCreditLimit - apiTotalBalance,
      averageAccountAge: apiAverageAge,
    };
  }, [fullReport, selectedBureau]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HeaderWithOptions
        title="Credit Dashboard"
        subtitle={`Welcome back, ${user?.firstName || 'Tarik'}`}
        icon="analytics"
        iconColor={theme.colors.tabBar.activeIcon}
        options={menuOptions}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor={theme.colors.accent}
            colors={[theme.colors.accent]}
          />
        }>
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Bureau Dropdown */}
        <View style={{paddingHorizontal: theme.spacing.xl, marginBottom: theme.spacing.lg}}>
          <BureauDropdown
            selectedBureau={selectedBureau}
            onBureauChange={bureau => {
              // Filter out 'all' as it's not supported in creditStore
              if (bureau !== 'all') {
                setSelectedBureau(bureau as CreditBureau);
              }
            }}
            availableBureaus={availableBureaus}
          />
        </View>

        {/* Credit Score Section */}
        <Animated.View
          style={[
            styles.scoreSection,
            {
              opacity: cardFadeAnim,
              transform: [{translateY: contentSlideAnim}],
            },
          ]}>
          <View style={styles.scoreSectionHeader}>
            <View>
              <Text style={styles.scoreSectionTitle}>Credit Score</Text>
              <Text style={styles.refreshTextWithMargin}>
                {selectedBureau.charAt(0).toUpperCase() + selectedBureau.slice(1)} Data
              </Text>
            </View>
            {lastUpdated && (
              <View style={styles.refreshButton}>
                <Ionicons name="time-outline" size={14} color={theme.colors.text.secondary} />
                <Text style={styles.refreshText}>{formatLastUpdated(lastUpdated)}</Text>
              </View>
            )}
          </View>

          <View style={styles.scoreCard}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.accent} />
                <Text style={styles.loadingText}>Loading credit data...</Text>
              </View>
            ) : creditScore ? (
              <>
                <ScoreGauge score={creditScore.score} category={scoreCategory} animated={true} />

                {/* View Factors Button */}
                {creditScore.factors && creditScore.factors.length > 0 && (
                  <TouchableOpacity
                    style={styles.viewFactorsButton}
                    onPress={() => setShowScoreFactors(true)}
                    activeOpacity={0.7}>
                    <Ionicons name="list" size={16} color={theme.colors.accent} />
                    <Text style={styles.viewFactorsText}>
                      View Factors ({creditScore.factors.length})
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color={theme.colors.accent} />
                  </TouchableOpacity>
                )}

                <View style={styles.scoreMetadata}>
                  <Text style={styles.lastUpdated}>
                    Last updated: {formatLastUpdated(lastUpdated)}
                  </Text>
                  {creditScore.bureau && (
                    <Text style={styles.bureau}>Source: {creditScore.bureau}</Text>
                  )}
                  <TouchableOpacity
                    style={styles.factorWeightsLink}
                    onPress={() => setShowFactorWeights(true)}
                    activeOpacity={0.7}>
                    <Ionicons name="analytics-outline" size={12} color={theme.colors.accent} />
                    <Text style={styles.factorWeightsLinkText}>What impacts your score?</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.noScoreContainer}>
                <Ionicons
                  name="document-text-outline"
                  size={48}
                  color={theme.colors.text.tertiary}
                />
                <Text style={styles.noScoreText}>No data found</Text>
                <Text style={styles.noScoreSubtext}>
                  Unable to load credit score data at this time
                </Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Credit Score History Graph */}
        {flags.scoreTrend && (
          <Animated.View
            style={[
              {
                paddingHorizontal: theme.spacing.xl,
                opacity: cardFadeAnim,
                transform: [{translateY: contentSlideAnim}],
              },
            ]}>
            {transformedScoreHistory ? (
              <ScoreTrendCard data={transformedScoreHistory} />
            ) : (
              <View style={styles.scoreTrendPlaceholder}>
                <Ionicons name="trending-up-outline" size={32} color={theme.colors.text.tertiary} />
                <Text style={styles.scoreTrendPlaceholderText}>
                  Missing or invalid data, can't generate graph
                </Text>
                <Text style={styles.scoreTrendPlaceholderSubtext}>
                  Historical score data will appear here once available
                </Text>
              </View>
            )}
          </Animated.View>
        )}

        {/* Credit Goal Card */}
        {flags.improvementPlan && (
          <Animated.View
            style={[
              {
                opacity: cardFadeAnim,
                transform: [{translateY: contentSlideAnim}],
              },
            ]}>
            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Ionicons name="flag" size={18} color={theme.colors.accent} />
                <Text style={styles.goalTitle}>
                  Goal: Reach {mockOptimalPathProgress.targetScore} score for mortgage
                </Text>
              </View>

              <View style={styles.scoreProgress}>
                <View style={styles.scoreItem}>
                  <Text style={styles.scoreValue}>{mockOptimalPathProgress.currentScore}</Text>
                  <Text style={styles.scoreLabel}>Current</Text>
                </View>

                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${
                            ((mockOptimalPathProgress.currentScore - 300) /
                              (mockOptimalPathProgress.targetScore - 300)) *
                            100
                          }%`,
                        },
                      ]}
                    />
                  </View>
                </View>

                <View style={styles.scoreItem}>
                  <Text style={[styles.scoreValue, {color: theme.colors.accent}]}>
                    {mockOptimalPathProgress.targetScore}
                  </Text>
                  <Text style={styles.scoreLabel}>Target</Text>
                </View>
              </View>

              <View style={styles.gapContainer}>
                <Text style={styles.gapLabel}>Gap: </Text>
                <Text style={styles.gapValue}>
                  {mockOptimalPathProgress.targetScore - mockOptimalPathProgress.currentScore}{' '}
                  points
                </Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Quick Stats Section */}
        <Animated.View
          style={[
            styles.quickStatsSection,
            {
              opacity: cardFadeAnim,
              transform: [{translateY: contentSlideAnim}],
            },
          ]}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.quickStats}>
            <TouchableOpacity
              style={styles.statItem}
              onPress={() => handleMetricPress('utilization')}
              activeOpacity={0.7}>
              <View style={styles.statIcon}>
                <Ionicons name="pie-chart" size={24} color={theme.colors.accent} />
              </View>
              <Text style={styles.statLabel}>Credit Utilization</Text>
              <Text style={styles.statValue}>
                {calculatedMetrics.utilizationRate !== undefined
                  ? `${Math.round(calculatedMetrics.utilizationRate * 100)}%`
                  : '--'}
              </Text>
              <View style={styles.impactBadge}>
                <Text style={styles.impactText}>20% Impact</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.statItem}
              onPress={() => handleMetricPress('payment_history')}
              activeOpacity={0.7}>
              <View style={styles.statIcon}>
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
              </View>
              <Text style={styles.statLabel}>Payment History</Text>
              <Text style={styles.statValue}>
                {calculatedMetrics.onTimePercentage !== undefined
                  ? `${calculatedMetrics.onTimePercentage}%`
                  : '--'}
              </Text>
              <View style={styles.impactBadge}>
                <Text style={styles.impactText}>40% Impact</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Additional Stats */}
        <Animated.View
          style={[
            styles.additionalStats,
            {
              opacity: cardFadeAnim,
              transform: [{translateY: contentSlideAnim}],
            },
          ]}>
          <Text style={[styles.sectionTitle, {marginBottom: theme.spacing.lg}]}>
            Account Summary
          </Text>
          <View style={styles.statRow}>
            <View style={styles.statRowLabelWithImpact}>
              <Text style={styles.statRowLabel}>Total Accounts</Text>
              <View style={styles.inlineImpactBadge}>
                <Text style={styles.inlineImpactText}>21% Impact</Text>
              </View>
            </View>
            <Text style={styles.statRowValue}>{calculatedMetrics.totalAccounts || 0}</Text>
          </View>
          <View style={styles.statRow}>
            <View style={styles.statRowLabelWithImpact}>
              <Text style={styles.statRowLabel}>Total Balance</Text>
              <View style={styles.inlineImpactBadge}>
                <Text style={styles.inlineImpactText}>11% Impact</Text>
              </View>
            </View>
            <Text style={styles.statRowValue}>
              ${(calculatedMetrics.totalBalance || 0).toLocaleString()}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statRowLabel}>Credit Limit</Text>
            <Text style={styles.statRowValue}>
              ${(calculatedMetrics.totalCreditLimit || 0).toLocaleString()}
            </Text>
          </View>
          <View style={styles.statRow}>
            <View style={styles.statRowLabelWithImpact}>
              <Text style={styles.statRowLabel}>Available Credit</Text>
              <View style={styles.inlineImpactBadge}>
                <Text style={styles.inlineImpactText}>3% Impact</Text>
              </View>
            </View>
            <Text style={styles.statRowValue}>
              ${(calculatedMetrics.availableCredit || 0).toLocaleString()}
            </Text>
          </View>
          <View style={styles.statRowLast}>
            <View style={styles.statRowLabelWithImpact}>
              <Text style={styles.statRowLabel}>Average Account Age</Text>
              <View style={styles.inlineImpactBadge}>
                <Text style={styles.inlineImpactText}>21% Impact</Text>
              </View>
            </View>
            <Text style={styles.statRowValue}>
              {calculatedMetrics.averageAccountAge || 0} months
            </Text>
          </View>
        </Animated.View>

        {/* Gamification Section */}
        {flags.achievements && (
          <Animated.View
            style={[
              {
                marginHorizontal: theme.spacing.xl,
                marginBottom: theme.spacing.xl,
                opacity: cardFadeAnim,
                transform: [{translateY: contentSlideAnim}],
              },
            ]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Progress</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('GamificationScreen' as never)}
                activeOpacity={0.7}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            {/* Streak Display */}
            {mockGamificationState.streaks.length > 0 && (
              <StreakCard streak={mockGamificationState.streaks[0]} />
            )}

            {/* Quick Stats */}
            <View style={styles.achievementGrid}>
              <TouchableOpacity
                style={styles.achievementCard}
                onPress={() => navigation.navigate('GamificationScreen' as never)}
                activeOpacity={0.7}>
                <Ionicons name="trophy" size={32} color={theme.colors.warning} />
                <Text style={styles.achievementValue}>{mockGamificationState.badges.length}</Text>
                <Text style={styles.achievementLabel}>Badges</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.achievementCard}
                onPress={() => navigation.navigate('GamificationScreen' as never)}
                activeOpacity={0.7}>
                <Ionicons name="star" size={32} color={theme.colors.accent} />
                <Text style={styles.achievementValue}>{mockGamificationState.points}</Text>
                <Text style={styles.achievementLabel}>Points</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.achievementCard}
                onPress={() => navigation.navigate('GamificationScreen' as never)}
                activeOpacity={0.7}>
                <Ionicons name="trending-up" size={32} color={theme.colors.success} />
                <Text style={styles.achievementValue}>
                  +{mockGamificationState.totalScoreIncrease}
                </Text>
                <Text style={styles.achievementLabel}>Score Gain</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* Bottom padding to ensure content is not hidden by tab bar */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* AI Chat Modal */}
      <AIChatModal
        visible={showAIChat}
        onClose={() => setShowAIChat(false)}
        initialContext="Dashboard"
      />

      {/* Credit Metric Detail Modal */}
      {selectedMetric && reportSummary && (
        <CreditMetricDetailModal
          visible={showMetricDetail}
          onClose={() => setShowMetricDetail(false)}
          metricType={selectedMetric}
          metricData={getCreditMetricDetails(selectedMetric, reportSummary)}
        />
      )}

      {/* Score Factors Modal */}
      {creditScore && (
        <ScoreFactorsModal
          visible={showScoreFactors}
          onClose={() => setShowScoreFactors(false)}
          factors={creditScore.factors || []}
          score={creditScore.score}
          bureau={creditScore.bureau || selectedBureau}
        />
      )}

      {/* Tutorial Modal */}
      <TutorialModal
        visible={showTutorial}
        onClose={() => setShowTutorial(false)}
        onComplete={completeTutorial}
      />

      {/* Factor Weights Modal */}
      <CreditFactorWeightsModal
        visible={showFactorWeights}
        onClose={() => setShowFactorWeights(false)}
      />
    </SafeAreaView>
  );
};
