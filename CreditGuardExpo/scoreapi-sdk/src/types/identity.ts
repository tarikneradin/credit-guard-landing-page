/**
 * Identity verification types (DIT and SMFA only)
 */

import { Address } from './common';

export interface IdentitySubmissionRequest {
  firstName: string;
  lastName: string;
  ssn: string;
  dateOfBirth: string; // Format: YYYY-MM-DD
  address: Address;
}

export interface IdentitySubmissionResponse {
  user: any; // User profile after identity submission
  enrollmentStatus?: string;
  thinFile?: boolean;
}

// DIT (Digital Identity Trust) types
export interface DITChallengeResponse {
  transactionId: string;
  challenge: any;
  status: string;
}

export interface DITVerificationRequest {
  challengeResponse: any;
}

export interface DITVerificationResponse {
  verified: boolean;
  smfaToken?: string;
  status: string;
  transactionId?: string;
}

// SMFA (Secure Mobile Financial Authentication) types
export interface SMFASendLinkRequest {
  token: string;
  type?: 'phone' | 'email';
}

export interface SMFASendLinkResponse {
  authUrl: string;
  linkToken: string;
  message: string;
}

export interface SMFAVerifyStatusRequest {
  token: string;
}

export interface SMFAVerifyStatusResponse {
  verified: boolean;
  completed: boolean;
  user?: any;
  enrollmentId?: string;
  status: string;
}
