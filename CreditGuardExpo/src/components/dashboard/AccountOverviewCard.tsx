import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Colors, TextStyles, Spacing} from '../../constants';
import {createStyles} from '../../utils/styles';

interface AccountData {
  type: 'credit_card' | 'loan' | 'mortgage';
  name: string;
  balance: number;
  creditLimit?: number;
  status: 'good' | 'attention' | 'alert';
  lastPayment?: string;
}

interface AccountOverviewCardProps {
  accounts: AccountData[];
  isLoading?: boolean;
  onViewAll?: () => void;
}

export const AccountOverviewCard: React.FC<AccountOverviewCardProps> = ({
  accounts,
  isLoading = false,
  onViewAll,
}) => {
  const getStatusColor = (status: AccountData['status']) => {
    switch (status) {
      case 'good':
        return Colors.success;
      case 'attention':
        return Colors.warning;
      case 'alert':
        return Colors.error;
      default:
        return Colors.text.secondary;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getAccountTypeLabel = (type: AccountData['type']) => {
    switch (type) {
      case 'credit_card':
        return 'Credit Card';
      case 'loan':
        return 'Loan';
      case 'mortgage':
        return 'Mortgage';
      default:
        return 'Account';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Accounts Overview</Text>
        </View>
        <View style={styles.loadingState}>
          <Text style={styles.loadingText}>Loading accounts...</Text>
        </View>
      </View>
    );
  }

  const displayAccounts = accounts.slice(0, 3);
  const hasMoreAccounts = accounts.length > 3;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Accounts Overview</Text>
        <Text style={styles.subtitle}>{accounts.length} accounts</Text>
      </View>

      <View style={styles.accountsList}>
        {displayAccounts.map((account, index) => (
          <View key={index} style={styles.accountItem}>
            <View style={styles.accountInfo}>
              <View style={styles.accountHeader}>
                <Text style={styles.accountName}>{account.name}</Text>
                <View
                  style={[
                    styles.statusIndicator,
                    {backgroundColor: getStatusColor(account.status)},
                  ]}
                />
              </View>
              <Text style={styles.accountType}>{getAccountTypeLabel(account.type)}</Text>
            </View>

            <View style={styles.accountBalance}>
              <Text style={styles.balanceAmount}>{formatCurrency(account.balance)}</Text>
              {account.creditLimit && (
                <Text style={styles.creditLimit}>of {formatCurrency(account.creditLimit)}</Text>
              )}
            </View>
          </View>
        ))}
      </View>

      {hasMoreAccounts && onViewAll && (
        <TouchableOpacity style={styles.viewAllButton} onPress={onViewAll}>
          <Text style={styles.viewAllText}>View all {accounts.length} accounts</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = createStyles({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    elevation: 2,
    shadowColor: Colors.shadow.light,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...TextStyles.headline3,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
  },
  accountsList: {
    gap: Spacing.md,
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  accountInfo: {
    flex: 1,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  accountName: {
    ...TextStyles.bodyLarge,
    color: Colors.text.primary,
    fontWeight: '600',
    flex: 1,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: Spacing.sm,
  },
  accountType: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
  },
  accountBalance: {
    alignItems: 'flex-end',
  },
  balanceAmount: {
    ...TextStyles.bodyLarge,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  creditLimit: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
  },
  viewAllButton: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  viewAllText: {
    ...TextStyles.bodyRegular,
    color: Colors.primary,
    fontWeight: '600',
  },
  loadingState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  loadingText: {
    ...TextStyles.bodyRegular,
    color: Colors.text.secondary,
  },
});
