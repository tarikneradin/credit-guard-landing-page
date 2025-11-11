import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {Colors} from '../../constants/colors';
import {HeaderWithOptions} from '../../components/common/HeaderWithOptions';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    category: 'Credit Score',
    question: 'How often is my credit score updated?',
    answer:
      'Your credit score is updated once per month for free users. Plus members get daily updates, and Premium members get real-time updates whenever there are changes to your credit report.',
  },
  {
    category: 'Credit Score',
    question: 'Why did my credit score change?',
    answer:
      'Credit scores can change for many reasons including: payment history changes, credit utilization changes, new accounts or inquiries, account age changes, or corrections to errors on your report.',
  },
  {
    category: 'Account',
    question: 'How do I update my personal information?',
    answer:
      'Go to Settings > Profile to update your name, email, phone number, and address. Some changes may require identity verification for security purposes.',
  },
  {
    category: 'Account',
    question: 'How do I enable biometric login?',
    answer:
      'Go to Settings > Security and toggle on Biometric Login. Make sure Face ID or Touch ID is enabled in your device settings first.',
  },
  {
    category: 'Subscription',
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Yes, you can cancel your subscription at any time. Your access to premium features will continue until the end of your current billing period.',
  },
  {
    category: 'Subscription',
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, Mastercard, American Express, Discover), debit cards, and Apple Pay. All payments are processed securely through Stripe.',
  },
  {
    category: 'Security',
    question: 'Is my data secure?',
    answer:
      'Yes. We use bank-level 256-bit encryption to protect your data. We never sell your information to third parties and comply with all major security standards including PCI DSS and SOC 2.',
  },
  {
    category: 'Security',
    question: 'What if I suspect unauthorized access?',
    answer:
      'Immediately change your password and enable two-factor authentication in Settings > Security. You can also sign out all devices to end any active sessions.',
  },
];

export const HelpSupportScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@creditguard.com?subject=Support Request');
  };

  const handleCallSupport = () => {
    Alert.alert(
      'Call Support',
      'Our support team is available:\nMon-Fri: 9am - 6pm EST\nSat-Sun: 10am - 4pm EST\n\n+1 (555) 123-4567',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Call Now', onPress: () => Linking.openURL('tel:+15551234567')},
      ]
    );
  };

  const handleLiveChat = () => {
    Alert.alert('Live Chat', 'Live chat feature will be available soon.', [{text: 'OK'}]);
  };

  const handleViewTutorials = () => {
    Alert.alert('Video Tutorials', 'Tutorial videos will be available soon.', [{text: 'OK'}]);
  };

  const handleReportBug = () => {
    Alert.alert('Report a Bug', 'Bug reporting feature will be available soon.', [{text: 'OK'}]);
  };

  const handleFeatureRequest = () => {
    Alert.alert(
      'Feature Request',
      'Feature request form will be available soon.',
      [{text: 'OK'}]
    );
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const groupedFAQs = faqData.reduce((acc, faq, index) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push({...faq, index});
    return acc;
  }, {} as Record<string, Array<FAQItem & {index: number}>>);

  return (
    <SafeAreaView style={[styles(theme).container, {backgroundColor: theme.colors.background}]}>
      <HeaderWithOptions
        title="Help & Support"
        onBackPress={() => navigation.goBack()}
        showBackButton
      />

      <ScrollView style={styles(theme).scrollView} showsVerticalScrollIndicator={false}>
        {/* Contact Methods */}
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>Contact Support</Text>

          <TouchableOpacity style={styles(theme).contactCard} onPress={handleEmailSupport}>
            <View style={[styles(theme).contactIcon, {backgroundColor: theme.colors.accent + '15'}]}>
              <Ionicons name="mail" size={24} color={theme.colors.accent} />
            </View>
            <View style={styles(theme).contactInfo}>
              <Text style={styles(theme).contactTitle}>Email Support</Text>
              <Text style={styles(theme).contactSubtitle}>Response within 24 hours</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles(theme).contactCard} onPress={handleCallSupport}>
            <View style={[styles(theme).contactIcon, {backgroundColor: Colors.success + '15'}]}>
              <Ionicons name="call" size={24} color={Colors.success} />
            </View>
            <View style={styles(theme).contactInfo}>
              <Text style={styles(theme).contactTitle}>Phone Support</Text>
              <Text style={styles(theme).contactSubtitle}>Mon-Fri: 9am - 6pm EST</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles(theme).contactCard} onPress={handleLiveChat}>
            <View style={[styles(theme).contactIcon, {backgroundColor: theme.colors.info + '15'}]}>
              <Ionicons name="chatbubbles" size={24} color={theme.colors.info} />
            </View>
            <View style={styles(theme).contactInfo}>
              <Text style={styles(theme).contactTitle}>Live Chat</Text>
              <Text style={styles(theme).contactSubtitle}>Available for Premium members</Text>
            </View>
            <View style={styles(theme).premiumBadge}>
              <Text style={styles(theme).premiumText}>Premium</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Resources */}
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>Resources</Text>

          <TouchableOpacity style={styles(theme).resourceButton} onPress={handleViewTutorials}>
            <Ionicons name="play-circle-outline" size={24} color={theme.colors.text} />
            <Text style={styles(theme).resourceButtonText}>Video Tutorials</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles(theme).resourceButton}>
            <Ionicons name="book-outline" size={24} color={theme.colors.text} />
            <Text style={styles(theme).resourceButtonText}>Help Center</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles(theme).resourceButton}>
            <Ionicons name="school-outline" size={24} color={theme.colors.text} />
            <Text style={styles(theme).resourceButtonText}>Credit Education</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* FAQ */}
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>Frequently Asked Questions</Text>

          {Object.entries(groupedFAQs).map(([category, faqs]) => (
            <View key={category} style={styles(theme).faqCategory}>
              <Text style={styles(theme).faqCategoryTitle}>{category}</Text>

              {faqs.map(faq => (
                <TouchableOpacity
                  key={faq.index}
                  style={styles(theme).faqItem}
                  onPress={() => toggleFAQ(faq.index)}>
                  <View style={styles(theme).faqHeader}>
                    <Text style={styles(theme).faqQuestion}>{faq.question}</Text>
                    <Ionicons
                      name={expandedFAQ === faq.index ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color={theme.colors.textSecondary}
                    />
                  </View>
                  {expandedFAQ === faq.index && (
                    <Text style={styles(theme).faqAnswer}>{faq.answer}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        {/* Feedback */}
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>Feedback</Text>

          <TouchableOpacity style={styles(theme).feedbackButton} onPress={handleReportBug}>
            <Ionicons name="bug-outline" size={22} color={Colors.error} />
            <Text style={styles(theme).feedbackButtonText}>Report a Bug</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles(theme).feedbackButton} onPress={handleFeatureRequest}>
            <Ionicons name="bulb-outline" size={22} color={theme.colors.accent} />
            <Text style={styles(theme).feedbackButtonText}>Request a Feature</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles(theme).appInfoCard}>
          <View style={styles(theme).appInfoRow}>
            <Text style={styles(theme).appInfoLabel}>App Version</Text>
            <Text style={styles(theme).appInfoValue}>1.0.0 (Build 100)</Text>
          </View>
          <View style={styles(theme).appInfoRow}>
            <Text style={styles(theme).appInfoLabel}>Last Updated</Text>
            <Text style={styles(theme).appInfoValue}>January 15, 2025</Text>
          </View>
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
    section: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 16,
    },
    contactCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
    },
    contactIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    contactInfo: {
      flex: 1,
      marginLeft: 16,
    },
    contactTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    contactSubtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    premiumBadge: {
      backgroundColor: Colors.warning + '15',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      marginLeft: 8,
    },
    premiumText: {
      fontSize: 12,
      fontWeight: '700',
      color: Colors.warning,
    },
    resourceButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
    },
    resourceButtonText: {
      flex: 1,
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginLeft: 12,
    },
    faqCategory: {
      marginBottom: 16,
    },
    faqCategoryTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.accent,
      marginBottom: 12,
    },
    faqItem: {
      backgroundColor: theme.colors.card,
      padding: 16,
      borderRadius: 12,
      marginBottom: 8,
    },
    faqHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    faqQuestion: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.text,
      marginRight: 12,
    },
    faqAnswer: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 12,
      lineHeight: 20,
    },
    feedbackButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
    },
    feedbackButtonText: {
      flex: 1,
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginLeft: 12,
    },
    appInfoCard: {
      backgroundColor: theme.colors.card,
      padding: 16,
      borderRadius: 12,
      marginHorizontal: 20,
      marginBottom: 24,
    },
    appInfoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    appInfoLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    appInfoValue: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
    },
  });
