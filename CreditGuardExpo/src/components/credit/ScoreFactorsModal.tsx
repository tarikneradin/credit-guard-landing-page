import React from 'react';
import {View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {CreditScoreFactor} from '../../types/api';

interface ScoreFactorsModalProps {
  visible: boolean;
  onClose: () => void;
  factors: CreditScoreFactor[];
  score: number;
  bureau: string;
}

export const ScoreFactorsModal: React.FC<ScoreFactorsModalProps> = ({
  visible,
  onClose,
  factors,
  score,
  bureau,
}) => {
  const {theme} = useTheme();

  const getImpactIcon = (impact: 'positive' | 'negative' | 'neutral') => {
    switch (impact) {
      case 'positive':
        return 'trending-up';
      case 'negative':
        return 'trending-down';
      case 'neutral':
        return 'remove';
    }
  };

  const getImpactColor = (impact: 'positive' | 'negative' | 'neutral') => {
    switch (impact) {
      case 'positive':
        return theme.colors.success;
      case 'negative':
        return theme.colors.error;
      case 'neutral':
        return theme.colors.text.secondary;
    }
  };

  const getImpactLabel = (impact: 'positive' | 'negative' | 'neutral') => {
    switch (impact) {
      case 'positive':
        return 'Helping';
      case 'negative':
        return 'Hurting';
      case 'neutral':
        return 'Neutral';
    }
  };

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
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: theme.spacing.xl,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.xxxl,
    },
    descriptionCard: {
      backgroundColor: theme.colors.accent + '10',
      borderRadius: 16,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.accent,
    },
    descriptionText: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.primary,
      lineHeight: 22,
    },
    sectionTitle: {
      ...theme.textStyles.headline4,
      color: theme.colors.text.primary,
      fontWeight: '600',
      marginBottom: theme.spacing.lg,
      marginTop: theme.spacing.md,
    },
    factorCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
    },
    factorHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    factorIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    factorCode: {
      ...theme.textStyles.caption,
      color: theme.colors.text.tertiary,
      fontWeight: '600',
      backgroundColor: theme.colors.surfaceSecondary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: 4,
    },
    factorImpactBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: 12,
      marginLeft: 'auto',
    },
    factorImpactText: {
      ...theme.textStyles.caption,
      fontWeight: '600',
      marginLeft: 4,
    },
    factorDescription: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.primary,
      lineHeight: 22,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.xxxl,
    },
    emptyStateIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.surfaceSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.lg,
    },
    emptyStateText: {
      ...theme.textStyles.bodyLarge,
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
  });

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <View
              style={[
                styles.headerIcon,
                {backgroundColor: theme.colors.accent + '15'},
              ]}>
              <Ionicons name="list" size={36} color={theme.colors.accent} />
            </View>
            <Text style={styles.headerTitle}>Score Factors</Text>
            <Text style={styles.headerSubtitle}>
              {bureau} • Score: {score}
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Description */}
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionText}>
              These factors are affecting your credit score. Focus on the negative factors to
              improve your score over time.
            </Text>
          </View>

          {/* Factors List */}
          {factors && factors.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>
                {factors.length} Factor{factors.length !== 1 ? 's' : ''} Identified
              </Text>
              {factors.map((factor, index) => {
                const impactColor = getImpactColor(factor.impact);
                return (
                  <View key={index} style={styles.factorCard}>
                    <View style={styles.factorHeader}>
                      <View
                        style={[
                          styles.factorIconContainer,
                          {backgroundColor: impactColor + '15'},
                        ]}>
                        <Ionicons
                          name={getImpactIcon(factor.impact)}
                          size={20}
                          color={impactColor}
                        />
                      </View>
                      <Text style={styles.factorCode}>{factor.code}</Text>
                      <View
                        style={[
                          styles.factorImpactBadge,
                          {backgroundColor: impactColor + '15'},
                        ]}>
                        <Ionicons
                          name={
                            factor.impact === 'positive'
                              ? 'arrow-up'
                              : factor.impact === 'negative'
                                ? 'arrow-down'
                                : 'remove'
                          }
                          size={12}
                          color={impactColor}
                        />
                        <Text style={[styles.factorImpactText, {color: impactColor}]}>
                          {getImpactLabel(factor.impact)}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.factorDescription}>{factor.description}</Text>
                  </View>
                );
              })}
            </>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon}>
                <Ionicons
                  name="information-circle-outline"
                  size={40}
                  color={theme.colors.text.tertiary}
                />
              </View>
              <Text style={styles.emptyStateText}>
                No score factors available at this time.
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};
