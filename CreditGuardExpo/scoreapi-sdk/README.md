# ScoreAPI SDK

> JavaScript/TypeScript SDK for ScoreAPI client integration (Web, Mobile, Node.js)

[![npm version](https://badge.fury.io/js/%40stitchcredit%2Fscoreapi-sdk.svg)](https://badge.fury.io/js/%40stitchcredit%2Fscoreapi-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Official JavaScript/TypeScript SDK for integrating with ScoreAPI services. This SDK provides easy access to credit monitoring, identity verification, and user management features.

## Features

- ✅ **Full TypeScript Support** - Complete type definitions for all API requests and responses
- ✅ **Automatic Token Management** - Handles token storage and automatic refresh
- ✅ **Multi-Platform Support** - Works in Browser, React Native, and Node.js
- ✅ **User & Customer Authentication** - Supports both end-user and B2B customer authentication
- ✅ **Identity Verification** - DIT and SMFA verification flows
- ✅ **Credit Scores & Reports** - Access to credit scores, history, and full reports
- ✅ **Alert Management** - Credit monitoring alerts
- ✅ **Promise-based API** - Modern async/await interface
- ✅ **Error Handling** - Comprehensive error types and handling

## Installation

```bash
npm install @stitchcredit/scoreapi-sdk
```

For React Native, also install AsyncStorage:
```bash
npm install @react-native-async-storage/async-storage
```

## Quick Start

### Web / Node.js

```typescript
import { ScoreAPIClient } from '@stitchcredit/scoreapi-sdk';

const client = new ScoreAPIClient({
  baseURL: 'https://api.stitchcredit.com',
  customerToken: 'your-customer-token', // Optional for user portal mode
  storage: 'localStorage', // or 'memory' for Node.js
});

// User login
const { user, accessToken } = await client.auth.userLogin({
  username: 'user@example.com',
  password: 'password123',
});

// Get credit score
const scores = await client.score.getLatestScores();
console.log('Credit Score:', scores.vantageScore3);
```

### React Native

```typescript
import { ScoreAPIClient, createAsyncStorageAdapter } from '@stitchcredit/scoreapi-sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';

const client = new ScoreAPIClient({
  baseURL: 'https://api.stitchcredit.com',
  customerToken: process.env.CUSTOMER_TOKEN,
  storage: createAsyncStorageAdapter(AsyncStorage),
});

// Same API as web
const { user } = await client.auth.userLogin({
  username: 'user@example.com',
  password: 'password123',
});
```

## API Documentation

### Authentication

#### User Login
```typescript
const response = await client.auth.userLogin({
  username: 'user@example.com',
  password: 'password123',
  customerToken: 'optional-ctoken', // Optional
});

console.log('User:', response.user);
console.log('Access Token:', response.accessToken);
```

#### Customer Login (B2B Portal)
```typescript
const response = await client.auth.customerLogin({
  username: 'customer@company.com',
  password: 'password123',
});

console.log('Customer:', response.customer);
```

#### Direct API Login (B2B Integration with API Key/Secret)
```typescript
const response = await client.auth.directLogin({
  apiKey: 'your-api-key',
  secret: 'your-api-secret',
});

console.log('Access Token:', response.accessToken);
console.log('Customer Host:', response.host);

// After direct login, you can use Direct API endpoints
```

#### User Registration
```typescript
const response = await client.auth.register({
  email: 'newuser@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
});
```

#### Token Refresh
```typescript
// Automatic token refresh is handled by the SDK
// Manual refresh if needed:
await client.auth.refreshToken();
```

#### Logout
```typescript
await client.auth.logout(); // Clears all tokens
```

#### Password Reset
```typescript
// Request password reset
await client.auth.requestPasswordReset({
  email: 'user@example.com',
});

// Reset password with token
await client.auth.resetPassword({
  token: 'reset-token',
  newPassword: 'newpassword123',
  securityAnswer: 'answer',
});
```

### Identity Verification

#### Submit Identity Information
```typescript
await client.identity.submitIdentity({
  firstName: 'John',
  lastName: 'Doe',
  ssn: '123-45-6789',
  dateOfBirth: '1990-01-01',
  address: {
    street1: '123 Main St',
    street2: 'Apt 4',
    city: 'New York',
    state: 'NY',
    zip: '10001',
  },
});
```

#### DIT (Digital Identity Trust) Verification
```typescript
// Get verification challenge
const challenge = await client.identity.getDITChallenge();

// Submit verification response (after user completes challenge)
const result = await client.identity.submitDITVerification({
  challengeResponse: challenge.challenge,
});

console.log('SMFA Token:', result.smfaToken);
```

#### SMFA (SMS) Verification
```typescript
// Send SMS verification link
const { authUrl, linkToken } = await client.identity.sendSMFALink(smfaToken);

// Open authUrl in browser or WebView for user to click SMS link

// Poll for verification status
const status = await client.identity.verifySMFAStatus(linkToken);
console.log('Verification completed:', status.completed);
```

### User Profile Management

#### Get User Profile
```typescript
const user = await client.user.getProfile();
console.log('User:', user);
```

#### Update Email
```typescript
await client.user.updateEmail('newemail@example.com');
```

#### Update Password
```typescript
await client.user.updatePassword({
  currentPassword: 'oldpassword',
  newPassword: 'newpassword123',
});
```

#### Update Notification Preferences
```typescript
await client.user.updateNotifications({
  email: true,
  sms: false,
  push: true,
});
```

#### Close Account
```typescript
await client.user.closeAccount();
```

### Credit Scores

#### Get Latest Scores
```typescript
const scores = await client.score.getLatestScores();
console.log('VantageScore 3.0:', scores.vantageScore3);
console.log('Score Date:', scores.scoreDate);
console.log('Factors:', scores.factors);
```

#### Get Score History
```typescript
const history = await client.score.getScoreHistory();
console.log('Historical Scores:', history.scores);
console.log('Trend:', history.trend);
```

#### Get Score Projection
```typescript
const projection = await client.score.getScoreProjection({
  scoreIncrease: 50,
  timeHorizon: 12, // months
});

console.log('Current Score:', projection.currentScore);
console.log('Projected Score:', projection.projectedScore);
```

#### Get Equifax Configuration
```typescript
const config = await client.score.getEquifaxConfig();
console.log('Enrolled:', config.enrolled);
console.log('Features:', config.features);
```

### Credit Reports

#### Get Latest Report
```typescript
const { report } = await client.report.getLatestReport();
console.log('Report Date:', report.reportDate);
console.log('Accounts:', report.accounts);
console.log('Inquiries:', report.inquiries);
```

#### Get Report Summary
```typescript
const { summary } = await client.report.getLatestReportSummary();
console.log('Total Accounts:', summary.totalAccounts);
console.log('Total Balance:', summary.totalBalance);
console.log('Utilization:', summary.utilization);
```

### Alerts

#### Get All Alerts
```typescript
const { alerts, unreadCount } = await client.alerts.getAlerts();
console.log('Total Alerts:', alerts.length);
console.log('Unread Alerts:', unreadCount);

alerts.forEach(alert => {
  console.log(`${alert.title} - ${alert.severity}`);
});
```

## Configuration Options

```typescript
interface ScoreAPIConfig {
  baseURL: string;               // Required: API base URL
  customerToken?: string;        // Optional: Customer token for user portal mode
  timeout?: number;              // Optional: Request timeout in ms (default: 30000)
  storage?: string | StorageAdapter; // Optional: 'localStorage', 'memory', or custom adapter
  headers?: Record<string, string>;  // Optional: Additional headers
}
```

### Storage Options

#### Browser (localStorage)
```typescript
const client = new ScoreAPIClient({
  baseURL: 'https://api.stitchcredit.com',
  storage: 'localStorage', // Default for browsers
});
```

#### Node.js (in-memory)
```typescript
const client = new ScoreAPIClient({
  baseURL: 'https://api.stitchcredit.com',
  storage: 'memory',
});
```

#### React Native (AsyncStorage)
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStorageAdapter } from '@stitchcredit/scoreapi-sdk';

const client = new ScoreAPIClient({
  baseURL: 'https://api.stitchcredit.com',
  storage: createAsyncStorageAdapter(AsyncStorage),
});
```

#### Custom Storage Adapter
```typescript
import { StorageAdapter } from '@stitchcredit/scoreapi-sdk';

const customStorage: StorageAdapter = {
  async getItem(key: string): Promise<string | null> {
    // Your implementation
  },
  async setItem(key: string, value: string): Promise<void> {
    // Your implementation
  },
  async removeItem(key: string): Promise<void> {
    // Your implementation
  },
};

const client = new ScoreAPIClient({
  baseURL: 'https://api.stitchcredit.com',
  storage: customStorage,
});
```

## Error Handling

```typescript
import { ScoreAPIError, ErrorCodes } from '@stitchcredit/scoreapi-sdk';

try {
  await client.auth.userLogin({ username, password });
} catch (error) {
  if (error instanceof ScoreAPIError) {
    console.error('API Error:', error.message);
    console.error('Error Code:', error.code);
    console.error('Status Code:', error.statusCode);

    switch (error.code) {
      case ErrorCodes.UNAUTHORIZED:
        // Handle unauthorized access
        break;
      case ErrorCodes.USER_NOT_FOUND:
        // Handle user not found
        break;
      case ErrorCodes.NETWORK_ERROR:
        // Handle network error
        break;
      default:
        // Handle other errors
    }
  }
}
```

### Error Codes

- `UNAUTHORIZED` - Unauthorized access
- `TOKEN_EXPIRED` - Access token expired
- `TOKEN_REQUIRED` - Token required but not provided
- `INVALID_CREDENTIALS` - Invalid username/password
- `TOKEN_REFRESH_FAILED` - Token refresh failed
- `USER_NOT_FOUND` - User not found
- `USER_ALREADY_EXISTS` - User already exists
- `USER_ENROLLMENT_FAILED` - User enrollment failed
- `USER_THIN_FILE` - User has thin credit file
- `IDENTITY_VERIFICATION_FAILED` - Identity verification failed
- `DIT_VERIFICATION_FAILED` - DIT verification failed
- `SMFA_VERIFICATION_FAILED` - SMFA verification failed
- `NETWORK_ERROR` - Network error
- `TIMEOUT_ERROR` - Request timeout
- `VALIDATION_ERROR` - Validation error
- `SERVER_ERROR` - Server error
- `UNKNOWN_ERROR` - Unknown error

## TypeScript Support

The SDK is written in TypeScript and provides full type definitions:

```typescript
import {
  ScoreAPIClient,
  UserLoginRequest,
  UserLoginResponse,
  CreditScore,
  CreditReport,
  Alert,
} from '@stitchcredit/scoreapi-sdk';

const client = new ScoreAPIClient({
  baseURL: 'https://api.stitchcredit.com',
});

// Full type inference
const response: UserLoginResponse = await client.auth.userLogin({
  username: 'user@example.com',
  password: 'password123',
});
```

## Complete Examples

See the [examples](./examples) directory for complete working examples:

- [web-example.html](./examples/web-example.html) - Browser integration
- [react-native-example.tsx](./examples/react-native-example.tsx) - React Native app
- [node-example.js](./examples/node-example.js) - Node.js server-side

## Development

### Build
```bash
npm run build
```

### Development Mode
```bash
npm run dev
```

### Lint
```bash
npm run lint
```

### Format
```bash
npm run format
```

## Requirements

- Node.js >= 14.0.0
- For React Native: `@react-native-async-storage/async-storage` ^1.0.0

## License

MIT © StitchCredit

## Support

For issues and questions:
- GitHub Issues: https://github.com/stitchcredit/scoreapi-sdk/issues
- Email: support@stitchcredit.com

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a pull request.
