import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert as RNAlert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {HeaderWithOptions, MenuOption} from '../../components/common/HeaderWithOptions';
import {AIChatModal} from '../../components/ai/AIChatModal';
import {EmptyState} from '../../components/common/EmptyState';
import {BureauDropdown, Bureau} from '../../components/common/BureauDropdown';
import {useCreditStore} from '../../stores/creditStore';
import {filterAndMapAlerts} from '../../utils/alertUtils';
import {createAlertsScreenStyles} from './styles/alertsScreenStyles';

export const AlertsScreen: React.FC = () => {
  const {theme} = useTheme();
  const [showAIChat, setShowAIChat] = useState(false);
  const [selectedBureau, setSelectedBureau] = useState<Bureau>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [alertsError, setAlertsError] = useState<string | null>(null);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(false);

  const {alerts, fetchAlerts, clearError, availableBureaus} = useCreditStore();

  // Fetch alerts on mount
  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setIsLoadingAlerts(true);
      setAlertsError(null);
      clearError();
      await fetchAlerts();
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to load alerts. Please try again.';
      setAlertsError(errorMessage);
      console.error('Error loading alerts:', error);
    } finally {
      setIsLoadingAlerts(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAlerts();
    setRefreshing(false);
  };

  // Filter and map alerts based on selected bureau
  const uiAlerts = filterAndMapAlerts(alerts, selectedBureau, theme);

  const styles = createAlertsScreenStyles(theme);

  const menuOptions: MenuOption[] = [
    {
      id: 'ai-chat',
      label: 'AI Assistant',
      icon: 'chatbubbles',
      action: () => setShowAIChat(true),
      color: theme.colors.accent,
    },
    {
      id: 'download-report',
      label: 'Download Report',
      icon: 'download',
      action: () => {
        RNAlert.alert('Download Report', 'Your credit report will be downloaded as a PDF.', [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Download', onPress: () => {}},
        ]);
      },
      color: theme.colors.success,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithOptions
        title="Alerts & Monitoring"
        subtitle="Stay informed about your credit"
        icon="notifications"
        iconColor={theme.colors.tabBar.activeIcon}
        options={menuOptions}
      />

      {/* Bureau Dropdown */}
      <View style={{paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md}}>
        <BureauDropdown
          selectedBureau={selectedBureau}
          onBureauChange={setSelectedBureau}
          availableBureaus={availableBureaus}
          showAllOption={true}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          (isLoadingAlerts || uiAlerts.length === 0) && styles.contentContainerCentered,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.accent}
          />
        }>
        {isLoadingAlerts ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color={theme.colors.accent} />
            <Text style={styles.loadingText}>Loading alerts...</Text>
          </View>
        ) : alertsError ? (
          <View style={styles.errorState}>
            <Ionicons name="alert-circle" size={64} color={theme.colors.error} />
            <Text style={styles.errorTitle}>Unable to Load Alerts</Text>
            <Text style={styles.errorText}>{alertsError}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadAlerts}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : uiAlerts.length === 0 ? (
          <EmptyState
            icon="folder-open-outline"
            title="No Alerts Found"
            description={
              selectedBureau === 'all'
                ? "You don't have any credit alerts at this time. We'll notify you immediately of any important changes to your credit report."
                : `No alerts found for ${selectedBureau}. Your credit is looking good!`
            }
            decorativeIcon="search-outline"
            iconColor={theme.colors.text.tertiary}
          />
        ) : (
          <>
            {uiAlerts.map(alert => (
              <TouchableOpacity key={alert.id} style={styles.alertCard}>
                <View style={styles.alertContent}>
                  <View style={[styles.iconContainer, {backgroundColor: `${alert.color}15`}]}>
                    <Ionicons name={alert.icon} size={24} color={alert.color} />
                  </View>

                  <View style={styles.alertText}>
                    <View style={styles.alertHeader}>
                      <Text style={styles.alertTitle}>{alert.title}</Text>
                      {alert.unread && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.alertMessage}>{alert.message}</Text>
                    <View style={styles.alertFooter}>
                      <Text style={styles.alertDate}>{alert.date}</Text>
                      <View style={styles.bureauBadge}>
                        <Text style={styles.bureauBadgeText}>{alert.bureau}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            <View style={styles.bottomPadding} />
          </>
        )}
      </ScrollView>

      {/* AI Chat Modal */}
      <AIChatModal
        visible={showAIChat}
        onClose={() => setShowAIChat(false)}
        initialContext="Alerts & Monitoring"
      />
    </SafeAreaView>
  );
};
