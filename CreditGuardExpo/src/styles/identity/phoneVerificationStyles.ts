import {Colors, Spacing, TextStyles} from '../../constants';
import {createStyles} from '../../utils/styles';

export const phoneVerificationStyles = createStyles({
  header: {
    paddingBottom: Spacing.lg,
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  title: {
    ...TextStyles.headline1,
    color: Colors.text.primary,
    fontWeight: '700',
  },
  subtitle: {
    ...TextStyles.bodyLarge,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.md,
  },
  phoneHighlight: {
    color: Colors.primary,
    fontWeight: '600',
  },
  resendContainer: {
    alignItems: 'flex-end',
    marginBottom: Spacing.lg,
  },
  resendLink: {
    ...TextStyles.bodyRegular,
    color: Colors.primary,
    fontWeight: '500',
  },
  cooldownText: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  contentSection: {
    marginBottom: Spacing.xl,
  },
  noticeBox: {
    width: '100%',
    backgroundColor: Colors.transparent.error,
    borderColor: Colors.error,
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  noticeText: {
    ...TextStyles.bodySmall,
    color: Colors.error,
    textAlign: 'center',
  },
  continueButton: {
    marginTop: Spacing.xl,
  },
  messageBox: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.light,
    backgroundColor: Colors.surface,
  },
  messageHeading: {
    ...TextStyles.bodyRegular,
    color: Colors.text.primary,
    fontWeight: '500',
    marginBottom: Spacing.sm,
  },
  messageText: {
    ...TextStyles.bodyRegular,
    color: Colors.text.primary,
    lineHeight: 20,
  },
  messageLink: {
    ...TextStyles.bodyRegular,
    color: Colors.primary,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});
