import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {FinancialOffer} from '../../types/offers';
import {useOfferStore} from '../../stores/offerStore';

interface OfferDetailModalProps {
  visible: boolean;
  offer: FinancialOffer | null;
  onClose: () => void;
}

type TabType = 'overview' | 'details' | 'eligibility';

export const OfferDetailModal: React.FC<OfferDetailModalProps> = ({visible, offer, onClose}) => {
  const {theme} = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const {trackOfferClick} = useOfferStore();

  if (!offer) return null;

  const handleApply = async () => {
    Alert.alert(
      offer.cta.requiresHardPull ? 'Credit Check Required' : 'Soft Credit Check',
      offer.cta.requiresHardPull
        ? 'Applying for this offer will result in a hard credit inquiry, which may temporarily impact your credit score. Continue?'
        : 'Checking your rate will not affect your credit score. Continue?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Continue',
          onPress: async () => {
            trackOfferClick(offer.id, 'detail_modal');
            // Open affiliate link
            const supported = await Linking.canOpenURL(offer.cta.affiliateUrl);
            if (supported) {
              await Linking.openURL(offer.cta.affiliateUrl);
            } else {
              Alert.alert('Error', 'Unable to open offer page');
            }
          },
        },
      ],
    );
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return theme.colors.success;
    if (score >= 75) return '#34C759';
    if (score >= 60) return theme.colors.warning;
    return theme.colors.text.tertiary;
  };

  const getMatchLabel = (score: number) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 75) return 'Great Match';
    if (score >= 60) return 'Good Match';
    return 'Consider';
  };

  const matchColor = getMatchColor(offer.match.score);
  const matchLabel = getMatchLabel(offer.match.score);

  const renderTab = (tab: TabType, label: string) => {
    const isActive = activeTab === tab;
    return (
      <TouchableOpacity
        key={tab}
        style={[styles(theme).tab, isActive && styles(theme).activeTab]}
        onPress={() => setActiveTab(tab)}>
        <Text style={[styles(theme).tabText, isActive && styles(theme).activeTabText]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderOverviewTab = () => (
    <View>
      {/* Description */}
      <View style={styles(theme).section}>
        <Text style={styles(theme).sectionTitle}>About this Offer</Text>
        <Text style={styles(theme).descriptionText}>{offer.description}</Text>
      </View>

      {/* Key Benefits */}
      <View style={styles(theme).section}>
        <Text style={styles(theme).sectionTitle}>Key Benefits</Text>
        {offer.benefits.map((benefit, index) => (
          <View key={index} style={styles(theme).benefitRow}>
            <View style={styles(theme).benefitIcon}>
              <Ionicons name={benefit.icon as any} size={20} color={theme.colors.primary} />
            </View>
            <Text style={styles(theme).benefitText}>{benefit.text}</Text>
          </View>
        ))}
      </View>

      {/* Pros & Cons */}
      <View style={styles(theme).section}>
        <Text style={styles(theme).sectionTitle}>Pros</Text>
        {offer.pros.map((pro, index) => (
          <View key={index} style={styles(theme).listItem}>
            <Ionicons name="checkmark-circle" size={18} color={theme.colors.success} />
            <Text style={styles(theme).listItemText}>{pro}</Text>
          </View>
        ))}
      </View>

      <View style={styles(theme).section}>
        <Text style={styles(theme).sectionTitle}>Cons</Text>
        {offer.cons.map((con, index) => (
          <View key={index} style={styles(theme).listItem}>
            <Ionicons name="close-circle" size={18} color={theme.colors.error} />
            <Text style={styles(theme).listItemText}>{con}</Text>
          </View>
        ))}
      </View>

      {/* Why This Matches */}
      <View style={styles(theme).section}>
        <Text style={styles(theme).sectionTitle}>Why This Offer Matches You</Text>
        <View style={styles(theme).matchCard}>
          <View style={styles(theme).matchHeader}>
            <View style={[styles(theme).matchBadge, {backgroundColor: matchColor}]}>
              <Text style={styles(theme).matchPercentage}>{offer.match.score}%</Text>
            </View>
            <Text style={styles(theme).matchLabel}>{matchLabel}</Text>
          </View>
          {offer.match.reasons.map((reason, index) => (
            <View key={index} style={styles(theme).reasonRow}>
              <View style={styles(theme).reasonDot} />
              <Text style={styles(theme).reasonText}>{reason}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderDetailsTab = () => (
    <View>
      {/* Credit Card Details */}
      {offer.creditCard && (
        <>
          <View style={styles(theme).section}>
            <Text style={styles(theme).sectionTitle}>APR & Interest</Text>
            <View style={styles(theme).detailCard}>
              <View style={styles(theme).detailRow}>
                <Text style={styles(theme).detailLabel}>Regular APR</Text>
                <Text style={styles(theme).detailValue}>{offer.creditCard.apr.regular}</Text>
              </View>
              {offer.creditCard.apr.intro && (
                <View style={styles(theme).detailRow}>
                  <Text style={styles(theme).detailLabel}>Intro APR</Text>
                  <Text style={[styles(theme).detailValue, {color: theme.colors.success}]}>
                    {offer.creditCard.apr.intro}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles(theme).section}>
            <Text style={styles(theme).sectionTitle}>Fees</Text>
            <View style={styles(theme).detailCard}>
              <View style={styles(theme).detailRow}>
                <Text style={styles(theme).detailLabel}>Annual Fee</Text>
                <Text style={styles(theme).detailValue}>
                  {offer.creditCard.fees.annual === 0
                    ? 'No annual fee'
                    : `$${offer.creditCard.fees.annual}`}
                </Text>
              </View>
              {offer.creditCard.fees.balanceTransfer && (
                <View style={styles(theme).detailRow}>
                  <Text style={styles(theme).detailLabel}>Balance Transfer Fee</Text>
                  <Text style={styles(theme).detailValue}>
                    {offer.creditCard.fees.balanceTransfer}
                  </Text>
                </View>
              )}
              {offer.creditCard.fees.foreign !== undefined && (
                <View style={styles(theme).detailRow}>
                  <Text style={styles(theme).detailLabel}>Foreign Transaction Fee</Text>
                  <Text style={styles(theme).detailValue}>
                    {offer.creditCard.fees.foreign === 0
                      ? 'None'
                      : `${offer.creditCard.fees.foreign}%`}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {offer.creditCard.rewardsProgram && (
            <View style={styles(theme).section}>
              <Text style={styles(theme).sectionTitle}>Rewards Program</Text>
              <View style={styles(theme).detailCard}>
                <Text style={styles(theme).detailValue}>{offer.creditCard.rewardsProgram}</Text>
                {offer.creditCard.signUpBonus && (
                  <Text style={[styles(theme).detailLabel, {marginTop: theme.spacing.sm}]}>
                    Sign-up bonus: {offer.creditCard.signUpBonus}
                  </Text>
                )}
              </View>
            </View>
          )}
        </>
      )}

      {/* Personal Loan Details */}
      {offer.loan && (
        <>
          <View style={styles(theme).section}>
            <Text style={styles(theme).sectionTitle}>Loan Terms</Text>
            <View style={styles(theme).detailCard}>
              <View style={styles(theme).detailRow}>
                <Text style={styles(theme).detailLabel}>Loan Amount</Text>
                <Text style={styles(theme).detailValue}>
                  ${offer.loan.minAmount.toLocaleString()} - $
                  {offer.loan.maxAmount.toLocaleString()}
                </Text>
              </View>
              <View style={styles(theme).detailRow}>
                <Text style={styles(theme).detailLabel}>APR Range</Text>
                <Text style={styles(theme).detailValue}>{offer.loan.apr.regular}</Text>
              </View>
              <View style={styles(theme).detailRow}>
                <Text style={styles(theme).detailLabel}>Available Terms</Text>
                <Text style={styles(theme).detailValue}>{offer.loan.terms.join(', ')}</Text>
              </View>
              {offer.loan.origination !== undefined && (
                <View style={styles(theme).detailRow}>
                  <Text style={styles(theme).detailLabel}>Origination Fee</Text>
                  <Text style={styles(theme).detailValue}>
                    {offer.loan.origination === 0 ? 'None' : `${offer.loan.origination}%`}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </>
      )}

      {/* Bank Account Details */}
      {offer.bankAccount && (
        <>
          <View style={styles(theme).section}>
            <Text style={styles(theme).sectionTitle}>Account Features</Text>
            <View style={styles(theme).detailCard}>
              {offer.bankAccount.apy && (
                <View style={styles(theme).detailRow}>
                  <Text style={styles(theme).detailLabel}>APY</Text>
                  <Text style={[styles(theme).detailValue, {color: theme.colors.success}]}>
                    {offer.bankAccount.apy}
                  </Text>
                </View>
              )}
              <View style={styles(theme).detailRow}>
                <Text style={styles(theme).detailLabel}>Minimum Balance</Text>
                <Text style={styles(theme).detailValue}>
                  {offer.bankAccount.minBalance === 0
                    ? 'No minimum'
                    : `$${offer.bankAccount.minBalance?.toLocaleString()}`}
                </Text>
              </View>
              <View style={styles(theme).detailRow}>
                <Text style={styles(theme).detailLabel}>Monthly Fee</Text>
                <Text style={styles(theme).detailValue}>
                  {offer.bankAccount.monthlyFee === 0
                    ? 'No monthly fee'
                    : `$${offer.bankAccount.monthlyFee}`}
                </Text>
              </View>
              {offer.bankAccount.atmNetwork && (
                <View style={styles(theme).detailRow}>
                  <Text style={styles(theme).detailLabel}>ATM Network</Text>
                  <Text style={styles(theme).detailValue}>{offer.bankAccount.atmNetwork}</Text>
                </View>
              )}
            </View>
          </View>
        </>
      )}
    </View>
  );

  const renderEligibilityTab = () => (
    <View>
      <View style={styles(theme).section}>
        <Text style={styles(theme).sectionTitle}>Credit Score Requirements</Text>
        <View style={styles(theme).detailCard}>
          <View style={styles(theme).creditScoreBar}>
            <View style={styles(theme).creditScoreRange}>
              <Text style={styles(theme).creditScoreLabel}>
                {offer.eligibility.creditScoreRange.min} - {offer.eligibility.creditScoreRange.max}
              </Text>
              <Text style={styles(theme).creditScoreType}>
                {offer.eligibility.creditScoreRange.label}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles(theme).section}>
        <Text style={styles(theme).sectionTitle}>Requirements</Text>
        {offer.eligibility.requirements.map((req, index) => (
          <View key={index} style={styles(theme).requirementRow}>
            <Ionicons name="checkmark-circle-outline" size={20} color={theme.colors.primary} />
            <Text style={styles(theme).requirementText}>{req}</Text>
          </View>
        ))}
      </View>

      {offer.eligibility.restrictions && offer.eligibility.restrictions.length > 0 && (
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>Restrictions</Text>
          {offer.eligibility.restrictions.map((restriction, index) => (
            <View key={index} style={styles(theme).requirementRow}>
              <Ionicons name="information-circle-outline" size={20} color={theme.colors.warning} />
              <Text style={styles(theme).requirementText}>{restriction}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles(theme).container} edges={['top']}>
        {/* Header */}
        <View style={styles(theme).header}>
          <TouchableOpacity onPress={onClose} style={styles(theme).closeButton}>
            <Ionicons name="close" size={28} color={theme.colors.text.primary} />
          </TouchableOpacity>

          <View style={styles(theme).headerContent}>
            <View style={styles(theme).providerLogo}>
              <Text style={styles(theme).providerInitial}>{offer.provider.name.charAt(0)}</Text>
            </View>
            <Text style={styles(theme).providerName}>{offer.provider.name}</Text>
            <Text style={styles(theme).offerTitle}>{offer.title}</Text>
            <Text style={styles(theme).tagline}>{offer.tagline}</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles(theme).tabs}>
          {renderTab('overview', 'Overview')}
          {renderTab('details', 'Details')}
          {renderTab('eligibility', 'Eligibility')}
        </View>

        {/* Content */}
        <ScrollView
          style={styles(theme).scrollView}
          contentContainerStyle={styles(theme).scrollContent}
          showsVerticalScrollIndicator={false}>
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'details' && renderDetailsTab()}
          {activeTab === 'eligibility' && renderEligibilityTab()}

          <View style={styles(theme).bottomPadding} />
        </ScrollView>

        {/* CTA Footer */}
        <View style={styles(theme).footer}>
          <View style={styles(theme).disclaimerContainer}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={theme.colors.text.tertiary}
            />
            <Text style={styles(theme).disclaimer}>
              {offer.cta.requiresHardPull
                ? 'Applying will result in a hard credit inquiry'
                : 'Checking rates will not affect your credit score'}
            </Text>
          </View>
          <TouchableOpacity style={styles(theme).ctaButton} onPress={handleApply}>
            <Text style={styles(theme).ctaButtonText}>{offer.cta.label}</Text>
            <Ionicons name="arrow-forward" size={20} color={theme.colors.surface} />
          </TouchableOpacity>
        </View>
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
      borderBottomWidth: 0.5,
      borderBottomColor: theme.colors.border.subtle,
      paddingBottom: theme.spacing.xl,
      backgroundColor: theme.colors.surface,
    },
    closeButton: {
      position: 'absolute',
      top: theme.spacing.md,
      left: theme.spacing.xl,
      zIndex: 10,
      padding: theme.spacing.xs,
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerContent: {
      alignItems: 'center',
      paddingTop: theme.spacing.xl + 4,
      paddingHorizontal: theme.spacing.xl,
    },
    providerLogo: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: theme.colors.surfaceSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
      borderWidth: 1.5,
      borderColor: theme.colors.border.light,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    providerInitial: {
      ...theme.textStyles.headline1,
      fontWeight: '700',
      color: theme.colors.primary,
      fontSize: 32,
    },
    providerName: {
      ...theme.textStyles.bodySmall,
      fontWeight: '600',
      color: theme.colors.text.tertiary,
      marginBottom: theme.spacing.xs,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    offerTitle: {
      ...theme.textStyles.headline2,
      fontWeight: '700',
      color: theme.colors.text.primary,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
      lineHeight: 32,
    },
    tagline: {
      ...theme.textStyles.bodyLarge,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    tabs: {
      flexDirection: 'row',
      borderBottomWidth: 0.5,
      borderBottomColor: theme.colors.border.subtle,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.xl,
    },
    tab: {
      flex: 1,
      paddingVertical: theme.spacing.md + 2,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: theme.colors.primary,
    },
    tabText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
      fontWeight: '600',
      fontSize: 15,
      letterSpacing: 0.3,
    },
    activeTabText: {
      color: theme.colors.primary,
      fontWeight: '700',
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: theme.spacing.xl,
    },
    section: {
      marginBottom: theme.spacing.xl + 4,
    },
    sectionTitle: {
      ...theme.textStyles.headline4,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.md + 2,
      letterSpacing: 0.3,
    },
    descriptionText: {
      ...theme.textStyles.bodyLarge,
      color: theme.colors.text.primary,
      lineHeight: 24,
    },
    benefitRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    benefitIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.primary + '15',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    benefitText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.primary,
      flex: 1,
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
      paddingLeft: theme.spacing.sm,
    },
    listItemText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.primary,
      flex: 1,
      marginLeft: theme.spacing.sm,
    },
    matchCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 1,
    },
    matchHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    matchBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginRight: theme.spacing.sm,
    },
    matchPercentage: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '700',
      color: theme.colors.surface,
    },
    matchLabel: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    reasonRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
    },
    reasonDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.colors.primary,
      marginTop: 8,
      marginRight: theme.spacing.sm,
    },
    reasonText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.primary,
      flex: 1,
      lineHeight: 22,
    },
    detailCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 1,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm + 2,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.colors.border.subtle,
    },
    detailLabel: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
    },
    detailValue: {
      ...theme.textStyles.bodyMedium,
      fontWeight: '600',
      color: theme.colors.text.primary,
      textAlign: 'right',
    },
    creditScoreBar: {
      padding: theme.spacing.md,
    },
    creditScoreRange: {
      alignItems: 'center',
    },
    creditScoreLabel: {
      ...theme.textStyles.headline3,
      fontWeight: '700',
      color: theme.colors.primary,
      marginBottom: theme.spacing.xs,
    },
    creditScoreType: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
    },
    requirementRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.md,
      paddingLeft: theme.spacing.sm,
    },
    requirementText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.primary,
      flex: 1,
      marginLeft: theme.spacing.sm,
    },
    bottomPadding: {
      height: 100,
    },
    footer: {
      backgroundColor: theme.colors.surface,
      borderTopWidth: 0.5,
      borderTopColor: theme.colors.border.subtle,
      padding: theme.spacing.xl,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: -4},
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 8,
    },
    disclaimerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md + 2,
      paddingHorizontal: theme.spacing.xs,
    },
    disclaimer: {
      ...theme.textStyles.caption,
      color: theme.colors.text.tertiary,
      flex: 1,
      marginLeft: theme.spacing.sm,
      lineHeight: 16,
    },
    ctaButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md + 2,
      borderRadius: 14,
      shadowColor: theme.colors.primary,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 4,
    },
    ctaButtonText: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '700',
      color: theme.colors.surface,
      marginRight: theme.spacing.sm,
      fontSize: 16,
      letterSpacing: 0.3,
    },
  });
