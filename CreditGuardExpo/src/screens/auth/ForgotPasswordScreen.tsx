import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';

import {CreditInput, CreditButton, CreditCard} from '../../components/design-system';
import {useAuthStore} from '../../stores/authStore';
import {validateEmail} from '../../utils/validation';
import {Colors, TextStyles, Spacing} from '../../constants';
import {createStyles} from '../../utils/styles';
import {AuthStackParamList} from '../../navigation/types';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const {forgotPassword, isLoading, error, clearError} = useAuthStore();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Clear error when user starts typing
  React.useEffect(() => {
    if (error) {
      clearError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) {
      setEmailError('');
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    const emailValidationError = validateEmail(email);
    setEmailError(emailValidationError || '');
  };

  const handleSendReset = async () => {
    const emailValidationError = validateEmail(email);
    setEmailError(emailValidationError || '');
    setEmailTouched(true);

    if (emailValidationError) {
      return;
    }

    try {
      await forgotPassword(email);
      setEmailSent(true);
      Alert.alert(
        'Reset Email Sent',
        "We've sent a password reset link to your email address. Please check your inbox and follow the instructions.",
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ],
      );
    } catch {
      // Error handled by store
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  if (emailSent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Check Your Email</Text>
            <Text style={styles.subtitle}>
              We've sent a password reset link to{'\n'}
              <Text style={styles.emailHighlight}>{email}</Text>
            </Text>
          </View>

          <CreditCard style={styles.successCard}>
            <Text style={styles.successIcon}>📧</Text>
            <Text style={styles.successTitle}>Email Sent Successfully</Text>
            <Text style={styles.successText}>
              Click the link in the email to reset your password. The link will expire in 24 hours.
            </Text>

            <CreditButton
              title="Back to Login"
              onPress={handleBackToLogin}
              fullWidth
              style={styles.backButton}
            />
          </CreditCard>

          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>
              Didn't receive the email? Check your spam folder or{' '}
              <TouchableOpacity onPress={() => setEmailSent(false)}>
                <Text style={styles.helpLink}>try again</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
          <Text style={styles.backButtonText}>← Back to Login</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you a link to reset your password
          </Text>
        </View>

        {/* Form */}
        <CreditCard style={styles.formCard}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <CreditInput
            label="Email Address"
            placeholder="Enter your email address"
            value={email}
            onChangeText={handleEmailChange}
            onBlur={handleEmailBlur}
            error={emailTouched ? emailError : ''}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
            required
          />

          <CreditButton
            title="Send Reset Link"
            onPress={handleSendReset}
            loading={isLoading}
            fullWidth
            style={styles.sendButton}
          />
        </CreditCard>

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>
            Remember your password?{' '}
            <TouchableOpacity onPress={handleBackToLogin}>
              <Text style={styles.helpLink}>Sign in here</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = createStyles({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  backButton: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  backButtonText: {
    ...TextStyles.bodyRegular,
    color: Colors.primary,
    fontWeight: '600',
  },
  header: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
    alignItems: 'center',
  },
  title: {
    ...TextStyles.headline1,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...TextStyles.bodyLarge,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  emailHighlight: {
    fontWeight: '600',
    color: Colors.primary,
  },
  formCard: {
    marginBottom: Spacing.lg,
  },
  errorContainer: {
    backgroundColor: Colors.transparent.error,
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  errorText: {
    ...TextStyles.bodySmall,
    color: Colors.error,
    textAlign: 'center',
  },
  sendButton: {
    marginTop: Spacing.sm,
  },
  successCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  successIcon: {
    fontSize: 48,
    marginBottom: Spacing.lg,
  },
  successTitle: {
    ...TextStyles.headline2,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  successText: {
    ...TextStyles.bodyRegular,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  helpContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  helpText: {
    ...TextStyles.bodyRegular,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  helpLink: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
