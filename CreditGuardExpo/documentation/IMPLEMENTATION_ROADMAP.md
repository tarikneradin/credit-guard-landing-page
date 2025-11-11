# CreditGuard Implementation Roadmap

## Completed ✅

- ✅ API Integration documentation created
- ✅ Dashboard "Your Progress" section removed
- ✅ Payment history with account classification
- ✅ Offers screen with full implementation
- ✅ Optimal Path integrated in Smart Actions
- ✅ Credit metric modals (CreditMetricDetailModal)
- ✅ Notification center

---

## High Priority Features to Implement

### 1. Subscription Plans & Payment UI 💳

#### Recommended Pricing Strategy:

```
FREE TIER
- Price: $0/month
- Basic credit monitoring
- Monthly score updates
- Limited alerts (10/month)
- 1 credit report per month

PLUS TIER ⭐ (Most Popular)
- Price: $14.99/month or $144/year (20% discount)
- Daily credit monitoring
- 3-bureau credit reports
- Unlimited alerts
- Score simulator
- Credit dispute assistance
- Email support

PREMIUM TIER 👑
- Price: $29.99/month or $288/year (20% discount)
- All Plus features
- AI credit optimization
- Identity theft insurance ($1M coverage)
- Credit lock/unlock
- Dark web monitoring
- Priority 24/7 support
- Family plan (up to 2 adults)
```

#### Files to Create:

**1. Subscription Types**

```typescript
// src/types/subscription.ts
export type SubscriptionTier = 'free' | 'plus' | 'premium';
export type BillingPeriod = 'month' | 'year';

export interface SubscriptionPlan {
  id: string;
  tier: SubscriptionTier;
  name: string;
  price: number;
  billingPeriod: BillingPeriod;
  features: string[];
  limits?: {
    scoreUpdatesPerMonth?: number;
    alertsPerMonth?: number;
    reportsPerMonth?: number;
  };
  popular?: boolean;
  savings?: string; // e.g., "Save 20%"
}

export interface UserSubscription {
  planId: string;
  tier: SubscriptionTier;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
}
```

**2. Subscription Plans Screen**

```typescript
// src/screens/settings/SubscriptionPlansScreen.tsx
// - Display all 3 tiers with feature comparison
// - Highlight "Most Popular" badge on Plus
// - Toggle between monthly/yearly pricing
// - Show savings for annual billing
// - "Current Plan" indicator
// - CTA buttons: "Upgrade", "Downgrade", "Select Plan"
```

**3. Payment Method Screen**

```typescript
// src/screens/settings/PaymentMethodScreen.tsx
// - List saved payment methods
// - Add new card (Stripe integration)
// - Set default payment method
// - Remove payment method
// - Show last 4 digits + card brand
```

**4. Checkout Screen**

```typescript
// src/screens/settings/CheckoutScreen.tsx
// - Plan summary
// - Billing details
// - Payment method selection
// - Apply promo code
// - Terms & conditions checkbox
// - "Start [X]-day free trial" or "Subscribe Now" button
// - Secure payment badge (Stripe)
```

**5. Subscription Management Screen**

```typescript
// src/screens/settings/ManageSubscriptionScreen.tsx
// - Current plan details
// - Next billing date
// - Payment method on file
// - Billing history
// - Change plan button
// - Cancel subscription button
// - Reactivate (if cancelled)
```

#### Implementation Steps:

1. Install Stripe SDK: `npx expo install @stripe/stripe-react-native`
2. Create subscription types and mock data
3. Build subscription plans UI with comparison table
4. Implement Stripe payment integration
5. Add subscription management screens
6. Connect to backend payment APIs

---

### 2. Settings Screen Implementation 🛠️

#### Screens to Implement:

**Profile Settings**

```typescript
// src/screens/settings/ProfileScreen.tsx
Features:
- Profile picture upload
- Edit name, email, phone
- Change password
- Email verification status
- Phone verification status
- Account created date
```

**Security Settings**

```typescript
// src/screens/settings/SecuritySettingsScreen.tsx
Features:
- Enable/disable biometric login (Face ID/Touch ID)
- Set up PIN code
- Two-factor authentication (2FA)
- Active sessions list
- Sign out all devices
- Security activity log
```

**Notification Preferences**

```typescript
// src/screens/settings/NotificationPreferencesScreen.tsx
Features:
- Push notifications toggle
- Email notifications toggle
- SMS notifications toggle
- Notification categories:
  - Score changes
  - New accounts
  - Payment reminders
  - Identity monitoring
  - Promotional offers
- Quiet hours setting
```

**Privacy Settings**

```typescript
// src/screens/settings/PrivacySettingsScreen.tsx
Features:
- Data sharing preferences
- Marketing communications opt-in/out
- Third-party data sharing
- Download my data
- Delete account
```

**Help & Support**

```typescript
// src/screens/settings/HelpSupportScreen.tsx
Features:
- FAQ sections
- Contact support (email, chat, phone)
- Submit a ticket
- Knowledge base search
- Video tutorials
- Community forum link
```

**About**

```typescript
// src/screens/settings/AboutScreen.tsx
Features:
- App version
- Terms of Service
- Privacy Policy
- Licenses
- Credits
- Rate app
- Share app
```

---

### 3. Dashboard Detail Modals 📊

Create detailed modals for EACH dashboard metric:

**Total Balance Modal**

```typescript
// src/components/dashboard/modals/TotalBalanceModal.tsx
Shows:
- Breakdown by account type (credit cards, loans, etc.)
- Pie chart visualization
- Individual account balances
- Tips to reduce debt
- Debt payoff calculator
```

**Credit Limit Modal**

```typescript
// src/components/dashboard/modals/CreditLimitModal.tsx
Shows:
- Total available credit
- Credit by account type
- How to request increases
- Impact on credit score
- Optimal utilization tips
```

**Average Account Age Modal**

```typescript
// src/components/dashboard/modals/AccountAgeModal.tsx
Shows:
- Oldest account date
- Newest account date
- Average age calculation
- Why it matters
- Tips to improve
```

**Recent Inquiries Modal**

```typescript
// src/components/dashboard/modals/InquiriesModal.tsx
Shows:
- Hard vs soft inquiries
- Recent inquiry list
- Impact on score
- When inquiries drop off
- How to minimize impact
```

**Implementation:**

- Each modal triggered by tapping respective metric card
- Consistent modal design with:
  - Large metric value at top
  - Status indicator (Good/Fair/Poor)
  - Detailed breakdown
  - Visual charts where applicable
  - Actionable tips section
  - "Learn More" link
  - Close button

---

### 4. AI Tools Tab Navigation 🤖

Convert SmartActionsScreen to tab-based navigation:

```typescript
// src/screens/main/SmartActionsScreen.tsx
Structure:
- Top tab navigator with 2 tabs:
  1. "Smart Actions" - Current smart actions content
  2. "Optimal Path" - Optimal path action cards

Implementation:
- Use @react-navigation/material-top-tabs
- Smooth swipe between tabs
- Active tab indicator
- Lazy loading for performance
```

**Tab 1: Smart Actions**

- Goal card (current → target score)
- Smart action cards with priorities
- Total potential impact summary

**Tab 2: Optimal Path**

- OptimalPathActionCard components
- Progress tracking
- Step-by-step recommendations
- Completion checkboxes

---

### 5. Interactive App Tutorial 🎓

**Onboarding Flow:**

```typescript
// src/screens/onboarding/AppTutorialScreen.tsx

Step 1: Welcome
- App logo
- "Welcome to CreditGuard"
- Brief value proposition
- "Get Started" button

Step 2: Credit Monitoring
- Screenshot/illustration of dashboard
- "Monitor your credit score in real-time"
- Feature highlights
- "Next" button

Step 3: Smart Actions
- Screenshot of Smart Actions
- "Get personalized recommendations"
- AI-powered insights
- "Next" button

Step 4: Offers
- Screenshot of Offers
- "Find the best credit cards for you"
- Personalized matching
- "Next" button

Step 5: Alerts
- Screenshot of Alerts
- "Stay protected with real-time alerts"
- Security features
- "Next" button

Step 6: Permissions
- Push notifications permission
- Face ID/Touch ID setup
- "Enable" buttons
- "Skip" option

Step 7: Complete
- Success checkmark
- "You're all set!"
- "Start Exploring" button
```

**Interactive Tutorial Features:**

- Skip tutorial option
- Progress dots at bottom
- Swipe or tap to navigate
- Animations and transitions
- "Show me around" overlay for first-time users
- Contextual help tooltips throughout app
- "Tips" icon in headers for help

**Tutorial Types:**

1. **First-time onboarding** - Full walkthrough
2. **Feature discovery** - New feature highlights
3. **Contextual help** - In-app tooltips and hints

**Implementation:**

```typescript
// src/contexts/TutorialContext.tsx
- Track tutorial completion status
- Show contextual hints
- "?" help buttons throughout app

// src/components/tutorial/TutorialOverlay.tsx
- Semi-transparent overlay
- Spotlight on target element
- Explanation text
- "Got it" button
- Step counter

// src/components/tutorial/FeatureDiscovery.tsx
- Bottom sheet or modal
- Feature announcement
- GIF/video demonstration
- "Try it now" CTA
```

---

### 6. UI Polish & Standardization 🎨

**Design System Audit:**

1. **Color Consistency**
   - Ensure all screens use theme colors
   - No hardcoded colors
   - Consistent accent color usage
   - Proper dark mode support

2. **Typography**
   - Use theme.textStyles consistently
   - Proper hierarchy (headline1, headline2, etc.)
   - Consistent line heights
   - No random font sizes

3. **Spacing**
   - Use theme.spacing consistently
   - Standard padding/margin values
   - Consistent card spacing
   - Proper section separation

4. **Components**
   - Button variants (primary, secondary, tertiary)
   - Input field styles
   - Card shadows and borders
   - Loading states
   - Empty states
   - Error states

5. **Animations**
   - Consistent transitions
   - Smooth page transitions
   - Loading skeletons
   - Pull-to-refresh
   - Haptic feedback

6. **Icons**
   - Consistent icon set (Ionicons)
   - Proper icon sizes
   - Icon colors match theme

**Screens Needing Polish:**

- [ ] Dashboard - Improve card spacing
- [ ] Reports - Better empty states
- [ ] Smart Actions - Smoother animations
- [ ] Alerts - Better notification grouping
- [ ] Settings - Consistent list items
- [ ] Offers - Better card layouts

---

## Implementation Priority Order

### Week 1: Core Features

1. ✅ Dashboard cleanup (DONE)
2. ✅ API documentation (DONE)
3. Settings screen implementation
4. Subscription plans UI
5. Dashboard detail modals

### Week 2: Payment & Tutorial

1. Payment flow integration
2. Stripe setup
3. Interactive tutorial
4. Onboarding flow

### Week 3: AI Tools & Polish

1. AI Tools tab navigation
2. UI standardization audit
3. Animation improvements
4. Testing and bug fixes

### Week 4: Backend Integration

1. Connect real APIs
2. Remove mock data
3. Error handling
4. Performance optimization

---

## Testing Checklist

- [ ] All settings screens functional
- [ ] Subscription flow end-to-end
- [ ] Payment processing (test mode)
- [ ] Tutorial completion tracking
- [ ] All modals open correctly
- [ ] Tab navigation smooth
- [ ] Dark mode works everywhere
- [ ] Animations perform well
- [ ] No console warnings
- [ ] TypeScript types correct

---

## Next Steps

1. Review this roadmap
2. Prioritize features
3. Start with Settings implementation
4. Then subscription plans
5. Follow week-by-week plan

---

## Questions to Address

1. **Payment Provider**: Use Stripe? Or another provider?
2. **Free Trial**: Offer 7-day or 14-day trial?
3. **Family Plan**: Include in Premium tier?
4. **Annual Discount**: 20% off or different amount?
5. **Backend Ready**: When will APIs be available?

---

For detailed API requirements, see [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)
