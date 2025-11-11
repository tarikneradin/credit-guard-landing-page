import React from 'react';
import {View, Text, TouchableOpacity, Alert, Modal, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {CreditButton, CreditCard} from '../../components/design-system';
import {IdentityStackParamList} from '../../navigation/types';
import {useIdentityStore} from '../../stores/identityStore';
import {useAuthStore} from '../../stores/authStore';
import {useSmfaCooldown} from '../../utils/hooks/useSmfaCooldown';
import {maskEmail} from '../../utils/identity';
import {smfaFailureStyles as styles} from '../../styles/identity/smfaFailureStyles';
import {
  classifySmfaFailure,
  mapToFailureSignals,
  SmfaFailureVariant,
} from '../../utils/identityFailures';

type SmfaFailureNavigationProp = StackNavigationProp<IdentityStackParamList, 'SmfaFailure'>;
type SmfaFailureRouteProp = RouteProp<IdentityStackParamList, 'SmfaFailure'>;

type SmfaFailureContent = {
  badgeLabel: string;
  badgeTone: 'warning' | 'error' | 'info';
  title: string;
  headline: string;
  description: string;
  actions: Array<{label: string; link?: boolean; onPress?: () => void}>;
  tips: string[];
};

const SMFA_CONTENT: Record<SmfaFailureVariant, SmfaFailureContent> = {
  verificationDenied: {
    badgeLabel: 'Verification denied',
    badgeTone: 'error',
    title: 'Verification blocked',
    headline: 'We couldn’t confirm this device',
    description:
      'Your multi-factor authentication check failed because the device or phone number could not be validated as belonging to you.',
    actions: [
      {
        label: 'Try again using email verification.',
        link: true,
      },
    ],
    tips: [
      'Verify that you have access to the phone number on file and that it’s capable of receiving SMS links.',
      'Ensure you’re connected to a secure network and not using a VPN or proxy that might block verification.',
      'If you believe this is a mistake, contact support so we can help verify your identity.',
    ],
  },
  statusMismatch: {
    badgeLabel: 'Device mismatch detected',
    badgeTone: 'warning',
    title: 'Another verification method might help',
    headline: 'We couldn’t match this phone',
    description:
      'Our security partner couldn’t confirm that this phone belongs to you. You can try again after adjusting your details or switch to email verification.',
    actions: [
      {
        label: 'Try again using email verification.',
        link: true,
      },
    ],
    tips: [
      'Double-check the phone number you entered matches the one on your CreditGuard account.',
      'If you changed phones recently, try using the previous device or update your number in account settings.',
      'Try moving to an area with stronger signal or switching off Wi-Fi calling/VoIP apps.',
    ],
  },
  incomplete: {
    badgeLabel: 'Verification incomplete',
    badgeTone: 'warning',
    title: 'Finish the verification step',
    headline: 'The secure link wasn’t completed',
    description:
      'We didn’t receive confirmation that you tapped the secure link. Open the most recent SMS or email and complete the authorization before returning.',
    actions: [
      {
        label: 'Open the latest verification message',
        link: true,
      },
    ],
    tips: [
      'Tap the most recent secure link and allow the browser to finish loading before returning.',
      'If you opened an older link, request a new one to ensure it is still valid.',
      'Disable private browsing, VPNs, or enterprise profiles that might block the redirect.',
    ],
  },
  thinFile: {
    badgeLabel: 'Limited credit data',
    badgeTone: 'warning',
    title: 'We need another way to verify',
    headline: 'There wasn’t enough credit history to continue',
    description:
      'Our security partner could not confirm your identity because there wasn’t enough credit information on file. We’ll guide you through alternate verification options.',
    actions: [
      {
        label: 'Try again using email verification.',
        link: true,
      },
    ],
    tips: [
      'Double-check the details you entered match your legal documents exactly.',
      'If you recently opened new accounts, wait for lenders to report them before retrying.',
      'Contact support so we can help verify your identity another way.',
    ],
  },
  eidMismatch: {
    badgeLabel: 'Identity partially verified',
    badgeTone: 'info',
    title: 'We need one more confirmation',
    headline: 'Most checks passed, but enrollment isn’t complete',
    description:
      'Your identity was verified, but enrollment into secure features did not finish. Complete the remaining steps or contact support to review your enrollment.',
    actions: [
      {
        label: 'Try again using email verification.',
        link: true,
      },
    ],
    tips: [
      'Retry with the alternate verification channel listed below.',
      'Ensure you’re using the same device that received the secure link.',
      'Reach out to support if you continue to see this message so we can finalize enrollment.',
    ],
  },
  serviceIssue: {
    badgeLabel: 'Service temporarily unavailable',
    badgeTone: 'info',
    title: 'SMFA temporarily unavailable',
    headline: 'We couldn’t reach the verification service',
    description:
      'One of our security vendors is currently unavailable. Wait a short while and retry, or switch to email verification instead.',
    actions: [
      {
        label: 'Try again using email verification.',
        link: true,
      },
    ],
    tips: [
      'Give it a few minutes before requesting another verification link.',
      'Ensure you have a stable internet connection before retrying.',
      'Check our status page or contact support if the issue persists.',
    ],
  },
  generic: {
    badgeLabel: 'Verification unavailable',
    badgeTone: 'info',
    title: 'SMFA temporarily unavailable',
    headline: 'We couldn’t complete this step',
    description:
      'There was an issue finishing the multi-factor verification. You can retry shortly or switch to email verification instead.',
    actions: [
      {
        label: 'Try again using email verification.',
        link: true,
      },
    ],
    tips: [
      'Confirm your phone is powered on and can receive SMS messages.',
      'Turn off any VPN or firewall apps that might block verification links.',
      'Wait a moment and retry—temporary outages usually resolve quickly.',
    ],
  },
};

export const SmfaFailureScreen: React.FC = () => {
  const navigation = useNavigation<SmfaFailureNavigationProp>();
  const route = useRoute<SmfaFailureRouteProp>();
  const {clearSmfaFailure, clearError, sendEmailVerificationLink, isLoading, smfaCooldownUntil} =
    useIdentityStore();
  const {user} = useAuthStore();
  const {message, details, codes} = route.params;
  const maskedEmail = user?.email ? maskEmail(user.email) : 'your email address';
  const {cooldownSeconds, isCooldownActive} = useSmfaCooldown(smfaCooldownUntil);
  const [messagesModalVisible, setMessagesModalVisible] = React.useState(false);
  const modalEntries = React.useMemo(() => {
    const entries: Array<{title: string; body: string}> = [];

    if (message) {
      entries.push({title: 'Message', body: message});
    }
    details?.forEach(rawDetail => {
      const detail = rawDetail?.trim();
      if (!detail) {
        return;
      }
      const newlineIndex = detail.indexOf('\n');
      const colonIndex = detail.indexOf(':');

      if (newlineIndex !== -1) {
        const title = detail.slice(0, newlineIndex).trim();
        const body = detail.slice(newlineIndex + 1).trim() || detail;
        entries.push({title: title || 'Detail', body});
      } else if (colonIndex !== -1) {
        const title = detail.slice(0, colonIndex).trim();
        const body = detail.slice(colonIndex + 1).trim() || detail;
        entries.push({title: title || 'Detail', body});
      } else {
        entries.push({title: 'Detail', body: detail});
      }
    });
    if (codes && codes.length > 0) {
      entries.push({
        title: codes.length === 1 ? 'Code' : 'Codes',
        body: codes.join(', '),
      });
    }

    return entries;
  }, [message, details, codes]);
  const variant = React.useMemo(
    () => classifySmfaFailure(mapToFailureSignals({message, details, codes})),
    [message, details, codes],
  );
  const failureContent = SMFA_CONTENT[variant] ?? SMFA_CONTENT.generic;
  const badgeStyle =
    failureContent.badgeTone === 'error'
      ? styles.badgeError
      : failureContent.badgeTone === 'warning'
        ? styles.badgeWarning
        : styles.badgeInfo;

  const handleContinue = () => {
    clearError();
    clearSmfaFailure();
    navigation.replace('PersonalInfo');
  };

  const handleEmailFallback = async () => {
    try {
      await sendEmailVerificationLink();
      clearSmfaFailure();
      clearError();
      navigation.replace('EmailVerification', {maskedEmail});
    } catch {
      Alert.alert('Email Verification', 'Unable to send verification email. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <View style={[styles.badge, badgeStyle]}>
            <Text style={styles.badgeText}>{failureContent.badgeLabel}</Text>
          </View>
          <Text style={styles.heroTitle}>{failureContent.title}</Text>
          <Text style={styles.heroHeadline}>{failureContent.headline}</Text>
          <Text style={styles.heroDescription}>{failureContent.description}</Text>
        </View>

        <CreditCard style={styles.card}>
          <Text style={styles.sectionTitle}>What to do next</Text>
          <View style={styles.guidanceList}>
            {failureContent.tips.map(tip => (
              <View key={tip} style={styles.guidanceItem}>
                <View style={styles.bullet} />
                <Text style={styles.guidanceText}>{tip}</Text>
              </View>
            ))}
          </View>
          <CreditButton
            title="Try again with email"
            onPress={handleEmailFallback}
            variant="ghost"
            disabled={isLoading || isCooldownActive}
          />
          {isCooldownActive ? (
            <Text style={styles.cooldownText}>Available in {cooldownSeconds}s</Text>
          ) : null}

          <CreditButton title="Try again" onPress={handleContinue} fullWidth />
        </CreditCard>
      </View>
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
                {modalEntries.map(entry => (
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

export default SmfaFailureScreen;
