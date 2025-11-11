/* eslint-disable @typescript-eslint/no-explicit-any */
import {CreditAccount} from '../types';

/**
 * Interface matching the AccountTypeStats from CreditAccountsAccordion
 */
export interface AccountTypeStats {
  open: number;
  withBalance: number;
  totalBalance: number;
  available: number;
  creditLimit: number;
  debtToCredit: number;
  payment: number;
}

/**
 * Interface for account details by type
 */
export interface AccountDetailsByType {
  revolving: AccountTypeStats;
  mortgage: AccountTypeStats;
  installment: AccountTypeStats;
  other: AccountTypeStats;
}

/**
 * Extract amount from API response structure (can be object with amount property or number)
 */
const extractAmount = (value: any): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  if (typeof value === 'object' && value.amount !== undefined) {
    const amount = typeof value.amount === 'number' ? value.amount : parseFloat(value.amount);
    return isNaN(amount) ? 0 : amount;
  }
  return 0;
};

/**
 * Process account summary data from API response to create AccountTypeStats
 * Uses the _getAccountsData pattern from the provided utility code
 */
const processAccountSummary = (accountSummary: any): AccountTypeStats => {
  if (!accountSummary) {
    return {
      open: 0,
      withBalance: 0,
      totalBalance: 0,
      available: 0,
      creditLimit: 0,
      debtToCredit: 0,
      payment: 0,
    };
  }

  const balance = extractAmount(accountSummary.balance);
  const creditLimit = extractAmount(accountSummary.creditLimit);
  const available = extractAmount(accountSummary.available);
  const monthlyPayment = extractAmount(accountSummary.monthlyPaymentAmount);
  const debtToCreditRatio = accountSummary.debtToCreditRatio || 0;
  const totalAccounts = accountSummary.totalAccounts || 0;
  const totalAccountsWithBalance = accountSummary.totalAccountsWithBalance || 0;

  // For "open" accounts, we use totalAccounts (which should represent open accounts in summary)
  // For "withBalance", we use totalAccountsWithBalance
  return {
    open: totalAccounts,
    withBalance: totalAccountsWithBalance,
    totalBalance: balance,
    available: available,
    creditLimit: creditLimit,
    debtToCredit: Math.round(debtToCreditRatio),
    payment: monthlyPayment,
  };
};

/**
 * Parse API summary data to extract account statistics by type
 * This matches the structure from providerViews[].summary
 */
export const parseAccountSummaryFromApi = (apiSummary: any): AccountDetailsByType | null => {
  if (!apiSummary) {
    return null;
  }

  // Process each account type from the summary
  const revolving = processAccountSummary(apiSummary.revolvingAccounts);
  const mortgage = processAccountSummary(apiSummary.mortgageAccounts);
  const installment = processAccountSummary(apiSummary.installmentAccounts);

  // "Other" accounts might not have a separate summary section
  // We can use totalOpenAccounts minus the sum of revolving, mortgage, and installment
  // Or check if there's an otherAccounts field
  const other = processAccountSummary(apiSummary.otherAccounts);

  return {
    revolving,
    mortgage,
    installment,
    other,
  };
};

/**
 * Create synthetic CreditAccount objects from summary data for use with existing accordion logic
 * This allows the accordion to work with both individual accounts and summary data
 */
export const createAccountsFromSummary = (apiSummary: any): CreditAccount[] => {
  const accounts: CreditAccount[] = [];

  if (!apiSummary) {
    return accounts;
  }

  // Create synthetic accounts from summary data
  // Revolving accounts
  if (apiSummary.revolvingAccounts) {
    const rev = apiSummary.revolvingAccounts;
    const count = rev.totalAccounts || 0;
    const balancePerAccount = count > 0 ? extractAmount(rev.balance) / count : 0;
    const limitPerAccount = count > 0 ? extractAmount(rev.creditLimit) / count : 0;
    const paymentPerAccount = count > 0 ? extractAmount(rev.monthlyPaymentAmount) / count : 0;

    for (let i = 0; i < count; i++) {
      accounts.push({
        id: `revolving_${i}`,
        name: 'Revolving Account',
        type: 'credit_card',
        balance: balancePerAccount,
        creditLimit: limitPerAccount > 0 ? limitPerAccount : undefined,
        creditUtilization:
          limitPerAccount > 0 ? (balancePerAccount / limitPerAccount) * 100 : undefined,
        interestRate: 0,
        status: 'current',
        openDate: new Date().toISOString(),
        minimumPayment: paymentPerAccount,
        monthlyPayment: paymentPerAccount,
      });
    }
  }

  // Mortgage accounts
  if (apiSummary.mortgageAccounts) {
    const mort = apiSummary.mortgageAccounts;
    const count = mort.totalAccounts || 0;
    const balancePerAccount = count > 0 ? extractAmount(mort.balance) / count : 0;
    const limitPerAccount = count > 0 ? extractAmount(mort.creditLimit) / count : 0;
    const paymentPerAccount = count > 0 ? extractAmount(mort.monthlyPaymentAmount) / count : 0;

    for (let i = 0; i < count; i++) {
      accounts.push({
        id: `mortgage_${i}`,
        name: 'Mortgage Account',
        type: 'mortgage',
        balance: balancePerAccount,
        creditLimit: limitPerAccount > 0 ? limitPerAccount : undefined,
        creditUtilization:
          limitPerAccount > 0 ? (balancePerAccount / limitPerAccount) * 100 : undefined,
        interestRate: 0,
        status: 'current',
        openDate: new Date().toISOString(),
        minimumPayment: paymentPerAccount,
        monthlyPayment: paymentPerAccount,
      });
    }
  }

  // Installment accounts
  if (apiSummary.installmentAccounts) {
    const inst = apiSummary.installmentAccounts;
    const count = inst.totalAccounts || 0;
    const balancePerAccount = count > 0 ? extractAmount(inst.balance) / count : 0;
    const limitPerAccount = count > 0 ? extractAmount(inst.creditLimit) / count : 0;
    const paymentPerAccount = count > 0 ? extractAmount(inst.monthlyPaymentAmount) / count : 0;

    for (let i = 0; i < count; i++) {
      accounts.push({
        id: `installment_${i}`,
        name: 'Installment Account',
        type: 'personal_loan',
        balance: balancePerAccount,
        creditLimit: limitPerAccount > 0 ? limitPerAccount : undefined,
        creditUtilization:
          limitPerAccount > 0 ? (balancePerAccount / limitPerAccount) * 100 : undefined,
        interestRate: 0,
        status: 'current',
        openDate: new Date().toISOString(),
        minimumPayment: paymentPerAccount,
        monthlyPayment: paymentPerAccount,
      });
    }
  }

  return accounts;
};

