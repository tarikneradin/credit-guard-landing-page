import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {OptimalPathAction} from '../../types/optimalPath';

interface OptimalPathActionCardProps {
  action: OptimalPathAction;
  onToggleComplete?: (actionId: string, completed: boolean) => void;
  onViewDetails?: (action: OptimalPathAction) => void;
}

export const OptimalPathActionCard: React.FC<OptimalPathActionCardProps> = ({
  action,
  onToggleComplete,
  onViewDetails,
}) => {
  const {theme} = useTheme();
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    onToggleComplete?.(action.id, !action.completed);
  };

  const getPriorityColor = () => {
    switch (action.priority) {
      case 'high':
        return theme.colors.error;
      case 'medium':
        return theme.colors.warning;
      case 'low':
        return theme.colors.success;
      default:
        return theme.colors.text.secondary;
    }
  };

  const getCategoryIcon = () => {
    switch (action.category) {
      case 'payment':
        return 'card';
      case 'utilization':
        return 'pie-chart';
      case 'inquiries':
        return 'search';
      case 'accounts':
        return 'briefcase';
      case 'habits':
        return 'trophy';
      case 'disputes':
        return 'document-text';
      default:
        return 'checkmark-circle';
    }
  };

  return (
    <View
      style={[
        styles(theme).container,
        action.completed && styles(theme).completedContainer,
      ]}>
      {/* Main Row */}
      <View style={styles(theme).mainRow}>
        {/* Checkbox */}
        <TouchableOpacity
          style={styles(theme).checkbox}
          onPress={handleToggle}
          activeOpacity={0.7}>
          <View
            style={[
              styles(theme).checkboxBox,
              action.completed && styles(theme).checkboxBoxChecked,
            ]}>
            {action.completed && (
              <Ionicons name="checkmark" size={18} color={theme.colors.surface} />
            )}
          </View>
        </TouchableOpacity>

        {/* Content */}
        <View style={styles(theme).content}>
          {/* Title and Impact Badge */}
          <View style={styles(theme).titleRow}>
            <Text
              style={[
                styles(theme).title,
                action.completed && styles(theme).titleCompleted,
              ]}
              numberOfLines={expanded ? undefined : 2}>
              {action.title}
            </Text>
          </View>

          {/* Impact Badge */}
          <View style={styles(theme).badgesRow}>
            <View style={styles(theme).impactBadge}>
              <Text style={styles(theme).impactBadgeText}>
                ~+{action.estimatedImpact} pts
              </Text>
            </View>

            {/* Tags */}
            {action.tags.slice(0, 2).map((tag, index) => (
              <View
                key={index}
                style={[
                  styles(theme).tag,
                  {
                    backgroundColor:
                      tag.toLowerCase().includes('priority')
                        ? theme.colors.error + '15'
                        : tag.toLowerCase().includes('utilization')
                          ? theme.colors.warning + '15'
                          : theme.colors.success + '15',
                  },
                ]}>
                <Text
                  style={[
                    styles(theme).tagText,
                    {
                      color: tag.toLowerCase().includes('priority')
                        ? theme.colors.error
                        : tag.toLowerCase().includes('utilization')
                          ? theme.colors.warning
                          : theme.colors.success,
                    },
                  ]}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>

          {/* Description */}
          {!action.completed && (
            <Text style={styles(theme).description} numberOfLines={expanded ? undefined : 2}>
              {action.description}
            </Text>
          )}

          {/* Timeframe */}
          <View style={styles(theme).metaRow}>
            <Ionicons
              name="time-outline"
              size={14}
              color={theme.colors.text.tertiary}
            />
            <Text style={styles(theme).metaText}>{action.estimatedTimeframe}</Text>

            <View style={styles(theme).metaSeparator} />

            <Ionicons
              name={getCategoryIcon() as any}
              size={14}
              color={theme.colors.text.tertiary}
            />
            <Text style={styles(theme).metaText}>
              {action.category.charAt(0).toUpperCase() + action.category.slice(1)}
            </Text>
          </View>

          {/* Completed Date */}
          {action.completed && action.completedDate && (
            <View style={styles(theme).completedRow}>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={theme.colors.success}
              />
              <Text style={styles(theme).completedText}>
                Completed{' '}
                {new Date(action.completedDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </View>
          )}

          {/* Expandable Steps */}
          {expanded && !action.completed && action.steps.length > 0 && (
            <View style={styles(theme).stepsContainer}>
              <Text style={styles(theme).stepsTitle}>How to complete:</Text>
              {action.steps.map((step, index) => (
                <View key={index} style={styles(theme).stepRow}>
                  <Text style={styles(theme).stepNumber}>{index + 1}.</Text>
                  <Text style={styles(theme).stepText}>{step}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Expand/Collapse Button */}
          {!action.completed && action.steps.length > 0 && (
            <TouchableOpacity
              style={styles(theme).expandButton}
              onPress={() => setExpanded(!expanded)}>
              <Text style={styles(theme).expandButtonText}>
                {expanded ? 'Show less' : 'Show steps'}
              </Text>
              <Ionicons
                name={expanded ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = (theme: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      shadowColor: theme.colors.shadow.light,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
    },
    completedContainer: {
      backgroundColor: theme.colors.success + '08',
      borderColor: theme.colors.success + '30',
    },
    mainRow: {
      flexDirection: 'row',
    },
    checkbox: {
      marginRight: theme.spacing.md,
      paddingTop: 2,
    },
    checkboxBox: {
      width: 24,
      height: 24,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: theme.colors.border.light,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surface,
    },
    checkboxBoxChecked: {
      backgroundColor: theme.colors.success,
      borderColor: theme.colors.success,
    },
    content: {
      flex: 1,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.xs,
    },
    title: {
      ...theme.textStyles.bodyLarge,
      fontWeight: '700',
      color: theme.colors.text.primary,
      flex: 1,
      lineHeight: 22,
      letterSpacing: 0.2,
    },
    titleCompleted: {
      color: theme.colors.text.secondary,
      textDecorationLine: 'line-through',
    },
    badgesRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.sm,
    },
    impactBadge: {
      backgroundColor: theme.colors.primary + '15',
      paddingHorizontal: theme.spacing.sm + 2,
      paddingVertical: 5,
      borderRadius: 8,
    },
    impactBadgeText: {
      ...theme.textStyles.caption,
      fontWeight: '700',
      color: theme.colors.primary,
      fontSize: 12,
      letterSpacing: 0.3,
    },
    tag: {
      paddingHorizontal: theme.spacing.sm + 2,
      paddingVertical: 5,
      borderRadius: 8,
    },
    tagText: {
      ...theme.textStyles.caption,
      fontWeight: '700',
      fontSize: 11,
      letterSpacing: 0.3,
    },
    description: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
      lineHeight: 20,
      marginBottom: theme.spacing.sm,
      fontWeight: '500',
      letterSpacing: 0.2,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    metaText: {
      ...theme.textStyles.caption,
      color: theme.colors.text.tertiary,
      marginLeft: 4,
    },
    metaSeparator: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.colors.text.tertiary,
      marginHorizontal: theme.spacing.sm,
    },
    completedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      marginTop: theme.spacing.xs,
    },
    completedText: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.success,
      fontWeight: '600',
    },
    stepsContainer: {
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      padding: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border.subtle,
    },
    stepsTitle: {
      ...theme.textStyles.bodyMedium,
      fontWeight: '700',
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.sm,
      letterSpacing: 0.2,
    },
    stepRow: {
      flexDirection: 'row',
      marginBottom: theme.spacing.sm,
    },
    stepNumber: {
      ...theme.textStyles.bodyMedium,
      fontWeight: '600',
      color: theme.colors.primary,
      marginRight: theme.spacing.sm,
      minWidth: 20,
    },
    stepText: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.secondary,
      flex: 1,
      lineHeight: 20,
    },
    expandButton: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      marginTop: theme.spacing.sm,
      gap: 4,
    },
    expandButtonText: {
      ...theme.textStyles.bodyMedium,
      fontWeight: '600',
      color: theme.colors.primary,
    },
  });
