import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {PaymentHistory as PaymentHistoryType, PaymentStatus} from '../types';
import {Colors} from '../constants/colors';
import {hasPaymentHistoryData} from '../utils/paymentHistoryParser';

interface PaymentHistoryProps {
  paymentHistory: PaymentHistoryType;
}

const MONTH_LABELS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

const getStatusColor = (status: PaymentStatus): string => {
  switch (status) {
    case 'current':
      return Colors.success;
    case 'late':
      return Colors.error;
    case 'derogatory':
      return Colors.warning;
    case 'unknown':
    default:
      return Colors.border.medium;
  }
};

const getStatusIcon = (status: PaymentStatus): string => {
  switch (status) {
    case 'current':
      return '✓';
    case 'late':
      return '✕';
    case 'derogatory':
      return '⚠';
    case 'unknown':
    default:
      return '•';
  }
};

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({paymentHistory}) => {
  // Check if payment history has data
  if (!hasPaymentHistoryData(paymentHistory)) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Payment History</Text>
          <Text style={styles.noDataText}>Payment history doesn't exist for this account.</Text>
        </View>
      </View>
    );
  }

  // Group payments by year
  const paymentsByYear = paymentHistory.payments.reduce(
    (acc, payment) => {
      if (!acc[payment.year]) {
        acc[payment.year] = [];
      }
      acc[payment.year].push(payment);
      return acc;
    },
    {} as Record<number, typeof paymentHistory.payments>,
  );

  // Sort years in descending order (most recent first)
  const years = Object.keys(paymentsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Payment History</Text>
        <Text style={styles.percentage}>
          You've made{' '}
          <Text style={styles.percentageBold}>{paymentHistory.onTimePaymentPercentage}%</Text> of
          payments for this account on time.
        </Text>
      </View>

      {/* Month labels */}
      <View style={styles.monthLabels}>
        <View style={styles.yearColumn} />
        {MONTH_LABELS.map((month, index) => (
          <Text key={index} style={styles.monthLabel}>
            {month}
          </Text>
        ))}
      </View>

      {/* Payment grid */}
      {years.map(year => {
        const yearPayments = paymentsByYear[year];
        // Create array of 12 months, fill with payments or null
        const monthsArray = Array.from({length: 12}, (_, monthIndex) => {
          return yearPayments.find(p => p.month === monthIndex + 1) || null;
        });

        return (
          <View key={year} style={styles.yearRow}>
            <View style={styles.yearColumn}>
              <Text style={styles.yearLabel}>{year}</Text>
            </View>
            {monthsArray.map((payment, monthIndex) => (
              <View
                key={monthIndex}
                style={[
                  styles.paymentCell,
                  payment && {
                    backgroundColor: getStatusColor(payment.status),
                  },
                ]}>
                {payment && <Text style={styles.paymentIcon}>{getStatusIcon(payment.status)}</Text>}
              </View>
            ))}
          </View>
        );
      })}

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendIcon, {backgroundColor: Colors.success}]}>
            <Text style={styles.legendIconText}>✓</Text>
          </View>
          <Text style={styles.legendText}>Current</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendIcon, {backgroundColor: Colors.error}]}>
            <Text style={styles.legendIconText}>✕</Text>
          </View>
          <Text style={styles.legendText}>Late</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendIcon, {backgroundColor: Colors.border.medium}]}>
            <Text style={styles.legendIconText}>•</Text>
          </View>
          <Text style={styles.legendText}>Unknown</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendIcon, {backgroundColor: Colors.warning}]}>
            <Text style={styles.legendIconText}>⚠</Text>
          </View>
          <Text style={styles.legendText}>Derogatory</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  percentage: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  percentageBold: {
    fontWeight: '700',
    color: Colors.text.primary,
  },
  noDataText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  monthLabels: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  monthLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
  yearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  yearColumn: {
    width: 40,
    marginRight: 4,
  },
  yearLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  paymentCell: {
    flex: 1,
    aspectRatio: 1,
    marginHorizontal: 2,
    borderRadius: 4,
    backgroundColor: Colors.surfaceTertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentIcon: {
    fontSize: 10,
    color: Colors.text.inverse,
    fontWeight: 'bold',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendIcon: {
    width: 20,
    height: 20,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  legendIconText: {
    fontSize: 10,
    color: Colors.text.inverse,
    fontWeight: 'bold',
  },
  legendText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
});
