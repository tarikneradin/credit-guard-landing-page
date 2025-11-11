import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {CompositeNavigationProp} from '@react-navigation/native';

import {CreditInput, CreditButton} from '../../design-system';
import {AuthStackParamList, RootStackParamList} from '../../../navigation/types';
import {registerScreenStyles as styles} from '../../../styles/auth/registerScreenStyles';
import {useRegisterForm} from '../../../screens/auth/hooks/useRegisterForm';

type RegisterScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AuthStackParamList, 'Register'>,
  StackNavigationProp<RootStackParamList>
>;

type RegisterStepProps = {
  navigation: RegisterScreenNavigationProp;
  onComplete: () => void;
};

export const RegisterStep: React.FC<RegisterStepProps> = ({navigation, onComplete}) => {
  // Create a mock navigation that prevents actual navigation
  const mockNavigation = React.useMemo(
    () => ({
      ...navigation,
      replace: (
        screen: string,
        params: {message: string; details?: string[]; codes?: string[]},
      ) => {
        // Intercept navigation to Identity stack and call onComplete instead
        if (screen === 'Identity') {
          onComplete();
        } else {
          // Allow other navigation (like going back to login)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          navigation.replace(screen as any, params);
        }
      },
    }),
    [navigation, onComplete],
  );

  const {
    formData,
    errors,
    touched,
    isLoading,
    error,
    handleInputChange,
    handleInputBlur,
    handleSignIn,
    toggleTerms,
    handleTermsLink,
    isFormReady,
    handleRegister,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useRegisterForm({navigation: mockNavigation as any});

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join CreditGuard and take control of your credit</Text>
      </View>

      <View style={styles.formSection}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
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
          placeholder="Create a password"
          value={formData.password}
          onChangeText={handleInputChange('password')}
          onBlur={handleInputBlur('password')}
          error={touched.password ? errors.password : ''}
          secureTextEntry
          helperText="Must be 8+ characters with uppercase, lowercase, and number"
          required
        />

        {/* Terms and Conditions */}
        <View style={styles.termsContainer}>
          <ScrollView
            style={styles.termsTextScrollView}
            contentContainerStyle={styles.termsTextScrollContent}
            showsVerticalScrollIndicator={true}>
            <Text style={styles.termsText}>
              By clicking "Continue" and creating an account you accept{' '}
              <Text
                style={styles.termsLink}
                onPress={() =>
                  handleTermsLink(
                    'https://app.termly.io/document/terms-of-service/9423cd69-88eb-4fca-82be-1077f9e84199',
                  )
                }>
                StitchCredit's Terms of Use
              </Text>{' '}
              and{' '}
              <Text
                style={styles.termsLink}
                onPress={() =>
                  handleTermsLink(
                    'https://app.termly.io/document/privacy-policy/95a109ce-0064-415c-92e2-7d9967e723a2',
                  )
                }>
                Privacy Policy
              </Text>
              . StitchCredit does not maintain critical personal data, much less sell or otherwise
              disclose your personal information to anyone else. You may opt-out of email
              correspondence, except confirmation Emails, which often contain important information
              about your account.
            </Text>
            <Text style={[styles.termsText, styles.termsSecondaryParagraph]}>
              You understand that by clicking "Continue", you are explicitly agreeing to and
              providing "written instructions" to StitchCredit under the Fair Credit Reporting Act
              to obtain my credit information from one or more of the three nationwide credit
              reporting agencies. Third-party sources, including your mobile carrier may be used to
              verify your identity. You authorize StitchCredit to obtain such information for you to
              confirm your identity, and, for as long as you are a member of StitchCredit, to
              provide you with your credit information. You may elect to terminate your account and
              this authorization at any time.
            </Text>
          </ScrollView>
          <TouchableOpacity style={styles.checkboxRow} onPress={toggleTerms} activeOpacity={0.7}>
            <View style={[styles.checkbox, formData.agreedToTerms && styles.checkboxChecked]}>
              {formData.agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>
              I have read and agree to the terms and conditions above
            </Text>
          </TouchableOpacity>
        </View>

        {touched.agreedToTerms && errors.agreedToTerms && (
          <Text style={styles.termsError}>{errors.agreedToTerms}</Text>
        )}

        <CreditButton
          title="Continue"
          onPress={handleRegister}
          loading={isLoading}
          style={styles.registerButton}
          fullWidth
          disabled={!isFormReady || isLoading}
        />
      </View>

      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>Already have an account? </Text>
        <TouchableOpacity onPress={handleSignIn}>
          <Text style={styles.signInLink}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
