/**
 * Mock Financial Offers Data
 * Comprehensive mock data for credit cards, loans, and banking products
 */

import {FinancialOffer, OfferPreferences} from '../types/offers';

/**
 * Credit Card Offers
 */
export const creditCardOffers: FinancialOffer[] = [
  // Premium Cash Back Card
  {
    id: 'cc_chase_freedom_unlimited',
    category: 'credit_card',
    provider: {
      name: 'Chase',
      rating: 4.7,
      reviewCount: 12453,
      establishedYear: 1799,
    },
    title: 'Chase Freedom Unlimited®',
    tagline: 'Unlimited 1.5% cash back on every purchase',
    description:
      'Earn unlimited 1.5% cash back on all purchases with no rotating categories. Get $200 bonus after spending $500 in first 3 months.',
    benefits: [
      {icon: 'cash-outline', text: '1.5% cash back on all purchases', highlight: true},
      {icon: 'gift-outline', text: '$200 bonus after $500 spend'},
      {icon: 'percent-outline', text: '0% intro APR for 15 months'},
      {icon: 'card-outline', text: 'No annual fee'},
    ],
    badge: 'featured',
    creditCard: {
      apr: {
        regular: '19.74% - 28.49%',
        intro: '0% for 15 months',
      },
      fees: {
        annual: 0,
        balanceTransfer: '5% or $5 min',
        foreign: 3,
      },
      rewardsProgram: 'Chase Ultimate Rewards',
      signUpBonus: '$200 after $500 spend in 3 months',
      creditLimit: '$5,000 - $25,000',
    },
    eligibility: {
      creditScoreRange: {min: 670, max: 850, label: 'Good - Excellent'},
      requirements: ['Minimum income $25,000', 'Valid SSN', 'U.S. resident'],
    },
    match: {
      score: 92,
      reasons: [
        'Your credit score (742) is in the optimal range',
        'Low utilization makes you a strong candidate',
        'No recent hard inquiries improves approval odds',
      ],
    },
    cta: {
      label: 'Apply Now',
      affiliateUrl: 'https://chase.com/freedom-unlimited',
      trackingId: 'cc_chase_001',
      requiresHardPull: true,
    },
    featured: true,
    popularityScore: 95,
    estimatedCommission: 150,
    lastUpdated: new Date(),
    pros: [
      'Generous sign-up bonus',
      'No annual fee',
      'Excellent cash back rate',
      'Strong intro APR offer',
      '0% intro APR on balance transfers',
    ],
    cons: [
      'Foreign transaction fees',
      'Not the highest cash back for specific categories',
      'Regular APR is relatively high',
    ],
    fullTermsUrl: 'https://chase.com/freedom-unlimited/terms',
  },

  // Travel Rewards Card
  {
    id: 'cc_capital_one_venture',
    category: 'credit_card',
    provider: {
      name: 'Capital One',
      rating: 4.6,
      reviewCount: 8921,
    },
    title: 'Capital One Venture Rewards',
    tagline: 'Earn 2x miles on every purchase',
    description:
      'Get unlimited 2X miles on every purchase, every day. Earn 75,000 bonus miles once you spend $4,000 in first 3 months.',
    benefits: [
      {icon: 'airplane-outline', text: '2X miles on all purchases', highlight: true},
      {icon: 'trophy-outline', text: '75,000 bonus miles'},
      {icon: 'globe-outline', text: 'No foreign transaction fees'},
      {icon: 'shield-checkmark-outline', text: 'Travel accident insurance'},
    ],
    badge: 'popular',
    creditCard: {
      apr: {
        regular: '19.99% - 27.99%',
      },
      fees: {
        annual: 95,
        foreign: 0,
      },
      rewardsProgram: 'Capital One Miles',
      signUpBonus: '75,000 bonus miles ($750 value)',
      creditLimit: '$10,000 - $50,000',
    },
    eligibility: {
      creditScoreRange: {min: 700, max: 850, label: 'Good - Excellent'},
      requirements: ['Good credit history', 'Minimum income $40,000'],
    },
    match: {
      score: 88,
      reasons: [
        'Travel spending patterns align well',
        'Credit score qualifies for approval',
        'Annual fee justified by rewards value',
      ],
    },
    cta: {
      label: 'Check Offers',
      affiliateUrl: 'https://capitalone.com/venture',
      trackingId: 'cc_cap1_002',
      requiresHardPull: true,
    },
    featured: false,
    popularityScore: 89,
    estimatedCommission: 180,
    lastUpdated: new Date(),
    pros: [
      'High earning rate on all purchases',
      'Substantial sign-up bonus',
      'No foreign transaction fees',
      'Miles never expire',
      'Travel portal for booking',
    ],
    cons: [
      '$95 annual fee',
      'Limited transfer partners compared to competitors',
      'Redemption value can vary',
    ],
    fullTermsUrl: 'https://capitalone.com/venture/terms',
  },

  // Secured Credit Card
  {
    id: 'cc_discover_secured',
    category: 'credit_card',
    provider: {
      name: 'Discover',
      rating: 4.5,
      reviewCount: 5234,
    },
    title: 'Discover it® Secured',
    tagline: 'Build credit with cash back rewards',
    description:
      'Build or rebuild credit while earning 2% cash back at gas stations and restaurants. $200 security deposit required.',
    benefits: [
      {icon: 'trending-up-outline', text: 'Build credit history', highlight: true},
      {icon: 'cash-outline', text: '2% cash back on select categories'},
      {icon: 'card-outline', text: 'No annual fee'},
      {icon: 'time-outline', text: 'Automatic reviews for upgrade'},
    ],
    badge: 'best_match',
    creditCard: {
      apr: {
        regular: '28.24%',
      },
      fees: {
        annual: 0,
        foreign: 0,
      },
      rewardsProgram: 'Discover Cashback Match',
      creditLimit: '$200 - $2,500 (equals security deposit)',
    },
    eligibility: {
      creditScoreRange: {min: 300, max: 669, label: 'Poor - Fair'},
      requirements: ['$200 minimum security deposit', 'Valid SSN', 'Bank account required'],
    },
    match: {
      score: 76,
      reasons: [
        'Perfect for building credit history',
        'No annual fee saves money',
        'Potential to graduate to unsecured card',
      ],
    },
    cta: {
      label: 'Apply Now',
      affiliateUrl: 'https://discover.com/secured',
      trackingId: 'cc_disc_003',
      requiresHardPull: true,
    },
    featured: false,
    popularityScore: 78,
    estimatedCommission: 75,
    lastUpdated: new Date(),
    pros: [
      'No annual fee',
      'Earn cash back while building credit',
      'Free FICO score access',
      'Automatic account reviews for upgrades',
      'Security deposit refunded after upgrade',
    ],
    cons: [
      'Requires security deposit',
      'Higher APR than unsecured cards',
      'Lower credit limits',
    ],
    fullTermsUrl: 'https://discover.com/secured/terms',
  },

  // Balance Transfer Card
  {
    id: 'cc_citi_simplicity',
    category: 'credit_card',
    provider: {
      name: 'Citi',
      rating: 4.4,
      reviewCount: 6789,
    },
    title: 'Citi Simplicity® Card',
    tagline: '0% intro APR for 21 months on balance transfers',
    description:
      'Longest intro APR period available. Transfer balances and pay no interest for 21 months.',
    benefits: [
      {icon: 'trending-down-outline', text: '0% intro APR for 21 months', highlight: true},
      {icon: 'swap-horizontal-outline', text: '0% on balance transfers for 21 months'},
      {icon: 'close-circle-outline', text: 'No late fees'},
      {icon: 'card-outline', text: 'No annual fee'},
    ],
    creditCard: {
      apr: {
        regular: '18.24% - 28.99%',
        intro: '0% for 21 months',
      },
      fees: {
        annual: 0,
        balanceTransfer: '5% or $5 min',
        lateFee: 0,
      },
      creditLimit: '$3,000 - $20,000',
    },
    eligibility: {
      creditScoreRange: {min: 670, max: 850, label: 'Good - Excellent'},
      requirements: ['Good credit history', 'Existing credit card debt helpful'],
    },
    match: {
      score: 85,
      reasons: [
        'High utilization makes this valuable for consolidation',
        'Long intro period helps pay down debt',
        'No late fees provide flexibility',
      ],
    },
    cta: {
      label: 'Learn More',
      affiliateUrl: 'https://citi.com/simplicity',
      trackingId: 'cc_citi_004',
      requiresHardPull: true,
    },
    featured: false,
    popularityScore: 82,
    estimatedCommission: 120,
    lastUpdated: new Date(),
    pros: [
      'Longest 0% APR period available',
      'No late fees ever',
      'No annual fee',
      'Simple, no-frills design',
    ],
    cons: [
      'No rewards program',
      '5% balance transfer fee',
      'High regular APR after intro period',
    ],
    fullTermsUrl: 'https://citi.com/simplicity/terms',
  },
];

/**
 * Personal Loan Offers
 */
export const personalLoanOffers: FinancialOffer[] = [
  // Low-Rate Personal Loan
  {
    id: 'pl_sofi_personal',
    category: 'personal_loan',
    provider: {
      name: 'SoFi',
      rating: 4.8,
      reviewCount: 15234,
    },
    title: 'SoFi Personal Loan',
    tagline: 'Low rates for qualified borrowers',
    description:
      'Get a personal loan with competitive rates, no fees, and unemployment protection.',
    benefits: [
      {icon: 'trending-down-outline', text: 'Rates from 8.99% APR', highlight: true},
      {icon: 'close-circle-outline', text: 'No origination fees'},
      {icon: 'shield-checkmark-outline', text: 'Unemployment protection included'},
      {icon: 'cash-outline', text: 'Up to $100,000'},
    ],
    badge: 'featured',
    loan: {
      minAmount: 5000,
      maxAmount: 100000,
      terms: ['2 years', '3 years', '5 years', '7 years'],
      apr: {
        regular: '8.99% - 25.81%',
      },
      origination: 0,
    },
    eligibility: {
      creditScoreRange: {min: 680, max: 850, label: 'Good - Excellent'},
      requirements: [
        'Minimum income $45,000',
        'Employed or with job offer',
        'U.S. citizen or permanent resident',
      ],
    },
    match: {
      score: 89,
      reasons: [
        'Your credit score qualifies for lower rates',
        'Income meets minimum requirements',
        'No origination fee saves $500+',
      ],
    },
    cta: {
      label: 'Check Your Rate',
      affiliateUrl: 'https://sofi.com/personal-loan',
      trackingId: 'pl_sofi_001',
      requiresHardPull: false, // Soft pull for rate check
    },
    featured: true,
    popularityScore: 93,
    estimatedCommission: 250,
    lastUpdated: new Date(),
    pros: [
      'No origination or application fees',
      'Unemployment protection at no extra cost',
      'Same-day funding available',
      'Rate discount for autopay',
      'Member benefits and career coaching',
    ],
    cons: [
      'Higher minimum credit score requirement',
      'Income requirements exclude some borrowers',
      'No co-applicant option',
    ],
    fullTermsUrl: 'https://sofi.com/personal-loan/terms',
  },

  // Debt Consolidation Loan
  {
    id: 'pl_marcus_debt_consolidation',
    category: 'personal_loan',
    provider: {
      name: 'Marcus by Goldman Sachs',
      rating: 4.7,
      reviewCount: 9823,
    },
    title: 'Marcus Debt Consolidation Loan',
    tagline: 'Consolidate debt with no fees',
    description:
      'Simplify multiple debts into one monthly payment with no fees and flexible payment options.',
    benefits: [
      {icon: 'swap-horizontal-outline', text: 'Consolidate multiple debts', highlight: true},
      {icon: 'close-circle-outline', text: 'No fees whatsoever'},
      {icon: 'calendar-outline', text: 'Flexible payment dates'},
      {icon: 'cash-outline', text: 'Up to $40,000'},
    ],
    loan: {
      minAmount: 3500,
      maxAmount: 40000,
      terms: ['3 years', '4 years', '5 years', '6 years'],
      apr: {
        regular: '7.99% - 23.99%',
      },
      origination: 0,
    },
    eligibility: {
      creditScoreRange: {min: 660, max: 850, label: 'Good - Excellent'},
      requirements: ['Minimum income $40,000', 'Debt-to-income ratio below 40%'],
    },
    match: {
      score: 91,
      reasons: [
        'Perfect for consolidating high-interest credit card debt',
        'Your credit card balances make you ideal candidate',
        'No fees mean all money goes to principal',
      ],
    },
    cta: {
      label: 'View Rates',
      affiliateUrl: 'https://marcus.com/debt-consolidation',
      trackingId: 'pl_marcus_002',
      requiresHardPull: false,
    },
    featured: false,
    popularityScore: 88,
    estimatedCommission: 200,
    lastUpdated: new Date(),
    pros: [
      'Absolutely no fees of any kind',
      'On-time payment rewards (reduce rate)',
      'Flexible payment date selection',
      'No prepayment penalties',
    ],
    cons: [
      'Lower maximum loan amount than competitors',
      'Funding can take up to 4 business days',
      'Limited customer service hours',
    ],
    fullTermsUrl: 'https://marcus.com/debt-consolidation/terms',
  },
];

/**
 * Savings Account Offers
 */
export const savingsAccountOffers: FinancialOffer[] = [
  // High-Yield Savings
  {
    id: 'sa_ally_savings',
    category: 'savings_account',
    provider: {
      name: 'Ally Bank',
      rating: 4.7,
      reviewCount: 23456,
    },
    title: 'Ally Online Savings Account',
    tagline: 'Earn 4.35% APY with no monthly fees',
    description:
      'Grow your money with competitive rates, no minimum balance, and 24/7 customer support.',
    benefits: [
      {icon: 'trending-up-outline', text: '4.35% APY', highlight: true},
      {icon: 'close-circle-outline', text: 'No monthly maintenance fees'},
      {icon: 'cash-outline', text: 'No minimum balance required'},
      {icon: 'call-outline', text: '24/7 customer support'},
    ],
    badge: 'featured',
    bankAccount: {
      apy: '4.35%',
      minBalance: 0,
      monthlyFee: 0,
      mobileCheck: true,
    },
    eligibility: {
      creditScoreRange: {min: 0, max: 850, label: 'No credit check required'},
      requirements: ['U.S. resident', 'Valid SSN or ITIN', 'Age 18 or older'],
    },
    match: {
      score: 95,
      reasons: [
        'High APY helps money grow faster',
        'No fees means every dollar works for you',
        'No minimum balance makes it accessible',
      ],
    },
    cta: {
      label: 'Open Account',
      affiliateUrl: 'https://ally.com/savings',
      trackingId: 'sa_ally_001',
      requiresHardPull: false,
    },
    featured: true,
    popularityScore: 96,
    estimatedCommission: 50,
    lastUpdated: new Date(),
    pros: [
      'Top-tier interest rates',
      'No fees or minimum balance',
      'FDIC insured up to $250,000',
      'Easy transfers and mobile app',
      'Excellent customer service ratings',
    ],
    cons: [
      'No physical branches',
      'Limited cash deposit options',
      'APY can change based on Fed rates',
    ],
    fullTermsUrl: 'https://ally.com/savings/terms',
  },
];

/**
 * Checking Account Offers
 */
export const checkingAccountOffers: FinancialOffer[] = [
  // No-Fee Checking
  {
    id: 'ca_chime_checking',
    category: 'checking_account',
    provider: {
      name: 'Chime',
      rating: 4.6,
      reviewCount: 18765,
    },
    title: 'Chime® Checking Account',
    tagline: 'No monthly fees, get paid up to 2 days early',
    description:
      'Modern banking with no hidden fees, early direct deposit, and automatic savings features.',
    benefits: [
      {icon: 'time-outline', text: 'Get paid up to 2 days early', highlight: true},
      {icon: 'close-circle-outline', text: 'No monthly fees or overdraft fees'},
      {icon: 'cash-outline', text: 'Fee-free overdraft up to $200'},
      {icon: 'card-outline', text: 'Visa debit card included'},
    ],
    badge: 'popular',
    bankAccount: {
      minBalance: 0,
      monthlyFee: 0,
      atmNetwork: '60,000+ fee-free ATMs',
      mobileCheck: true,
      overdraftProtection: true,
    },
    eligibility: {
      creditScoreRange: {min: 0, max: 850, label: 'No credit check required'},
      requirements: ['U.S. resident', 'Age 18 or older', 'Valid email and phone number'],
    },
    match: {
      score: 88,
      reasons: [
        'No fees align with your financial goals',
        'Early direct deposit helps with cash flow',
        'Fee-free overdraft provides safety net',
      ],
    },
    cta: {
      label: 'Get Started',
      affiliateUrl: 'https://chime.com/checking',
      trackingId: 'ca_chime_001',
      requiresHardPull: false,
    },
    featured: false,
    popularityScore: 91,
    estimatedCommission: 75,
    lastUpdated: new Date(),
    pros: [
      'No monthly fees whatsoever',
      'Early direct deposit feature',
      'SpotMe overdraft protection up to $200',
      'Automatic savings features',
      'Large fee-free ATM network',
    ],
    cons: [
      'No physical branches',
      'Limited cash deposit options',
      'No joint accounts available',
    ],
    fullTermsUrl: 'https://chime.com/checking/terms',
  },
];

/**
 * Combined array of all offers
 */
export const allFinancialOffers: FinancialOffer[] = [
  ...creditCardOffers,
  ...personalLoanOffers,
  ...savingsAccountOffers,
  ...checkingAccountOffers,
];

/**
 * Featured offers (for banners and dashboard)
 */
export const featuredOffers: FinancialOffer[] = allFinancialOffers.filter((offer) => offer.featured);

/**
 * Default user offer preferences
 */
export const defaultOfferPreferences: OfferPreferences = {
  userId: 'user_123456',
  showOffers: true,
  showBanners: true,
  enabledCategories: [
    'credit_card',
    'personal_loan',
    'savings_account',
    'checking_account',
    'mortgage',
    'auto_loan',
  ],
  emailOffers: false,
  dismissedOffers: [],
  updatedAt: new Date(),
};

/**
 * Get offers by category
 */
export const getOffersByCategory = (category: string): FinancialOffer[] => {
  return allFinancialOffers.filter((offer) => offer.category === category);
};

/**
 * Get offers by minimum credit score
 */
export const getOffersByMinCreditScore = (creditScore: number): FinancialOffer[] => {
  return allFinancialOffers.filter(
    (offer) =>
      creditScore >= offer.eligibility.creditScoreRange.min &&
      creditScore <= offer.eligibility.creditScoreRange.max,
  );
};

/**
 * Sort offers by match score (relevance)
 */
export const sortOffersByRelevance = (offers: FinancialOffer[]): FinancialOffer[] => {
  return [...offers].sort((a, b) => b.match.score - a.match.score);
};

/**
 * Sort offers by popularity
 */
export const sortOffersByPopularity = (offers: FinancialOffer[]): FinancialOffer[] => {
  return [...offers].sort((a, b) => b.popularityScore - a.popularityScore);
};
