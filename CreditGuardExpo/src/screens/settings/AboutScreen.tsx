import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {Colors} from '../../constants/colors';
import {HeaderWithOptions} from '../../components/common/HeaderWithOptions';

export const AboutScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();

  const handleOpenWebsite = () => {
    Linking.openURL('https://www.creditguard.com');
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://www.creditguard.com/privacy');
  };

  const handleTermsOfService = () => {
    Linking.openURL('https://www.creditguard.com/terms');
  };

  const handleLicenses = () => {
    Alert.alert('Open Source Licenses', 'Licenses screen will be available soon.', [{text: 'OK'}]);
  };

  const handleRateApp = () => {
    Alert.alert(
      'Rate CreditGuard',
      'We appreciate your feedback! Would you like to rate us on the App Store?',
      [
        {text: 'Not Now', style: 'cancel'},
        {
          text: 'Rate Now',
          onPress: () => {
            // App Store URL would go here
            Alert.alert('Thank you!', 'This would open the App Store rating page.');
          },
        },
      ]
    );
  };

  const handleShareApp = () => {
    Alert.alert(
      'Share CreditGuard',
      'Share this app with friends and family to help them improve their credit!',
      [{text: 'OK'}]
    );
  };

  return (
    <SafeAreaView style={[styles(theme).container, {backgroundColor: theme.colors.background}]}>
      <HeaderWithOptions title="About" onBackPress={() => navigation.goBack()} showBackButton />

      <ScrollView style={styles(theme).scrollView} showsVerticalScrollIndicator={false}>
        {/* App Logo & Info */}
        <View style={styles(theme).logoSection}>
          <View style={styles(theme).logoPlaceholder}>
            <Ionicons name="shield-checkmark" size={60} color={theme.colors.accent} />
          </View>
          <Text style={styles(theme).appName}>CreditGuard</Text>
          <Text style={styles(theme).appTagline}>Your Credit, Optimized</Text>
          <Text style={styles(theme).appVersion}>Version 1.0.0 (Build 100)</Text>
        </View>

        {/* Mission Statement */}
        <View style={styles(theme).section}>
          <Text style={styles(theme).missionTitle}>Our Mission</Text>
          <Text style={styles(theme).missionText}>
            CreditGuard empowers you to take control of your financial future with AI-powered
            credit monitoring, personalized insights, and actionable recommendations. We believe
            everyone deserves access to tools that help them achieve their credit goals.
          </Text>
        </View>

        {/* Features Highlights */}
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>What We Offer</Text>

          <View style={styles(theme).featureRow}>
            <View style={styles(theme).featureIcon}>
              <Ionicons name="analytics" size={24} color={theme.colors.accent} />
            </View>
            <View style={styles(theme).featureContent}>
              <Text style={styles(theme).featureTitle}>Real-Time Credit Monitoring</Text>
              <Text style={styles(theme).featureDescription}>
                Track your credit score and get instant alerts
              </Text>
            </View>
          </View>

          <View style={styles(theme).featureRow}>
            <View style={styles(theme).featureIcon}>
              <Ionicons name="sparkles" size={24} color={theme.colors.info} />
            </View>
            <View style={styles(theme).featureContent}>
              <Text style={styles(theme).featureTitle}>AI-Powered Insights</Text>
              <Text style={styles(theme).featureDescription}>
                Get personalized recommendations to improve your score
              </Text>
            </View>
          </View>

          <View style={styles(theme).featureRow}>
            <View style={styles(theme).featureIcon}>
              <Ionicons name="shield" size={24} color={Colors.success} />
            </View>
            <View style={styles(theme).featureContent}>
              <Text style={styles(theme).featureTitle}>Identity Protection</Text>
              <Text style={styles(theme).featureDescription}>
                Monitor for fraud and identity theft 24/7
              </Text>
            </View>
          </View>

          <View style={styles(theme).featureRow}>
            <View style={styles(theme).featureIcon}>
              <Ionicons name="school" size={24} color={Colors.warning} />
            </View>
            <View style={styles(theme).featureContent}>
              <Text style={styles(theme).featureTitle}>Credit Education</Text>
              <Text style={styles(theme).featureDescription}>
                Learn how to build and maintain excellent credit
              </Text>
            </View>
          </View>
        </View>

        {/* Legal & Info */}
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>Legal & Information</Text>

          <TouchableOpacity style={styles(theme).linkButton} onPress={handlePrivacyPolicy}>
            <Ionicons name="shield-checkmark-outline" size={22} color={theme.colors.text} />
            <Text style={styles(theme).linkButtonText}>Privacy Policy</Text>
            <Ionicons name="open-outline" size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles(theme).linkButton} onPress={handleTermsOfService}>
            <Ionicons name="document-text-outline" size={22} color={theme.colors.text} />
            <Text style={styles(theme).linkButtonText}>Terms of Service</Text>
            <Ionicons name="open-outline" size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles(theme).linkButton} onPress={handleLicenses}>
            <Ionicons name="code-slash-outline" size={22} color={theme.colors.text} />
            <Text style={styles(theme).linkButtonText}>Open Source Licenses</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles(theme).linkButton} onPress={handleOpenWebsite}>
            <Ionicons name="globe-outline" size={22} color={theme.colors.text} />
            <Text style={styles(theme).linkButtonText}>Visit Our Website</Text>
            <Ionicons name="open-outline" size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Social Actions */}
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>Share the Love</Text>

          <TouchableOpacity
            style={[styles(theme).actionCard, {backgroundColor: theme.colors.accent + '15'}]}
            onPress={handleRateApp}>
            <Ionicons name="star" size={24} color={theme.colors.accent} />
            <View style={styles(theme).actionCardContent}>
              <Text style={styles(theme).actionCardTitle}>Rate CreditGuard</Text>
              <Text style={styles(theme).actionCardSubtitle}>
                Help us improve with your feedback
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.accent} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles(theme).actionCard, {backgroundColor: theme.colors.info + '15'}]}
            onPress={handleShareApp}>
            <Ionicons name="share-social" size={24} color={theme.colors.info} />
            <View style={styles(theme).actionCardContent}>
              <Text style={styles(theme).actionCardTitle}>Share with Friends</Text>
              <Text style={styles(theme).actionCardSubtitle}>
                Help others improve their credit too
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.info} />
          </TouchableOpacity>
        </View>

        {/* Contact */}
        <View style={styles(theme).contactSection}>
          <Text style={styles(theme).contactTitle}>Get in Touch</Text>
          <View style={styles(theme).contactRow}>
            <Ionicons name="mail" size={18} color={theme.colors.textSecondary} />
            <Text style={styles(theme).contactText}>support@creditguard.com</Text>
          </View>
          <View style={styles(theme).contactRow}>
            <Ionicons name="call" size={18} color={theme.colors.textSecondary} />
            <Text style={styles(theme).contactText}>+1 (555) 123-4567</Text>
          </View>
          <View style={styles(theme).contactRow}>
            <Ionicons name="location" size={18} color={theme.colors.textSecondary} />
            <Text style={styles(theme).contactText}>San Francisco, CA 94102</Text>
          </View>
        </View>

        {/* Copyright */}
        <View style={styles(theme).copyrightSection}>
          <Text style={styles(theme).copyrightText}>© 2025 CreditGuard Inc.</Text>
          <Text style={styles(theme).copyrightText}>All rights reserved.</Text>
          <Text style={styles(theme).builtWithText}>Built with ❤️ in San Francisco</Text>
        </View>

        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    logoSection: {
      alignItems: 'center',
      paddingVertical: 32,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    logoPlaceholder: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.colors.accent + '15',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    appName: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 4,
    },
    appTagline: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    appVersion: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    section: {
      paddingHorizontal: 20,
      marginTop: 24,
    },
    missionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 12,
      textAlign: 'center',
    },
    missionText: {
      fontSize: 15,
      color: theme.colors.textSecondary,
      lineHeight: 22,
      textAlign: 'center',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 16,
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    featureIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.card,
      justifyContent: 'center',
      alignItems: 'center',
    },
    featureContent: {
      flex: 1,
      marginLeft: 16,
    },
    featureTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 2,
    },
    featureDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    linkButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
    },
    linkButtonText: {
      flex: 1,
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginLeft: 12,
    },
    actionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
    },
    actionCardContent: {
      flex: 1,
      marginLeft: 12,
    },
    actionCardTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.text,
    },
    actionCardSubtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    contactSection: {
      paddingHorizontal: 20,
      marginTop: 24,
      paddingTop: 24,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    contactTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 12,
    },
    contactRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    contactText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginLeft: 8,
    },
    copyrightSection: {
      alignItems: 'center',
      paddingVertical: 24,
      marginTop: 24,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    copyrightText: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    builtWithText: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      marginTop: 8,
      fontStyle: 'italic',
    },
  });
