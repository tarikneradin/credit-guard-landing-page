/**
 * User Module
 * Handles user profile management
 */

import { HttpClient } from '../client';
import {
  User,
  UpdateEmailRequest,
  UpdatePasswordRequest,
  UpdateNotificationsRequest,
  UpdateRecoveryQuestionRequest,
  CloseAccountResponse,
  UserInitializeResponse,
} from '../types/user';

export class UserModule {
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    return await this.http.get<User>('/users');
  }

  /**
   * Initialize user interface configuration
   */
  async initialize(key?: string): Promise<UserInitializeResponse> {
    const endpoint = key ? `/users/initialize/${key}` : '/users/initialize';
    return await this.http.get<UserInitializeResponse>(endpoint, { skipAuth: true });
  }

  /**
   * Update user email
   */
  async updateEmail(email: string): Promise<void> {
    await this.http.post('/users/change-email', { email });
  }

  /**
   * Update user password
   */
  async updatePassword(request: UpdatePasswordRequest): Promise<void> {
    await this.http.post('/users/change-password', request);
  }

  /**
   * Update notification preferences
   */
  async updateNotifications(request: UpdateNotificationsRequest): Promise<void> {
    await this.http.post('/users/change-notifications', request);
  }

  /**
   * Update recovery question
   */
  async updateRecoveryQuestion(request: UpdateRecoveryQuestionRequest): Promise<void> {
    await this.http.post('/users/change-recovery', request);
  }

  /**
   * Close user account
   */
  async closeAccount(): Promise<CloseAccountResponse> {
    return await this.http.post<CloseAccountResponse>('/users/close-account');
  }
}
