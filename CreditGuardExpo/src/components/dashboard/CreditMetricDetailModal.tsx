import React from 'react';
import {View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';

export type MetricType =
  | 'utilization'
  | 'payment_history'
  | 'total_accounts'
  | 'total_balance'
  | 'available_credit';

interface MetricDetail {
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

interface CreditMetricDetailModalProps {
  visible: boolean;
  onClose: () => void;
  metricType: MetricType;
  metricData: MetricDetail;
}

export const CreditMetricDetailModal: React.FC<CreditMetricDetailModalProps> = ({
  visible,
  onClose,
  metricType,
  metricData,
}) => {
  const {theme} = useTheme();

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles(theme).container} edges={['top']}>
        {/* Header */}
        <View style={styles(theme).header}>
          <TouchableOpacity onPress={onClose} style={styles(theme).closeButton}>
            <Ionicons name="close" size={28} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <View style={styles(theme).headerContent}>
            <View
              style={[
                styles(theme).headerIcon,
                {backgroundColor: metricData.color + '15'},
              ]}>
              <Ionicons
                name={metricData.icon as any}
                size={32}
                color={metricData.color}
              />
            </View>
            <Text style={styles(theme).headerTitle}>{metricData.title}</Text>
            <Text style={styles(theme).headerValue}>{metricData.currentValue}</Text>
          </View>
        </View>

        <ScrollView
          style={styles(theme).scrollView}
          contentContainerStyle={styles(theme).scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Description */}
          <View style={styles(theme).descriptionCard}>
            <Text style={styles(theme).descriptionText}>{metricData.description}</Text>
          </View>

          {/* Detail Sections */}
          {metricData.sections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles(theme).section}>
              <View style={styles(theme).sectionHeader}>
                <View style={styles(theme).sectionIconContainer}>
                  <Ionicons name="list" size={18} color={theme.colors.primary} />
                </View>
                <Text style={styles(theme).sectionTitle}>{section.title}</Text>
              </View>
              <View style={styles(theme).sectionContent}>
                {section.items.map((item, itemIndex) => (
                  <View
                    key={itemIndex}
                    style={[
                      styles(theme).detailRow,
                      itemIndex === section.items.length - 1 && {borderBottomWidth: 0},
                    ]}>
                    <View style={styles(theme).detailRowLeft}>
                      <Text style={styles(theme).detailLabel}>{item.label}</Text>
                      {item.subtext && (
                        <Text style={styles(theme).detailSubtext}>{item.subtext}</Text>
                      )}
                    </View>
                    <Text style={styles(theme).detailValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}

          {/* Tips */}
          {metricData.tips && metricData.tips.length > 0 && (
            <View style={styles(theme).tipsSection}>
              <View style={styles(theme).tipsHeader}>
                <Ionicons name="bulb" size={20} color={theme.colors.warning} />
                <Text style={styles(theme).tipsTitle}>Tips to Improve</Text>
              </View>
              {metricData.tips.map((tip, index) => (
                <View key={index} style={styles(theme).tipItem}>
                  <View style={styles(theme).tipBullet} />
                  <Text style={styles(theme).tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles(theme).bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      paddingBottom: theme.spacing.lg,
    },
    closeButton: {
      position: 'absolute',
      top: theme.spacing.md,
      left: theme.spacing.lg,
      zIndex: 10,
      padding: theme.spacing.xs,
    },
    headerContent: {
      alignItems: 'center',
      paddingTop: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
    },
    headerIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
    },
    headerTitle: {
      ...theme.textStyles.headline2,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.xs,
    },
    headerValue: {
      ...theme.textStyles.headline1,
      fontWeight: '800',
      color: theme.colors.primary,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: theme.spacing.lg,
    },
    descriptionCard: {
      backgroundColor: theme.colors.primary + '08',
      borderRadius: 12,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    descriptionText: {
      ...theme.textStyles.bodyLarge,
      color: theme.colors.text.primary,
      lineHeight: 24,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    sectionIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.primary + '15',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.sm,
    },
    sectionTitle: {
      ...theme.textStyles.headline4,
      fontWeight: '700',
      color: theme.colors.text.primary,
    },
    sectionContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    detailRowLeft: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    detailLabel: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
      marginBottom: 2,
    },
    detailSubtext: {
      ...theme.textStyles.caption,
      color: theme.colors.text.tertiary,
      marginTop: 2,
    },
    detailValue: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    tipsSection: {
      backgroundColor: theme.colors.warning + '08',
      borderRadius: 12,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    tipsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    tipsTitle: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginLeft: theme.spacing.sm,
    },
    tipItem: {
      flexDirection: 'row',
      marginBottom: theme.spacing.sm,
    },
    tipBullet: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.colors.warning,
      marginTop: 8,
      marginRight: theme.spacing.sm,
    },
    tipText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.primary,
      flex: 1,
      lineHeight: 22,
    },
    bottomPadding: {
      height: 40,
    },
  });
