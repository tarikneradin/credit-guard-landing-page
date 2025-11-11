import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {CreditAccount} from '../types';
import {Colors} from '../constants/colors';
import {PaymentHistory} from './PaymentHistory';
import {hasDerogatory, getDerogatoryType} from '../utils/derogatoryMarks';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccountDetailCardProps {
  account: CreditAccount;
}

const getAccountTypeLabel = (type: CreditAccount['type']): string => {
  const labels: Record<CreditAccount['type'], string> = {
    credit_card: 'Credit Card',
    mortgage: 'Mortgage',
    auto_loan: 'Auto Loan',
    personal_loan: 'Personal Loan',
    student_loan: 'Student Loan',
  };
  return labels[type] || 'Unknown';
};

const getStatusColor = (status: CreditAccount['status']): string => {
  switch (status) {
    case 'current':
      return Colors.success;
    case 'late':
      return Colors.warning;
    case 'delinquent':
      return Colors.error;
    case 'closed':
      return Colors.text.tertiary;
    default:
      return Colors.text.secondary;
  }
};

const getStatusLabel = (status: CreditAccount['status']): string => {
  const labels: Record<CreditAccount['status'], string> = {
    current: 'Good Standing',
    late: 'Late Payment',
    delinquent: 'Delinquent',
    closed: 'Closed',
  };
  return labels[status];
};

const getStatusBadgeLabel = (status: CreditAccount['status']): string => {
  const labels: Record<CreditAccount['status'], string> = {
    current: 'OPEN',
    late: 'LATE',
    delinquent: 'DELINQUENT',
    closed: 'CLOSED',
  };
  return labels[status];
};

const getStatusBadgeColor = (status: CreditAccount['status']): {bg: string; text: string} => {
  switch (status) {
    case 'current':
      return {bg: Colors.success + '15', text: Colors.success};
    case 'late':
      return {bg: Colors.warning + '15', text: Colors.warning};
    case 'delinquent':
      return {bg: Colors.error + '15', text: Colors.error};
    case 'closed':
      return {bg: Colors.text.quaternary + '15', text: Colors.text.tertiary};
    default:
      return {bg: Colors.text.quaternary + '15', text: Colors.text.secondary};
  }
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const AccountDetailCard: React.FC<AccountDetailCardProps> = ({account}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const utilization = account.creditUtilization
    ? account.creditUtilization
    : account.creditLimit
      ? (account.balance / account.creditLimit) * 100
      : undefined;

  // Check for derogatory marks
  const isDeroragory = hasDerogatory(account);
  const derogatoryType = getDerogatoryType(account);

  // Get status badge styling
  const statusBadgeColors = getStatusBadgeColor(account.status);

  return (
    <View style={[styles.container, isDeroragory && styles.derogatoryContainer]}>
      {/* Derogatory Badge */}
      {isDeroragory && (
        <View style={styles.derogatoryBadge}>
          <Ionicons name="warning" size={14} color={Colors.error} />
          <Text style={styles.derogatoryBadgeText}>{derogatoryType}</Text>
        </View>
      )}

      {/* Header - Always visible */}
      <TouchableOpacity style={styles.header} onPress={toggleExpanded} activeOpacity={0.7}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={styles.accountNameRow}>
              <Text style={styles.accountName}>{account.name}</Text>
              {/* Status Badge */}
              <View
                style={[
                  styles.statusBadge,
                  {backgroundColor: statusBadgeColors.bg},
                ]}>
                <Text style={[styles.statusBadgeText, {color: statusBadgeColors.text}]}>
                  {getStatusBadgeLabel(account.status)}
                </Text>
              </View>
            </View>
            <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
          </View>

          <Text style={styles.accountType}>{getAccountTypeLabel(account.type)}</Text>

          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>Balance: </Text>
            <Text style={styles.balance}>
              {formatCurrency(account.balance)}
              {account.creditLimit && ` / ${formatCurrency(account.creditLimit)}`}
            </Text>
          </View>

          <View style={styles.statusRow}>
            <View style={[styles.statusDot, {backgroundColor: getStatusColor(account.status)}]} />
            <Text style={[styles.status, {color: getStatusColor(account.status)}]}>
              {getStatusLabel(account.status)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Expanded Details */}
      {isExpanded && (
        <View style={styles.details}>
          {/* Account Details Section */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Account Details</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Account Number</Text>
              <Text style={styles.detailValue}>
                {account.accountNumber || '****' + account.id.slice(-4)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Opened</Text>
              <Text style={styles.detailValue}>{formatDate(account.openDate)}</Text>
            </View>

            {account.lastPaymentDate && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Last Payment</Text>
                <Text style={styles.detailValue}>{formatDate(account.lastPaymentDate)}</Text>
              </View>
            )}

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Minimum Payment</Text>
              <Text style={styles.detailValue}>
                {account.minimumPayment !== undefined &&
                account.minimumPayment !== null &&
                !isNaN(account.minimumPayment)
                  ? formatCurrency(account.minimumPayment)
                  : '-'}
              </Text>
            </View>

            {utilization !== undefined && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Credit Utilization</Text>
                <Text
                  style={[
                    styles.detailValue,
                    utilization > 30 && {color: Colors.warning},
                    utilization > 70 && {color: Colors.error},
                  ]}>
                  {utilization.toFixed(1)}%
                </Text>
              </View>
            )}
          </View>

          {/* Payment History Section */}
          {account.paymentHistory && (
            <View style={styles.paymentHistorySection}>
              <PaymentHistory paymentHistory={account.paymentHistory} />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: Colors.shadow.light,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    padding: 16,
  },
  headerContent: {
    gap: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountNameRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  accountName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    flexShrink: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  expandIcon: {
    fontSize: 14,
    color: Colors.text.tertiary,
    marginLeft: 8,
  },
  accountType: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  balanceLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  balance: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
  details: {
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    paddingTop: 16,
  },
  detailsSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  paymentHistorySection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  derogatoryContainer: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  derogatoryBadge: {
    position: 'absolute',
    top: 12,
    right: 36,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error + '15',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
    zIndex: 10,
  },
  derogatoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.error,
    letterSpacing: 0.3,
  },
});
