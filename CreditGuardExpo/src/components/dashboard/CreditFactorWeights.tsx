import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {Ionicons} from '@expo/vector-icons';

interface CreditFactor {
  name: string;
  weight: number;
  icon: string;
  color: string;
}

export const CreditFactorWeights: React.FC = () => {
  const {theme} = useTheme();

  const factors: CreditFactor[] = [
    {
      name: 'Payment History',
      weight: 40,
      icon: 'checkmark-circle',
      color: theme.colors.success,
    },
    {
      name: 'Depth of Credit',
      weight: 21,
      icon: 'layers',
      color: theme.colors.accent,
    },
    {
      name: 'Credit Utilization',
      weight: 20,
      icon: 'pie-chart',
      color: theme.colors.warning,
    },
    {
      name: 'Balances',
      weight: 11,
      icon: 'wallet',
      color: theme.colors.info,
    },
    {
      name: 'Recent Credit',
      weight: 5,
      icon: 'time',
      color: theme.colors.text.secondary,
    },
    {
      name: 'Available Credit',
      weight: 3,
      icon: 'card',
      color: theme.colors.text.tertiary,
    },
  ];

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: theme.spacing.lg,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    headerIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.accent + '15',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      ...theme.textStyles.headline4,
      color: theme.colors.text.primary,
      fontWeight: '600',
      flex: 1,
    },
    subtitle: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.lg,
      lineHeight: 18,
    },
    factorRow: {
      marginBottom: theme.spacing.md,
    },
    factorHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    factorInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      flex: 1,
    },
    factorIconContainer: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    factorName: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.primary,
      fontWeight: '500',
    },
    factorWeight: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.primary,
      fontWeight: '700',
    },
    progressBarContainer: {
      height: 8,
      backgroundColor: theme.colors.border.light,
      borderRadius: 4,
      overflow: 'hidden',
      marginLeft: 36, // Align with factor name (icon width + gap)
    },
    progressBar: {
      height: '100%',
      borderRadius: 4,
    },
    infoBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.accent + '10',
      padding: theme.spacing.md,
      borderRadius: 12,
      marginTop: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    infoText: {
      ...theme.textStyles.caption,
      color: theme.colors.text.secondary,
      flex: 1,
      lineHeight: 16,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="analytics" size={18} color={theme.colors.accent} />
        </View>
        <Text style={styles.title}>Score Factors</Text>
      </View>

      <Text style={styles.subtitle}>How VantageScore 3.0 is calculated</Text>

      {factors.map((factor, index) => (
        <View key={index} style={styles.factorRow}>
          <View style={styles.factorHeader}>
            <View style={styles.factorInfo}>
              <View style={[styles.factorIconContainer, {backgroundColor: factor.color + '20'}]}>
                <Ionicons name={factor.icon as any} size={14} color={factor.color} />
              </View>
              <Text style={styles.factorName}>{factor.name}</Text>
            </View>
            <Text style={styles.factorWeight}>{factor.weight}%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${factor.weight}%`,
                  backgroundColor: factor.color,
                },
              ]}
            />
          </View>
        </View>
      ))}

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={16} color={theme.colors.accent} />
        <Text style={styles.infoText}>
          Payment history has the biggest impact on your score. Focus on paying bills on time to
          improve your credit.
        </Text>
      </View>
    </View>
  );
};
