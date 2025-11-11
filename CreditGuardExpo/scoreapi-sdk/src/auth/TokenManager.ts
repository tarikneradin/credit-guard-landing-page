/**
 * Token Manager
 * Handles token storage, retrieval, and automatic refresh
 */

import { StorageAdapter } from '../utils/storage';

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'user' | 'customer' | 'direct';
  timestamp: number;
}

export class TokenManager {
  private storage: StorageAdapter;
  private readonly TOKEN_KEY = 'scoreapi_tokens';

  constructor(storage: StorageAdapter) {
    this.storage = storage;
  }

  /**
   * Save tokens to storage
   */
  async saveTokens(
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
    tokenType: 'user' | 'customer' | 'direct' = 'user'
  ): Promise<void> {
    const tokenData: TokenData = {
      accessToken,
      refreshToken,
      expiresIn,
      tokenType,
      timestamp: Date.now(),
    };

    const serialized = JSON.stringify(tokenData);
    await this.storage.setItem(this.TOKEN_KEY, serialized);
  }

  /**
   * Get stored tokens
   */
  async getTokens(): Promise<TokenData | null> {
    const serialized = await this.storage.getItem(this.TOKEN_KEY);
    if (!serialized) {
      return null;
    }

    try {
      return JSON.parse(serialized) as TokenData;
    } catch (e) {
      console.error('Failed to parse stored tokens', e);
      return null;
    }
  }

  /**
   * Get access token
   */
  async getAccessToken(): Promise<string | null> {
    const tokens = await this.getTokens();
    return tokens?.accessToken || null;
  }

  /**
   * Get refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    const tokens = await this.getTokens();
    return tokens?.refreshToken || null;
  }

  /**
   * Check if access token is expired
   */
  async isTokenExpired(): Promise<boolean> {
    const tokens = await this.getTokens();
    if (!tokens) {
      return true;
    }

    const expirationTime = tokens.timestamp + tokens.expiresIn * 1000;
    const currentTime = Date.now();

    // Consider token expired if less than 5 minutes remaining
    const bufferTime = 5 * 60 * 1000; // 5 minutes
    return currentTime >= expirationTime - bufferTime;
  }

  /**
   * Clear all tokens
   */
  async clearTokens(): Promise<void> {
    await this.storage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Check if tokens exist
   */
  async hasTokens(): Promise<boolean> {
    const tokens = await this.getTokens();
    return tokens !== null && !!tokens.accessToken;
  }

  /**
   * Get token type (user, customer, or direct)
   */
  async getTokenType(): Promise<'user' | 'customer' | 'direct' | null> {
    const tokens = await this.getTokens();
    return tokens?.tokenType || null;
  }
}
