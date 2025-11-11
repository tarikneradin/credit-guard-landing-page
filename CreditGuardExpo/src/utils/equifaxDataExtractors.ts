/* eslint-disable @typescript-eslint/no-explicit-any */
import {Bureau} from '../components/common/BureauDropdown';

/**
 * Map bureau names to provider codes
 */
const getBureauToProviderMap = (): Record<Exclude<Bureau, 'all'>, string> => {
  return {
    equifax: 'EFX',
    transunion: 'TU',
    experian: 'EXP',
  };
};

/**
 * Filter provider views based on selected bureau
 */
const filterProviderViews = (providerViews: any[], selectedBureau?: Bureau): any[] => {
  if (!selectedBureau || selectedBureau === 'all') {
    return providerViews;
  }

  const bureauToProvider = getBureauToProviderMap();
  const providerCode = bureauToProvider[selectedBureau];
  return providerViews.filter((pv: any) => pv.provider === providerCode);
};

/**
 * Flatten Equifax API account structure with optional bureau filtering
 */
export const flattenEquifaxAccounts = (fullReport: any, selectedBureau?: Bureau): any[] => {
  if (!fullReport) {
    return [];
  }

  // The actual API structure uses 'providerViews' not 'creditReports'
  if (!fullReport.providerViews) {
    return [];
  }

  if (!Array.isArray(fullReport.providerViews)) {
    return [];
  }

  const providerViewsToProcess = filterProviderViews(fullReport.providerViews, selectedBureau);

  const allAccounts: any[] = [];

  // Iterate through filtered provider views (different bureaus)
  providerViewsToProcess.forEach((providerView: any) => {
    // Add revolving accounts (credit cards)
    if (providerView.revolvingAccounts) {
      allAccounts.push(...providerView.revolvingAccounts);
    }

    // Add mortgage accounts
    if (providerView.mortgageAccounts) {
      allAccounts.push(...providerView.mortgageAccounts);
    }

    // Add installment accounts (personal loans, auto loans, etc.)
    if (providerView.installmentAccounts) {
      allAccounts.push(...providerView.installmentAccounts);
    }
  });

  return allAccounts;
};

/**
 * Flatten Equifax API inquiry structure with optional bureau filtering
 */
export const flattenEquifaxInquiries = (fullReport: any, selectedBureau?: Bureau): any[] => {
  if (!fullReport || !Array.isArray(fullReport.providerViews)) {
    return [];
  }

  const providerViewsToProcess = filterProviderViews(fullReport.providerViews, selectedBureau);

  const allInquiries: any[] = [];

  // Iterate through filtered provider views (different bureaus)
  providerViewsToProcess.forEach((providerView: any) => {
    if (providerView.inquiries) {
      allInquiries.push(...providerView.inquiries);
    }
  });

  return allInquiries;
};

/**
 * Extract personal info from Equifax API with optional bureau filtering
 */
export const extractEquifaxPersonalInfo = (fullReport: any, selectedBureau?: Bureau): any => {
  if (!fullReport) {
    return null;
  }

  // Check if we have providerViews array
  if (!fullReport.providerViews || !Array.isArray(fullReport.providerViews)) {
    return null;
  }

  // Filter provider views based on selected bureau
  let providerViewsToProcess = fullReport.providerViews;
  if (selectedBureau && selectedBureau !== 'all') {
    providerViewsToProcess = filterProviderViews(fullReport.providerViews, selectedBureau);
  }

  // Get personal info from the first matching provider view (or combined if 'all')
  let combinedPersonalInfo: any = null;

  for (let i = 0; i < providerViewsToProcess.length; i++) {
    const providerView = providerViewsToProcess[i];

    if (providerView.summary && providerView.summary.subject) {
      if (!combinedPersonalInfo) {
        combinedPersonalInfo = {...providerView.summary.subject};
      } else {
        // Merge additional data from other bureaus (only when 'all' is selected)
        // Use hasOwnProperty to check for dateOfBirth since it could be 0 or negative (dates before 1970)
        if (
          'dateOfBirth' in providerView.summary.subject &&
          !('dateOfBirth' in combinedPersonalInfo)
        ) {
          combinedPersonalInfo.dateOfBirth = providerView.summary.subject.dateOfBirth;
        }
        if (
          providerView.summary.subject.previousAddresses &&
          !combinedPersonalInfo.previousAddresses
        ) {
          combinedPersonalInfo.previousAddresses = providerView.summary.subject.previousAddresses;
        }
        if (providerView.summary.subject.currentAddress && !combinedPersonalInfo.currentAddress) {
          combinedPersonalInfo.currentAddress = providerView.summary.subject.currentAddress;
        }
        // Note: employmentHistory is NOT merged - each provider shows only its own data
      }
    }
  }

  if (combinedPersonalInfo) {
    return combinedPersonalInfo;
  }

  // Fallback: Check for legacy personalInfo structure
  if (fullReport.personalInfo) {
    return fullReport.personalInfo;
  }

  return null;
};

/**
 * Flatten Equifax API public records with optional bureau filtering
 */
export const flattenEquifaxPublicRecords = (fullReport: any, selectedBureau?: Bureau): any[] => {
  if (!fullReport || !Array.isArray(fullReport.providerViews)) {
    return [];
  }

  const providerViewsToProcess = filterProviderViews(fullReport.providerViews, selectedBureau);

  const allPublicRecords: any[] = [];

  providerViewsToProcess.forEach((providerView: any) => {
    // Public records can be in different sections
    if (providerView.publicRecords) {
      allPublicRecords.push(...providerView.publicRecords);
    }

    // Bankruptcies
    if (providerView.bankruptcies && Array.isArray(providerView.bankruptcies)) {
      allPublicRecords.push(...providerView.bankruptcies);
    }

    // Liens
    if (providerView.liens && Array.isArray(providerView.liens)) {
      allPublicRecords.push(...providerView.liens);
    }

    // Judgments
    if (providerView.judgments && Array.isArray(providerView.judgments)) {
      allPublicRecords.push(...providerView.judgments);
    }

    // Collections - Note: Collections are handled separately now
    // if (providerView.collections) {
    //   allPublicRecords.push(...providerView.collections);
    // }
  });

  return allPublicRecords;
};

/**
 * Flatten Equifax API collections with optional bureau filtering
 */
export const flattenEquifaxCollections = (fullReport: any, selectedBureau?: Bureau): any[] => {
  if (!fullReport || !Array.isArray(fullReport.providerViews)) {
    return [];
  }

  const providerViewsToProcess = filterProviderViews(fullReport.providerViews, selectedBureau);

  const allCollections: any[] = [];

  providerViewsToProcess.forEach((providerView: any) => {
    // Collections
    if (providerView.collections) {
      allCollections.push(...providerView.collections);
    }
  });

  return allCollections;
};
