import {Colors, Spacing, TextStyles} from '../../constants';
import {createStyles} from '../../utils/styles';

export const smfaFailureStyles = createStyles({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.lg,
  },
  hero: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    paddingHorizontal: Spacing.md,
  },
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 999,
    marginBottom: Spacing.md,
  },
  badgeWarning: {
    backgroundColor: Colors.alert.warningBg,
  },
  badgeError: {
    backgroundColor: Colors.alert.errorBg,
  },
  badgeInfo: {
    backgroundColor: Colors.alert.infoBg,
  },
  badgeText: {
    ...TextStyles.caption,
    fontWeight: '600',
    color: Colors.text.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  heroTitle: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  heroHeadline: {
    ...TextStyles.headline2,
    textAlign: 'center',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  heroDescription: {
    ...TextStyles.bodyRegular,
    textAlign: 'center',
    color: Colors.text.secondary,
  },
  card: {
    padding: Spacing.xxl,
  },
  sectionTitle: {
    ...TextStyles.headline4,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  guidanceList: {
    marginBottom: Spacing.xl,
  },
  guidanceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: Spacing.sm,
    backgroundColor: Colors.primary,
  },
  guidanceText: {
    ...TextStyles.bodySmall,
    color: Colors.text.secondary,
    flex: 1,
    marginLeft: Spacing.md,
  },
  detailsCard: {
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: 14,
    padding: Spacing.lg,
    backgroundColor: Colors.surfaceSecondary,
    marginBottom: Spacing.xl,
  },
  detailItem: {
    ...TextStyles.bodySmall,
    color: Colors.text.primary,
    marginTop: Spacing.xs,
  },
  link: {
    ...TextStyles.bodyRegular,
    color: Colors.primary,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  cooldownText: {
    ...TextStyles.caption,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  modalTrigger: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTriggerText: {
    ...TextStyles.bodyRegular,
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: Spacing.xxl,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    ...TextStyles.headline3,
    color: Colors.text.primary,
  },
  modalClose: {
    ...TextStyles.headline3,
    color: Colors.text.secondary,
  },
  modalScroll: {
    maxHeight: 360,
    marginBottom: Spacing.xl,
  },
  modalScrollContent: {
    paddingRight: Spacing.sm,
  },
  modalList: {
    gap: Spacing.md,
  },
  modalItem: {
    backgroundColor: Colors.alert.errorBg,
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.alert.error,
  },
  modalItemTitle: {
    ...TextStyles.bodySmall,
    fontWeight: '600',
    color: Colors.error,
    marginBottom: Spacing.xs,
  },
  modalItemText: {
    ...TextStyles.bodySmall,
    color: Colors.text.primary,
    lineHeight: 20,
  },
  modalButton: {
    marginTop: Spacing.sm,
  },
});
