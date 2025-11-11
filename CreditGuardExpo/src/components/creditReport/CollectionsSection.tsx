import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {EmptyState} from '../common/EmptyState';
import {Collection} from '../../types/api';

interface CollectionsSectionProps {
  collections: Collection[];
}

export const CollectionsSection: React.FC<CollectionsSectionProps> = ({collections}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const [showInfo, setShowInfo] = useState(false);

  const getStatusColor = (status: Collection['status']) => {
    switch (status) {
      case 'PAID':
        return theme.colors.success;
      case 'SETTLED':
        return theme.colors.info;
      case 'DISPUTED':
        return theme.colors.warning;
      case 'CLOSED':
        return theme.colors.text.tertiary;
      case 'OPEN':
      default:
        return theme.colors.error;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <View style={styles.container}>
      {collections.length === 0 ? (
        <EmptyState
          icon="folder-open-outline"
          title="No Collections Found"
          description="Great news! You don't have any collection accounts on your credit report. This is excellent for maintaining a healthy credit score."
          decorativeIcon="search-outline"
          iconColor={theme.colors.text.tertiary}
        />
      ) : (
        <View style={styles.collectionsList}>
          {collections.map(collection => {
            const statusColor = getStatusColor(collection.status);

            return (
              <TouchableOpacity
                key={collection.id}
                style={styles.collectionCard}
                activeOpacity={0.7}>
                <View style={styles.collectionContent}>
                  <View style={styles.collectionHeader}>
                    <View
                      style={[
                        styles.statusBadge,
                        {backgroundColor: statusColor + '15', borderColor: statusColor},
                      ]}>
                      <Text style={[styles.statusText, {color: statusColor}]}>
                        {collection.status}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.accountNumber}>Account: {collection.accountNumber}</Text>

                  <View style={styles.amountContainer}>
                    <Text style={styles.amountLabel}>Collection Amount</Text>
                    <Text style={[styles.amount, {color: statusColor}]}>
                      {formatCurrency(collection.amount.amount, collection.amount.currency)}
                    </Text>
                  </View>

                  <View style={styles.collectionDetails}>
                    <View style={styles.detailRow}>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Reported</Text>
                        <Text style={styles.detailValue}>
                          {formatDate(collection.reportedDate)}
                        </Text>
                      </View>
                      {collection.assignedDate && (
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Assigned</Text>
                          <Text style={styles.detailValue}>
                            {formatDate(collection.assignedDate)}
                          </Text>
                        </View>
                      )}
                    </View>

                    {collection.agencyClient && (
                      <View style={styles.agencyInfo}>
                        <Ionicons name="business" size={14} color={theme.colors.text.tertiary} />
                        <Text style={styles.agencyText}>{collection.agencyClient}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.collectionFooter}>
                    <Text style={styles.timeAgo}>{getRelativeDate(collection.reportedDate)}</Text>
                    {collection.status === 'OPEN' && (
                      <View style={styles.actionBadge}>
                        <Text style={styles.actionText}>Needs Attention</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Info Box */}
      <TouchableOpacity
        style={styles.infoBox}
        onPress={() => setShowInfo(!showInfo)}
        activeOpacity={0.7}>
        <Ionicons name="information-circle" size={20} color={theme.colors.accent} />
        <View style={styles.infoBoxContent}>
          <View style={styles.infoBoxHeader}>
            <Text style={styles.infoBoxTitle}>About Collections</Text>
            <Text style={styles.seeMoreText}>{showInfo ? 'See less' : 'See more...'}</Text>
          </View>
          {showInfo && (
            <Text style={styles.infoBoxText}>
              Collection accounts appear when debts are sent to collection agencies. They can
              significantly impact your credit score. Contact the collection agency to discuss
              payment options or dispute inaccurate information.
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
    collectionsList: {
      gap: theme.spacing.md,
      marginBottom: theme.spacing.xxxl,
    },
    collectionCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
    },
    collectionContent: {
      flex: 1,
      padding: theme.spacing.md,
    },
    collectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    statusBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: 12,
      borderWidth: 1,
    },
    statusText: {
      ...theme.textStyles.caption,
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    accountNumber: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.sm,
    },
    amountContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    amountLabel: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
      fontWeight: '500',
    },
    amount: {
      ...theme.textStyles.headline4,
      fontWeight: '700',
    },
    collectionDetails: {
      marginBottom: theme.spacing.sm,
    },
    detailRow: {
      flexDirection: 'row',
      gap: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
    },
    detailItem: {
      flex: 1,
    },
    detailLabel: {
      ...theme.textStyles.caption,
      color: theme.colors.text.tertiary,
      marginBottom: 2,
      fontSize: 11,
    },
    detailValue: {
      ...theme.textStyles.bodySmall,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    agencyInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      marginTop: theme.spacing.xs,
    },
    agencyText: {
      ...theme.textStyles.caption,
      color: theme.colors.text.tertiary,
      fontSize: 11,
      fontStyle: 'italic',
    },
    collectionFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.subtle,
    },
    timeAgo: {
      ...theme.textStyles.caption,
      color: theme.colors.text.tertiary,
      fontSize: 11,
    },
    actionBadge: {
      backgroundColor: theme.colors.error + '15',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: 8,
    },
    actionText: {
      ...theme.textStyles.caption,
      fontSize: 10,
      fontWeight: '700',
      color: theme.colors.error,
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
