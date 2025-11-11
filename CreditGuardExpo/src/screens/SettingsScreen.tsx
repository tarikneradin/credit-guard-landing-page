import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert} from 'react-native';

export const SettingsScreen: React.FC = () => {
  const handleSettingPress = (setting: string) => {
    Alert.alert('Feature Coming Soon', `${setting} will be available in a future update.`);
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          Alert.alert('Signed Out', 'You have been successfully signed out.');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your account and preferences</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => handleSettingPress('Profile Information')}
          activeOpacity={0.7}>
          <Text style={styles.settingLabel}>Profile Information</Text>
          <Text style={styles.settingValue}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => handleSettingPress('Change Password')}
          activeOpacity={0.7}>
          <Text style={styles.settingLabel}>Change Password</Text>
          <Text style={styles.settingValue}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => handleSettingPress('Notification Settings')}
          activeOpacity={0.7}>
          <Text style={styles.settingLabel}>Notification Settings</Text>
          <Text style={styles.settingValue}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => handleSettingPress('Help Center')}
          activeOpacity={0.7}>
          <Text style={styles.settingLabel}>Help Center</Text>
          <Text style={styles.settingValue}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => handleSettingPress('Contact Support')}
          activeOpacity={0.7}>
          <Text style={styles.settingLabel}>Contact Support</Text>
          <Text style={styles.settingValue}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.settingItem, styles.logoutButton]}
          onPress={handleSignOut}
          activeOpacity={0.8}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  section: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  settingItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingLabel: {
    fontSize: 16,
    color: '#111827',
  },
  settingValue: {
    fontSize: 18,
    color: '#9CA3AF',
    fontWeight: '300',
  },
  logoutButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutText: {
    fontSize: 16,
    color: '#DC2626',
    fontWeight: '600',
  },
});
