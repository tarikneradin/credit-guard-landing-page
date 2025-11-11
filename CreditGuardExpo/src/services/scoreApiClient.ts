/**
 * ScoreAPI SDK Client
 * Centralized SDK instance for the CreditGuard app
 */

import ScoreAPIClient, {createAsyncStorageAdapter} from '@stitchcredit/scoreapi-sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Get environment variables
const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'https://api.stitchcredit.com';
const CUSTOMER_TOKEN = Constants.expoConfig?.extra?.customerToken || '';

/**
 * Initialize the ScoreAPI SDK client
 * This is the main SDK instance used throughout the app
 */
const scoreApiClient = new ScoreAPIClient({
  baseURL: API_BASE_URL,
  customerToken: CUSTOMER_TOKEN,
  storage: createAsyncStorageAdapter(AsyncStorage),
  timeout: 30000, // 30 seconds timeout
});

/**
 * Set customer token dynamically
 * Call this after obtaining a customer token from your backend
 */
export const setCustomerToken = (token: string) => {
  scoreApiClient.setCustomerToken(token);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  return await scoreApiClient.auth.isAuthenticated();
};

/**
 * Clear all authentication tokens (logout)
 */
export const clearAuth = async (): Promise<void> => {
  await scoreApiClient.auth.logout();
};

// Export the SDK client as default
export default scoreApiClient;

/**
 * Usage Examples:
 *
 * // Authentication
 * import scoreApiClient from '@/services/scoreApiClient';
 * const response = await scoreApiClient.auth.userLogin({ username, password });
 *
 * // Get credit score
 * const scores = await scoreApiClient.score.getLatestScores();
 *
 * // Get credit report
 * const report = await scoreApiClient.report.getLatestReport();
 *
 * // Get alerts
 * const alerts = await scoreApiClient.alerts.getAlerts();
 *
 * // Update profile
 * await scoreApiClient.user.updateEmail('newemail@example.com');
 */
