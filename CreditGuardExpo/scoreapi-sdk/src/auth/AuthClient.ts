/**
 * Authentication Client
 * Handles user and customer authentication
 */

import { HttpClient } from '../client';
import { TokenManager } from './TokenManager';
import {
  UserLoginRequest,
  CustomerLoginRequest,
  DirectLoginRequest,
  RegisterRequest,
  UserLoginResponse,
  CustomerLoginResponse,
  DirectLoginResponse,
  TokenRefreshResponse,
  PasswordRecoveryRequest,
  PasswordResetRequest,
} from '../types/auth';

export class AuthClient {
  private http: HttpClient;
  private tokenManager: TokenManager;

  constructor(http: HttpClient, tokenManager: TokenManager) {
    this.http = http;
    this.tokenManager = tokenManager;
  }

  /**
   * User login with username/password
   */
  async userLogin(request: UserLoginRequest): Promise<UserLoginResponse> {
    const response = await this.http.post<UserLoginResponse>(
      '/users/login',
      {
        username: request.username,
        password: request.password,
      },
      {
        skipAuth: true,
        useCustomerToken: !!request.customerToken,
      }
    );

    // Save tokens
    await this.tokenManager.saveTokens(
      response.accessToken,
      response.refreshToken,
      response.expiresIn,
      'user'
    );

    return response;
  }

  /**
   * Customer login with username/password
   */
  async customerLogin(request: CustomerLoginRequest): Promise<CustomerLoginResponse> {
    const response = await this.http.post<CustomerLoginResponse>(
      '/customers/login',
      {
        username: request.username,
        password: request.password,
      },
      { skipAuth: true }
    );

    // Save tokens
    await this.tokenManager.saveTokens(
      response.accessToken,
      response.refreshToken,
      response.expiresIn,
      'customer'
    );

    return response;
  }

  /**
   * Direct API login with API key and secret (B2B Integration)
   * Authenticates using API credentials and returns a customer host token
   */
  async directLogin(request: DirectLoginRequest): Promise<DirectLoginResponse> {
    const response = await this.http.post<DirectLoginResponse>(
      '/direct/login',
      {
        apikey: request.apiKey,
        secret: request.secret,
      },
      { skipAuth: true }
    );

    // Save tokens
    await this.tokenManager.saveTokens(
      response.accessToken,
      response.refreshToken,
      response.expiresIn,
      'direct'
    );

    return response;
  }

  /**
   * Register new user
   */
  async register(request: RegisterRequest): Promise<UserLoginResponse> {
    const response = await this.http.post<UserLoginResponse>('/users/register', request, {
      skipAuth: true,
      useCustomerToken: true,
    });

    // Save tokens
    if (response.accessToken && response.refreshToken) {
      await this.tokenManager.saveTokens(
        response.accessToken,
        response.refreshToken,
        response.expiresIn,
        'user'
      );
    }

    return response;
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<TokenRefreshResponse> {
    const refreshToken = await this.tokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const tokenType = await this.tokenManager.getTokenType();
    let endpoint: string;
    if (tokenType === 'customer') {
      endpoint = '/customers/refresh-token';
    } else if (tokenType === 'direct') {
      endpoint = '/direct/refresh-token';
    } else {
      endpoint = '/users/refresh-token';
    }

    const response = await this.http.get<TokenRefreshResponse>(endpoint, {
      params: { token: refreshToken },
      skipAuth: true,
    });

    // Save new tokens
    await this.tokenManager.saveTokens(
      response.accessToken,
      response.refreshToken,
      response.expiresIn,
      tokenType || 'user'
    );

    return response;
  }

  /**
   * Logout (clear tokens)
   */
  async logout(): Promise<void> {
    await this.tokenManager.clearTokens();
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(request: PasswordRecoveryRequest): Promise<void> {
    await this.http.post('/users/password-recovery', request, { skipAuth: true });
  }

  /**
   * Reset password with token
   */
  async resetPassword(request: PasswordResetRequest): Promise<void> {
    await this.http.post('/users/password-reset', request, { skipAuth: true });
  }

  /**
   * Exchange pre-auth token for access token
   */
  async exchangePreAuthToken(token: string): Promise<UserLoginResponse> {
    const response = await this.http.get<UserLoginResponse>(`/users/preauth-token/${token}`, {
      skipAuth: true,
    });

    // Save tokens
    if (response.accessToken && response.refreshToken) {
      await this.tokenManager.saveTokens(
        response.accessToken,
        response.refreshToken,
        response.expiresIn,
        'user'
      );
    }

    return response;
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    return await this.tokenManager.hasTokens();
  }

  /**
   * Get current token type
   */
  async getTokenType(): Promise<'user' | 'customer' | 'direct' | null> {
    return await this.tokenManager.getTokenType();
  }
}
