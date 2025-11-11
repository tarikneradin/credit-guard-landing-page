/* eslint-disable @typescript-eslint/no-explicit-any */

import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal, Pressable} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {UpgradeModal} from './UpgradeModal';
import {useNavigation} from '@react-navigation/native';

export type Bureau = 'equifax' | 'transunion' | 'experian' | 'all';

interface BureauOption {
  id: Bureau;
  name: string;
  shortName: string;
  color: string;
  icon: string;
}

interface BureauDropdownProps {
  selectedBureau: Bureau;
  onBureauChange: (bureau: Bureau) => void;
  availableBureaus?: Bureau[];
  showAllOption?: boolean; // Show "All Bureaus" option
  style?: any;
}

const ALL_OPTION: BureauOption = {
  id: 'all',
  name: 'All Bureaus',
  shortName: 'ALL',
  color: '#7C3AED', // Will use theme accent color
  icon: 'layers',
};

// Note: color field is used for icon/background styling, will be overridden with theme.colors.accent at render time
const BUREAUS: BureauOption[] = [
  {
    id: 'equifax',
    name: 'Equifax',
    shortName: 'EFX',
    color: '#7C3AED', // Will use theme accent color
    icon: 'business',
    // logo: require('../../../assets/bureaus/equifax-logo.png'), // TODO: Add actual bureau logo
  },
  {
    id: 'transunion',
    name: 'TransUnion',
    shortName: 'TU',
    color: '#7C3AED', // Will use theme accent color
    icon: 'business',
    // logo: require('../../../assets/bureaus/transunion-logo.png'), // TODO: Add actual bureau logo
  },
  {
    id: 'experian',
    name: 'Experian',
    shortName: 'EXP',
    color: '#7C3AED', // Will use theme accent color
    icon: 'business',
    // logo: require('../../../assets/bureaus/experian-logo.png'), // TODO: Add actual bureau logo
  },
];

export const BureauDropdown: React.FC<BureauDropdownProps> = ({
  selectedBureau,
  onBureauChange,
  availableBureaus = ['equifax', 'transunion', 'experian'],
  showAllOption = false,
  style,
}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();
  const [isOpen, setIsOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleUpgrade = () => {
    // Navigate to subscription/upgrade screen
    // @ts-ignore - navigation types may vary
    navigation.navigate('Subscription');
  };

  const allOptions = showAllOption ? [ALL_OPTION, ...BUREAUS] : BUREAUS;
  const selectedOption = allOptions.find(b => b.id === selectedBureau) || allOptions[0];

  const handleSelect = (bureau: Bureau) => {
    // Allow selecting "all" option even if not in availableBureaus
    if (bureau === 'all' || availableBureaus.includes(bureau)) {
      onBureauChange(bureau);
      setIsOpen(false);
    }
  };

  const renderOption = (bureau: BureauOption) => {
    const isSelected = bureau.id === selectedBureau;
    const isAvailable = availableBureaus.includes(bureau.id) || bureau.id === 'all';
    const isDisabled = !isAvailable;

    return (
      <TouchableOpacity
        key={bureau.id}
        style={[
          styles.option,
          isSelected && styles.optionSelected,
          isDisabled && styles.optionDisabled,
        ]}
        onPress={() => handleSelect(bureau.id)}
        disabled={isDisabled}
        activeOpacity={0.7}>
        <View
          style={[
            styles.optionIcon,
            {backgroundColor: theme.colors.accent + '15'},
            isDisabled && styles.optionIconDisabled,
          ]}>
          <Ionicons
            name={bureau.icon as any}
            size={20}
            color={isDisabled ? theme.colors.text.quaternary : theme.colors.accent}
          />
        </View>

        <View style={styles.optionContent}>
          <Text
            style={[
              styles.optionName,
              // eslint-disable-next-line react-native/no-inline-styles
              isSelected && {fontWeight: '700'},
              isDisabled && styles.optionNameDisabled,
            ]}>
            {bureau.name}
          </Text>
          {!isAvailable && (
            <View style={styles.lockBadge}>
              <Ionicons name="lock-closed" size={10} color={theme.colors.text.quaternary} />
              <Text style={styles.lockText}>Premium</Text>
            </View>
          )}
        </View>

        {isSelected && <Ionicons name="checkmark-circle" size={20} color={theme.colors.accent} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {/* Dropdown Trigger Button */}
      <TouchableOpacity
        style={[
          styles.trigger,
          isOpen && styles.triggerOpen,
          {borderColor: theme.colors.accent + '40'},
        ]}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}>
        <View style={styles.triggerLeft}>
          <View style={[styles.triggerIcon, {backgroundColor: theme.colors.accent + '15'}]}>
            <Ionicons name={selectedOption.icon as any} size={18} color={theme.colors.accent} />
          </View>
          <View style={styles.triggerText}>
            <Text style={styles.triggerValue}>{selectedOption.name}</Text>
          </View>
        </View>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={theme.colors.text.secondary}
        />
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setIsOpen(false)}>
          <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Credit Bureau</Text>
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                style={styles.closeButton}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.optionsList}>{allOptions.map(renderOption)}</View>

            {availableBureaus.length < 3 && (
              <View style={styles.upgradePromptContainer}>
                <TouchableOpacity
                  style={styles.upgradeButton}
                  onPress={() => {
                    setIsOpen(false);
                    setShowUpgradeModal(true);
                  }}
                  activeOpacity={0.7}>
                  <Ionicons name="star" size={18} color="#FFFFFF" />
                  <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
                </TouchableOpacity>
                <Text style={styles.upgradeHint}>
                  Get access to all 3 bureaus and powerful AI tools
                </Text>
              </View>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Upgrade Modal */}
      <UpgradeModal
        visible={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handleUpgrade}
      />
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      position: 'relative',
    },
    trigger: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: theme.spacing.md,
      borderWidth: 1.5,
      borderColor: theme.colors.border.light,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    triggerOpen: {
      borderColor: theme.colors.accent,
      shadowOpacity: 0.15,
    },
    triggerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      flex: 1,
    },
    triggerIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    triggerText: {
      flex: 1,
      justifyContent: 'center',
    },
    triggerValue: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '700',
      color: theme.colors.text.primary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      width: '100%',
      maxWidth: 400,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 10},
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.light,
    },
    modalTitle: {
      ...theme.textStyles.headline3,
      fontWeight: '700',
      color: theme.colors.text.primary,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    optionsList: {
      padding: theme.spacing.md,
      gap: theme.spacing.xs,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      borderRadius: 12,
      gap: theme.spacing.md,
      backgroundColor: theme.colors.background,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    optionSelected: {
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    optionDisabled: {
      opacity: 0.5,
    },
    optionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    optionIconDisabled: {
      backgroundColor: theme.colors.border.subtle,
    },
    optionContent: {
      flex: 1,
    },
    optionName: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    optionNameDisabled: {
      color: theme.colors.text.quaternary,
    },
    lockBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 2,
    },
    lockText: {
      fontSize: 10,
      fontWeight: '600',
      color: theme.colors.text.quaternary,
      letterSpacing: 0.3,
    },
    upgradePromptContainer: {
      padding: theme.spacing.md,
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.light,
      gap: theme.spacing.sm,
    },
    upgradeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      backgroundColor: theme.colors.accent,
      padding: theme.spacing.md,
      borderRadius: 12,
      shadowColor: theme.colors.accent,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    upgradeButtonText: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    upgradeHint: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.text.tertiary,
      textAlign: 'center',
      paddingHorizontal: theme.spacing.md,
    },
  });
