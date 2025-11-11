import {create} from 'zustand';
import {
  SubscriptionPlan,
  UserSubscription,
  PaymentMethod,
  BillingHistory,
  BillingPeriod,
  PaymentMethodType,
  BillingAddress,
} from '../types/subscription';
import {
  subscriptionPlans,
  mockUserSubscription,
  mockPaymentMethods,
  mockBillingHistory,
  getPlanById,
} from '../data/subscriptionMockData';
import * as subscriptionService from '../services/subscriptionService';

interface SubscriptionState {
  // State
  currentSubscription: UserSubscription | null;
  availablePlans: SubscriptionPlan[];
  selectedBillingPeriod: BillingPeriod;
  paymentMethods: PaymentMethod[];
  billingHistory: BillingHistory[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchSubscription: () => Promise<void>;
  fetchPlans: () => Promise<void>;
  setBillingPeriod: (period: BillingPeriod) => void;
  subscribeToPlan: (planId: string, billingPeriod: BillingPeriod, paymentMethodId?: string) => Promise<void>;
  cancelSubscription: (cancelImmediately?: boolean) => Promise<void>;
  reactivateSubscription: () => Promise<void>;
  updateSubscription: (newPlanId: string, newBillingPeriod: BillingPeriod) => Promise<void>;
  fetchPaymentMethods: () => Promise<void>;
  addPaymentMethod: (
    type: PaymentMethodType,
    cardNumber: string,
    expiryMonth: number,
    expiryYear: number,
    cvv: string,
    cardholderName: string,
    billingAddress: BillingAddress
  ) => Promise<void>;
  removePaymentMethod: (methodId: string) => Promise<void>;
  setDefaultPaymentMethod: (methodId: string) => Promise<void>;
  fetchBillingHistory: () => Promise<void>;
  clearError: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  // Initial state
  currentSubscription: null,
  availablePlans: subscriptionPlans,
  selectedBillingPeriod: 'monthly',
  paymentMethods: [],
  billingHistory: [],
  isLoading: false,
  error: null,

  // Fetch current subscription
  fetchSubscription: async () => {
    try {
      set({isLoading: true, error: null});

      const subscription = await subscriptionService.fetchUserSubscription();

      set({
        currentSubscription: subscription,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: 'Failed to fetch subscription',
        isLoading: false,
      });
    }
  },

  // Fetch available plans
  fetchPlans: async () => {
    try {
      set({isLoading: true, error: null});

      const plans = await subscriptionService.fetchSubscriptionPlans();

      set({
        availablePlans: plans,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: 'Failed to fetch plans',
        isLoading: false,
      });
    }
  },

  // Set billing period (toggle monthly/annual)
  setBillingPeriod: (period: BillingPeriod) => {
    set({
      selectedBillingPeriod: period,
    });
  },

  // Subscribe to a plan
  subscribeToPlan: async (planId: string, billingPeriod: BillingPeriod, paymentMethodId?: string) => {
    try {
      set({isLoading: true, error: null});

      const newSubscription = await subscriptionService.subscribeToPlan(
        planId,
        billingPeriod,
        paymentMethodId
      );

      set({
        currentSubscription: newSubscription,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to subscribe',
        isLoading: false,
      });
      throw error;
    }
  },

  // Cancel subscription
  cancelSubscription: async (cancelImmediately: boolean = false) => {
    try {
      set({isLoading: true, error: null});

      const current = get().currentSubscription;
      if (!current) {
        throw new Error('No active subscription');
      }

      const updatedSubscription = await subscriptionService.cancelSubscription(
        current.id,
        cancelImmediately
      );

      set({
        currentSubscription: updatedSubscription,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: 'Failed to cancel subscription',
        isLoading: false,
      });
      throw error;
    }
  },

  // Reactivate cancelled subscription
  reactivateSubscription: async () => {
    try {
      set({isLoading: true, error: null});

      const current = get().currentSubscription;
      if (!current) {
        throw new Error('No subscription found');
      }

      const reactivatedSubscription = await subscriptionService.reactivateSubscription(current.id);

      set({
        currentSubscription: reactivatedSubscription,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: 'Failed to reactivate subscription',
        isLoading: false,
      });
      throw error;
    }
  },

  // Update subscription (upgrade/downgrade)
  updateSubscription: async (newPlanId: string, newBillingPeriod: BillingPeriod) => {
    try {
      set({isLoading: true, error: null});

      const current = get().currentSubscription;
      if (!current) {
        throw new Error('No active subscription');
      }

      const updatedSubscription = await subscriptionService.updateSubscription(
        current.id,
        newPlanId,
        newBillingPeriod
      );

      set({
        currentSubscription: updatedSubscription,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: 'Failed to update subscription',
        isLoading: false,
      });
      throw error;
    }
  },

  // Fetch payment methods
  fetchPaymentMethods: async () => {
    try {
      set({isLoading: true, error: null});

      const methods = await subscriptionService.fetchPaymentMethods();

      set({
        paymentMethods: methods,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: 'Failed to fetch payment methods',
        isLoading: false,
      });
    }
  },

  // Add payment method
  addPaymentMethod: async (
    type: PaymentMethodType,
    cardNumber: string,
    expiryMonth: number,
    expiryYear: number,
    cvv: string,
    cardholderName: string,
    billingAddress: BillingAddress
  ) => {
    try {
      set({isLoading: true, error: null});

      const newMethod = await subscriptionService.addPaymentMethod(
        type,
        cardNumber,
        expiryMonth,
        expiryYear,
        cvv,
        cardholderName,
        billingAddress
      );

      set(state => ({
        paymentMethods: [...state.paymentMethods, newMethod],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add payment method',
        isLoading: false,
      });
      throw error;
    }
  },

  // Remove payment method
  removePaymentMethod: async (methodId: string) => {
    try {
      set({isLoading: true, error: null});

      await subscriptionService.removePaymentMethod(methodId);

      set(state => ({
        paymentMethods: state.paymentMethods.filter(m => m.id !== methodId),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to remove payment method',
        isLoading: false,
      });
      throw error;
    }
  },

  // Set default payment method
  setDefaultPaymentMethod: async (methodId: string) => {
    try {
      set({isLoading: true, error: null});

      const updatedMethods = await subscriptionService.setDefaultPaymentMethod(methodId);

      set({
        paymentMethods: updatedMethods,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: 'Failed to set default payment method',
        isLoading: false,
      });
      throw error;
    }
  },

  // Fetch billing history
  fetchBillingHistory: async () => {
    try {
      set({isLoading: true, error: null});

      const history = await subscriptionService.fetchBillingHistory();

      set({
        billingHistory: history,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: 'Failed to fetch billing history',
        isLoading: false,
      });
    }
  },

  // Clear error
  clearError: () => {
    set({error: null});
  },
}));
