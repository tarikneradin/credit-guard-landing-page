import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {useAuthStore} from '../../stores/authStore';
// import type {ThemeMode} from '../../constants/Themes';
import {HeaderWithOptions, MenuOption} from '../../components/common/HeaderWithOptions';
import {AIChatModal} from '../../components/ai/AIChatModal';
import {TutorialModal} from '../../components/tutorial/TutorialModal';
import {useTutorial} from '../../hooks/useTutorial';
import {SettingsStackParamList} from '../../navigation/types';

interface SettingsItem {
  id: string;
  title: string;
  subtitle?: string;
  type: 'navigation' | 'action' | 'toggle' | 'theme';
  icon: string;
  action?: () => void;
  destructive?: boolean;
  value?: boolean;
  onToggle?: (value: boolean) => void;
}

type SettingsScreenNavigationProp = StackNavigationProp<SettingsStackParamList, 'SettingsHome'>;

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const {user, logout} = useAuthStore();
  const {theme, themeMode, setThemeMode, isDark} = useTheme();
  const [showAIChat, setShowAIChat] = useState(false);
  const {showTutorial, setShowTutorial, completeTutorial, resetTutorial} = useTutorial();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          // Navigate to login screen
          const rootNavigation = navigation.getParent()?.getParent();
          if (rootNavigation) {
            rootNavigation.reset({
              index: 0,
              routes: [{name: 'Auth', params: {screen: 'Login'}}],
            });
          }
        },
      },
    ]);
  };

  const handleThemeSelection = () => {
    Alert.alert('Choose Theme', 'Select your preferred theme', [
      {
        text: 'Light',
        onPress: () => setThemeMode('light'),
      },
      {
        text: 'Dark',
        onPress: () => setThemeMode('dark'),
      },
      {
        text: 'System',
        onPress: () => setThemeMode('system'),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const getThemeSubtitle = () => {
    switch (themeMode) {
      case 'light':
        return 'Light mode';
      case 'dark':
        return 'Dark mode';
      case 'system':
        return 'Follow system';
      default:
        return 'Follow system';
    }
  };

  const settingsData: SettingsItem[] = [
    {
      id: 'subscription',
      title: 'Subscription & Billing',
      subtitle: 'Manage your plan and payment',
      type: 'navigation',
      icon: 'card-outline',
      action: () => navigation.navigate('SubscriptionPlans'),
    },
    {
      id: 'profile',
      title: 'Profile & Personal Info',
      subtitle: 'Update your personal information',
      type: 'navigation',
      icon: 'person-circle-outline',
      action: () => navigation.navigate('Profile'),
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      subtitle: 'Password, biometrics, and privacy settings',
      type: 'navigation',
      icon: 'lock-closed-outline',
      action: () => navigation.navigate('Security'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Manage alert preferences',
      type: 'navigation',
      icon: 'notifications-outline',
      action: () => navigation.navigate('Notifications'),
    },
    {
      id: 'features',
      title: 'Feature Settings',
      subtitle: 'Enable or disable app features',
      type: 'navigation',
      icon: 'options-outline',
      action: () => navigation.navigate('FeatureSettings'),
    },
    {
      id: 'theme',
      title: 'Appearance',
      subtitle: getThemeSubtitle(),
      type: 'theme',
      icon: isDark ? 'moon-outline' : 'sunny-outline',
      action: handleThemeSelection,
    },
    {
      id: 'credit-actions',
      title: 'Credit Actions',
      subtitle: 'Export, dispute, lock, freeze & fraud alerts',
      type: 'navigation',
      icon: 'shield-checkmark-outline',
      action: () => navigation.navigate('CreditActions'),
    },
    {
      id: 'darkweb',
      title: 'Dark Web Monitoring',
      subtitle: 'Identity protection & breach alerts',
      type: 'navigation',
      icon: 'shield-checkmark-outline',
      action: () => {
        // Navigate to nested stack - requires root navigation
        // Using type assertion for nested navigation
        (
          navigation.getParent() as StackNavigationProp<
            import('../../navigation/types').RootStackParamList
          > | null
        )?.navigate('Main', {
          screen: 'MainTabs',
          params: {
            screen: 'Settings',
          },
        });
      },
    },
    {
      id: 'tutorial',
      title: 'App Tutorial',
      subtitle: 'Learn how to use CreditGuard',
      type: 'action',
      icon: 'school-outline',
      action: () => resetTutorial(),
    },
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'FAQs and contact support',
      type: 'navigation',
      icon: 'help-circle-outline',
      action: () => navigation.navigate('HelpSupport'),
    },
    {
      id: 'about',
      title: 'About CreditGuard',
      subtitle: 'App version and legal information',
      type: 'navigation',
      icon: 'information-circle-outline',
      action: () => navigation.navigate('About'),
    },
    {
      id: 'logout',
      title: 'Sign Out',
      type: 'action',
      icon: 'log-out-outline',
      action: handleLogout,
      destructive: true,
    },
  ];

  const renderSettingsItem = (item: SettingsItem) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.settingsItem, item.destructive && styles.destructiveItem]}
      onPress={item.action}>
      <View style={[styles.itemIcon, item.destructive && styles.destructiveIcon]}>
        <Ionicons
          name={item.icon as keyof typeof Ionicons.glyphMap}
          size={22}
          color={item.destructive ? theme.colors.error : theme.colors.text.secondary}
        />
      </View>

      <View style={styles.itemContent}>
        <Text style={[styles.itemTitle, item.destructive && styles.destructiveText]}>
          {item.title}
        </Text>
        {item.subtitle && <Text style={styles.itemSubtitle}>{item.subtitle}</Text>}
      </View>

      {(item.type === 'navigation' || item.type === 'theme') && (
        <Ionicons name="chevron-forward" size={18} color={theme.colors.text.quaternary} />
      )}
    </TouchableOpacity>
  );

  const subscriptionSection = settingsData.filter(item => item.id === 'subscription');

  const accountSection = settingsData.filter(item =>
    ['profile', 'security', 'notifications', 'features'].includes(item.id),
  );

  const appearanceSection = settingsData.filter(item => item.id === 'theme');

  const appSection = settingsData.filter(item =>
    ['credit-actions', 'darkweb', 'tutorial', 'help', 'about'].includes(item.id),
  );

  const actionSection = settingsData.filter(item => item.id === 'logout');

  const styles = {
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.lg,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.colors.border.light,
    },
    title: {
      ...theme.textStyles.headline1,
      color: theme.colors.text.primary,
      fontWeight: 'bold' as const,
      marginBottom: theme.spacing.xs,
    },
    userInfo: {
      ...theme.textStyles.bodyLarge,
      color: theme.colors.text.secondary,
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      paddingTop: theme.spacing.md,
    },
    personalInfoCard: {
      backgroundColor: theme.colors.surface,
      marginHorizontal: theme.spacing.lg,
      borderRadius: 20,
      padding: theme.spacing.xl,
      marginBottom: theme.spacing.lg,
      shadowColor: theme.colors.shadow.medium,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
      alignItems: 'center' as const,
    },
    profileImageContainer: {
      position: 'relative' as const,
      marginBottom: theme.spacing.lg,
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.accent + '15',
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      borderWidth: 3,
      borderColor: theme.colors.surface,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    editProfileButton: {
      position: 'absolute' as const,
      bottom: 0,
      right: 0,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.accent,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      borderWidth: 3,
      borderColor: theme.colors.surface,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    personalInfoContent: {
      alignItems: 'center' as const,
      marginBottom: theme.spacing.lg,
    },
    userName: {
      ...theme.textStyles.headline2,
      fontWeight: '800',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.xs,
      textAlign: 'center' as const,
    },
    userEmail: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing.md,
      textAlign: 'center' as const,
    },
    membershipBadge: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: theme.colors.success + '15',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: 20,
      gap: 6,
    },
    membershipText: {
      ...theme.textStyles.bodyMedium,
      fontWeight: '700',
      color: theme.colors.success,
      fontSize: 13,
    },
    viewProfileButton: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: theme.colors.accent + '10',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: 12,
      gap: 6,
      borderWidth: 1,
      borderColor: theme.colors.accent + '20',
    },
    viewProfileText: {
      ...theme.textStyles.bodyMedium,
      fontWeight: '700',
      color: theme.colors.accent,
    },
    section: {
      marginTop: theme.spacing.lg,
    },
    sectionTitle: {
      ...theme.textStyles.labelMedium,
      color: theme.colors.text.tertiary,
      fontWeight: '600' as const,
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
      textTransform: 'uppercase' as const,
      fontSize: 13,
      letterSpacing: 0.5,
    },
    sectionContent: {
      backgroundColor: theme.colors.surface,
      marginHorizontal: theme.spacing.lg,
      borderRadius: 12,
      overflow: 'hidden' as const,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    settingsItem: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.colors.border.subtle,
      backgroundColor: theme.colors.surface,
    },
    destructiveItem: {
      backgroundColor: theme.colors.surface,
    },
    itemIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surfaceSecondary,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginRight: theme.spacing.lg,
    },
    destructiveIcon: {
      backgroundColor: theme.colors.alert.errorBg,
    },
    itemContent: {
      flex: 1,
    },
    itemTitle: {
      ...theme.textStyles.bodyLarge,
      color: theme.colors.text.primary,
      fontWeight: '600' as const,
      marginBottom: 2,
    },
    destructiveText: {
      color: theme.colors.error,
    },
    itemSubtitle: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.secondary,
      lineHeight: 18,
    },
    versionContainer: {
      alignItems: 'center' as const,
      paddingVertical: theme.spacing.xl,
      marginTop: theme.spacing.lg,
    },
    versionText: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.tertiary,
      marginBottom: theme.spacing.xs,
    },
    buildText: {
      ...theme.textStyles.caption,
      color: theme.colors.text.tertiary,
    },
    bottomPadding: {
      height: 100, // Space for tab bar
    },
  };

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
        Alert.alert('Download Report', 'Your credit report will be downloaded as a PDF.', [
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
        title="Settings"
        subtitle={
          user && user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : 'Manage your preferences'
        }
        icon="settings"
        iconColor={theme.colors.tabBar.activeIcon}
        options={menuOptions}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Personal Info Card */}
        <View style={styles.personalInfoCard}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Ionicons name="person" size={40} color={theme.colors.accent} />
            </View>
            <TouchableOpacity style={styles.editProfileButton} activeOpacity={0.7}>
              <Ionicons name="camera" size={16} color={theme.colors.surface} />
            </TouchableOpacity>
          </View>

          <View style={styles.personalInfoContent}>
            <Text style={styles.userName}>
              {user && user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : 'John Doe'}
            </Text>
            <Text style={styles.userEmail}>
              {user && user.email ? user.email : 'john.doe@example.com'}
            </Text>

            <View style={styles.membershipBadge}>
              <Ionicons name="shield-checkmark" size={14} color={theme.colors.success} />
              <Text style={styles.membershipText}>Premium Member</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.viewProfileButton}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.7}>
            <Text style={styles.viewProfileText}>View Profile</Text>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.accent} />
          </TouchableOpacity>
        </View>

        {/* Subscription Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          <View style={styles.sectionContent}>{subscriptionSection.map(renderSettingsItem)}</View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionContent}>{accountSection.map(renderSettingsItem)}</View>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.sectionContent}>{appearanceSection.map(renderSettingsItem)}</View>
        </View>

        {/* App Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>
          <View style={styles.sectionContent}>{appSection.map(renderSettingsItem)}</View>
        </View>

        {/* Action Section */}
        <View style={styles.section}>
          <View style={styles.sectionContent}>{actionSection.map(renderSettingsItem)}</View>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>CreditGuard MVP v1.0.0</Text>
          <Text style={styles.buildText}>Build 2024.01.22</Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* AI Chat Modal */}
      <AIChatModal
        visible={showAIChat}
        onClose={() => setShowAIChat(false)}
        initialContext="Settings"
      />

      {/* Tutorial Modal */}
      <TutorialModal
        visible={showTutorial}
        onClose={() => setShowTutorial(false)}
        onComplete={completeTutorial}
      />
    </SafeAreaView>
  );
};
