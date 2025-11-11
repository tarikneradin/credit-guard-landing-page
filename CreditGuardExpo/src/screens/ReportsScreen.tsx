import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

export const ReportsScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Credit Report</Text>
        <Text style={styles.subtitle}>Detailed view of your credit information</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Credit Accounts</Text>

        <View style={styles.accountCard}>
          <Text style={styles.accountName}>Chase Freedom Card</Text>
          <Text style={styles.accountDetails}>Balance: $1,250 / $5,000</Text>
          <Text style={styles.accountStatus}>Status: Good Standing</Text>
        </View>

        <View style={styles.accountCard}>
          <Text style={styles.accountName}>Bank of America Mortgage</Text>
          <Text style={styles.accountDetails}>Balance: $285,000 / $320,000</Text>
          <Text style={styles.accountStatus}>Status: Current</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Inquiries</Text>
        <View style={styles.inquiryCard}>
          <Text style={styles.inquiryName}>Chase Bank - Credit Card</Text>
          <Text style={styles.inquiryDate}>December 15, 2024</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  section: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  accountCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  accountDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  accountStatus: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  inquiryCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inquiryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  inquiryDate: {
    fontSize: 14,
    color: '#6B7280',
  },
});
