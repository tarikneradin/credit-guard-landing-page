/**
 * Report Module
 * Handles credit report operations
 */

import { HttpClient } from '../client';
import {
  LatestReportResponse,
  ReportSummaryResponse,
} from '../types/report';

export class ReportModule {
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  /**
   * Get latest credit report
   */
  async getLatestReport(): Promise<LatestReportResponse> {
    return await this.http.get<LatestReportResponse>('/users/efx-latest-report');
  }

  /**
   * Get latest credit report summary
   */
  async getLatestReportSummary(): Promise<ReportSummaryResponse> {
    return await this.http.get<ReportSummaryResponse>('/users/efx-latest-report/summary');
  }
}
