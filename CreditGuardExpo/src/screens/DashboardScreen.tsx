import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

export const DashboardScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back, Demo!</Text>
        <Text style={styles.subtitle}>Your Credit Overview</Text>
      </View>

      <View style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>Credit Score</Text>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreNumber}>752</Text>
          <Text style={styles.scoreStatus}>Excellent</Text>
        </View>
        <Text style={styles.lastUpdated}>Last updated: Today</Text>
      </View>

      <View style={styles.quickStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Credit Utilization</Text>
          <Text style={styles.statValue}>23%</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Payment History</Text>
          <Text style={styles.statValue}>98%</Text>
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
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  scoreCard: {
    margin: 20,
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EFF6FF',
    borderWidth: 8,
    borderColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  scoreStatus: {
    fontSize: 12,
    color: '#6B7280',
  },
  lastUpdated: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  quickStats: {
    flexDirection: 'row',
    margin: 20,
    marginTop: 0,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563EB',
  },
});
