# Direct API Support - Update Summary

## Overview

The SDK has been updated to support Direct API authentication using API key and secret credentials. This enables B2B server-to-server integration where customers authenticate using their API credentials instead of username/password.

## What's New

### 1. Direct API Authentication

Added `directLogin()` method to authenticate using API key and secret:

```typescript
const response = await client.auth.directLogin({
  apiKey: 'your-api-key',
  secret: 'your-api-secret',
});

console.log('Access Token:', response.accessToken);
console.log('Customer Host:', response.host);
```

### 2. New Type Definitions

**Added Types** ([src/types/auth.ts](./src/types/auth.ts)):
```typescript
interface DirectLoginRequest {
  apiKey: string;
  secret: string;
}

interface DirectLoginResponse extends LoginResponse {
  host?: CustomerHost;
}

interface CustomerHost {
  id: string;
  customerId: string;
  name: string;
  key: string;
  active: boolean;
}
```

### 3. Token Type Support

TokenManager now supports three token types:
- `'user'` - End-user authentication
- `'customer'` - B2B customer portal authentication
- `'direct'` - B2B Direct API authentication

### 4. Automatic Token Refresh

The SDK automatically refreshes tokens for all three authentication types:
- User tokens → `GET /users/refresh-token`
- Customer tokens → `GET /customers/refresh-token`
- Direct API tokens → `GET /direct/refresh-token`

## Updated Files

### Core SDK Files

1. **[src/types/auth.ts](./src/types/auth.ts)**
   - Added `DirectLoginRequest` interface
   - Added `DirectLoginResponse` interface
   - Added `CustomerHost` interface

2. **[src/auth/TokenManager.ts](./src/auth/TokenManager.ts)**
   - Updated `TokenData` to support `'direct'` token type
   - Updated `saveTokens()` to accept `'direct'` type
   - Updated `getTokenType()` to return `'direct'` type

3. **[src/auth/AuthClient.ts](./src/auth/AuthClient.ts)**
   - Added `directLogin()` method
   - Updated token refresh logic to handle Direct API tokens
   - Updated `getTokenType()` return type

4. **[src/client.ts](./src/client.ts)**
   - Updated refresh token logic to route to `/direct/refresh-token`

### Documentation Updates

5. **[README.md](./README.md)**
   - Added Direct API login example in Authentication section

6. **[QUICK_START.md](./QUICK_START.md)**
   - Added Direct API Authentication section

7. **[REACT_NATIVE_GUIDE.md](./REACT_NATIVE_GUIDE.md)** (NEW)
   - Complete React Native integration guide
   - Direct API authentication examples for mobile
   - AsyncStorage setup instructions
   - Environment configuration
   - Error handling examples

### Example Updates

8. **[examples/node-example.js](./examples/node-example.js)**
   - Added `directApiAuthExample()` function
   - Added command line option: `node examples/node-example.js direct`

## API Endpoint

The Direct API login endpoint:

```
POST /direct/login
Content-Type: application/json

{
  "apikey": "your-api-key",
  "secret": "your-api-secret"
}

Response:
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "expiresIn": 3600
}
```

## Usage Examples

### Basic Usage

```typescript
import { ScoreAPIClient } from '@stitchcredit/scoreapi-sdk';

const client = new ScoreAPIClient({
  baseURL: 'https://api.stitchcredit.com',
  storage: 'memory',
});

// Authenticate with Direct API
const { accessToken, host } = await client.auth.directLogin({
  apiKey: process.env.API_KEY,
  secret: process.env.API_SECRET,
});

console.log('Authenticated as:', host.name);

// Token is automatically stored and used for subsequent requests
// No need to manually add Authorization headers
```

### React Native Example

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScoreAPIClient, createAsyncStorageAdapter } from '@stitchcredit/scoreapi-sdk';

const client = new ScoreAPIClient({
  baseURL: 'https://api.stitchcredit.com',
  storage: createAsyncStorageAdapter(AsyncStorage),
});

// Direct API authentication in mobile app
const handleDirectLogin = async () => {
  try {
    const response = await client.auth.directLogin({
      apiKey: 'your-api-key',
      secret: 'your-api-secret',
    });

    console.log('Direct API authenticated');
    console.log('Host:', response.host);
  } catch (error) {
    console.error('Authentication failed:', error);
  }
};
```

### Server-Side Example (Node.js)

```javascript
const { ScoreAPIClient } = require('@stitchcredit/scoreapi-sdk');

const client = new ScoreAPIClient({
  baseURL: 'https://api.stitchcredit.com',
  storage: 'memory',
});

async function authenticateServer() {
  try {
    // Authenticate with API credentials
    await client.auth.directLogin({
      apiKey: process.env.API_KEY,
      secret: process.env.API_SECRET,
    });

    // Now you can make API calls
    // The SDK automatically includes the token
    const user = await client.user.getProfile();
    console.log('User:', user);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## Authentication Flow Comparison

### User Portal Authentication
```
User enters email/password
  ↓
POST /users/login
  ↓
Receive JWT tokens
  ↓
Make authenticated requests
  ↓
Token expires → Auto refresh via /users/refresh-token
```

### Direct API Authentication
```
Server uses API key/secret
  ↓
POST /direct/login
  ↓
Receive JWT tokens
  ↓
Make authenticated requests
  ↓
Token expires → Auto refresh via /direct/refresh-token
```

## Token Storage

All token types are stored in the same format but with different `tokenType` values:

```typescript
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "expiresIn": 3600,
  "tokenType": "direct",  // or "user" or "customer"
  "timestamp": 1699999999999
}
```

## Testing

### Run Direct API Example

```bash
# Node.js example with Direct API
node examples/node-example.js direct
```

### Test in Your App

```typescript
import { ScoreAPIClient } from '@stitchcredit/scoreapi-sdk';

const client = new ScoreAPIClient({
  baseURL: 'https://api.stitchcredit.com',
  storage: 'memory',
});

async function testDirectAPI() {
  try {
    const response = await client.auth.directLogin({
      apiKey: 'test-api-key',
      secret: 'test-api-secret',
    });

    console.log('✓ Direct API login successful');
    console.log('Token type:', await client.auth.getTokenType()); // Should be 'direct'
    console.log('Is authenticated:', await client.auth.isAuthenticated()); // Should be true

    return response;
  } catch (error) {
    console.error('✗ Direct API login failed:', error);
    throw error;
  }
}
```

## Breaking Changes

**None.** This is a backward-compatible addition. Existing authentication methods (`userLogin`, `customerLogin`) continue to work exactly as before.

## Migration Guide

If you're currently using the Direct API endpoints outside the SDK:

### Before (Manual API Calls)
```javascript
const response = await fetch('https://api.stitchcredit.com/direct/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    apikey: 'your-key',
    secret: 'your-secret'
  })
});

const { accessToken } = await response.json();

// Manually store and manage token
localStorage.setItem('token', accessToken);

// Manually add to requests
fetch('/users', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});
```

### After (Using SDK)
```javascript
const client = new ScoreAPIClient({
  baseURL: 'https://api.stitchcredit.com',
  storage: 'localStorage',
});

await client.auth.directLogin({
  apiKey: 'your-key',
  secret: 'your-secret',
});

// Token automatically stored and managed
// No need to manually add Authorization headers
const user = await client.user.getProfile();
```

## Benefits

1. **Automatic Token Management** - No need to manually store, retrieve, or refresh tokens
2. **Consistent API** - Same interface as other authentication methods
3. **Type Safety** - Full TypeScript support with IntelliSense
4. **Error Handling** - Comprehensive error types and handling
5. **Multi-Platform** - Works in Browser, React Native, and Node.js

## Support

For questions or issues related to Direct API authentication:
- GitHub Issues: https://github.com/stitchcredit/scoreapi-sdk/issues
- Email: support@stitchcredit.com

## See Also

- [README.md](./README.md) - Complete SDK documentation
- [QUICK_START.md](./QUICK_START.md) - Quick start guide
- [REACT_NATIVE_GUIDE.md](./REACT_NATIVE_GUIDE.md) - React Native integration guide
- [examples/node-example.js](./examples/node-example.js) - Node.js examples
