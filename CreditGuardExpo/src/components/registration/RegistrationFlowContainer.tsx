import React, {useState} from 'react';
import {Animated} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {CompositeNavigationProp, StackActions} from '@react-navigation/native';

import {RegistrationContainer} from './RegistrationContainer';
import {RegisterStep} from './steps/RegisterStep';
import {PersonalInfoStep} from './steps/PersonalInfoStep';
import {PhoneVerificationStep} from './steps/PhoneVerificationStep';
// import {EmailVerificationStep} from './steps/EmailVerificationStep';
import {VerificationSuccessStep} from './steps/VerificationSuccessStep';
import {AuthStackParamList, RootStackParamList} from '../../navigation/types';

type RegistrationFlowNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AuthStackParamList, 'Register'>,
  StackNavigationProp<RootStackParamList>
>;

export const RegistrationFlowContainer: React.FC = () => {
  const navigation = useNavigation<RegistrationFlowNavigationProp>();
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  const transitionToStep = (nextStep: number) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setCurrentStep(nextStep);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleRegisterComplete = () => {
    transitionToStep(1);
  };

  const handlePersonalInfoComplete = () => {
    transitionToStep(2);
  };

  const handleIdentityFailure = (params: {
    message: string;
    details?: string[];
    codes?: string[];
  }) => {
    const rootNavigation = navigation.getParent();
    if (rootNavigation) {
      rootNavigation.dispatch(
        StackActions.replace('Identity', {
          screen: 'IdentityFailure',
          params,
        }),
      );
    }
  };

  const handleServiceFailure = (params?: {
    message?: string;
    details?: string[];
    codes?: string[];
    origin?: 'identity' | 'smfaSend' | 'smfaVerify' | 'enrollment' | 'cooldown';
  }) => {
    const rootNavigation = navigation.getParent();
    if (rootNavigation) {
      rootNavigation.dispatch(
        StackActions.replace('Identity', {
          screen: 'ServiceFailure',
          params,
        }),
      );
    }
  };

  const handleSmfaFailure = (params: {message: string; details?: string[]; codes?: string[]}) => {
    const rootNavigation = navigation.getParent();
    if (rootNavigation) {
      rootNavigation.dispatch(
        StackActions.replace('Identity', {
          screen: 'SmfaFailure',
          params,
        }),
      );
    }
  };

  const handleVerificationSuccess = () => {
    transitionToStep(3);
  };

  const handleAccessDashboard = () => {
    const rootNavigation = navigation.getParent();
    if (rootNavigation) {
      // @ts-expect-error Dashboard navigation pattern used throughout app
      rootNavigation.replace('Main', {screen: 'Dashboard'});
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <RegisterStep navigation={navigation} onComplete={handleRegisterComplete} />;
      case 1:
        return (
          <PersonalInfoStep
            onComplete={handlePersonalInfoComplete}
            onIdentityFailure={handleIdentityFailure}
            onServiceFailure={handleServiceFailure}
          />
        );
      case 2:
        return (
          <PhoneVerificationStep
            onComplete={handleVerificationSuccess}
            onServiceFailure={handleServiceFailure}
            onSmfaFailure={handleSmfaFailure}
            onIdentityFailure={handleIdentityFailure}
          />
        );
      case 3:
        return <VerificationSuccessStep onAccessDashboard={handleAccessDashboard} />;
      default:
        return null;
    }
  };

  return (
    <RegistrationContainer currentStep={currentStep}>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <Animated.View style={{opacity: fadeAnim, width: '100%'}}>{renderStep()}</Animated.View>
    </RegistrationContainer>
  );
};

export default RegistrationFlowContainer;
