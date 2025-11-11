import {Colors, Spacing, TextStyles} from '../../constants';
import {createStyles} from '../../utils/styles';

export const registerScreenStyles = createStyles({
  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    ...TextStyles.headline1,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...TextStyles.bodyLarge,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  demoCard: {
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.transparent.primary,
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  demoTitle: {
    ...TextStyles.bodyMedium,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  demoText: {
    ...TextStyles.bodySmall,
    color: Colors.text.secondary,
    lineHeight: 18,
    textAlign: 'center',
  },
  formSection: {
    marginBottom: Spacing.xl,
  },
  errorContainer: {
    backgroundColor: Colors.transparent.error,
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  errorText: {
    ...TextStyles.bodySmall,
    color: Colors.error,
    textAlign: 'center',
  },
  termsContainer: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
    backgroundColor: Colors.surfaceSecondary,
  },
  termsTextScrollView: {
    maxHeight: 120,
    marginBottom: Spacing.sm,
  },
  termsTextScrollContent: {
    padding: Spacing.xs,
  },
  termsText: {
    ...TextStyles.bodySmall,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  termsSecondaryParagraph: {
    marginTop: Spacing.sm,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.border.medium,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.text.inverse,
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    ...TextStyles.bodySmall,
    color: Colors.text.secondary,
    flex: 1,
    lineHeight: 20,
  },
  termsError: {
    ...TextStyles.bodySmall,
    color: Colors.error,
    marginBottom: Spacing.md,
    marginTop: -Spacing.sm,
    textAlign: 'center',
  },
  registerButton: {
    marginTop: Spacing.md,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  signInText: {
    ...TextStyles.bodyRegular,
    color: Colors.text.secondary,
  },
  signInLink: {
    ...TextStyles.bodyRegular,
    color: Colors.primary,
    fontWeight: '600',
  },
});

export type RegisterScreenStyles = typeof registerScreenStyles;
