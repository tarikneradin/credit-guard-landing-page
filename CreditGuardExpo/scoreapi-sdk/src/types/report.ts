/**
 * Credit report types
 */

export interface CreditReport {
  reportId: string;
  reportDate: string;
  personalInfo?: PersonalInfo;
  accounts?: Account[];
  inquiries?: Inquiry[];
  publicRecords?: PublicRecord[];
  collections?: Collection[];
  summary?: ReportSummary;
}

export interface PersonalInfo {
  name: string;
  address: string;
  ssn?: string;
  dateOfBirth?: string;
}

export interface Account {
  accountId: string;
  creditorName: string;
  accountType: string;
  balance: number;
  creditLimit?: number;
  paymentStatus: string;
  openDate?: string;
  lastPaymentDate?: string;
}

export interface Inquiry {
  inquiryId: string;
  creditorName: string;
  inquiryDate: string;
  inquiryType: string;
}

export interface PublicRecord {
  recordId: string;
  type: string;
  status: string;
  filingDate?: string;
  amount?: number;
}

export interface Collection {
  collectionId: string;
  creditorName: string;
  amount: number;
  status: string;
  reportedDate?: string;
}

export interface ReportSummary {
  totalAccounts: number;
  openAccounts: number;
  closedAccounts: number;
  derogatory: number;
  totalBalance: number;
  totalCreditLimit: number;
  utilization: number;
}

export interface LatestReportResponse {
  report: CreditReport;
  cached: boolean;
  refreshDate?: string;
}

export interface ReportSummaryResponse {
  summary: ReportSummary;
  reportDate: string;
}
