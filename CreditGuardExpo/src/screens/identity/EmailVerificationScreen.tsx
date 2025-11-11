import React from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Ionicons} from '@expo/vector-icons';

import {CreditButton} from '../../components/design-system';
import {Colors} from '../../constants';
import {IdentityStackParamList} from '../../navigation/types';
import {useIdentityStore} from '../../stores/identityStore';
import {useAuthStore} from '../../stores/authStore';
import {useSmfaCooldown} from '../../utils/hooks/useSmfaCooldown';
import {emailVerificationStyles as styles} from '../../styles/identity/emailVerificationStyles';
import {RegistrationContainer} from '../../components/registration/RegistrationContainer';

type EmailVerificationNavigationProp = StackNavigationProp<
  IdentityStackParamList,
  'EmailVerification'
>;
type EmailVerificationRouteProp = RouteProp<IdentityStackParamList, 'EmailVerification'>;

export const EmailVerificationScreen: React.FC = () => {
  const navigation = useNavigation<EmailVerificationNavigationProp>();
  const {
    params: {maskedEmail},
  } = useRoute<EmailVerificationRouteProp>();
  const {
    clearSmfaFailure,
    clearError,
    verifyCode,
    isLoading,
    sendEmailVerificationLink,
    verificationComplete,
    error,
    smfaCooldownUntil,
    serviceFailure,
    smfaFailure,
  } = useIdentityStore();
  const {setIdentityCompleted} = useAuthStore();
  const {cooldownSeconds, isCooldownActive} = useSmfaCooldown(smfaCooldownUntil);

  React.useEffect(() => {
    if (verificationComplete) {
      clearSmfaFailure();
      clearError();
      setIdentityCompleted(true);
      const rootNavigation = navigation.getParent();
      if (rootNavigation) {
        // @ts-expect-error Dashboard navigation pattern used throughout app
        rootNavigation.replace('Main', {screen: 'Dashboard'});
      }
    }
  }, [verificationComplete, navigation, setIdentityCompleted, clearSmfaFailure, clearError]);

  React.useEffect(() => {
    if (serviceFailure) {
      const failureMessage =
        error ??
        'Verification services are temporarily unavailable. Please wait a moment and try again.';
      clearError();
      clearSmfaFailure();
      navigation.replace('ServiceFailure', {
        origin: 'smfaVerify',
        message: failureMessage,
      });
    }
  }, [serviceFailure, navigation, clearError, clearSmfaFailure, error]);

  React.useEffect(() => {
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
  }, [smfaFailure, navigation, clearSmfaFailure, clearError]);

  const handleResend = async () => {
    try {
      clearError();
      await sendEmailVerificationLink();
      Alert.alert('Email Sent', 'We have resent the verification email. Please check your inbox.');
    } catch {
      Alert.alert('Email Verification', 'Unable to resend email right now. Please try again.');
    }
  };

  const handleContinue = async () => {
    try {
      clearError();
      await verifyCode('');
    } catch {
      Alert.alert(
        'Verification Failed',
        'We could not confirm your email verification. Please open the link and try again.',
      );
    }
  };

  return (
    <RegistrationContainer currentStep={2} showKeyboardAvoidingView={false}>
      <View style={styles.contentSection}>
        <View style={styles.iconCircle}>
          <Ionicons name="mail-outline" size={40} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Email Verification</Text>
        <Text style={styles.message}>We've sent a verification link to your email address:</Text>
        <Text style={styles.email}>{maskedEmail}</Text>
        <Text style={styles.subtitle}>
          Please open the link, then return to this page and click Continue.
        </Text>

        <TouchableOpacity onPress={handleResend} disabled={isLoading || isCooldownActive}>
          <Text style={styles.resendLink}>Resend email</Text>
        </TouchableOpacity>
        {isCooldownActive ? (
          <Text style={styles.cooldownText}>Available in {cooldownSeconds}s</Text>
        ) : null}

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <CreditButton title="Continue" onPress={handleContinue} loading={isLoading} fullWidth />
      </View>
    </RegistrationContainer>
  );
};

export default EmailVerificationScreen;
