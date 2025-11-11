import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Linking, Alert, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {useNavigation} from '@react-navigation/native';
import {HeaderWithOptions, MenuOption} from '../../components/common/HeaderWithOptions';

const RESTORATION_PHONE = '1-877-368-4940';

export const EquifaxIDRestorationScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();

  const handleCallNow = async () => {
    const phoneUrl = `tel:${RESTORATION_PHONE}`;

    const canOpen = await Linking.canOpenURL(phoneUrl);
    if (canOpen) {
      await Linking.openURL(phoneUrl);
    } else {
      Alert.alert(
        'Unable to Make Call',
        `Please dial ${RESTORATION_PHONE} manually to reach ID Restoration Services.`,
        [{text: 'OK'}],
      );
    }
  };

  const features = [
    {
      icon: 'shield-checkmark',
      text: 'Expert assistance',
    },
    {
      icon: 'people',
      text: 'Dedicated specialist',
    },
    {
      icon: 'git-compare',
      text: 'Issue resolution',
    },
    {
      icon: 'eye',
      text: '3-month monitoring',
    },
  ];

  const menuOptions: MenuOption[] = [
    {
      id: 'call',
      label: 'Call Now',
      icon: 'call',
      action: handleCallNow,
      color: theme.colors.success,
    },
  ];

  return (
    <SafeAreaView style={styles(theme).container} edges={['top']}>
      <HeaderWithOptions
        title="ID Restoration"
        subtitle="Expert identity theft assistance"
        icon="medical"
        iconColor={theme.colors.success}
        options={menuOptions}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles(theme).content} showsVerticalScrollIndicator={false}>
        {/* Call Card */}
        <View style={styles(theme).callCard}>
          <View style={styles(theme).cardHeader}>
            <View style={styles(theme).iconContainer}>
              <Ionicons name="call" size={24} color={theme.colors.success} />
            </View>
            <Text style={styles(theme).cardTitle}>24/7 Support Line</Text>
          </View>

          <Text style={styles(theme).phoneNumber}>{RESTORATION_PHONE}</Text>

          <TouchableOpacity
            style={styles(theme).callButton}
            onPress={handleCallNow}
            activeOpacity={0.8}>
            <Ionicons name="call" size={20} color={theme.colors.surface} />
            <Text style={styles(theme).callButtonText}>Call Now</Text>
          </TouchableOpacity>

          <Text style={styles(theme).freeText}>Free for members • Available 24/7</Text>
        </View>

        {/* Features */}
        <View style={styles(theme).featuresCard}>
          <Text style={styles(theme).sectionTitle}>What's Included</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles(theme).featureRow}>
              <View style={styles(theme).featureIcon}>
                <Ionicons name={feature.icon as any} size={20} color={theme.colors.success} />
              </View>
              <Text style={styles(theme).featureText}>{feature.text}</Text>
            </View>
          ))}
        </View>

        {/* Info */}
        <View style={styles(theme).infoBox}>
          <Ionicons name="information-circle" size={20} color={theme.colors.accent} />
          <Text style={styles(theme).infoText}>
            Free for members. Specialist guides you through recovery with 3 months monitoring.
          </Text>
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
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
    },
    callCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: theme.spacing.xl,
      marginBottom: theme.spacing.lg,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.success + '15',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    cardTitle: {
      ...theme.textStyles.headline4,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    phoneNumber: {
      ...theme.textStyles.headline2,
      fontWeight: '700',
      color: theme.colors.success,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
      letterSpacing: 1,
    },
    callButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.success,
      paddingVertical: theme.spacing.md,
      borderRadius: 12,
      marginBottom: theme.spacing.md,
      gap: theme.spacing.sm,
      shadowColor: theme.colors.success,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 4,
    },
    callButtonText: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '700',
      color: theme.colors.surface,
    },
    freeText: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      fontWeight: '500',
    },
    featuresCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
    },
    sectionTitle: {
      ...theme.textStyles.headline4,
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.lg,
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    featureIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.success + '15',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    featureText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.primary,
      flex: 1,
    },
    infoBox: {
      flexDirection: 'row',
      backgroundColor: theme.colors.accent + '10',
      borderRadius: 12,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.accent + '30',
      gap: theme.spacing.md,
    },
    infoText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
      flex: 1,
      lineHeight: 22,
    },
    bottomPadding: {
      height: 40,
    },
  });
