import React, {forwardRef} from 'react';
import {
  TextInput,
  Text,
  View,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import {Colors, TextStyles, Spacing} from '../../constants';
import {createStyles} from '../../utils/styles';

interface CreditInputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export const CreditInput = forwardRef<TextInput, CreditInputProps>(
  (
    {label, error, helperText, required, leftIcon, rightIcon, onRightIconPress, style, ...props},
    ref,
  ) => {
    const hasError = Boolean(error);
    // const isFocused = false; // We could add focus state management if needed

    return (
      <View style={styles.container}>
        {label && (
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        )}

        <View style={[styles.inputContainer, hasError && styles.inputError, style]}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

          <TextInput
            ref={ref}
            style={[styles.input, leftIcon ? styles.inputWithLeftIcon : null]}
            placeholderTextColor={Colors.text.tertiary}
            {...props}
          />

          {rightIcon && (
            <TouchableOpacity
              style={styles.rightIcon}
              onPress={onRightIconPress}
              disabled={!onRightIconPress}>
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>

        {(error || helperText) && (
          <Text style={[styles.helperText, hasError && styles.errorText]}>
            {error || helperText}
          </Text>
        )}
      </View>
    );
  },
);

CreditInput.displayName = 'CreditInput';

const styles = createStyles({
  container: {
    marginBottom: Spacing.md,
  } as ViewStyle,

  label: {
    ...TextStyles.label,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  } as TextStyle,

  required: {
    color: Colors.error,
  } as TextStyle,

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border.light,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    minHeight: 48,
  } as ViewStyle,

  inputError: {
    borderColor: Colors.error,
  } as ViewStyle,

  input: {
    flex: 1,
    ...TextStyles.bodyRegular,
    color: Colors.text.primary,
    paddingVertical: Spacing.md,
    minHeight: 48,
  } as TextStyle,

  inputWithLeftIcon: {
    marginLeft: Spacing.sm,
  } as TextStyle,

  leftIcon: {
    marginRight: Spacing.sm,
  } as ViewStyle,

  rightIcon: {
    marginLeft: Spacing.sm,
    padding: Spacing.xs,
  } as ViewStyle,

  helperText: {
    ...TextStyles.bodySmall,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  } as TextStyle,

  errorText: {
    color: Colors.error,
  } as TextStyle,
});
