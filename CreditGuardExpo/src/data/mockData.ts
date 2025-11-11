import {
  User,
  UserProfile,
  CreditScore,
  CreditAccount,
  CreditInquiry,
  UserPreferences,
  PaymentHistory,
  PaymentStatus,
} from '../types';

// Mock User Data
export const mockUser: User = {
  id: 'user_123456',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  dateJoined: '2023-01-15T00:00:00Z',
  isVerified: true,
};

export const mockPreferences: UserPreferences = {
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
  privacy: {
    shareData: false,
    marketing: false,
  },
  theme: 'system',
};

export const mockUserProfile: UserProfile = {
  user: mockUser,
  phoneNumber: '+1 (555) 123-4567',
  address: {
    street: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'US',
  },
  preferences: mockPreferences,
};

// Mock Credit Score Data
export const mockCreditScore: CreditScore = {
  score: 742,
  category: 'Excellent',
  lastUpdated: new Date().toISOString(),
  provider: 'Experian',
  factors: [
    {
      type: 'positive',
      description: 'On-time payment history',
      impact: 'high',
    },
    {
      type: 'positive',
      description: 'Low credit utilization',
      impact: 'medium',
    },
    {
      type: 'negative',
      description: 'Recent credit inquiry',
      impact: 'low',
    },
    {
      type: 'neutral',
      description: 'Good credit mix',
      impact: 'medium',
    },
  ],
};

// Helper function to generate payment history
const generatePaymentHistory = (yearsBack: number, onTimePercentage: number): PaymentHistory => {
  const payments = [];
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // 1-12

  for (let year = currentYear - yearsBack; year <= currentYear; year++) {
    const startMonth = year === currentYear - yearsBack ? 1 : 1;
    const endMonth = year === currentYear ? currentMonth : 12;

    for (let month = startMonth; month <= endMonth; month++) {
      const random = Math.random() * 100;
      let status: PaymentStatus;

      if (random < onTimePercentage) {
        status = 'current';
      } else if (random < onTimePercentage + 10) {
        status = 'late';
      } else if (random < onTimePercentage + 15) {
        status = 'derogatory';
      } else {
        status = 'unknown';
      }

      payments.push({year, month, status});
    }
  }

  return {
    onTimePaymentPercentage: Math.round(onTimePercentage),
    payments,
  };
};

// Mock Credit Accounts Data - Diverse account types
export const mockAccounts: CreditAccount[] = [
  {
    id: 'acc_001',
    name: 'Chase Freedom Card',
    type: 'credit_card',
    balance: 1250,
    creditLimit: 5000,
    creditUtilization: 25,
    interestRate: 18.99,
    status: 'current',
    openDate: '2020-03-15T00:00:00Z',
    lastPaymentDate: '2024-12-01T00:00:00Z',
    minimumPayment: 35,
    monthlyPayment: 150,
    accountNumber: '****4523',
    paymentHistory: generatePaymentHistory(3, 98),
  },
  {
    id: 'acc_002',
    name: 'Bank of America Mortgage',
    type: 'mortgage',
    balance: 285000,
    interestRate: 3.25,
    status: 'current',
    openDate: '2019-06-01T00:00:00Z',
    lastPaymentDate: '2024-12-01T00:00:00Z',
    minimumPayment: 1850,
    monthlyPayment: 1850,
    accountNumber: '****8901',
    paymentHistory: generatePaymentHistory(5, 100),
  },
  {
    id: 'acc_003',
    name: 'Capital One Venture Card',
    type: 'credit_card',
    balance: 890,
    creditLimit: 8000,
    creditUtilization: 11,
    interestRate: 16.99,
    status: 'current',
    openDate: '2021-09-10T00:00:00Z',
    lastPaymentDate: '2024-11-28T00:00:00Z',
    minimumPayment: 25,
    monthlyPayment: 100,
    accountNumber: '****2389',
    paymentHistory: generatePaymentHistory(2, 95),
  },
  {
    id: 'acc_004',
    name: 'Toyota Auto Loan',
    type: 'auto_loan',
    balance: 12500,
    interestRate: 4.5,
    status: 'current',
    openDate: '2022-02-20T00:00:00Z',
    lastPaymentDate: '2024-12-01T00:00:00Z',
    minimumPayment: 385,
    monthlyPayment: 385,
    accountNumber: '****6754',
    paymentHistory: generatePaymentHistory(2, 92),
  },
  {
    id: 'acc_005',
    name: 'Discover it Cash Back',
    type: 'credit_card',
    balance: 2340,
    creditLimit: 6500,
    creditUtilization: 36,
    interestRate: 19.99,
    status: 'late',
    openDate: '2018-11-05T00:00:00Z',
    lastPaymentDate: '2024-10-15T00:00:00Z',
    minimumPayment: 65,
    monthlyPayment: 65,
    accountNumber: '****7821',
    paymentHistory: generatePaymentHistory(4, 87), // Lower on-time percentage
  },
  {
    id: 'acc_006',
    name: 'SoFi Student Loan',
    type: 'personal_loan',
    balance: 18750,
    interestRate: 5.75,
    status: 'current',
    openDate: '2017-08-01T00:00:00Z',
    lastPaymentDate: '2024-12-01T00:00:00Z',
    minimumPayment: 275,
    monthlyPayment: 275,
    accountNumber: '****3492',
    paymentHistory: generatePaymentHistory(6, 96),
  },
  {
    id: 'acc_007',
    name: 'American Express Gold',
    type: 'credit_card',
    balance: 450,
    creditLimit: 15000,
    creditUtilization: 3,
    interestRate: 21.99,
    status: 'current',
    openDate: '2023-01-20T00:00:00Z',
    lastPaymentDate: '2024-12-05T00:00:00Z',
    minimumPayment: 35,
    monthlyPayment: 450,
    accountNumber: '****9012',
    paymentHistory: generatePaymentHistory(1, 100),
  },
  {
    id: 'acc_008',
    name: 'Marcus Personal Loan',
    type: 'personal_loan',
    balance: 7200,
    interestRate: 9.99,
    status: 'current',
    openDate: '2023-05-12T00:00:00Z',
    lastPaymentDate: '2024-12-01T00:00:00Z',
    minimumPayment: 225,
    monthlyPayment: 225,
    accountNumber: '****5631',
    paymentHistory: generatePaymentHistory(1, 100),
  },
  {
    id: 'acc_009',
    name: 'Wells Fargo Auto Loan',
    type: 'auto_loan',
    balance: 8950,
    interestRate: 3.99,
    status: 'current',
    openDate: '2021-07-15T00:00:00Z',
    lastPaymentDate: '2024-12-01T00:00:00Z',
    minimumPayment: 295,
    monthlyPayment: 295,
    accountNumber: '****4287',
    paymentHistory: generatePaymentHistory(3, 100),
  },
  {
    id: 'acc_010',
    name: 'Target RedCard',
    type: 'credit_card',
    balance: 125,
    creditLimit: 2000,
    creditUtilization: 6,
    interestRate: 24.99,
    status: 'current',
    openDate: '2022-11-28T00:00:00Z',
    lastPaymentDate: '2024-11-20T00:00:00Z',
    minimumPayment: 25,
    monthlyPayment: 50,
    accountNumber: '****8145',
    paymentHistory: generatePaymentHistory(2, 94),
  },
  {
    id: 'acc_011',
    name: 'Navy Federal Credit Line',
    type: 'credit_card',
    balance: 3200,
    creditLimit: 10000,
    creditUtilization: 32,
    interestRate: 12.99,
    status: 'current',
    openDate: '2019-03-10T00:00:00Z',
    lastPaymentDate: '2024-12-01T00:00:00Z',
    minimumPayment: 95,
    monthlyPayment: 200,
    accountNumber: '****2956',
    paymentHistory: generatePaymentHistory(5, 99),
  },
  {
    id: 'acc_012',
    name: 'Best Buy Credit Card',
    type: 'credit_card',
    balance: 0,
    creditLimit: 3500,
    creditUtilization: 0,
    interestRate: 27.99,
    status: 'current',
    openDate: '2020-12-05T00:00:00Z',
    lastPaymentDate: '2024-09-15T00:00:00Z',
    minimumPayment: 0,
    monthlyPayment: 0,
    accountNumber: '****6743',
    paymentHistory: generatePaymentHistory(3, 100),
  },
];

// Mock Credit Inquiries Data
export const mockInquiries: CreditInquiry[] = [
  {
    id: 'inq_001',
    creditor: 'Chase Bank',
    type: 'hard',
    date: '2024-12-15T00:00:00Z',
    purpose: 'Credit Card Application',
    impact: 'low',
  },
  {
    id: 'inq_002',
    creditor: 'Credit Karma',
    type: 'soft',
    date: '2024-12-10T00:00:00Z',
    purpose: 'Credit Monitoring',
    impact: undefined,
  },
  {
    id: 'inq_003',
    creditor: 'American Express',
    type: 'hard',
    date: '2024-11-05T00:00:00Z',
    purpose: 'Credit Card Pre-approval',
    impact: 'low',
  },
];

// Utility functions for generating mock data
export const generateMockCreditScore = (baseScore = 742): CreditScore => ({
  ...mockCreditScore,
  score: baseScore + Math.floor(Math.random() * 20) - 10, // ±10 variation
  lastUpdated: new Date().toISOString(),
});

export const calculateCreditUtilization = (accounts: CreditAccount[]): number => {
  const creditCards = accounts.filter(acc => acc.type === 'credit_card');
  const totalBalance = creditCards.reduce((sum, acc) => sum + acc.balance, 0);
  const totalLimit = creditCards.reduce((sum, acc) => sum + (acc.creditLimit || 0), 0);

  return totalLimit > 0 ? Math.round((totalBalance / totalLimit) * 100) : 0;
};

export const calculatePaymentHistory = (accounts: CreditAccount[]): number => {
  // Mock calculation - in real app, this would be based on payment history data
  const currentAccounts = accounts.filter(acc => acc.status === 'current').length;
  const totalAccounts = accounts.length;

  return totalAccounts > 0 ? Math.round((currentAccounts / totalAccounts) * 100) : 100;
};

// Credit Score History Data
export interface ScoreHistoryPoint {
  date: Date;
  score: number;
  change?: number;
}

export const generateScoreHistory = (
  currentScore: number = 742,
  monthsBack: number = 6,
): ScoreHistoryPoint[] => {
  const history: ScoreHistoryPoint[] = [];
  const now = new Date();

  // Start with a score lower than current to show upward trend
  const baseScore = currentScore - 30;

  for (let i = monthsBack; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);

    // Generate realistic score progression with some variation
    const variation = Math.floor(Math.random() * 10) - 5; // ±5 points
    const trend = Math.floor((monthsBack - i) * (30 / monthsBack)); // Gradual increase
    const score = Math.min(850, Math.max(300, baseScore + trend + variation));

    const change = history.length > 0 ? score - history[history.length - 1].score : undefined;

    history.push({
      date,
      score,
      change,
    });
  }

  return history;
};

// Pre-generated score history for consistent demo experience
export const mockScoreHistory: ScoreHistoryPoint[] = generateScoreHistory(742, 6);
