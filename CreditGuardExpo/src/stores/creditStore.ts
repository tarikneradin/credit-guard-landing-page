/* eslint-disable @typescript-eslint/no-explicit-any */
import {create} from 'zustand';
import {creditService} from '../api/services/creditService';
import {handleApiError} from '../api/client';
import {CreditScore, ScoreHistory, CreditScoreFactor} from '../types/api';
import {
  equifaxService,
  EquifaxScoreResponse,
  EquifaxFullReport,
  EquifaxReportSummary,
} from '../api/services/equifaxService';
import {useSubscriptionStore} from './subscriptionStore';
import {getPlanById} from '../data/subscriptionMockData';

export type Bureau = 'equifax' | 'transunion' | 'experian';

/**
 * Get available bureaus based on subscription plan and API response
 * @param bureauCountFromSubscription - Number of bureaus allowed by subscription (1 or 3)
 * @param bureausInAPIResponse - Bureaus available in the API response
 * @returns Array of bureaus the user can access
 */
const getAvailableBureaus = (
  bureauCountFromSubscription: number | undefined,
  bureausInAPIResponse: Bureau[],
): Bureau[] => {
  // If subscription allows only 1 bureau or is free tier, restrict to Equifax only
  if (bureauCountFromSubscription === 1) {
    return ['equifax'];
  }

  // If subscription allows 3 bureaus, return what's available in API response
  // (API might return 1 or 3 bureaus depending on what user purchased)
  if (bureauCountFromSubscription === 3 || bureauCountFromSubscription === -1) {
    return bureausInAPIResponse.length > 0 ? bureausInAPIResponse : ['equifax', 'transunion', 'experian'];
  }

  // Default fallback to just Equifax
  return ['equifax'];
};

export interface CreditState {
  // State
  creditScore: CreditScore | null;
  reportSummary: EquifaxReportSummary | null;
  scoreHistory: ScoreHistory[];
  alerts: any[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  fullScoreResponse: EquifaxScoreResponse | null; // Store full response for bureau switching
  selectedBureau: Bureau;
  fullReport: EquifaxFullReport | null;
  availableBureaus: Bureau[]; // Bureaus available based on report (1B or 3B)
  bureauCount: 1 | 3; // Global indicator: 1 = single bureau, 3 = all three bureaus

  // Actions
  fetchCreditScore: () => Promise<void>;
  fetchReportSummary: () => Promise<void>;
  fetchScoreHistory: () => Promise<void>;
  fetchAlerts: () => Promise<void>;
  refreshAllData: () => Promise<void>;
  clearError: () => void;
  setSelectedBureau: (bureau: Bureau) => void;
  getScoreForBureau: (bureau: Bureau) => CreditScore | null;
  fetchFullReport: () => Promise<void>;
}

export const useCreditStore = create<CreditState>((set, get) => ({
  // Initial state
  creditScore: null,
  reportSummary: null,
  scoreHistory: [],
  alerts: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
  fullScoreResponse: null,
  selectedBureau: 'equifax',
  fullReport: null,
  availableBureaus: ['equifax'], // Default to single bureau
  bureauCount: 1, // Default to single bureau
  // Actions

  fetchCreditScore: async () => {
    try {
      set({isLoading: true, error: null});

      // Try to get score from Equifax API
      try {
        const scoreResponse = await equifaxService.getLatestScores();

        // Store the full response for bureau switching
        const currentBureau = get().selectedBureau;

        // Get the score for the selected bureau (default to first available)
        const providerView =
          equifaxService.getScoreByBureau(scoreResponse, currentBureau) ||
          scoreResponse.providerViews[0]; // Fallback to first bureau if selected not available

        if (!providerView) {
          throw new Error('No credit score data available');
        }

        // Map scoreReasons to our CreditScoreFactor type
        const factors: CreditScoreFactor[] = providerView.scoreReasons.map(reason => ({
          code: reason.code,
          description: reason.description,
          impact:
            reason.creditScoreFactorEffect === 'HURTING'
              ? 'negative'
              : reason.creditScoreFactorEffect === 'HELPING'
                ? 'positive'
                : 'neutral',
        }));

        // Map to our CreditScore type
        const creditScore: CreditScore = {
          score: providerView.score,
          scoreDate: new Date(scoreResponse.generatedDate).toISOString(),
          bureau:
            providerView.provider === 'EFX'
              ? 'Equifax'
              : providerView.provider === 'TU'
                ? 'TransUnion'
                : 'Experian',
          scoreRange: {
            min: providerView.scoreRanges[0]?.low || 300,
            max: providerView.scoreRanges[providerView.scoreRanges.length - 1]?.high || 850,
          },
          factors,
        };

        // Detect available bureaus from the API response
        const bureausInAPIResponse: Bureau[] = scoreResponse.providerViews.map(view => {
          const provider = view.provider.toUpperCase();
          if (provider === 'EFX' || provider === 'EQUIFAX') return 'equifax';
          if (provider === 'TU' || provider === 'TRANSUNION') return 'transunion';
          if (provider === 'XPN' || provider === 'EXPERIAN') return 'experian';
          return 'equifax'; // fallback
        }).filter((bureau, index, self) => self.indexOf(bureau) === index); // Remove duplicates

        // Get user's subscription to determine bureau access
        const subscription = useSubscriptionStore.getState().currentSubscription;
        const plan = subscription ? getPlanById(subscription.planId) : null;
        const bureauLimit = plan?.limits?.creditBureaus;

        // Calculate available bureaus based on subscription limits
        const availableBureaus = getAvailableBureaus(bureauLimit, bureausInAPIResponse);
        const bureauCount = availableBureaus.length === 3 ? 3 : 1;

        set({
          creditScore,
          fullScoreResponse: scoreResponse,
          availableBureaus,
          bureauCount,
          lastUpdated: new Date(),
          isLoading: false,
        });
        return;
      } catch {
        // Fallback to demo data if Equifax API fails
        const demoCreditScore: CreditScore = {
          score: 742,
          scoreDate: new Date().toISOString(),
          bureau: 'Equifax',
          scoreRange: {min: 300, max: 850},
          factors: [
            {code: 'PH01', description: 'Payment history is excellent', impact: 'positive'},
            {code: 'CU02', description: 'Credit utilization is low', impact: 'positive'},
            {
              code: 'AH03',
              description: 'Length of credit history could be longer',
              impact: 'neutral',
            },
          ] as CreditScoreFactor[],
        };

        set({
          creditScore: demoCreditScore,
          lastUpdated: new Date(),
          isLoading: false,
        });
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  fetchReportSummary: async () => {
    try {
      set({isLoading: true, error: null});

      const reportSummary = await equifaxService.getReportSummary();

      // Log the report summary to console for debugging
      console.log('=== EQUIFAX REPORT SUMMARY ===');
      console.log(JSON.stringify(reportSummary, null, 2));
      console.log('=== END REPORT SUMMARY ===');

      set({
        reportSummary: reportSummary,
        lastUpdated: new Date(),
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching report summary:', error);
      const errorMessage = handleApiError(error);
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  fetchScoreHistory: async () => {
    try {
      // Try to get score history from Equifax API
      try {
        const historyData = await equifaxService.getScoreHistory();

        // Get current selected bureau
        const currentBureau = get().selectedBureau;

        // Bureau mapping
        const bureauMaps: Record<string, string[]> = {
          equifax: ['EFX', 'EQUIFAX', 'EQ'],
          transunion: ['TU', 'TRANSUNION', 'TUC'],
          experian: ['XPN', 'EXPERIAN', 'EXP', 'XP'],
        };

        const bureauCodes = bureauMaps[currentBureau] || ['EFX'];

        // Transform and flatten the data - get score for selected bureau from each history entry
        const scoreHistory: ScoreHistory[] = historyData
          .map(entry => {
            // Find the score for the selected bureau
            const providerView = entry.providerViews.find(view =>
              bureauCodes.some(code => view.provider.toUpperCase() === code.toUpperCase()),
            );

            if (!providerView) {
              return null;
            }

            return {
              date: new Date(entry.generatedDate).toISOString(),
              score: providerView.score,
              bureau: providerView.provider,
            };
          })
          .filter((item): item is ScoreHistory => item !== null) // Remove nulls
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by date ascending

        set({scoreHistory});
      } catch {
        // Set empty array if API fails
        set({scoreHistory: []});
      }
    } catch {
      // Don't fail silently, but don't crash the app either
      set({scoreHistory: []});
    }
  },

  fetchAlerts: async () => {
    try {
      const alerts = await creditService.getAlerts();

      // Log the alerts response to console for debugging
      console.log('=== EQUIFAX ALERTS RESPONSE ===');
      console.log(JSON.stringify(alerts, null, 2));
      console.log('=== END ALERTS RESPONSE ===');

      set({alerts});
    } catch (error) {
      console.error('Error fetching alerts:', error);
      // Failed to fetch alerts
    }
  },

  refreshAllData: async () => {
    const state = get();
    try {
      set({isLoading: true, error: null});

      // Use the store's own methods which have demo logic built-in
      // Skip alerts for now as it's causing 401 errors
      await Promise.allSettled([
        state.fetchCreditScore(),
        state.fetchReportSummary(),
        state.fetchScoreHistory(),
        state.fetchFullReport(),
        // state.fetchAlerts(), // Disabled - causes 401 errors
      ]);

      // Individual methods handle their own state updates, so we just need to clear loading
      set({isLoading: false, lastUpdated: new Date()});
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  clearError: () => {
    set({error: null});
  },

  setSelectedBureau: (bureau: Bureau) => {
    const state = get();

    set({selectedBureau: bureau});

    // If we have a full score response, update the credit score for the new bureau
    if (state.fullScoreResponse) {
      const providerView = equifaxService.getScoreByBureau(state.fullScoreResponse, bureau);

      if (providerView) {
        // Map scoreReasons to our CreditScoreFactor type
        const factors: CreditScoreFactor[] = providerView.scoreReasons.map(reason => ({
          code: reason.code,
          description: reason.description,
          impact:
            reason.creditScoreFactorEffect === 'HURTING'
              ? 'negative'
              : reason.creditScoreFactorEffect === 'HELPING'
                ? 'positive'
                : 'neutral',
        }));

        const creditScore: CreditScore = {
          score: providerView.score,
          scoreDate: new Date(state.fullScoreResponse.generatedDate).toISOString(),
          bureau:
            providerView.provider === 'EFX'
              ? 'Equifax'
              : providerView.provider === 'TU'
                ? 'TransUnion'
                : 'Experian',
          scoreRange: {
            min: providerView.scoreRanges[0]?.low || 300,
            max: providerView.scoreRanges[providerView.scoreRanges.length - 1]?.high || 850,
          },
          factors,
        };

        set({creditScore});
      }
    }

    // Refetch score history for the new bureau
    state.fetchScoreHistory();
  },

  getScoreForBureau: (bureau: Bureau) => {
    const state = get();
    if (!state.fullScoreResponse) return null;

    const providerView = equifaxService.getScoreByBureau(state.fullScoreResponse, bureau);
    if (!providerView) return null;

    const factors: CreditScoreFactor[] = providerView.scoreReasons.map(reason => ({
      code: reason.code,
      description: reason.description,
      impact:
        reason.creditScoreFactorEffect === 'HURTING'
          ? 'negative'
          : reason.creditScoreFactorEffect === 'HELPING'
            ? 'positive'
            : 'neutral',
    }));

    return {
      score: providerView.score,
      scoreDate: new Date(state.fullScoreResponse.generatedDate).toISOString(),
      bureau:
        providerView.provider === 'EFX'
          ? 'Equifax'
          : providerView.provider === 'TU'
            ? 'TransUnion'
            : 'Experian',
      scoreRange: {
        min: providerView.scoreRanges[0]?.low || 300,
        max: providerView.scoreRanges[providerView.scoreRanges.length - 1]?.high || 850,
      },
      factors,
    };
  },

  fetchFullReport: async () => {
    try {
      set({isLoading: true, error: null});
      const fullReport = await equifaxService.getLatestReport();

      // Log the full report to console for debugging
      console.log('=== EQUIFAX FULL REPORT ===');
      console.log(JSON.stringify(fullReport, null, 2));
      console.log('=== END FULL REPORT ===');

      set({
        fullReport: fullReport,
        isLoading: false,
        lastUpdated: new Date(),
        // Don't override reportSummary - let fetchReportSummary handle that separately
      });
      //@ts-ignore
    } catch (error: any) {
      console.error('Error fetching full report:', error);
      set({fullReport: null, error: error.message, isLoading: false});
    }
  },
}));
