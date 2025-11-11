import {Colors, Spacing, TextStyles} from '../../constants';
import {createStyles} from '../../utils/styles';

export const personalInfoStyles = createStyles({
  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    ...TextStyles.headline1,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...TextStyles.bodyLarge,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.md,
  },
  formSection: {
    marginBottom: Spacing.xl,
  },
  errorContainer: {
    backgroundColor: Colors.transparent.error,
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: 10,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  errorText: {
    ...TextStyles.bodySmall,
    color: Colors.error,
    textAlign: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    marginHorizontal: -Spacing.xs,
  },
  nameField: {
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: -Spacing.xs,
  },
  cityField: {
    flex: 2,
    marginHorizontal: Spacing.xs,
  },
  stateField: {
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  zipField: {
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  submitButton: {
    marginTop: Spacing.md,
  },
  securityNotice: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  securityText: {
    ...TextStyles.bodySmall,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export type PersonalInfoStyles = typeof personalInfoStyles;
