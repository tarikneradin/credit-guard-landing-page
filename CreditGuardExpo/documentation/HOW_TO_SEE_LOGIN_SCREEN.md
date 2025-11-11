# How to See the Login Screen

## Quick Steps

### Option 1: Use the Quick Logout Button (Easiest)

1. **On the Dashboard**, look for a red button at the top that says **"Quick Logout (Debug)"**
   - This button only appears in development mode (`__DEV__`)
2. Tap the button
3. Confirm the logout
4. The app will clear all data and show the login screen

### Option 2: Reload the App

Since we've disabled `SKIP_LOGIN_DEV_MODE`, you can:

1. In the Expo dev tools, press `r` to reload
2. Or shake your device and tap "Reload"
3. The app should now show the Splash Screen, then navigate to Login

### Option 3: Manual AsyncStorage Clear

Add this temporary code to [SplashScreen.tsx](src/screens/SplashScreen.tsx):

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Add this in useEffect, before checkAuthState()
await AsyncStorage.clear();
console.log('🧹 AsyncStorage cleared - will show login screen');
```

Then reload the app.

## Changes Made

### 1. Disabled Dev Mode Skip ([SplashScreen.tsx](src/screens/SplashScreen.tsx#L11))

```typescript
const SKIP_LOGIN_DEV_MODE = false; // Changed from true
```

### 2. Added Debug Logout Button ([DashboardScreen.tsx](src/screens/main/DashboardScreen.tsx#L550-555))

```typescript
{__DEV__ && (
  <View style={{paddingHorizontal: theme.spacing.xl, marginBottom: theme.spacing.md}}>
    <QuickLogoutButton />
  </View>
)}
```

### 3. Created QuickLogoutButton Component

Location: [src/components/debug/QuickLogoutButton.tsx](src/components/debug/QuickLogoutButton.tsx)

- Clears AsyncStorage
- Logs out from auth store
- Shows confirmation dialog

## What You'll See on Login Screen

1. **Header**: "Welcome Back" with subtitle
2. **Demo Card**: Info about demo mode credentials
3. **Form Fields**:
   - Email Address (with validation)
   - Password (secure entry)
4. **Forgot Password** link
5. **Sign In** button (shows loading state)
6. **Sign Up** link at bottom
7. **Legal disclaimer** at bottom

### During Login

When you tap "Sign In", you'll see real-time progress:

- "Authenticating with server..."
- "Getting authorization token..."
- "Connecting to credit bureau..."

### After Successful Login

- Navigate to Dashboard
- Credit data loads from Equifax API
- Score component shows real credit score

## Test Credentials

### Real API

```
Email: tarik.neradin+2@gmail.com
Password: TESTUSER
```

### Demo Mode

```
Email: demo@creditguard.com
Password: (any password)
```

## Troubleshooting

### Still showing Dashboard?

1. Make sure you saved [SplashScreen.tsx](src/screens/SplashScreen.tsx) with `SKIP_LOGIN_DEV_MODE = false`
2. Reload the app (press `r` in Expo dev tools)
3. If still stuck, use the Quick Logout Button on Dashboard

### Quick Logout Button not showing?

- Make sure you're in development mode (`__DEV__` is true)
- The button appears at the top of the Dashboard, below any error banners
- It's a red button with white text

### App crashes on logout?

- This might happen if there's navigation state issues
- Just reload the app manually
- The AsyncStorage will be cleared, so you'll see login screen

## Files Modified

1. ✅ [src/screens/SplashScreen.tsx](src/screens/SplashScreen.tsx) - Disabled skip login
2. ✅ [src/screens/main/DashboardScreen.tsx](src/screens/main/DashboardScreen.tsx) - Added debug button
3. ✅ [src/components/debug/QuickLogoutButton.tsx](src/components/debug/QuickLogoutButton.tsx) - New component
4. ✅ [src/api/services/newAuthService.ts](src/api/services/newAuthService.ts) - New auth flow
5. ✅ [src/api/services/equifaxService.ts](src/api/services/equifaxService.ts) - Equifax API
6. ✅ [src/stores/authStore.ts](src/stores/authStore.ts) - Updated with new flow
7. ✅ [src/stores/creditStore.ts](src/stores/creditStore.ts) - Uses Equifax service
8. ✅ [src/screens/auth/LoginScreen.tsx](src/screens/auth/LoginScreen.tsx) - Shows auth steps
