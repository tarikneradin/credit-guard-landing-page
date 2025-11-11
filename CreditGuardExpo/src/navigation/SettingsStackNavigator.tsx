import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {SettingsStackParamList} from './types';

// Settings screens
import {SettingsScreen} from '../screens/main/SettingsScreen';
import {SubscriptionPlansScreen} from '../screens/settings/SubscriptionPlansScreen';
import {ProfileScreen} from '../screens/settings/ProfileScreen';
import {SecuritySettingsScreen} from '../screens/settings/SecuritySettingsScreen';
import {NotificationPreferencesScreen} from '../screens/settings/NotificationPreferencesScreen';
import {HelpSupportScreen} from '../screens/settings/HelpSupportScreen';
import {AboutScreen} from '../screens/settings/AboutScreen';
import {CreditActionsScreen} from '../screens/settings/CreditActionsScreen';
import {EquifaxSecurityScreen} from '../screens/settings/EquifaxSecurityScreen';
import {EquifaxIDRestorationScreen} from '../screens/main/EquifaxIDRestorationScreen';
import {FeatureSettingsScreen} from '../screens/settings/FeatureSettingsScreen';

const Stack = createStackNavigator<SettingsStackParamList>();

export const SettingsStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="SettingsHome" component={SettingsScreen} />
      <Stack.Screen name="SubscriptionPlans" component={SubscriptionPlansScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Security" component={SecuritySettingsScreen} />
      <Stack.Screen name="Notifications" component={NotificationPreferencesScreen} />
      <Stack.Screen name="FeatureSettings" component={FeatureSettingsScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="CreditActions" component={CreditActionsScreen} />
      <Stack.Screen name="EquifaxSecurity" component={EquifaxSecurityScreen} />
      <Stack.Screen name="EquifaxIDRestoration" component={EquifaxIDRestorationScreen} />
    </Stack.Navigator>
  );
};
