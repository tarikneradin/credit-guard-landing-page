import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {FinancialOffer} from '../../types/offers';

interface OfferCardProps {
  offer: FinancialOffer;
  onPress: (offer: FinancialOffer) => void;
  compact?: boolean; // For dashboard carousel
}

export const OfferCard: React.FC<OfferCardProps> = ({offer, onPress, compact = false}) => {
  const {theme} = useTheme();

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

  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case 'featured':
        return '#FFD60A';
      case 'limited_time':
        return theme.colors.error;
      case 'best_match':
        return theme.colors.success;
      case 'new':
        return theme.colors.accent;
      case 'popular':
        return theme.colors.primary;
      default:
        return theme.colors.text.tertiary;
    }
  };

  const getBadgeLabel = (badge?: string) => {
    switch (badge) {
      case 'featured':
        return 'Featured';
      case 'limited_time':
        return 'Limited Time';
      case 'best_match':
        return 'Best Match';
      case 'new':
        return 'New';
      case 'popular':
        return 'Popular';
      default:
        return '';
    }
  };

  const matchColor = getMatchColor(offer.match.score);
  const matchLabel = getMatchLabel(offer.match.score);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: compact ? theme.spacing.md : theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: offer.featured ? 2 : 1,
      borderColor: offer.featured ? `${theme.colors.primary}40` : theme.colors.border.light,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.md,
    },
    providerLogo: {
      width: compact ? 48 : 56,
      height: compact ? 48 : 56,
      borderRadius: compact ? 24 : 28,
      backgroundColor: theme.colors.surfaceSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    providerInitial: {
      ...theme.textStyles.headline3,
      fontWeight: '700',
      color: theme.colors.primary,
    },
    headerContent: {
      flex: 1,
      paddingRight: offer.badge ? 80 : 0,
    },
    providerName: {
      ...theme.textStyles.bodySmall,
      fontWeight: '600',
      color: theme.colors.text.tertiary,
      marginBottom: 4,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    title: {
      ...theme.textStyles[compact ? 'bodyLarge' : 'headline4'],
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: 6,
      lineHeight: compact ? 22 : 26,
    },
    rating: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingText: {
      ...theme.textStyles.caption,
      color: theme.colors.text.secondary,
      marginLeft: 4,
    },
    badgeContainer: {
      position: 'absolute',
      top: 0,
      right: 0,
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    badgeText: {
      ...theme.textStyles.caption,
      fontWeight: '700',
      color: theme.colors.surface,
      textTransform: 'uppercase',
      fontSize: 10,
      letterSpacing: 0.5,
    },
    tagline: {
      ...theme.textStyles[compact ? 'bodyRegular' : 'bodyMedium'],
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.md,
      lineHeight: 22,
    },
    benefits: {
      marginBottom: theme.spacing.md,
    },
    benefit: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: compact ? theme.spacing.sm : theme.spacing.md,
    },
    benefitIcon: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: `${theme.colors.primary}15`,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    benefitText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.primary,
      flex: 1,
      lineHeight: 20,
    },
    benefitHighlight: {
      fontWeight: '600',
      color: theme.colors.primary,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.subtle,
      marginTop: theme.spacing.sm,
    },
    matchContainer: {
      flex: 1,
    },
    matchScore: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    matchBadge: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 14,
      marginRight: theme.spacing.sm,
    },
    matchPercentage: {
      ...theme.textStyles.bodySmall,
      fontWeight: '700',
      color: theme.colors.surface,
      fontSize: 12,
    },
    matchLabel: {
      ...theme.textStyles.bodyMedium,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    creditScoreRange: {
      ...theme.textStyles.caption,
      color: theme.colors.text.tertiary,
    },
    ctaButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      paddingHorizontal: compact ? theme.spacing.md : theme.spacing.lg,
      paddingVertical: compact ? 10 : theme.spacing.md,
      borderRadius: 12,
      shadowColor: theme.colors.primary,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
    },
    ctaText: {
      ...theme.textStyles.bodyMedium,
      fontWeight: '700',
      color: theme.colors.surface,
      marginRight: theme.spacing.xs,
    },
    disclosure: {
      ...theme.textStyles.caption,
      color: theme.colors.text.tertiary,
      marginTop: theme.spacing.md,
      fontStyle: 'italic',
      lineHeight: 16,
    },
  });

  // Limit benefits shown in compact mode
  const benefitsToShow = compact ? offer.benefits.slice(0, 2) : offer.benefits.slice(0, 3);

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(offer)} activeOpacity={0.7}>
      {/* Badge */}
      {offer.badge && (
        <View style={styles.badgeContainer}>
          <View style={[styles.badge, {backgroundColor: getBadgeColor(offer.badge)}]}>
            <Text style={styles.badgeText}>{getBadgeLabel(offer.badge)}</Text>
          </View>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.providerLogo}>
          <Text style={styles.providerInitial}>{offer.provider.name.charAt(0)}</Text>
        </View>

        <View style={styles.headerContent}>
          <Text style={styles.providerName}>{offer.provider.name}</Text>
          <Text style={styles.title} numberOfLines={2}>
            {offer.title}
          </Text>
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color={theme.colors.warning} />
            <Text style={styles.ratingText}>
              {offer.provider.rating} ({offer.provider.reviewCount.toLocaleString()} reviews)
            </Text>
          </View>
        </View>
      </View>

      {/* Tagline */}
      {!compact && <Text style={styles.tagline}>{offer.tagline}</Text>}

      {/* Benefits */}
      <View style={styles.benefits}>
        {benefitsToShow.map((benefit, index) => (
          <View key={index} style={styles.benefit}>
            <View style={styles.benefitIcon}>
              <Ionicons name={benefit.icon as any} size={16} color={theme.colors.primary} />
            </View>
            <Text
              style={[styles.benefitText, benefit.highlight && styles.benefitHighlight]}
              numberOfLines={1}>
              {benefit.text}
            </Text>
          </View>
        ))}
        {offer.benefits.length > 3 && !compact && (
          <Text style={[styles.creditScoreRange, {marginLeft: 40}]}>
            +{offer.benefits.length - 3} more benefits
          </Text>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.matchContainer}>
          <View style={styles.matchScore}>
            <View style={[styles.matchBadge, {backgroundColor: matchColor}]}>
              <Text style={styles.matchPercentage}>{offer.match.score}%</Text>
            </View>
            <Text style={styles.matchLabel}>{matchLabel}</Text>
          </View>
          <Text style={styles.creditScoreRange}>
            {offer.eligibility.creditScoreRange.label} credit
          </Text>
        </View>

        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => onPress(offer)}
          activeOpacity={0.8}>
          <Text style={styles.ctaText}>{compact ? 'View' : offer.cta.label}</Text>
          <Ionicons name="arrow-forward" size={16} color={theme.colors.surface} />
        </TouchableOpacity>
      </View>

      {/* Affiliate Disclosure */}
      {!compact && (
        <Text style={styles.disclosure}>
          We may earn a commission if you apply through our links.
        </Text>
      )}
    </TouchableOpacity>
  );
};
