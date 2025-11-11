/**
 * ScoreAPI SDK
 * JavaScript/TypeScript SDK for ScoreAPI client integration
 */

import { HttpClient, ClientConfig } from './client';
import { TokenManager } from './auth/TokenManager';
import { AuthClient } from './auth/AuthClient';
import { UserModule } from './modules/UserModule';
import { IdentityModule } from './modules/IdentityModule';
import { ScoreModule } from './modules/ScoreModule';
import { ReportModule } from './modules/ReportModule';
import { AlertModule } from './modules/AlertModule';
import { createStorageAdapter, createAsyncStorageAdapter, StorageAdapter } from './utils/storage';
import { ScoreAPIError, ErrorCodes } from './errors/ScoreAPIError';

export interface ScoreAPIConfig {
  baseURL: string;
  customerToken?: string;
  timeout?: number;
  storage?: string | StorageAdapter;
  headers?: Record<string, string>;
}

export class ScoreAPIClient {
  private httpClient: HttpClient;
  private tokenManager: TokenManager;

  // Public modules
  public readonly auth: AuthClient;
  public readonly user: UserModule;
  public readonly identity: IdentityModule;
  public readonly score: ScoreModule;
  public readonly report: ReportModule;
  public readonly alerts: AlertModule;

  constructor(config: ScoreAPIConfig) {
    // Validate config
    if (!config.baseURL) {
      throw new ScoreAPIError(
        'baseURL is required in ScoreAPIConfig',
        ErrorCodes.VALIDATION_ERROR
      );
    }

    // Create storage adapter
    const storageAdapter = createStorageAdapter(config.storage);

    // Create token manager
    this.tokenManager = new TokenManager(storageAdapter);

    // Create HTTP client
    const clientConfig: ClientConfig = {
      baseURL: config.baseURL,
      timeout: config.timeout,
      customerToken: config.customerToken,
      headers: config.headers,
    };
    this.httpClient = new HttpClient(clientConfig, this.tokenManager);

    // Initialize modules
    this.auth = new AuthClient(this.httpClient, this.tokenManager);
    this.user = new UserModule(this.httpClient);
    this.identity = new IdentityModule(this.httpClient);
    this.score = new ScoreModule(this.httpClient);
    this.report = new ReportModule(this.httpClient);
    this.alerts = new AlertModule(this.httpClient);
  }

  /**
   * Set customer token dynamically
   */
  setCustomerToken(token: string): void {
    this.httpClient.setCustomerToken(token);
  }

  /**
   * Get HTTP client instance for advanced usage
   */
  getHttpClient(): HttpClient {
    return this.httpClient;
  }

  /**
   * Get token manager instance
   */
  getTokenManager(): TokenManager {
    return this.tokenManager;
  }
}

// Export types
export * from './types/auth';
export * from './types/user';
export * from './types/identity';
export * from './types/score';
export * from './types/report';
export * from './types/alert';
export * from './types/common';

// Export utilities
export { ScoreAPIError, ErrorCodes } from './errors/ScoreAPIError';
export { createAsyncStorageAdapter, StorageAdapter } from './utils/storage';

// Default export
export default ScoreAPIClient;
