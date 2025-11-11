import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {EquifaxSecurityCardProps} from '../../types/equifax';

export const EquifaxSecurityCard: React.FC<EquifaxSecurityCardProps> = ({
  feature,
  onPress,
}) => {
  const {theme} = useTheme();

  return (
    <TouchableOpacity
      style={styles(theme).card}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={[styles(theme).iconContainer, {backgroundColor: feature.color + '15'}]}>
        <Ionicons name={feature.icon as any} size={32} color={feature.color} />
      </View>

      <View style={styles(theme).content}>
        <Text style={styles(theme).title}>{feature.title}</Text>
        <Text style={styles(theme).description} numberOfLines={2}>
          {feature.description}
        </Text>
      </View>

      <View style={styles(theme).chevron}>
        <Ionicons name="chevron-forward" size={24} color={theme.colors.text.tertiary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = (theme: any) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    content: {
      flex: 1,
    },
    title: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '600',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.xs,
    },
    description: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
      lineHeight: 18,
    },
    chevron: {
      marginLeft: theme.spacing.sm,
    },
  });
