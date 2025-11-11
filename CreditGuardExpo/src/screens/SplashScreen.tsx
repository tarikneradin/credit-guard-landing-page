import React, {useEffect} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {useAuthStore} from '../stores/authStore';
import {useTheme} from '../contexts/ThemeContext';
import {RootStackParamList} from '../navigation/types';

// DEV MODE: Set to true to skip login and go directly to Dashboard
const SKIP_LOGIN_DEV_MODE = false;

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

export const SplashScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const {checkAuthState, isAuthenticated, isLoading, isIdentityCompleted} = useAuthStore();
  const [hasMinTimeElapsed, setHasMinTimeElapsed] = React.useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if user is already authenticated
        await checkAuthState();

        // Set minimum splash time
        setTimeout(
          () => {
            setHasMinTimeElapsed(true);
          },
          SKIP_LOGIN_DEV_MODE ? 500 : 3000,
        ); // Faster in dev mode
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('❌ SplashScreen: App initialization error:', error);
        // On error, still wait for minimum time
        setTimeout(
          () => {
            setHasMinTimeElapsed(true);
          },
          SKIP_LOGIN_DEV_MODE ? 500 : 3000,
        );
      }
    };

    initializeApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Navigate only when both auth state is ready AND minimum time has elapsed
  useEffect(() => {
    // Only navigate if minimum time elapsed, not loading, and we have a clear auth state
    if (hasMinTimeElapsed && !isLoading && isAuthenticated !== null) {
      // DEV MODE: Skip login and go directly to Dashboard
      if (SKIP_LOGIN_DEV_MODE) {
        navigation.replace('Main', {screen: 'Dashboard'});
        return;
      }

      if (isAuthenticated) {
        if (isIdentityCompleted) {
          navigation.replace('Main', {screen: 'Dashboard'});
        } else {
          navigation.replace('Identity', {screen: 'PersonalInfo'});
        }
      } else {
        navigation.replace('Auth', {screen: 'Login'});
      }
    }
  }, [hasMinTimeElapsed, isAuthenticated, isIdentityCompleted, isLoading, navigation]);

  const styles = {
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    logoContainer: {
      alignItems: 'center' as const,
      marginBottom: theme.spacing.xxxl,
    },
    logo: {
      ...theme.textStyles.display1,
      color: theme.colors.accent,
      fontWeight: 'bold' as const,
      marginBottom: theme.spacing.sm,
    },
    tagline: {
      ...theme.textStyles.bodyLarge,
      color: theme.colors.text.secondary,
      fontWeight: '500' as const,
    },
    loadingContainer: {
      alignItems: 'center' as const,
      position: 'absolute' as const,
      bottom: 120,
    },
    loadingText: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing.md,
    },
    versionContainer: {
      position: 'absolute' as const,
      bottom: theme.spacing.xl,
    },
    versionText: {
      ...theme.textStyles.caption,
      color: theme.colors.text.tertiary,
    },
  };

  return (
    <View style={styles.container}>
      {/* Logo/Brand */}
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>CreditGuard</Text>
        <Text style={styles.tagline}>Your Credit, Secured</Text>
      </View>

      {/* Loading Indicator */}
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text style={styles.loadingText}>Loading your account...</Text>
      </View>

      {/* Version Info */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </View>
  );
};
