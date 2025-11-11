/* eslint-disable @typescript-eslint/no-explicit-any */

import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {PersonalInfo} from '../../types';

interface PersonalInfoSectionProps {
  personalInfo: PersonalInfo;
  providerName?: string;
}

// InfoRow component moved outside to avoid recreation on every render
const InfoRow: React.FC<{
  icon: string;
  label: string;
  value: string;
  iconColor?: string;
  theme: any;
  styles: any;
}> = ({icon, label, value, iconColor, theme, styles}) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIcon}>
      <Ionicons
        name={icon as keyof typeof Ionicons.glyphMap}
        size={20}
        color={iconColor || theme.colors.accent}
      />
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  personalInfo,
  providerName,
}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const [isPreviousEmploymentsExpanded, setIsPreviousEmploymentsExpanded] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <View style={styles.container}>
      {/* Current Information Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="person-circle" size={24} color={theme.colors.accent} />
          <Text style={styles.cardTitle}>Current Information</Text>
        </View>

        <InfoRow
          icon="person"
          label="Full Name"
          value={personalInfo.fullName}
          theme={theme}
          styles={styles}
        />
        <InfoRow
          icon="calendar"
          label="Date of Birth"
          value={personalInfo.dateOfBirth}
          theme={theme}
          styles={styles}
        />
        <InfoRow
          icon="shield-checkmark"
          label="Social Security Number"
          value={personalInfo.ssn}
          theme={theme}
          styles={styles}
        />
        <InfoRow
          icon="location"
          label="Current Address"
          value={`${personalInfo.address.street}, ${personalInfo.address.city}, ${personalInfo.address.state} ${personalInfo.address.zipCode}`}
          theme={theme}
          styles={styles}
        />
        <InfoRow
          icon="call"
          label="Phone Number"
          value={personalInfo.phone}
          theme={theme}
          styles={styles}
        />
        <InfoRow
          icon="mail"
          label="Email Address"
          value={personalInfo.email}
          theme={theme}
          styles={styles}
        />
      </View>

      {/* Employment Information */}
      {personalInfo.employmentInfo ? (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="briefcase" size={24} color={theme.colors.success} />
            <Text style={styles.cardTitle}>Employment Information</Text>
          </View>

          <InfoRow
            icon="business"
            label={personalInfo.employmentInfo.isCurrent ? 'Current Employer' : 'Latest Employment'}
            value={personalInfo.employmentInfo.employer}
            iconColor={theme.colors.success}
            theme={theme}
            styles={styles}
          />
          <InfoRow
            icon="ribbon"
            label="Position"
            value={personalInfo.employmentInfo.position}
            iconColor={theme.colors.success}
            theme={theme}
            styles={styles}
          />
          <InfoRow
            icon="time"
            label={
              personalInfo.employmentInfo.isCurrent
                ? 'Years at Current Employer'
                : 'Year of Employment'
            }
            value={
              personalInfo.employmentInfo.yearsEmployed &&
              personalInfo.employmentInfo.yearsEmployed > 0
                ? personalInfo.employmentInfo.isCurrent
                  ? `${new Date().getFullYear() - personalInfo.employmentInfo.yearsEmployed} years`
                  : `${personalInfo.employmentInfo.yearsEmployed}`
                : 'N/A'
            }
            iconColor={theme.colors.success}
            theme={theme}
            styles={styles}
          />
        </View>
      ) : (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="briefcase-outline" size={24} color={theme.colors.text.tertiary} />
            <Text style={styles.cardTitle}>Employment Information</Text>
          </View>
          <View style={styles.emptyEmploymentContainer}>
            <Text style={styles.emptyEmploymentText}>
              {providerName
                ? `No employment data from ${providerName}`
                : 'No employment data available'}
            </Text>
          </View>
        </View>
      )}

      {/* Previous Employments Accordion */}
      {personalInfo.previousEmployments && personalInfo.previousEmployments.length > 0 && (
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={() => setIsPreviousEmploymentsExpanded(!isPreviousEmploymentsExpanded)}
            activeOpacity={0.7}>
            <View style={styles.accordionHeaderContent}>
              <Ionicons name="briefcase-outline" size={24} color={theme.colors.text.secondary} />
              <Text style={styles.accordionTitle}>Previous Employments</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{personalInfo.previousEmployments.length}</Text>
              </View>
            </View>
            <Ionicons
              name={isPreviousEmploymentsExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={theme.colors.text.tertiary}
            />
          </TouchableOpacity>

          {isPreviousEmploymentsExpanded && (
            <View style={styles.previousEmploymentsList}>
              {personalInfo.previousEmployments.map((employment, index) => (
                <View key={index} style={styles.previousEmploymentCard}>
                  <View style={styles.previousEmploymentContent}>
                    <Text style={styles.previousEmploymentEmployer}>{employment.employer}</Text>
                    <Text style={styles.previousEmploymentDate}>
                      {employment.dateFormatted || 'Date not available'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Previous Addresses */}
      {personalInfo.previousAddresses && personalInfo.previousAddresses.length > 0 && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="location-outline" size={24} color={theme.colors.text.secondary} />
            <Text style={styles.cardTitle}>Previous Addresses</Text>
          </View>

          {personalInfo.previousAddresses.map((address, index) => (
            <View key={index} style={styles.addressItem}>
              <View style={styles.addressDot} />
              <View style={styles.addressContent}>
                <Text style={styles.addressText}>
                  {address.street}, {address.city}, {address.state} {address.zipCode}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Info Box */}
      <TouchableOpacity
        style={styles.infoBox}
        onPress={() => setShowInfo(!showInfo)}
        activeOpacity={0.7}>
        <Ionicons name="information-circle" size={20} color={theme.colors.accent} />
        <View style={styles.infoBoxContent}>
          <View style={styles.infoBoxHeader}>
            <Text style={styles.infoBoxTitle}>About Personal Information</Text>
            <Text style={styles.seeMoreText}>{showInfo ? 'See less' : 'See more...'}</Text>
          </View>
          {showInfo && (
            <Text style={styles.infoBoxText}>
              This information is used by lenders to verify your identity. If you notice any errors,
              you can dispute them with the credit bureaus.
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: {colors: any; spacing: any; textStyles: any}) =>
  StyleSheet.create({
    container: {
      padding: theme.spacing.lg,
    },
    standardSectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.xl,
    },
    headerIconCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.accent + '15',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTextContainer: {
      flex: 1,
    },
    standardSectionTitle: {
      ...theme.textStyles.headline3,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    standardSectionSubtitle: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.light,
    },
    cardTitle: {
      ...theme.textStyles.headline4,
      fontWeight: '700',
      color: theme.colors.text.primary,
    },
    infoRow: {
      flexDirection: 'row',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.subtle,
    },
    infoIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.surfaceSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    infoContent: {
      flex: 1,
    },
    infoLabel: {
      ...theme.textStyles.caption,
      color: theme.colors.text.secondary,
      marginBottom: 4,
      fontSize: 11,
      fontWeight: '500',
    },
    infoValue: {
      ...theme.textStyles.bodyLarge,
      color: theme.colors.text.primary,
      fontWeight: '600',
    },
    addressItem: {
      flexDirection: 'row',
      paddingVertical: theme.spacing.sm,
      alignItems: 'flex-start',
    },
    addressDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.text.tertiary,
      marginTop: 6,
      marginRight: theme.spacing.md,
    },
    addressContent: {
      flex: 1,
    },
    addressText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
      lineHeight: 22,
    },
    infoBox: {
      flexDirection: 'row',
      backgroundColor: theme.colors.accent + '10',
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.accent,
      padding: theme.spacing.md,
      borderRadius: 12,
      gap: theme.spacing.sm,
    },
    infoBoxContent: {
      flex: 1,
    },
    infoBoxHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    infoBoxTitle: {
      ...theme.textStyles.bodySmall,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    seeMoreText: {
      ...theme.textStyles.caption,
      color: theme.colors.accent,
      fontWeight: '600',
    },
    infoBoxText: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.text.secondary,
      lineHeight: 18,
      marginTop: 8,
    },
    emptyEmploymentContainer: {
      paddingVertical: theme.spacing.lg,
      alignItems: 'center',
    },
    emptyEmploymentText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.tertiary,
      textAlign: 'center',
      fontStyle: 'italic',
    },
    accordionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.md,
    },
    accordionHeaderContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      flex: 1,
    },
    accordionTitle: {
      ...theme.textStyles.headline4,
      fontWeight: '700',
      color: theme.colors.text.primary,
      flex: 1,
    },
    countBadge: {
      backgroundColor: theme.colors.accent + '20',
      borderRadius: 12,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      minWidth: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    countText: {
      ...theme.textStyles.caption,
      color: theme.colors.accent,
      fontWeight: '700',
      fontSize: 12,
    },
    previousEmploymentsList: {
      marginTop: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    previousEmploymentCard: {
      backgroundColor: theme.colors.surfaceSecondary,
      borderRadius: 12,
      padding: theme.spacing.md,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.accent,
    },
    previousEmploymentContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    previousEmploymentEmployer: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.primary,
      fontWeight: '600',
      flex: 1,
    },
    previousEmploymentDate: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.text.secondary,
      marginLeft: theme.spacing.sm,
    },
  });
