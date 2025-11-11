import {Colors, Spacing, TextStyles} from '../../constants';
import {createStyles} from '../../utils/styles';

export const serviceFailureStyles = createStyles({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.xxxl,
  },
  card: {
    alignItems: 'center',
    padding: Spacing.xxxl,
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
    textAlign: 'center',
    color: Colors.text.primary,
  },
  message: {
    ...TextStyles.bodyRegular,
    textAlign: 'center',
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  subMessage: {
    ...TextStyles.bodyRegular,
    textAlign: 'center',
    color: Colors.text.secondary,
    lineHeight: 22,
  },
});
