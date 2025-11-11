/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios';

const EQUIFAX_API_URL = 'https://efx-dev.stitchcredit.com/api';

// Equifax API Endpoints
const EQUIFAX_ENDPOINTS = {
  LATEST_SCORES: '/users/efx-latest-scores',
  SCORE_HISTORY: '/users/efx-score-history',
  LATEST_REPORT: '/users/efx-latest-report',
  REPORT_SUMMARY: '/users/efx-latest-report/summary',
  PREAUTH_TOKEN: '/users/preauth-token', // Used with /{paToken} parameter
} as const;

// Equifax API Response Types
export interface ScoreRange {
  low: number;
  high: number;
  name: string;
}

export interface ScoreReason {
  code: string;
  description: string;
  creditScoreFactorEffect: 'HURTING' | 'HELPING' | 'NEUTRAL';
}

export interface ProviderView {
  provider: string; // e.g., "EFX", "TU", "XPN"
  score: number;
  scoreRanges: ScoreRange[];
  loanRiskRanges: ScoreRange[];
  scoreReasons: ScoreReason[];
}

export interface EquifaxScoreResponse {
  providerViews: ProviderView[];
  id: string;
  scoreType: string;
  scoreModel: string;
  generatedDate: number;
}

// Legacy type for backward compatibility
export interface EquifaxScore {
  score: number;
  scoreDate: string;
  bureau: string;
  scoreRange?: {
    min: number;
    max: number;
  };
}

// Response format from /efx-score-history endpoint
export interface EquifaxScoreHistoryResponse {
  generatedDate: number; // timestamp
  scoreType: string;
  id: string;
  scoreModel: string;
  providerViews: {
    score: number;
    provider: string; // e.g., "EFX", "TU", "EXP"
  }[];
}

// Our internal format after transformation
export interface EquifaxScoreHistory {
  date: string;
  score: number;
  bureau: string;
}

export interface EquifaxReportSummary {
  accounts?: any[];
  inquiries?: any[];
  totalAccounts: number;
  openAccounts: number;
  totalBalance: number;
  totalCreditLimit: number;
  utilizationRate: number;
  averageAccountAge: number;
  paymentHistory: {
    onTimePercentage: number;
    totalPayments: number;
    latePayments: number;
  };
}

export interface EquifaxFullReport {
  personalInfo: any;
  accounts: any[];
  inquiries: any[];
  publicRecords: any[];
  summary: EquifaxReportSummary;
}

export class EquifaxService {
  private userToken: string | null = null;

  /**
   * Set the Equifax user token
   */
  setUserToken(token: string) {
    this.userToken = token;
  }

  /**
   * Get authorization header
   */
  private getAuthHeader() {
    if (!this.userToken) {
      throw new Error('Equifax user token not set. Please authenticate first.');
    }
    return {
      Authorization: `Bearer ${this.userToken}`,
    };
  }

  /**
   * Get latest credit scores (returns full response with all bureaus)
   */
  async getLatestScores(): Promise<EquifaxScoreResponse> {
    try {
      const response = await axios.get<EquifaxScoreResponse>(
        `${EQUIFAX_API_URL}${EQUIFAX_ENDPOINTS.LATEST_SCORES}`,
        {
          headers: this.getAuthHeader(),
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get score for a specific bureau from the response
   */
  getScoreByBureau(
    scoreResponse: EquifaxScoreResponse,
    bureau: 'equifax' | 'transunion' | 'experian',
  ): ProviderView | null {
    // Multiple possible codes for each bureau
    const bureauMaps = {
      equifax: ['EFX', 'EQUIFAX', 'EQ'],
      transunion: ['TU', 'TRANSUNION', 'TUC'],
      experian: ['XPN', 'EXPERIAN', 'EXP', 'XP'],
    };

    const possibleCodes = bureauMaps[bureau];

    // Try to find a match with any of the possible codes
    const result =
      scoreResponse.providerViews.find(view =>
        possibleCodes.some(code => view.provider.toUpperCase() === code.toUpperCase()),
      ) || null;

    return result;
  }

  /**
   * Get credit score history
   */
  async getScoreHistory(): Promise<EquifaxScoreHistoryResponse[]> {
    try {
      const response = await axios.get<EquifaxScoreHistoryResponse[]>(
        `${EQUIFAX_API_URL}${EQUIFAX_ENDPOINTS.SCORE_HISTORY}`,
        {
          headers: this.getAuthHeader(),
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get latest credit report
   */
  async getLatestReport(): Promise<EquifaxFullReport> {
    try {
      const response = await axios.get<EquifaxFullReport>(
        `${EQUIFAX_API_URL}${EQUIFAX_ENDPOINTS.LATEST_REPORT}`,
        {
          headers: this.getAuthHeader(),
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get credit report summary
   */
  async getReportSummary(): Promise<EquifaxReportSummary> {
    try {
      const response = await axios.get<EquifaxReportSummary>(
        `${EQUIFAX_API_URL}${EQUIFAX_ENDPOINTS.REPORT_SUMMARY}`,
        {
          headers: this.getAuthHeader(),
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Clear the user token
   */
  clearToken() {
    this.userToken = null;
  }
}

// Singleton instance
export const equifaxService = new EquifaxService();
