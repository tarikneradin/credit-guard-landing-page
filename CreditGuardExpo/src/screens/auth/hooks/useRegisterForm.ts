import {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, Linking} from 'react-native';
import {CompositeNavigationProp, NavigationProp} from '@react-navigation/native';

import {useAuthStore} from '../../../stores/authStore';
import {validateEmail, validatePassword, validateTermsAcceptance} from '../../../utils/validation';
import {AuthStackParamList, RootStackParamList} from '../../../navigation/types';

type RegisterScreenNavigationProp = CompositeNavigationProp<
  NavigationProp<AuthStackParamList, 'Register'>,
  NavigationProp<RootStackParamList>
>;

type FormField = 'email' | 'password' | 'agreedToTerms';

type UseRegisterFormOptions = {
  navigation: RegisterScreenNavigationProp;
};

export const useRegisterForm = ({navigation}: UseRegisterFormOptions) => {
  const {register, isLoading, error, clearError} = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    agreedToTerms: false,
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    agreedToTerms: '',
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
    agreedToTerms: false,
  });

  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formData.email, formData.password, error, clearError]);

  const validateForm = useCallback(() => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const termsError = validateTermsAcceptance(formData.agreedToTerms);

    setErrors({
      email: emailError || '',
      password: passwordError || '',
      agreedToTerms: termsError || '',
    });

    return !(emailError || passwordError || termsError);
  }, [formData]);

  const handleInputChange = useCallback(
    (field: FormField) => (value: string | boolean) => {
      setFormData(prev => ({...prev, [field]: value}));

      if (errors[field]) {
        setErrors(prev => ({...prev, [field]: ''}));
      }
    },
    [errors],
  );

  const handleInputBlur = useCallback(
    (field: Exclude<FormField, 'agreedToTerms'>) => () => {
      setTouched(prev => ({...prev, [field]: true}));

      let fieldError = '';
      switch (field) {
        case 'email':
          fieldError = validateEmail(formData.email) || '';
          break;
        case 'password':
          fieldError = validatePassword(formData.password) || '';
          break;
      }

      setErrors(prev => ({...prev, [field]: fieldError}));
    },
    [formData],
  );

  const toggleTerms = useCallback(() => {
    const newValue = !formData.agreedToTerms;

    setFormData(prev => ({...prev, agreedToTerms: newValue}));
    setTouched(prev => ({...prev, agreedToTerms: true}));

    const termsError = validateTermsAcceptance(newValue);
    setErrors(prev => ({...prev, agreedToTerms: termsError || ''}));
  }, [formData.agreedToTerms]);

  const handleTermsLink = useCallback(async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (linkError) {
      Alert.alert('Unable to open link', 'Please try again later.');
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.error('Failed to open URL:', linkError);
      }
    }
  }, []);

  const handleSignIn = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  const handleRegister = useCallback(async () => {
    if (!validateForm()) {
      setTouched({
        email: true,
        password: true,
        agreedToTerms: true,
      });
      return;
    }

    try {
      await register(formData.email, formData.password);

      const {isAuthenticated, isIdentityCompleted} = useAuthStore.getState();

      if (isAuthenticated) {
        if (isIdentityCompleted) {
          // @ts-expect-error Dashboard not added to RootStackParamList yet
          navigation.replace('Main', {screen: 'Dashboard'});
        } else {
          navigation.replace('Identity', {screen: 'PersonalInfo'});
        }
      }
    } catch {
      // store handles errors
    }
  }, [formData, navigation, register, validateForm]);

  const isFormReady = useMemo(() => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const termsError = validateTermsAcceptance(formData.agreedToTerms);

    return !(emailError || passwordError || termsError);
  }, [formData]);

  return {
    formData,
    errors,
    touched,
    isLoading,
    error,
    handleInputChange,
    handleInputBlur,
    handleRegister,
    handleSignIn,
    toggleTerms,
    handleTermsLink,
    isFormReady,
  };
};

export type UseRegisterFormReturn = ReturnType<typeof useRegisterForm>;
