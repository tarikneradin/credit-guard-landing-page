/**
 * Offer Store
 * Zustand store for managing financial offers state
 */

import {create} from 'zustand';
import {
  FinancialOffer,
  OfferCategory,
  SortMethod,
  OfferPreferences,
  OfferEvent,
} from '../types/offers';
import {
  allFinancialOffers,
  featuredOffers,
  defaultOfferPreferences,
  sortOffersByRelevance,
  sortOffersByPopularity,
} from '../data/offersMockData';

interface OfferStore {
  // State
  allOffers: FinancialOffer[];
  filteredOffers: FinancialOffer[];
  featuredOffers: FinancialOffer[];
  selectedCategory: OfferCategory | 'all';
  sortMethod: SortMethod;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;

  // User preferences
  preferences: OfferPreferences;

  // Analytics
  viewedOffers: Set<string>;
  clickedOffers: Set<string>;

  // Actions
  fetchOffers: () => Promise<void>;
  filterByCategory: (category: OfferCategory | 'all') => void;
  sortOffers: (method: SortMethod) => void;
  searchOffers: (query: string) => void;
  resetFilters: () => void;

  // Match scoring
  getMatchScore: (offer: FinancialOffer, userCreditScore?: number) => number;
  getEligibleOffers: (userCreditScore?: number) => FinancialOffer[];

  // Preferences
  updatePreferences: (preferences: Partial<OfferPreferences>) => void;
  dismissOffer: (offerId: string) => void;
  isDismissed: (offerId: string) => boolean;

  // Analytics
  trackOfferView: (offerId: string, context?: string) => void;
  trackOfferClick: (offerId: string, context?: string) => void;
  getOfferEvents: () => OfferEvent[];
}

export const useOfferStore = create<OfferStore>((set, get) => ({
  // Initial state
  allOffers: [],
  filteredOffers: [],
  featuredOffers: [],
  selectedCategory: 'all',
  sortMethod: 'relevance',
  searchQuery: '',
  isLoading: false,
  error: null,
  preferences: defaultOfferPreferences,
  viewedOffers: new Set<string>(),
  clickedOffers: new Set<string>(),

  // Fetch offers (mock implementation, replace with API call later)
  fetchOffers: async () => {
    set({isLoading: true, error: null});
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      const offers = allFinancialOffers;
      set({
        allOffers: offers,
        filteredOffers: offers,
        featuredOffers: featuredOffers,
        isLoading: false,
      });
    } catch {
      set({
        error: 'Failed to load offers. Please try again.',
        isLoading: false,
      });
    }
  },

  // Filter by category
  filterByCategory: category => {
    const {allOffers, sortMethod, searchQuery} = get();
    let filtered = allOffers;

    // Apply category filter
    if (category !== 'all') {
      filtered = filtered.filter(offer => offer.category === category);
    }

    // Apply search filter if exists
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        offer =>
          offer.title.toLowerCase().includes(query) ||
          offer.provider.name.toLowerCase().includes(query) ||
          offer.tagline.toLowerCase().includes(query),
      );
    }

    // Apply sorting
    filtered = applySorting(filtered, sortMethod);

    set({selectedCategory: category, filteredOffers: filtered});
  },

  // Sort offers
  sortOffers: method => {
    const {filteredOffers} = get();
    const sorted = applySorting([...filteredOffers], method);
    set({sortMethod: method, filteredOffers: sorted});
  },

  // Search offers
  searchOffers: query => {
    const {allOffers, selectedCategory, sortMethod} = get();
    let filtered = allOffers;

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(offer => offer.category === selectedCategory);
    }

    // Apply search filter
    if (query) {
      const searchLower = query.toLowerCase();
      filtered = filtered.filter(
        offer =>
          offer.title.toLowerCase().includes(searchLower) ||
          offer.provider.name.toLowerCase().includes(searchLower) ||
          offer.tagline.toLowerCase().includes(searchLower) ||
          offer.description.toLowerCase().includes(searchLower),
      );
    }

    // Apply sorting
    filtered = applySorting(filtered, sortMethod);

    set({searchQuery: query, filteredOffers: filtered});
  },

  // Reset filters
  resetFilters: () => {
    const {allOffers} = get();
    set({
      selectedCategory: 'all',
      sortMethod: 'relevance',
      searchQuery: '',
      filteredOffers: sortOffersByRelevance(allOffers),
    });
  },

  // Calculate match score based on user's credit profile
  getMatchScore: (offer, userCreditScore = 742) => {
    // Base match score from offer
    let score = offer.match.score;

    // Adjust based on credit score eligibility
    const {min, max} = offer.eligibility.creditScoreRange;
    if (userCreditScore < min) {
      score = score * 0.5; // Significant penalty if below minimum
    } else if (userCreditScore >= min && userCreditScore <= max) {
      // Bonus if in range
      const rangePosition = (userCreditScore - min) / (max - min);
      score = Math.min(100, score + rangePosition * 10);
    }

    return Math.round(score);
  },

  // Get eligible offers for user
  getEligibleOffers: (userCreditScore = 742) => {
    const {allOffers} = get();
    return allOffers.filter(offer => {
      const {min, max} = offer.eligibility.creditScoreRange;
      return userCreditScore >= min && userCreditScore <= max;
    });
  },

  // Update preferences
  updatePreferences: updates => {
    set(state => ({
      preferences: {
        ...state.preferences,
        ...updates,
        updatedAt: new Date(),
      },
    }));
  },

  // Dismiss offer
  dismissOffer: offerId => {
    set(state => ({
      preferences: {
        ...state.preferences,
        dismissedOffers: [...state.preferences.dismissedOffers, offerId],
        updatedAt: new Date(),
      },
    }));
  },

  // Check if offer is dismissed
  isDismissed: offerId => {
    const {preferences} = get();
    return preferences.dismissedOffers.includes(offerId);
  },

  // Track offer view
  trackOfferView: (offerId, _context = 'dashboard') => {
    const {viewedOffers} = get();
    const newViewed = new Set(viewedOffers);
    newViewed.add(offerId);
    set({viewedOffers: newViewed});

    // In production, send to analytics service
  },

  // Track offer click
  trackOfferClick: (offerId, _context = 'dashboard') => {
    const {clickedOffers} = get();
    const newClicked = new Set(clickedOffers);
    newClicked.add(offerId);
    set({clickedOffers: newClicked});

    // In production, send to analytics service
  },

  // Get offer events (for analytics)
  getOfferEvents: () => {
    const {viewedOffers, clickedOffers} = get();
    const events: OfferEvent[] = [];

    // Convert sets to events (simplified)
    viewedOffers.forEach(offerId => {
      events.push({
        offerId,
        eventType: 'viewed',
        timestamp: new Date(),
        context: 'dashboard',
        userId: 'user_123456',
      });
    });

    clickedOffers.forEach(offerId => {
      events.push({
        offerId,
        eventType: 'clicked',
        timestamp: new Date(),
        context: 'dashboard',
        userId: 'user_123456',
      });
    });

    return events;
  },
}));

/**
 * Helper function to apply sorting to offers
 */
function applySorting(offers: FinancialOffer[], method: SortMethod): FinancialOffer[] {
  switch (method) {
    case 'relevance':
      return sortOffersByRelevance(offers);

    case 'best_apr':
      return [...offers].sort((a, b) => {
        // Get APR for comparison
        const aprA = getMinAPR(a);
        const aprB = getMinAPR(b);
        return aprA - aprB; // Lower APR first
      });

    case 'highest_rewards':
      return [...offers].sort((a, b) => {
        // Prioritize offers with sign-up bonuses and rewards
        const rewardScoreA = calculateRewardScore(a);
        const rewardScoreB = calculateRewardScore(b);
        return rewardScoreB - rewardScoreA; // Higher rewards first
      });

    case 'most_popular':
      return sortOffersByPopularity(offers);

    default:
      return offers;
  }
}

/**
 * Extract minimum APR from offer
 */
function getMinAPR(offer: FinancialOffer): number {
  if (offer.creditCard?.apr.regular) {
    const aprStr = offer.creditCard.apr.regular.split('-')[0].trim();
    return parseFloat(aprStr);
  }
  if (offer.loan?.apr.regular) {
    const aprStr = offer.loan.apr.regular.split('-')[0].trim();
    return parseFloat(aprStr);
  }
  return 999; // No APR, place at end
}

/**
 * Calculate reward score for sorting
 */
function calculateRewardScore(offer: FinancialOffer): number {
  let score = 0;

  // Credit card rewards
  if (offer.creditCard) {
    if (offer.creditCard.signUpBonus) {
      score += 50; // Bonus points for sign-up bonus
    }
    if (offer.creditCard.rewardsProgram) {
      score += 30; // Bonus for having rewards program
    }
  }

  // Add match score as tiebreaker
  score += offer.match.score * 0.1;

  return score;
}
