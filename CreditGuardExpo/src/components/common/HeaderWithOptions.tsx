import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Modal, StyleSheet, Platform, Pressable} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';
import {BlurView} from 'expo-blur';

export interface MenuOption {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  action: () => void;
  color?: string;
}

interface HeaderWithOptionsProps {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  options?: MenuOption[];
  onBackPress?: () => void;
  showBackButton?: boolean;
}

export const HeaderWithOptions: React.FC<HeaderWithOptionsProps> = ({
  title,
  subtitle,
  icon,
  iconColor,
  options = [],
  onBackPress,
  showBackButton = false,
}) => {
  const {theme} = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  const styles = createStyles(theme);

  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {showBackButton && onBackPress && (
            <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          )}
          {icon && (
            <View style={styles.headerIcon}>
              <Ionicons name={icon} size={24} color={iconColor || theme.colors.accent} />
            </View>
          )}
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{title}</Text>
            {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
          </View>
        </View>

        {options.length > 0 && (
          <TouchableOpacity onPress={() => setShowMenu(true)} style={styles.menuButton}>
            <Ionicons name="ellipsis-vertical" size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Options Menu Modal */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowMenu(false)}>
          <View style={styles.menuContainer}>
            {Platform.OS === 'ios' ? (
              <BlurView
                intensity={80}
                tint={theme.isDark ? 'dark' : 'light'}
                style={styles.menuBlur}>
                {renderMenuContent()}
              </BlurView>
            ) : (
              <View style={styles.menuContent}>{renderMenuContent()}</View>
            )}
          </View>
        </Pressable>
      </Modal>
    </>
  );

  function renderMenuContent() {
    return (
      <>
        <View style={styles.menuHeader}>
          <Text style={styles.menuTitle}>Options</Text>
          <TouchableOpacity onPress={() => setShowMenu(false)} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        </View>

        {options.map((option, index) => (
          <TouchableOpacity
            key={option.id}
            style={[styles.menuOption, index === options.length - 1 && styles.lastMenuOption]}
            onPress={() => {
              setShowMenu(false);
              option.action();
            }}>
            <View style={styles.optionLeft}>
              <View
                style={[
                  styles.optionIconContainer,
                  {backgroundColor: `${option.color || theme.colors.accent}15`},
                ]}>
                <Ionicons
                  name={option.icon}
                  size={20}
                  color={option.color || theme.colors.accent}
                />
              </View>
              <Text style={styles.optionLabel}>{option.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.text.tertiary} />
          </TouchableOpacity>
        ))}
      </>
    );
  }
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.isDark ? theme.colors.border.light : theme.colors.border.subtle,
      backgroundColor: theme.colors.background,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    backButton: {
      marginRight: theme.spacing.md,
    },
    headerIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: `${theme.colors.accent}15`,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    headerTextContainer: {
      flex: 1,
    },
    headerTitle: {
      ...theme.textStyles.headline3,
      color: theme.colors.text.primary,
      fontWeight: '700',
      letterSpacing: -0.3,
    },
    headerSubtitle: {
      ...theme.textStyles.bodySmall,
      color: theme.colors.text.secondary,
      marginTop: 4,
      lineHeight: 18,
    },
    menuButton: {
      padding: theme.spacing.sm,
      marginLeft: theme.spacing.md,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    menuContainer: {
      backgroundColor: 'transparent',
    },
    menuBlur: {
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      overflow: 'hidden',
    },
    menuContent: {
      backgroundColor: theme.isDark ? theme.colors.surface : theme.colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    },
    menuHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.isDark ? theme.colors.border.light : theme.colors.border.subtle,
    },
    menuTitle: {
      ...theme.textStyles.headline4,
      color: theme.colors.text.primary,
      fontWeight: '700',
      letterSpacing: -0.2,
    },
    closeButton: {
      padding: theme.spacing.xs,
    },
    menuOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.subtle,
    },
    lastMenuOption: {
      borderBottomWidth: 0,
    },
    optionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    optionIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    optionLabel: {
      ...theme.textStyles.bodyMedium,
      color: theme.colors.text.primary,
      fontWeight: '600',
      letterSpacing: -0.1,
    },
  });
