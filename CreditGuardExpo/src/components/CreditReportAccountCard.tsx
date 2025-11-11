import React from 'react';
import {CreditAccount as ApiCreditAccount} from '../types/api';
import {CreditAccount} from '../types';
import {AccountDetailCard} from './AccountDetailCard';
import {parseApiPaymentHistory} from '../utils/paymentHistoryParser';

interface CreditReportAccountCardProps {
  account: ApiCreditAccount;
}

// Helper to convert API payment status to our simpler status
const convertPaymentStatus = (
  apiStatus: ApiCreditAccount['paymentStatus'],
): CreditAccount['status'] => {
  switch (apiStatus) {
    case 'current':
      return 'current';
    case 'late_30':
    case 'late_60':
    case 'late_90':
      return 'late';
    case 'charge_off':
      return 'delinquent';
    default:
      return 'current';
  }
};

/**
 * Wrapper component that adapts API CreditAccount to our AccountDetailCard component
 */
export const CreditReportAccountCard: React.FC<CreditReportAccountCardProps> = ({account}) => {
  // Helper to safely extract number value
  // disabled because the function is used to check the type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getNumberValue = (value: any): number | undefined => {
    if (value === null || value === undefined) return undefined;
    if (typeof value === 'number') {
      return isNaN(value) ? undefined : value;
    }
    return undefined;
  };

  // Convert API account to our component's expected format
  const adaptedAccount: CreditAccount = {
    id: account.id,
    name: account.creditorName,
    type: account.accountType,
    balance: account.balance,
    creditLimit: account.creditLimit,
    interestRate: 0, // API doesn't provide this, could be added
    status: convertPaymentStatus(account.paymentStatus),
    openDate: account.openDate,
    lastPaymentDate: account.lastPaymentDate,
    minimumPayment: getNumberValue(account.monthlyPayment) ?? 0,
    accountNumber: account.accountNumber,
    monthlyPayment: getNumberValue(account.monthlyPayment),
    creditUtilization: account.creditLimit
      ? (account.balance / account.creditLimit) * 100
      : undefined,
  };

  // Convert payment history if available
  // Note: The API structure has paymentHistory as an array of year objects, not the simple array we expected
  const parsedPaymentHistory = parseApiPaymentHistory(account.paymentHistory);
  if (parsedPaymentHistory) {
    adaptedAccount.paymentHistory = parsedPaymentHistory;
  }

  return <AccountDetailCard account={adaptedAccount} />;
};
