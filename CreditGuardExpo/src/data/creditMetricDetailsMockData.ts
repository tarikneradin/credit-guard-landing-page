import {MetricType} from '../components/dashboard/CreditMetricDetailModal';

export interface MetricDetail {
  title: string;
  currentValue: string;
  description: string;
  icon: string;
  color: string;
  sections: {
    title: string;
    items: {
      label: string;
      value: string;
      subtext?: string;
    }[];
  }[];
  tips?: string[];
}

export const getCreditMetricDetails = (
  metricType: MetricType,
  reportSummary: any,
): MetricDetail => {
  switch (metricType) {
    case 'utilization':
      const utilizationRate = reportSummary?.utilizationRate
        ? Math.round(reportSummary.utilizationRate * 100)
        : 0;
      return {
        title: 'Credit Utilization',
        currentValue: `${utilizationRate}%`,
        description:
          "Credit utilization is the percentage of your available credit that you're currently using. Lower utilization (below 30%) is better for your credit score.",
        icon: 'pie-chart',
        color: '#6366F1',
        sections: [
          {
            title: 'Current Breakdown',
            items: [
              {
                label: 'Total Credit Limit',
                value: `$${reportSummary?.totalCreditLimit?.toLocaleString() || '0'}`,
                subtext: 'Combined limit across all credit cards',
              },
              {
                label: 'Total Balance',
                value: `$${reportSummary?.totalBalance?.toLocaleString() || '0'}`,
                subtext: 'Amount currently owed',
              },
              {
                label: 'Available Credit',
                value: `$${((reportSummary?.totalCreditLimit || 0) - (reportSummary?.totalBalance || 0)).toLocaleString()}`,
                subtext: 'Remaining credit you can use',
              },
            ],
          },
          {
            title: 'Utilization Impact',
            items: [
              {
                label: 'Current Utilization',
                value: `${utilizationRate}%`,
                subtext: utilizationRate < 30 ? 'Excellent' : utilizationRate < 50 ? 'Good' : 'Needs Improvement',
              },
              {
                label: 'Recommended Max',
                value: '30%',
                subtext: 'Keep below this for optimal score',
              },
            ],
          },
        ],
        tips: [
          'Pay down high-balance cards first to quickly reduce utilization',
          'Request credit limit increases to improve ratio (without increasing spending)',
          'Make multiple payments per month to keep reported balances low',
          'Set up balance alerts to stay aware of your utilization',
        ],
      };

    case 'payment_history':
      const onTimePercentage = reportSummary?.paymentHistory?.onTimePercentage
        ? Math.round(reportSummary.paymentHistory.onTimePercentage)
        : 0;
      return {
        title: 'Payment History',
        currentValue: `${onTimePercentage}%`,
        description:
          'Payment history shows how reliably you make payments on time. This is the most important factor in your credit score, accounting for 35% of your FICO score.',
        icon: 'checkmark-circle',
        color: '#10B981',
        sections: [
          {
            title: 'Payment Track Record',
            items: [
              {
                label: 'On-Time Payments',
                value: `${onTimePercentage}%`,
                subtext: 'Last 24 months',
              },
              {
                label: 'Late Payments',
                value: `${reportSummary?.paymentHistory?.latePayments || 0}`,
                subtext: 'Past 7 years',
              },
              {
                label: 'Missed Payments',
                value: `${reportSummary?.paymentHistory?.missedPayments || 0}`,
                subtext: 'Past 7 years',
              },
            ],
          },
          {
            title: 'Recent Activity',
            items: [
              {
                label: 'Last 6 Months',
                value: '100%',
                subtext: 'All payments on time',
              },
              {
                label: 'Last 12 Months',
                value: `${onTimePercentage}%`,
              },
            ],
          },
        ],
        tips: [
          'Set up automatic minimum payments to never miss a due date',
          'Use calendar reminders 3-5 days before payment due dates',
          'Request due date changes to align with your paycheck schedule',
          'Late payments stay on your report for 7 years, so consistency is key',
        ],
      };

    case 'total_accounts':
      return {
        title: 'Total Accounts',
        currentValue: `${reportSummary?.totalAccounts || 0}`,
        description:
          'Your total number of credit accounts includes all credit cards, loans, and lines of credit. A healthy mix of account types can positively impact your score.',
        icon: 'briefcase',
        color: '#F59E0B',
        sections: [
          {
            title: 'Account Breakdown',
            items: [
              {
                label: 'Credit Cards',
                value: `${reportSummary?.accounts?.creditCards || 0}`,
                subtext: 'Revolving accounts',
              },
              {
                label: 'Installment Loans',
                value: `${reportSummary?.accounts?.installmentLoans || 0}`,
                subtext: 'Auto, personal, student loans',
              },
              {
                label: 'Mortgage',
                value: `${reportSummary?.accounts?.mortgages || 0}`,
                subtext: 'Home loans',
              },
            ],
          },
          {
            title: 'Account Status',
            items: [
              {
                label: 'Open Accounts',
                value: `${reportSummary?.openAccounts || reportSummary?.totalAccounts || 0}`,
              },
              {
                label: 'Closed Accounts',
                value: `${reportSummary?.closedAccounts || 0}`,
              },
              {
                label: 'Accounts in Good Standing',
                value: `${reportSummary?.totalAccounts || 0}`,
                subtext: 'All current',
              },
            ],
          },
        ],
        tips: [
          'Keep old accounts open to maintain credit history length',
          'Maintain a mix of credit types (revolving and installment)',
          "Don't open too many new accounts at once",
          'Close accounts strategically to avoid hurting your score',
        ],
      };

    case 'total_balance':
      return {
        title: 'Total Balance',
        currentValue: `$${reportSummary?.totalBalance?.toLocaleString() || '0'}`,
        description:
          'Your total balance is the sum of all outstanding debt across your credit accounts. Managing this effectively is crucial for maintaining a healthy credit profile.',
        icon: 'cash',
        color: '#EF4444',
        sections: [
          {
            title: 'Balance Distribution',
            items: [
              {
                label: 'Credit Card Balances',
                value: `$${reportSummary?.totalBalance?.toLocaleString() || '0'}`,
                subtext: 'Revolving debt',
              },
              {
                label: 'Installment Loan Balances',
                value: '$0',
                subtext: 'Fixed payment loans',
              },
            ],
          },
          {
            title: 'Debt Management',
            items: [
              {
                label: 'Total Debt',
                value: `$${reportSummary?.totalBalance?.toLocaleString() || '0'}`,
              },
              {
                label: 'Total Credit Limit',
                value: `$${reportSummary?.totalCreditLimit?.toLocaleString() || '0'}`,
              },
              {
                label: 'Debt-to-Credit Ratio',
                value: `${Math.round((reportSummary?.utilizationRate || 0) * 100)}%`,
              },
            ],
          },
        ],
        tips: [
          'Create a debt payoff plan starting with highest-interest cards',
          'Consider balance transfer offers to reduce interest charges',
          'Pay more than the minimum whenever possible',
          'Track your progress monthly to stay motivated',
        ],
      };

    case 'available_credit':
      const availableCredit =
        (reportSummary?.totalCreditLimit || 0) - (reportSummary?.totalBalance || 0);
      return {
        title: 'Available Credit',
        currentValue: `$${availableCredit.toLocaleString()}`,
        description:
          'Available credit is the amount of credit you have left to use across all your accounts. Having more available credit (while using less) improves your credit score.',
        icon: 'wallet',
        color: '#8B5CF6',
        sections: [
          {
            title: 'Credit Availability',
            items: [
              {
                label: 'Total Credit Limit',
                value: `$${reportSummary?.totalCreditLimit?.toLocaleString() || '0'}`,
              },
              {
                label: 'Used Credit',
                value: `$${reportSummary?.totalBalance?.toLocaleString() || '0'}`,
              },
              {
                label: 'Available to Use',
                value: `$${availableCredit.toLocaleString()}`,
                subtext: 'Remaining credit across all accounts',
              },
            ],
          },
          {
            title: 'Utilization Impact',
            items: [
              {
                label: 'Current Usage',
                value: `${Math.round((reportSummary?.utilizationRate || 0) * 100)}%`,
              },
              {
                label: 'Recommended Max',
                value: '30%',
                subtext: 'To maintain optimal score',
              },
            ],
          },
        ],
        tips: [
          'Request periodic credit limit increases to boost available credit',
          'Avoid maxing out cards even if you pay them off monthly',
          'Consider keeping unused cards open for the available credit',
          'Use credit limit increases strategically without increasing spending',
        ],
      };

    default:
      return {
        title: 'Credit Metric',
        currentValue: '--',
        description: 'Details for this metric are currently unavailable.',
        icon: 'information-circle',
        color: '#6366F1',
        sections: [],
        tips: [],
      };
  }
};
