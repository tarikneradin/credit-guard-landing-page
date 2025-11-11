import {
  SubscriptionPlan,
  UserSubscription,
  PaymentMethod,
  BillingHistory,
  BillingPeriod,
} from '../types/subscription';

/**
 * Subscription Plans - Simplified for readability
 * Inspired by Credit Karma's clean, scannable feature presentation
 */
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'plan_free',
    tier: 'free',
    name: 'Free',
    tagline: 'Essential credit monitoring',
    monthlyPrice: 0,
    annualPrice: 0,
    color: '#6B7280',
    icon: 'shield-outline',
    features: [
      {text: 'Monthly Score & Report Refresh', included: true},
      {text: 'Credit Score & Trends', included: true},
      {text: 'Full Credit Report', included: true},
      {text: 'Score Change Alerts', included: true},
      {text: 'Personalized Offers', included: true},
      {text: 'Weekly Score Refresh', included: false},
      {text: 'AI Tools', included: false},
      {text: '3-Bureau Monitoring', included: false},
    ],
    limits: {
      scoreUpdatesPerMonth: 1,
      alertsPerMonth: 10,
      reportsPerMonth: 1,
      creditBureaus: 1,
      aiInsightsPerMonth: 0,
    },
  },
  {
    id: 'plan_plus',
    tier: 'plus',
    name: 'Plus',
    tagline: 'AI-powered credit improvement',
    monthlyPrice: 12.99,
    annualPrice: 124.70, // 20% discount: $12.99 * 12 * 0.80
    annualSavings: 20,
    color: '#3B82F6',
    icon: 'star',
    popular: true,
    badge: 'Most Popular',
    features: [
      {text: 'Everything in Free, plus:', included: true, highlighted: true},
      {text: 'Weekly Score & Report Refresh', included: true},
      {text: 'AI Tools (Smart Actions, Optimal Path, AI Assistant)', included: true},
      {text: '3-Bureau Monitoring (Experian, TransUnion, Equifax)', included: true},
      {text: 'Score Improvements Plan', included: true},
      {text: 'Credit Disputes Filing', included: true},
      {text: 'Enhanced Alerts & Reminders', included: true},
      {text: 'Priority Email Support', included: true},
      {text: 'Daily Score Refresh', included: false},
      {text: '$1M Identity Theft Insurance', included: false},
    ],
    limits: {
      scoreUpdatesPerMonth: 4, // weekly
      alertsPerMonth: -1,
      reportsPerMonth: 3,
      creditBureaus: 3,
      aiInsightsPerMonth: -1,
    },
  },
  {
    id: 'plan_premium',
    tier: 'premium',
    name: 'Premium',
    tagline: 'Complete protection & optimization',
    monthlyPrice: 24.99,
    annualPrice: 239.90, // 20% discount: $24.99 * 12 * 0.80
    annualSavings: 20,
    color: '#8B5CF6',
    icon: 'diamond',
    recommended: true,
    badge: 'Best Value',
    features: [
      {text: 'Everything in Plus, plus:', included: true, highlighted: true},
      {text: 'Daily Score & Report Refresh', included: true},
      {text: 'Advanced AI Tools (Score Predictor, Spending Analyzer)', included: true},
      {text: '3-Bureau Monitoring with Real-time Alerts', included: true},
      {text: '$1M Identity Theft Insurance', included: true},
      {text: 'Equifax ID Restoration Services', included: true},
      {text: 'Report Export (PDF)', included: true},
      {text: 'Dedicated Phone Support', included: true},
      {text: 'Family Plan (up to 4 members)', included: true},
      {text: 'Priority Customer Service', included: true},
    ],
    limits: {
      scoreUpdatesPerMonth: -1, // daily / unlimited
      alertsPerMonth: -1,
      reportsPerMonth: -1,
      creditBureaus: 3,
      aiInsightsPerMonth: -1,
    },
  },
];

// Mock current user subscription (Free tier)
export const mockUserSubscription: UserSubscription = {
  id: 'sub_mock_123',
  planId: 'plan_free',
  tier: 'free',
  billingPeriod: 'monthly',
  status: 'active',
  currentPeriodStart: '2024-01-01T00:00:00Z',
  currentPeriodEnd: '2099-12-31T23:59:59Z', // Free never expires
  cancelAtPeriodEnd: false,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

// Mock payment methods
export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_mock_123',
    userId: 'user_123',
    type: 'credit_card',
    brand: 'Visa',
    last4: '4242',
    expiryMonth: 12,
    expiryYear: 2027,
    cardholderName: 'Tarik Neradin',
    isDefault: true,
    billingAddress: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'US',
    },
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'pm_mock_456',
    userId: 'user_123',
    type: 'credit_card',
    brand: 'Mastercard',
    last4: '5555',
    expiryMonth: 8,
    expiryYear: 2026,
    cardholderName: 'Tarik Neradin',
    isDefault: false,
    billingAddress: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'US',
    },
    createdAt: '2024-02-15T00:00:00Z',
  },
];

// Mock billing history
export const mockBillingHistory: BillingHistory[] = [
  {
    id: 'inv_mock_003',
    date: '2025-01-01T00:00:00Z',
    amount: 12.99,
    status: 'paid',
    description: 'Monthly subscription',
    planName: 'Plus',
  },
  {
    id: 'inv_mock_002',
    date: '2024-12-01T00:00:00Z',
    amount: 12.99,
    status: 'paid',
    description: 'Monthly subscription',
    planName: 'Plus',
  },
  {
    id: 'inv_mock_001',
    date: '2024-11-01T00:00:00Z',
    amount: 12.99,
    status: 'paid',
    description: 'Monthly subscription',
    planName: 'Plus',
  },
];

// Helper function to get plan by ID
export const getPlanById = (planId: string): SubscriptionPlan | undefined => {
  return subscriptionPlans.find(plan => plan.id === planId);
};

// Helper function to get plan by tier
export const getPlanByTier = (tier: string): SubscriptionPlan | undefined => {
  return subscriptionPlans.find(plan => plan.tier === tier);
};

// Helper function to calculate price for billing period
export const getPriceForPeriod = (plan: SubscriptionPlan, period: BillingPeriod): number => {
  return period === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
};

// Helper function to calculate savings
export const calculateAnnualSavings = (plan: SubscriptionPlan): number => {
  const monthlyTotal = plan.monthlyPrice * 12;
  const savings = monthlyTotal - plan.annualPrice;
  return Math.round(savings * 100) / 100;
};
