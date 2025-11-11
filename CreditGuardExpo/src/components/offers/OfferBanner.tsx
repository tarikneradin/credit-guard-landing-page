import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {FinancialOffer} from '../../types/offers';

interface OfferBannerProps {
  offers: FinancialOffer[];
  onPress: (offer: FinancialOffer) => void;
  onDismiss?: () => void;
  autoRotate?: boolean;
  rotateInterval?: number; // milliseconds
}

const {width: screenWidth} = Dimensions.get('window');

export const OfferBanner: React.FC<OfferBannerProps> = ({
  offers,
  onPress,
  onDismiss,
  autoRotate = true,
  rotateInterval = 10000,
}) => {
  const {theme} = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Auto-rotate through offers
  useEffect(() => {
    if (!autoRotate || offers.length <= 1) return;

    const timer = setInterval(() => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // Change offer
        setCurrentIndex((prev) => (prev + 1) % offers.length);

        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, rotateInterval);

    return () => clearInterval(timer);
  }, [autoRotate, offers.length, rotateInterval]);

  if (!offers || offers.length === 0) return null;

  const currentOffer = offers[currentIndex];

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'credit_card':
        return 'card-outline';
      case 'personal_loan':
        return 'wallet-outline';
      case 'savings_account':
        return 'trending-up-outline';
      case 'checking_account':
        return 'cash-outline';
      case 'mortgage':
        return 'home-outline';
      case 'auto_loan':
        return 'car-outline';
      default:
        return 'gift-outline';
    }
  };

  const styles = StyleSheet.create({
    container: {
      marginHorizontal: theme.spacing.xl,
      marginVertical: theme.spacing.md,
    },
    banner: {
      backgroundColor: `${theme.colors.primary}10`,
      borderRadius: 16,
      padding: theme.spacing.md + 2,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: `${theme.colors.primary}25`,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 3,
    },
    iconContainer: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: theme.colors.primary + '18',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
      borderWidth: 1,
      borderColor: `${theme.colors.primary}40`,
    },
    content: {
      flex: 1,
    },
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      backgroundColor: theme.colors.primary,
      alignSelf: 'flex-start',
      marginBottom: theme.spacing.xs,
    },
    badgeText: {
      ...theme.textStyles.caption,
      fontWeight: '700',
      color: theme.colors.surface,
      fontSize: 10,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    title: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: 3,
      lineHeight: 20,
    },
    tagline: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xs,
      lineHeight: 18,
    },
    matchInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    matchBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 12,
      marginRight: theme.spacing.xs,
    },
    matchText: {
      ...theme.textStyles.caption,
      fontWeight: '700',
      color: theme.colors.surface,
      fontSize: 11,
      letterSpacing: 0.3,
    },
    viewButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm + 2,
      borderRadius: 12,
      shadowColor: theme.colors.primary,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
    },
    viewButtonText: {
      ...theme.textStyles.bodySmall,
      fontWeight: '700',
      color: theme.colors.surface,
      marginRight: 4,
      letterSpacing: 0.3,
    },
    dismissButton: {
      position: 'absolute',
      top: theme.spacing.xs,
      right: theme.spacing.xs,
      padding: theme.spacing.xs,
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: theme.spacing.sm,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.colors.text.tertiary,
      marginHorizontal: 3,
    },
    activeDot: {
      backgroundColor: theme.colors.primary,
      width: 8,
      height: 8,
      borderRadius: 4,
    },
  });

  const getMatchColor = (score: number) => {
    if (score >= 90) return theme.colors.success;
    if (score >= 75) return '#34C759';
    if (score >= 60) return theme.colors.warning;
    return theme.colors.text.tertiary;
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.banner, {opacity: fadeAnim}]}>
        {/* Dismiss Button */}
        {onDismiss && (
          <TouchableOpacity style={styles.dismissButton} onPress={onDismiss} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Ionicons name="close" size={18} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        )}

        {/* Category Icon */}
        <View style={styles.iconContainer}>
          <Ionicons
            name={getCategoryIcon(currentOffer.category) as any}
            size={24}
            color={theme.colors.primary}
          />
        </View>

        {/* Content */}
        <TouchableOpacity
          style={styles.content}
          onPress={() => onPress(currentOffer)}
          activeOpacity={0.7}>
          {/* Featured Badge */}
          {currentOffer.featured && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Featured</Text>
            </View>
          )}

          {/* Title & Tagline */}
          <Text style={styles.title} numberOfLines={1}>
            {currentOffer.provider.name} - {currentOffer.title.split('®')[0]}
          </Text>
          <Text style={styles.tagline} numberOfLines={1}>
            {currentOffer.tagline}
          </Text>

          {/* Match Info */}
          <View style={styles.matchInfo}>
            <View
              style={[
                styles.matchBadge,
                {backgroundColor: getMatchColor(currentOffer.match.score)},
              ]}>
              <Text style={styles.matchText}>{currentOffer.match.score}% Match</Text>
            </View>
            <Text style={{...theme.textStyles.caption, color: theme.colors.text.tertiary}}>
              • {currentOffer.eligibility.creditScoreRange.label}
            </Text>
          </View>
        </TouchableOpacity>

        {/* View Button */}
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => onPress(currentOffer)}
          activeOpacity={0.8}>
          <Text style={styles.viewButtonText}>View</Text>
          <Ionicons name="arrow-forward" size={14} color={theme.colors.surface} />
        </TouchableOpacity>
      </Animated.View>

      {/* Pagination Dots (if multiple offers) */}
      {offers.length > 1 && (
        <View style={styles.pagination}>
          {offers.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === currentIndex && styles.activeDot]}
            />
          ))}
        </View>
      )}
    </View>
  );
};
