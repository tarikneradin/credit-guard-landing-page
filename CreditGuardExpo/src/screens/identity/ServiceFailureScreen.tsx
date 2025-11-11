import React from 'react';
import {View, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Ionicons} from '@expo/vector-icons';

import {CreditButton, CreditCard} from '../../components/design-system';
import {Colors} from '../../constants';
import {IdentityStackParamList} from '../../navigation/types';
import {useIdentityStore} from '../../stores/identityStore';
import {serviceFailureStyles as styles} from '../../styles/identity/serviceFailureStyles';
import {classifyServiceFailure, mapToFailureSignals} from '../../utils/identityFailures';

type ServiceFailureNavigationProp = StackNavigationProp<IdentityStackParamList, 'ServiceFailure'>;
type ServiceFailureRouteProp = RouteProp<IdentityStackParamList, 'ServiceFailure'>;

type ServiceFailureContent = {
  title: string;
  message: string;
  subMessage: string;
};

const SERVICE_CONTENT: Record<ReturnType<typeof classifyServiceFailure>, ServiceFailureContent> = {
  smfaSend: {
    title: 'Secure link unavailable',
    message:
      'Our secure messaging partner is temporarily unable to send new verification links to your device.',
    subMessage:
      'Please wait a few minutes before requesting another link, or switch to email instead.',
  },
  smfaVerify: {
    title: 'Verification service unavailable',
    message:
      'We could not reach the verification service to confirm your secure link. This is usually resolved quickly.',
    subMessage:
      'Retry shortly or request a new link. If the issue continues, use the email option.',
  },
  identity: {
    title: 'Identity service outage',
    message:
      'One of our vendors is having a temporary service outage. As a result, we were unable to fully complete identity verification for your account.',
    subMessage: 'These outages rarely last long. Wait a little while and try again.',
  },
  enrollment: {
    title: 'Enrollment temporarily unavailable',
    message:
      'We verified your details, but our enrollment partner did not respond in time to finish setting up your account.',
    subMessage: 'Give it a few minutes and try again. We’ll pick up where you left off.',
  },
  cooldown: {
    title: 'Please wait before retrying',
    message:
      'You recently requested a secure link. To keep your account safe, there is a short cooldown between requests.',
    subMessage: 'Wait 30 seconds, then try sending the link again.',
  },
  generic: {
    title: 'Service Failure',
    message:
      'It appears one or more of our vendors is having a temporary service outage. As a result, we were unable to fully complete identity and/or enrollment for your account.',
    subMessage:
      "Fortunately, these things don't typically last very long. Please try again in a few hours.",
  },
};

export const ServiceFailureScreen: React.FC = () => {
  const navigation = useNavigation<ServiceFailureNavigationProp>();
  const route = useRoute<ServiceFailureRouteProp>();
  const {clearServiceFailure, clearError} = useIdentityStore();

  const params = route.params;
  const variant = classifyServiceFailure(
    mapToFailureSignals({
      message: params?.message,
      details: params?.details,
      codes: params?.codes,
      origin: params?.origin,
    }),
  );
  const content = SERVICE_CONTENT[variant] ?? SERVICE_CONTENT.generic;

  const handleClose = () => {
    clearError();
    clearServiceFailure();
    navigation.replace('PersonalInfo');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <CreditCard style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="person-circle-outline" size={40} color={Colors.primary} />
          </View>
          <Text style={styles.title}>{content.title}</Text>
          <Text style={styles.message}>{content.message}</Text>
          <Text style={styles.subMessage}>{content.subMessage}</Text>
          {params?.message && params.message !== content.message ? (
            <Text style={styles.subMessage}>{params.message}</Text>
          ) : null}

          <CreditButton title="Close" onPress={handleClose} fullWidth />
        </CreditCard>
      </View>
    </SafeAreaView>
  );
};

export default ServiceFailureScreen;
