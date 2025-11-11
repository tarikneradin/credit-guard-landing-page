# CreditGuard MVP - Backend API Requirements

## Executive Summary

This document outlines all backend API requirements for the CreditGuard MVP application, including endpoints, data models, integrations, and infrastructure needs.

---

## 1. Authentication & User Management

### 1.1 Authentication Endpoints

#### POST `/api/v1/auth/register`

Register a new user account

```json
Request:
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "agreedToTerms": true
}

Response:
{
  "success": true,
  "data": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isVerified": false
    }
  }
}
```

#### POST `/api/v1/auth/login`

Authenticate user

```json
Request:
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response:
{
  "success": true,
  "data": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "user": { /* user object */ },
    "idpass": false,
    "just_enrolled": false
  }
}
```

#### POST `/api/v1/auth/logout`

Invalidate user session

#### POST `/api/v1/auth/refresh`

Refresh access token

#### POST `/api/v1/auth/forgot-password`

Initiate password reset

#### POST `/api/v1/auth/reset-password`

Complete password reset

#### POST `/api/v1/auth/verify-email`

Verify email address

#### POST `/api/v1/auth/resend-verification`

Resend verification email

---

## 2. Identity Verification

### 2.1 Identity Verification Endpoints

#### POST `/api/v1/identity/personal-info`

Submit personal information for identity verification

```json
Request:
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01",
  "ssn": "123-45-6789",
  "address": {
    "street": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94105"
  },
  "phone": "+1234567890"
}

Response:
{
  "success": true,
  "data": {
    "verificationId": "ver_123",
    "status": "pending",
    "nextStep": "phone_verification"
  }
}
```

#### POST `/api/v1/identity/send-phone-code`

Send phone verification code

#### POST `/api/v1/identity/verify-phone`

Verify phone number with code

#### POST `/api/v1/identity/kba/questions`

Get Knowledge-Based Authentication questions

#### POST `/api/v1/identity/kba/verify`

Submit KBA answers

#### GET `/api/v1/identity/status`

Check identity verification status

---

## 3. Credit Data & Monitoring

### 3.1 Credit Score Endpoints

#### GET `/api/v1/credit/score`

Get current credit score

```json
Response:
{
  "success": true,
  "data": {
    "score": 742,
    "scoreDate": "2025-10-29T10:00:00Z",
    "bureau": "Experian",
    "scoreRange": {
      "min": 300,
      "max": 850
    },
    "factors": [
      {
        "code": "PAYMENT_HISTORY",
        "description": "On-time payment history",
        "impact": "positive"
      }
    ]
  }
}
```

#### GET `/api/v1/credit/score/history`

Get credit score history over time

```json
Response:
{
  "success": true,
  "data": {
    "scores": [
      {
        "date": "2025-10-29",
        "score": 742,
        "bureau": "Experian"
      }
    ]
  }
}
```

#### GET `/api/v1/credit/score/all-bureaus`

Get scores from all three bureaus

#### POST `/api/v1/credit/refresh`

Request credit data refresh

---

### 3.2 Credit Report Endpoints

#### GET `/api/v1/credit/report`

Get full credit report

```json
Response:
{
  "success": true,
  "data": {
    "accounts": [ /* account array */ ],
    "inquiries": [ /* inquiry array */ ],
    "totalAccounts": 12,
    "openAccounts": 8,
    "totalBalance": 50000,
    "totalCreditLimit": 100000,
    "utilizationRate": 0.22,
    "averageAccountAge": 5.5,
    "paymentHistory": {
      "onTimePercentage": 98,
      "totalPayments": 240,
      "latePayments": 5
    }
  }
}
```

#### GET `/api/v1/credit/accounts`

Get all credit accounts

#### GET `/api/v1/credit/accounts/:id`

Get detailed account information with payment history

```json
Response:
{
  "success": true,
  "data": {
    "id": "acc_001",
    "name": "Chase Freedom Card",
    "type": "credit_card",
    "balance": 1250,
    "creditLimit": 5000,
    "paymentHistory": {
      "onTimePaymentPercentage": 98,
      "payments": [
        {
          "year": 2025,
          "month": 10,
          "status": "current"
        }
      ]
    }
  }
}
```

#### GET `/api/v1/credit/inquiries`

Get all credit inquiries

#### GET `/api/v1/credit/alerts`

Get credit monitoring alerts

#### POST `/api/v1/credit/dispute`

Submit dispute for credit report item

#### GET `/api/v1/credit/disputes/:id`

Get dispute status

---

## 4. AI & Smart Actions

### 4.1 AI Assistant Endpoints

#### POST `/api/v1/ai/chat`

Send message to AI assistant

```json
Request:
{
  "message": "How can I improve my credit score?",
  "context": "dashboard",
  "conversationId": "conv_123"
}

Response:
{
  "success": true,
  "data": {
    "response": "Based on your credit profile...",
    "conversationId": "conv_123",
    "suggestions": []
  }
}
```

#### GET `/api/v1/ai/conversations`

Get chat conversation history

#### DELETE `/api/v1/ai/conversations/:id`

Delete conversation

---

### 4.2 Smart Actions Endpoints

#### GET `/api/v1/smart-actions`

Get personalized smart actions

```json
Response:
{
  "success": true,
  "data": {
    "actions": [
      {
        "id": "action_1",
        "title": "Pay down credit cards to under 10%",
        "description": "Reduce utilization to boost score",
        "impact": "+15 pts in 30 days",
        "priority": "TOP_PRIORITY",
        "type": "payment",
        "status": "pending"
      }
    ]
  }
}
```

#### POST `/api/v1/smart-actions/:id/start`

Mark action as started

#### POST `/api/v1/smart-actions/:id/complete`

Mark action as completed

#### GET `/api/v1/smart-actions/history`

Get action history

#### GET `/api/v1/optimal-path`

Get optimal path to credit goal

#### POST `/api/v1/optimal-path/update`

Update credit goal

---

## 5. Offers & Recommendations

### 5.1 Offers Endpoints

#### GET `/api/v1/offers`

Get personalized credit offers

```json
Response:
{
  "success": true,
  "data": {
    "offers": [
      {
        "id": "offer_1",
        "type": "credit_card",
        "provider": "Chase",
        "name": "Chase Sapphire Preferred",
        "apr": 18.99,
        "annualFee": 95,
        "creditLimit": 10000,
        "approvalOdds": "excellent",
        "features": []
      }
    ]
  }
}
```

#### GET `/api/v1/offers/:id`

Get detailed offer information

#### POST `/api/v1/offers/:id/apply`

Track offer application

#### POST `/api/v1/offers/:id/save`

Save offer for later

#### GET `/api/v1/offers/saved`

Get saved offers

---

## 6. Notifications & Alerts

### 6.1 Notification Endpoints

#### GET `/api/v1/notifications`

Get all notifications

```json
Response:
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif_1",
        "type": "score_change",
        "title": "Your credit score increased!",
        "message": "Your score went up by 12 points",
        "read": false,
        "createdAt": "2025-10-29T10:00:00Z"
      }
    ],
    "unreadCount": 5
  }
}
```

#### PUT `/api/v1/notifications/:id/read`

Mark notification as read

#### PUT `/api/v1/notifications/read-all`

Mark all as read

#### DELETE `/api/v1/notifications/:id`

Delete notification

#### POST `/api/v1/notifications/settings`

Update notification preferences

#### GET `/api/v1/notifications/settings`

Get notification preferences

---

## 7. Subscription & Billing

### 7.1 Subscription Endpoints

#### GET `/api/v1/subscriptions/plans`

Get available subscription plans

```json
Response:
{
  "success": true,
  "data": {
    "plans": [
      {
        "id": "plan_free",
        "tier": "free",
        "name": "Basic",
        "monthlyPrice": 0,
        "annualPrice": 0,
        "features": []
      }
    ]
  }
}
```

#### GET `/api/v1/subscriptions/current`

Get current subscription

#### POST `/api/v1/subscriptions/subscribe`

Subscribe to plan

#### POST `/api/v1/subscriptions/cancel`

Cancel subscription

#### POST `/api/v1/subscriptions/update`

Update subscription plan

#### GET `/api/v1/subscriptions/invoices`

Get billing history

#### POST `/api/v1/subscriptions/payment-method`

Update payment method

---

## 8. User Profile & Settings

### 8.1 Profile Endpoints

#### GET `/api/v1/user/profile`

Get user profile

#### PUT `/api/v1/user/profile`

Update user profile

#### POST `/api/v1/user/profile/photo`

Upload profile photo

#### GET `/api/v1/user/settings`

Get user settings

#### PUT `/api/v1/user/settings`

Update user settings

#### POST `/api/v1/user/change-password`

Change password

#### POST `/api/v1/user/change-email`

Change email address

#### DELETE `/api/v1/user/account`

Delete user account

---

## 9. Reports & Analytics

### 9.1 Reports Endpoints

#### GET `/api/v1/reports/monthly`

Get monthly credit report

#### POST `/api/v1/reports/export`

Export report as PDF

#### GET `/api/v1/reports/trends`

Get credit trends analysis

#### GET `/api/v1/analytics/dashboard`

Get dashboard analytics

---

## 10. External Integrations

### 10.1 Credit Bureau Integration

**Required Integrations:**

- **Experian API**: Primary credit data source
- **TransUnion API**: Secondary credit data source (optional)
- **Equifax API**: Tertiary credit data source (optional)

**Key Features:**

- Pull credit reports
- Monitor credit score changes
- Receive credit alerts
- Dispute management

### 10.2 Payment Processing

**Provider**: Stripe

**Endpoints Needed:**

- Create customer
- Create subscription
- Update payment method
- Cancel subscription
- Handle webhooks

### 10.3 Identity Verification

**Provider**: ID.me or Persona

**Endpoints Needed:**

- Initiate verification
- Verify identity documents
- KBA questions
- Phone verification

### 10.4 AI Services

**Provider**: OpenAI or Claude API

**Endpoints Needed:**

- Chat completion
- Embeddings for semantic search
- Moderation

### 10.5 Push Notifications

**Provider**: Firebase Cloud Messaging (FCM)

**Endpoints Needed:**

- Send push notifications
- Manage device tokens
- Track delivery

### 10.6 Analytics

**Provider**: Mixpanel or Amplitude

**Events to Track:**

- User signup
- Login
- Feature usage
- Credit score views
- Action completions

---

## 11. Data Models

### 11.1 User Model

```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  ssn?: string; // Encrypted
  address?: Address;
  isVerified: boolean;
  isIdentityVerified: boolean;
  verificationLevel: 'basic' | 'identity' | 'full';
  createdAt: Date;
  updatedAt: Date;
}
```

### 11.2 Credit Account Model

```typescript
interface CreditAccount {
  id: string;
  userId: string;
  creditorName: string;
  accountType: 'credit_card' | 'mortgage' | 'auto_loan' | 'personal_loan' | 'student_loan';
  accountNumber: string; // Last 4 digits
  balance: number;
  creditLimit?: number;
  paymentStatus: 'current' | 'late_30' | 'late_60' | 'late_90' | 'charge_off';
  openDate: Date;
  lastPaymentDate?: Date;
  monthsReviewed: number;
  paymentHistory: PaymentHistory;
}
```

### 11.3 Credit Score Model

```typescript
interface CreditScore {
  id: string;
  userId: string;
  score: number;
  bureau: 'Experian' | 'TransUnion' | 'Equifax';
  scoreDate: Date;
  factors: CreditScoreFactor[];
  createdAt: Date;
}
```

### 11.4 Subscription Model

```typescript
interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  billingPeriod: 'monthly' | 'annual';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
}
```

---

## 12. Infrastructure Requirements

### 12.1 Database

**Primary Database**: PostgreSQL

- User data
- Subscription data
- App settings
- Audit logs

**Cache**: Redis

- Session management
- API response caching
- Rate limiting

**Search**: Elasticsearch (optional)

- Full-text search for credit accounts
- Log aggregation

### 12.2 Storage

**File Storage**: AWS S3 or similar

- Profile photos
- PDF reports
- Document uploads

### 12.3 Queue System

**Message Queue**: AWS SQS or RabbitMQ

- Credit data refresh jobs
- Email sending
- Report generation
- Webhook processing

### 12.4 Background Jobs

**Job Processor**: Bull or Agenda

- Daily credit monitoring
- Monthly report generation
- Subscription billing
- Data cleanup

---

## 13. Security Requirements

### 13.1 Authentication

- JWT tokens with 15-minute expiration
- Refresh tokens with 30-day expiration
- Token rotation on refresh
- Logout token blacklist

### 13.2 Authorization

- Role-based access control (RBAC)
- Resource-based permissions
- API key authentication for integrations

### 13.3 Data Protection

- Encrypt SSN and sensitive PII at rest (AES-256)
- TLS 1.3 for all API calls
- Certificate pinning in mobile app
- Secrets management (AWS Secrets Manager or Vault)

### 13.4 Rate Limiting

- 100 requests per minute per user
- 1000 requests per minute per IP
- Exponential backoff for retries

### 13.5 Audit Logging

- Log all authentication attempts
- Log all data access
- Log all data modifications
- Retain logs for 90 days minimum

---

## 14. API Standards

### 14.1 Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": {
    /* response data */
  },
  "message": "Optional message",
  "errors": [] // Only on error
}
```

### 14.2 Error Codes

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Internal Server Error
- `503` - Service Unavailable

### 14.3 Versioning

- API version in URL: `/api/v1/`
- Breaking changes require new version
- Support N-1 version for 6 months

### 14.4 Pagination

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "perPage": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## 15. Development Phases

### Phase 1: MVP (Current)

- Authentication
- Identity verification
- Credit score retrieval
- Basic credit report
- Subscription management

### Phase 2: Enhanced Features

- Multi-bureau support
- Smart actions API
- AI chat API
- Payment history details
- Offers integration

### Phase 3: Advanced Features

- Score simulator
- Dispute management
- Credit monitoring alerts
- Advanced analytics
- Partner integrations

---

## 16. SLA Requirements

### 16.1 Availability

- **Uptime**: 99.9% uptime (43.2 minutes downtime/month)
- **Maintenance windows**: Scheduled during off-peak hours

### 16.2 Performance

- **API response time**: < 200ms for 95th percentile
- **Credit data refresh**: < 5 seconds
- **Report generation**: < 10 seconds

### 16.3 Support

- **Critical issues**: 1-hour response time
- **High priority**: 4-hour response time
- **Normal priority**: 24-hour response time

---

_Document prepared by Claude Code - Last updated: 2025-10-29_
