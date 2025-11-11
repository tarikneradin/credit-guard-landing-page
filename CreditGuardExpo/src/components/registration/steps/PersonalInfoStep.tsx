import React from 'react';
import {View, Text} from 'react-native';

import {CreditInput, CreditButton} from '../../design-system';
import {DatePickerInput} from '../../common/DatePickerInput';
import {StateSelectInput} from '../../common/StateSelectInput';
import {personalInfoStyles as styles} from '../../../styles/identity/personalInfoStyles';
import {usePersonalInfoForm} from '../../../screens/identity/hooks/usePersonalInfoForm';
import {useIdentityStore} from '../../../stores/identityStore';

type PersonalInfoStepProps = {
  onComplete: () => void;
  onIdentityFailure: (params: {message: string; details?: string[]; codes?: string[]}) => void;
  onServiceFailure: (params?: {
    message?: string;
    details?: string[];
    codes?: string[];
    origin?: 'identity' | 'smfaSend' | 'smfaVerify' | 'enrollment' | 'cooldown';
  }) => void;
};

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  onComplete,
  onIdentityFailure,
  onServiceFailure,
}) => {
  const {resetVerification} = useIdentityStore();

  // Reset verification state when entering identity verification flow
  React.useEffect(() => {
    resetVerification();
  }, [resetVerification]);

  // Create a mock navigation object since the hook expects one
  const mockNavigation = {
    replace: (screen: string, params: {message: string; details?: string[]; codes?: string[]}) => {
      // Handle different navigation targets
      if (screen === 'PhoneVerification') {
        onComplete();
      } else if (screen === 'IdentityFailure') {
        onIdentityFailure(params);
      } else if (screen === 'ServiceFailure') {
        onServiceFailure(params);
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  const {
    formData,
    errors,
    touched,
    isLoading,
    error,
    handleInputChange,
    handleInputBlur,
    handleDateOfBirthChange,
    handleDateOfBirthConfirm,
    handleDateOfBirthOpen,
    handleStateSelect,
    handleSubmit: originalHandleSubmit,
    isFormReady,
  } = usePersonalInfoForm({navigation: mockNavigation});

  // Override submit to check for success
  const handleSubmit = React.useCallback(async () => {
    const identityStoreBefore = useIdentityStore.getState();

    await originalHandleSubmit();

    // Check if identity submission succeeded by checking if we have verification data
    const identityStoreAfter = useIdentityStore.getState();
    if (identityStoreAfter.smsMessage && !identityStoreBefore.smsMessage) {
      // Successfully submitted identity info
      onComplete();
    }
  }, [originalHandleSubmit, onComplete]);

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Identity Verification</Text>
        <Text style={styles.subtitle}>
          Please provide your personal information to verify your identity
        </Text>
      </View>

      {/* Form */}
      <View style={styles.formSection}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.nameRow}>
          <View style={styles.nameField}>
            <CreditInput
              label="First Name"
              placeholder="First name"
              value={formData.firstName}
              onChangeText={handleInputChange('firstName')}
              onBlur={handleInputBlur('firstName')}
              error={touched.firstName ? errors.firstName : ''}
              autoCapitalize="words"
              required
            />
          </View>
          <View style={styles.nameField}>
            <CreditInput
              label="Last Name"
              placeholder="Last name"
              value={formData.lastName}
              onChangeText={handleInputChange('lastName')}
              onBlur={handleInputBlur('lastName')}
              error={touched.lastName ? errors.lastName : ''}
              autoCapitalize="words"
              required
            />
          </View>
        </View>

        <DatePickerInput
          label="Date of Birth"
          placeholder="MM/DD/YYYY"
          value={formData.dateOfBirth}
          onChange={handleDateOfBirthChange}
          onConfirm={handleDateOfBirthConfirm}
          onOpen={handleDateOfBirthOpen}
          error={touched.dateOfBirth ? errors.dateOfBirth : ''}
          required
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
        />

        <CreditInput
          label="Social Security Number"
          placeholder="Enter 9 digits"
          value={formData.ssn}
          onChangeText={handleInputChange('ssn')}
          onBlur={handleInputBlur('ssn')}
          error={touched.ssn ? errors.ssn : ''}
          keyboardType="numeric"
          maxLength={9}
          required
        />

        <CreditInput
          label="Address"
          placeholder="Street address"
          value={formData.address}
          onChangeText={handleInputChange('address')}
          onBlur={handleInputBlur('address')}
          error={touched.address ? errors.address : ''}
          required
        />

        <View style={styles.row}>
          <View style={styles.cityField}>
            <CreditInput
              label="City"
              placeholder="City"
              value={formData.city}
              onChangeText={handleInputChange('city')}
              onBlur={handleInputBlur('city')}
              error={touched.city ? errors.city : ''}
              autoCapitalize="words"
              required
            />
          </View>
          <StateSelectInput
            label="State"
            value={formData.state}
            onSelect={handleStateSelect}
            error={touched.state ? errors.state : ''}
            required
            containerStyle={styles.stateField}
          />
          <View style={styles.zipField}>
            <CreditInput
              label="ZIP Code"
              placeholder="12345"
              value={formData.zipCode}
              onChangeText={handleInputChange('zipCode')}
              onBlur={handleInputBlur('zipCode')}
              error={touched.zipCode ? errors.zipCode : ''}
              keyboardType="numeric"
              maxLength={10}
              required
            />
          </View>
        </View>

        <CreditInput
          label="Phone Number"
          placeholder="(555) 123-4567"
          value={formData.phone}
          onChangeText={handleInputChange('phone')}
          onBlur={handleInputBlur('phone')}
          error={touched.phone ? errors.phone : ''}
          keyboardType="phone-pad"
          maxLength={14}
          required
        />

        <CreditButton
          title="Continue"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={!isFormReady || isLoading}
          fullWidth
          style={styles.submitButton}
        />
      </View>

      {/* Security Notice */}
      <View style={styles.securityNotice}>
        <Text style={styles.securityText}>
          🔒 Your information is encrypted and secure. We use bank-level security to protect your
          data.
        </Text>
      </View>
    </>
  );
};
