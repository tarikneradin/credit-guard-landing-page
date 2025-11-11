import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {IdentityStackParamList} from './types';

// Import identity verification screens
import {PersonalInfoScreen} from '../screens/identity/PersonalInfoScreen';
import {PhoneVerificationScreen} from '../screens/identity/PhoneVerificationScreen';
import {VerificationSuccessScreen} from '../screens/identity/VerificationSuccessScreen';
import {IdentityFailureScreen} from '../screens/identity/IdentityFailureScreen';
import {ServiceFailureScreen} from '../screens/identity/ServiceFailureScreen';
import {SmfaFailureScreen} from '../screens/identity/SmfaFailureScreen';
import {EmailVerificationScreen} from '../screens/identity/EmailVerificationScreen';

const Stack = createStackNavigator<IdentityStackParamList>();

export const IdentityStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {backgroundColor: '#F8FAFC'},
        gestureEnabled: false,
      }}
      initialRouteName="PersonalInfo">
      <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
      <Stack.Screen name="PhoneVerification" component={PhoneVerificationScreen} />
      <Stack.Screen name="VerificationSuccess" component={VerificationSuccessScreen} />
      <Stack.Screen name="IdentityFailure" component={IdentityFailureScreen} />
      <Stack.Screen name="ServiceFailure" component={ServiceFailureScreen} />
      <Stack.Screen name="SmfaFailure" component={SmfaFailureScreen} />
      <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
    </Stack.Navigator>
  );
};

export default IdentityStackNavigator;
