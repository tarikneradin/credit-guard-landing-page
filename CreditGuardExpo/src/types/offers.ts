/**
 * Financial Offers & Affiliate Marketing Type Definitions
 * Comprehensive type system for product recommendations
 */

export type OfferCategory =
  | 'credit_card'
  | 'personal_loan'
  | 'mortgage'
  | 'auto_loan'
  | 'savings_account'
  | 'checking_account';

export type OfferBadge = 'featured' | 'limited_time' | 'best_match' | 'new' | 'popular';

export type SortMethod = 'relevance' | 'best_apr' | 'highest_rewards' | 'most_popular';

export interface OfferProvider {
  name: string;
  logoUrl?: string;
  rating: number;
  reviewCount: number;
  establishedYear?: number;
}

export interface CreditScoreRange {
  min: number;
  max: number;
  label: string; // "Poor", "Fair", "Good", "Very Good", "Excellent"
}

export interface OfferBenefit {
  icon: string; // Ionicons name
  text: string;
  highlight?: boolean; // Highlight this benefit
}

export interface APRInfo {
  regular: string; // "19.74% - 28.49%"
  intro?: string; // "0% for 15 months"
  introEndDate?: Date;
}

export interface OfferFees {
  annual: number;
  balanceTransfer?: number | string; // 0 or "5% or $5 min"
  foreign?: number; // percentage
  lateFee?: number | string;
  cashAdvance?: number | string;
}

export interface LoanTerms {
  minAmount: number;
  maxAmount: number;
  terms: string[]; // ["12 months", "24 months", "36 months"]
  apr: APRInfo;
  origination?: number; // percentage
}

export interface AccountFeatures {
  apy?: string; // For savings accounts
  minBalance?: number;
  monthlyFee?: number;
  atmNetwork?: string;
  mobileCheck?: boolean;
  overdraftProtection?: boolean;
}

export interface OfferEligibility {
  creditScoreRange: CreditScoreRange;
  requirements: string[]; // ["Minimum income $25,000", "Valid SSN"]
  restrictions?: string[]; // ["Not available in NY, VT"]
}

export interface MatchFactors {
  score: number; // 0-100 match score
  reasons: string[]; // Why this offer matches the user
  improvementTips?: string[]; // How to better qualify
}

export interface OfferCTA {
  label: string; // "Apply Now", "Learn More", "Check Rates"
  affiliateUrl: string;
  trackingId: string;
  requiresHardPull: boolean; // Does applying affect credit score?
}

/**
 * Main Financial Offer interface
 */
export interface FinancialOffer {
  id: string;
  category: OfferCategory;
  provider: OfferProvider;

  // Display information
  title: string;
  tagline: string; // Short description
  description: string; // Full description
  benefits: OfferBenefit[];
  badge?: OfferBadge;

  // Financial terms (category-specific)
  creditCard?: {
    apr: APRInfo;
    fees: OfferFees;
    rewardsProgram?: string;
    signUpBonus?: string;
    creditLimit?: string; // "$5,000 - $25,000"
  };

  loan?: LoanTerms;

  bankAccount?: AccountFeatures;

  // Eligibility
  eligibility: OfferEligibility;

  // Matching & relevance
  match: MatchFactors;

  // Call to action
  cta: OfferCTA;

  // Metadata
  featured: boolean;
  popularityScore: number; // 0-100
  estimatedCommission?: number; // For analytics
  lastUpdated: Date;

  // Content
  pros: string[];
  cons: string[];
  fullTermsUrl: string;
  reviewsUrl?: string;
}

/**
 * Offer filtering and sorting state
 */
export interface OfferFilters {
  categories: OfferCategory[];
  minCreditScore?: number;
  maxCreditScore?: number;
  showFeaturedOnly?: boolean;
  sortBy: SortMethod;
}

/**
 * User's offer preferences
 */
export interface OfferPreferences {
  userId: string;
  showOffers: boolean;
  showBanners: boolean;
  enabledCategories: OfferCategory[];
  emailOffers: boolean;
  optedOutAt?: Date;
  dismissedOffers: string[]; // Offer IDs user dismissed
  updatedAt: Date;
}

/**
 * Offer analytics event
 */
export interface OfferEvent {
  offerId: string;
  eventType: 'viewed' | 'clicked' | 'detail_opened' | 'applied' | 'dismissed';
  timestamp: Date;
  context: 'dashboard' | 'offers_screen' | 'smart_actions' | 'banner';
  userId: string;
}

/**
 * Affiliate tracking parameters
 */
export interface AffiliateTrackingParams {
  offerId: string;
  userId: string; // Anonymous/hashed for privacy
  source: string; // 'dashboard' | 'offers' | 'banner'
  timestamp: Date;
  sessionId: string;
}
