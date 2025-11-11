import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';

import {CreditInput, CreditButton, CreditCard} from '../../components/design-system';
import {useAuthStore} from '../../stores/authStore';
import {validateEmail, validateRequired} from '../../utils/validation';
import {Colors, TextStyles, Spacing} from '../../constants';
import {createStyles} from '../../utils/styles';
import {RootStackParamList, AuthStackParamList} from '../../navigation/types';
import {CompositeNavigationProp} from '@react-navigation/native';

type LoginScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AuthStackParamList, 'Login'>,
  StackNavigationProp<RootStackParamList>
>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const {login, isLoading, error, clearError, authStep} = useAuthStore();

  // Hardcoded credentials for demo
  const HARDCODED_EMAIL = 'tarik.neradin+2@gmail.com';
  const HARDCODED_PASSWORD = 'TESTUSER';

  const [formData, setFormData] = useState({
    email: HARDCODED_EMAIL,
    password: HARDCODED_PASSWORD,
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  // Clear error when user starts typing
  React.useEffect(() => {
    if (error) {
      clearError();
    }
    // disabling because it throws dependency warning
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.email, formData.password]);

  const validateForm = (): boolean => {
    // Validate email format and password presence
    let emailError = '';
    let passwordError = '';

    const emailValidation = validateEmail(formData.email);
    if (emailValidation) {
      emailError = emailValidation;
    }

    const passwordValidation = validateRequired(formData.password, 'Password');
    if (passwordValidation) {
      passwordError = passwordValidation;
    }

    setErrors({
      email: emailError,
      password: passwordError,
    });

    return !emailError && !passwordError;
  };

  const handleInputChange = (field: keyof typeof formData) => (value: string) => {
    setFormData(prev => ({...prev, [field]: value}));

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}));
    }
  };

  const handleInputBlur = (field: keyof typeof touched) => () => {
    setTouched(prev => ({...prev, [field]: true}));

    // Validate field on blur
    if (field === 'email') {
      const emailError = validateEmail(formData.email);
      setErrors(prev => ({...prev, email: emailError || ''}));
    } else if (field === 'password') {
      const passwordError = validateRequired(formData.password, 'Password');
      setErrors(prev => ({...prev, password: passwordError || ''}));
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await login(formData.email, formData.password);

      // Get updated auth state
      const {isAuthenticated, isIdentityCompleted} = useAuthStore.getState();

      // Direct navigation after successful login
      if (isAuthenticated) {
        if (isIdentityCompleted) {
          // ? fix type error in navigation types, include Dashboard type as well
          navigation.replace('Main', {screen: 'Dashboard'});
        } else {
          navigation.replace('Identity', {screen: 'PersonalInfo'});
        }
      }
    } catch {
      // Error is already handled in the store and displayed via the error state
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleSignUp = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your CreditGuard account</Text>
          </View>

          {/* Demo Info */}
          <CreditCard style={styles.demoCard}>
            <Text style={styles.demoTitle}>Demo Credentials</Text>
            <Text style={styles.demoText}>
              The form is pre-filled with demo credentials. Simply tap "Sign In" to continue.
            </Text>
            <Text style={[styles.demoText, styles.demoTextSpacing, styles.demoTextStrong]}>
              Email: {HARDCODED_EMAIL}
            </Text>
            <Text style={[styles.demoText, styles.demoTextStrong]}>
              Password: {HARDCODED_PASSWORD}
            </Text>
          </CreditCard>

          {/* Form */}
          <CreditCard style={styles.formCard}>
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {isLoading && authStep && (
              <View style={styles.authStepContainer}>
                <Text style={styles.authStepText}>{authStep}</Text>
              </View>
            )}

            <CreditInput
              label="Email Address"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={handleInputChange('email')}
              onBlur={handleInputBlur('email')}
              error={touched.email ? errors.email : ''}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              required
            />

            <CreditInput
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChangeText={handleInputChange('password')}
              onBlur={handleInputBlur('password')}
              error={touched.password ? errors.password : ''}
              secureTextEntry
              required
            />

            <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <CreditButton
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              fullWidth
              style={styles.signInButton}
            />
          </CreditCard>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Legal */}
          <View style={styles.legalContainer}>
            <Text style={styles.legalText}>
              By signing in, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = createStyles({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 40 : 80, // Extra padding to prevent keyboard cropping
  },
  header: {
    paddingTop: Spacing.xl,
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
  },
  demoCard: {
    marginBottom: Spacing.md,
    backgroundColor: Colors.transparent.primary,
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  demoTitle: {
    ...TextStyles.bodyMedium,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  demoText: {
    ...TextStyles.bodySmall,
    color: Colors.text.secondary,
    lineHeight: 16,
  },
  demoTextSpacing: {
    marginTop: Spacing.xs,
  },
  demoTextStrong: {
    fontWeight: '600',
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
  authStepContainer: {
    backgroundColor: Colors.transparent.primary,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  authStepText: {
    ...TextStyles.bodySmall,
    color: Colors.primary,
    textAlign: 'center',
    fontWeight: '600',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.lg,
  },
  forgotPasswordText: {
    ...TextStyles.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },
  signInButton: {
    marginTop: Spacing.sm,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  signUpText: {
    ...TextStyles.bodyRegular,
    color: Colors.text.secondary,
  },
  signUpLink: {
    ...TextStyles.bodyRegular,
    color: Colors.primary,
    fontWeight: '600',
  },
  legalContainer: {
    paddingHorizontal: Spacing.lg,
  },
  legalText: {
    ...TextStyles.caption,
    color: Colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 16,
  },
});
