import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {MainStackParamList} from './types';
import MainTabNavigator from './MainTabNavigator';
import {GamificationScreen} from '../screens/gamification/GamificationScreen';
import {DarkWebMonitoringScreen} from '../screens/main/DarkWebMonitoringScreen';

const Stack = createStackNavigator<MainStackParamList>();

export const MainStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'card',
      }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen
        name="GamificationScreen"
        component={GamificationScreen}
        options={{
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="DarkWebMonitoring"
        component={DarkWebMonitoringScreen}
        options={{
          presentation: 'card',
        }}
      />
      {/* Add other detail screens here as needed */}
      {/* <Stack.Screen name="NotificationCenter" component={NotificationCenterScreen} /> */}
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
