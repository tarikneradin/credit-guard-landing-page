import React from 'react';
import {TouchableOpacity, Text, Alert} from 'react-native';
import {useAuthStore} from '../../stores/authStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Quick Logout Button for Testing
 * Add this to any screen to quickly logout and see the login screen
 *
 * Usage:
 * import {QuickLogoutButton} from '../../components/debug/QuickLogoutButton';
 * <QuickLogoutButton />
 */
export const QuickLogoutButton: React.FC = () => {
  const {logout} = useAuthStore();

  const handleQuickLogout = async () => {
    Alert.alert('Quick Logout', 'This will log you out and clear all stored data. Continue?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            // Clear AsyncStorage completely
            await AsyncStorage.clear();

            // Logout from auth store
            await logout();

            // Force app reload (optional)
            // You might need to manually restart the app
          } catch {
            // Silently fail
          }
        },
      },
    ]);
  };

  const styles = {
    button: {
      backgroundColor: '#EF4444',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      alignSelf: 'flex-start' as const,
    },
    buttonText: {
      color: '#FFFFFF',
      fontWeight: '600' as const,
      fontSize: 14,
    },
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleQuickLogout}>
      <Text style={styles.buttonText}>Quick Logout (Debug)</Text>
    </TouchableOpacity>
  );
};
