import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {HeaderWithOptions, MenuOption} from '../../components/common/HeaderWithOptions';

interface MonitoredItem {
  type: 'email' | 'phone' | 'ssn' | 'credit_card';
  value: string;
  masked?: boolean;
}

interface BreachAlert {
  id: string;
  source: string;
  date: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  dataExposed: string[];
  description: string;
}

export const DarkWebMonitoringScreen: React.FC = () => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const [isScanning, setIsScanning] = useState(false);

  // Mock data - replace with actual data from store/API
  const monitoredItems: MonitoredItem[] = [
    {type: 'email', value: 'john.doe@email.com'},
    {type: 'email', value: 'johndoe@work.com'},
    {type: 'phone', value: '+1 (555) 123-4567'},
    {type: 'ssn', value: '***-**-1234', masked: true},
  ];

  const breaches: BreachAlert[] = [
    {
      id: '1',
      source: 'LinkedIn Data Breach',
      date: '2021-06-22',
      severity: 'medium',
      dataExposed: ['Email', 'Password', 'Profile Data'],
      description: '700 million accounts compromised. Passwords hashed but profile data exposed.',
    },
  ];

  const lastScanTime = '2 hours ago';
  const nextScanTime = 'In 4 hours';
  const hasBreaches = breaches.length > 0;

  const handleScanNow = () => {
    setIsScanning(true);
    // Simulate scan
    setTimeout(() => {
      setIsScanning(false);
    }, 2000);
  };

  const getItemIcon = (type: MonitoredItem['type']) => {
    switch (type) {
      case 'email':
        return 'mail';
      case 'phone':
        return 'call';
      case 'ssn':
        return 'card';
      case 'credit_card':
        return 'card-outline';
      default:
        return 'shield-checkmark';
    }
  };

  const getSeverityColor = (severity: BreachAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return theme.colors.error;
      case 'high':
        return theme.colors.error;
      case 'medium':
        return theme.colors.warning;
      case 'low':
        return theme.colors.accent;
      default:
        return theme.colors.text.secondary;
    }
  };

  const menuOptions: MenuOption[] = [
    {
      label: 'Scan Now',
      icon: 'refresh',
      onPress: handleScanNow,
    },
    {
      label: 'Scan Settings',
      icon: 'settings-outline',
      onPress: () => {},
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <HeaderWithOptions title="Dark Web Monitoring" options={menuOptions} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View style={[styles.statusCard, !hasBreaches && styles.statusCardSecure]}>
          <View style={styles.statusIcon}>
            <Ionicons
              name={hasBreaches ? 'shield-half' : 'shield-checkmark'}
              size={64}
              color={hasBreaches ? theme.colors.error : theme.colors.success}
            />
          </View>

          <Text style={styles.statusTitle}>
            {hasBreaches ? '⚠️ Breaches Detected' : '🛡️ Your Identity is Protected'}
          </Text>

          {!hasBreaches && (
            <Text style={styles.statusDescription}>
              We're continuously scanning the dark web to keep your personal information safe.
            </Text>
          )}

          {hasBreaches && (
            <Text style={[styles.statusDescription, {color: theme.colors.error}]}>
              {breaches.length} breach{breaches.length > 1 ? 'es' : ''} found. Review details below
              and take action immediately.
            </Text>
          )}
        </View>

        {/* Monitored Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monitored Information</Text>
          <Text style={styles.sectionSubtitle}>
            We're monitoring the dark web for these data points:
          </Text>

          <View style={styles.monitoredList}>
            {monitoredItems.map((item, index) => (
              <View key={index} style={styles.monitoredItem}>
                <View style={styles.monitoredIconContainer}>
                  <Ionicons
                    name={getItemIcon(item.type) as any}
                    size={20}
                    color={theme.colors.accent}
                  />
                </View>
                <Text style={styles.monitoredValue}>{item.value}</Text>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
              </View>
            ))}
          </View>

          <Text style={styles.monitoredCount}>
            ✓ {monitoredItems.length} item{monitoredItems.length > 1 ? 's' : ''} actively
            monitored
          </Text>
        </View>

        {/* Scan Status */}
        <View style={styles.section}>
          <View style={styles.scanStatusCard}>
            <View style={styles.scanStatusRow}>
              <View style={styles.scanStatusItem}>
                <Ionicons name="time" size={20} color={theme.colors.text.secondary} />
                <View>
                  <Text style={styles.scanStatusLabel}>Last Scan</Text>
                  <Text style={styles.scanStatusValue}>{lastScanTime}</Text>
                </View>
              </View>

              <View style={styles.scanStatusDivider} />

              <View style={styles.scanStatusItem}>
                <Ionicons name="timer" size={20} color={theme.colors.text.secondary} />
                <View>
                  <Text style={styles.scanStatusLabel}>Next Scan</Text>
                  <Text style={styles.scanStatusValue}>{nextScanTime}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.scanButton}
              onPress={handleScanNow}
              disabled={isScanning}>
              {isScanning ? (
                <ActivityIndicator color={theme.colors.surface} />
              ) : (
                <>
                  <Ionicons name="scan" size={20} color={theme.colors.surface} />
                  <Text style={styles.scanButtonText}>Scan Now</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Breach Alerts */}
        {hasBreaches && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Breach Alerts</Text>
            <Text style={styles.sectionSubtitle}>
              Your information was found in {breaches.length} data breach
              {breaches.length > 1 ? 'es' : ''}
            </Text>

            <View style={styles.breachesList}>
              {breaches.map(breach => (
                <View key={breach.id} style={styles.breachCard}>
                  <View style={styles.breachHeader}>
                    <View style={styles.breachTitleRow}>
                      <Ionicons name="warning" size={24} color={getSeverityColor(breach.severity)} />
                      <View style={styles.breachTitleContainer}>
                        <Text style={styles.breachSource}>{breach.source}</Text>
                        <Text style={styles.breachDate}>Discovered: {breach.date}</Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.severityBadge,
                        {backgroundColor: getSeverityColor(breach.severity) + '20'},
                      ]}>
                      <Text style={[styles.severityText, {color: getSeverityColor(breach.severity)}]}>
                        {breach.severity.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.breachDescription}>{breach.description}</Text>

                  <View style={styles.exposedDataContainer}>
                    <Text style={styles.exposedDataLabel}>Data Exposed:</Text>
                    <View style={styles.exposedDataTags}>
                      {breach.dataExposed.map((data, index) => (
                        <View key={index} style={styles.exposedDataTag}>
                          <Text style={styles.exposedDataText}>{data}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Take Action</Text>
                    <Ionicons name="arrow-forward" size={16} color={theme.colors.accent} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={theme.colors.accent} />
          <View style={styles.infoBoxContent}>
            <Text style={styles.infoBoxTitle}>How Dark Web Monitoring Works</Text>
            <Text style={styles.infoBoxText}>
              We continuously scan dark web databases, forums, and marketplaces for your personal
              information. If we find your data, you'll receive an immediate alert with steps to
              protect yourself.
            </Text>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    statusCard: {
      margin: theme.spacing.lg,
      padding: theme.spacing.xxxl,
      backgroundColor: theme.colors.error + '10',
      borderRadius: 20,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.colors.error + '30',
    },
    statusCardSecure: {
      backgroundColor: theme.colors.success + '08',
      borderColor: theme.colors.success + '30',
    },
    statusIcon: {
      marginBottom: theme.spacing.lg,
    },
    statusTitle: {
      ...theme.textStyles.headline2,
      fontWeight: '800',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    statusDescription: {
      ...theme.textStyles.bodyLarge,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    section: {
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      ...theme.textStyles.headline3,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.xs,
    },
    sectionSubtitle: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.lg,
    },
    monitoredList: {
      gap: theme.spacing.sm,
    },
    monitoredItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: 12,
    },
    monitoredIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.accent + '15',
      alignItems: 'center',
      justifyContent: 'center',
    },
    monitoredValue: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.primary,
      flex: 1,
    },
    monitoredCount: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.success,
      marginTop: theme.spacing.sm,
      fontWeight: '600',
    },
    scanStatusCard: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.lg,
      borderRadius: 16,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    scanStatusRow: {
      flexDirection: 'row',
      marginBottom: theme.spacing.lg,
    },
    scanStatusItem: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    scanStatusDivider: {
      width: 1,
      backgroundColor: theme.colors.border.light,
      marginHorizontal: theme.spacing.md,
    },
    scanStatusLabel: {
      ...theme.textStyles.caption,
      color: theme.colors.text.tertiary,
      fontSize: 11,
    },
    scanStatusValue: {
      ...theme.textStyles.bodyMedium,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    scanButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      backgroundColor: theme.colors.accent,
      paddingVertical: theme.spacing.md,
      borderRadius: 12,
    },
    scanButtonText: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '600',
      color: theme.colors.surface,
    },
    breachesList: {
      gap: theme.spacing.md,
    },
    breachCard: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.lg,
      borderRadius: 16,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.error,
      shadowColor: theme.colors.shadow.medium,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    breachHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.md,
    },
    breachTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      flex: 1,
    },
    breachTitleContainer: {
      flex: 1,
    },
    breachSource: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    breachDate: {
      ...theme.textStyles.caption,
      color: theme.colors.text.tertiary,
      fontSize: 11,
    },
    severityBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: 8,
    },
    severityText: {
      ...theme.textStyles.caption,
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 0.5,
    },
    breachDescription: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
      lineHeight: 20,
      marginBottom: theme.spacing.md,
    },
    exposedDataContainer: {
      marginBottom: theme.spacing.md,
    },
    exposedDataLabel: {
      ...theme.textStyles.bodySmall,
      fontWeight: '600',
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.xs,
    },
    exposedDataTags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
    },
    exposedDataTag: {
      backgroundColor: theme.colors.error + '15',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: 8,
    },
    exposedDataText: {
      ...theme.textStyles.caption,
      color: theme.colors.error,
      fontWeight: '600',
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xs,
      paddingVertical: theme.spacing.sm,
      borderRadius: 8,
      backgroundColor: theme.colors.accent + '10',
    },
    actionButtonText: {
      ...theme.textStyles.bodyMedium,
      fontWeight: '600',
      color: theme.colors.accent,
    },
    infoBox: {
      flexDirection: 'row',
      backgroundColor: theme.colors.accent + '10',
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.accent,
      padding: theme.spacing.lg,
      borderRadius: 12,
      gap: theme.spacing.sm,
      marginHorizontal: theme.spacing.lg,
    },
    infoBoxContent: {
      flex: 1,
    },
    infoBoxTitle: {
      ...theme.textStyles.bodyMedium,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    infoBoxText: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.text.secondary,
      lineHeight: 18,
    },
    bottomPadding: {
      height: theme.spacing.xl,
    },
  });
