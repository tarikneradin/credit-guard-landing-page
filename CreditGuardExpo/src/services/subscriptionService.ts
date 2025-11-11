/**
 * Mock Subscription Service
 * Simulates payment processing and subscription management
 * In production, this would integrate with Stripe, PayPal, or similar payment processors
 */

import {
  SubscriptionPlan,
  UserSubscription,
  PaymentMethod,
  PaymentIntent,
  BillingHistory,
  BillingPeriod,
  SubscriptionTier,
  BillingAddress,
  PaymentMethodType,
} from '../types/subscription';
import {
  subscriptionPlans,
  mockUserSubscription,
  mockPaymentMethods,
  mockBillingHistory,
  getPlanById,
  getPriceForPeriod,
} from '../data/subscriptionMockData';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch all available subscription plans
 */
export const fetchSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  await delay(500);
  return subscriptionPlans;
};

/**
 * Fetch current user subscription
 */
export const fetchUserSubscription = async (): Promise<UserSubscription> => {
  await delay(500);
  return mockUserSubscription;
};

/**
 * Fetch user payment methods
 */
export const fetchPaymentMethods = async (): Promise<PaymentMethod[]> => {
  await delay(500);
  return mockPaymentMethods;
};

/**
 * Fetch billing history
 */
export const fetchBillingHistory = async (): Promise<BillingHistory[]> => {
  await delay(500);
  return mockBillingHistory;
};

/**
 * Create a payment intent for subscription purchase
 */
export const createPaymentIntent = async (
  planId: string,
  billingPeriod: BillingPeriod
): Promise<PaymentIntent> => {
  await delay(800);

  const plan = getPlanById(planId);
  if (!plan) {
    throw new Error('Invalid plan ID');
  }

  const amount = getPriceForPeriod(plan, billingPeriod);

  // Mock payment intent
  return {
    id: `pi_mock_${Date.now()}`,
    amount: amount * 100, // Convert to cents
    currency: 'usd',
    status: 'requires_payment_method',
    clientSecret: `pi_mock_secret_${Date.now()}`,
  };
};

/**
 * Confirm payment and create subscription
 */
export const confirmPayment = async (
  paymentIntentId: string,
  paymentMethodId: string
): Promise<PaymentIntent> => {
  await delay(1500);

  // Simulate payment processing
  const random = Math.random();

  if (random < 0.95) {
    // 95% success rate
    return {
      id: paymentIntentId,
      amount: 1299, // mock amount
      currency: 'usd',
      status: 'succeeded',
      clientSecret: `pi_mock_secret_${Date.now()}`,
      paymentMethodId,
    };
  } else {
    // 5% failure rate
    return {
      id: paymentIntentId,
      amount: 1299,
      currency: 'usd',
      status: 'failed',
      clientSecret: `pi_mock_secret_${Date.now()}`,
      paymentMethodId,
      error: 'Your card was declined. Please try another payment method.',
    };
  }
};

/**
 * Subscribe to a plan
 */
export const subscribeToPlan = async (
  planId: string,
  billingPeriod: BillingPeriod,
  paymentMethodId?: string
): Promise<UserSubscription> => {
  await delay(1000);

  const plan = getPlanById(planId);
  if (!plan) {
    throw new Error('Invalid plan ID');
  }

  // Free plan doesn't require payment
  if (plan.tier === 'free') {
    return {
      id: `sub_mock_${Date.now()}`,
      planId,
      tier: plan.tier,
      billingPeriod,
      status: 'active',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date('2099-12-31').toISOString(),
      cancelAtPeriodEnd: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  // Paid plans require payment method
  if (!paymentMethodId) {
    throw new Error('Payment method required for paid plans');
  }

  const now = new Date();
  const periodEnd = new Date(now);
  if (billingPeriod === 'monthly') {
    periodEnd.setMonth(periodEnd.getMonth() + 1);
  } else {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
  }

  return {
    id: `sub_mock_${Date.now()}`,
    planId,
    tier: plan.tier,
    billingPeriod,
    status: 'active',
    currentPeriodStart: now.toISOString(),
    currentPeriodEnd: periodEnd.toISOString(),
    cancelAtPeriodEnd: false,
    paymentMethodId,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
};

/**
 * Update subscription (upgrade/downgrade)
 */
export const updateSubscription = async (
  subscriptionId: string,
  newPlanId: string,
  newBillingPeriod: BillingPeriod
): Promise<UserSubscription> => {
  await delay(1000);

  const plan = getPlanById(newPlanId);
  if (!plan) {
    throw new Error('Invalid plan ID');
  }

  const now = new Date();
  const periodEnd = new Date(now);
  if (newBillingPeriod === 'monthly') {
    periodEnd.setMonth(periodEnd.getMonth() + 1);
  } else {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
  }

  return {
    id: subscriptionId,
    planId: newPlanId,
    tier: plan.tier,
    billingPeriod: newBillingPeriod,
    status: 'active',
    currentPeriodStart: now.toISOString(),
    currentPeriodEnd: periodEnd.toISOString(),
    cancelAtPeriodEnd: false,
    paymentMethodId: mockPaymentMethods[0]?.id,
    createdAt: mockUserSubscription.createdAt,
    updatedAt: now.toISOString(),
  };
};

/**
 * Cancel subscription
 */
export const cancelSubscription = async (
  subscriptionId: string,
  cancelImmediately: boolean = false
): Promise<UserSubscription> => {
  await delay(800);

  return {
    ...mockUserSubscription,
    id: subscriptionId,
    status: cancelImmediately ? 'cancelled' : 'active',
    cancelAtPeriodEnd: !cancelImmediately,
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Reactivate cancelled subscription
 */
export const reactivateSubscription = async (subscriptionId: string): Promise<UserSubscription> => {
  await delay(800);

  return {
    ...mockUserSubscription,
    id: subscriptionId,
    status: 'active',
    cancelAtPeriodEnd: false,
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Add payment method
 */
export const addPaymentMethod = async (
  type: PaymentMethodType,
  cardNumber: string,
  expiryMonth: number,
  expiryYear: number,
  cvv: string,
  cardholderName: string,
  billingAddress: BillingAddress
): Promise<PaymentMethod> => {
  await delay(1000);

  // Basic validation
  if (cardNumber.length < 13 || cardNumber.length > 19) {
    throw new Error('Invalid card number');
  }

  if (expiryMonth < 1 || expiryMonth > 12) {
    throw new Error('Invalid expiry month');
  }

  if (expiryYear < new Date().getFullYear()) {
    throw new Error('Card has expired');
  }

  if (cvv.length < 3 || cvv.length > 4) {
    throw new Error('Invalid CVV');
  }

  // Determine card brand from first digit
  const firstDigit = cardNumber[0];
  let brand = 'Unknown';
  if (firstDigit === '4') brand = 'Visa';
  else if (firstDigit === '5') brand = 'Mastercard';
  else if (firstDigit === '3') brand = 'Amex';
  else if (firstDigit === '6') brand = 'Discover';

  const last4 = cardNumber.slice(-4);

  return {
    id: `pm_mock_${Date.now()}`,
    userId: 'user_123',
    type,
    brand,
    last4,
    expiryMonth,
    expiryYear,
    cardholderName,
    isDefault: mockPaymentMethods.length === 0,
    billingAddress,
    createdAt: new Date().toISOString(),
  };
};

/**
 * Remove payment method
 */
export const removePaymentMethod = async (paymentMethodId: string): Promise<void> => {
  await delay(500);

  const method = mockPaymentMethods.find(pm => pm.id === paymentMethodId);
  if (!method) {
    throw new Error('Payment method not found');
  }

  if (method.isDefault && mockPaymentMethods.length > 1) {
    throw new Error('Cannot remove default payment method. Please set another as default first.');
  }
};

/**
 * Set default payment method
 */
export const setDefaultPaymentMethod = async (paymentMethodId: string): Promise<PaymentMethod[]> => {
  await delay(500);

  return mockPaymentMethods.map(pm => ({
    ...pm,
    isDefault: pm.id === paymentMethodId,
  }));
};

/**
 * Calculate proration amount for subscription change
 */
export const calculateProration = async (
  currentPlanId: string,
  newPlanId: string,
  currentBillingPeriod: BillingPeriod,
  newBillingPeriod: BillingPeriod
): Promise<number> => {
  await delay(300);

  const currentPlan = getPlanById(currentPlanId);
  const newPlan = getPlanById(newPlanId);

  if (!currentPlan || !newPlan) {
    throw new Error('Invalid plan ID');
  }

  const currentPrice = getPriceForPeriod(currentPlan, currentBillingPeriod);
  const newPrice = getPriceForPeriod(newPlan, newBillingPeriod);

  // Simple proration: difference between prices
  // In production, this would account for remaining time in current period
  const proratedAmount = newPrice - currentPrice;

  return Math.max(0, proratedAmount);
};
