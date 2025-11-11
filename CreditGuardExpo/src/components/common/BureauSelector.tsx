import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';

export type Bureau = 'equifax' | 'transunion' | 'experian';

interface BureauOption {
  id: Bureau;
  name: string;
  shortName: string;
  color: string;
  icon: string;
}

interface BureauSelectorProps {
  selectedBureau: Bureau;
  onBureauChange: (bureau: Bureau) => void;
  availableBureaus?: Bureau[]; // For subscription-based access
  style?: any;
  compact?: boolean;
}

const BUREAUS: BureauOption[] = [
  {
    id: 'equifax',
    name: 'Equifax',
    shortName: 'EFX',
    color: '#E31937',
    icon: 'shield-checkmark',
  },
  {
    id: 'transunion',
    name: 'TransUnion',
    shortName: 'TU',
    color: '#0066B2',
    icon: 'shield',
  },
  {
    id: 'experian',
    name: 'Experian',
    shortName: 'EXP',
    color: '#003DA5',
    icon: 'shield-outline',
  },
];

export const BureauSelector: React.FC<BureauSelectorProps> = ({
  selectedBureau,
  onBureauChange,
  availableBureaus = ['equifax', 'transunion', 'experian'],
  style,
  compact = false,
}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme, compact);

  const renderBureauButton = (bureau: BureauOption) => {
    const isSelected = selectedBureau === bureau.id;
    const isAvailable = availableBureaus.includes(bureau.id);
    const isDisabled = !isAvailable;

    return (
      <TouchableOpacity
        key={bureau.id}
        style={[
          styles.bureauButton,
          isSelected && styles.bureauButtonSelected,
          isSelected && {
            borderColor: bureau.color,
            backgroundColor: bureau.color + '15',
          },
          isDisabled && styles.bureauButtonDisabled,
        ]}
        onPress={() => isAvailable && onBureauChange(bureau.id)}
        activeOpacity={0.7}
        disabled={isDisabled}>
        <View
          style={[
            styles.bureauIconContainer,
            isSelected && {backgroundColor: bureau.color + '20'},
            isDisabled && styles.bureauIconDisabled,
          ]}>
          <Ionicons
            name={bureau.icon as any}
            size={compact ? 16 : 20}
            color={isSelected ? bureau.color : theme.colors.text.secondary}
          />
        </View>
        <View style={styles.bureauTextContainer}>
          <Text
            style={[
              styles.bureauName,
              isSelected && {color: bureau.color, fontWeight: '700'},
              isDisabled && styles.bureauNameDisabled,
            ]}>
            {compact ? bureau.shortName : bureau.name}
          </Text>
          {!compact && !isAvailable && (
            <View style={styles.lockBadge}>
              <Ionicons name="lock-closed" size={10} color={theme.colors.text.quaternary} />
              <Text style={styles.lockText}>Premium</Text>
            </View>
          )}
        </View>
        {isSelected && !compact && (
          <Ionicons name="checkmark-circle" size={18} color={bureau.color} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {!compact && (
        <View style={styles.header}>
          <Ionicons name="business" size={18} color={theme.colors.text.secondary} />
          <Text style={styles.headerText}>Credit Bureau</Text>
        </View>
      )}
      <View style={styles.bureauButtons}>
        {BUREAUS.map(renderBureauButton)}
      </View>
    </View>
  );
};

const createStyles = (theme: any, compact: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: compact ? 12 : 16,
      padding: compact ? theme.spacing.sm : theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: compact ? 0.05 : 0.08,
      shadowRadius: compact ? 4 : 8,
      elevation: compact ? 1 : 2,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    headerText: {
      ...theme.textStyles.bodyMedium,
      fontWeight: '600',
      color: theme.colors.text.secondary,
    },
    bureauButtons: {
      flexDirection: 'row',
      gap: compact ? theme.spacing.xs : theme.spacing.sm,
    },
    bureauButton: {
      flex: 1,
      flexDirection: compact ? 'column' : 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: compact ? theme.spacing.sm : theme.spacing.md,
      borderRadius: compact ? 8 : 12,
      backgroundColor: theme.colors.background,
      borderWidth: compact ? 1 : 2,
      borderColor: theme.colors.border.light,
      gap: compact ? 4 : theme.spacing.sm,
      minHeight: compact ? 60 : 56,
    },
    bureauButtonSelected: {
      borderWidth: 2,
      shadowColor: theme.colors.shadow.medium,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 3,
    },
    bureauButtonDisabled: {
      opacity: 0.5,
    },
    bureauIconContainer: {
      width: compact ? 28 : 32,
      height: compact ? 28 : 32,
      borderRadius: compact ? 14 : 16,
      backgroundColor: theme.colors.border.light,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bureauIconDisabled: {
      backgroundColor: theme.colors.border.subtle,
    },
    bureauTextContainer: {
      alignItems: compact ? 'center' : 'flex-start',
      flex: compact ? 0 : 1,
    },
    bureauName: {
      ...theme.textStyles.bodyMedium,
      fontSize: compact ? 11 : 14,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    bureauNameDisabled: {
      color: theme.colors.text.quaternary,
    },
    lockBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
      marginTop: 2,
    },
    lockText: {
      fontSize: 9,
      fontWeight: '600',
      color: theme.colors.text.quaternary,
      letterSpacing: 0.3,
    },
  });
