/**
 * Core HTTP Client
 * Handles all HTTP requests with automatic token management
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { TokenManager } from './auth/TokenManager';
import { createErrorFromResponse, ScoreAPIError } from './errors/ScoreAPIError';

export interface ClientConfig {
  baseURL: string;
  timeout?: number;
  customerToken?: string;
  headers?: Record<string, string>;
}

export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  useCustomerToken?: boolean;
}

export class HttpClient {
  private axios: AxiosInstance;
  private tokenManager: TokenManager;
  private customerToken?: string;
  private refreshPromise: Promise<void> | null = null;

  constructor(config: ClientConfig, tokenManager: TokenManager) {
    this.tokenManager = tokenManager;
    this.customerToken = config.customerToken;

    this.axios = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request/response interceptors
   */
  private setupInterceptors() {
    // Request interceptor - add auth token
    this.axios.interceptors.request.use(
      async (config) => {
        const skipAuth = (config as any).skipAuth;
        const useCustomerToken = (config as any).useCustomerToken;

        if (!skipAuth) {
          // Check if token is expired and refresh if needed
          const isExpired = await this.tokenManager.isTokenExpired();
          if (isExpired && !this.refreshPromise) {
            await this.refreshTokens();
          }

          // Add access token
          const accessToken = await this.tokenManager.getAccessToken();
          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
        }

        // Add customer token if provided
        if (useCustomerToken && this.customerToken) {
          config.headers.ctoken = this.customerToken;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retrying, try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await this.refreshTokens();
            const accessToken = await this.tokenManager.getAccessToken();
            if (accessToken) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.axios(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, clear tokens
            await this.tokenManager.clearTokens();
            return Promise.reject(createErrorFromResponse(error));
          }
        }

        return Promise.reject(createErrorFromResponse(error));
      }
    );
  }

  /**
   * Refresh access token
   */
  private async refreshTokens(): Promise<void> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const refreshToken = await this.tokenManager.getRefreshToken();
        const tokenType = await this.tokenManager.getTokenType();

        if (!refreshToken) {
          throw new ScoreAPIError('No refresh token available', 'TOKEN_REQUIRED');
        }

        let endpoint: string;
        if (tokenType === 'customer') {
          endpoint = '/customers/refresh-token';
        } else if (tokenType === 'direct') {
          endpoint = '/direct/refresh-token';
        } else {
          endpoint = '/users/refresh-token';
        }

        const response = await this.axios.get(endpoint, {
          params: { token: refreshToken },
          skipAuth: true,
        } as any);

        const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data;
        await this.tokenManager.saveTokens(accessToken, newRefreshToken, expiresIn, tokenType || 'user');
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Set customer token
   */
  setCustomerToken(token: string) {
    this.customerToken = token;
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, config?: RequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axios.get(url, config);
    return response.data;
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axios.post(url, data, config);
    return response.data;
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axios.put(url, data, config);
    return response.data;
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axios.patch(url, data, config);
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axios.delete(url, config);
    return response.data;
  }

  /**
   * Get axios instance for advanced usage
   */
  getAxiosInstance(): AxiosInstance {
    return this.axios;
  }
}
