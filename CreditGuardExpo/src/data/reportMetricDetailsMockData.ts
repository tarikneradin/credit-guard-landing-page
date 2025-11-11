import {ReportMetricType} from '../components/reports/ReportMetricDetailModal';

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

export const getReportMetricDetails = (
  metricType: ReportMetricType,
  reportSummary: any,
): MetricDetail => {
  switch (metricType) {
    case 'total_accounts':
      return {
        title: 'Total Accounts',
        currentValue: reportSummary?.totalAccounts?.toString() || '0',
        description:
          "Your total credit accounts include all credit cards, loans, mortgages, and lines of credit. This metric shows lenders your experience managing different types of credit, which accounts for about 10% of your FICO score.",
        icon: 'card-outline',
        color: '#6366F1',
        sections: [
          {
            title: 'Account Breakdown',
            items: [
              {
                label: 'Credit Cards',
                value: '6',
                subtext: 'Revolving credit accounts',
              },
              {
                label: 'Auto Loans',
                value: '1',
                subtext: 'Installment loans',
              },
              {
                label: 'Mortgages',
                value: '0',
                subtext: 'Home loans',
              },
              {
                label: 'Personal Loans',
                value: '0',
                subtext: 'Other installment loans',
              },
            ],
          },
          {
            title: 'Account Status',
            items: [
              {
                label: 'Open Accounts',
                value: reportSummary?.openAccounts?.toString() || '0',
                subtext: 'Currently active',
              },
              {
                label: 'Closed Accounts',
                value: '2',
                subtext: 'Paid off or closed',
              },
              {
                label: 'Accounts in Good Standing',
                value: reportSummary?.totalAccounts?.toString() || '0',
                subtext: 'No delinquencies',
              },
            ],
          },
        ],
        tips: [
          'Maintain a healthy mix of credit types (revolving and installment)',
          'Keep old accounts open to maintain credit history length',
          "Avoid opening too many accounts at once - it can signal risk to lenders",
          'Focus on quality over quantity when building credit',
        ],
      };

    case 'open_accounts':
      return {
        title: 'Open Accounts',
        currentValue: reportSummary?.openAccounts?.toString() || '0',
        description:
          'Open accounts are credit accounts that are currently active and have not been closed. These accounts contribute to your credit utilization, payment history, and overall credit profile.',
        icon: 'checkmark-circle-outline',
        color: '#10B981',
        sections: [
          {
            title: 'Active Account Details',
            items: [
              {
                label: 'Total Open Accounts',
                value: reportSummary?.openAccounts?.toString() || '0',
              },
              {
                label: 'Average Account Age',
                value: `${reportSummary?.averageAccountAge || 0} months`,
                subtext: 'Older is better',
              },
              {
                label: 'Newest Account',
                value: '18 months',
                subtext: 'Age of most recent account',
              },
            ],
          },
          {
            title: 'Account Activity',
            items: [
              {
                label: 'Accounts with Balances',
                value: '4',
                subtext: 'Carrying a balance',
              },
              {
                label: 'Zero-Balance Accounts',
                value: '2',
                subtext: 'Paid in full',
              },
              {
                label: 'Accounts Updated This Month',
                value: '6',
                subtext: 'Recently reported',
              },
            ],
          },
        ],
        tips: [
          'Keep accounts active by making small purchases occasionally',
          'Never close your oldest account - it anchors your credit history',
          'Monitor all open accounts regularly for unauthorized activity',
          'Consider setting up autopay to maintain good standing',
        ],
      };

    case 'total_balance':
      return {
        title: 'Total Balance',
        currentValue: `$${reportSummary?.totalBalance?.toLocaleString() || '0'}`,
        description:
          'Your total balance represents the sum of all outstanding debt across your credit accounts. Managing this effectively is crucial for maintaining a healthy credit profile and reducing financial stress.',
        icon: 'wallet-outline',
        color: '#F59E0B',
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
                value: '$8,450',
                subtext: 'Auto, personal, student loans',
              },
              {
                label: 'Total Debt',
                value: `$${(reportSummary?.totalBalance + 8450)?.toLocaleString() || '8,450'}`,
                subtext: 'All outstanding balances',
              },
            ],
          },
          {
            title: 'Monthly Payment Impact',
            items: [
              {
                label: 'Minimum Payments Due',
                value: '$285',
                subtext: 'Across all accounts',
              },
              {
                label: 'Recommended Payment',
                value: '$650',
                subtext: 'To reduce balance faster',
              },
              {
                label: 'Interest Charges (Monthly)',
                value: '$128',
                subtext: 'Current average APR: 18.5%',
              },
            ],
          },
        ],
        tips: [
          'Pay more than the minimum whenever possible to reduce interest',
          'Focus on paying off high-interest cards first (avalanche method)',
          'Consider balance transfers to lower APR cards',
          'Create a debt payoff plan with specific monthly goals',
        ],
      };

    case 'credit_limit':
      return {
        title: 'Total Credit Limit',
        currentValue: `$${reportSummary?.totalCreditLimit?.toLocaleString() || '0'}`,
        description:
          'Your total credit limit is the sum of all credit limits across your revolving credit accounts. Having a higher credit limit (while maintaining low balances) improves your credit utilization ratio.',
        icon: 'trending-up-outline',
        color: '#3B82F6',
        sections: [
          {
            title: 'Credit Limit Details',
            items: [
              {
                label: 'Total Available Credit',
                value: `$${reportSummary?.totalCreditLimit?.toLocaleString() || '0'}`,
                subtext: 'Combined limits',
              },
              {
                label: 'Current Balance',
                value: `$${reportSummary?.totalBalance?.toLocaleString() || '0'}`,
                subtext: 'Amount owed',
              },
              {
                label: 'Available to Borrow',
                value: `$${((reportSummary?.totalCreditLimit || 0) - (reportSummary?.totalBalance || 0))?.toLocaleString()}`,
                subtext: 'Unused credit',
              },
            ],
          },
          {
            title: 'Limit Growth Potential',
            items: [
              {
                label: 'Average Limit per Card',
                value: `$${Math.round((reportSummary?.totalCreditLimit || 0) / 6)?.toLocaleString()}`,
              },
              {
                label: 'Highest Card Limit',
                value: '$8,500',
              },
              {
                label: 'Lowest Card Limit',
                value: '$1,200',
              },
            ],
          },
        ],
        tips: [
          'Request credit limit increases every 6-12 months',
          "Don't increase spending when limits increase",
          'Higher limits improve your utilization ratio without paying down debt',
          'Maintain good payment history before requesting increases',
        ],
      };

    case 'credit_utilization':
      const utilizationRate = reportSummary?.utilizationRate
        ? Math.round(reportSummary.utilizationRate * 100)
        : 0;
      return {
        title: 'Credit Utilization',
        currentValue: `${utilizationRate}%`,
        description:
          "Credit utilization is the percentage of your available credit that you're currently using. This is one of the most important factors in your credit score, accounting for 30% of your FICO score. Experts recommend keeping it below 30%.",
        icon: 'pie-chart-outline',
        color: utilizationRate > 30 ? '#F59E0B' : '#10B981',
        sections: [
          {
            title: 'Current Utilization',
            items: [
              {
                label: 'Overall Utilization',
                value: `${utilizationRate}%`,
                subtext: utilizationRate < 30 ? 'Excellent' : utilizationRate < 50 ? 'Good' : 'Needs Improvement',
              },
              {
                label: 'Total Credit Used',
                value: `$${reportSummary?.totalBalance?.toLocaleString() || '0'}`,
              },
              {
                label: 'Total Credit Available',
                value: `$${reportSummary?.totalCreditLimit?.toLocaleString() || '0'}`,
              },
            ],
          },
          {
            title: 'Per-Card Utilization',
            items: [
              {
                label: 'Highest Card Utilization',
                value: '45%',
                subtext: 'Chase Freedom - $2,250/$5,000',
              },
              {
                label: 'Lowest Card Utilization',
                value: '8%',
                subtext: 'Amex Blue Cash - $680/$8,500',
              },
              {
                label: 'Cards Over 30% Utilization',
                value: '2 cards',
                subtext: 'Focus on these first',
              },
            ],
          },
        ],
        tips: [
          'Pay down balances on cards with utilization above 30%',
          'Request credit limit increases to lower utilization ratio',
          'Make multiple payments per month to keep balances low',
          'Use balance alerts to monitor utilization in real-time',
        ],
      };

    case 'average_age':
      return {
        title: 'Average Account Age',
        currentValue: `${reportSummary?.averageAccountAge || 0} months`,
        description:
          "The average age of your credit accounts shows how long you've been managing credit. Older accounts demonstrate a longer track record of credit management, which can positively impact your credit score (15% of FICO score).",
        icon: 'time-outline',
        color: '#3B82F6',
        sections: [
          {
            title: 'Account Age Breakdown',
            items: [
              {
                label: 'Average Account Age',
                value: `${reportSummary?.averageAccountAge || 0} months`,
                subtext: `${Math.round((reportSummary?.averageAccountAge || 0) / 12)} years`,
              },
              {
                label: 'Oldest Account',
                value: '6 years 8 months',
                subtext: 'Keep this account open',
              },
              {
                label: 'Newest Account',
                value: '1 year 6 months',
              },
            ],
          },
          {
            title: 'Credit History Length',
            items: [
              {
                label: 'Total Credit History',
                value: '6 years 8 months',
                subtext: 'Since first account opened',
              },
              {
                label: 'Accounts 5+ Years Old',
                value: '2 accounts',
                subtext: 'Anchor your credit history',
              },
              {
                label: 'Accounts Under 2 Years',
                value: '3 accounts',
              },
            ],
          },
        ],
        tips: [
          'Never close your oldest credit card account',
          'Keep old accounts active with small recurring charges',
          'Avoid opening too many new accounts at once',
          'Be strategic about when to close accounts',
        ],
      };

    case 'payment_history':
      const onTimePercentage = reportSummary?.paymentHistory?.onTimePercentage || 100;
      return {
        title: 'Payment History',
        currentValue: `${onTimePercentage}%`,
        description:
          'Payment history is the most important factor in your credit score, accounting for 35% of your FICO score. It shows how reliably you make payments on time across all your credit accounts.',
        icon: 'shield-checkmark-outline',
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
                label: 'Total Payments Made',
                value: '144',
                subtext: 'Over lifetime of accounts',
              },
              {
                label: 'Late Payments',
                value: (reportSummary?.paymentHistory?.latePayments || 0).toString(),
                subtext: 'Past 7 years',
              },
            ],
          },
          {
            title: 'Recent Payment Activity',
            items: [
              {
                label: 'Last 6 Months',
                value: '100%',
                subtext: 'All payments on time',
              },
              {
                label: 'Last 12 Months',
                value: `${onTimePercentage}%`,
                subtext: `${Math.round((onTimePercentage / 100) * 12)} on-time payments`,
              },
              {
                label: 'Consecutive On-Time Months',
                value: '18 months',
                subtext: 'Current streak',
              },
            ],
          },
        ],
        tips: [
          'Set up automatic minimum payments as a safety net',
          'Use calendar reminders 3-5 days before due dates',
          'Request due date changes to align with your income schedule',
          'One late payment can stay on your report for 7 years',
        ],
      };

    case 'late_payments':
      const latePayments = reportSummary?.paymentHistory?.latePayments || 0;
      return {
        title: 'Late Payments',
        currentValue: latePayments.toString(),
        description:
          'Late payments are one of the most damaging factors to your credit score. They remain on your credit report for 7 years and can significantly impact your ability to get approved for new credit.',
        icon: 'alert-circle-outline',
        color: latePayments > 0 ? '#EF4444' : '#10B981',
        sections: [
          {
            title: 'Late Payment History',
            items: [
              {
                label: 'Total Late Payments',
                value: latePayments.toString(),
                subtext: 'Past 7 years',
              },
              {
                label: '30+ Days Late',
                value: latePayments.toString(),
                subtext: 'Moderate impact',
              },
              {
                label: '60+ Days Late',
                value: '0',
                subtext: 'Severe impact',
              },
              {
                label: '90+ Days Late',
                value: '0',
                subtext: 'Critical impact',
              },
            ],
          },
          {
            title: 'Recovery Timeline',
            items: [
              {
                label: 'Time Since Last Late Payment',
                value: latePayments > 0 ? '8 months' : 'Never',
              },
              {
                label: 'Months Until Impact Lessens',
                value: latePayments > 0 ? '16 months' : 'N/A',
                subtext: 'Impact fades after 2 years',
              },
              {
                label: 'Months Until Removal',
                value: latePayments > 0 ? '78 months' : 'N/A',
                subtext: 'Removed after 7 years',
              },
            ],
          },
        ],
        tips: [
          'Focus on building a perfect payment record going forward',
          'Set up multiple payment reminders and automatic payments',
          'Contact creditors to request goodwill removal if circumstances were exceptional',
          'The impact of late payments diminishes significantly after 2 years',
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
