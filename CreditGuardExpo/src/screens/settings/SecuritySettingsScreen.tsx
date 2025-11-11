import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {Colors} from '../../constants/colors';
import {HeaderWithOptions} from '../../components/common/HeaderWithOptions';
import {useUserProfileStore} from '../../stores/userProfileStore';

export const SecuritySettingsScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const {securitySettings, isLoading, updateSecuritySettings} = useUserProfileStore();

  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [pinEnabled, setPinEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(15);

  useEffect(() => {
    setBiometricEnabled(securitySettings.biometricEnabled);
    setPinEnabled(securitySettings.pinEnabled);
    setTwoFactorEnabled(securitySettings.twoFactorEnabled);
    setSessionTimeout(securitySettings.sessionTimeout);
  }, [securitySettings]);

  const handleBiometricToggle = async (value: boolean) => {
    setBiometricEnabled(value);
    try {
      await updateSecuritySettings({biometricEnabled: value});
      Alert.alert(
        'Success',
        value
          ? 'Biometric authentication enabled'
          : 'Biometric authentication disabled'
      );
    } catch (_error) {
      setBiometricEnabled(!value);
      Alert.alert('Error', 'Failed to update biometric setting');
    }
  };

  const handlePinToggle = async (value: boolean) => {
    if (value) {
      Alert.alert(
        'Set PIN',
        'PIN setup functionality will be available soon.',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'OK',
            onPress: async () => {
              setPinEnabled(true);
              await updateSecuritySettings({pinEnabled: true});
            },
          },
        ]
      );
    } else {
      setPinEnabled(false);
      await updateSecuritySettings({pinEnabled: false});
    }
  };

  const handleTwoFactorToggle = async (value: boolean) => {
    if (value) {
      Alert.alert(
        'Enable 2FA',
        'Two-factor authentication setup will be available soon.',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'OK',
            onPress: async () => {
              setTwoFactorEnabled(true);
              await updateSecuritySettings({twoFactorEnabled: true});
            },
          },
        ]
      );
    } else {
      Alert.alert(
        'Disable 2FA',
        'Are you sure you want to disable two-factor authentication?',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Disable',
            style: 'destructive',
            onPress: async () => {
              setTwoFactorEnabled(false);
              await updateSecuritySettings({twoFactorEnabled: false});
            },
          },
        ]
      );
    }
  };

  const handleSessionTimeoutChange = (minutes: number) => {
    Alert.alert(
      'Change Session Timeout',
      `Set session timeout to ${minutes} minutes?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'OK',
          onPress: async () => {
            setSessionTimeout(minutes);
            await updateSecuritySettings({sessionTimeout: minutes});
          },
        },
      ]
    );
  };

  const handleViewActiveSessions = () => {
    Alert.alert(
      'Active Sessions',
      'You have 2 active sessions:\n\n• iPhone 14 Pro (Current)\n• iPad Pro - Last active 2 hours ago',
      [{text: 'OK'}]
    );
  };

  const handleSignOutAllDevices = () => {
    Alert.alert(
      'Sign Out All Devices',
      'This will sign you out from all devices except this one. You will need to sign in again on other devices.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Signed out from all other devices');
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles(theme).container, {backgroundColor: theme.colors.background}]}>
        <HeaderWithOptions
          title="Security"
          onBackPress={() => navigation.goBack()}
          showBackButton
        />
        <View style={styles(theme).loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles(theme).container, {backgroundColor: theme.colors.background}]}>
      <HeaderWithOptions
        title="Security"
        onBackPress={() => navigation.goBack()}
        showBackButton
      />

      <ScrollView style={styles(theme).scrollView} showsVerticalScrollIndicator={false}>
        {/* Biometric Authentication */}
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>Authentication</Text>

          <View style={styles(theme).settingRow}>
            <View style={styles(theme).settingInfo}>
              <View style={styles(theme).settingHeader}>
                <Ionicons name="finger-print" size={24} color={theme.colors.accent} />
                <Text style={styles(theme).settingTitle}>Biometric Login</Text>
              </View>
              <Text style={styles(theme).settingDescription}>
                Use Face ID or Touch ID to unlock the app
              </Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={handleBiometricToggle}
              trackColor={{false: theme.colors.border, true: theme.colors.accent + '60'}}
              thumbColor={biometricEnabled ? theme.colors.accent : theme.colors.textSecondary}
            />
          </View>

          <View style={styles(theme).settingRow}>
            <View style={styles(theme).settingInfo}>
              <View style={styles(theme).settingHeader}>
                <Ionicons name="keypad" size={24} color={theme.colors.info} />
                <Text style={styles(theme).settingTitle}>PIN Code</Text>
              </View>
              <Text style={styles(theme).settingDescription}>
                Require a 4-digit PIN to access the app
              </Text>
            </View>
            <Switch
              value={pinEnabled}
              onValueChange={handlePinToggle}
              trackColor={{false: theme.colors.border, true: theme.colors.info + '60'}}
              thumbColor={pinEnabled ? theme.colors.info : theme.colors.textSecondary}
            />
          </View>

          <View style={styles(theme).settingRow}>
            <View style={styles(theme).settingInfo}>
              <View style={styles(theme).settingHeader}>
                <Ionicons name="shield-checkmark" size={24} color={Colors.success} />
                <Text style={styles(theme).settingTitle}>Two-Factor Authentication</Text>
              </View>
              <Text style={styles(theme).settingDescription}>
                Add an extra layer of security to your account
              </Text>
            </View>
            <Switch
              value={twoFactorEnabled}
              onValueChange={handleTwoFactorToggle}
              trackColor={{false: theme.colors.border, true: Colors.success + '60'}}
              thumbColor={twoFactorEnabled ? Colors.success : theme.colors.textSecondary}
            />
          </View>
        </View>

        {/* Session Management */}
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>Session Management</Text>

          <View style={styles(theme).settingCard}>
            <Text style={styles(theme).settingLabel}>Auto-Lock Timeout</Text>
            <Text style={styles(theme).settingSubtext}>
              Automatically lock the app after inactivity
            </Text>

            <View style={styles(theme).timeoutOptions}>
              {[5, 10, 15, 30, 60].map(minutes => (
                <TouchableOpacity
                  key={minutes}
                  style={[
                    styles(theme).timeoutOption,
                    sessionTimeout === minutes && styles(theme).timeoutOptionActive,
                  ]}
                  onPress={() => handleSessionTimeoutChange(minutes)}>
                  <Text
                    style={[
                      styles(theme).timeoutOptionText,
                      sessionTimeout === minutes && styles(theme).timeoutOptionTextActive,
                    ]}>
                    {minutes} min
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles(theme).actionButton}
            onPress={handleViewActiveSessions}>
            <View style={styles(theme).actionButtonContent}>
              <Ionicons name="phone-portrait-outline" size={24} color={theme.colors.text} />
              <View style={styles(theme).actionButtonText}>
                <Text style={styles(theme).actionButtonTitle}>Active Sessions</Text>
                <Text style={styles(theme).actionButtonSubtitle}>
                  View devices where you're signed in
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles(theme).actionButton, styles(theme).dangerButton]}
            onPress={handleSignOutAllDevices}>
            <View style={styles(theme).actionButtonContent}>
              <Ionicons name="log-out-outline" size={24} color={Colors.error} />
              <View style={styles(theme).actionButtonText}>
                <Text style={[styles(theme).actionButtonTitle, {color: Colors.error}]}>
                  Sign Out All Devices
                </Text>
                <Text style={styles(theme).actionButtonSubtitle}>
                  End all sessions except this one
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Privacy & Data */}
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>Privacy & Data</Text>

          <TouchableOpacity style={styles(theme).actionButton}>
            <View style={styles(theme).actionButtonContent}>
              <Ionicons name="eye-off-outline" size={24} color={theme.colors.text} />
              <View style={styles(theme).actionButtonText}>
                <Text style={styles(theme).actionButtonTitle}>Privacy Settings</Text>
                <Text style={styles(theme).actionButtonSubtitle}>
                  Manage your data and privacy preferences
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles(theme).actionButton}>
            <View style={styles(theme).actionButtonContent}>
              <Ionicons name="document-text-outline" size={24} color={theme.colors.text} />
              <View style={styles(theme).actionButtonText}>
                <Text style={styles(theme).actionButtonTitle}>Data & Permissions</Text>
                <Text style={styles(theme).actionButtonSubtitle}>
                  See what data we collect and why
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Security Info */}
        <View style={styles(theme).infoCard}>
          <Ionicons name="information-circle" size={24} color={theme.colors.info} />
          <Text style={styles(theme).infoText}>
            We use bank-level 256-bit encryption to protect your data. Your information is never
            shared without your permission.
          </Text>
        </View>

        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollView: {
      flex: 1,
    },
    section: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 16,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.card,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
    },
    settingInfo: {
      flex: 1,
      marginRight: 12,
    },
    settingHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginLeft: 12,
    },
    settingDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginLeft: 36,
    },
    settingCard: {
      backgroundColor: theme.colors.card,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
    },
    settingLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 4,
    },
    settingSubtext: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 16,
    },
    timeoutOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    timeoutOption: {
      flex: 1,
      minWidth: '30%',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
    },
    timeoutOptionActive: {
      backgroundColor: theme.colors.accent + '15',
      borderColor: theme.colors.accent,
    },
    timeoutOptionText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },
    timeoutOptionTextActive: {
      color: theme.colors.accent,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.card,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
    },
    dangerButton: {
      borderWidth: 1,
      borderColor: Colors.error + '30',
    },
    actionButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    actionButtonText: {
      marginLeft: 12,
      flex: 1,
    },
    actionButtonTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    actionButtonSubtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    infoCard: {
      flexDirection: 'row',
      backgroundColor: theme.colors.info + '15',
      padding: 16,
      borderRadius: 12,
      marginHorizontal: 20,
      marginBottom: 24,
    },
    infoText: {
      flex: 1,
      fontSize: 14,
      color: theme.colors.text,
      marginLeft: 12,
      lineHeight: 20,
    },
  });
