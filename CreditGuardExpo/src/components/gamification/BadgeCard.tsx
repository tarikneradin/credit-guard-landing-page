import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {Badge} from '../../types/gamification';

interface BadgeCardProps {
  badge: Badge;
  unlocked: boolean;
  isNew?: boolean;
  onPress?: () => void;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({badge, unlocked, isNew, onPress}) => {
  const {theme} = useTheme();

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return '#94A3B8';
      case 'rare':
        return '#3B82F6';
      case 'epic':
        return '#8B5CF6';
      case 'legendary':
        return '#F59E0B';
      default:
        return theme.colors.text.tertiary;
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: theme.spacing.md,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: unlocked ? getRarityColor(badge.rarity) : theme.colors.border.light,
      opacity: unlocked ? 1 : 0.5,
      position: 'relative',
      minWidth: 100,
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: unlocked ? badge.color + '20' : theme.colors.surfaceSecondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.sm,
    },
    lockedOverlay: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background + 'CC',
      borderRadius: 14,
    },
    name: {
      ...theme.textStyles.bodyMedium,
      fontWeight: '700',
      color: theme.colors.text.primary,
      textAlign: 'center',
      marginBottom: 4,
    },
    description: {
      ...theme.textStyles.caption,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      lineHeight: 16,
    },
    points: {
      ...theme.textStyles.caption,
      color: theme.colors.accent,
      fontWeight: '700',
      marginTop: 4,
    },
    newBadge: {
      position: 'absolute',
      top: -8,
      right: -8,
      backgroundColor: theme.colors.error,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    newText: {
      ...theme.textStyles.caption,
      fontSize: 10,
      color: theme.colors.surface,
      fontWeight: '700',
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}>
      {isNew && unlocked && (
        <View style={styles.newBadge}>
          <Text style={styles.newText}>NEW</Text>
        </View>
      )}

      <View style={styles.iconContainer}>
        <Ionicons
          name={badge.icon as any}
          size={32}
          color={unlocked ? badge.color : theme.colors.text.tertiary}
        />
      </View>

      <Text style={styles.name} numberOfLines={2}>
        {badge.name}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {badge.description}
      </Text>
      <Text style={styles.points}>+{badge.points} pts</Text>

      {!unlocked && (
        <View style={styles.lockedOverlay}>
          <Ionicons name="lock-closed" size={32} color={theme.colors.text.tertiary} />
        </View>
      )}
    </TouchableOpacity>
  );
};
