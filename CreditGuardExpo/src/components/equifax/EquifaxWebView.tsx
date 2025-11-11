import React, {useState, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Modal} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {WebView} from 'react-native-webview';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {EquifaxWebViewProps} from '../../types/equifax';
import {
  getMockEquifaxAuthenticatedUrl,
  equifaxAllowedDomains,
  isEquifaxActionComplete,
  equifaxWebViewHelpText,
} from '../../data/equifaxMockData';

export const EquifaxWebView: React.FC<EquifaxWebViewProps> = ({
  featureType,
  onClose,
  onSuccess,
  onError,
}) => {
  const {theme} = useTheme();
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  // In production, this would come from backend with auth token
  const initialUrl = getMockEquifaxAuthenticatedUrl(featureType, 'user_123456');

  const featureTitles = {
    freeze: 'Credit Freeze',
    'fraud-alert': 'Fraud Alert',
    dispute: 'Submit Dispute',
  };

  const handleNavigationStateChange = (navState: any) => {
    setCurrentUrl(navState.url);
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
    setLoading(navState.loading);

    // Check if action is complete based on URL
    if (isEquifaxActionComplete(navState.url)) {
      onSuccess?.();
    }

    // Verify URL is from allowed domains
    const urlDomain = new URL(navState.url).hostname;
    if (!equifaxAllowedDomains.some((domain) => urlDomain.includes(domain))) {
      setError('Navigation to unauthorized domain blocked');
      onError?.('Unauthorized domain');
    }
  };

  const handleError = (syntheticEvent: any) => {
    const {nativeEvent} = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    setError(equifaxWebViewHelpText.error);
    setLoading(false);
    onError?.(nativeEvent.description);
  };

  const handleLoad = () => {
    setLoading(false);
    setError(null);
  };

  const handleGoBack = () => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
    }
  };

  const handleGoForward = () => {
    if (canGoForward && webViewRef.current) {
      webViewRef.current.goForward();
    }
  };

  const handleReload = () => {
    if (webViewRef.current) {
      setError(null);
      webViewRef.current.reload();
    }
  };

  return (
    <Modal visible={true} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles(theme).container} edges={['top']}>
        {/* Header */}
        <View style={styles(theme).header}>
          <View style={styles(theme).headerLeft}>
            <TouchableOpacity onPress={onClose} style={styles(theme).closeButton}>
              <Ionicons name="close" size={28} color={theme.colors.text.primary} />
            </TouchableOpacity>
            <View style={styles(theme).titleContainer}>
              <Text style={styles(theme).headerTitle}>
                {featureTitles[featureType]}
              </Text>
              <View style={styles(theme).secureIndicator}>
                <Ionicons name="lock-closed" size={12} color={theme.colors.success} />
                <Text style={styles(theme).secureText}>Secure</Text>
              </View>
            </View>
          </View>

          <View style={styles(theme).headerActions}>
            {canGoBack && (
              <TouchableOpacity
                onPress={handleGoBack}
                style={styles(theme).navButton}
                disabled={!canGoBack}>
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={
                    canGoBack ? theme.colors.text.primary : theme.colors.text.tertiary
                  }
                />
              </TouchableOpacity>
            )}
            {canGoForward && (
              <TouchableOpacity
                onPress={handleGoForward}
                style={styles(theme).navButton}
                disabled={!canGoForward}>
                <Ionicons
                  name="arrow-forward"
                  size={24}
                  color={
                    canGoForward ? theme.colors.text.primary : theme.colors.text.tertiary
                  }
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handleReload} style={styles(theme).navButton}>
              <Ionicons name="reload" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Security Notice */}
        <View style={styles(theme).securityNotice}>
          <Ionicons name="shield-checkmark" size={16} color={theme.colors.success} />
          <Text style={styles(theme).securityNoticeText}>
            {equifaxWebViewHelpText.security}
          </Text>
        </View>

        {/* Loading Indicator */}
        {loading && !error && (
          <View style={styles(theme).loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles(theme).loadingText}>
              {equifaxWebViewHelpText.loading}
            </Text>
          </View>
        )}

        {/* Error State */}
        {error && (
          <View style={styles(theme).errorContainer}>
            <Ionicons name="alert-circle" size={64} color={theme.colors.error} />
            <Text style={styles(theme).errorTitle}>Connection Error</Text>
            <Text style={styles(theme).errorText}>{error}</Text>
            <TouchableOpacity style={styles(theme).retryButton} onPress={handleReload}>
              <Ionicons name="reload" size={20} color={theme.colors.surface} />
              <Text style={styles(theme).retryButtonText}>Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles(theme).closeErrorButton} onPress={onClose}>
              <Text style={styles(theme).closeErrorButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* WebView */}
        {!error && (
          <WebView
            ref={webViewRef}
            source={{uri: initialUrl}}
            style={styles(theme).webView}
            onNavigationStateChange={handleNavigationStateChange}
            onError={handleError}
            onLoad={handleLoad}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
            onShouldStartLoadWithRequest={(request) => {
              // Security: Only allow navigation to Equifax domains
              const requestDomain = new URL(request.url).hostname;
              return equifaxAllowedDomains.some((domain) =>
                requestDomain.includes(domain),
              );
            }}
          />
        )}

        {/* Help Text Footer */}
        {!error && (
          <View style={styles(theme).footer}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={theme.colors.text.secondary}
            />
            <Text style={styles(theme).footerText}>
              {equifaxWebViewHelpText.returnToApp}
            </Text>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    closeButton: {
      padding: theme.spacing.xs,
      marginRight: theme.spacing.sm,
    },
    titleContainer: {
      flex: 1,
    },
    headerTitle: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    secureIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    secureText: {
      ...theme.textStyles.caption,
      color: theme.colors.success,
      fontWeight: '600',
    },
    headerActions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    navButton: {
      padding: theme.spacing.xs,
    },
    securityNotice: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.success + '10',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      gap: theme.spacing.xs,
    },
    securityNoticeText: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.text.secondary,
      flex: 1,
    },
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
      zIndex: 1,
    },
    loadingText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing.md,
    },
    errorContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
    },
    errorTitle: {
      ...theme.textStyles.headline2,
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
    },
    errorText: {
      ...theme.textStyles.bodyLarge,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
    },
    retryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: 12,
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    retryButtonText: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '600',
      color: theme.colors.surface,
    },
    closeErrorButton: {
      paddingVertical: theme.spacing.sm,
    },
    closeErrorButtonText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
    },
    webView: {
      flex: 1,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      gap: theme.spacing.xs,
    },
    footerText: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.text.secondary,
      flex: 1,
    },
  });
