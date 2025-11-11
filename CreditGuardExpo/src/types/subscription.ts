export type SubscriptionTier = 'free' | 'premium' | 'ultimate';
export type BillingPeriod = 'monthly' | 'annual';
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'trialing' | 'none';
export type PaymentMethodType = 'credit_card' | 'debit_card' | 'paypal' | 'apple_pay' | 'google_pay';

export interface SubscriptionPlan {
  id: string;
  tier: SubscriptionTier;
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  annualSavings?: number; // Percentage saved with annual billing
  features: SubscriptionFeature[];
  limits?: {
    scoreUpdatesPerMonth?: number;
    alertsPerMonth?: number;
    reportsPerMonth?: number;
    creditBureaus?: number;
    aiInsightsPerMonth?: number;
    smartActionsPerMonth?: number;
  };
  popular?: boolean;
  recommended?: boolean;
  badge?: string;
  color: string;
  icon: string;
}

export interface SubscriptionFeature {
  text: string;
  included: boolean;
  tooltip?: string;
  highlighted?: boolean;
}

export interface UserSubscription {
  id: string;
  planId: string;
  tier: SubscriptionTier;
  billingPeriod: BillingPeriod;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
  paymentMethodId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: PaymentMethodType;
  brand: string; // 'visa', 'mastercard', 'amex', etc.
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  cardholderName: string;
  isDefault: boolean;
  billingAddress?: BillingAddress;
  createdAt: string;
}

export interface BillingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface BillingHistory {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  invoiceUrl?: string;
  description: string;
  planName: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'processing' | 'succeeded' | 'failed';
  clientSecret: string;
  paymentMethodId?: string;
  error?: string;
}

export interface SubscriptionChange {
  currentTier: SubscriptionTier;
  newTier: SubscriptionTier;
  currentBillingPeriod: BillingPeriod;
  newBillingPeriod: BillingPeriod;
  currentPrice: number;
  newPrice: number;
  proratedAmount?: number;
  effectiveDate: string;
  isUpgrade: boolean;
}
