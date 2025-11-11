import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Colors, TextStyles, Spacing} from '../../constants';
import {createStyles} from '../../utils/styles';

interface CreditFactorData {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

interface CreditReportSummaryProps {
  factors: CreditFactorData[];
  lastUpdated: string;
  isLoading?: boolean;
  onViewFullReport?: () => void;
}

export const CreditReportSummary: React.FC<CreditReportSummaryProps> = ({
  factors,
  lastUpdated,
  isLoading = false,
  onViewFullReport,
}) => {
  const getImpactColor = (impact: CreditFactorData['impact']) => {
    switch (impact) {
      case 'positive':
        return Colors.success;
      case 'negative':
        return Colors.error;
      case 'neutral':
        return Colors.text.secondary;
      default:
        return Colors.text.secondary;
    }
  };

  const getImpactIcon = (impact: CreditFactorData['impact']) => {
    switch (impact) {
      case 'positive':
        return '↗️';
      case 'negative':
        return '↘️';
      case 'neutral':
        return '➡️';
      default:
        return '➡️';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Credit Report Summary</Text>
        </View>
        <View style={styles.loadingState}>
          <Text style={styles.loadingText}>Loading report summary...</Text>
        </View>
      </View>
    );
  }

  const positiveFactors = factors.filter(f => f.impact === 'positive');
  const negativeFactors = factors.filter(f => f.impact === 'negative');
  const displayFactors = factors.slice(0, 4);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Credit Report Summary</Text>
        <Text style={styles.subtitle}>Last updated {formatDate(lastUpdated)}</Text>
      </View>

      <View style={styles.summaryStats}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, {color: Colors.success}]}>{positiveFactors.length}</Text>
          <Text style={styles.statLabel}>Positive Factors</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, {color: Colors.error}]}>{negativeFactors.length}</Text>
          <Text style={styles.statLabel}>Areas to Improve</Text>
        </View>
      </View>

      <View style={styles.factorsList}>
        <Text style={styles.factorsTitle}>Key Factors</Text>
        {displayFactors.map((factor, index) => (
          <View key={index} style={styles.factorItem}>
            <View style={styles.factorIcon}>
              <Text style={styles.iconText}>{getImpactIcon(factor.impact)}</Text>
            </View>
            <View style={styles.factorContent}>
              <Text style={styles.factorName}>{factor.factor}</Text>
              <Text style={styles.factorDescription}>{factor.description}</Text>
            </View>
            <View
              style={[styles.impactIndicator, {backgroundColor: getImpactColor(factor.impact)}]}
            />
          </View>
        ))}
      </View>

      {onViewFullReport && (
        <TouchableOpacity style={styles.viewReportButton} onPress={onViewFullReport}>
          <Text style={styles.viewReportText}>View Full Credit Report</Text>
          <Text style={styles.arrowIcon}>→</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = createStyles({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    elevation: 2,
    shadowColor: Colors.shadow.light,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...TextStyles.headline3,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
  },
  summaryStats: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...TextStyles.headline2,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border.light,
    marginHorizontal: Spacing.md,
  },
  factorsList: {
    marginBottom: Spacing.lg,
  },
  factorsTitle: {
    ...TextStyles.bodyLarge,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  factorItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  factorIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.border.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  iconText: {
    fontSize: 16,
  },
  factorContent: {
    flex: 1,
  },
  factorName: {
    ...TextStyles.bodyLarge,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  factorDescription: {
    ...TextStyles.bodyRegular,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  impactIndicator: {
    width: 3,
    height: '100%',
    borderRadius: 1.5,
    marginLeft: Spacing.sm,
  },
  viewReportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: Spacing.md,
  },
  viewReportText: {
    ...TextStyles.bodyLarge,
    color: Colors.surface,
    fontWeight: '600',
  },
  arrowIcon: {
    color: Colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  loadingText: {
    ...TextStyles.bodyRegular,
    color: Colors.text.secondary,
  },
});
