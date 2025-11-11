# CreditGuard API Integration Guide

## Overview

This document outlines the complete API integration requirements to make CreditGuard fully functional with your backend.

## Current Status

✅ **Frontend**: Fully implemented with mock data
⚠️ **Backend**: Needs to be connected to replace mock data

---

## API Endpoints Required

### 1. Authentication APIs

#### POST `/api/auth/register`

Register a new user account.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "accessToken": "jwt_token_here",
    "refreshToken": "refresh_token_here",
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isVerified": false,
      "isIdentityVerified": false
    }
  }
}
```

#### POST `/api/auth/login`

User login with credentials.

**Request:**

```json
{
  "username": "user@example.com",
  "password": "securePassword123"
}
```

**Response:** Same as register

#### POST `/api/auth/logout`

Logout current user.

**Headers:** `Authorization: Bearer {token}`

#### POST `/api/auth/refresh-token`

Refresh expired access token.

**Request:**

```json
{
  "refreshToken": "refresh_token_here"
}
```

---

### 2. Credit Score APIs

#### GET `/api/credit/score/latest`

Get user's latest credit score.

**Headers:** `Authorization: Bearer {token}`

**Response:**

```json
{
  "success": true,
  "data": {
    "score": 742,
    "scoreDate": "2025-01-15T10:30:00Z",
    "bureau": "Experian",
    "scoreRange": {
      "min": 300,
      "max": 850
    },
    "factors": [
      {
        "code": "PH01",
        "description": "Payment history is excellent",
        "impact": "positive"
      }
    ]
  }
}
```

#### GET `/api/credit/score/history`

Get credit score history over time.

**Headers:** `Authorization: Bearer {token}`
**Query Params:** `?months=12`

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "date": "2025-01-01",
      "score": 742,
      "bureau": "Experian"
    },
    {
      "date": "2024-12-01",
      "score": 738,
      "bureau": "Experian"
    }
  ]
}
```

---

### 3. Credit Report APIs

#### GET `/api/credit/report/summary`

Get comprehensive credit report summary.

**Headers:** `Authorization: Bearer {token}`

**Response:**

```json
{
  "success": true,
  "data": {
    "accounts": [
      {
        "id": "acc_123",
        "creditorName": "Chase Freedom",
        "accountType": "credit_card",
        "accountNumber": "****4532",
        "balance": 1250,
        "creditLimit": 5000,
        "paymentStatus": "current",
        "openDate": "2020-03-15",
        "lastPaymentDate": "2024-12-01",
        "monthsReviewed": 36,
        "monthlyPayment": 125,
        "accountStatus": "open",
        "paymentHistory": [
          {
            "month": "2024-10",
            "status": "ontime"
          }
        ]
      }
    ],
    "inquiries": [
      {
        "date": "2024-12-01",
        "creditorName": "Capital One",
        "type": "hard"
      }
    ],
    "totalAccounts": 8,
    "openAccounts": 6,
    "totalBalance": 23750,
    "totalCreditLimit": 32000,
    "utilizationRate": 0.23,
    "averageAccountAge": 4.2,
    "paymentHistory": {
      "onTimePercentage": 98,
      "totalPayments": 156,
      "latePayments": 3
    }
  }
}
```

---

### 4. Alerts & Notifications APIs

#### GET `/api/notifications`

Get user notifications.

**Headers:** `Authorization: Bearer {token}`
**Query Params:** `?unreadOnly=false&limit=50`

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "notif_123",
      "type": "score_change",
      "title": "Credit Score Increased",
      "message": "Your credit score increased by 5 points to 742",
      "priority": "high",
      "isRead": false,
      "createdAt": "2025-01-15T10:00:00Z",
      "actionUrl": "/credit-report"
    }
  ]
}
```

#### PATCH `/api/notifications/{id}/read`

Mark notification as read.

#### GET `/api/alerts`

Get credit monitoring alerts.

---

### 5. Offers APIs

#### GET `/api/offers`

Get personalized financial offers.

**Headers:** `Authorization: Bearer {token}`
**Query Params:** `?category=credit_card&sort=reward_value`

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "offer_123",
      "title": "Chase Sapphire Preferred",
      "issuer": "Chase",
      "category": "credit_card",
      "description": "Earn 60,000 bonus points",
      "imageUrl": "https://...",
      "approvalOdds": "excellent",
      "approvalOddsPercentage": 95,
      "annualFee": 95,
      "aprRange": "20.49% - 27.49%",
      "signUpBonus": "60,000 points after $4,000 spend",
      "rewardValue": 600,
      "featured": true,
      "details": {
        "creditScoreRequired": 720,
        "benefits": ["Travel insurance", "No foreign fees"],
        "rewardRate": "2x on travel and dining"
      }
    }
  ]
}
```

#### POST `/api/offers/{id}/track-view`

Track offer view for analytics.

#### POST `/api/offers/{id}/track-application`

Track when user applies for an offer.

---

### 6. User Profile APIs

#### GET `/api/user/profile`

Get current user profile.

**Headers:** `Authorization: Bearer {token}`

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "profilePicture": "https://...",
    "isVerified": true,
    "isIdentityVerified": true,
    "verificationLevel": "full",
    "subscriptionTier": "premium",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### PATCH `/api/user/profile`

Update user profile.

#### POST `/api/user/profile/picture`

Upload profile picture (multipart/form-data).

---

### 7. Subscription & Payment APIs

#### GET `/api/subscriptions/plans`

Get available subscription plans.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "free",
      "name": "Free",
      "price": 0,
      "billingPeriod": "month",
      "features": ["Basic credit monitoring", "Monthly score updates"],
      "limits": {
        "scoreUpdatesPerMonth": 1,
        "alertsPerMonth": 10
      }
    },
    {
      "id": "plus",
      "name": "Plus",
      "price": 14.99,
      "billingPeriod": "month",
      "features": ["Daily credit monitoring", "3-bureau credit reports"],
      "popular": true
    },
    {
      "id": "premium",
      "name": "Premium",
      "price": 29.99,
      "billingPeriod": "month",
      "features": ["All Plus features", "AI credit optimization", "Identity theft protection"]
    }
  ]
}
```

#### POST `/api/subscriptions/subscribe`

Subscribe to a plan.

**Request:**

```json
{
  "planId": "plus",
  "paymentMethodId": "pm_123",
  "billingPeriod": "month"
}
```

#### GET `/api/subscriptions/current`

Get current subscription status.

#### POST `/api/subscriptions/cancel`

Cancel subscription.

#### POST `/api/subscriptions/update`

Update subscription (upgrade/downgrade).

---

### 8. Payment APIs

#### POST `/api/payments/create-intent`

Create payment intent for subscription.

**Request:**

```json
{
  "planId": "plus",
  "billingPeriod": "month"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_123_secret_456",
    "amount": 1499,
    "currency": "usd"
  }
}
```

#### GET `/api/payments/methods`

Get saved payment methods.

#### POST `/api/payments/methods`

Add payment method.

#### DELETE `/api/payments/methods/{id}`

Remove payment method.

---

### 9. Identity Verification APIs

#### POST `/api/identity/verify/phone`

Send phone verification code.

#### POST `/api/identity/verify/phone/confirm`

Confirm phone with code.

#### POST `/api/identity/verify/personal-info`

Submit personal information for identity verification.

---

### 10. Equifax Integration APIs

#### POST `/api/equifax/credit-freeze/toggle`

Toggle credit freeze on/off.

#### GET `/api/equifax/alerts`

Get Equifax security alerts.

#### POST `/api/equifax/dispute`

File a credit dispute.

---

## Environment Configuration

### Required Environment Variables

Create `.env` file:

```bash
# API Configuration
API_BASE_URL=https://api.creditguard.com
API_TIMEOUT=30000

# Authentication
JWT_SECRET=your_jwt_secret_here

# Stripe (for payments)
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Equifax API
EQUIFAX_API_KEY=your_equifax_key
EQUIFAX_BASE_URL=https://api.equifax.com

# AWS (for file uploads)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=creditguard-uploads
AWS_REGION=us-east-1

# Push Notifications
FIREBASE_SERVER_KEY=your_firebase_key

# Environment
NODE_ENV=production
```

---

## Implementation Steps

### 1. Update API Client Configuration

File: `src/api/client.ts`

Replace mock mode checks with actual API calls:

```typescript
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';

// Remove all isDemoMode checks and use real API calls
```

### 2. Update Auth Store

File: `src/stores/authStore.ts`

Replace mock login/register with real API calls to your backend.

### 3. Update Credit Store

File: `src/stores/creditStore.ts`

Replace demo data with API service calls:

```typescript
fetchCreditScore: async () => {
  const score = await creditService.getLatestScore();
  set({creditScore: score});
};
```

### 4. Add Error Handling

Implement comprehensive error handling for:

- Network errors
- Authentication errors (401)
- Server errors (500)
- Rate limiting (429)

### 5. Add Loading States

Ensure all API calls show proper loading indicators.

### 6. Add Offline Support

Implement caching strategy for:

- Credit scores (cache for 24 hours)
- Reports (cache for 7 days)
- User profile (cache indefinitely, refresh on login)

---

## Security Considerations

1. **Token Storage**: Use secure storage (expo-secure-store) for JWT tokens
2. **HTTPS Only**: All API calls must use HTTPS in production
3. **Token Refresh**: Implement automatic token refresh before expiration
4. **Biometric Auth**: Support Face ID/Touch ID for app access
5. **PIN Lock**: Optional 4-digit PIN for app access
6. **Session Timeout**: Auto-logout after 15 minutes of inactivity

---

## Testing Checklist

- [ ] Authentication flow (register, login, logout)
- [ ] Credit score fetching and display
- [ ] Credit report with payment history
- [ ] Notifications and alerts
- [ ] Offers loading and filtering
- [ ] Profile updates
- [ ] Subscription management
- [ ] Payment processing
- [ ] Error handling for network failures
- [ ] Token refresh on expiration
- [ ] Offline mode with cached data

---

## Next Steps

1. Set up backend server with Express/NestJS
2. Implement authentication with JWT
3. Connect to Equifax API for credit data
4. Set up Stripe for payment processing
5. Deploy backend to AWS/Heroku
6. Update mobile app environment variables
7. Test end-to-end functionality
8. Deploy to App Store/Play Store

---

## Support

For questions or issues, contact: dev@creditguard.com
