/**
 * Credit score types
 */

export interface CreditScore {
  score: number;
  vantageScore?: number;
  vantageScore3?: number;
  scoreName?: string;
  scoreDate?: string;
  factors?: ScoreFactor[];
}

export interface ScoreFactor {
  code: string;
  description: string;
  rank: number;
}

export interface ScoreHistory {
  scores: HistoricalScore[];
  trend?: 'up' | 'down' | 'stable';
}

export interface HistoricalScore {
  score: number;
  date: string;
  vantageScore?: number;
}

export interface ScoreProjectionRequest {
  scoreIncrease: number;
  timeHorizon: number; // in months
}

export interface ScoreProjectionResponse {
  currentScore: number;
  projectedScore: number;
  timeHorizon: number;
  factors?: any[];
  recommendations?: string[];
}

export interface EquifaxConfig {
  enrollmentId?: string;
  features: {
    scores: boolean;
    reports: boolean;
    alerts: boolean;
    dataAccess: boolean;
  };
  enrolled: boolean;
}

export interface LatestScoresResponse {
  vantageScore3?: number;
  score?: number;
  scoreDate?: string;
  factors?: ScoreFactor[];
}
