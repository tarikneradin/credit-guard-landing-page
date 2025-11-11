// API Response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

// Authentication Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: UserInfo;
  idpass?: boolean;
  just_enrolled?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  agreedToTerms?: boolean;
  recoveryQuestion?: number;
  recoveryAnswer?: string;
}

export interface RegisterResponse {
  accessToken: string;
  refreshToken?: string;
  user: UserInfo;
}

// User Types
export interface UserInfo {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  profilePicture?: string;
  isVerified?: boolean;
  isIdentityVerified?: boolean;
  verificationLevel?: 'basic' | 'identity' | 'full';
  createdAt?: string;
  updatedAt?: string;
}

// Identity Verification Types
export interface PersonalInfoRequest {
  fname: string;
  lname: string;
  dob: string;
  ssn?: string;
  street1: string;
  city: string;
  state: string;
  zip: string;
  mobile: string;
}

export interface PhoneVerificationRequest {
  code: string;
  key: string;
  token?: string;
}

// Identity Verification Response Types
export interface PersonalInfoResponse {
  mobile: string;
  token: string;
  expires: string;
}

export interface PhoneVerificationInitResponse {
  token: string;
  mobile: string;
  expires?: string;
}

export interface PhoneVerificationResponse {
  verified: boolean;
  status: string;
}

export interface VerificationStatusResponse {
  verified: boolean;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  verificationLevel?: 'basic' | 'enhanced' | 'full';
  steps?: {
    personal: boolean;
    phone: boolean;
  };
}

export interface SMFASendLinkResponse {
  token: string;
  smsMessage: string;
  authUrl?: string;
  linkToken?: string;
}

export interface SMFAVerifyStatusResponse {
  verified: boolean;
  completed: boolean;
  status: string;
  user?: UserInfo;
  enrollmentId?: string;
}

// Credit Score Types
export interface CreditScore {
  score: number;
  scoreDate: string;
  bureau: 'Experian' | 'TransUnion' | 'Equifax';
  scoreRange: {
    min: number;
    max: number;
  };
  factors: CreditScoreFactor[];
}

export interface CreditScoreFactor {
  code: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface ScoreHistory {
  date: string;
  score: number;
  bureau: string;
}

// Credit Report Types
export interface CreditAccount {
  id: string;
  creditorName: string;
  accountType: 'credit_card' | 'mortgage' | 'auto_loan' | 'personal_loan' | 'student_loan';
  accountNumber: string;
  balance: number;
  creditLimit?: number;
  paymentStatus: 'current' | 'late_30' | 'late_60' | 'late_90' | 'charge_off';
  openDate: string;
  lastPaymentDate?: string;
  monthsReviewed: number;
  monthlyPayment?: number;
  paymentHistory?: Array<{
    year: number;
    january?: {monthType: string; value: string};
    february?: {monthType: string; value: string};
    march?: {monthType: string; value: string};
    april?: {monthType: string; value: string};
    may?: {monthType: string; value: string};
    june?: {monthType: string; value: string};
    july?: {monthType: string; value: string};
    august?: {monthType: string; value: string};
    september?: {monthType: string; value: string};
    october?: {monthType: string; value: string};
    november?: {monthType: string; value: string};
    december?: {monthType: string; value: string};
  }>;
}

export interface CreditInquiry {
  date: string;
  creditorName: string;
  type: 'hard' | 'soft';
}

export interface Collection {
  id: string;
  creditorName: string;
  accountNumber: string;
  amount: {
    amount: number;
    currency: string;
  };
  status: 'OPEN' | 'CLOSED' | 'PAID' | 'SETTLED' | 'DISPUTED';
  reportedDate: string;
  assignedDate?: string;
  balanceDate?: string;
  statusDate?: string;
  agencyClient?: string;
  accountDesignatorCode?: string;
  provider?: string;
}

export interface CreditReportSummary {
  accounts: CreditAccount[];
  inquiries: CreditInquiry[];
  totalAccounts: number;
  openAccounts: number;
  totalBalance: number;
  totalCreditLimit: number;
  utilizationRate: number;
  averageAccountAge: number;
  paymentHistory: {
    onTimePercentage: number;
    totalPayments: number;
    latePayments: number;
  };
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

// Common response types
export interface MessageResponse {
  message: string;
}

// Score categories
export type ScoreCategory = 'poor' | 'fair' | 'good' | 'excellent';

// Helper function to categorize credit score - VantageScore 3.0 ranges
export const getScoreCategory = (score: number): ScoreCategory => {
  if (score >= 781) return 'excellent'; // Excellent: 781-850
  if (score >= 661) return 'good'; // Good: 661-780
  if (score >= 601) return 'fair'; // Fair: 601-660
  return 'poor'; // Poor: 300-600
};

// Helper function to get score category color
export const getScoreCategoryColor = (category: ScoreCategory): string => {
  switch (category) {
    case 'excellent':
      return '#059669'; // Green
    case 'good':
      return '#65A30D'; // Light Green
    case 'fair':
      return '#D97706'; // Orange
    case 'poor':
      return '#DC2626'; // Red
  }
};
