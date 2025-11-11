import {ApiResponse, User, UserProfile, CreditScore, CreditAccount, CreditInquiry} from '../types';

import {
  mockUser,
  mockUserProfile,
  mockCreditScore,
  mockAccounts,
  mockInquiries,
  generateMockCreditScore,
} from '../data/mockData';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT || '10000');

// API Client Class
class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  // Generic API request method
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      // Add timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API Request failed:', error);
      return {
        success: false,
        data: null as T,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Authentication APIs
  async login(email: string, password: string): Promise<ApiResponse<{user: User; token: string}>> {
    // Mock implementation - in real app, this would make actual API call
    await this.simulateDelay(1000);

    if (email === 'demo@creditguard.com' && password === 'demo123') {
      return {
        success: true,
        data: {
          user: mockUser,
          token: 'mock_jwt_token_12345',
        },
      };
    }

    return {
      success: false,
      data: null as any,
      error: 'Invalid credentials',
    };
  }

  async logout(): Promise<ApiResponse<void>> {
    // Mock implementation
    await this.simulateDelay(500);
    return {
      success: true,
      data: undefined as void,
    };
  }

  // Profile APIs
  async getUserProfile(): Promise<ApiResponse<UserProfile>> {
    // Mock implementation
    await this.simulateDelay(800);
    return {
      success: true,
      data: mockUserProfile,
    };
  }

  async updateUserProfile(updates: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    // Mock implementation
    await this.simulateDelay(1000);
    const updatedProfile = {...mockUserProfile, ...updates};
    return {
      success: true,
      data: updatedProfile,
    };
  }

  // Credit Score APIs
  async getCreditScore(): Promise<ApiResponse<CreditScore>> {
    // Mock implementation with slight variation
    await this.simulateDelay(1200);
    const score = generateMockCreditScore();
    return {
      success: true,
      data: score,
    };
  }

  async refreshCreditScore(): Promise<ApiResponse<CreditScore>> {
    // Mock implementation - simulate getting updated score
    await this.simulateDelay(2000);
    const score = generateMockCreditScore();
    return {
      success: true,
      data: score,
    };
  }

  // Credit Accounts APIs
  async getCreditAccounts(): Promise<ApiResponse<CreditAccount[]>> {
    // Mock implementation
    await this.simulateDelay(1000);
    return {
      success: true,
      data: mockAccounts,
    };
  }

  async getCreditAccount(accountId: string): Promise<ApiResponse<CreditAccount>> {
    // Mock implementation
    await this.simulateDelay(600);
    const account = mockAccounts.find(acc => acc.id === accountId);

    if (account) {
      return {
        success: true,
        data: account,
      };
    }

    return {
      success: false,
      data: null as any,
      error: 'Account not found',
    };
  }

  // Credit Inquiries APIs
  async getCreditInquiries(): Promise<ApiResponse<CreditInquiry[]>> {
    // Mock implementation
    await this.simulateDelay(800);
    return {
      success: true,
      data: mockInquiries,
    };
  }

  // Monitoring APIs
  async enableCreditMonitoring(): Promise<ApiResponse<{enabled: boolean}>> {
    // Mock implementation
    await this.simulateDelay(1500);
    return {
      success: true,
      data: {enabled: true},
    };
  }

  async disableCreditMonitoring(): Promise<ApiResponse<{enabled: boolean}>> {
    // Mock implementation
    await this.simulateDelay(1000);
    return {
      success: true,
      data: {enabled: false},
    };
  }

  // Utility method to simulate network delay
  private async simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export individual service methods for easier import
export const authService = {
  login: apiClient.login.bind(apiClient),
  logout: apiClient.logout.bind(apiClient),
};

export const profileService = {
  getUserProfile: apiClient.getUserProfile.bind(apiClient),
  updateUserProfile: apiClient.updateUserProfile.bind(apiClient),
};

export const creditService = {
  getCreditScore: apiClient.getCreditScore.bind(apiClient),
  refreshCreditScore: apiClient.refreshCreditScore.bind(apiClient),
  getCreditAccounts: apiClient.getCreditAccounts.bind(apiClient),
  getCreditAccount: apiClient.getCreditAccount.bind(apiClient),
  getCreditInquiries: apiClient.getCreditInquiries.bind(apiClient),
};

export const monitoringService = {
  enableCreditMonitoring: apiClient.enableCreditMonitoring.bind(apiClient),
  disableCreditMonitoring: apiClient.disableCreditMonitoring.bind(apiClient),
};
