import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from '../../contexts/ThemeContext';

interface UpgradeModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  visible,
  onClose,
  onUpgrade,
}) => {
  const {theme} = useTheme();
  const styles = createStyles(theme);
  const handleUpgrade = () => {
    onUpgrade?.();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <Ionicons name="star" size={48} color="#FFD700" />
              </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>Upgrade to Premium</Text>

            {/* Description */}
            <Text style={styles.description}>
              Get access to credit reports from all 3 bureaus and unlock powerful AI tools to
              improve your credit score faster.
            </Text>

            {/* Features List */}
            <View style={styles.featuresContainer}>
              <Feature
                icon="shield-checkmark"
                title="All 3 Bureau Reports"
                description="Monitor Equifax, TransUnion, and Experian"
                theme={theme}
                styles={styles}
              />
              <Feature
                icon="sparkles"
                title="AI Credit Assistant"
                description="24/7 personalized credit improvement guidance"
                theme={theme}
                styles={styles}
              />
              <Feature
                icon="trending-up"
                title="AI Score Predictor"
                description="See how actions will impact your score before you take them"
                theme={theme}
                styles={styles}
              />
              <Feature
                icon="flash"
                title="Smart Action Engine"
                description="Automated recommendations prioritized by impact"
                theme={theme}
                styles={styles}
              />
              <Feature
                icon="notifications"
                title="Real-time Alerts"
                description="Instant notifications for all credit changes"
                theme={theme}
                styles={styles}
              />
              <Feature
                icon="lock-closed"
                title="Identity Theft Protection"
                description="Advanced monitoring and dark web scanning"
                theme={theme}
                styles={styles}
              />
            </View>

            {/* Pricing */}
            <View style={styles.pricingContainer}>
              <Text style={styles.pricingText}>
                <Text style={styles.priceAmount}>$39.99</Text>
                <Text style={styles.pricePeriod}> /month</Text>
              </Text>
              <Text style={styles.pricingSubtext}>Cancel anytime • 7-day free trial</Text>
            </View>

            {/* CTA Button */}
            <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
              <Text style={styles.upgradeButtonText}>Start Free Trial</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Footer */}
            <Text style={styles.footerText}>
              No credit card required for trial
            </Text>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

interface FeatureProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  theme: any;
  styles: any;
}

const Feature: React.FC<FeatureProps> = ({icon, title, description, theme, styles}) => (
  <View style={styles.featureItem}>
    <View style={styles.featureIconContainer}>
      <Ionicons name={icon} size={24} color={theme.colors.accent} />
    </View>
    <View style={styles.featureContent}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const createStyles = (theme: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: theme.spacing.xl,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    zIndex: 1,
    padding: theme.spacing.sm,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFF9E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  featuresContainer: {
    marginBottom: theme.spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${theme.colors.accent}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text.secondary,
  },
  pricingContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border.light,
  },
  pricingText: {
    marginBottom: theme.spacing.xs,
  },
  priceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: theme.colors.accent,
  },
  pricePeriod: {
    fontSize: 18,
    fontWeight: '400',
    color: theme.colors.text.secondary,
  },
  pricingSubtext: {
    fontSize: 14,
    color: theme.colors.text.tertiary,
  },
  upgradeButton: {
    backgroundColor: theme.colors.accent,
    borderRadius: 12,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    shadowColor: theme.colors.accent,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  upgradeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footerText: {
    fontSize: 12,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
  },
});
