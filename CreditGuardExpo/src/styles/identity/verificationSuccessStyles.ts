import {Colors, Spacing, TextStyles} from '../../constants';
import {createStyles} from '../../utils/styles';

export const verificationSuccessStyles = createStyles({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    position: 'relative',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.xl,
  },
  progressContainer: {
    width: '100%',
  },
  iconContainer: {
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 48,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  title: {
    ...TextStyles.headline2,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...TextStyles.bodyLarge,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  successCard: {
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xxxl,
    gap: Spacing.xl,
  },
  featureList: {
    gap: Spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  featureIcon: {
    fontSize: 24,
    marginTop: 2,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    ...TextStyles.headline4,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  featureDescription: {
    ...TextStyles.bodySmall,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  continueButton: {
    marginTop: Spacing.md,
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  welcomeText: {
    ...TextStyles.bodyRegular,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export type VerificationSuccessStyles = typeof verificationSuccessStyles;
