import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {useSubscriptionStore} from '../../stores/subscriptionStore';
import {useNavigation} from '@react-navigation/native';
import {BillingPeriod, SubscriptionPlan} from '../../types/subscription';
import {HeaderWithOptions} from '../../components/common/HeaderWithOptions';

export const SubscriptionPlansScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const {
    currentSubscription,
    availablePlans,
    selectedBillingPeriod,
    isLoading,
    fetchSubscription,
    setBillingPeriod,
    subscribeToPlan,
  } = useSubscriptionStore();

  const [selectedPeriod, setSelectedPeriod] = useState<BillingPeriod>('monthly');

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handlePeriodToggle = (period: BillingPeriod) => {
    setSelectedPeriod(period);
    setBillingPeriod(period);
  };

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    if (plan.tier === 'free') {
      Alert.alert('Free Plan', 'You are already on the free plan!');
      return;
    }

    if (plan.tier === currentSubscription?.tier) {
      Alert.alert('Current Plan', 'This is your current plan.');
      return;
    }

    const price = selectedPeriod === 'monthly' ? plan.monthlyPrice : plan.annualPrice;

    Alert.alert(
      'Subscribe to ' + plan.name,
      `Start your ${plan.name} subscription for $${price.toFixed(2)}/${selectedPeriod}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Continue',
          onPress: async () => {
            try {
              await subscribeToPlan(plan.id, selectedPeriod);
              Alert.alert('Success!', `You are now subscribed to ${plan.name}!`);
              navigation.goBack();
            } catch (_error) {
              Alert.alert('Error', 'Failed to subscribe. Please try again.');
            }
          },
        },
      ],
    );
  };

  const formatPrice = (plan: SubscriptionPlan): number => {
    return selectedPeriod === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
  };

  const getPlanButtonText = (plan: SubscriptionPlan): string => {
    if (plan.tier === currentSubscription?.tier) {
      return 'Current Plan';
    }
    if (plan.tier === 'free') {
      return 'Free Forever';
    }
    if (
      currentSubscription?.tier === 'free' ||
      (currentSubscription?.tier === 'plus' && plan.tier === 'premium')
    ) {
      return 'Upgrade';
    }
    return 'Select Plan';
  };

  const isCurrentPlan = (plan: SubscriptionPlan): boolean => {
    return plan.tier === currentSubscription?.tier;
  };

  return (
    <SafeAreaView style={styles(theme).container} edges={['top']}>
      <HeaderWithOptions
        title="Subscription Plans"
        subtitle="Choose the plan that's right for you"
        icon="card"
        iconColor={theme.colors.accent}
        onBackPress={() => navigation.goBack()}
        showBackButton={true}
      />

      <ScrollView
        style={styles(theme).scrollView}
        contentContainerStyle={styles(theme).contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Billing Period Toggle */}
        <View style={styles(theme).toggleContainer}>
          <TouchableOpacity
            style={[
              styles(theme).toggleButton,
              selectedPeriod === 'monthly' && styles(theme).toggleButtonActive,
            ]}
            onPress={() => handlePeriodToggle('monthly')}
            activeOpacity={0.7}>
            <Text
              style={[
                styles(theme).toggleText,
                selectedPeriod === 'monthly' && styles(theme).toggleTextActive,
              ]}>
              Monthly
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles(theme).toggleButton,
              selectedPeriod === 'annual' && styles(theme).toggleButtonActive,
            ]}
            onPress={() => handlePeriodToggle('annual')}
            activeOpacity={0.7}>
            <Text
              style={[
                styles(theme).toggleText,
                selectedPeriod === 'annual' && styles(theme).toggleTextActive,
              ]}>
              Annual
            </Text>
            {selectedPeriod === 'annual' && (
              <View style={styles(theme).savingsBadge}>
                <Text style={styles(theme).savingsText}>Save 20%</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.accent} style={{marginTop: 40}} />
        ) : (
          <>
            {/* Plans */}
            {availablePlans.map((plan, index) => (
              <View
                key={plan.id}
                style={[
                  styles(theme).planCard,
                  (plan.popular || plan.recommended) && styles(theme).planCardFeatured,
                  isCurrentPlan(plan) && styles(theme).planCardCurrent,
                ]}>
                {/* Badge */}
                {plan.badge && (
                  <View
                    style={[
                      styles(theme).badge,
                      {
                        backgroundColor: plan.popular
                          ? theme.colors.accent
                          : theme.colors.success,
                      },
                    ]}>
                    <Text style={styles(theme).badgeText}>{plan.badge}</Text>
                  </View>
                )}

                {/* Plan Header */}
                <Text style={styles(theme).planName}>{plan.name}</Text>
                <Text style={styles(theme).planTagline}>{plan.tagline}</Text>

                {/* Price */}
                <View style={styles(theme).priceContainer}>
                  {formatPrice(plan) === 0 ? (
                    <Text style={styles(theme).price}>Free</Text>
                  ) : (
                    <>
                      <Text style={styles(theme).priceSymbol}>$</Text>
                      <Text style={styles(theme).price}>
                        {formatPrice(plan).toFixed(2).split('.')[0]}
                      </Text>
                      <Text style={styles(theme).priceCents}>
                        .{formatPrice(plan).toFixed(2).split('.')[1]}
                      </Text>
                      <Text style={styles(theme).pricePeriod}>/{selectedPeriod}</Text>
                    </>
                  )}
                </View>

                {/* Savings */}
                {selectedPeriod === 'annual' && plan.annualSavings && plan.monthlyPrice > 0 && (
                  <Text style={styles(theme).savings}>
                    Save ${(plan.monthlyPrice * 12 - plan.annualPrice).toFixed(2)}/year
                  </Text>
                )}

                {/* Features */}
                <View style={styles(theme).featuresContainer}>
                  {plan.features.map((feature, idx) => (
                    <View key={idx} style={styles(theme).featureRow}>
                      <Ionicons
                        name={feature.included ? 'checkmark-circle' : 'close-circle'}
                        size={20}
                        color={feature.included ? theme.colors.success : theme.colors.text.tertiary}
                        style={styles(theme).featureIcon}
                      />
                      <Text
                        style={[
                          styles(theme).featureText,
                          !feature.included && {color: theme.colors.text.tertiary},
                          feature.highlighted && {fontWeight: '700'},
                        ]}>
                        {feature.text}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* CTA Button */}
                <TouchableOpacity
                  style={[
                    styles(theme).ctaButton,
                    isCurrentPlan(plan) && styles(theme).ctaButtonCurrent,
                    (plan.popular || plan.recommended) && styles(theme).ctaButtonFeatured,
                  ]}
                  onPress={() => handleSelectPlan(plan)}
                  activeOpacity={0.8}
                  disabled={isCurrentPlan(plan)}>
                  <Text
                    style={[
                      styles(theme).ctaButtonText,
                      isCurrentPlan(plan) && styles(theme).ctaButtonTextCurrent,
                    ]}>
                    {getPlanButtonText(plan)}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        {/* Footer Note */}
        <View style={styles(theme).footerNote}>
          <Ionicons name="information-circle" size={20} color={theme.colors.text.tertiary} />
          <Text style={styles(theme).footerText}>
            Cancel anytime. No hidden fees. All subscriptions include 7-day free trial.
          </Text>
        </View>

        <View style={{height: 100}} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    contentContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
    },
    toggleContainer: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surfaceSecondary,
      borderRadius: 12,
      padding: 4,
      marginBottom: theme.spacing.xl,
    },
    toggleButton: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      borderRadius: 8,
      alignItems: 'center',
      position: 'relative',
    },
    toggleButtonActive: {
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    toggleText: {
      ...theme.textStyles.bodyMedium,
      fontWeight: '600',
      color: theme.colors.text.secondary,
    },
    toggleTextActive: {
      color: theme.colors.text.primary,
    },
    savingsBadge: {
      position: 'absolute',
      top: -8,
      right: 8,
      backgroundColor: theme.colors.success,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
    },
    savingsText: {
      ...theme.textStyles.caption,
      fontSize: 10,
      fontWeight: '700',
      color: theme.colors.surface,
    },
    planCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderWidth: 2,
      borderColor: theme.colors.border.light,
      position: 'relative',
    },
    planCardFeatured: {
      borderColor: theme.colors.accent,
      borderWidth: 2,
      shadowColor: theme.colors.accent,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 6,
    },
    planCardCurrent: {
      borderColor: theme.colors.success,
      backgroundColor: theme.colors.success + '08',
    },
    badge: {
      position: 'absolute',
      top: -10,
      right: 20,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 6,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    badgeText: {
      ...theme.textStyles.caption,
      fontSize: 11,
      fontWeight: '700',
      color: theme.colors.surface,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    planName: {
      ...theme.textStyles.headline3,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.xs,
    },
    planTagline: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.md,
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
    },
    priceSymbol: {
      ...theme.textStyles.headline3,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginTop: 4,
    },
    price: {
      ...theme.textStyles.headline2,
      fontSize: 36,
      fontWeight: '800',
      color: theme.colors.text.primary,
      lineHeight: 42,
    },
    priceCents: {
      ...theme.textStyles.headline4,
      fontWeight: '700',
      color: theme.colors.text.secondary,
      marginTop: 8,
    },
    pricePeriod: {
      ...theme.textStyles.bodyLarge,
      color: theme.colors.text.tertiary,
      marginTop: 20,
      marginLeft: 4,
    },
    savings: {
      ...theme.textStyles.bodyMedium,
      fontWeight: '600',
      color: theme.colors.success,
      marginBottom: theme.spacing.lg,
    },
    featuresContainer: {
      marginBottom: theme.spacing.lg,
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
    },
    featureIcon: {
      marginRight: theme.spacing.sm,
      marginTop: 2,
    },
    featureText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.primary,
      flex: 1,
      lineHeight: 22,
    },
    ctaButton: {
      backgroundColor: theme.colors.accent,
      paddingVertical: theme.spacing.md + 2,
      borderRadius: 12,
      alignItems: 'center',
      shadowColor: theme.colors.accent,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    ctaButtonFeatured: {
      backgroundColor: theme.colors.accent,
    },
    ctaButtonCurrent: {
      backgroundColor: theme.colors.success + '20',
      borderWidth: 2,
      borderColor: theme.colors.success,
      shadowOpacity: 0,
      elevation: 0,
    },
    ctaButtonText: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '700',
      color: theme.colors.surface,
    },
    ctaButtonTextCurrent: {
      color: theme.colors.success,
    },
    footerNote: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surfaceSecondary,
      borderRadius: 12,
      padding: theme.spacing.lg,
      marginTop: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    footerText: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.text.secondary,
      flex: 1,
      lineHeight: 20,
    },
  });
