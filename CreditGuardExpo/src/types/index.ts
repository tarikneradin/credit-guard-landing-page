// User and Profile Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateJoined: string;
  isVerified: boolean;
}

export interface UserProfile {
  user: User;
  phoneNumber?: string;
  address?: Address;
  preferences: UserPreferences;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    shareData: boolean;
    marketing: boolean;
  };
  theme: 'light' | 'dark' | 'system';
}

// Credit Score Types
export interface CreditScore {
  score: number;
  category: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  lastUpdated: string;
  provider: string;
  factors: CreditFactor[];
}

export interface CreditFactor {
  type: 'positive' | 'negative' | 'neutral';
  description: string;
  impact: 'high' | 'medium' | 'low';
}

// Payment History Types
export type PaymentStatus = 'current' | 'late' | 'derogatory' | 'unknown';

export interface PaymentRecord {
  year: number;
  month: number; // 1-12
  status: PaymentStatus;
}

export interface PaymentHistory {
  onTimePaymentPercentage: number;
  payments: PaymentRecord[];
}

// Credit Account Types
export interface CreditAccount {
  id: string;
  name: string;
  type: 'credit_card' | 'mortgage' | 'auto_loan' | 'personal_loan' | 'student_loan';
  balance: number;
  creditLimit?: number;
  creditUtilization?: number;
  interestRate: number;
  status: 'current' | 'late' | 'closed' | 'delinquent';
  openDate: string;
  lastPaymentDate?: string;
  minimumPayment: number;
  monthlyPayment?: number;
  accountNumber?: string;
  paymentHistory?: PaymentHistory;
  isNegative?: boolean;
}

// Credit Inquiry Types
export interface CreditInquiry {
  id: string;
  creditor: string;
  type: 'hard' | 'soft';
  date: string;
  purpose: string;
  impact?: 'high' | 'medium' | 'low';
}

// Public Record Types
export interface PublicRecord {
  id: string;
  type: 'bankruptcy' | 'tax_lien' | 'civil_judgment' | 'foreclosure' | 'collection';
  status: 'filed' | 'dismissed' | 'satisfied' | 'active';
  filingDate: string;
  amount?: number;
  court?: string;
  caseNumber?: string;
  description: string;
  expectedRemovalDate?: string;
}

// Credit Alert Types
export interface CreditAlert {
  id: string;
  type:
    | 'score_change'
    | 'new_account'
    | 'hard_inquiry'
    | 'suspicious_activity'
    | 'payment_missed'
    | 'credit_limit_change';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  date: string;
  isRead: boolean;
  actionRequired?: boolean;
}

// Personal Information Types
export interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  ssn: string; // Masked, e.g., "***-**-1234"
  address: Address;
  previousAddresses?: Address[];
  phone: string;
  email: string;
  employmentInfo?: {
    employer: string;
    position: string;
    yearsEmployed: number;
    isCurrent: boolean;
  };
  previousEmployments?: Array<{
    employer: string;
    dateOfEmployment?: string;
    dateFormatted?: string;
  }>;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Loading States
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingStates {
  profile: LoadingState;
  creditScore: LoadingState;
  accounts: LoadingState;
  inquiries: LoadingState;
}

// Re-export API types
export * from './api';
