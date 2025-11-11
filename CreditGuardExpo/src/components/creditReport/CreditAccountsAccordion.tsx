import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, Animated, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {CreditAccount} from '../../types';
import {Theme} from '../../constants/Themes';
import {
  parseAccountSummaryFromApi,
  AccountDetailsByType,
  AccountTypeStats,
} from '../../utils/accountSummaryParser';

interface CreditAccountsAccordionProps {
  accounts: CreditAccount[];
  summaryData?: any; // Optional API summary data (providerViews[].summary)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const calculateAccountDetailsByType = (accounts: CreditAccount[]): AccountDetailsByType => {
  // Group accounts by type
  const revolvingAccounts = accounts.filter((acc: CreditAccount) => acc.type === 'credit_card');
  const mortgageAccounts = accounts.filter((acc: CreditAccount) => acc.type === 'mortgage');
  const installmentAccounts = accounts.filter(
    (acc: CreditAccount) =>
      acc.type === 'auto_loan' || acc.type === 'personal_loan' || acc.type === 'student_loan',
  );
  const otherAccounts = accounts.filter(
    (acc: CreditAccount) =>
      acc.type !== 'credit_card' &&
      acc.type !== 'mortgage' &&
      acc.type !== 'auto_loan' &&
      acc.type !== 'personal_loan' &&
      acc.type !== 'student_loan',
  );

  const calculateTypeStats = (accountList: CreditAccount[]): AccountTypeStats => {
    const open = accountList.filter((acc: CreditAccount) => acc.status !== 'closed').length;
    const withBalance = accountList.filter((acc: CreditAccount) => acc.balance > 0).length;
    const typeTotalBalance = accountList.reduce(
      (sum: number, acc: CreditAccount) => sum + acc.balance,
      0,
    );
    const typeTotalCreditLimit = accountList.reduce(
      (sum: number, acc: CreditAccount) => sum + (acc.creditLimit || 0),
      0,
    );
    const available = typeTotalCreditLimit - typeTotalBalance;
    const debtToCredit =
      typeTotalCreditLimit > 0 ? Math.round((typeTotalBalance / typeTotalCreditLimit) * 100) : 0;
    const totalPayment = accountList.reduce(
      (sum: number, acc: CreditAccount) => sum + (acc.monthlyPayment || acc.minimumPayment || 0),
      0,
    );

    return {
      open,
      withBalance,
      totalBalance: typeTotalBalance,
      available,
      creditLimit: typeTotalCreditLimit,
      debtToCredit,
      payment: totalPayment,
    };
  };

  // Use summary data if available and no individual accounts
  // This allows using aggregated summary data from the API
  if (accounts.length === 0) {
    return {
      revolving: {
        open: 0,
        withBalance: 0,
        totalBalance: 0,
        available: 0,
        creditLimit: 0,
        debtToCredit: 0,
        payment: 0,
      },
      mortgage: {
        open: 0,
        withBalance: 0,
        totalBalance: 0,
        available: 0,
        creditLimit: 0,
        debtToCredit: 0,
        payment: 0,
      },
      installment: {
        open: 0,
        withBalance: 0,
        totalBalance: 0,
        available: 0,
        creditLimit: 0,
        debtToCredit: 0,
        payment: 0,
      },
      other: {
        open: 0,
        withBalance: 0,
        totalBalance: 0,
        available: 0,
        creditLimit: 0,
        debtToCredit: 0,
        payment: 0,
      },
    };
  }

  return {
    revolving: calculateTypeStats(revolvingAccounts),
    mortgage: calculateTypeStats(mortgageAccounts),
    installment: calculateTypeStats(installmentAccounts),
    other: calculateTypeStats(otherAccounts),
  };
};

interface AccountTypeCardProps {
  label: string;
  data: AccountTypeStats;
  theme: Theme;
  styles: ReturnType<typeof createStyles>;
}

const AccountTypeCard: React.FC<AccountTypeCardProps> = ({label, data, theme, styles}) => {
  return (
    <View style={styles.accountTypeCard}>
      <View style={styles.accountTypeCardHeader}>
        <Text style={styles.accountTypeCardTitle}>{label}</Text>
      </View>
      <View style={styles.accountTypeCardContent}>
        <View style={styles.accountTypeCardRow}>
          <View style={styles.accountTypeCardItem}>
            <Text style={styles.accountTypeCardLabel}>Open</Text>
            <Text style={styles.accountTypeCardValue}>{data.open}</Text>
          </View>
          <View style={styles.accountTypeCardItem}>
            <Text style={styles.accountTypeCardLabel}>With Balance</Text>
            <Text style={styles.accountTypeCardValue}>{data.withBalance}</Text>
          </View>
        </View>
        <View style={styles.accountTypeCardRow}>
          <View style={styles.accountTypeCardItem}>
            <Text style={styles.accountTypeCardLabel}>Total Balance</Text>
            <Text style={styles.accountTypeCardValue}>{formatCurrency(data.totalBalance)}</Text>
          </View>
          <View style={styles.accountTypeCardItem}>
            <Text style={styles.accountTypeCardLabel}>Available</Text>
            <Text style={styles.accountTypeCardValue}>{formatCurrency(data.available)}</Text>
          </View>
        </View>
        <View style={styles.accountTypeCardRow}>
          <View style={styles.accountTypeCardItem}>
            <Text style={styles.accountTypeCardLabel}>Credit Limit</Text>
            <Text style={styles.accountTypeCardValue}>{formatCurrency(data.creditLimit)}</Text>
          </View>
          <View style={styles.accountTypeCardItem}>
            <Text style={styles.accountTypeCardLabel}>Debt-to-Credit</Text>
            <Text
              style={[
                styles.accountTypeCardValue,
                {
                  color:
                    data.debtToCredit > 80
                      ? theme.colors.error
                      : data.debtToCredit > 50
                        ? theme.colors.warning
                        : theme.colors.success,
                },
              ]}>
              {data.debtToCredit}%
            </Text>
          </View>
        </View>
        <View style={styles.accountTypeCardRow}>
          <View style={[styles.accountTypeCardItem, styles.accountTypeCardItemFull]}>
            <Text style={styles.accountTypeCardLabel}>Payment</Text>
            <Text style={styles.accountTypeCardValue}>{formatCurrency(data.payment)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

interface TotalCardProps {
  totalDetails: AccountTypeStats;
  theme: Theme;
  styles: ReturnType<typeof createStyles>;
}

const TotalCard: React.FC<TotalCardProps> = ({totalDetails, theme, styles}) => {
  return (
    <View style={styles.accountTypeCardTotal}>
      <View style={styles.accountTypeCardHeader}>
        <Text style={styles.accountTypeCardTitleTotal}>Total</Text>
      </View>
      <View style={styles.accountTypeCardContent}>
        <View style={styles.accountTypeCardRow}>
          <View style={styles.accountTypeCardItem}>
            <Text style={styles.accountTypeCardLabel}>Open</Text>
            <Text style={styles.accountTypeCardValueTotal}>{totalDetails.open}</Text>
          </View>
          <View style={styles.accountTypeCardItem}>
            <Text style={styles.accountTypeCardLabel}>With Balance</Text>
            <Text style={styles.accountTypeCardValueTotal}>{totalDetails.withBalance}</Text>
          </View>
        </View>
        <View style={styles.accountTypeCardRow}>
          <View style={styles.accountTypeCardItem}>
            <Text style={styles.accountTypeCardLabel}>Total Balance</Text>
            <Text style={styles.accountTypeCardValueTotal}>
              {formatCurrency(totalDetails.totalBalance)}
            </Text>
          </View>
          <View style={styles.accountTypeCardItem}>
            <Text style={styles.accountTypeCardLabel}>Available</Text>
            <Text style={styles.accountTypeCardValueTotal}>
              {formatCurrency(totalDetails.available)}
            </Text>
          </View>
        </View>
        <View style={styles.accountTypeCardRow}>
          <View style={styles.accountTypeCardItem}>
            <Text style={styles.accountTypeCardLabel}>Credit Limit</Text>
            <Text style={styles.accountTypeCardValueTotal}>
              {formatCurrency(totalDetails.creditLimit)}
            </Text>
          </View>
          <View style={styles.accountTypeCardItem}>
            <Text style={styles.accountTypeCardLabel}>Debt-to-Credit</Text>
            <Text
              style={[
                styles.accountTypeCardValueTotal,
                {
                  color:
                    totalDetails.debtToCredit > 80
                      ? theme.colors.error
                      : totalDetails.debtToCredit > 50
                        ? theme.colors.warning
                        : theme.colors.success,
                },
              ]}>
              {totalDetails.debtToCredit}%
            </Text>
          </View>
        </View>
        <View style={styles.accountTypeCardRow}>
          <View style={[styles.accountTypeCardItem, styles.accountTypeCardItemFull]}>
            <Text style={styles.accountTypeCardLabel}>Payment</Text>
            <Text style={styles.accountTypeCardValueTotal}>
              {formatCurrency(totalDetails.payment)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export const CreditAccountsAccordion: React.FC<CreditAccountsAccordionProps> = ({
  accounts,
  summaryData,
}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const [isExpanded, setIsExpanded] = useState(false);
  const accordionHeight = useRef(new Animated.Value(0)).current;

  // Try to use summary data first if available, otherwise calculate from accounts
  let accountDetailsByType: AccountDetailsByType;
  const parsedSummary = parseAccountSummaryFromApi(summaryData);

  if (parsedSummary && accounts.length === 0) {
    // Use parsed summary data when we have summary but no individual accounts
    accountDetailsByType = parsedSummary;
  } else {
    // Calculate from individual accounts (existing logic)
    accountDetailsByType = calculateAccountDetailsByType(accounts);
  }
  const totalDetails: AccountTypeStats = {
    open:
      accountDetailsByType.revolving.open +
      accountDetailsByType.mortgage.open +
      accountDetailsByType.installment.open +
      accountDetailsByType.other.open,
    withBalance:
      accountDetailsByType.revolving.withBalance +
      accountDetailsByType.mortgage.withBalance +
      accountDetailsByType.installment.withBalance +
      accountDetailsByType.other.withBalance,
    totalBalance:
      accountDetailsByType.revolving.totalBalance +
      accountDetailsByType.mortgage.totalBalance +
      accountDetailsByType.installment.totalBalance +
      accountDetailsByType.other.totalBalance,
    available:
      accountDetailsByType.revolving.available +
      accountDetailsByType.mortgage.available +
      accountDetailsByType.installment.available +
      accountDetailsByType.other.available,
    creditLimit:
      accountDetailsByType.revolving.creditLimit +
      accountDetailsByType.mortgage.creditLimit +
      accountDetailsByType.installment.creditLimit +
      accountDetailsByType.other.creditLimit,
    debtToCredit:
      accountDetailsByType.revolving.creditLimit +
        accountDetailsByType.mortgage.creditLimit +
        accountDetailsByType.installment.creditLimit +
        accountDetailsByType.other.creditLimit >
      0
        ? Math.round(
            ((accountDetailsByType.revolving.totalBalance +
              accountDetailsByType.mortgage.totalBalance +
              accountDetailsByType.installment.totalBalance +
              accountDetailsByType.other.totalBalance) /
              (accountDetailsByType.revolving.creditLimit +
                accountDetailsByType.mortgage.creditLimit +
                accountDetailsByType.installment.creditLimit +
                accountDetailsByType.other.creditLimit)) *
              100,
          )
        : 0,
    payment:
      accountDetailsByType.revolving.payment +
      accountDetailsByType.mortgage.payment +
      accountDetailsByType.installment.payment +
      accountDetailsByType.other.payment,
  };

  useEffect(() => {
    Animated.timing(accordionHeight, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  return (
    <View style={styles.accordionWrapper}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setIsExpanded(!isExpanded)}
        style={styles.accordion}>
        <View style={[styles.cardGradientBorder, {borderColor: theme.colors.accent + '30'}]}>
          <View style={styles.cardContent}>
            <View style={styles.header}>
              <View style={[styles.iconContainer, {backgroundColor: theme.colors.accent + '15'}]}>
                <Ionicons name="card-outline" size={20} color={theme.colors.accent} />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.title}>Credit Accounts</Text>
                <Text style={styles.subtitle}>
                  {totalDetails.open} open accounts • {formatCurrency(totalDetails.totalBalance)}{' '}
                  total
                </Text>
              </View>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={theme.colors.text.secondary}
              />
            </View>

            <Animated.View
              style={[
                styles.expandedContent,
                {
                  maxHeight: accordionHeight.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 2000],
                  }),
                  opacity: accordionHeight,
                },
              ]}>
              <View style={styles.cardsContainer}>
                {[
                  {label: 'Revolving', data: accountDetailsByType.revolving},
                  {label: 'Mortgage', data: accountDetailsByType.mortgage},
                  {label: 'Installment', data: accountDetailsByType.installment},
                  {label: 'Other', data: accountDetailsByType.other},
                ].map((row, index) => (
                  <AccountTypeCard
                    key={index}
                    label={row.label}
                    data={row.data}
                    theme={theme}
                    styles={styles}
                  />
                ))}

                <TotalCard totalDetails={totalDetails} theme={theme} styles={styles} />
              </View>
            </Animated.View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    accordionWrapper: {
      width: '100%',
      marginTop: theme.spacing.lg,
    },
    accordion: {
      width: '100%',
    },
    cardGradientBorder: {
      borderRadius: 20,
      borderWidth: 1.5,
      padding: 2,
      shadowColor: theme.colors.shadow.medium,
      shadowOffset: {width: 0, height: 8},
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
    cardContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: 18,
      padding: theme.spacing.lg,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerText: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
    title: {
      ...theme.textStyles.headline4,
      color: theme.colors.text.primary,
      fontWeight: '700',
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.text.secondary,
      fontSize: 12,
    },
    expandedContent: {
      overflow: 'hidden',
      marginTop: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.light,
    },
    cardsContainer: {
      gap: theme.spacing.md,
    },
    accountTypeCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
    },
    accountTypeCardHeader: {
      marginBottom: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.subtle,
    },
    accountTypeCardTitle: {
      ...theme.textStyles.bodyLarge,
      color: theme.colors.text.primary,
      fontWeight: '700',
      fontSize: 15,
    },
    accountTypeCardContent: {
      gap: theme.spacing.sm,
    },
    accountTypeCardRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    accountTypeCardItem: {
      flex: 1,
    },
    accountTypeCardItemFull: {
      flex: 1,
    },
    accountTypeCardLabel: {
      ...theme.textStyles.caption,
      color: theme.colors.text.secondary,
      fontSize: 11,
      marginBottom: theme.spacing.xs,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    accountTypeCardValue: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.primary,
      fontWeight: '600',
      fontSize: 14,
    },
    accountTypeCardTotal: {
      backgroundColor: theme.colors.accent + '10',
      borderRadius: 12,
      padding: theme.spacing.md,
      borderWidth: 1.5,
      borderColor: theme.colors.accent + '30',
      marginTop: theme.spacing.sm,
    },
    accountTypeCardTitleTotal: {
      ...theme.textStyles.bodyLarge,
      color: theme.colors.accent,
      fontWeight: '700',
      fontSize: 16,
    },
    accountTypeCardValueTotal: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.accent,
      fontWeight: '700',
      fontSize: 15,
    },
  });
