import React from 'react';
import {View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../contexts/ThemeContext';
import {Ionicons} from '@expo/vector-icons';

interface CreditFactorWeightsModalProps {
  visible: boolean;
  onClose: () => void;
}

interface CreditFactor {
  name: string;
  weight: number;
  icon: string;
  color: string;
}

export const CreditFactorWeightsModal: React.FC<CreditFactorWeightsModalProps> = ({
  visible,
  onClose,
}) => {
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
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.light,
      paddingBottom: theme.spacing.lg,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    closeButton: {
      position: 'absolute',
      top: theme.spacing.md,
      right: theme.spacing.xl,
      zIndex: 10,
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceSecondary,
    },
    headerContent: {
      alignItems: 'center',
      paddingTop: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
    },
    headerIcon: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: theme.colors.accent + '15',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
    },
    headerTitle: {
      ...theme.textStyles.headline3,
      color: theme.colors.text.primary,
      fontWeight: '700',
      marginBottom: theme.spacing.xs,
    },
    headerSubtitle: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: theme.spacing.xl,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.xxxl,
    },
    factorRow: {
      marginBottom: theme.spacing.lg,
    },
    factorHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    factorInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      flex: 1,
    },
    factorIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    factorName: {
      ...theme.textStyles.bodyLarge,
      color: theme.colors.text.primary,
      fontWeight: '600',
    },
    factorWeight: {
      ...theme.textStyles.headline4,
      color: theme.colors.text.primary,
      fontWeight: '700',
    },
    progressBarContainer: {
      height: 10,
      backgroundColor: theme.colors.border.light,
      borderRadius: 5,
      overflow: 'hidden',
      marginLeft: 44, // Align with factor name (icon width + gap)
    },
    progressBar: {
      height: '100%',
      borderRadius: 5,
    },
    infoBox: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: theme.colors.accent + '10',
      padding: theme.spacing.lg,
      borderRadius: 16,
      marginTop: theme.spacing.xl,
      gap: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.accent + '20',
    },
    infoText: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.secondary,
      flex: 1,
      lineHeight: 20,
    },
  });

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              <Ionicons name="analytics" size={36} color={theme.colors.accent} />
            </View>
            <Text style={styles.headerTitle}>Credit Score Factors</Text>
            <Text style={styles.headerSubtitle}>Understanding what impacts your credit score</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {factors.map((factor, index) => (
            <View key={index} style={styles.factorRow}>
              <View style={styles.factorHeader}>
                <View style={styles.factorInfo}>
                  <View
                    style={[styles.factorIconContainer, {backgroundColor: factor.color + '20'}]}>
                    <Ionicons name={factor.icon as any} size={18} color={factor.color} />
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
            <Ionicons name="bulb" size={20} color={theme.colors.accent} />
            <Text style={styles.infoText}>
              <Text style={{fontWeight: '600'}}>Tip: </Text>
              Payment history has the biggest impact on your score. Focus on paying all bills on
              time to improve your credit quickly.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};
