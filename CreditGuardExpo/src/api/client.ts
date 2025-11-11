import axios, {AxiosError, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import {getAccessToken, setAccessToken, setRefreshToken} from '../utils/storage';

// Extend the AxiosRequestConfig to include our custom properties
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: Date;
    };
    _retry?: boolean;
  }
}

// Create axios instance
export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://efx-dev.stitchcredit.com/api',
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '15000', 10),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    config.metadata = {startTime: new Date()};

    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('🌐 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'none',
      });
    }

    return config;
  },
  (error: AxiosError) => {
    // eslint-disable-next-line no-console
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  },
);

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Slow requests can be monitored via dev tools
    if (__DEV__ && response.config.metadata) {
      const duration = new Date().getTime() - response.config.metadata.startTime.getTime();
      if (duration > 2000) {
        // Slow request detected
      }
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - token might be expired
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        // Note: Implement refresh token logic based on your backend
        // For now, we'll just clear tokens and redirect to login
        await setAccessToken(null);
        await setRefreshToken(null);

        // You can dispatch a logout action here if using state management
      } catch {
        // Redirect to login screen
      }
    }

    // Log API errors in development
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
      });
    }

    return Promise.reject(error);
  },
);

const formatIdentityFailureMessage = () =>
  [
    "We couldn't verify your identity.",
    'Sometimes the information you entered does not fully match our records.',
    '',
    'Try the following:',
    '- Confirm each name, date of birth, SSN, and address match your official documents.',
    '- If you recently moved, try the previous address where you received mail.',
    '- Use the address you typically use for billing statements.',
  ].join('\n');

const normalizeErrorValue = (value: unknown): string | null => {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    return value.trim() || null;
  }

  if (Array.isArray(value)) {
    const flattened = value
      .map(item => normalizeErrorValue(item))
      .filter((item): item is string => Boolean(item));
    return flattened.length > 0 ? flattened.join('\n') : null;
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;

    if (typeof record.message === 'string' && record.message.trim().length > 0) {
      return record.message.trim();
    }

    if (Array.isArray(record.messages)) {
      const combined = normalizeErrorValue(record.messages);
      if (combined) {
        return combined;
      }
    }

    if (typeof record.error === 'string' && record.error.trim().length > 0) {
      return record.error.trim();
    }

    if (Array.isArray(record.errors)) {
      const combined = normalizeErrorValue(record.errors);
      if (combined) {
        return combined;
      }
    }

    if (typeof record.detail === 'string' && record.detail.trim().length > 0) {
      return record.detail.trim();
    }

    if (Array.isArray(record.details)) {
      const combined = normalizeErrorValue(record.details.map(item => `- ${item}`));
      if (combined) {
        return combined;
      }
    }

    if (Array.isArray(record.codes)) {
      const codes = record.codes.map(code => String(code));
      if (codes.includes('SC303')) {
        return formatIdentityFailureMessage();
      }
    }
  }

  return null;
};

// Helper function to handle API errors consistently
export const handleApiError = (error: AxiosError | Error | unknown): string => {
  // Type guard for AxiosError
  const isAxiosError = (err: unknown): err is AxiosError => {
    return typeof err === 'object' && err !== null && 'response' in err;
  };

  if (isAxiosError(error)) {
    if (error.response) {
      // Server responded with error status
      const {status, data} = error.response;
      const normalizedMessage = normalizeErrorValue(data);

      switch (status) {
        case 400:
          return normalizedMessage || 'Invalid request. Please check your input.';
        case 401:
          return normalizedMessage || 'Session expired. Please log in again.';
        case 403:
          return (
            normalizedMessage || 'Access denied. You do not have permission to perform this action.'
          );
        case 404:
          return normalizedMessage || 'The requested resource was not found.';
        case 409:
          return normalizedMessage || 'Conflict. The resource already exists.';
        case 422:
          return normalizedMessage || 'Validation error. Please check your input.';
        case 429:
          return normalizedMessage || 'Too many requests. Please try again later.';
        case 500:
          return normalizedMessage || 'Internal server error. Please try again later.';
        case 503:
          return normalizedMessage || 'Service temporarily unavailable. Please try again later.';
        default:
          return normalizedMessage || `An error occurred (${status}). Please try again.`;
      }
    } else if (error.request) {
      // Network error
      return 'Network error. Please check your internet connection and try again.';
    }
  }

  // Handle regular Error objects or unknown errors
  if (error instanceof Error) {
    return error.message || 'An unexpected error occurred. Please try again.';
  }

  return 'An unexpected error occurred. Please try again.';
};

export default apiClient;
