import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  TextInput,
  FlatList,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

import {Colors, TextStyles, Spacing} from '../../constants';
import {createStyles} from '../../utils/styles';
import {US_STATES} from '../../constants/usStates';

interface StateSelectInputProps {
  label?: string;
  value: string;
  onSelect: (stateCode: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  containerStyle?: StyleProp<ViewStyle>;
  onBlur?: () => void;
}

const styles = createStyles({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    ...TextStyles.label,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  required: {
    color: Colors.error,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border.light,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    minHeight: 48,
  },
  triggerError: {
    borderColor: Colors.error,
  },
  triggerContent: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  triggerValue: {
    ...TextStyles.bodyRegular,
    color: Colors.text.primary,
  },
  triggerPlaceholder: {
    color: Colors.text.tertiary,
  },
  helperText: {
    ...TextStyles.bodySmall,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  helperTextError: {
    color: Colors.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    width: '100%',
    maxWidth: 420,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  modalTitle: {
    ...TextStyles.headline3,
    color: Colors.text.primary,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
    gap: Spacing.sm,
  },
  searchIcon: {
    color: Colors.text.tertiary,
  },
  searchInput: {
    flex: 1,
    ...TextStyles.bodyRegular,
    color: Colors.text.primary,
    paddingVertical: Spacing.xs,
  },
  listContent: {
    paddingVertical: Spacing.xs,
  },
  stateItem: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stateItemSelected: {
    backgroundColor: Colors.primary + '10',
  },
  stateName: {
    ...TextStyles.bodyLarge,
    color: Colors.text.primary,
  },
  stateCode: {
    ...TextStyles.bodySmall,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  emptyState: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  emptyStateText: {
    ...TextStyles.bodySmall,
    color: Colors.text.tertiary,
  },
});

export const StateSelectInput: React.FC<StateSelectInputProps> = ({
  label,
  value,
  onSelect,
  placeholder = 'Select state',
  error,
  required,
  helperText,
  containerStyle,
  onBlur,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const displayValue = useMemo(() => {
    const normalizedValue = value.trim().toUpperCase();
    const match = US_STATES.find(state => state.abbreviation === normalizedValue);
    if (match) {
      return match.abbreviation;
    }
    return normalizedValue;
  }, [value]);

  const filteredStates = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return US_STATES;
    }

    return US_STATES.filter(
      state =>
        state.name.toLowerCase().includes(term) || state.abbreviation.toLowerCase().includes(term),
    );
  }, [searchTerm]);

  const closeModal = () => {
    setIsOpen(false);
    setSearchTerm('');
    if (onBlur) {
      onBlur();
    }
  };

  const handleSelect = (stateCode: string) => {
    onSelect(stateCode);
    closeModal();
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <TouchableOpacity
        style={[styles.trigger, error && styles.triggerError]}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}>
        <View style={styles.triggerContent}>
          <Text
            style={[styles.triggerValue, !displayValue && styles.triggerPlaceholder]}
            numberOfLines={1}>
            {displayValue || placeholder}
          </Text>
        </View>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={Colors.text.secondary}
        />
      </TouchableOpacity>

      {(error || helperText) && (
        <Text style={[styles.helperText, error && styles.helperTextError]}>
          {error || helperText}
        </Text>
      )}

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={closeModal}>
        <Pressable style={styles.modalOverlay} onPress={closeModal}>
          <Pressable style={styles.modalContent} onPress={event => event.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select State</Text>
              <TouchableOpacity
                onPress={closeModal}
                style={styles.closeButton}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Ionicons name="close" size={24} color={Colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Ionicons name="search" size={18} style={styles.searchIcon} />
              <TextInput
                placeholder="Search by state or abbreviation"
                placeholderTextColor={Colors.text.tertiary}
                value={searchTerm}
                onChangeText={setSearchTerm}
                autoFocus
                style={styles.searchInput}
              />
            </View>

            <FlatList
              data={filteredStates}
              keyExtractor={item => item.abbreviation}
              contentContainerStyle={styles.listContent}
              keyboardShouldPersistTaps="handled"
              renderItem={({item}) => {
                const isSelected = item.abbreviation === value;
                return (
                  <TouchableOpacity
                    style={[styles.stateItem, isSelected && styles.stateItemSelected]}
                    onPress={() => handleSelect(item.abbreviation)}
                    activeOpacity={0.7}>
                    <Text style={styles.stateName}>{item.name}</Text>
                    <Text style={styles.stateCode}>{item.abbreviation}</Text>
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>No states match your search.</Text>
                </View>
              }
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};
