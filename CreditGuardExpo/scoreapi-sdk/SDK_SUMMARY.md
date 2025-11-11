# ScoreAPI JavaScript SDK - Implementation Summary

## Overview

A complete TypeScript/JavaScript SDK for ScoreAPI client integration supporting Web, React Native, and Node.js platforms.

## Project Structure

```
scoreapi-sdk/
├── src/
│   ├── index.ts                    # Main SDK entry point
│   ├── client.ts                   # Core HTTP client with auto token refresh
│   ├── auth/
│   │   ├── AuthClient.ts          # User & Customer authentication
│   │   └── TokenManager.ts        # Token storage & refresh logic
│   ├── modules/
│   │   ├── UserModule.ts          # User profile management
│   │   ├── IdentityModule.ts     # Identity verification (DIT, SMFA)
│   │   ├── ScoreModule.ts         # Credit scores
│   │   ├── ReportModule.ts        # Credit reports
│   │   └── AlertModule.ts         # Credit monitoring alerts
│   ├── types/
│   │   ├── auth.ts                # Authentication types
│   │   ├── user.ts                # User types
│   │   ├── identity.ts            # Identity verification types
│   │   ├── score.ts               # Score types
│   │   ├── report.ts              # Report types
│   │   ├── alert.ts               # Alert types
│   │   └── common.ts              # Shared types
│   ├── errors/
│   │   └── ScoreAPIError.ts       # Custom error class
│   └── utils/
│       └── storage.ts             # Storage adapters
├── examples/
│   ├── web-example.html           # Browser example
│   ├── react-native-example.tsx   # React Native example
│   └── node-example.js            # Node.js example
├── package.json
├── tsconfig.json
├── rollup.config.js               # Build configuration
├── README.md                      # Full documentation
├── QUICK_START.md                 # Quick start guide
└── LICENSE                        # MIT License
```

## Implemented Features

### ✅ Authentication Module
- User login (email/password)
- Customer login (B2B portal)
- User registration
- Token refresh (automatic)
- Password recovery/reset
- Pre-auth token exchange
- Logout

### ✅ Identity Verification Module (Simplified)
- Submit identity information
- DIT (Digital Identity Trust) verification
- SMFA (SMS) verification
- ❌ IDFS Quiz (removed as requested)
- ❌ OTP/Mobile verification (removed as requested)

### ✅ User Profile Module
- Get user profile
- Update email
- Update password
- Update notification preferences
- Update recovery question
- Close account
- Initialize UI configuration

### ✅ Credit Score Module
- Get latest scores
- Get score history
- Get score projection (what-if)
- Get Equifax configuration

### ✅ Credit Report Module
- Get latest full report
- Get report summary

### ✅ Alert Module
- Get all alerts
- Unread count calculation

### ✅ Core Infrastructure
- HTTP client with Axios
- Automatic token refresh
- Request/response interceptors
- Custom error handling
- Multi-platform storage (localStorage, AsyncStorage, memory)
- Full TypeScript support
- Promise-based async API

## API Endpoints Covered

### Authentication (`/users`, `/customers`)
- `POST /users/login` - User authentication
- `POST /customers/login` - Customer authentication
- `POST /users/register` - User registration
- `GET /users/refresh-token` - Token refresh
- `GET /customers/refresh-token` - Customer token refresh
- `POST /users/password-recovery` - Request password reset
- `POST /users/password-reset` - Reset password
- `GET /users/preauth-token/{token}` - Exchange pre-auth token
- `GET /users/initialize` - Get UI config

### Identity Verification (`/users`)
- `POST /users/identity` - Submit identity
- `GET /users/dit-identity` - Get DIT challenge
- `POST /users/dit-identity` - Submit DIT verification
- `POST /users/smfa-send-link/{token}` - Send SMFA link
- `POST /users/smfa-verify-status/{token}` - Verify SMFA status

### User Profile (`/users`)
- `GET /users` - Get profile
- `POST /users/change-email` - Update email
- `POST /users/change-password` - Update password
- `POST /users/change-notifications` - Update notifications
- `POST /users/change-recovery` - Update recovery question
- `POST /users/close-account` - Close account

### Credit Scores (`/users`)
- `GET /users/efx-latest-scores` - Latest scores
- `GET /users/efx-score-history` - Score history
- `GET /users/efx-score-up` - Score projection
- `GET /users/efx-config` - Equifax config

### Credit Reports (`/users`)
- `GET /users/efx-latest-report` - Latest report
- `GET /users/efx-latest-report/summary` - Report summary

### Alerts (`/users`)
- `GET /users/efx-alerts` - Get all alerts

## Technical Features

### Token Management
- Automatic storage (localStorage/AsyncStorage/memory)
- Automatic refresh before expiration (5min buffer)
- Retry failed requests after refresh
- Support for both user and customer tokens
- IP validation on refresh

### Error Handling
- Custom `ScoreAPIError` class
- Predefined error codes
- HTTP status to error code mapping
- Detailed error information (code, message, status, details)

### Storage Adapters
- **Browser**: localStorage (default)
- **React Native**: AsyncStorage
- **Node.js**: In-memory storage
- **Custom**: Extensible adapter interface

### Build Output
- **ESM**: `dist/index.esm.js` (ES Modules)
- **CJS**: `dist/index.cjs.js` (CommonJS for Node.js)
- **Types**: `dist/index.d.ts` (TypeScript definitions)

## Dependencies

### Runtime
- `axios` ^1.6.0 - HTTP client

### Development
- TypeScript 5.x
- Rollup (bundler)
- ESLint + Prettier
- Jest (testing framework)

### Peer Dependencies (Optional)
- `@react-native-async-storage/async-storage` ^1.0.0 (React Native only)

## Usage Examples

### Browser
```typescript
import { ScoreAPIClient } from '@stitchcredit/scoreapi-sdk';

const client = new ScoreAPIClient({
  baseURL: 'https://api.stitchcredit.com',
  customerToken: 'ctoken',
  storage: 'localStorage',
});

const { user } = await client.auth.userLogin({ username, password });
const scores = await client.score.getLatestScores();
```

### React Native
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScoreAPIClient, createAsyncStorageAdapter } from '@stitchcredit/scoreapi-sdk';

const client = new ScoreAPIClient({
  baseURL: 'https://api.stitchcredit.com',
  storage: createAsyncStorageAdapter(AsyncStorage),
});
```

### Node.js
```typescript
const { ScoreAPIClient } = require('@stitchcredit/scoreapi-sdk');

const client = new ScoreAPIClient({
  baseURL: 'https://api.stitchcredit.com',
  storage: 'memory',
});
```

## Build & Development

```bash
# Install dependencies
npm install

# Build SDK
npm run build

# Development mode (watch)
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## Key Design Decisions

1. **TypeScript-first**: Full type safety with comprehensive type definitions
2. **Promise-based**: Modern async/await API throughout
3. **Automatic token management**: No manual token handling required
4. **Platform-agnostic**: Single codebase works across web, mobile, server
5. **Modular architecture**: Clean separation of concerns
6. **Error-first**: Comprehensive error handling with custom error types
7. **Zero configuration**: Sensible defaults, works out of the box
8. **Extensible**: Custom storage adapters, interceptors

## What's NOT Included (As Requested)

- ❌ IDFS Quiz endpoints - Removed per requirements
- ❌ OTP/Mobile verification endpoints - Removed per requirements
- ❌ InstATouch endpoints - Not needed for basic client integration
- ❌ Direct API endpoints (`/direct/*`) - Server-side only, not for mobile SDK
- ❌ Admin endpoints - Not for client integration
- ❌ Webhook endpoints - Server-side only
- ❌ Pre-screening endpoints - B2B only

## Next Steps for Production

1. **Testing**: Add unit tests with Jest
2. **CI/CD**: Set up GitHub Actions for automated builds/tests
3. **NPM Publishing**: Publish to npm registry
4. **Documentation**: Host API docs on GitHub Pages
5. **Examples**: Create live demo apps
6. **Monitoring**: Add analytics/error tracking
7. **Versioning**: Implement semantic versioning

## Package Name

`@stitchcredit/scoreapi-sdk`

## License

MIT License
