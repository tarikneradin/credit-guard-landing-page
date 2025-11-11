import {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';

import {IdentityStackParamList} from '../../../navigation/types';
import {useIdentityStore} from '../../../stores/identityStore';
import {useAuthStore} from '../../../stores/authStore';
import {
  formatPhoneNumber,
  validateAddress,
  validateCity,
  validateDateOfBirth,
  validateName,
  validatePhone,
  validateSSN,
  validateState,
  validateZipCode,
} from '../../../utils/validation';

type PersonalInfoNavigationProp = StackNavigationProp<IdentityStackParamList, 'PersonalInfo'>;

type FormField =
  | 'firstName'
  | 'lastName'
  | 'dateOfBirth'
  | 'ssn'
  | 'address'
  | 'city'
  | 'state'
  | 'zipCode'
  | 'phone';

type UsePersonalInfoFormOptions = {
  navigation: PersonalInfoNavigationProp;
};

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  ssn: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  phone: '',
};

const INITIAL_ERRORS = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  ssn: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  phone: '',
};

const INITIAL_TOUCHED = {
  firstName: false,
  lastName: false,
  dateOfBirth: false,
  ssn: false,
  address: false,
  city: false,
  state: false,
  zipCode: false,
  phone: false,
};

export const usePersonalInfoForm = ({navigation}: UsePersonalInfoFormOptions) => {
  const {
    submitPersonalInfo,
    isLoading,
    error,
    clearError,
    verificationComplete,
    identityFailure,
    clearIdentityFailure,
    serviceFailure,
    clearServiceFailure,
  } = useIdentityStore();
  const {setIdentityCompleted} = useAuthStore();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [touched, setTouched] = useState(INITIAL_TOUCHED);

  useEffect(() => {
    if (error) {
      clearError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formData.firstName,
    formData.lastName,
    formData.dateOfBirth,
    formData.ssn,
    formData.address,
    formData.city,
    formData.state,
    formData.zipCode,
    formData.phone,
  ]);

  useEffect(() => {
    if (verificationComplete) {
      setIdentityCompleted(true);
      Alert.alert('Identity Verified', 'Your identity has been successfully verified!', [
        {
          text: 'Continue',
          onPress: () => navigation.replace('VerificationSuccess'),
        },
      ]);
    }
  }, [verificationComplete, setIdentityCompleted, navigation]);

  useEffect(() => {
    if (identityFailure && !serviceFailure) {
      const failureParams = {
        message: identityFailure.message,
        details: identityFailure.details,
        codes: identityFailure.codes,
      } as const;

      clearError();
      clearIdentityFailure();
      navigation.replace('IdentityFailure', failureParams);
    }
  }, [identityFailure, navigation, clearIdentityFailure, clearError, serviceFailure]);

  useEffect(() => {
    if (serviceFailure) {
      const failureParams = identityFailure ?? (error ? {message: error} : undefined);
      clearError();
      clearIdentityFailure();
      clearServiceFailure();
      navigation.replace('ServiceFailure', {
        origin: 'identity',
        message: failureParams?.message,
        details: failureParams?.details,
        codes: failureParams?.codes,
      });
    }
  }, [
    serviceFailure,
    clearError,
    clearIdentityFailure,
    clearServiceFailure,
    navigation,
    identityFailure,
    error,
  ]);

  const handleInputChange = useCallback(
    (field: FormField) => (value: string) => {
      let formattedValue = value;

      if (field === 'ssn') {
        formattedValue = value.replace(/\D/g, '');
      } else if (field === 'phone') {
        formattedValue = formatPhoneNumber(value);
      } else if (field === 'state') {
        formattedValue = value.toUpperCase();
      }

      setFormData(prev => ({...prev, [field]: formattedValue}));

      if (errors[field]) {
        setErrors(prev => ({...prev, [field]: ''}));
      }
    },
    [errors],
  );

  const handleInputBlur = useCallback(
    (field: FormField) => () => {
      setTouched(prev => ({...prev, [field]: true}));

      let fieldError = '';
      switch (field) {
        case 'firstName':
          fieldError = validateName(formData.firstName, 'First name') || '';
          break;
        case 'lastName':
          fieldError = validateName(formData.lastName, 'Last name') || '';
          break;
        case 'dateOfBirth':
          fieldError = validateDateOfBirth(formData.dateOfBirth) || '';
          break;
        case 'ssn':
          fieldError = validateSSN(formData.ssn) || '';
          break;
        case 'address':
          fieldError = validateAddress(formData.address) || '';
          break;
        case 'city':
          fieldError = validateCity(formData.city) || '';
          break;
        case 'state':
          fieldError = validateState(formData.state) || '';
          break;
        case 'zipCode':
          fieldError = validateZipCode(formData.zipCode) || '';
          break;
        case 'phone':
          fieldError = validatePhone(formData.phone) || '';
          break;
      }

      setErrors(prev => ({...prev, [field]: fieldError}));
    },
    [formData],
  );

  const handleDateOfBirthChange = useCallback(
    (formattedDate: string) => {
      setFormData(prev => ({...prev, dateOfBirth: formattedDate}));
      if (errors.dateOfBirth) {
        setErrors(prev => ({...prev, dateOfBirth: ''}));
      }
    },
    [errors.dateOfBirth],
  );

  const handleDateOfBirthConfirm = useCallback((formattedDate: string) => {
    setTouched(prev => ({...prev, dateOfBirth: true}));
    const dobError = validateDateOfBirth(formattedDate) || '';
    setErrors(prev => ({...prev, dateOfBirth: dobError}));
  }, []);

  const handleDateOfBirthOpen = useCallback(() => {
    if (!touched.dateOfBirth) {
      setTouched(prev => ({...prev, dateOfBirth: true}));
    }
  }, [touched.dateOfBirth]);

  const handleStateSelect = useCallback((stateCode: string) => {
    setFormData(prev => ({...prev, state: stateCode}));
    setTouched(prev => ({...prev, state: true}));
    const stateError = validateState(stateCode) || '';
    setErrors(prev => ({...prev, state: stateError}));
  }, []);

  const validateForm = useCallback(() => {
    const firstNameError = validateName(formData.firstName, 'First name');
    const lastNameError = validateName(formData.lastName, 'Last name');
    const dobError = validateDateOfBirth(formData.dateOfBirth);
    const ssnError = validateSSN(formData.ssn);
    const addressError = validateAddress(formData.address);
    const cityError = validateCity(formData.city);
    const stateError = validateState(formData.state);
    const zipError = validateZipCode(formData.zipCode);
    const phoneError = validatePhone(formData.phone);

    setErrors({
      firstName: firstNameError || '',
      lastName: lastNameError || '',
      dateOfBirth: dobError || '',
      ssn: ssnError || '',
      address: addressError || '',
      city: cityError || '',
      state: stateError || '',
      zipCode: zipError || '',
      phone: phoneError || '',
    });

    return !(
      firstNameError ||
      lastNameError ||
      dobError ||
      ssnError ||
      addressError ||
      cityError ||
      stateError ||
      zipError ||
      phoneError
    );
  }, [formData]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      setTouched({
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        ssn: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        phone: true,
      });
      return;
    }

    try {
      await submitPersonalInfo(formData);

      const {verificationComplete: latestVerification} = useIdentityStore.getState();

      if (!latestVerification) {
        navigation.replace('PhoneVerification', {token: undefined});
      }
    } catch {
      // store handles errors
    }
  }, [formData, navigation, submitPersonalInfo, validateForm]);

  const isFormReady = useMemo(() => {
    const firstNameError = validateName(formData.firstName, 'First name');
    const lastNameError = validateName(formData.lastName, 'Last name');
    const dobError = validateDateOfBirth(formData.dateOfBirth);
    const ssnError = validateSSN(formData.ssn);
    const addressError = validateAddress(formData.address);
    const cityError = validateCity(formData.city);
    const stateError = validateState(formData.state);
    const zipError = validateZipCode(formData.zipCode);
    const phoneError = validatePhone(formData.phone);

    return !(
      firstNameError ||
      lastNameError ||
      dobError ||
      ssnError ||
      addressError ||
      cityError ||
      stateError ||
      zipError ||
      phoneError
    );
  }, [formData]);

  return {
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
    handleSubmit,
    isFormReady,
  };
};

export type UsePersonalInfoFormReturn = ReturnType<typeof usePersonalInfoForm>;
