/* eslint-disable @typescript-eslint/no-explicit-any */

import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useCreditStore} from '../../stores/creditStore';
import {CreditAccount} from '../../types';
import {useTheme} from '../../contexts/ThemeContext';
import {Ionicons} from '@expo/vector-icons';
import {useFeatureFlagsStore} from '../../stores/featureFlagsStore';
import {HeaderWithOptions, MenuOption} from '../../components/common/HeaderWithOptions';
import {AIChatModal} from '../../components/ai/AIChatModal';
import {EmptyState} from '../../components/common/EmptyState';
import {BureauDropdown, Bureau} from '../../components/common/BureauDropdown';
import {AccountTypeSection} from '../../components/AccountTypeSection';
import {PersonalInfoSection} from '../../components/creditReport/PersonalInfoSection';
import {PublicRecordsSection} from '../../components/creditReport/PublicRecordsSection';
import {CollectionsSection} from '../../components/creditReport/CollectionsSection';
import {CreditAccountsAccordion} from '../../components/creditReport/CreditAccountsAccordion';
import {calculateDerogatoryMarks, getDerogatoryColor} from '../../utils/derogatoryMarks';
import {
  mapApiAccountToCreditAccount,
  mapApiInquiryToCreditInquiry,
  mapApiPersonalInfo,
  mapApiPublicRecord,
  convertToApiCreditAccount,
} from '../../utils/apiMappers';
import {
  flattenEquifaxAccounts,
  flattenEquifaxInquiries,
  extractEquifaxPersonalInfo,
  flattenEquifaxPublicRecords,
  flattenEquifaxCollections,
} from '../../utils/equifaxDataExtractors';
import {formatCurrency, formatDate} from '../../utils/formatters';
import {
  createStyles,
  getTabButtonStyle,
  getTabTextStyle,
  getTabIconColor,
  getCountBadgeStyle,
  getCountTextStyle,
  getErrorTextStyle,
  getCardGradientBorderStyle,
  getEnhancedIconContainerStyle,
  getCardValueStyle,
  getProgressTrackStyle,
  getProgressFillStyle,
  getAnimatedCardStyle,
  getAnimatedInquiryCardStyle,
  getInquiryIconContainerStyle,
  getInquiryIconColor,
  getInquiryBadgeStyle,
  getInquiryTypeTextStyle,
} from './styles/CreditReportScreen.styles';

// const {width: screenWidth} = Dimensions.get('window'); // Unused for now

// Helper function to render error state with retry
const renderErrorState = (message: string, onRetry: () => void, theme: any, styles: any) => {
  return (
    <View style={styles.emptyState}>
      <Ionicons name="alert-circle" size={48} color={theme.colors.error} />
      <Text style={[styles.emptyStateText, getErrorTextStyle(theme)]}>{message}</Text>
    </View>
  );
};

// Helper function to render "API not connected" state
const renderApiNotConnectedState = (sectionName: string, theme: any, styles: any) => {
  return (
    <View style={styles.emptyState}>
      <Ionicons name="cloud-offline" size={48} color={theme.colors.text.tertiary} />
      <Text style={styles.emptyStateText}>API is not yet connected</Text>
      <Text style={styles.emptyStateSubtext}>
        The {sectionName} API endpoint has not been implemented yet.
      </Text>
    </View>
  );
};

// Helper function to render empty data state
const renderEmptyState = (icon: string, title: string, description: string, theme: any) => {
  return (
    <EmptyState
      icon={icon as any}
      title={title}
      description={description}
      decorativeIcon="search-outline"
      iconColor={theme.colors.text.tertiary}
    />
  );
};

export const CreditReportScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const {
    reportSummary,
    fullReport,
    isLoading,
    error,
    fetchFullReport,
    fetchReportSummary,
    clearError,
    availableBureaus,
  } = useCreditStore();
  const {flags} = useFeatureFlagsStore();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedBureau, setSelectedBureau] = useState<Bureau>('equifax');
  const [selectedSection, setSelectedSection] = useState<
    'accounts' | 'inquiries' | 'summary' | 'personal' | 'public_records' | 'collections'
  >('summary');
  const [showAIChat, setShowAIChat] = useState(false);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
  const [showInquiriesInfo, setShowInquiriesInfo] = useState(false);
  const [showAccountsInfo, setShowAccountsInfo] = useState(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  // Increased to 12 to accommodate all summary items (9 original + 2 collections + 1 public records = 12)
  const cardAnimations = useRef(Array.from({length: 12}, () => new Animated.Value(0))).current;

  useEffect(() => {
    if (!fullReport || !reportSummary) {
      // Fetch both endpoints separately
      fetchFullReport();
      fetchReportSummary();
    } else {
      // Mark as initially loaded if we already have data
      setHasInitiallyLoaded(true);
    }

    // Note: Alerts API call removed as requested

    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Stagger card animations
    const animations = cardAnimations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
    );
    Animated.stagger(50, animations).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track when loading completes (even if no data was returned)
  useEffect(() => {
    if (!isLoading && !hasInitiallyLoaded) {
      // Mark as loaded once loading completes, regardless of whether we got data
      // This ensures we show cards (even with zeros) after the first load attempt
      setHasInitiallyLoaded(true);
    }
  }, [isLoading, hasInitiallyLoaded]);

  const handleRefresh = async () => {
    setRefreshing(true);
    clearError();
    try {
      // Fetch all endpoints (alerts API call removed)
      await Promise.allSettled([fetchFullReport(), fetchReportSummary()]);
    } catch {
      // Handle refresh error silently or show user feedback
      // Individual fetch functions handle their own error states
    }
    setRefreshing(false);
  };

  // Removed unused helper functions

  const renderTabButton = (
    key: 'accounts' | 'inquiries' | 'summary' | 'personal' | 'public_records' | 'collections',
    title: string,
    icon: string,
    count?: number,
  ) => {
    const isActive = selectedSection === key;
    return (
      <TouchableOpacity
        key={key}
        style={[styles.compactTabButton, getTabButtonStyle(theme, isActive)]}
        onPress={() => setSelectedSection(key)}
        activeOpacity={0.7}>
        <Ionicons name={icon as any} size={16} color={getTabIconColor(theme, isActive)} />
        <Text style={[styles.compactTabText, getTabTextStyle(theme, isActive)]}>{title}</Text>
        {count !== undefined && count > 0 && (
          <View style={[styles.compactCountBadge, getCountBadgeStyle(theme, isActive)]}>
            <Text style={[styles.compactCountText, getCountTextStyle(theme, isActive)]}>
              {count}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderSummarySection = () => {
    // Extract summary from fullReport based on selected bureau
    // Note: The actual API response has providerViews, but the type definition doesn't match
    let apiSummary: any = null;
    const fullReportAny = fullReport as any;
    if (fullReportAny?.providerViews) {
      // Map bureau names to provider codes
      const bureauToProvider: Record<Exclude<Bureau, 'all'>, string> = {
        equifax: 'EFX',
        transunion: 'TU',
        experian: 'EXP',
      };
      const providerCode = bureauToProvider[selectedBureau as Exclude<Bureau, 'all'>];
      const providerView = fullReportAny.providerViews.find(
        (pv: any) => pv.provider === providerCode,
      );
      apiSummary = providerView?.summary || null;
    }

    // Fallback to reportSummary if available
    const summary = apiSummary || reportSummary;

    // Show error if there's an error and no data
    if (error && !fullReportAny && !reportSummary) {
      return (
        <View style={styles.sectionContainer}>
          {renderErrorState(error, handleRefresh, theme, styles)}
        </View>
      );
    }

    // Show API not connected if no data and no error (meaning API might not be implemented)
    if (!summary && !fullReportAny && !isLoading) {
      return (
        <View style={styles.sectionContainer}>
          {renderApiNotConnectedState('report summary', theme, styles)}
        </View>
      );
    }

    // Calculate derogatory marks using real data only
    let accounts = [];
    let publicRecords: any[] = [];
    let collections: any[] = [];

    if (fullReport) {
      accounts = flattenEquifaxAccounts(fullReport, selectedBureau);
      publicRecords = flattenEquifaxPublicRecords(fullReport, selectedBureau);
      collections = flattenEquifaxCollections(fullReport, selectedBureau);
    } else if (summary?.accounts) {
      accounts = summary.accounts;
    }

    const mappedAccounts = accounts.map(mapApiAccountToCreditAccount);
    const mappedPublicRecords = publicRecords.map(mapApiPublicRecord);

    // Determine if we have data sources available (after data is calculated)
    const hasAccountsData =
      fullReportAny || summary?.accounts || accounts.length > 0 || mappedAccounts.length > 0;
    const hasCollectionsData = fullReportAny || collections.length > 0;
    const hasPublicRecordsData = fullReportAny || mappedPublicRecords.length > 0;
    const hasSummaryData = apiSummary || reportSummary;

    // Calculate payment history from account data
    let totalPayments = 0;
    let onTimePayments = 0;
    let latePaymentsCount = 0;

    mappedAccounts.forEach((account: CreditAccount) => {
      if (account.paymentHistory?.payments) {
        account.paymentHistory.payments.forEach((payment: {status: string}) => {
          // Only count reported payments (exclude 'unknown' status)
          if (payment.status !== 'unknown') {
            totalPayments++;
            if (payment.status === 'current') {
              onTimePayments++;
            } else if (payment.status === 'late' || payment.status === 'derogatory') {
              latePaymentsCount++;
            }
          }
        });
      }
    });

    // Use onTimePaymentPercentage from parsed history if available, otherwise calculate
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

    // Get open accounts count - count accounts that are not closed
    const openAccountsCount = mappedAccounts.filter(
      (acc: CreditAccount) => acc.status !== 'closed',
    ).length;

    // Get total accounts count (all accounts, including closed)
    const totalAccountsCount = mappedAccounts.length;

    // Update derogatory marks calculation to include collections
    // Note: Collections are separate from public records in the API
    // Pass summary data to use totalNegativeAccounts from API
    const derogatoryMarks = calculateDerogatoryMarks(
      mappedAccounts,
      mappedPublicRecords,
      apiSummary,
    );
    // Add collections count to derogatory marks
    const totalDerogatoryCount = derogatoryMarks.totalCount + collections.length;

    // Extract data from API summary structure
    // For total accounts, sum up all account types (revolving + installment)
    // The API summary has separate totals for each account type
    // Note: Mortgage accounts are included in the actual account arrays but may not have separate summary totals
    const apiTotalAccountsFromSummary = apiSummary
      ? (apiSummary.revolvingAccounts?.totalAccounts || 0) +
        (apiSummary.installmentAccounts?.totalAccounts || 0) +
        (apiSummary.mortgageAccounts?.totalAccounts || 0)
      : 0;

    // Use actual count from mapped accounts as most accurate, fallback to summary
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

    const apiOpenAccounts = apiSummary?.totalOpenAccounts?.totalAccounts || openAccountsCount;

    // Helper to determine if a card should show loading
    const isCardLoading = (
      requiresAccounts: boolean,
      requiresCollections: boolean,
      requiresPublicRecords: boolean,
      requiresSummary: boolean,
    ) => {
      if (!isLoading) return false;

      if (requiresAccounts && !hasAccountsData) return true;
      if (requiresCollections && !hasCollectionsData) return true;
      if (requiresPublicRecords && !hasPublicRecordsData) return true;
      if (requiresSummary && !hasSummaryData) return true;

      return false;
    };

    const summaryItems = [
      {
        icon: 'card-outline',
        label: 'Total Accounts',
        value: apiTotalAccounts.toString(),
        color: theme.colors.accent,
        isLoading: isCardLoading(true, false, false, false),
      },
      {
        icon: 'checkmark-circle-outline',
        label: 'Open Accounts',
        value: apiOpenAccounts.toString(),
        color: theme.colors.success,
        isLoading: isCardLoading(true, false, false, false),
      },
      {
        icon: 'wallet-outline',
        label: 'Total Balance',
        value: formatCurrency(apiTotalBalance),
        color: theme.colors.warning,
        isLoading: isCardLoading(true, false, false, false),
      },
      {
        icon: 'trending-up-outline',
        label: 'Credit Limit',
        value: formatCurrency(apiTotalCreditLimit),
        color: theme.colors.info,
        isLoading: isCardLoading(true, false, false, false),
      },
      {
        icon: 'pie-chart-outline',
        label: 'Credit Utilization',
        value: `${Math.round(apiUtilizationRate * 100)}%`,
        color: apiUtilizationRate > 0.3 ? theme.colors.warning : theme.colors.success,
        isLoading: isCardLoading(true, false, false, false),
      },
      {
        icon: 'time-outline',
        label: 'Average Age',
        value: `${apiAverageAge} mo`,
        color: theme.colors.info,
        isLoading: isCardLoading(true, false, false, false),
      },
      {
        icon: 'shield-checkmark-outline',
        label: 'Payment History',
        value: `${onTimePercentage}%`,
        color: theme.colors.success,
        isLoading: isCardLoading(true, false, false, false),
      },
      {
        icon: 'alert-circle-outline',
        label: 'Late Payments',
        value: latePaymentsCount.toString(),
        color: latePaymentsCount > 0 ? theme.colors.error : theme.colors.success,
        isLoading: isCardLoading(true, false, false, false),
      },
      {
        icon: totalDerogatoryCount === 0 ? 'shield-checkmark-outline' : 'warning-outline',
        label: 'Derogatory Marks',
        value: totalDerogatoryCount.toString(),
        color: getDerogatoryColor(theme, derogatoryMarks.severity),
        isLoading: isCardLoading(true, false, true, false),
      },
      {
        icon: 'cash-outline',
        label: 'Collections',
        value: collections.length.toString(),
        color: collections.length > 0 ? theme.colors.error : theme.colors.success,
        isLoading: isCardLoading(false, true, false, false),
      },
      {
        icon: 'document-text-outline',
        label: 'Public Records',
        value: mappedPublicRecords.length.toString(),
        color: mappedPublicRecords.length > 0 ? theme.colors.error : theme.colors.success,
        isLoading: isCardLoading(false, false, true, false),
      },
    ];

    return (
      <View style={styles.enhancedSummaryContainer}>
        {/* Enhanced grid */}
        <View style={styles.enhancedSummaryGrid}>
          {summaryItems.map((item, index) => {
            const isMetricPositive =
              item.label === 'Payment History' || item.label === 'Open Accounts';

            // Get animation ref with fallback to prevent undefined errors
            const animRef = cardAnimations[index] || new Animated.Value(1);

            return (
              <Animated.View
                key={index}
                style={[styles.enhancedSummaryCard, getAnimatedCardStyle(animRef)]}>
                <View style={[styles.cardGradientBorder, getCardGradientBorderStyle(item.color)]}>
                  <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                      <View
                        style={[
                          styles.enhancedIconContainer,
                          getEnhancedIconContainerStyle(item.color),
                        ]}>
                        <Ionicons name={item.icon as any} size={20} color={item.color} />
                      </View>
                      {/* Trend indicator */}
                      <View style={styles.trendIndicator}>
                        <Ionicons
                          name={isMetricPositive ? 'trending-up' : 'remove'}
                          size={12}
                          color={
                            isMetricPositive ? theme.colors.success : theme.colors.text.tertiary
                          }
                        />
                      </View>
                    </View>

                    <Text style={styles.enhancedCardLabel}>{item.label}</Text>
                    {item.isLoading ? (
                      <View style={styles.cardLoadingContainer}>
                        <ActivityIndicator size="small" color={item.color} />
                      </View>
                    ) : (
                      <Text style={[styles.enhancedCardValue, getCardValueStyle(item.color)]}>
                        {item.value}
                      </Text>
                    )}

                    {/* Progress bar for percentage values */}
                    {!item.isLoading && item.value.includes('%') && (
                      <View style={styles.progressContainer}>
                        <View style={[styles.progressTrack, getProgressTrackStyle(item.color)]}>
                          <Animated.View
                            style={[
                              styles.progressFill,
                              getProgressFillStyle(item.color, item.value),
                            ]}
                          />
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              </Animated.View>
            );
          })}
        </View>

        {/* Account Details Accordion */}
        <CreditAccountsAccordion accounts={mappedAccounts} summaryData={apiSummary} />
      </View>
    );
  };

  // Removed old summary section implementation

  const renderAccountsSection = () => {
    // Show error if there's an error and no data
    if (error && !fullReport && !reportSummary) {
      return (
        <View style={styles.sectionContainer}>
          {renderErrorState(error, handleRefresh, theme, styles)}
        </View>
      );
    }

    // Get accounts from fullReport first, then reportSummary
    let rawAccounts = [];

    if (fullReport) {
      rawAccounts = flattenEquifaxAccounts(fullReport, selectedBureau);
    } else if (reportSummary?.accounts) {
      rawAccounts = reportSummary.accounts;
    }

    // Show loading if still loading
    if (isLoading && !fullReport && !reportSummary) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
          <Text style={styles.loadingText}>Loading accounts...</Text>
        </View>
      );
    }

    // Show API not connected if no data source available
    if (!fullReport && !reportSummary) {
      return (
        <View style={styles.sectionContainer}>
          {renderApiNotConnectedState('accounts', theme, styles)}
        </View>
      );
    }

    // Map raw API accounts to our CreditAccount interface
    const mappedAccounts = rawAccounts ? rawAccounts.map(mapApiAccountToCreditAccount) : [];

    // Group accounts by type
    const accountsByType = mappedAccounts.reduce(
      (acc, account) => {
        const type = account.type;
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(account);
        return acc;
      },
      {} as Record<string, CreditAccount[]>,
    );

    // Define account type metadata with icons and colors
    const accountTypeMetadata: Record<
      string,
      {title: string; icon: string; color: string; order: number}
    > = {
      credit_card: {
        title: 'Credit Cards',
        icon: 'card',
        color: theme.colors.accent,
        order: 1,
      },
      mortgage: {
        title: 'Mortgages',
        icon: 'home',
        color: theme.colors.success,
        order: 2,
      },
      auto_loan: {
        title: 'Auto Loans',
        icon: 'car',
        color: theme.colors.warning,
        order: 3,
      },
      student_loan: {
        title: 'Student Loans',
        icon: 'school',
        color: theme.colors.error,
        order: 4,
      },
      personal_loan: {
        title: 'Personal Loans',
        icon: 'person',
        color: theme.colors.accent,
        order: 5,
      },
      other: {
        title: 'Others',
        icon: 'ellipsis-horizontal-circle',
        color: theme.colors.info,
        order: 6,
      },
    };

    // Separate known account types from others
    const knownTypes = ['credit_card', 'mortgage', 'auto_loan', 'student_loan', 'personal_loan'];
    const otherAccounts: CreditAccount[] = [];
    const knownAccountsByType: Record<string, CreditAccount[]> = {};

    Object.keys(accountsByType).forEach(type => {
      if (knownTypes.includes(type)) {
        knownAccountsByType[type] = accountsByType[type];
      } else {
        // Collect all unknown types into "Others"
        otherAccounts.push(...accountsByType[type]);
      }
    });

    // Add "other" type if we have any other accounts
    if (otherAccounts.length > 0) {
      knownAccountsByType.other = otherAccounts;
    }

    // Sort account types by priority order
    const sortedAccountTypes = Object.keys(knownAccountsByType).sort((a, b) => {
      const orderA = accountTypeMetadata[a]?.order || 999;
      const orderB = accountTypeMetadata[b]?.order || 999;
      return orderA - orderB;
    });

    return (
      <View style={styles.sectionContainer}>
        {/* Show empty state if no accounts */}
        {!mappedAccounts.length ? (
          renderEmptyState(
            'folder-open-outline',
            'No Accounts Found',
            'No credit accounts have been reported yet. Accounts will appear here once they are added to your credit report.',
            theme,
          )
        ) : (
          <>
            {sortedAccountTypes.map((accountType, index) => {
              const metadata = accountTypeMetadata[accountType];

              return (
                <AccountTypeSection
                  key={index}
                  title={metadata.title}
                  icon={metadata.icon}
                  accounts={knownAccountsByType[accountType].map(convertToApiCreditAccount)}
                  color={metadata.color}
                  defaultExpanded={false}
                />
              );
            })}
          </>
        )}

        {/* Info Box */}
        <TouchableOpacity
          style={styles.infoBox}
          onPress={() => setShowAccountsInfo(!showAccountsInfo)}
          activeOpacity={0.7}>
          <Ionicons name="information-circle" size={20} color={theme.colors.accent} />
          <View style={styles.infoBoxContent}>
            <View style={styles.infoBoxHeader}>
              <Text style={styles.infoBoxTitle}>About Credit Accounts</Text>
              <Text style={styles.seeMoreText}>
                {showAccountsInfo ? 'See less' : 'See more...'}
              </Text>
            </View>
            {showAccountsInfo && (
              <Text style={styles.infoBoxText}>
                Credit accounts include credit cards, mortgages, auto loans, student loans, and
                personal loans. Your payment history, credit utilization, and account age on these
                accounts are key factors in your credit score. Maintaining accounts in good standing
                helps build a strong credit profile.
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderInquiriesSection = () => {
    // Show error if there's an error and no data
    if (error && !fullReport && !reportSummary) {
      return (
        <View style={styles.sectionContainer}>
          {renderErrorState(error, handleRefresh, theme, styles)}
        </View>
      );
    }

    // Get inquiries from fullReport first, then reportSummary
    let rawInquiries = [];

    if (fullReport) {
      rawInquiries = flattenEquifaxInquiries(fullReport, selectedBureau);
    } else if (reportSummary?.inquiries) {
      rawInquiries = reportSummary.inquiries;
    }

    // Show loading if still loading
    if (isLoading && !fullReport && !reportSummary) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
          <Text style={styles.loadingText}>Loading inquiries...</Text>
        </View>
      );
    }

    // Show API not connected if no data source available
    if (!fullReport && !reportSummary) {
      return (
        <View style={styles.sectionContainer}>
          {renderApiNotConnectedState('inquiries', theme, styles)}
        </View>
      );
    }

    // Map raw API inquiries to our CreditInquiry interface
    const mappedInquiries = rawInquiries ? rawInquiries.map(mapApiInquiryToCreditInquiry) : [];

    // Sort inquiries by most recent date first (descending order)
    const sortedInquiries = mappedInquiries.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA; // Most recent first
    });

    return (
      <View style={styles.sectionContainer}>
        {/* Show empty state if no inquiries */}
        {!sortedInquiries.length ? (
          renderEmptyState(
            'folder-open-outline',
            'No Inquiries Found',
            'No credit inquiries have been reported. Inquiries appear when lenders check your credit for applications or account reviews.',
            theme,
          )
        ) : (
          <>
            {sortedInquiries.map((inquiry, index) => {
              const cardAnimation = cardAnimations[index + 6] || new Animated.Value(0);

              // Trigger animation for each inquiry card
              setTimeout(() => {
                Animated.timing(cardAnimation, {
                  toValue: 1,
                  duration: 600,
                  delay: index * 100,
                  useNativeDriver: true,
                }).start();
              }, 100);

              const isHardInquiry = inquiry.type === 'hard';
              const daysSince = Math.floor(
                (new Date().getTime() - new Date(inquiry.date).getTime()) / (1000 * 60 * 60 * 24),
              );

              return (
                <Animated.View
                  key={index}
                  style={[styles.modernInquiryCard, getAnimatedInquiryCardStyle(cardAnimation)]}>
                  <View style={styles.inquiryCardHeader}>
                    <View
                      style={[
                        styles.inquiryIconContainer,
                        getInquiryIconContainerStyle(theme, isHardInquiry),
                      ]}>
                      <Ionicons
                        name={isHardInquiry ? 'warning-outline' : 'information-circle-outline'}
                        size={20}
                        color={getInquiryIconColor(theme, isHardInquiry)}
                      />
                    </View>
                    <View style={styles.inquiryContent}>
                      <Text style={styles.modernInquiryName}>{inquiry.creditorName}</Text>
                      <Text style={styles.inquiryDateText}>
                        {formatDate(inquiry.date)} • {daysSince} days ago
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.modernInquiryBadge,
                        getInquiryBadgeStyle(theme, isHardInquiry),
                      ]}>
                      <Text
                        style={[
                          styles.modernInquiryTypeText,
                          getInquiryTypeTextStyle(theme, isHardInquiry),
                        ]}>
                        {inquiry.type.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  {isHardInquiry && (
                    <View style={styles.impactIndicator}>
                      <Ionicons name="trending-down" size={14} color={theme.colors.warning} />
                      <Text style={styles.impactText}>May affect credit score</Text>
                    </View>
                  )}
                </Animated.View>
              );
            })}
          </>
        )}

        <TouchableOpacity
          style={styles.infoBox}
          onPress={() => setShowInquiriesInfo(!showInquiriesInfo)}
          activeOpacity={0.7}>
          <Ionicons name="information-circle" size={20} color={theme.colors.accent} />
          <View style={styles.infoBoxContent}>
            <View style={styles.infoBoxHeader}>
              <Text style={styles.infoBoxTitle}>About Credit Inquiries</Text>
              <Text style={styles.seeMoreText}>
                {showInquiriesInfo ? 'See less' : 'See more...'}
              </Text>
            </View>
            {showInquiriesInfo && (
              <Text style={styles.infoBoxText}>
                <Text style={styles.infoBold}>Hard inquiries</Text> may impact your credit score and
                remain on your report for 2 years.{' '}
                <Text style={styles.infoBold}>Soft inquiries</Text> don't affect your score and are
                used for pre-qualification checks.
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderContent = () => {
    // Global loading state for initial load only
    // Show loading only if we're actively loading AND haven't loaded data yet
    // This prevents showing empty/zero values before initial data is fetched,
    // but allows content to show once loading completes
    if (isLoading && !hasInitiallyLoaded && !fullReport && !reportSummary) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
          <Text style={styles.loadingText}>Loading credit report...</Text>
        </View>
      );
    }

    switch (selectedSection) {
      case 'summary':
        return renderSummarySection();
      case 'accounts':
        return renderAccountsSection();
      case 'inquiries':
        return renderInquiriesSection();
      case 'personal':
        // Show error if there's an error and no data
        if (error && !fullReport) {
          return (
            <View style={styles.sectionContainer}>
              {renderErrorState(error, handleRefresh, theme, styles)}
            </View>
          );
        }
        // Show loading if still loading
        if (isLoading && !fullReport) {
          return (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.accent} />
              <Text style={styles.loadingText}>Loading personal information...</Text>
            </View>
          );
        }
        // Show API not connected if no data
        if (!fullReport) {
          return (
            <View style={styles.sectionContainer}>
              {renderApiNotConnectedState('personal information', theme, styles)}
            </View>
          );
        }
        // Get personal info from fullReport for selected bureau
        const rawPersonalInfo = extractEquifaxPersonalInfo(fullReport, selectedBureau);
        if (!rawPersonalInfo) {
          return (
            <View style={styles.sectionContainer}>
              {renderEmptyState(
                'folder-open-outline',
                'No Personal Information Found',
                'Personal information has not been reported yet. This section will display your name, addresses, and employment history once available.',
                theme,
              )}
            </View>
          );
        }
        const personalInfo = mapApiPersonalInfo(rawPersonalInfo);

        // Note: Phone numbers in account data are creditor phone numbers, not user's personal phone

        // Get provider name for display
        const bureauNames: Record<Bureau, string> = {
          equifax: 'Equifax',
          transunion: 'TransUnion',
          experian: 'Experian',
          all: 'All Bureaus',
        };
        const providerName = bureauNames[selectedBureau] || 'Selected Provider';

        return <PersonalInfoSection personalInfo={personalInfo} providerName={providerName} />;
      case 'public_records':
        // Show error if there's an error and no data
        if (error && !fullReport) {
          return (
            <View style={styles.sectionContainer}>
              {renderErrorState(error, handleRefresh, theme, styles)}
            </View>
          );
        }
        // Show loading if still loading
        if (isLoading && !fullReport) {
          return (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.accent} />
              <Text style={styles.loadingText}>Loading public records...</Text>
            </View>
          );
        }
        // Show API not connected if no data
        if (!fullReport) {
          return (
            <View style={styles.sectionContainer}>
              {renderApiNotConnectedState('public records', theme, styles)}
            </View>
          );
        }
        // Get public records from fullReport
        const rawPublicRecords = flattenEquifaxPublicRecords(fullReport, selectedBureau);
        const publicRecords = rawPublicRecords.map(mapApiPublicRecord);

        // Always render PublicRecordsSection (it handles empty state internally with info box)
        return <PublicRecordsSection publicRecords={publicRecords} />;
      case 'collections':
        // Show error if there's an error and no data
        if (error && !fullReport) {
          return (
            <View style={styles.sectionContainer}>
              {renderErrorState(error, handleRefresh, theme, styles)}
            </View>
          );
        }
        // Show loading if still loading
        if (isLoading && !fullReport) {
          return (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.accent} />
              <Text style={styles.loadingText}>Loading collections...</Text>
            </View>
          );
        }
        // Show API not connected if no data
        if (!fullReport) {
          return (
            <View style={styles.sectionContainer}>
              {renderApiNotConnectedState('collections', theme, styles)}
            </View>
          );
        }
        // Get collections from fullReport
        const rawCollections = flattenEquifaxCollections(fullReport, selectedBureau);
        return <CollectionsSection collections={rawCollections} />;
      default:
        return renderSummarySection();
    }
  };

  const menuOptions: MenuOption[] = [
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
        Alert.alert(
          'Download Credit Report',
          'Generate a comprehensive PDF report with all your credit information including accounts, inquiries, personal info, and alerts?',
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Download PDF',
              onPress: () => {
                // Simulate download process
                Alert.alert(
                  'Generating Report...',
                  'Please wait while we prepare your PDF report.',
                );
                setTimeout(() => {
                  Alert.alert(
                    'Download Complete!',
                    `Your credit report has been saved to your device.

Filename: CreditGuard_Report_2025.pdf`,
                    [{text: 'OK'}],
                  );
                }, 2000);
              },
            },
          ],
        );
      },
      color: theme.colors.success,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithOptions
        title="Credit Report"
        subtitle="Detailed credit information"
        icon="document-text"
        iconColor={theme.colors.tabBar.activeIcon}
        options={menuOptions}
      />

      {error && (
        <View style={styles.errorBanner}>
          <View style={styles.errorContent}>
            <Ionicons name="warning-outline" size={20} color={theme.colors.error} />
            <View style={styles.errorTextContainer}>
              <Text style={styles.errorTitle}>Unable to load credit report</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Bureau Dropdown */}
      <View style={styles.bureauDropdownContainer}>
        <BureauDropdown
          selectedBureau={selectedBureau}
          onBureauChange={setSelectedBureau}
          availableBureaus={availableBureaus}
        />
      </View>

      <View style={styles.tabGridContainer}>
        <View style={styles.tabRow}>
          {flags.personalInfo && renderTabButton('personal', 'Personal', 'person-outline')}
          {renderTabButton('summary', 'Overview', 'analytics-outline')}
          {flags.accounts &&
            renderTabButton(
              'accounts',
              'Accounts',
              'card-outline',
              fullReport
                ? flattenEquifaxAccounts(fullReport, selectedBureau).length
                : reportSummary?.accounts?.length || 0,
            )}
        </View>
        <View style={styles.tabRow}>
          {flags.creditInquiries &&
            renderTabButton(
              'inquiries',
              'Inquiries',
              'search-outline',
              fullReport
                ? flattenEquifaxInquiries(fullReport, selectedBureau).length
                : reportSummary?.inquiries?.length || 0,
            )}
          {flags.publicRecords &&
            renderTabButton(
              'public_records',
              'Records',
              'shield-checkmark-outline',
              fullReport
                ? flattenEquifaxPublicRecords(fullReport, selectedBureau).length
                : undefined,
            )}
          {renderTabButton(
            'collections',
            'Collections',
            'cash-outline',
            fullReport ? flattenEquifaxCollections(fullReport, selectedBureau).length : undefined,
          )}
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
        {renderContent()}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* AI Chat Modal */}
      <AIChatModal
        visible={showAIChat}
        onClose={() => setShowAIChat(false)}
        initialContext="Credit Report"
      />
    </SafeAreaView>
  );
};
