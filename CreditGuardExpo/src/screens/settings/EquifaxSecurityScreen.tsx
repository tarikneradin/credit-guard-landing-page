import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {EquifaxSecurityCard} from '../../components/equifax/EquifaxSecurityCard';
import {EquifaxWebView} from '../../components/equifax/EquifaxWebView';
import {equifaxSecurityFeatures} from '../../data/equifaxMockData';
import {EquifaxFeatureType} from '../../types/equifax';

export const EquifaxSecurityScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();
  const [showEquifaxWebView, setShowEquifaxWebView] = useState(false);
  const [selectedEquifaxFeature, setSelectedEquifaxFeature] =
    useState<EquifaxFeatureType>('freeze');

  const handleEquifaxFeaturePress = (featureType: EquifaxFeatureType) => {
    setSelectedEquifaxFeature(featureType);
    setShowEquifaxWebView(true);
  };

  const handleEquifaxSuccess = () => {
    setShowEquifaxWebView(false);
    Alert.alert('Success', 'Your request has been processed successfully!');
  };

  const handleEquifaxError = (error: string) => {
    Alert.alert('Error', `Unable to complete request: ${error}`);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.light,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surfaceSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    headerContent: {
      flex: 1,
    },
    headerTitle: {
      ...theme.textStyles.headline3,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: 2,
    },
    headerSubtitle: {
      ...theme.textStyles.bodyRegular,
      color: theme.colors.text.secondary,
    },
    headerIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#007AFF15',
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      paddingTop: theme.spacing.lg,
    },
    introSection: {
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
      backgroundColor: theme.colors.primary + '08',
      borderRadius: 16,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.primary + '20',
    },
    introHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    introIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary + '20',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    introTitle: {
      ...theme.textStyles.headline4,
      fontWeight: '700',
      color: theme.colors.text.primary,
    },
    introText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
      lineHeight: 22,
    },
    sectionTitle: {
      ...theme.textStyles.headline4,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },
    featuresContainer: {
      marginHorizontal: theme.spacing.lg,
    },
    bottomPadding: {
      height: 40,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Equifax Security</Text>
          <Text style={styles.headerSubtitle}>Protect your identity</Text>
        </View>
        <View style={styles.headerIcon}>
          <Ionicons name="shield-checkmark" size={24} color="#007AFF" />
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Introduction */}
        <View style={styles.introSection}>
          <View style={styles.introHeader}>
            <View style={styles.introIconContainer}>
              <Ionicons name="information-circle" size={24} color={theme.colors.primary} />
            </View>
            <Text style={styles.introTitle}>Security Features</Text>
          </View>
          <Text style={styles.introText}>
            Protect your credit and identity with powerful security tools from Equifax. Freeze your
            credit, set up alerts, and lock your reports to prevent unauthorized access.
          </Text>
        </View>

        {/* Security Features */}
        <Text style={styles.sectionTitle}>Available Features</Text>
        <View style={styles.featuresContainer}>
          {equifaxSecurityFeatures.map(feature => (
            <EquifaxSecurityCard
              key={feature.type}
              feature={feature}
              onPress={() => handleEquifaxFeaturePress(feature.type)}
            />
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Equifax WebView Modal */}
      {showEquifaxWebView && (
        <EquifaxWebView
          featureType={selectedEquifaxFeature}
          onClose={() => setShowEquifaxWebView(false)}
          onSuccess={handleEquifaxSuccess}
          onError={handleEquifaxError}
        />
      )}
    </SafeAreaView>
  );
};
