import {CreditAccount} from '../types';
import {PublicRecord} from '../types';

export interface DerogatoryMarksSummary {
  totalCount: number;
  latePayments: number;
  collections: number;
  publicRecords: number;
  chargeOffs: number;
  estimatedScoreImpact: number;
  severity: 'none' | 'low' | 'moderate' | 'severe';
}

/**
 * Checks if an account has derogatory marks
 */
export const hasDerogatory = (account: CreditAccount): boolean => {
  // Check isNegative flag first (from API)
  if (account.isNegative === true) {
    return true;
  }

  // Check account status
  const derogatoryStatuses = ['late', 'delinquent'];
  if (derogatoryStatuses.includes(account.status)) {
    return true;
  }

  // Check payment history for late payments
  if (
    account.paymentHistory &&
    account.paymentHistory.payments &&
    account.paymentHistory.payments.length > 0
  ) {
    const hasLatePayments = account.paymentHistory.payments.some(
      payment => payment.status === 'late' || payment.status === 'derogatory',
    );
    if (hasLatePayments) {
      return true;
    }
  }

  return false;
};

/**
 * Counts late payments in an account's payment history
 */
export const countLatePayments = (account: CreditAccount): number => {
  if (
    !account.paymentHistory ||
    !account.paymentHistory.payments ||
    account.paymentHistory.payments.length === 0
  ) {
    return 0;
  }

  return account.paymentHistory.payments.filter(
    payment => payment.status === 'late' || payment.status === 'derogatory',
  ).length;
};

/**
 * Gets derogatory mark type for an account
 */
export const getDerogatoryType = (account: CreditAccount): string | null => {
  if (account.status === 'delinquent') return 'Delinquent';
  if (account.status === 'late') return 'Late Payment';

  // Check for late payments even if status is current
  const lateCount = countLatePayments(account);
  if (lateCount > 0) {
    return `${lateCount} Late Payment${lateCount > 1 ? 's' : ''}`;
  }

  return null;
};

/**
 * Calculates comprehensive derogatory marks summary
 */
export const calculateDerogatoryMarks = (
  accounts: CreditAccount[],
  publicRecords: PublicRecord[],
  summary?: {
    totalNegativeAccounts?: number;
    revolvingAccounts?: {totalNegativeAccounts?: number};
    installmentAccounts?: {totalNegativeAccounts?: number};
    mortgageAccounts?: {totalNegativeAccounts?: number};
  },
): DerogatoryMarksSummary => {
  let latePayments = 0;
  let chargeOffs = 0;
  let negativeAccountsCount = 0;

  // Count accounts where isNegative === true
  accounts.forEach(account => {
    if (account.isNegative === true) {
      negativeAccountsCount++;
    }

    if (account.status === 'delinquent') {
      chargeOffs++;
    }

    // Count late payments
    const accountLatePayments = countLatePayments(account);
    latePayments += accountLatePayments;

    // If the account has late payment status but no payment history detail, count it
    if (accountLatePayments === 0 && account.status === 'late') {
      latePayments += 1;
    }
  });

  // Use totalNegativeAccounts from summary as fallback if available
  // Sum from account type summaries if individual summary not available
  const summaryNegativeAccounts =
    summary?.totalNegativeAccounts !== undefined
      ? summary.totalNegativeAccounts
      : summary
        ? (summary.revolvingAccounts?.totalNegativeAccounts || 0) +
          (summary.installmentAccounts?.totalNegativeAccounts || 0) +
          (summary.mortgageAccounts?.totalNegativeAccounts || 0)
        : undefined;

  // Use the summary count if available (even if 0), otherwise use counted negative accounts
  // The summary count is authoritative from the bureau
  const finalNegativeAccountsCount =
    summaryNegativeAccounts !== undefined ? summaryNegativeAccounts : negativeAccountsCount;

  // Add public records count (all public records are derogatory)
  const publicRecordsCount = publicRecords.length;

  // Count collections from public records (if type is 'collection')
  const collections = publicRecords.filter(record => record.type === 'collection').length;

  // Total count: negative accounts (from API summary or counted) + collections + public records
  // Note: Late payments and charge-offs are typically already included in negative accounts,
  // so we use finalNegativeAccountsCount as the primary count to avoid double-counting
  // Collections and public records are separate derogatory items
  const totalCount = finalNegativeAccountsCount + collections + publicRecordsCount;

  // Estimate score impact
  let estimatedScoreImpact = 0;
  estimatedScoreImpact += latePayments * 15; // Each late payment: ~15 points
  estimatedScoreImpact += collections * 80; // Collection account: ~80 points
  estimatedScoreImpact += chargeOffs * 100; // Charge-off: ~100 points
  estimatedScoreImpact += publicRecordsCount * 120; // Public record: ~120 points

  // Cap at reasonable maximum
  estimatedScoreImpact = Math.min(estimatedScoreImpact, 200);

  // Determine severity
  let severity: 'none' | 'low' | 'moderate' | 'severe' = 'none';
  if (totalCount === 0) {
    severity = 'none';
  } else if (totalCount <= 2 && !chargeOffs && !collections && publicRecordsCount === 0) {
    severity = 'low';
  } else if (totalCount <= 5 && chargeOffs + collections + publicRecordsCount <= 1) {
    severity = 'moderate';
  } else {
    severity = 'severe';
  }

  return {
    totalCount,
    latePayments,
    collections,
    chargeOffs,
    publicRecords: publicRecordsCount,
    estimatedScoreImpact,
    severity,
  };
};

/**
 * Gets user-friendly message based on derogatory marks severity
 */
export const getDerogatoryMessage = (summary: DerogatoryMarksSummary): string => {
  if (summary.totalCount === 0) {
    return 'No derogatory marks found. Excellent!';
  }

  switch (summary.severity) {
    case 'low':
      return 'Minor negative marks with minimal impact';
    case 'moderate':
      return 'Moderate impact on your credit score';
    case 'severe':
      return 'Severely impacting your credit score';
    default:
      return 'No derogatory marks';
  }
};

/**
 * Gets color for derogatory marks display
 */
export const getDerogatoryColor = (
  theme: {colors: {success: string; warning: string; error: string; text: {secondary: string}}},
  severity: 'none' | 'low' | 'moderate' | 'severe',
): string => {
  switch (severity) {
    case 'none':
      return theme.colors.success;
    case 'low':
      return theme.colors.warning;
    case 'moderate':
      return theme.colors.error;
    case 'severe':
      return theme.colors.error;
    default:
      return theme.colors.text.secondary;
  }
};
