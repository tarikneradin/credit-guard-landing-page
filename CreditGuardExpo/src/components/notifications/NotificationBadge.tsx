import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';

interface NotificationBadgeProps {
  count: number;
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  size = 'medium',
  style,
}) => {
  const {theme} = useTheme();

  if (count === 0) return null;

  const displayCount = count > 99 ? '99+' : count.toString();

  const sizeConfig = {
    small: {width: 16, height: 16, fontSize: 10},
    medium: {width: 20, height: 20, fontSize: 12},
    large: {width: 24, height: 24, fontSize: 13},
  };

  const config = sizeConfig[size];

  const styles = StyleSheet.create({
    badge: {
      backgroundColor: theme.colors.error,
      borderRadius: config.width / 2,
      minWidth: config.width,
      height: config.height,
      paddingHorizontal: 4,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.colors.surface,
    },
    text: {
      color: theme.colors.surface,
      fontSize: config.fontSize,
      fontWeight: '700',
    },
  });

  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.text}>{displayCount}</Text>
    </View>
  );
};
