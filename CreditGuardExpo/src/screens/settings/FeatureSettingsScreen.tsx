import React, {useEffect} from 'react';
import {View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../contexts/ThemeContext';
import {useFeatureFlagsStore, FeatureFlags} from '../../stores/featureFlagsStore';

interface FeatureItem {
  key: keyof FeatureFlags;
  label: string;
  description: string;
  icon: string;
}

interface FeatureSection {
  title: string;
  icon: string;
  categoryKey?: keyof FeatureFlags; // Main toggle for entire category
  features: FeatureItem[];
}

const FEATURE_SECTIONS: FeatureSection[] = [
  {
    title: 'Score',
    icon: 'speedometer',
    categoryKey: 'creditScore',
    features: [
      {
        key: 'creditScore',
        label: 'Score Monitoring',
        description: 'View and track your credit score',
        icon: 'speedometer',
      },
      {
        key: 'scoreTrend',
        label: 'Score Trend',
        description: 'Historical credit score trends and charts',
        icon: 'trending-up',
      },
      {
        key: 'improvementPlan',
        label: 'Improvement Plan',
        description: 'Personalized plan to improve your credit score',
        icon: 'clipboard',
      },
      {
        key: 'achievements',
        label: 'Achievements',
        description: 'Earn badges and track score milestones',
        icon: 'trophy',
      },
    ],
  },
  {
    title: 'Report',
    icon: 'document-text',
    categoryKey: 'creditReport',
    features: [
      {
        key: 'creditReport',
        label: 'Credit Report Overview',
        description: 'Access to full credit report',
        icon: 'document-text',
      },
      {
        key: 'accounts',
        label: 'Accounts',
        description: 'View all your credit accounts',
        icon: 'card',
      },
      {
        key: 'creditInquiries',
        label: 'Inquiries',
        description: 'See hard and soft credit inquiries',
        icon: 'search',
      },
      {
        key: 'publicRecords',
        label: 'Public Records',
        description: 'View bankruptcies, liens, and judgments',
        icon: 'shield-checkmark',
      },
      {
        key: 'personalInfo',
        label: 'Personal Info',
        description: 'Review personal information on your credit file',
        icon: 'person',
      },
      {
        key: 'paymentHistory',
        label: 'Payment History',
        description: 'View 24-month payment history calendar',
        icon: 'calendar',
      },
    ],
  },
  {
    title: 'AI Tools',
    icon: 'sparkles',
    categoryKey: 'aiAssistant',
    features: [
      {
        key: 'aiAssistant',
        label: 'AI Assistant',
        description: 'Chat with AI for personalized credit advice',
        icon: 'chatbubbles',
      },
      {
        key: 'smartActions',
        label: 'Smart Actions',
        description: 'AI-powered recommendations to improve credit',
        icon: 'bulb',
      },
      {
        key: 'optimalPath',
        label: 'Optimal Path',
        description: 'Step-by-step path to reach your credit goals',
        icon: 'compass',
      },
    ],
  },
  {
    title: 'Offers',
    icon: 'gift',
    categoryKey: 'offers',
    features: [
      {
        key: 'offers',
        label: 'Personalized Offers',
        description: 'View credit card and loan offers tailored to your profile',
        icon: 'gift',
      },
    ],
  },
  {
    title: 'Alerts',
    icon: 'notifications',
    categoryKey: 'alerts',
    features: [
      {
        key: 'alerts',
        label: 'Credit Alerts',
        description: 'Get notified about changes to your credit',
        icon: 'notifications',
      },
      {
        key: 'identityMonitoring',
        label: 'Identity Monitoring',
        description: 'Detect suspicious activity and new accounts',
        icon: 'alert-circle',
      },
    ],
  },
  {
    title: 'Other',
    icon: 'settings',
    categoryKey: undefined,
    features: [
      {
        key: 'disputes',
        label: 'Disputes',
        description: 'File disputes for inaccurate credit information',
        icon: 'document-attach',
      },
    ],
  },
];

export const FeatureSettingsScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const styles = createStyles(theme);
  const {flags, isLoading, loadFlags, toggleFeature, resetToDefaults} = useFeatureFlagsStore();

  useEffect(() => {
    loadFlags();
  }, [loadFlags]);

  const handleToggle = (feature: keyof FeatureFlags) => {
    toggleFeature(feature);
  };

  const handleCategoryToggle = (categoryKey: keyof FeatureFlags, features: FeatureItem[]) => {
    const currentValue = flags[categoryKey];
    const newValue = !currentValue;

    // Toggle the category and all its related features
    toggleFeature(categoryKey);

    // If we're enabling the category, enable all sub-features
    // If disabling, disable all sub-features
    features.forEach(feature => {
      if (feature.key !== categoryKey && flags[feature.key] !== newValue) {
        toggleFeature(feature.key);
      }
    });
  };

  const handleResetToDefaults = () => {
    Alert.alert(
      'Reset to Defaults',
      'Are you sure you want to reset all features to their default settings? All features will be enabled.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetToDefaults();
            Alert.alert('Success', 'All features have been reset to defaults.');
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={28} color={theme.colors.accent} />
        </TouchableOpacity>
        <Text style={styles.headerBarTitle}>Feature Settings</Text>
        <View style={styles.headerBarSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="options" size={32} color={theme.colors.accent} />
          <Text style={styles.headerTitle}>Manage Features</Text>
          <Text style={styles.headerSubtitle}>
            Control which features are visible in the app. Disabled features will be hidden from
            navigation and UI.
          </Text>
        </View>

        {/* Feature Sections */}
        {FEATURE_SECTIONS.map(section => {
          const isCategoryEnabled = section.categoryKey ? flags[section.categoryKey] : true;

          return (
            <View key={section.title} style={styles.section}>
              {/* Section Header with Category Toggle */}
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Ionicons
                    name={section.icon as keyof typeof Ionicons.glyphMap}
                    size={20}
                    color={theme.colors.accent}
                  />
                </View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section.categoryKey && (
                  <Switch
                    value={isCategoryEnabled}
                    onValueChange={() =>
                      handleCategoryToggle(section.categoryKey!, section.features)
                    }
                    trackColor={{
                      false: theme.colors.border.medium,
                      true: theme.colors.accent + '80',
                    }}
                    thumbColor={isCategoryEnabled ? theme.colors.accent : theme.colors.surface}
                    ios_backgroundColor={theme.colors.border.medium}
                  />
                )}
              </View>

              {/* Feature Cards */}
              <View style={styles.featuresContainer}>
                {section.features.map((feature, index) => {
                  const isEnabled = flags[feature.key];
                  const isDisabled = section.categoryKey ? !flags[section.categoryKey] : false;

                  return (
                    <View
                      key={feature.key}
                      style={[
                        styles.featureCard,
                        index === section.features.length - 1 && styles.featureCardLast,
                        isDisabled && styles.featureCardDisabled,
                      ]}>
                      <View
                        style={[
                          styles.featureIconContainer,
                          isDisabled && styles.featureIconDisabled,
                        ]}>
                        <Ionicons
                          name={feature.icon as keyof typeof Ionicons.glyphMap}
                          size={22}
                          color={
                            isDisabled
                              ? theme.colors.text.quaternary
                              : isEnabled
                                ? theme.colors.accent
                                : theme.colors.text.tertiary
                          }
                        />
                      </View>

                      <View style={styles.featureContent}>
                        <Text
                          style={[styles.featureLabel, isDisabled && styles.featureLabelDisabled]}>
                          {feature.label}
                        </Text>
                        <Text
                          style={[
                            styles.featureDescription,
                            isDisabled && styles.featureDescriptionDisabled,
                          ]}>
                          {feature.description}
                        </Text>
                      </View>

                      <Switch
                        value={isEnabled}
                        onValueChange={() => handleToggle(feature.key)}
                        disabled={isDisabled}
                        trackColor={{
                          false: theme.colors.border.medium,
                          true: theme.colors.accent + '80',
                        }}
                        thumbColor={isEnabled ? theme.colors.accent : theme.colors.surface}
                        ios_backgroundColor={theme.colors.border.medium}
                      />
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}

        {/* Reset Button */}
        <TouchableOpacity style={styles.resetButton} onPress={handleResetToDefaults}>
          <Ionicons name="refresh" size={20} color={theme.colors.error} />
          <Text style={styles.resetButtonText}>Reset to Defaults</Text>
        </TouchableOpacity>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={theme.colors.accent} />
          <Text style={styles.infoText}>
            Changes take effect immediately. Disabled features will be hidden from navigation and
            won't be accessible until re-enabled. Category toggles control all features within that
            section.
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: {
  colors: Record<string, any>;
  spacing: Record<string, number>;
  textStyles: Record<string, any>;
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    headerBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.light,
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
      backgroundColor: theme.colors.accent + '15',
    },
    headerBarTitle: {
      ...theme.textStyles.headline3,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    headerBarSpacer: {
      width: 40,
    },
    scrollView: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    loadingText: {
      ...theme.textStyles.bodyLarge,
      color: theme.colors.text.secondary,
    },
    header: {
      padding: theme.spacing.lg,
      paddingTop: theme.spacing.xl,
      alignItems: 'center',
    },
    headerTitle: {
      ...theme.textStyles.headline2,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.xs,
    },
    headerSubtitle: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    section: {
      marginTop: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    sectionIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.accent + '15',
      alignItems: 'center',
      justifyContent: 'center',
    },
    sectionTitle: {
      ...theme.textStyles.headline3,
      fontWeight: '600',
      color: theme.colors.text.primary,
      flex: 1,
    },
    featuresContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.border.light,
    },
    featureCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.light,
    },
    featureCardLast: {
      borderBottomWidth: 0,
    },
    featureCardDisabled: {
      opacity: 0.5,
    },
    featureIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.accent + '10',
      alignItems: 'center',
      justifyContent: 'center',
    },
    featureIconDisabled: {
      backgroundColor: theme.colors.border.light,
    },
    featureContent: {
      flex: 1,
    },
    featureLabel: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    featureLabelDisabled: {
      color: theme.colors.text.tertiary,
    },
    featureDescription: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.text.secondary,
      lineHeight: 18,
    },
    featureDescriptionDisabled: {
      color: theme.colors.text.quaternary,
    },
    resetButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      marginHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.xl,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.error + '10',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.error + '30',
    },
    resetButtonText: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '600',
      color: theme.colors.error,
    },
    infoBox: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.xl,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.accent + '10',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.accent + '20',
    },
    infoText: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.text.secondary,
      flex: 1,
      lineHeight: 20,
    },
    bottomPadding: {
      height: theme.spacing.xl,
    },
  });
