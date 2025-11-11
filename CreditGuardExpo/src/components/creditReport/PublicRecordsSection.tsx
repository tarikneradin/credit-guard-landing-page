import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {EmptyState} from '../common/EmptyState';
import {PublicRecord} from '../../types';

interface PublicRecordsSectionProps {
  publicRecords: PublicRecord[];
}

export const PublicRecordsSection: React.FC<PublicRecordsSectionProps> = ({publicRecords}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const [showInfo, setShowInfo] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {month: 'short', year: 'numeric'});
  };

  const getRecordStatusColor = (status: PublicRecord['status']) => {
    switch (status) {
      case 'satisfied':
      case 'dismissed':
        return theme.colors.success;
      case 'filed':
        return theme.colors.warning;
      case 'active':
        return theme.colors.error;
      default:
        return theme.colors.text.secondary;
    }
  };

  const getRecordTypeBadgeColor = (type: PublicRecord['type']) => {
    switch (type) {
      case 'bankruptcy':
        return theme.colors.error;
      case 'tax_lien':
        return theme.colors.warning;
      case 'civil_judgment':
        return theme.colors.info;
      case 'foreclosure':
        return theme.colors.error;
      case 'collection':
        return theme.colors.warning;
      default:
        return theme.colors.text.secondary;
    }
  };

  const getRecordTypeLabel = (type: PublicRecord['type']) => {
    switch (type) {
      case 'bankruptcy':
        return 'Bankruptcy';
      case 'tax_lien':
        return 'Tax Lien';
      case 'civil_judgment':
        return 'Civil Judgment';
      case 'foreclosure':
        return 'Foreclosure';
      case 'collection':
        return 'Collection';
      default:
        return type.replace(/_/g, ' ').toUpperCase();
    }
  };

  return (
    <View style={styles.container}>
      {/* Content */}
      {publicRecords.length === 0 ? (
        <EmptyState
          icon="folder-open-outline"
          title="No Public Records Found"
          description="Great news! No bankruptcies, liens, judgments, or foreclosures found on your credit report. This is excellent for your creditworthiness!"
          decorativeIcon="search-outline"
          iconColor={theme.colors.text.tertiary}
        />
      ) : (
        <>
          {/* Records List */}
          <View style={styles.recordsList}>
            {publicRecords.map(record => (
              <View key={record.id} style={styles.recordCard}>
                <View style={styles.recordHeader}>
                  <View style={styles.recordTypeRow}>
                    <View style={styles.recordTitleContainer}>
                      <View style={styles.recordTitleRow}>
                        <View
                          style={[
                            styles.typeBadge,
                            {
                              backgroundColor: getRecordTypeBadgeColor(record.type) + '15',
                              borderColor: getRecordTypeBadgeColor(record.type),
                            },
                          ]}>
                          <Text
                            style={[
                              styles.typeBadgeText,
                              {color: getRecordTypeBadgeColor(record.type)},
                            ]}>
                            {getRecordTypeLabel(record.type).toUpperCase()}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.recordDate}>Filed {formatDate(record.filingDate)}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {backgroundColor: getRecordStatusColor(record.status) + '20'},
                    ]}>
                    <Text style={[styles.statusText, {color: getRecordStatusColor(record.status)}]}>
                      {record.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text style={styles.recordDescription}>{record.description}</Text>

                <View style={styles.recordDetailsGrid}>
                  {record.amount && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Amount</Text>
                      <Text style={styles.detailValue}>${record.amount.toLocaleString()}</Text>
                    </View>
                  )}
                  {record.court && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Court</Text>
                      <Text style={styles.detailValue}>{record.court}</Text>
                    </View>
                  )}
                  {record.caseNumber && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Case Number</Text>
                      <Text style={styles.detailValue}>{record.caseNumber}</Text>
                    </View>
                  )}
                  {record.expectedRemovalDate && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Expected Removal</Text>
                      <Text style={styles.detailValue}>
                        {formatDate(record.expectedRemovalDate)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </>
      )}

      {/* Consolidated Info Box */}
      <TouchableOpacity
        style={[
          styles.infoBox,
          publicRecords.length > 0 && {
            backgroundColor: theme.colors.warning + '10',
            borderLeftColor: theme.colors.warning,
          },
        ]}
        onPress={() => setShowInfo(!showInfo)}
        activeOpacity={0.7}>
        <Ionicons
          name={publicRecords.length > 0 ? 'warning' : 'information-circle'}
          size={20}
          color={publicRecords.length > 0 ? theme.colors.warning : theme.colors.accent}
        />
        <View style={styles.infoBoxContent}>
          <View style={styles.infoBoxHeader}>
            <Text style={styles.infoBoxTitle}>
              {publicRecords.length > 0 ? 'Impact on Your Credit' : 'About Public Records'}
            </Text>
            <Text style={styles.seeMoreText}>{showInfo ? 'See less' : 'See more...'}</Text>
          </View>
          {showInfo && (
            <Text style={styles.infoBoxText}>
              {publicRecords.length > 0
                ? 'Public records can significantly lower your credit score and typically remain on your report for 7-10 years, though their impact decreases over time. Satisfied or dismissed records have less negative impact. Contact creditors or legal professionals for help resolving these issues.'
                : 'Public records include bankruptcies, tax liens, civil judgments, foreclosures, and collection accounts. These are serious negative marks that can stay on your credit report for up to 10 years and significantly impact your creditworthiness. Maintaining a clean public record is essential for a healthy credit profile.'}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      padding: theme.spacing.lg,
    },
    standardSectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.xl,
    },
    headerIconCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.accent + '15',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTextContainer: {
      flex: 1,
    },
    standardSectionTitle: {
      ...theme.textStyles.headline3,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    standardSectionSubtitle: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
    },
    header: {
      marginBottom: theme.spacing.xl,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    headerText: {
      flex: 1,
    },
    headerTitle: {
      ...theme.textStyles.headline2,
      fontWeight: '800',
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    headerSubtitle: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
    },
    recordsList: {
      gap: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    recordCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: theme.spacing.lg,
      shadowColor: theme.colors.shadow.medium,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 3,
    },
    recordHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.md,
    },
    recordTypeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      flex: 1,
    },
    recordTitleContainer: {
      flex: 1,
    },
    recordTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 2,
    },
    typeBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
      borderRadius: 8,
      borderWidth: 1,
    },
    typeBadgeText: {
      ...theme.textStyles.caption,
      fontSize: 9,
      fontWeight: '800',
      letterSpacing: 0.5,
    },
    recordDate: {
      ...theme.textStyles.caption,
      color: theme.colors.text.tertiary,
      fontSize: 11,
    },
    statusBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 6,
      borderRadius: 8,
    },
    statusText: {
      ...theme.textStyles.caption,
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 0.5,
    },
    recordDescription: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
      lineHeight: 22,
      marginBottom: theme.spacing.md,
    },
    recordDetailsGrid: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.light,
      paddingTop: theme.spacing.md,
      gap: theme.spacing.md,
    },
    detailItem: {
      marginBottom: theme.spacing.xs,
    },
    detailLabel: {
      ...theme.textStyles.caption,
      color: theme.colors.text.tertiary,
      marginBottom: 4,
      fontSize: 11,
      fontWeight: '500',
    },
    detailValue: {
      ...theme.textStyles.bodyMedium,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    infoBox: {
      flexDirection: 'row',
      backgroundColor: theme.colors.accent + '10',
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.accent,
      padding: theme.spacing.md,
      borderRadius: 12,
      gap: theme.spacing.sm,
    },
    infoBoxContent: {
      flex: 1,
    },
    infoBoxHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    infoBoxTitle: {
      ...theme.textStyles.bodySmall,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    seeMoreText: {
      ...theme.textStyles.caption,
      color: theme.colors.accent,
      fontWeight: '600',
    },
    infoBoxText: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.text.secondary,
      lineHeight: 18,
      marginTop: 8,
    },
  });
