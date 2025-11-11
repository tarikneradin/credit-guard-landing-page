import {
  CreditScore,
  CreditReportSummary,
  ScoreHistory,
  CreditAccount,
  CreditInquiry,
} from '../types/api';

export class MockDataService {
  static generatePaymentHistory(
    yearsBack: number,
    onTimePercentage: number = 98,
  ): Array<{year: number; month: number; status: 'current' | 'late' | 'derogatory' | 'unknown'}> {
    const payments = [];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // 1-12

    for (let year = currentYear - yearsBack; year <= currentYear; year++) {
      const startMonth = year === currentYear - yearsBack ? 1 : 1;
      const endMonth = year === currentYear ? currentMonth : 12;

      for (let month = startMonth; month <= endMonth; month++) {
        const random = Math.random() * 100;
        let status: 'current' | 'late' | 'derogatory' | 'unknown';

        if (random < onTimePercentage) {
          status = 'current';
        } else if (random < onTimePercentage + 10) {
          status = 'late';
        } else if (random < onTimePercentage + 15) {
          status = 'derogatory';
        } else {
          status = 'unknown';
        }

        payments.push({year, month, status});
      }
    }

    return payments;
  }

  static generateScoreHistory(months: number = 12): ScoreHistory[] {
    const history: ScoreHistory[] = [];
    const baseScore = 742;
    const currentDate = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);

      // Generate realistic score variations
      const variation = (Math.random() - 0.5) * 30; // ±15 points variation
      const score = Math.max(300, Math.min(850, baseScore + variation));

      history.push({
        date: date.toISOString(),
        score: Math.round(score),
        bureau: 'Experian',
      });
    }

    return history;
  }

  static generateCreditAccounts(): CreditAccount[] {
    return [
      {
        id: '1',
        creditorName: 'Chase Freedom Unlimited',
        accountType: 'credit_card',
        accountNumber: '****1234',
        balance: 1250,
        creditLimit: 5000,
        paymentStatus: 'current',
        openDate: '2020-03-15',
        lastPaymentDate: '2024-08-15',
        monthsReviewed: 48,
        paymentHistory: this.generatePaymentHistory(3, 98),
      },
      {
        id: '2',
        creditorName: 'Capital One Venture',
        accountType: 'credit_card',
        accountNumber: '****5678',
        balance: 850,
        creditLimit: 3000,
        paymentStatus: 'current',
        openDate: '2021-07-22',
        lastPaymentDate: '2024-08-20',
        monthsReviewed: 36,
        paymentHistory: this.generatePaymentHistory(2, 100),
      },
      {
        id: '3',
        creditorName: 'Wells Fargo Auto Loan',
        accountType: 'auto_loan',
        accountNumber: '****9012',
        balance: 15750,
        paymentStatus: 'current',
        openDate: '2022-01-10',
        lastPaymentDate: '2024-08-01',
        monthsReviewed: 30,
        paymentHistory: this.generatePaymentHistory(2, 95),
      },
      {
        id: '4',
        creditorName: 'Bank of America Mortgage',
        accountType: 'mortgage',
        accountNumber: '****3456',
        balance: 285000,
        paymentStatus: 'current',
        openDate: '2019-06-30',
        lastPaymentDate: '2024-08-01',
        monthsReviewed: 60,
        paymentHistory: this.generatePaymentHistory(5, 100),
      },
    ];
  }

  static generateCreditInquiries(): CreditInquiry[] {
    return [
      {
        date: '2024-07-15',
        creditorName: 'Capital One',
        type: 'soft',
      },
      {
        date: '2024-06-02',
        creditorName: 'Chase Bank',
        type: 'hard',
      },
      {
        date: '2024-04-18',
        creditorName: 'Credit Karma',
        type: 'soft',
      },
      {
        date: '2024-03-10',
        creditorName: 'Wells Fargo',
        type: 'hard',
      },
    ];
  }

  static generateCreditReportSummary(): CreditReportSummary {
    const accounts = this.generateCreditAccounts();
    const inquiries = this.generateCreditInquiries();

    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
    const totalCreditLimit = accounts
      .filter(account => account.creditLimit)
      .reduce((sum, account) => sum + (account.creditLimit || 0), 0);

    const utilizationRate = totalCreditLimit > 0 ? totalBalance / totalCreditLimit : 0;

    return {
      accounts,
      inquiries,
      totalAccounts: accounts.length,
      openAccounts: accounts.filter(account => account.paymentStatus !== 'charge_off').length,
      totalBalance,
      totalCreditLimit,
      utilizationRate,
      averageAccountAge: 42, // months
      paymentHistory: {
        onTimePercentage: 98.5,
        totalPayments: 180,
        latePayments: 3,
      },
    };
  }

  static generateCreditScore(): CreditScore {
    return {
      score: 742,
      scoreDate: new Date().toISOString(),
      bureau: 'Experian',
      scoreRange: {
        min: 300,
        max: 850,
      },
      factors: [
        {
          code: 'PH01',
          description: 'Payment history is excellent with 98% on-time payments',
          impact: 'positive',
        },
        {
          code: 'CU02',
          description: 'Credit utilization is low at 25%',
          impact: 'positive',
        },
        {
          code: 'AH03',
          description: 'Average account age of 3.5 years is good',
          impact: 'positive',
        },
        {
          code: 'CM04',
          description: 'Good mix of credit types (cards, auto, mortgage)',
          impact: 'positive',
        },
        {
          code: 'NI05',
          description: '2 hard inquiries in the last 12 months',
          impact: 'neutral',
        },
      ],
    };
  }

  static generateAlerts() {
    return [
      {
        id: '1',
        type: 'score_change',
        title: 'Credit Score Increased',
        message: 'Your credit score went up by 12 points to 742',
        date: '2 hours ago',
        icon: 'trending-up',
        color: '#059669',
        unread: true,
        severity: 'positive',
      },
      {
        id: '2',
        type: 'new_account',
        title: 'New Account Detected',
        message: 'A new credit card account was opened with Capital One',
        date: '1 day ago',
        icon: 'card',
        color: '#D97706',
        unread: true,
        severity: 'warning',
      },
      {
        id: '3',
        type: 'payment_due',
        title: 'Payment Due Reminder',
        message: 'Chase Freedom payment due in 3 days ($125 minimum)',
        date: '2 days ago',
        icon: 'calendar',
        color: '#2563EB',
        unread: false,
        severity: 'info',
      },
      {
        id: '4',
        type: 'inquiry',
        title: 'Credit Inquiry',
        message: 'Soft inquiry from Credit Karma for monitoring',
        date: '1 week ago',
        icon: 'search',
        color: '#6B7280',
        unread: false,
        severity: 'neutral',
      },
      {
        id: '5',
        type: 'utilization',
        title: 'Credit Utilization Alert',
        message: 'Credit utilization increased to 28% - consider paying down balances',
        date: '2 weeks ago',
        icon: 'pie-chart',
        color: '#D97706',
        unread: false,
        severity: 'warning',
      },
    ];
  }

  static generateImprovementTips() {
    return [
      {
        id: '1',
        category: 'payment_history',
        title: 'Keep Making On-Time Payments',
        description:
          'Your excellent payment history is your strongest factor. Continue making all payments on time.',
        impact: 'high',
        timeframe: 'ongoing',
        priority: 1,
      },
      {
        id: '2',
        category: 'credit_utilization',
        title: 'Reduce Credit Card Balances',
        description:
          'Pay down your credit card balances to below 10% of limits for maximum score benefit.',
        impact: 'high',
        timeframe: '1-2 months',
        priority: 2,
        potentialGain: '15-25 points',
      },
      {
        id: '3',
        category: 'credit_mix',
        title: 'Maintain Credit Mix',
        description:
          'Your good mix of credit types (cards, auto, mortgage) positively impacts your score.',
        impact: 'medium',
        timeframe: 'ongoing',
        priority: 3,
      },
      {
        id: '4',
        category: 'account_age',
        title: 'Keep Old Accounts Open',
        description:
          "Don't close your oldest credit cards as they help maintain your credit history length.",
        impact: 'medium',
        timeframe: 'ongoing',
        priority: 4,
      },
    ];
  }

  static generateUserProfiles() {
    return {
      excellent: {
        user: {
          id: 'user-excellent',
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          firstName: 'Sarah',
          lastName: 'Johnson',
        },
        creditScore: {
          score: 805,
          category: 'excellent',
          factors: [
            {description: 'Perfect payment history', impact: 'positive'},
            {description: 'Very low credit utilization (8%)', impact: 'positive'},
            {description: 'Long credit history (12 years)', impact: 'positive'},
          ],
        },
      },
      good: {
        user: {
          id: 'user-good',
          name: 'Demo User',
          email: 'demo@creditguard.com',
          firstName: 'Demo',
          lastName: 'User',
        },
        creditScore: {
          score: 742,
          category: 'good',
          factors: this.generateCreditScore().factors,
        },
      },
      fair: {
        user: {
          id: 'user-fair',
          name: 'Mike Chen',
          email: 'mike@example.com',
          firstName: 'Mike',
          lastName: 'Chen',
        },
        creditScore: {
          score: 625,
          category: 'fair',
          factors: [
            {description: 'Some late payments in the past', impact: 'negative'},
            {description: 'High credit utilization (65%)', impact: 'negative'},
            {description: 'Short credit history (3 years)', impact: 'neutral'},
          ],
        },
      },
      poor: {
        user: {
          id: 'user-poor',
          name: 'Lisa Wong',
          email: 'lisa@example.com',
          firstName: 'Lisa',
          lastName: 'Wong',
        },
        creditScore: {
          score: 545,
          category: 'poor',
          factors: [
            {description: 'Multiple late payments', impact: 'negative'},
            {description: 'Maxed out credit cards', impact: 'negative'},
            {description: 'Recent collection account', impact: 'negative'},
          ],
        },
      },
    };
  }
}

export default MockDataService;
