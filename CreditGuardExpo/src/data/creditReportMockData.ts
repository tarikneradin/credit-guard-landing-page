import {PersonalInfo, CreditAlert, PublicRecord} from '../types';

// Mock Personal Information
export const mockPersonalInfo: PersonalInfo = {
  fullName: 'John Michael Doe',
  dateOfBirth: '1985-03-15',
  ssn: '***-**-4321',
  address: {
    street: '123 Main Street, Apt 4B',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    country: 'US',
  },
  previousAddresses: [
    {
      street: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'US',
    },
    {
      street: '789 Pine Road',
      city: 'San Diego',
      state: 'CA',
      zipCode: '92101',
      country: 'US',
    },
  ],
  phone: '(555) 123-4567',
  email: 'john.doe@example.com',
  employmentInfo: {
    employer: 'Tech Solutions Inc.',
    position: 'Senior Software Engineer',
    yearsEmployed: 3,
  },
};

// Mock Credit Alerts - Items that appear on actual credit reports
// These are changes reported by creditors, bureaus, or on the credit file itself
// NOT monitoring alerts (those are a separate feature)
export const mockCreditAlerts: CreditAlert[] = [
  {
    id: 'alert_001',
    type: 'new_account',
    severity: 'info',
    title: 'New Account Opened',
    description: 'Chase Sapphire Preferred credit card - Account opened Jan 15, 2025. Initial credit limit: $7,500. Reported by: Chase Bank.',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    actionRequired: false,
  },
  {
    id: 'alert_002',
    type: 'hard_inquiry',
    severity: 'info',
    title: 'Hard Inquiry Posted',
    description: 'Wells Fargo Bank - Hard inquiry posted on Jan 10, 2025. Purpose: Credit Card Application. Will remain on report for 24 months.',
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionRequired: false,
  },
  {
    id: 'alert_003',
    type: 'credit_limit_change',
    severity: 'info',
    title: 'Credit Limit Increased',
    description: 'Capital One Venture - Credit limit increased from $8,000 to $12,000 on Dec 20, 2024. Reported by creditor.',
    date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionRequired: false,
  },
  {
    id: 'alert_004',
    type: 'payment_missed',
    severity: 'critical',
    title: 'Late Payment Reported',
    description: 'Discover Card - Payment 30+ days past due reported on Dec 15, 2024. This negative mark will remain on your credit report for 7 years.',
    date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionRequired: true,
  },
  {
    id: 'alert_005',
    type: 'new_account',
    severity: 'info',
    title: 'Account Status Changed',
    description: 'Best Buy Credit Card - Account status changed from "Open" to "Closed" on Nov 28, 2024. Closed by consumer request.',
    date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionRequired: false,
  },
  {
    id: 'alert_006',
    type: 'suspicious_activity',
    severity: 'info',
    title: 'Address Updated',
    description: 'Personal information updated - New address added to credit file: 123 Main St, San Francisco, CA 94102. Reported by: Chase Bank.',
    date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionRequired: false,
  },
  {
    id: 'alert_007',
    type: 'credit_limit_change',
    severity: 'warning',
    title: 'Credit Limit Decreased',
    description: 'Bank of America Cash Rewards - Credit limit decreased from $10,000 to $7,500 on Nov 20, 2024. Reason: Account review by creditor.',
    date: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionRequired: false,
  },
  {
    id: 'alert_008',
    type: 'hard_inquiry',
    severity: 'info',
    title: 'Hard Inquiry Posted',
    description: 'Toyota Financial Services - Hard inquiry posted on Oct 15, 2024. Purpose: Auto Loan Application.',
    date: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionRequired: false,
  },
  {
    id: 'alert_009',
    type: 'new_account',
    severity: 'info',
    title: 'Employment Information Updated',
    description: 'Employment updated on credit file - Employer: Tech Solutions Inc., Position: Senior Software Engineer. Reported by: Experian.',
    date: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionRequired: false,
  },
];

// Mock Public Records - Examples of what can appear on credit reports
// For good credit standing, use empty array
export const mockPublicRecords: PublicRecord[] = [
  {
    id: 'pr_001',
    type: 'collection',
    status: 'satisfied',
    filingDate: '2022-03-10',
    amount: 1250,
    description: 'Medical Services - Community Hospital. Collection account paid in full and closed.',
    expectedRemovalDate: '2029-03-10',
  },
];

// Alternative: Clean credit with no public records
export const mockPublicRecordsClean: PublicRecord[] = [];

// Alternative: More severe public records (for testing different scenarios)
export const mockPublicRecordsWithSevere: PublicRecord[] = [
  {
    id: 'pr_001',
    type: 'bankruptcy',
    status: 'dismissed',
    filingDate: '2019-08-15',
    court: 'U.S. Bankruptcy Court - Northern District',
    caseNumber: 'BK-19-12345',
    description: 'Chapter 7 Bankruptcy - Dismissed after successful completion of payment plan.',
    expectedRemovalDate: '2029-08-15',
  },
  {
    id: 'pr_002',
    type: 'tax_lien',
    status: 'satisfied',
    filingDate: '2020-11-20',
    amount: 5400,
    court: 'County Tax Assessor Office',
    caseNumber: 'TL-2020-8901',
    description: 'State tax lien for unpaid income taxes - Paid in full on March 2021.',
    expectedRemovalDate: '2027-11-20',
  },
  {
    id: 'pr_003',
    type: 'civil_judgment',
    status: 'active',
    filingDate: '2023-06-05',
    amount: 3200,
    court: 'Superior Court of California',
    caseNumber: 'CV-23-45678',
    description: 'Civil judgment for breach of contract - Payment plan in progress.',
    expectedRemovalDate: '2030-06-05',
  },
];
