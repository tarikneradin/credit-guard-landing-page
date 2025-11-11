import apiClient from '../client';
import {CreditScore, ScoreHistory, CreditReportSummary, ApiResponse} from '../../types';

export const creditService = {
  // Get latest credit score
  getLatestScore: async (): Promise<CreditScore> => {
    const response = await apiClient.get<ApiResponse<CreditScore>>('/users/efx-latest-scores');
    return response.data.data;
  },

  // Get credit score history
  getScoreHistory: async (): Promise<ScoreHistory[]> => {
    const response = await apiClient.get<ApiResponse<ScoreHistory[]>>('/users/efx-score-history');
    return response.data.data;
  },

  // Get credit report summary
  getReportSummary: async (): Promise<CreditReportSummary> => {
    const response = await apiClient.get<ApiResponse<CreditReportSummary>>(
      '/users/efx-latest-report/summary',
    );
    return response.data.data;
  },

  // Get full credit report
  getFullReport: async (): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>('/users/efx-latest-report');
    return response.data.data;
  },

  // Get monitoring alerts
  getAlerts: async (): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>('/users/efx-alerts');

    // Log the full response structure for debugging
    console.log('=== ALERTS FULL API RESPONSE ===');
    console.log('response:', JSON.stringify(response, null, 2));
    console.log('response.data:', JSON.stringify(response.data, null, 2));
    console.log('=== END FULL API RESPONSE ===');

    // Handle both response.data.data and response.data structures
    if (response.data?.data) {
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      return response.data;
    } else {
      return [];
    }
  },

  // Get score improvement suggestions
  getScoreUpSuggestions: async (
    scoreIncrease: number = 10,
    timeHorizon: number = 6,
  ): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>('/users/efx-score-up', {
      params: {scoreInc: scoreIncrease, timeHorizon},
    });
    return response.data.data;
  },

  // Request credit report refresh
  refreshCreditReport: async (): Promise<any> => {
    const response = await apiClient.post<ApiResponse<any>>('/users/refresh-credit-report');
    return response.data.data;
  },
};

export default creditService;
