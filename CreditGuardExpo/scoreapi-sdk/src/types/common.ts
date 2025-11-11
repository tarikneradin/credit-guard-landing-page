/**
 * Common types used across the SDK
 */

export interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
}

export interface ConfigFlags {
  flags: number;
  dataAccess?: boolean;
  realtimeAlerts?: boolean;
  scores?: boolean;
  reports?: boolean;
}

export interface PageableResponse<T> {
  content: T[];
  totalElements: number;
  hasNext: boolean;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ErrorResponse {
  code: string;
  message: string;
  details?: any;
}
