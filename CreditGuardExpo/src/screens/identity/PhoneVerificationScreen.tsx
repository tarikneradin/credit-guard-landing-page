import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Alert, Linking, AppState, AppStateStatus, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Ionicons} from '@expo/vector-icons';

import {CreditButton} from '../../components/design-system';
import {useIdentityStore} from '../../stores/identityStore';
import {useAuthStore} from '../../stores/authStore';
import {Colors} from '../../constants';
import {useSmfaCooldown} from '../../utils/hooks/useSmfaCooldown';
import {phoneVerificationStyles as styles} from '../../styles/identity/phoneVerificationStyles';
import {IdentityStackParamList} from '../../navigation/types';
import {RegistrationContainer} from '../../components/registration/RegistrationContainer';

type PhoneVerificationScreenNavigationProp = StackNavigationProp<
  IdentityStackParamList,
  'PhoneVerification'
>;

export const PhoneVerificationScreen: React.FC = () => {
  const navigation = useNavigation<PhoneVerificationScreenNavigationProp>();
  const {
    sendVerificationCode,
    verifyCode,
    isLoading,
    error,
    clearError,
    verificationComplete,
    smsMessage,
    phoneNumber,
    personalInfo,
    serviceFailure,
    clearServiceFailure,
    smfaFailure,
    clearSmfaFailure,
    smfaCooldownUntil,
  } = useIdentityStore();
  const {setIdentityCompleted} = useAuthStore();

  const [linkOpened, setLinkOpened] = useState(false);
  const appState = useRef(AppState.currentState);
  const linkOpenedRef = useRef(false);
  const {cooldownSeconds, isCooldownActive} = useSmfaCooldown(smfaCooldownUntil);

  // Get phone number and extract last 4 digits
  const getPhoneLastFour = (): string => {
    const phone = phoneNumber || personalInfo?.phone || '';
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.slice(-4);
  };

  // Handle verification completion
  useEffect(() => {
    if (verificationComplete) {
      setIdentityCompleted(true);
      // Navigate to dashboard after successful verification
      // Use getParent to navigate to root navigator
      const rootNavigation = navigation.getParent();
      if (rootNavigation) {
        // @ts-expect-error Dashboard navigation pattern used throughout app
        rootNavigation.replace('Main', {screen: 'Dashboard'});
      }
    }
  }, [verificationComplete, setIdentityCompleted, navigation]);

  // Send initial verification link
  useEffect(() => {
    const sendInitialLink = async () => {
      try {
        await sendVerificationCode();
      } catch {
        // Silently fail
      }
    };

    sendInitialLink();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Detect when user returns from opening the link
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        linkOpenedRef.current
      ) {
        // User returned to app after opening link
        setLinkOpened(true);
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Clear error when needed
  useEffect(() => {
    if (error) {
      clearError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (serviceFailure) {
      const failureMessage =
        error ?? 'SMFA service is temporarily unavailable. Please wait a moment and try again.';
      clearError();
      clearServiceFailure();
      navigation.replace('ServiceFailure', {
        origin: 'smfaVerify',
        message: failureMessage,
      });
    }
  }, [serviceFailure, clearError, clearServiceFailure, navigation, error]);

  useEffect(() => {
    if (smfaFailure) {
      clearError();
      const params = {
        message: smfaFailure.message,
        details: smfaFailure.details,
        codes: smfaFailure.codes,
      } as const;
      clearSmfaFailure();
      navigation.replace('SmfaFailure', params);
    }
  }, [smfaFailure, clearError, clearSmfaFailure, navigation]);

  const handleContinue = async () => {
    try {
      // Verify the SMFA status (no code needed, just check status)
      await verifyCode('');

      // Mark identity as completed and navigate to dashboard
      setIdentityCompleted(true);

      // Navigate to dashboard using root navigator
      const rootNavigation = navigation.getParent();
      if (rootNavigation) {
        // @ts-expect-error Dashboard navigation pattern used throughout app
        rootNavigation.replace('Main', {screen: 'Dashboard'});
      }
    } catch {
      // Error handled by store
    }
  };

  const handleResendLink = async () => {
    try {
      await sendVerificationCode();
      setLinkOpened(false);
      linkOpenedRef.current = false;
      Alert.alert('Link Sent', 'A new verification link has been sent to your phone.');
    } catch {
      // Error handled by store
    }
  };

  // Extract URL from SMS message and handle link click
  const handleLinkPress = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        linkOpenedRef.current = true;
        await Linking.openURL(url);
        // Enable button after a short delay to allow app state change
        setTimeout(() => {
          setLinkOpened(true);
        }, 500);
      } else {
        Alert.alert('Error', 'Unable to open the authentication link');
      }
    } catch {
      Alert.alert('Error', 'Failed to open the authentication link');
    }
  };

  // Render SMS message with clickable link
  const renderSMSMessage = () => {
    if (!smsMessage) {
      return null;
    }

    // Extract URL from message using regex
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts: Array<{text: string; isUrl: boolean; url?: string}> = [];
    let lastIndex = 0;
    const matches: RegExpExecArray[] = [];
    let regexMatch;

    // Collect all matches first
    while ((regexMatch = urlRegex.exec(smsMessage)) !== null) {
      matches.push(regexMatch);
    }

    // Build parts array
    for (const match of matches) {
      // Add text before URL
      if (match.index > lastIndex) {
        parts.push({
          text: smsMessage.substring(lastIndex, match.index),
          isUrl: false,
        });
      }
      // Add URL
      parts.push({text: match[0], isUrl: true, url: match[0]});
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after last URL
    if (lastIndex < smsMessage.length) {
      parts.push({text: smsMessage.substring(lastIndex), isUrl: false});
    }

    // If no URL found or no parts, just show the message as text
    // This handles cases where regex doesn't match or message has no URLs
    if (parts.length === 0) {
      return (
        <View style={styles.messageBox}>
          <Text style={styles.messageHeading}>
            The following message has been sent to your mobile phone:
          </Text>
          <Text style={styles.messageText}>{smsMessage}</Text>
        </View>
      );
    }

    return (
      <View style={styles.messageBox}>
        <Text style={styles.messageHeading}>
          The following message has been sent to your mobile phone:
        </Text>
        <Text style={styles.messageText} selectable>
          {parts.map((part, index) => {
            if (part.isUrl && part.url) {
              return (
                <Text
                  key={`url-${index}`}
                  style={styles.messageLink}
                  onPress={() => handleLinkPress(part.url!)}>
                  {part.text}
                </Text>
              );
            }
            return <Text key={`text-${index}`}>{part.text}</Text>;
          })}
        </Text>
      </View>
    );
  };

  const phoneLastFour = getPhoneLastFour();

  return (
    <RegistrationContainer currentStep={2} showKeyboardAvoidingView={false}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Mobile Verification</Text>
          <Ionicons name="phone-portrait-outline" size={24} color={Colors.primary} />
        </View>
        <Text style={styles.subtitle}>
          Please open the link sent to your mobile phone number ending in{' '}
          <Text style={styles.phoneHighlight}>{phoneLastFour || 'XXXX'}</Text>. Return to this page
          once verification has completed to continue.
        </Text>
      </View>

      {/* Resend Link */}
      <View style={styles.resendContainer}>
        <TouchableOpacity onPress={handleResendLink} disabled={isLoading || isCooldownActive}>
          <Text style={styles.resendLink}>Resend mobile link</Text>
        </TouchableOpacity>
        {isCooldownActive ? (
          <Text style={styles.cooldownText}>Available in {cooldownSeconds}s</Text>
        ) : null}
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        {error ? (
          <View style={styles.noticeBox}>
            <Text style={styles.noticeText}>{error}</Text>
          </View>
        ) : null}

        {/* SMS Message with Authentication Link */}
        {smsMessage ? renderSMSMessage() : null}
      </View>

      {/* Continue Button */}
      <CreditButton
        title="CONTINUE"
        onPress={handleContinue}
        loading={isLoading}
        fullWidth
        disabled={!linkOpened}
        style={styles.continueButton}
      />
    </RegistrationContainer>
  );
};
