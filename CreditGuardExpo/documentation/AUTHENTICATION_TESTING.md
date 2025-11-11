# Authentication Testing Guide

## Current Status

The login screen is now enabled and ready for testing with the new authentication flow.

## Test Credentials

```
Email: tarik.neradin+2@gmail.com
Password: TESTUSER
```

## Authentication Flow

When you login, the app will:

1. **Step 1**: Authenticate with backend (`http://3.143.90.42:8080/api/login`)
   - Display: "Authenticating with server..."
   - Returns: Backend JWT token + user data

2. **Step 2**: Get preauth token (`http://3.143.90.42:8080/api/preauth-token`)
   - Display: "Getting authorization token..."
   - Returns: Preauth token

3. **Step 3**: Get Equifax token (`https://efx-dev.stitchcredit.com/api/users/preauth-token/{paToken}`)
   - Display: "Connecting to credit bureau..."
   - Returns: Equifax user token

4. **Step 4**: Fetch credit data
   - `/users/efx-latest-scores` - Latest credit scores
   - `/users/efx-latest-report/summary` - Report summary
   - `/users/efx-score-history` - Score history

## Clearing Stored Auth State

If you're stuck on the dashboard and want to see the login screen:

### Option 1: Clear AsyncStorage (Recommended)

Add this code temporarily to your app:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// In your SplashScreen or App.tsx, add this:
AsyncStorage.clear();
```

### Option 2: Logout from Settings

1. Go to Settings screen
2. Tap "Logout" button

### Option 3: Reset Metro Bundler

```bash
cd /Users/tarikneradin/IdeaProjects/credit-guard/CreditGuardExpo
rm -rf node_modules/.cache
npx react-native start --reset-cache
```

## Demo Mode

You can still test with demo mode using:

```
Email: demo@creditguard.com
Password: (any password)
```

## Debugging

All authentication steps are logged to console with emojis:

- 🔑 Login attempt
- 🚀 Starting authentication flow
- 🔐 Step 1/2/3 progress
- ✅ Success messages
- ❌ Error messages

## UI Features

The login screen now shows:

1. Real-time authentication step progress
2. Error messages with clear explanations
3. Loading state during multi-step auth
4. Demo mode indicator card

## What Happens After Login

1. All tokens are stored in:
   - AsyncStorage (for persistence)
   - Auth store (for state management)
   - Equifax service (for API calls)

2. Dashboard will load and display:
   - Real credit score from Equifax
   - Credit report summary
   - Score history graph
   - Account metrics

3. If Equifax API fails:
   - App falls back to demo data
   - Console shows warning messages
   - User still sees the interface
