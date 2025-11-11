/**
 * Identity Module
 * Handles identity verification (DIT and SMFA only)
 */

import { HttpClient } from '../client';
import {
  IdentitySubmissionRequest,
  IdentitySubmissionResponse,
  DITChallengeResponse,
  DITVerificationRequest,
  DITVerificationResponse,
  SMFASendLinkRequest,
  SMFASendLinkResponse,
  SMFAVerifyStatusRequest,
  SMFAVerifyStatusResponse,
} from '../types/identity';

export class IdentityModule {
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  /**
   * Submit user identity information
   */
  async submitIdentity(request: IdentitySubmissionRequest): Promise<IdentitySubmissionResponse> {
    return await this.http.post<IdentitySubmissionResponse>('/users/identity', request);
  }

  /**
   * Get DIT verification challenge
   */
  async getDITChallenge(): Promise<DITChallengeResponse> {
    return await this.http.get<DITChallengeResponse>('/users/dit-identity');
  }

  /**
   * Submit DIT verification response
   */
  async submitDITVerification(request: DITVerificationRequest): Promise<DITVerificationResponse> {
    return await this.http.post<DITVerificationResponse>('/users/dit-identity', request);
  }

  /**
   * Send SMFA verification link via SMS
   */
  async sendSMFALink(token: string, type: 'phone' | 'email' = 'phone'): Promise<SMFASendLinkResponse> {
    return await this.http.post<SMFASendLinkResponse>(
      `/users/smfa-send-link/${token}`,
      { type }
    );
  }

  /**
   * Verify SMFA completion status
   */
  async verifySMFAStatus(token: string): Promise<SMFAVerifyStatusResponse> {
    return await this.http.post<SMFAVerifyStatusResponse>(
      `/users/smfa-verify-status/${token}`
    );
  }
}
