import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import {Colors, TextStyles} from '../../constants';
import {createStyles, createShadow} from '../../utils/styles';

interface CreditButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const CreditButton: React.FC<CreditButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  icon,
  disabled,
  style,
  ...props
}) => {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyle = [styles.text, styles[`${variant}Text`], styles[`${size}Text`]];

  return (
    <TouchableOpacity
      style={buttonStyle}
      disabled={loading || disabled}
      activeOpacity={0.8}
      {...props}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? Colors.text.inverse : Colors.primary}
        />
      ) : (
        <>
          {icon && icon}
          <Text style={textStyle}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = createStyles({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 48,
  } as ViewStyle,

  // Variants
  primary: {
    backgroundColor: Colors.primary,
    ...createShadow(2, Colors.primary, 0.24),
  } as ViewStyle,

  secondary: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  } as ViewStyle,

  ghost: {
    backgroundColor: 'transparent',
  } as ViewStyle,

  // Sizes
  small: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 40,
    borderRadius: 8,
  } as ViewStyle,

  medium: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 48,
    borderRadius: 12,
  } as ViewStyle,

  large: {
    paddingHorizontal: 32,
    paddingVertical: 20,
    minHeight: 56,
    borderRadius: 14,
  } as ViewStyle,

  // Full width
  fullWidth: {
    width: '100%',
  } as ViewStyle,

  // Disabled state
  disabled: {
    opacity: 0.5,
  } as ViewStyle,

  // Text styles
  text: {
    ...TextStyles.button,
    textAlign: 'center',
  } as TextStyle,

  primaryText: {
    color: Colors.text.inverse,
  } as TextStyle,

  secondaryText: {
    color: Colors.primary,
  } as TextStyle,

  ghostText: {
    color: Colors.primary,
  } as TextStyle,

  smallText: {
    fontSize: 14,
  } as TextStyle,

  mediumText: {
    fontSize: 16,
  } as TextStyle,

  largeText: {
    fontSize: 18,
  } as TextStyle,
});
