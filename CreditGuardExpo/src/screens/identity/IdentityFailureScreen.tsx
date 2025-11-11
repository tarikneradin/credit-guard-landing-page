import React from 'react';
import {View, Text, ScrollView, Modal, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute, RouteProp, StackActions} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {CreditButton, CreditCard} from '../../components/design-system';
import {Colors, Spacing, TextStyles} from '../../constants';
import {createStyles} from '../../utils/styles';
import {IdentityStackParamList} from '../../navigation/types';
import {classifyIdentityFailure, mapToFailureSignals} from '../../utils/identityFailures';

type IdentityFailureNavigationProp = StackNavigationProp<IdentityStackParamList, 'IdentityFailure'>;
type IdentityFailureRouteProp = RouteProp<IdentityStackParamList, 'IdentityFailure'>;

type FailureContent = {
  title: string;
  headline: string;
  description: string;
  guidance: string[];
  badgeLabel: string;
  badgeTone: 'warning' | 'error' | 'info';
};

const SHARED_FAILURE_GUIDANCE = [
  'Check that the entered information is accurate and complete',
  'Small changes like spelling can make a difference',
  "If you've recently moved, try using a previous address that you lived in for more than 3 months or",
  'Use an address that you typically use for receiving bills.',
];

const IDENTITY_CONTENT: Record<ReturnType<typeof classifyIdentityFailure>, FailureContent> = {
  verificationFailed: {
    title: 'Identity verification failed',
    headline: "We couldn't verify your identity",
    description: 'Sometimes the information provided does not fully match what we have on file.',
    guidance: SHARED_FAILURE_GUIDANCE,
    badgeLabel: 'Identity verification failed',
    badgeTone: 'error',
  },
  thinFile: {
    title: 'We need more information',
    headline: "We couldn't verify your identity",
    description:
      'Our partners could not find enough credit history to confirm your identity. We can try again with a different set of questions or finish verification through support.',
    guidance: [
      'Use a previous address where you received mail for at least three months.',
      'Ensure your name, SSN, and date of birth match your legal documents exactly.',
      'If you recently opened accounts, give them time to appear on your credit reports before retrying.',
    ],
    badgeLabel: 'Limited credit history',
    badgeTone: 'warning',
  },
  serviceIssue: {
    title: '',
    headline: 'Identity services are unavailable',
    description:
      'One of our vendors is experiencing a temporary outage. Please wait a short while and retry the identity step.',
    guidance: [
      'Give it a few minutes before submitting your information again.',
      'Confirm you have a stable internet connection before retrying.',
      'Contact support if the issue persists—we can finish verification for you.',
    ],
    badgeLabel: 'Service outage',
    badgeTone: 'info',
  },
  alreadyIdentified: {
    title: '',
    headline: 'Looks like you already verified your identity',
    description: 'You can continue by signing in to your existing CreditGuard account.',
    guidance: [
      'Return to the login screen and sign in with your email and password.',
      'If you do not remember your password, use the "Forgot password" link on the login screen.',
    ],
    badgeLabel: 'User already identified',
    badgeTone: 'info',
  },
  generic: {
    title: '',
    headline: "We couldn't verify your identity",
    description: 'Sometimes the information provided does not fully match what we have on file.',
    guidance: SHARED_FAILURE_GUIDANCE,
    badgeLabel: '',
    badgeTone: 'warning',
  },
};

const TRUST_COMPONENT_MAP: Record<
  string,
  'address' | 'identity' | 'device' | 'phone' | 'email' | 'ssn' | 'dob'
> = {
  addressTrust: 'address',
  identityTrust: 'identity',
  deviceTrust: 'device',
  phoneTrust: 'phone',
  emailTrust: 'email',
  SSNTrust: 'ssn',
  dobTrust: 'dob',
};

const TRUST_FAILURE_TITLES: Record<
  (typeof TRUST_COMPONENT_MAP)[keyof typeof TRUST_COMPONENT_MAP],
  string
> = {
  address: 'Address could not be verified',
  identity: 'Identity could not be verified',
  device: 'Device could not be verified',
  phone: 'Phone could not be verified',
  email: 'Email could not be verified',
  ssn: 'SSN could not be verified',
  dob: 'Date of birth could not be verified',
};

const TRUST_FAILURE_DESCRIPTIONS: Record<
  (typeof TRUST_COMPONENT_MAP)[keyof typeof TRUST_COMPONENT_MAP],
  string
> = {
  address:
    "Please check your address information. Small changes like spelling can make a difference. If you've recently moved, try using a previous address that you lived in for more than 3 months or use an address that you typically use for receiving bills.",
  identity:
    'Please verify your personal information. Check that the entered information is accurate and complete, including your full legal name, date of birth, and SSN.',
  device:
    'Please try from a different device or browser. Clear your browser cache and cookies, or try using a different network connection.',
  phone: 'Please check your phone number and ensure it is entered correctly.',
  email: 'Please check your email address and ensure it is entered correctly.',
  ssn: 'Please check your SSN and ensure it is entered correctly.',
  dob: 'Please check your date of birth and ensure it is entered correctly.',
};

type TrustFailure = {
  key: (typeof TRUST_COMPONENT_MAP)[keyof typeof TRUST_COMPONENT_MAP];
  title: string;
  description: string;
};

const extractTrustFailures = (rawDetails?: string[] | null) => {
  const failuresMap = new Map<TrustFailure['key'], TrustFailure>();

  rawDetails?.forEach(detail => {
    const trimmed = detail?.trim();
    if (!trimmed) {
      return;
    }
    const parts = trimmed.split('=');
    if (parts.length !== 2) {
      return;
    }
    const [rawKey, rawValue] = parts;
    const normalizedKey = rawKey.trim();
    const normalizedValue = rawValue.trim().toUpperCase();

    const trustKey = TRUST_COMPONENT_MAP[normalizedKey];
    if (!trustKey) {
      return;
    }

    if (normalizedValue !== 'N') {
      return;
    }

    if (!failuresMap.has(trustKey)) {
      failuresMap.set(trustKey, {
        key: trustKey,
        title: TRUST_FAILURE_TITLES[trustKey],
        description: TRUST_FAILURE_DESCRIPTIONS[trustKey],
      });
    }
  });

  return {
    trustFailures: Array.from(failuresMap.values()),
  };
};

export const IdentityFailureScreen: React.FC = () => {
  const navigation = useNavigation<IdentityFailureNavigationProp>();
  const route = useRoute<IdentityFailureRouteProp>();

  const {message, details, codes} = route.params;
  const [messagesModalVisible, setMessagesModalVisible] = React.useState(false);
  const {trustFailures} = React.useMemo(() => extractTrustFailures(details), [details]);
  const messageEntries = React.useMemo(() => {
    const entries: Array<{title: string; body: string}> = [];

    if (message) {
      entries.push({title: 'Message', body: message});
    }

    if (codes && codes.length > 0) {
      entries.push({
        title: codes.length === 1 ? 'Code' : 'Codes',
        body: codes.join(', '),
      });
    }

    return entries;
  }, [message, codes]);
  const hasModalEntries = trustFailures.length > 0 || messageEntries.length > 0;

  const failureVariant = React.useMemo(
    () => classifyIdentityFailure(mapToFailureSignals({message, details, codes})),
    [message, details, codes],
  );
  const failureContent = IDENTITY_CONTENT[failureVariant] ?? IDENTITY_CONTENT.generic;
  const isAlreadyIdentified = failureVariant === 'alreadyIdentified';
  const badgeStyle =
    failureContent.badgeTone === 'error'
      ? styles.badgeError
      : failureContent.badgeTone === 'info'
        ? styles.badgeInfo
        : styles.badgeWarning;

  const handleTryAgain = () => {
    navigation.replace('PersonalInfo');
  };

  const handleGoToLogin = () => {
    const rootNavigation = navigation.getParent();
    if (rootNavigation) {
      rootNavigation.dispatch(StackActions.replace('Auth', {screen: 'Login'}));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        <View style={styles.hero}>
          {failureContent.badgeLabel ? (
            <View style={[styles.badge, badgeStyle]}>
              <Text style={styles.badgeText}>{failureContent.badgeLabel}</Text>
            </View>
          ) : null}
          {failureContent.title ? (
            <Text style={styles.heroTitle}>{failureContent.title}</Text>
          ) : null}
          <Text style={styles.heroHeadline}>{failureContent.headline}</Text>
          <Text style={styles.heroDescription}>{failureContent.description}</Text>
        </View>

        <CreditCard style={styles.card}>
          <Text style={styles.sectionTitle}>
            {isAlreadyIdentified ? 'Next steps' : 'Please try again and do the following:'}
          </Text>
          <View style={styles.guidanceList}>
            {failureContent.guidance.map(item => (
              <View key={item} style={styles.guidanceItem}>
                <View style={styles.bullet} />
                <Text style={styles.guidanceText}>{item}</Text>
              </View>
            ))}
          </View>

          {hasModalEntries ? (
            <TouchableOpacity
              onPress={() => setMessagesModalVisible(true)}
              style={styles.modalTrigger}
              accessibilityRole="button">
              <Text style={styles.modalTriggerText}>
                You can <Text style={styles.modalTriggerLink}>click here</Text> to review the
                details.
              </Text>
            </TouchableOpacity>
          ) : null}

          <View style={styles.buttonGroup}>
            <CreditButton
              title={isAlreadyIdentified ? 'Go to login' : 'Try Again'}
              onPress={isAlreadyIdentified ? handleGoToLogin : handleTryAgain}
              fullWidth
            />
          </View>
        </CreditCard>
      </ScrollView>
      <Modal
        transparent
        visible={messagesModalVisible}
        animationType="fade"
        onRequestClose={() => setMessagesModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>What went wrong?</Text>
              <TouchableOpacity
                onPress={() => setMessagesModalVisible(false)}
                accessibilityRole="button">
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}>
              <View style={styles.modalList}>
                {trustFailures.map(entry => (
                  <View key={entry.key} style={styles.modalItem}>
                    <Text style={styles.modalItemTitle}>{entry.title}</Text>
                    <Text style={styles.modalItemText}>{entry.description}</Text>
                  </View>
                ))}
                {messageEntries.map(entry => (
                  <View key={`${entry.title}-${entry.body}`} style={styles.modalItem}>
                    <Text style={styles.modalItemTitle}>{entry.title}</Text>
                    <Text style={styles.modalItemText}>{entry.body}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
            <CreditButton
              title="Close"
              onPress={() => setMessagesModalVisible(false)}
              style={styles.modalButton}
              fullWidth
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = createStyles({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.lg,
  },
  hero: {
    marginBottom: Spacing.xxl,
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 999,
    marginBottom: Spacing.md,
  },
  badgeWarning: {
    backgroundColor: Colors.alert.warningBg,
  },
  badgeError: {
    backgroundColor: Colors.alert.errorBg,
  },
  badgeInfo: {
    backgroundColor: Colors.alert.infoBg,
  },
  badgeText: {
    ...TextStyles.caption,
    fontWeight: '600',
    color: Colors.text.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  heroTitle: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  heroHeadline: {
    ...TextStyles.headline2,
    textAlign: 'center',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  heroDescription: {
    ...TextStyles.bodyRegular,
    textAlign: 'center',
    color: Colors.text.secondary,
  },
  card: {
    padding: Spacing.xxl,
  },
  sectionTitle: {
    ...TextStyles.headline4,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  guidanceList: {
    marginBottom: Spacing.xl,
  },
  guidanceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: Spacing.sm,
    backgroundColor: Colors.primary,
  },
  guidanceText: {
    ...TextStyles.bodySmall,
    color: Colors.text.secondary,
    flex: 1,
    marginLeft: Spacing.md,
  },
  alertMessage: {
    ...TextStyles.bodyRegular,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  detailsCard: {
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: 14,
    padding: Spacing.lg,
    backgroundColor: Colors.surfaceSecondary,
    marginBottom: Spacing.xl,
  },
  detailsTitle: {
    ...TextStyles.bodySmall,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  detailItem: {
    ...TextStyles.bodySmall,
    color: Colors.text.primary,
    marginTop: Spacing.xs,
  },
  buttonGroup: {
    width: '100%',
  },
  closeButton: {
    marginTop: Spacing.sm,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: Spacing.xxl,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    ...TextStyles.headline3,
    color: Colors.text.primary,
  },
  modalClose: {
    ...TextStyles.headline3,
    color: Colors.text.secondary,
  },
  modalScroll: {
    maxHeight: 360,
    marginBottom: Spacing.xl,
  },
  modalScrollContent: {
    paddingRight: Spacing.sm,
  },
  modalList: {
    gap: Spacing.md,
  },
  modalItem: {
    backgroundColor: Colors.alert.errorBg,
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.alert.error,
  },
  modalItemTitle: {
    ...TextStyles.bodySmall,
    fontWeight: '600',
    color: Colors.error,
    marginBottom: Spacing.xs,
  },
  modalItemText: {
    ...TextStyles.bodySmall,
    color: Colors.text.primary,
    lineHeight: 20,
  },
  modalButton: {
    marginTop: Spacing.sm,
  },
  modalTrigger: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTriggerText: {
    ...TextStyles.bodyRegular,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  modalTriggerLink: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  modalInfoIcon: {
    color: Colors.primary,
    marginRight: 2,
  },
});

export default IdentityFailureScreen;
