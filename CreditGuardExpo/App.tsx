/**
 * CreditGuard MVP - Industry Standard React Native App
 */

import React from 'react';
import { StatusBar, LogBox, Platform } from 'react-native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ErrorBoundary } from './src/components/common/ErrorBoundary';
// import { OfflineBanner } from './src/components/common/OfflineBanner';
import { ThemeProvider, useTheme, getStatusBarStyle } from './src/contexts/ThemeContext';

// Suppress warnings for development
if (__DEV__) {
  LogBox.ignoreLogs([
    'Warning: componentWillReceiveProps',
    'Warning: componentWillMount',
    'Module RCTEventEmitter requires main queue setup',
    'Possible Unhandled Promise Rejection',
    'Remote debugger',
  ]);
}

const AppContent: React.FC = () => {
  const { theme, isDark } = useTheme();

  return (
    <ErrorBoundary>
      <StatusBar
        barStyle={getStatusBarStyle(isDark)}
        backgroundColor={Platform.OS === 'android' ? theme.colors.background : undefined}
        translucent={Platform.OS === 'android'}
      />
      {/* <OfflineBanner /> */}
      <RootNavigator />
    </ErrorBoundary>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
