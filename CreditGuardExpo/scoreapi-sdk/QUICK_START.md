# ScoreAPI SDK - Quick Start Guide

This guide will help you get started with the ScoreAPI SDK in just a few minutes.

## Installation

```bash
npm install @stitchcredit/scoreapi-sdk
```

For React Native:
```bash
npm install @stitchcredit/scoreapi-sdk @react-native-async-storage/async-storage
```

## 5-Minute Integration

### Step 1: Initialize the SDK

```typescript
import { ScoreAPIClient } from '@stitchcredit/scoreapi-sdk';

const client = new ScoreAPIClient({
  baseURL: 'https://api.stitchcredit.com',
  customerToken: 'your-customer-token',
});
```

### Step 2: User Login

```typescript
try {
  const { user, accessToken } = await client.auth.userLogin({
    username: 'user@example.com',
    password: 'password123',
  });
  console.log('Logged in as:', user.email);
} catch (error) {
  console.error('Login failed:', error.message);
}
```

### Step 3: Get Credit Score

```typescript
try {
  const scores = await client.score.getLatestScores();
  console.log('Credit Score:', scores.vantageScore3);
} catch (error) {
  console.error('Failed to get score:', error.message);
}
```

## Common Use Cases

### User Registration

```typescript
const response = await client.auth.register({
  email: 'newuser@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
});
```

### Identity Verification Flow

```typescript
// 1. Submit identity
await client.identity.submitIdentity({
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
const dit = await client.identity.getDITChallenge();

// 3. Submit DIT verification
const result = await client.identity.submitDITVerification({
  challengeResponse: dit.challenge,
});

// 4. Send SMFA link
const { authUrl } = await client.identity.sendSMFALink(result.smfaToken);
// Open authUrl in browser/WebView for user to click SMS link

// 5. Verify SMFA status
const status = await client.identity.verifySMFAStatus(result.linkToken);
```

### Get Credit Report

```typescript
const { report } = await client.report.getLatestReport();
console.log('Total Accounts:', report.accounts?.length);
```

### Get Alerts

```typescript
const { alerts, unreadCount } = await client.alerts.getAlerts();
console.log(`You have ${unreadCount} unread alerts`);
```

### Update User Profile

```typescript
// Update email
await client.user.updateEmail('newemail@example.com');

// Update password
await client.user.updatePassword({
  currentPassword: 'oldpass',
  newPassword: 'newpass123',
});

// Update notifications
await client.user.updateNotifications({
  email: true,
  sms: false,
  push: true,
});
```

## React Native Setup

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScoreAPIClient, createAsyncStorageAdapter } from '@stitchcredit/scoreapi-sdk';

const client = new ScoreAPIClient({
  baseURL: 'https://api.stitchcredit.com',
  customerToken: process.env.CUSTOMER_TOKEN,
  storage: createAsyncStorageAdapter(AsyncStorage),
});

// Use the same API as web
const { user } = await client.auth.userLogin({
  username: 'user@example.com',
  password: 'password123',
});
```

## Error Handling

```typescript
import { ScoreAPIError, ErrorCodes } from '@stitchcredit/scoreapi-sdk';

try {
  await client.auth.userLogin({ username, password });
} catch (error) {
  if (error instanceof ScoreAPIError) {
    switch (error.code) {
      case ErrorCodes.UNAUTHORIZED:
        console.log('Invalid credentials');
        break;
      case ErrorCodes.NETWORK_ERROR:
        console.log('Network error, please try again');
        break;
      default:
        console.log('Error:', error.message);
    }
  }
}
```

## Customer Authentication (B2B Portal)

```typescript
const { customer } = await client.auth.customerLogin({
  username: 'customer@company.com',
  password: 'password123',
});
console.log('Customer:', customer.name);
```

## Direct API Authentication (B2B with API Key/Secret)

For B2B integrations using API credentials:

```typescript
const { accessToken, host } = await client.auth.directLogin({
  apiKey: 'your-api-key',
  secret: 'your-api-secret',
});

console.log('Authenticated as host:', host.name);
// Now you can access Direct API endpoints
```

## Best Practices

1. **Always handle errors** - Wrap API calls in try-catch blocks
2. **Use TypeScript** - Get full type safety and autocomplete
3. **Secure tokens** - The SDK automatically manages token storage
4. **Check authentication** - Use `client.auth.isAuthenticated()` to check login status
5. **Logout properly** - Always call `client.auth.logout()` when user logs out

## Next Steps

- Read the [complete documentation](./README.md)
- Check out the [examples](./examples)
- Review the [API reference](#) for all available methods

## Need Help?

- GitHub Issues: https://github.com/stitchcredit/scoreapi-sdk/issues
- Email: support@stitchcredit.com
