import React, {useEffect} from 'react';
import {View, Text, Platform} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from './types';
import {Ionicons} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../contexts/ThemeContext';
import {useFeatureFlagsStore} from '../stores/featureFlagsStore';

import {DashboardScreen} from '../screens/main/DashboardScreen';
import {CreditReportScreen} from '../screens/main/CreditReportScreen';
import {SmartActionsScreen} from '../screens/main/SmartActionsScreen';
// import { AIAssistantScreen } from '../screens/main/AIAssistantScreen';
import {OffersScreen} from '../screens/main/OffersScreen';
import {AlertsScreen} from '../screens/main/AlertsScreen';
import {SettingsStackNavigator} from './SettingsStackNavigator';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Modern icon mapping with filled and outlined variants
const tabIcons = {
  Dashboard: {
    focused: 'analytics' as const,
    unfocused: 'analytics-outline' as const,
  },
  CreditReport: {
    focused: 'document-text' as const,
    unfocused: 'document-text-outline' as const,
  },
  SmartActions: {
    focused: 'hardware-chip' as const,
    unfocused: 'hardware-chip-outline' as const,
  },
  AIAssistant: {
    focused: 'chatbubbles' as const,
    unfocused: 'chatbubbles-outline' as const,
  },
  Offers: {
    focused: 'gift' as const,
    unfocused: 'gift-outline' as const,
  },
  Alerts: {
    focused: 'notifications' as const,
    unfocused: 'notifications-outline' as const,
  },
  Settings: {
    focused: 'settings' as const,
    unfocused: 'settings-outline' as const,
  },
} as const;

interface TabIconProps {
  name: keyof typeof tabIcons;
  focused: boolean;
  color: string;
  size: number;
}

const TabIcon: React.FC<TabIconProps> = ({name, focused, color, size}) => {
  const iconName = focused ? tabIcons[name].focused : tabIcons[name].unfocused;

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: size + 8,
        height: size + 8,
      }}>
      <Ionicons
        name={iconName}
        size={focused ? size + 2 : size}
        color={color}
        style={{
          marginBottom: 2,
        }}
      />
    </View>
  );
};

interface TabLabelProps {
  focused: boolean;
  color: string;
  children: string;
}

const TabLabel: React.FC<TabLabelProps> = ({focused, color, children}) => {
  const {theme} = useTheme();

  return (
    <Text
      style={{
        color,
        fontSize: focused ? 11 : 10,
        fontWeight: focused ? '600' : '500',
        marginTop: 2,
        fontFamily: theme.typography.fontFamily.medium,
        letterSpacing: 0.5,
      }}
      numberOfLines={1}>
      {children}
    </Text>
  );
};

export const MainTabNavigator: React.FC = () => {
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();
  const {flags, loadFlags} = useFeatureFlagsStore();

  useEffect(() => {
    loadFlags();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.tabBar.activeIcon,
        tabBarInactiveTintColor: theme.colors.tabBar.inactiveIcon,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBar.background,
          borderTopColor: theme.colors.tabBar.border,
          borderTopWidth: 0.5,
          paddingTop: 6,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom + 2 : 6,
          paddingHorizontal: 16,
          height: Platform.OS === 'ios' ? 70 + insets.bottom : 60,
          shadowColor: theme.colors.shadow.light,
          shadowOffset: {width: 0, height: -4},
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 12,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarLabelStyle: {
          marginTop: 0,
          marginBottom: 2,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({focused, color}) => (
          <TabIcon
            name={route.name as keyof typeof tabIcons}
            focused={focused}
            color={color}
            size={24}
          />
        ),
        tabBarLabel: ({focused, color, children}) => (
          <TabLabel focused={focused} color={color}>
            {children as string}
          </TabLabel>
        ),
      })}>
      {flags.creditScore && (
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            tabBarLabel: 'Dashboard',
          }}
        />
      )}
      {flags.creditReport && (
        <Tab.Screen
          name="CreditReport"
          component={CreditReportScreen}
          options={{
            tabBarLabel: 'Report',
          }}
        />
      )}
      {(flags.aiAssistant || flags.smartActions || flags.optimalPath) && (
        <Tab.Screen
          name="SmartActions"
          component={SmartActionsScreen}
          options={{
            tabBarLabel: 'AI Assistant',
          }}
        />
      )}
      {/* AI Assistant can be accessed from Smart Actions screen
      <Tab.Screen
        name="AIAssistant"
        component={AIAssistantScreen}
        options={{
          tabBarLabel: 'AI Chat',
        }}
      /> */}
      {flags.offers && (
        <Tab.Screen
          name="Offers"
          component={OffersScreen}
          options={{
            tabBarLabel: 'Offers',
          }}
        />
      )}
      {flags.alerts && (
        <Tab.Screen
          name="Alerts"
          component={AlertsScreen}
          options={{
            tabBarLabel: 'Alerts',
          }}
        />
      )}
      <Tab.Screen
        name="Settings"
        component={SettingsStackNavigator}
        options={{
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
