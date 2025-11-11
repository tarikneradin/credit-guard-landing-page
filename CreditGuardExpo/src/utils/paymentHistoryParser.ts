import {PaymentHistory, PaymentRecord, PaymentStatus} from '../types';
import {CreditAccount} from '../types/api';

// Convert API payment status to our internal status
const convertApiPaymentStatus = (monthType: string, value: string): PaymentStatus => {
  if (monthType === 'POSITIVE' && value === 'PAYS_AS_AGREED') {
    return 'current';
  }
  if (monthType === 'NEGATIVE' || value.includes('LATE')) {
    return 'late';
  }
  if (value === 'NOT_REPORTED' || value === 'UNAVAILABLE' || monthType === 'NO_DATA') {
    return 'unknown';
  }
  // Default to unknown for any unhandled cases
  return 'unknown';
};

// Parse API payment history into our internal format
export const parseApiPaymentHistory = (
  apiPaymentHistory?: CreditAccount['paymentHistory'],
): PaymentHistory | null => {
  if (!apiPaymentHistory || !Array.isArray(apiPaymentHistory) || apiPaymentHistory.length === 0) {
    return null;
  }

  const payments: PaymentRecord[] = [];
  const monthNames = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ];

  // Process each year
  apiPaymentHistory.forEach(yearData => {
    const year = yearData.year;

    // Process each month in the year
    monthNames.forEach((monthName, monthIndex) => {
      const monthData = yearData[monthName as keyof typeof yearData];

      if (
        monthData &&
        typeof monthData === 'object' &&
        'monthType' in monthData &&
        'value' in monthData
      ) {
        const status = convertApiPaymentStatus(monthData.monthType, monthData.value);

        payments.push({
          year,
          month: monthIndex + 1, // Convert 0-based index to 1-based month
          status,
        });
      }
    });
  });

  // Calculate on-time payment percentage
  const currentPayments = payments.filter(p => p.status === 'current');
  const totalReportedPayments = payments.filter(p => p.status !== 'unknown');

  const onTimePercentage =
    totalReportedPayments.length > 0
      ? Math.round((currentPayments.length / totalReportedPayments.length) * 100)
      : 0;

  return {
    onTimePaymentPercentage: onTimePercentage,
    payments,
  };
};

// Helper function to check if payment history exists and has data
export const hasPaymentHistoryData = (paymentHistory?: PaymentHistory | null): boolean => {
  return !!(paymentHistory && paymentHistory.payments && paymentHistory.payments.length > 0);
};
