import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {Colors} from '../../constants/colors';
import {HeaderWithOptions} from '../../components/common/HeaderWithOptions';
import {useUserProfileStore} from '../../stores/userProfileStore';

export const NotificationPreferencesScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const {notificationSettings, updateNotificationSettings} = useUserProfileStore();

  const [scoreUpdates, setScoreUpdates] = useState(false);
  const [accountChanges, setAccountChanges] = useState(false);
  const [paymentReminders, setPaymentReminders] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);

  useEffect(() => {
    setScoreUpdates(notificationSettings.scoreUpdates);
    setAccountChanges(notificationSettings.accountChanges);
    setPaymentReminders(notificationSettings.paymentReminders);
    setMarketingEmails(notificationSettings.marketingEmails);
    setPushNotifications(notificationSettings.pushNotifications);
    setEmailNotifications(notificationSettings.emailNotifications);
    setSmsNotifications(notificationSettings.smsNotifications);
  }, [notificationSettings]);

  const handleToggle = async (
    key: keyof typeof notificationSettings,
    value: boolean,
    setter: (val: boolean) => void
  ) => {
    setter(value);
    try {
      await updateNotificationSettings({[key]: value});
    } catch (_error) {
      setter(!value);
      Alert.alert('Error', 'Failed to update notification settings');
    }
  };

  return (
    <SafeAreaView style={[styles(theme).container, {backgroundColor: theme.colors.background}]}>
      <HeaderWithOptions
        title="Notifications"
        onBackPress={() => navigation.goBack()}
        showBackButton
      />

      <ScrollView style={styles(theme).scrollView} showsVerticalScrollIndicator={false}>
        {/* Alert Types */}
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>Credit Alerts</Text>
          <Text style={styles(theme).sectionDescription}>
            Stay informed about important changes to your credit
          </Text>

          <View style={styles(theme).settingRow}>
            <View style={styles(theme).settingInfo}>
              <View style={styles(theme).settingHeader}>
                <Ionicons name="trending-up" size={22} color={theme.colors.accent} />
                <Text style={styles(theme).settingTitle}>Score Updates</Text>
              </View>
              <Text style={styles(theme).settingDescription}>
                Get notified when your credit score changes
              </Text>
            </View>
            <Switch
              value={scoreUpdates}
              onValueChange={val => handleToggle('scoreUpdates', val, setScoreUpdates)}
              trackColor={{false: theme.colors.border, true: theme.colors.accent + '60'}}
              thumbColor={scoreUpdates ? theme.colors.accent : theme.colors.textSecondary}
            />
          </View>

          <View style={styles(theme).settingRow}>
            <View style={styles(theme).settingInfo}>
              <View style={styles(theme).settingHeader}>
                <Ionicons name="card" size={22} color={theme.colors.info} />
                <Text style={styles(theme).settingTitle}>Account Changes</Text>
              </View>
              <Text style={styles(theme).settingDescription}>
                New accounts, inquiries, or balance changes
              </Text>
            </View>
            <Switch
              value={accountChanges}
              onValueChange={val => handleToggle('accountChanges', val, setAccountChanges)}
              trackColor={{false: theme.colors.border, true: theme.colors.info + '60'}}
              thumbColor={accountChanges ? theme.colors.info : theme.colors.textSecondary}
            />
          </View>

          <View style={styles(theme).settingRow}>
            <View style={styles(theme).settingInfo}>
              <View style={styles(theme).settingHeader}>
                <Ionicons name="calendar" size={22} color={Colors.warning} />
                <Text style={styles(theme).settingTitle}>Payment Reminders</Text>
              </View>
              <Text style={styles(theme).settingDescription}>
                Reminders before payment due dates
              </Text>
            </View>
            <Switch
              value={paymentReminders}
              onValueChange={val => handleToggle('paymentReminders', val, setPaymentReminders)}
              trackColor={{false: theme.colors.border, true: Colors.warning + '60'}}
              thumbColor={paymentReminders ? Colors.warning : theme.colors.textSecondary}
            />
          </View>
        </View>

        {/* Delivery Methods */}
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>Delivery Methods</Text>
          <Text style={styles(theme).sectionDescription}>
            Choose how you want to receive notifications
          </Text>

          <View style={styles(theme).settingRow}>
            <View style={styles(theme).settingInfo}>
              <View style={styles(theme).settingHeader}>
                <Ionicons name="phone-portrait" size={22} color={theme.colors.accent} />
                <Text style={styles(theme).settingTitle}>Push Notifications</Text>
              </View>
              <Text style={styles(theme).settingDescription}>
                Real-time alerts on your device
              </Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={val => handleToggle('pushNotifications', val, setPushNotifications)}
              trackColor={{false: theme.colors.border, true: theme.colors.accent + '60'}}
              thumbColor={pushNotifications ? theme.colors.accent : theme.colors.textSecondary}
            />
          </View>

          <View style={styles(theme).settingRow}>
            <View style={styles(theme).settingInfo}>
              <View style={styles(theme).settingHeader}>
                <Ionicons name="mail" size={22} color={theme.colors.info} />
                <Text style={styles(theme).settingTitle}>Email Notifications</Text>
              </View>
              <Text style={styles(theme).settingDescription}>
                Receive alerts via email
              </Text>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={val => handleToggle('emailNotifications', val, setEmailNotifications)}
              trackColor={{false: theme.colors.border, true: theme.colors.info + '60'}}
              thumbColor={emailNotifications ? theme.colors.info : theme.colors.textSecondary}
            />
          </View>

          <View style={styles(theme).settingRow}>
            <View style={styles(theme).settingInfo}>
              <View style={styles(theme).settingHeader}>
                <Ionicons name="chatbubble" size={22} color={Colors.success} />
                <Text style={styles(theme).settingTitle}>SMS Notifications</Text>
              </View>
              <Text style={styles(theme).settingDescription}>
                Get alerts via text message
              </Text>
            </View>
            <Switch
              value={smsNotifications}
              onValueChange={val => handleToggle('smsNotifications', val, setSmsNotifications)}
              trackColor={{false: theme.colors.border, true: Colors.success + '60'}}
              thumbColor={smsNotifications ? Colors.success : theme.colors.textSecondary}
            />
          </View>
        </View>

        {/* Marketing */}
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>Marketing & Promotions</Text>
          <Text style={styles(theme).sectionDescription}>
            Offers, tips, and product updates
          </Text>

          <View style={styles(theme).settingRow}>
            <View style={styles(theme).settingInfo}>
              <View style={styles(theme).settingHeader}>
                <Ionicons name="megaphone" size={22} color={theme.colors.textSecondary} />
                <Text style={styles(theme).settingTitle}>Marketing Emails</Text>
              </View>
              <Text style={styles(theme).settingDescription}>
                Financial tips and exclusive offers
              </Text>
            </View>
            <Switch
              value={marketingEmails}
              onValueChange={val => handleToggle('marketingEmails', val, setMarketingEmails)}
              trackColor={{false: theme.colors.border, true: theme.colors.accent + '60'}}
              thumbColor={marketingEmails ? theme.colors.accent : theme.colors.textSecondary}
            />
          </View>
        </View>

        {/* Notification Preview */}
        <View style={styles(theme).previewSection}>
          <Text style={styles(theme).previewTitle}>Notification Preview</Text>

          <View style={styles(theme).previewCard}>
            <View style={styles(theme).previewHeader}>
              <View style={styles(theme).previewIcon}>
                <Ionicons name="trending-up" size={20} color={Colors.success} />
              </View>
              <View style={styles(theme).previewContent}>
                <Text style={styles(theme).previewCardTitle}>Credit Score Increased</Text>
                <Text style={styles(theme).previewCardSubtitle}>2 minutes ago</Text>
              </View>
            </View>
            <Text style={styles(theme).previewMessage}>
              Great news! Your credit score increased by 5 points to 742.
            </Text>
          </View>

          <View style={styles(theme).previewCard}>
            <View style={styles(theme).previewHeader}>
              <View style={styles(theme).previewIcon}>
                <Ionicons name="alert-circle" size={20} color={Colors.warning} />
              </View>
              <View style={styles(theme).previewContent}>
                <Text style={styles(theme).previewCardTitle}>Payment Due Soon</Text>
                <Text style={styles(theme).previewCardSubtitle}>1 day ago</Text>
              </View>
            </View>
            <Text style={styles(theme).previewMessage}>
              Your Chase Freedom payment of $125 is due in 3 days.
            </Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles(theme).infoCard}>
          <Ionicons name="information-circle" size={24} color={theme.colors.info} />
          <Text style={styles(theme).infoText}>
            You can manage device notification permissions in your phone settings. Critical security
            alerts will always be sent regardless of your preferences.
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
      marginBottom: 4,
    },
    sectionDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
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
      marginLeft: 34,
    },
    previewSection: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    previewTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 16,
    },
    previewCard: {
      backgroundColor: theme.colors.card,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    previewHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    previewIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    previewContent: {
      flex: 1,
      marginLeft: 12,
    },
    previewCardTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.text,
    },
    previewCardSubtitle: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    previewMessage: {
      fontSize: 14,
      color: theme.colors.text,
      lineHeight: 20,
      marginLeft: 48,
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
