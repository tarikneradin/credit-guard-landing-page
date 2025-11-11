import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {CreditAccount as ApiCreditAccount} from '../types/api';
import {CreditReportAccountCard} from './CreditReportAccountCard';
import {Colors} from '../constants/colors';

interface AccountTypeSectionProps {
  title: string;
  icon: string;
  accounts: ApiCreditAccount[];
  color?: string;
  defaultExpanded?: boolean;
}

export const AccountTypeSection: React.FC<AccountTypeSectionProps> = ({
  title,
  icon,
  accounts,
  color = Colors.accent,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (accounts.length === 0) {
    return null;
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalLimit = accounts.reduce((sum, acc) => sum + (acc.creditLimit || 0), 0);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}>
        <View style={[styles.iconContainer, {backgroundColor: color + '15'}]}>
          <Ionicons name={icon as any} size={24} color={color} />
        </View>

        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>{title}</Text>
            <View style={[styles.countBadge, {backgroundColor: color + '20', borderColor: color}]}>
              <Text style={[styles.countText, {color}]}>{accounts.length}</Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Balance: </Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalBalance)}</Text>
            {totalLimit > 0 && (
              <>
                <Text style={styles.summaryLabel}> / </Text>
                <Text style={styles.summaryLimit}>{formatCurrency(totalLimit)}</Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.expandIcon}>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={Colors.text.tertiary}
          />
        </View>
      </TouchableOpacity>

      {/* Accounts List */}
      {isExpanded && (
        <View style={styles.accountsList}>
          {accounts.map((account, index) => (
            <CreditReportAccountCard key={index} account={account} />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow.light,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 13,
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  summaryLimit: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.tertiary,
  },
  expandIcon: {
    marginLeft: 8,
  },
  accountsList: {
    gap: 12,
  },
});
