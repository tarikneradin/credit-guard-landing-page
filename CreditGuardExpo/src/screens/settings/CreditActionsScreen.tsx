import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';

interface CreditAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  action: () => void;
  badge?: string;
  badgeColor?: string;
}

export const CreditActionsScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();

  const [freezeStatus, setFreezeStatus] = useState({
    equifax: false,
    transunion: false,
    experian: false,
  });

  const [lockStatus, setLockStatus] = useState(false);
  const [fraudAlertStatus, setFraudAlertStatus] = useState(false);
  const [activeDutyAlertStatus, setActiveDutyAlertStatus] = useState(false);

  const handleExportReport = () => {
    Alert.alert(
      'Export Credit Report',
      'Choose export format for your credit report:',
      [
        {
          text: 'PDF',
          onPress: () => {
            Alert.alert('Generating PDF', 'Your credit report is being prepared. You will receive a notification when it\'s ready.');
          },
        },
        {
          text: 'CSV',
          onPress: () => {
            Alert.alert('Generating CSV', 'Your credit report data is being exported. You will receive a notification when it\'s ready.');
          },
        },
        {text: 'Cancel', style: 'cancel'},
      ]
    );
  };

  const handleDispute = () => {
    Alert.alert(
      'Dispute Credit Item',
      'File a dispute with credit bureaus for inaccurate information on your credit report.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Start Dispute',
          onPress: () => {
            Alert.alert('Coming Soon', 'Credit dispute filing will be available in the next update.');
          },
        },
      ]
    );
  };

  const handleCreditLock = () => {
    Alert.alert(
      lockStatus ? 'Unlock Credit File' : 'Lock Credit File',
      lockStatus
        ? 'Unlocking your credit will allow new credit inquiries and accounts to be opened. Continue?'
        : 'Locking your credit prevents new credit inquiries and accounts from being opened. You can unlock anytime. Continue?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: lockStatus ? 'Unlock' : 'Lock',
          style: lockStatus ? 'default' : 'destructive',
          onPress: () => {
            setLockStatus(!lockStatus);
            Alert.alert(
              'Success',
              lockStatus
                ? 'Your credit file has been unlocked. New credit applications can now be processed.'
                : 'Your credit file has been locked. No new credit applications can be processed until you unlock it.'
            );
          },
        },
      ]
    );
  };

  const handleSecurityFreeze = () => {
    navigation.navigate('SecurityFreeze' as never, {currentStatus: freezeStatus} as never);
  };

  const handleFraudAlert = () => {
    Alert.alert(
      fraudAlertStatus ? 'Remove Fraud Alert' : 'Place Fraud Alert',
      fraudAlertStatus
        ? 'Remove the fraud alert from your credit file?'
        : 'Place a 1-year fraud alert on your credit file? Creditors will be required to verify your identity before extending credit.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: fraudAlertStatus ? 'Remove' : 'Place Alert',
          style: fraudAlertStatus ? 'destructive' : 'default',
          onPress: () => {
            setFraudAlertStatus(!fraudAlertStatus);
            Alert.alert(
              'Success',
              fraudAlertStatus
                ? 'Fraud alert has been removed from your credit file.'
                : 'A 1-year fraud alert has been placed on your credit file with all three bureaus.'
            );
          },
        },
      ]
    );
  };

  const handleActiveDutyAlert = () => {
    Alert.alert(
      activeDutyAlertStatus ? 'Remove Active Duty Alert' : 'Place Active Duty Alert',
      activeDutyAlertStatus
        ? 'Remove the active duty alert from your credit file?'
        : 'Place a 1-year active duty alert on your credit file? This is for active military personnel deployed away from their usual duty station.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: activeDutyAlertStatus ? 'Remove' : 'Place Alert',
          style: activeDutyAlertStatus ? 'destructive' : 'default',
          onPress: () => {
            setActiveDutyAlertStatus(!activeDutyAlertStatus);
            Alert.alert(
              'Success',
              activeDutyAlertStatus
                ? 'Active duty alert has been removed from your credit file.'
                : 'A 1-year active duty alert has been placed on your credit file with all three bureaus.'
            );
          },
        },
      ]
    );
  };

  const actions: CreditAction[] = [
    {
      id: 'export',
      title: 'Export Credit Report',
      description: 'Download your full credit report as PDF or CSV',
      icon: 'download-outline',
      iconColor: theme.colors.info,
      action: handleExportReport,
    },
    {
      id: 'dispute',
      title: 'Dispute Credit Item',
      description: 'File a dispute for inaccurate information',
      icon: 'document-text-outline',
      iconColor: theme.colors.warning,
      action: handleDispute,
    },
    {
      id: 'lock',
      title: 'Credit Lock',
      description: lockStatus
        ? 'Your credit is locked - Click to unlock'
        : 'Lock your credit to prevent new accounts',
      icon: lockStatus ? 'lock-closed' : 'lock-open-outline',
      iconColor: lockStatus ? theme.colors.success : theme.colors.text.secondary,
      action: handleCreditLock,
      badge: lockStatus ? 'LOCKED' : undefined,
      badgeColor: theme.colors.success,
    },
    {
      id: 'freeze',
      title: 'Security Freeze',
      description: 'Manage credit freezes with all three bureaus',
      icon: 'snow-outline',
      iconColor: theme.colors.accent,
      action: handleSecurityFreeze,
      badge:
        freezeStatus.equifax && freezeStatus.transunion && freezeStatus.experian
          ? 'ALL FROZEN'
          : freezeStatus.equifax || freezeStatus.transunion || freezeStatus.experian
            ? 'PARTIAL'
            : undefined,
      badgeColor: theme.colors.accent,
    },
    {
      id: 'fraud-alert',
      title: 'Fraud Alert',
      description: fraudAlertStatus
        ? 'Fraud alert active - Click to remove'
        : 'Place a 1-year fraud alert on your credit',
      icon: 'alert-circle-outline',
      iconColor: fraudAlertStatus ? theme.colors.error : theme.colors.text.secondary,
      action: handleFraudAlert,
      badge: fraudAlertStatus ? 'ACTIVE' : undefined,
      badgeColor: theme.colors.error,
    },
    {
      id: 'active-duty',
      title: 'Active Duty Alert',
      description: activeDutyAlertStatus
        ? 'Active duty alert active - Click to remove'
        : 'Place alert for active military personnel',
      icon: 'shield-outline',
      iconColor: activeDutyAlertStatus ? theme.colors.success : theme.colors.text.secondary,
      action: handleActiveDutyAlert,
      badge: activeDutyAlertStatus ? 'ACTIVE' : undefined,
      badgeColor: theme.colors.success,
    },
  ];

  const renderActionCard = (action: CreditAction) => (
    <TouchableOpacity
      key={action.id}
      style={styles(theme).actionCard}
      onPress={action.action}
      activeOpacity={0.7}>
      <View
        style={[
          styles(theme).actionIconContainer,
          {backgroundColor: action.iconColor + '15'},
        ]}>
        <Ionicons
          name={action.icon as any}
          size={28}
          color={action.iconColor}
        />
      </View>

      <View style={styles(theme).actionContent}>
        <View style={styles(theme).actionHeader}>
          <Text style={styles(theme).actionTitle}>{action.title}</Text>
          {action.badge && (
            <View
              style={[
                styles(theme).actionBadge,
                {
                  backgroundColor: action.badgeColor + '20',
                  borderColor: action.badgeColor,
                },
              ]}>
              <Text
                style={[
                  styles(theme).actionBadgeText,
                  {color: action.badgeColor},
                ]}>
                {action.badge}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles(theme).actionDescription}>{action.description}</Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={theme.colors.text.quaternary}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles(theme).container}>
      {/* Header */}
      <View style={styles(theme).header}>
        <TouchableOpacity
          style={styles(theme).backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={28} color={theme.colors.accent} />
        </TouchableOpacity>
        <Text style={styles(theme).headerTitle}>Credit Actions</Text>
        <View style={styles(theme).headerSpacer} />
      </View>

      <ScrollView
        style={styles(theme).scrollView}
        contentContainerStyle={styles(theme).contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Info Banner */}
        <View style={styles(theme).infoBanner}>
          <Ionicons name="information-circle" size={24} color={theme.colors.accent} />
          <Text style={styles(theme).infoBannerText}>
            Take control of your credit with these powerful actions. All changes take effect immediately.
          </Text>
        </View>

        {/* Action Cards */}
        <View style={styles(theme).actionsContainer}>
          {actions.map(renderActionCard)}
        </View>

        <View style={styles(theme).bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.light,
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    backButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
      backgroundColor: theme.colors.accent + '15',
    },
    headerTitle: {
      ...theme.textStyles.headline3,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    headerSpacer: {
      width: 40,
    },
    scrollView: {
      flex: 1,
    },
    contentContainer: {
      padding: theme.spacing.lg,
    },
    infoBanner: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: theme.colors.accent + '10',
      padding: theme.spacing.lg,
      borderRadius: 12,
      marginBottom: theme.spacing.xl,
      gap: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.accent + '20',
    },
    infoBannerText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
      flex: 1,
      lineHeight: 20,
    },
    actionsContainer: {
      gap: theme.spacing.md,
    },
    actionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.lg,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
      gap: theme.spacing.md,
    },
    actionIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionContent: {
      flex: 1,
    },
    actionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginBottom: 4,
    },
    actionTitle: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '600',
      color: theme.colors.text.primary,
      flex: 1,
    },
    actionBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: 8,
      borderWidth: 1,
    },
    actionBadgeText: {
      ...theme.textStyles.caption,
      fontWeight: '700',
      fontSize: 10,
      letterSpacing: 0.5,
    },
    actionDescription: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.text.secondary,
      lineHeight: 18,
    },
    bottomPadding: {
      height: 40,
    },
  });
