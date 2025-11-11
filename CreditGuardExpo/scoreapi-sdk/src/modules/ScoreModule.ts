/**
 * Score Module
 * Handles credit score operations
 */

import { HttpClient } from '../client';
import {
  LatestScoresResponse,
  ScoreHistory,
  ScoreProjectionRequest,
  ScoreProjectionResponse,
  EquifaxConfig,
} from '../types/score';

export class ScoreModule {
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  /**
   * Get latest credit scores
   */
  async getLatestScores(): Promise<LatestScoresResponse> {
    return await this.http.get<LatestScoresResponse>('/users/efx-latest-scores');
  }

  /**
   * Get credit score history
   */
  async getScoreHistory(): Promise<ScoreHistory> {
    return await this.http.get<ScoreHistory>('/users/efx-score-history');
  }

  /**
   * Get score projection (what-if scenario)
   */
  async getScoreProjection(request: ScoreProjectionRequest): Promise<ScoreProjectionResponse> {
    return await this.http.get<ScoreProjectionResponse>('/users/efx-score-up', {
      params: {
        scoreInc: request.scoreIncrease,
        timeHorizon: request.timeHorizon,
      },
    });
  }

  /**
   * Get Equifax configuration and enrolled features
   */
  async getEquifaxConfig(): Promise<EquifaxConfig> {
    return await this.http.get<EquifaxConfig>('/users/efx-config');
  }
}
