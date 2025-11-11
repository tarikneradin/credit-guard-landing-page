import React from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

import {CreditButton} from '../../design-system';
import {Colors} from '../../../constants';
import {useIdentityStore} from '../../../stores/identityStore';
import {useAuthStore} from '../../../stores/authStore';
import {useSmfaCooldown} from '../../../utils/hooks/useSmfaCooldown';
import {emailVerificationStyles as styles} from '../../../styles/identity/emailVerificationStyles';

type EmailVerificationStepProps = {
  maskedEmail: string;
  onComplete: () => void;
  onServiceFailure: (params?: {
    message?: string;
    details?: string[];
    codes?: string[];
    origin?: 'identity' | 'smfaSend' | 'smfaVerify' | 'enrollment' | 'cooldown';
  }) => void;
  onSmfaFailure: (params: {message: string; details?: string[]; codes?: string[]}) => void;
  onIdentityFailure: (params: {message: string; details?: string[]; codes?: string[]}) => void;
};

export const EmailVerificationStep: React.FC<EmailVerificationStepProps> = ({
  maskedEmail,
  onComplete,
  onServiceFailure,
  onSmfaFailure,
  onIdentityFailure,
}) => {
  const {
    clearSmfaFailure,
    clearError,
    verifyCode,
    isLoading,
    sendEmailVerificationLink,
    error,
    smfaCooldownUntil,
    serviceFailure,
    clearServiceFailure,
    smfaFailure,
  } = useIdentityStore();

  // Use a direct subscription to isVerificationComplete to ensure reactivity
  const isVerificationComplete = useIdentityStore(state => state.isVerificationComplete);

  const {setIdentityCompleted} = useAuthStore();
  const {cooldownSeconds, isCooldownActive} = useSmfaCooldown(smfaCooldownUntil);

  React.useEffect(() => {
    if (isVerificationComplete) {
      clearSmfaFailure();
      clearError();
      setIdentityCompleted(true);
      onComplete();
    }
  }, [isVerificationComplete, onComplete, clearSmfaFailure, clearError, setIdentityCompleted]);

  React.useEffect(() => {
    if (serviceFailure) {
      clearError();
      clearServiceFailure();
      onServiceFailure({
        origin: 'smfaVerify',
        message:
          error ??
          'Verification services are temporarily unavailable. Please wait a moment and try again.',
      });
    }
  }, [serviceFailure, clearError, clearServiceFailure, onServiceFailure, error]);

  React.useEffect(() => {
    if (smfaFailure) {
      clearError();
      const params = {
        message: smfaFailure.message,
        details: smfaFailure.details,
        codes: smfaFailure.codes,
      };
      clearSmfaFailure();

      // Determine if this is an SMFA failure or Identity failure based on error codes/message
      const isSmfaError =
        params.message?.toUpperCase().includes('SMFA') ||
        params.codes?.some(code => code?.includes('SMFA'));

      if (isSmfaError) {
        onSmfaFailure(params);
      } else {
        onIdentityFailure(params);
      }
    }
  }, [smfaFailure, clearError, clearSmfaFailure, onSmfaFailure, onIdentityFailure]);

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
      // onComplete will be called automatically via the verificationComplete effect
    } catch {
      // Errors are handled by the store and useEffect hooks above
      // Don't show alert here as proper error screens will be shown
    }
  };

  return (
    <>
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
    </>
  );
};
