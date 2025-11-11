require('dotenv').config();

module.exports = {
  expo: {
    name: 'CreditGuard MVP',
    slug: 'creditguard-mvp',
    version: '0.0.1',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.anonymous.creditguard-mvp',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      apiBaseUrl: process.env.API_BASE_URL || 'https://api.stitchcredit.com',
      customerToken: process.env.CUSTOMER_TOKEN || '',
    },
  },
};
