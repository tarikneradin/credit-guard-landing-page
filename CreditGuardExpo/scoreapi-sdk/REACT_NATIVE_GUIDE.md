# React Native Integration Guide

Complete guide for integrating ScoreAPI SDK into your React Native application.

## Installation

### 1. Install the SDK

```bash
npm install @stitchcredit/scoreapi-sdk
```

### 2. Install AsyncStorage (Required for React Native)

```bash
npm install @react-native-async-storage/async-storage
```

### 3. Link Native Dependencies (if not using auto-linking)

For React Native < 0.60:
```bash
react-native link @react-native-async-storage/async-storage
```

For React Native >= 0.60, dependencies are auto-linked. Just run:
```bash
cd ios && pod install && cd ..
```

## Basic Setup

### Initialize the SDK

Create a file `src/services/scoreApiClient.ts`:

```typescript
import { ScoreAPIClient, createAsyncStorageAdapter } from '@stitchcredit/scoreapi-sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initialize the SDK
const scoreApiClient = new ScoreAPIClient({
  baseURL: 'https://api.stitchcredit.com',
  customerToken: process.env.CUSTOMER_TOKEN, // Or your customer token
  storage: createAsyncStorageAdapter(AsyncStorage),
  timeout: 30000,
});

export default scoreApiClient;
```

## Authentication Examples

### User Login

```typescript
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import scoreApiClient from './services/scoreApiClient';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await scoreApiClient.auth.userLogin({
        username: email,
        password: password,
      });

      console.log('Logged in:', response.user);
      Alert.alert('Success', 'Login successful!');
      // Navigate to home screen
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title={loading ? 'Logging in...' : 'Login'}
        onPress={handleLogin}
        disabled={loading}
      />
    </View>
  );
}
```

### Direct API Login (B2B Integration)

```typescript
import scoreApiClient from './services/scoreApiClient';

const authenticateWithDirectAPI = async () => {
  try {
    const response = await scoreApiClient.auth.directLogin({
      apiKey: 'your-api-key',
      secret: 'your-api-secret',
    });

    console.log('Direct API authenticated');
    console.log('Customer Host:', response.host);

    return response;
  } catch (error) {
    console.error('Direct API login failed:', error);
    throw error;
  }
};
```

### Customer Login

```typescript
const handleCustomerLogin = async () => {
  try {
    const response = await scoreApiClient.auth.customerLogin({
      username: 'customer@company.com',
      password: 'password123',
    });

    console.log('Customer:', response.customer);
    return response;
  } catch (error) {
    console.error('Customer login failed:', error);
    throw error;
  }
};
```

## Using with React Context

Create a context to manage authentication state:

```typescript
// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import scoreApiClient from '../services/scoreApiClient';
import { UserProfile } from '@stitchcredit/scoreapi-sdk';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await scoreApiClient.auth.isAuthenticated();
      if (authenticated) {
        const profile = await scoreApiClient.user.getProfile();
        setUser(profile);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    const response = await scoreApiClient.auth.userLogin({ username, password });
    setUser(response.user);
  };

  const logout = async () => {
    await scoreApiClient.auth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

## Credit Score Example

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Button } from 'react-native';
import scoreApiClient from './services/scoreApiClient';

export default function CreditScoreScreen() {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScore();
  }, []);

  const loadScore = async () => {
    try {
      setLoading(true);
      const scores = await scoreApiClient.score.getLatestScores();
      setScore(scores.vantageScore3 || scores.score);
    } catch (error) {
      console.error('Failed to load score:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 48, fontWeight: 'bold' }}>
        {score || 'N/A'}
      </Text>
      <Text>Your Credit Score</Text>
      <Button title="Refresh" onPress={loadScore} />
    </View>
  );
}
```

## Identity Verification Flow

```typescript
import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import scoreApiClient from './services/scoreApiClient';
import { Linking } from 'react-native';

export default function IdentityVerificationScreen() {
  const [loading, setLoading] = useState(false);

  const startVerification = async () => {
    try {
      setLoading(true);

      // 1. Submit identity
      await scoreApiClient.identity.submitIdentity({
        firstName: 'John',
        lastName: 'Doe',
        ssn: '123-45-6789',
        dateOfBirth: '1990-01-01',
        address: {
          street1: '123 Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
        },
      });

      // 2. Get DIT challenge
      const dit = await scoreApiClient.identity.getDITChallenge();

      // 3. Submit DIT (would need UI for user input)
      const ditResult = await scoreApiClient.identity.submitDITVerification({
        challengeResponse: dit.challenge,
      });

      if (ditResult.smfaToken) {
        // 4. Send SMFA link
        const smfa = await scoreApiClient.identity.sendSMFALink(
          ditResult.smfaToken
        );

        // Open SMS verification URL
        await Linking.openURL(smfa.authUrl);

        // 5. Poll for verification status
        setTimeout(async () => {
          const status = await scoreApiClient.identity.verifySMFAStatus(
            smfa.linkToken
          );
          if (status.completed) {
            Alert.alert('Success', 'Identity verified!');
          }
        }, 5000);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Button
        title="Start Verification"
        onPress={startVerification}
        disabled={loading}
      />
    </View>
  );
}
```

## Environment Configuration

### Using .env file

Install `react-native-dotenv`:
```bash
npm install react-native-dotenv
```

Create `.env`:
```
API_BASE_URL=https://api.stitchcredit.com
CUSTOMER_TOKEN=your-customer-token
```

Configure babel.config.js:
```javascript
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
    }]
  ]
};
```

Use in code:
```typescript
import { API_BASE_URL, CUSTOMER_TOKEN } from '@env';

const scoreApiClient = new ScoreAPIClient({
  baseURL: API_BASE_URL,
  customerToken: CUSTOMER_TOKEN,
  storage: createAsyncStorageAdapter(AsyncStorage),
});
```

## Error Handling

```typescript
import { ScoreAPIError, ErrorCodes } from '@stitchcredit/scoreapi-sdk';

try {
  await scoreApiClient.auth.userLogin({ username, password });
} catch (error) {
  if (error instanceof ScoreAPIError) {
    switch (error.code) {
      case ErrorCodes.UNAUTHORIZED:
        Alert.alert('Error', 'Invalid username or password');
        break;
      case ErrorCodes.NETWORK_ERROR:
        Alert.alert('Error', 'Network error. Please check your connection.');
        break;
      case ErrorCodes.USER_NOT_FOUND:
        Alert.alert('Error', 'User not found');
        break;
      default:
        Alert.alert('Error', error.message);
    }
  } else {
    Alert.alert('Error', 'An unexpected error occurred');
  }
}
```

## Offline Support

The SDK automatically stores tokens in AsyncStorage, which persists across app restarts. To handle offline scenarios:

```typescript
import NetInfo from '@react-native-community/netinfo';

const checkConnection = async () => {
  const state = await NetInfo.fetch();

  if (!state.isConnected) {
    Alert.alert('Offline', 'Please check your internet connection');
    return false;
  }
  return true;
};

const loadData = async () => {
  if (await checkConnection()) {
    // Make API calls
  }
};
```

## Testing

### Mock the SDK in Tests

```typescript
// __mocks__/@stitchcredit/scoreapi-sdk.ts
export class ScoreAPIClient {
  auth = {
    userLogin: jest.fn(),
    logout: jest.fn(),
    isAuthenticated: jest.fn(),
  };

  score = {
    getLatestScores: jest.fn(),
  };

  // Add other mocked modules
}
```

## Troubleshooting

### AsyncStorage Not Found

Make sure AsyncStorage is properly installed and linked:
```bash
npm install @react-native-async-storage/async-storage
cd ios && pod install && cd ..
```

### CORS Errors

CORS doesn't apply to React Native. If you're seeing CORS errors, you're likely running the code in a web browser, not in React Native.

### Token Refresh Issues

The SDK handles token refresh automatically. If tokens expire frequently, check your token validity configuration on the server.

## Complete Example App

See the complete React Native example in [examples/react-native-example.tsx](./examples/react-native-example.tsx)

## Support

For issues specific to React Native integration:
- GitHub Issues: https://github.com/stitchcredit/scoreapi-sdk/issues
- Email: support@stitchcredit.com
