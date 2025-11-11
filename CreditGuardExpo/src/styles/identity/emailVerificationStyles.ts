import {Colors, Spacing, TextStyles} from '../../constants';
import {createStyles} from '../../utils/styles';

export const emailVerificationStyles = createStyles({
  contentSection: {
    alignItems: 'center',
    gap: Spacing.lg,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...TextStyles.headline3,
    color: Colors.text.primary,
  },
  message: {
    ...TextStyles.bodyRegular,
    textAlign: 'center',
    color: Colors.text.secondary,
  },
  subtitle: {
    ...TextStyles.bodyRegular,
    textAlign: 'center',
    color: Colors.text.secondary,
  },
  email: {
    ...TextStyles.bodyLarge,
    color: Colors.primary,
  },
  resendLink: {
    ...TextStyles.bodyRegular,
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  cooldownText: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  errorContainer: {
    width: '100%',
    backgroundColor: Colors.transparent.error,
    borderColor: Colors.error,
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.md,
  },
  errorText: {
    ...TextStyles.bodySmall,
    color: Colors.error,
    textAlign: 'center',
  },
});
