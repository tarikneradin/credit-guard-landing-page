/* eslint-disable @typescript-eslint/no-explicit-any */

import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal, Pressable} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';

export interface RecoveryQuestion {
  id: number;
  question: string;
}

interface RecoveryQuestionDropdownProps {
  selectedQuestionId: number | null;
  onSelect: (questionId: number) => void;
  questions: RecoveryQuestion[];
  error?: string;
  style?: any;
}

export const RecoveryQuestionDropdown: React.FC<RecoveryQuestionDropdownProps> = ({
  selectedQuestionId,
  onSelect,
  questions,
  error,
  style,
}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const [isOpen, setIsOpen] = useState(false);

  const selectedQuestion = questions.find(q => q.id === selectedQuestionId);

  const handleSelect = (questionId: number) => {
    onSelect(questionId);
    setIsOpen(false);
  };

  const renderOption = (question: RecoveryQuestion) => {
    const isSelected = question.id === selectedQuestionId;

    return (
      <TouchableOpacity
        key={question.id}
        style={[styles.option, isSelected && styles.optionSelected]}
        onPress={() => handleSelect(question.id)}
        activeOpacity={0.7}>
        <View style={styles.optionContent}>
          <Text
            style={[
              styles.optionQuestion,
              // eslint-disable-next-line react-native/no-inline-styles
              isSelected && {fontWeight: '700'},
            ]}>
            {question.question}
          </Text>
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
          error && styles.triggerError,
          {borderColor: error ? theme.colors.error : theme.colors.accent + '40'},
        ]}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}>
        <View style={styles.triggerLeft}>
          <View style={[styles.triggerIcon, {backgroundColor: theme.colors.accent + '15'}]}>
            <Ionicons name="help-circle" size={18} color={theme.colors.accent} />
          </View>
          <View style={styles.triggerText}>
            <Text style={styles.triggerLabel}>Security Question</Text>
            <Text style={[styles.triggerValue, !selectedQuestion && styles.triggerPlaceholder]}>
              {selectedQuestion ? selectedQuestion.question : 'Select a security question'}
            </Text>
          </View>
        </View>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={theme.colors.text.secondary}
        />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Dropdown Modal */}
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setIsOpen(false)}>
          <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Security Question</Text>
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                style={styles.closeButton}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.optionsList}>{questions.map(renderOption)}</View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      position: 'relative',
      marginBottom: theme.spacing.md,
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
      minHeight: 64,
    },
    triggerOpen: {
      borderColor: theme.colors.accent,
      shadowOpacity: 0.15,
    },
    triggerError: {
      borderColor: theme.colors.error,
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
    triggerLabel: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.text.secondary,
      marginBottom: 2,
    },
    triggerValue: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '600',
      color: theme.colors.text.primary,
    },
    triggerPlaceholder: {
      color: theme.colors.text.tertiary,
      fontWeight: '400',
    },
    errorText: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.error,
      marginTop: theme.spacing.xs,
      marginLeft: theme.spacing.xs,
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
      maxHeight: '80%',
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
      borderColor: theme.colors.accent,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    optionContent: {
      flex: 1,
    },
    optionQuestion: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '500',
      color: theme.colors.text.primary,
      lineHeight: 22,
    },
  });
