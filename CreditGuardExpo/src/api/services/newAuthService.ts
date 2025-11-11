import axios from 'axios';

// API Base URLs
const BACKEND_API_URL = 'http://3.143.90.42:8080/api';
const EQUIFAX_API_URL = 'https://efx-dev.stitchcredit.com/api';

// Backend API Endpoints
const BACKEND_ENDPOINTS = {
  LOGIN: '/login',
  PREAUTH_TOKEN: '/preauth-token',
} as const;

// Equifax API Endpoints
const EQUIFAX_ENDPOINTS = {
  PREAUTH_TOKEN: '/users/preauth-token', // Used with /{paToken} parameter
} as const;

// Types for Login Response
export interface LoginResponse {
  status: string;
  token: string;
  validitySeconds: number;
  user: {
    id: string;
    email: string;
    fname: string;
    lname: string;
    mobile: string;
    hostId: string;
    enrolledAt: string | null;
    createdAt: string;
    externalId: string;
    referenceId: string | null;
    active: boolean;
    demo: boolean;
  };
}

// Types for Preauth Token Response
export interface PreauthTokenResponse {
  token: string;
}

// Types for Equifax User Token Response
export interface EquifaxUserTokenResponse {
  token: string;
  expiresAt?: string;
  idpass?: boolean;
}

export class NewAuthService {
  private backendToken: string | null = null;
  private preauthToken: string | null = null;
  private equifaxUserToken: string | null = null;
  private userId: string | null = null;
  private externalId: string | null = null;
  private stepCallback: ((step: string) => void) | null = null;
  private loginResponse: LoginResponse | null = null;

  /**
   * Set a callback to track authentication steps
   */
  setStepCallback(callback: (step: string) => void) {
    this.stepCallback = callback;
  }

  /**
   * Clear the step callback
   */
  clearStepCallback() {
    this.stepCallback = null;
  }

  private notifyStep(step: string) {
    if (this.stepCallback) {
      this.stepCallback(step);
    }
  }

  /**
   * Step 1: Login to backend API
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      this.notifyStep('Authenticating with server...');
      const response = await axios.post<LoginResponse>(
        `${BACKEND_API_URL}${BACKEND_ENDPOINTS.LOGIN}`,
        {
          email,
          password,
        },
      );

      if (response.data.status === 'success') {
        this.backendToken = response.data.token;
        this.userId = response.data.user.id;
        this.externalId = response.data.user.externalId;
        this.loginResponse = response.data; // Store login response
        return response.data;
      } else {
        throw new Error('Login failed: Invalid response status');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ Step 1 Failed: Backend login error:', error);
      throw error;
    }
  }

  /**
   * Step 2: Get preauth token from backend
   */
  async getPreauthToken(): Promise<string> {
    if (!this.backendToken) {
      throw new Error('Backend token not available. Please login first.');
    }

    try {
      this.notifyStep('Getting authorization token...');
      const response = await axios.get<PreauthTokenResponse>(
        `${BACKEND_API_URL}${BACKEND_ENDPOINTS.PREAUTH_TOKEN}`,
        {
          headers: {
            Authorization: `Bearer ${this.backendToken}`,
          },
        },
      );

      this.preauthToken = response.data.token;
      return this.preauthToken;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ Step 2 Failed: Preauth token error:', error);
      throw error;
    }
  }

  /**
   * Step 3: Exchange preauth token for Equifax user token
   */
  async getEquifaxUserToken(): Promise<{token: string; idpass?: boolean}> {
    if (!this.preauthToken) {
      throw new Error('Preauth token not available. Please get preauth token first.');
    }

    try {
      this.notifyStep('Connecting to credit bureau...');

      // Try GET request instead of POST
      const response = await axios.get<EquifaxUserTokenResponse>(
        `${EQUIFAX_API_URL}${EQUIFAX_ENDPOINTS.PREAUTH_TOKEN}/${this.preauthToken}`,
      );

      this.equifaxUserToken = response.data.token;
      return {
        token: this.equifaxUserToken,
        idpass: response.data.idpass,
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ Step 3 Failed: Equifax user token error:', error);
      if (axios.isAxiosError(error)) {
        // eslint-disable-next-line no-console
        console.error('   Status:', error.response?.status);
        // eslint-disable-next-line no-console
        console.error('   Data:', error.response?.data);
        // eslint-disable-next-line no-console
        console.error('   URL:', error.config?.url);
      }
      throw error;
    }
  }

  /**
   * Complete authentication flow - all 3 steps
   */
  async authenticate(
    email: string,
    password: string,
  ): Promise<{
    loginResponse: LoginResponse;
    backendToken: string;
    preauthToken: string;
    equifaxUserToken: string;
    idpass?: boolean;
  }> {
    // Step 1: Login
    const loginResponse = await this.login(email, password);

    // Step 2: Get preauth token
    const preauthToken = await this.getPreauthToken();

    // Step 3: Get Equifax user token (includes idpass)
    const equifaxTokenResult = await this.getEquifaxUserToken();

    return {
      loginResponse,
      backendToken: this.backendToken!,
      preauthToken,
      equifaxUserToken: equifaxTokenResult.token,
      idpass: equifaxTokenResult.idpass,
    };
  }

  /**
   * Get stored tokens
   */
  getTokens() {
    return {
      backendToken: this.backendToken,
      preauthToken: this.preauthToken,
      equifaxUserToken: this.equifaxUserToken,
      userId: this.userId,
      externalId: this.externalId,
      loginResponse: this.loginResponse,
    };
  }

  /**
   * Clear all tokens
   */
  clearTokens() {
    this.backendToken = null;
    this.preauthToken = null;
    this.equifaxUserToken = null;
    this.userId = null;
    this.externalId = null;
  }
}

// Singleton instance
export const newAuthService = new NewAuthService();
