/**
 * Equifax Integration Type Definitions
 * Security features and WebView integration
 */

export type EquifaxFeatureType = 'freeze' | 'fraud-alert' | 'dispute';
export type EquifaxFeatureStatus = 'loading' | 'ready' | 'error';

/**
 * Equifax security feature configuration
 */
export interface EquifaxSecurityFeature {
  type: EquifaxFeatureType;
  title: string;
  description: string;
  icon: string; // Ionicons name
  color: string;
  url: string; // Equifax.com URL for this feature
  requiresAuth: boolean;
}

/**
 * WebView navigation state
 */
export interface EquifaxWebViewState {
  url: string;
  title: string;
  loading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  error?: string;
}

/**
 * WebView props
 */
export interface EquifaxWebViewProps {
  featureType: EquifaxFeatureType;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * Security feature card props
 */
export interface EquifaxSecurityCardProps {
  feature: EquifaxSecurityFeature;
  onPress: () => void;
}
