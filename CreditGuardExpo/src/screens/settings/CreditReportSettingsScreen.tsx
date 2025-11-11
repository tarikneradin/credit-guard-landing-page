import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {Colors} from '../../constants/colors';
import {HeaderWithOptions} from '../../components/common/HeaderWithOptions';

export const CreditReportSettingsScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();

  // Monitoring Settings
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshFrequency, setRefreshFrequency] = useState<'daily' | 'weekly' | 'monthly'>(
    'weekly'
  );
  const [scoreAlerts, setScoreAlerts] = useState(true);
  const [accountAlerts, setAccountAlerts] = useState(true);
  const [inquiryAlerts, setInquiryAlerts] = useState(true);
  const [balanceAlerts, setBalanceAlerts] = useState(false);

  // Bureau Settings
  const [monitorEquifax, setMonitorEquifax] = useState(true);
  const [monitorTransUnion, setMonitorTransUnion] = useState(true);
  const [monitorExperian, setMonitorExperian] = useState(true);

  const handleFrequencyChange = (freq: 'daily' | 'weekly' | 'monthly') => {
    setRefreshFrequency(freq);
  };

  const handleExportReport = () => {
    Alert.alert(
      'Export Credit Report',
      'Choose export format:',
      [
        {text: 'PDF', onPress: () => Alert.alert('Exporting', 'Generating PDF report...')},
        {text: 'CSV', onPress: () => Alert.alert('Exporting', 'Generating CSV report...')},
        {text: 'Cancel', style: 'cancel'},
      ]
    );
  };

  const handleDisputeItem = () => {
    Alert.alert(
      'Dispute Credit Item',
      'This feature will help you file disputes with credit bureaus for inaccurate information.',
      [{text: 'OK'}]
    );
  };

  return (
    <SafeAreaView style={[styles(theme).container, {backgroundColor: theme.colors.background}]}>
      <HeaderWithOptions
        title="Credit Report Settings"
        onBackPress={() => navigation.goBack()}
        showBackButton
      />

      <ScrollView style={styles(theme).scrollView} showsVerticalScrollIndicator={false}>
        {/* Monitoring Frequency */}
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>Monitoring Frequency</Text>
          <Text style={styles(theme).sectionDescription}>
            How often should we check your credit report for changes?
          </Text>

          <View style={styles(theme).settingCard}>
            <View style={styles(theme).settingRow}>
              <View style={styles(theme).settingInfo}>
                <Text style={styles(theme).settingLabel}>Auto-Refresh</Text>
                <Text style={styles(theme).settingSubtext}>
                  Automatically update your credit data
                </Text>
              </View>
              <Switch
                value={autoRefresh}
                onValueChange={setAutoRefresh}
                trackColor={{false: theme.colors.border.medium, true: theme.colors.accent + '60'}}
                thumbColor={autoRefresh ? theme.colors.accent : theme.colors.textSecondary}
              />
            </View>
          </View>

          {autoRefresh && (
            <View style={styles(theme).frequencyContainer}>
              {(['daily', 'weekly', 'monthly'] as const).map(freq => (
                <TouchableOpacity
                  key={freq}
                  style={[
                    styles(theme).frequencyOption,
                    refreshFrequency === freq && styles(theme).frequencyOptionActive,
                  ]}
                  onPress={() => handleFrequencyChange(freq)}>
                  <Ionicons
                    name={refreshFrequency === freq ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={
                      refreshFrequency === freq ? theme.colors.accent : theme.colors.text.secondary
                    }
                  />
                  <Text
                    style={[
                      styles(theme).frequencyText,
                      refreshFrequency === freq && styles(theme).frequencyTextActive,
                    ]}>
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Alert Preferences */}
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>Alert Preferences</Text>
          <Text style={styles(theme).sectionDescription}>
            Choose what credit changes you want to be notified about
          </Text>

          <View style={styles(theme).settingCard}>
            <View style={styles(theme).settingRow}>
              <View style={styles(theme).settingInfo}>
                <View style={styles(theme).settingHeader}>
                  <Ionicons name="trending-up" size={20} color={Colors.success} />
                  <Text style={styles(theme).settingLabel}>Score Changes</Text>
                </View>
                <Text style={styles(theme).settingSubtext}>
                  Get notified when your credit score changes
                </Text>
              </View>
              <Switch
                value={scoreAlerts}
                onValueChange={setScoreAlerts}
                trackColor={{false: theme.colors.border.medium, true: Colors.success + '60'}}
                thumbColor={scoreAlerts ? Colors.success : theme.colors.textSecondary}
              />
            </View>

            <View style={[styles(theme).settingRow, styles(theme).settingRowBorder]}>
              <View style={styles(theme).settingInfo}>
                <View style={styles(theme).settingHeader}>
                  <Ionicons name="card" size={20} color={theme.colors.info} />
                  <Text style={styles(theme).settingLabel}>New Accounts</Text>
                </View>
                <Text style={styles(theme).settingSubtext}>
                  Alert on new accounts or credit lines
                </Text>
              </View>
              <Switch
                value={accountAlerts}
                onValueChange={setAccountAlerts}
                trackColor={{false: theme.colors.border.medium, true: theme.colors.info + '60'}}
                thumbColor={accountAlerts ? theme.colors.info : theme.colors.textSecondary}
              />
            </View>

            <View style={[styles(theme).settingRow, styles(theme).settingRowBorder]}>
              <View style={styles(theme).settingInfo}>
                <View style={styles(theme).settingHeader}>
                  <Ionicons name="search" size={20} color={Colors.warning} />
                  <Text style={styles(theme).settingLabel}>Credit Inquiries</Text>
                </View>
                <Text style={styles(theme).settingSubtext}>
                  Alert on hard credit inquiries
                </Text>
              </View>
              <Switch
                value={inquiryAlerts}
                onValueChange={setInquiryAlerts}
                trackColor={{false: theme.colors.border.medium, true: Colors.warning + '60'}}
                thumbColor={inquiryAlerts ? Colors.warning : theme.colors.textSecondary}
              />
            </View>

            <View style={[styles(theme).settingRow, styles(theme).settingRowBorder]}>
              <View style={styles(theme).settingInfo}>
                <View style={styles(theme).settingHeader}>
                  <Ionicons name="wallet" size={20} color={theme.colors.accent} />
                  <Text style={styles(theme).settingLabel}>Balance Changes</Text>
                </View>
                <Text style={styles(theme).settingSubtext}>
                  Alert on significant balance changes
                </Text>
              </View>
              <Switch
                value={balanceAlerts}
                onValueChange={setBalanceAlerts}
                trackColor={{false: theme.colors.border.medium, true: theme.colors.accent + '60'}}
                thumbColor={balanceAlerts ? theme.colors.accent : theme.colors.textSecondary}
              />
            </View>
          </View>
        </View>

        {/* Credit Bureaus */}
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>Credit Bureau Monitoring</Text>
          <Text style={styles(theme).sectionDescription}>
            Select which credit bureaus to monitor
          </Text>

          <View style={styles(theme).settingCard}>
            <View style={styles(theme).settingRow}>
              <View style={styles(theme).settingInfo}>
                <Text style={styles(theme).settingLabel}>Equifax</Text>
                <Text style={styles(theme).settingSubtext}>Monitor Equifax credit report</Text>
              </View>
              <Switch
                value={monitorEquifax}
                onValueChange={setMonitorEquifax}
                trackColor={{false: theme.colors.border.medium, true: theme.colors.accent + '60'}}
                thumbColor={monitorEquifax ? theme.colors.accent : theme.colors.textSecondary}
              />
            </View>

            <View style={[styles(theme).settingRow, styles(theme).settingRowBorder]}>
              <View style={styles(theme).settingInfo}>
                <Text style={styles(theme).settingLabel}>TransUnion</Text>
                <Text style={styles(theme).settingSubtext}>Monitor TransUnion credit report</Text>
              </View>
              <Switch
                value={monitorTransUnion}
                onValueChange={setMonitorTransUnion}
                trackColor={{false: theme.colors.border.medium, true: theme.colors.accent + '60'}}
                thumbColor={monitorTransUnion ? theme.colors.accent : theme.colors.textSecondary}
              />
            </View>

            <View style={[styles(theme).settingRow, styles(theme).settingRowBorder]}>
              <View style={styles(theme).settingInfo}>
                <Text style={styles(theme).settingLabel}>Experian</Text>
                <Text style={styles(theme).settingSubtext}>Monitor Experian credit report</Text>
              </View>
              <Switch
                value={monitorExperian}
                onValueChange={setMonitorExperian}
                trackColor={{false: theme.colors.border.medium, true: theme.colors.accent + '60'}}
                thumbColor={monitorExperian ? theme.colors.accent : theme.colors.textSecondary}
              />
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles(theme).section}>
          <Text style={styles(theme).sectionTitle}>Actions</Text>

          <TouchableOpacity style={styles(theme).actionButton} onPress={handleExportReport}>
            <View style={styles(theme).actionButtonContent}>
              <Ionicons name="download-outline" size={24} color={theme.colors.accent} />
              <View style={styles(theme).actionButtonText}>
                <Text style={styles(theme).actionButtonTitle}>Export Credit Report</Text>
                <Text style={styles(theme).actionButtonSubtitle}>
                  Download as PDF or CSV
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles(theme).actionButton} onPress={handleDisputeItem}>
            <View style={styles(theme).actionButtonContent}>
              <Ionicons name="shield-outline" size={24} color={Colors.warning} />
              <View style={styles(theme).actionButtonText}>
                <Text style={styles(theme).actionButtonTitle}>Dispute Credit Item</Text>
                <Text style={styles(theme).actionButtonSubtitle}>
                  File a dispute with bureaus
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <View style={styles(theme).infoCard}>
          <Ionicons name="information-circle" size={24} color={theme.colors.info} />
          <Text style={styles(theme).infoText}>
            We recommend monitoring all three credit bureaus to get a complete picture of your
            credit health. Different lenders may use different bureaus.
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
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    sectionDescription: {
      fontSize: 14,
      color: theme.colors.text.secondary,
      marginBottom: 16,
      lineHeight: 20,
    },
    settingCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.border.light,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
    },
    settingRowBorder: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.subtle,
    },
    settingInfo: {
      flex: 1,
      marginRight: 12,
    },
    settingHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 4,
    },
    settingLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    settingSubtext: {
      fontSize: 14,
      color: theme.colors.text.secondary,
      marginTop: 2,
    },
    frequencyContainer: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 12,
      gap: 8,
      marginTop: 12,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
    },
    frequencyOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 8,
      gap: 12,
    },
    frequencyOptionActive: {
      backgroundColor: theme.colors.accent + '10',
    },
    frequencyText: {
      fontSize: 15,
      fontWeight: '500',
      color: theme.colors.text.secondary,
    },
    frequencyTextActive: {
      fontWeight: '600',
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
      borderWidth: 1,
      borderColor: theme.colors.border.light,
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
      color: theme.colors.text.primary,
    },
    actionButtonSubtitle: {
      fontSize: 14,
      color: theme.colors.text.secondary,
      marginTop: 2,
    },
    infoCard: {
      flexDirection: 'row',
      backgroundColor: theme.colors.info + '15',
      padding: 16,
      borderRadius: 12,
      marginHorizontal: 20,
      marginBottom: 24,
      gap: 12,
    },
    infoText: {
      flex: 1,
      fontSize: 14,
      color: theme.colors.text.primary,
      lineHeight: 20,
    },
  });
