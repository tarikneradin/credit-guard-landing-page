import {Ionicons} from '@expo/vector-icons';

/**
 * Backend alert format from the API
 */
export interface BackendAlert {
  id: string;
  type: string;
  name: string;
  dateReported: number; // timestamp in milliseconds
  provider: string;
}

/**
 * UI format for alerts displayed in the AlertsScreen
 */
export interface UIAlert {
  id: string;
  type: string;
  title: string;
  message: string;
  date: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  unread: boolean;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  bureau: string; // Bureau abbreviation (EFX, TU, EXP, etc.)
}

/**
 * Format a timestamp (milliseconds) as relative time (e.g., "1 hour ago", "2 days ago")
 */
export const formatRelativeTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffWeeks === 1) return '1 week ago';
  if (diffWeeks < 4) return `${diffWeeks} weeks ago`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return '1 month ago';
  if (diffMonths < 12) return `${diffMonths} months ago`;

  const diffYears = Math.floor(diffDays / 365);
  if (diffYears === 1) return '1 year ago';
  return `${diffYears} years ago`;
};

/**
 * Get user-friendly title for alert type
 */
export const getTitleForAlertType = (type: string): string => {
  switch (type) {
    case 'ACCOUNTNUMBERCHANGE':
      return 'Account Number Changed';
    case 'ACCOUNTDESIGNATORCHANGE':
    case 'ACCOUNTACTIVITYDESIGNATORCHANGE':
      return 'Account Relationship Changed';
    case 'ACCOUNTNARRATIVECHANGE':
      return 'Account Status Updated';
    case 'ACCOUNTSTATUSCHANGE':
      return 'Account Status Changed';
    case 'ADDRESS':
      return 'Address Updated';
    case 'BALANCEAMOUNT':
      return 'Balance Amount Changed';
    case 'BALANCEPERCENT':
      return 'Credit Utilization Changed';
    case 'BANKRUPTCY':
      return 'Bankruptcy Record Updated';
    case 'CHANGEVALUESCORE':
    case 'SCORECHANGE':
      return 'Credit Score Changed';
    case 'COLLECTION':
      return 'Account in Collections';
    case 'CRCACCESSWITHINVALIDPIN':
      return 'Suspicious Credit Access';
    case 'CRCSTATEFREEZE':
      return 'Credit File Freeze Changed';
    case 'CREDITLIMIT':
      return 'Credit Limit Changed';
    case 'DORMANTMONTHS':
      return 'Account Activity Changed';
    case 'GARNISHMENT':
      return 'Wage Garnishment Updated';
    case 'INQUIRY':
    case 'HARDINQUIRY':
      return 'Credit Inquiry';
    case 'BLOCKEDINQUIRY':
      return 'Credit Inquiry Blocked';
    case 'LEGALITEM':
      return 'Legal Record Updated';
    case 'MINIMUNLEVELSCORE':
      return 'Score Requirement Changed';
    case 'NAME':
      return 'Name Updated';
    case 'TARGETSCORE':
      return 'Target Score Changed';
    case 'TAXLIEN':
      return 'Tax Lien Updated';
    case 'TRADELINE':
      return 'Account Updated';
    case 'TELCOUTILITY':
      return 'Utility Account Updated';
    case 'UNKNOWN':
      return 'Unknown Alert';
    default:
      return 'Credit Alert';
  }
};

/**
 * Get user-friendly message for alert type
 */
export const getMessageForAlertType = (type: string): string => {
  switch (type) {
    case 'ACCOUNTNUMBERCHANGE':
      return 'Your account number changed.';
    case 'ACCOUNTDESIGNATORCHANGE':
    case 'ACCOUNTACTIVITYDESIGNATORCHANGE':
      return 'Your relationship to an account changed (like joint vs solo).';
    case 'ACCOUNTNARRATIVECHANGE':
      return 'The description of an account changed (like status text).';
    case 'ACCOUNTSTATUSCHANGE':
      return 'Account status updated (open, closed, delinquent).';
    case 'ADDRESS':
      return 'A new mailing address appeared.';
    case 'BALANCEAMOUNT':
      return 'Your account balance changed.';
    case 'BALANCEPERCENT':
      return 'Your credit usage percentage changed.';
    case 'BANKRUPTCY':
      return 'Bankruptcy record added/updated.';
    case 'CHANGEVALUESCORE':
    case 'SCORECHANGE':
      return 'Credit score change recorded.';
    case 'COLLECTION':
      return 'An account entered or changed in collections.';
    case 'CRCACCESSWITHINVALIDPIN':
      return 'Someone tried to access your credit with a wrong PIN.';
    case 'CRCSTATEFREEZE':
      return 'Credit file was frozen/unfrozen.';
    case 'CREDITLIMIT':
      return 'Your credit limit changed.';
    case 'DORMANTMONTHS':
      return 'An inactive account came alive again.';
    case 'GARNISHMENT':
      return 'Wage garnishment info added/changed.';
    case 'INQUIRY':
      return 'Someone checked your credit (soft or general).';
    case 'HARDINQUIRY':
      return 'A lender pulled your credit (application).';
    case 'BLOCKEDINQUIRY':
      return 'Someone tried to check your credit but got blocked.';
    case 'LEGALITEM':
      return 'A legal filing appeared (judgment, lawsuit).';
    case 'MINIMUNLEVELSCORE':
      return 'A minimum score threshold flag changed.';
    case 'NAME':
      return 'A name change recorded on your report.';
    case 'TARGETSCORE':
      return 'A target score reference changed.';
    case 'TAXLIEN':
      return 'A tax lien appeared/updated.';
    case 'TRADELINE':
      return 'New or updated credit account (loan, card, etc).';
    case 'TELCOUTILITY':
      return 'Telecom or utility account info changed.';
    case 'UNKNOWN':
      return 'Something changed… but the system shrugged.';
    default:
      return 'A credit alert was detected on your report.';
  }
};

/**
 * Get icon name for alert type
 */
export const getIconForAlertType = (type: string): keyof typeof Ionicons.glyphMap => {
  switch (type) {
    case 'ACCOUNTNUMBERCHANGE':
      return 'key-outline';
    case 'ACCOUNTDESIGNATORCHANGE':
    case 'ACCOUNTACTIVITYDESIGNATORCHANGE':
      return 'people-outline';
    case 'ACCOUNTNARRATIVECHANGE':
      return 'document-text-outline';
    case 'ACCOUNTSTATUSCHANGE':
      return 'information-circle-outline';
    case 'ADDRESS':
      return 'home-outline';
    case 'BALANCEAMOUNT':
      return 'cash-outline';
    case 'BALANCEPERCENT':
      return 'pie-chart-outline';
    case 'BANKRUPTCY':
      return 'alert-circle-outline';
    case 'CHANGEVALUESCORE':
    case 'SCORECHANGE':
      // For simplicity, use trending-up-outline. Could be enhanced to check score direction dynamically
      return 'trending-up-outline';
    case 'COLLECTION':
      return 'warning-outline';
    case 'CRCACCESSWITHINVALIDPIN':
      return 'shield-half-outline';
    case 'CRCSTATEFREEZE':
      return 'snow-outline';
    case 'CREDITLIMIT':
      return 'stats-chart-outline';
    case 'DORMANTMONTHS':
      return 'time-outline';
    case 'GARNISHMENT':
      return 'briefcase-outline';
    case 'INQUIRY':
      return 'eye-outline';
    case 'HARDINQUIRY':
      return 'search-outline';
    case 'BLOCKEDINQUIRY':
      return 'shield-outline';
    case 'LEGALITEM':
      return 'construct-outline';
    case 'MINIMUNLEVELSCORE':
      return 'flag-outline';
    case 'NAME':
      return 'person-outline';
    case 'TARGETSCORE':
      return 'radio-button-on-outline';
    case 'TAXLIEN':
      return 'receipt-outline';
    case 'TRADELINE':
      return 'card-outline';
    case 'TELCOUTILITY':
      return 'flash-outline';
    case 'UNKNOWN':
      return 'help-circle-outline';
    default:
      return 'notifications-outline';
  }
};

/**
 * Get severity for alert type
 */
export const getSeverityForAlertType = (type: string): 'low' | 'medium' | 'high' | 'critical' => {
  switch (type) {
    case 'BANKRUPTCY':
    case 'CRCACCESSWITHINVALIDPIN':
    case 'COLLECTION':
      return 'critical';
    case 'GARNISHMENT':
    case 'TAXLIEN':
    case 'LEGALITEM':
    case 'ACCOUNTSTATUSCHANGE':
      return 'high';
    case 'ACCOUNTNARRATIVECHANGE':
    case 'SCORECHANGE':
    case 'CHANGEVALUESCORE':
    case 'CREDITLIMIT':
    case 'HARDINQUIRY':
      return 'medium';
    default:
      return 'low';
  }
};

/**
 * Get color for alert based on severity and type
 */
export const getColorForAlert = (
  severity: 'low' | 'medium' | 'high' | 'critical',
  type: string,
  theme: {
    colors: {
      error: string;
      warning: string;
      success: string;
      accent: string;
      text: {secondary: string};
    };
  },
): string => {
  // Map severity to colors
  switch (severity) {
    case 'critical':
      return theme.colors.error;
    case 'high':
      return theme.colors.warning;
    case 'medium':
      return theme.colors.accent;
    case 'low':
      return theme.colors.text.secondary;
    default:
      return theme.colors.text.secondary;
  }
};

/**
 * Map backend Alert to UI Alert format
 */
export const mapAlertToUI = (
  alert: BackendAlert,
  theme: {
    colors: {
      error: string;
      warning: string;
      success: string;
      accent: string;
      text: {secondary: string};
    };
  },
): UIAlert => {
  const severity = getSeverityForAlertType(alert.type);

  return {
    id: alert.id,
    type: alert.type,
    title: getTitleForAlertType(alert.type),
    message: getMessageForAlertType(alert.type),
    date: formatRelativeTime(alert.dateReported),
    icon: getIconForAlertType(alert.type),
    color: getColorForAlert(severity, alert.type, theme),
    unread: true, // For now, assume all alerts are unread
    severity,
    bureau: alert.provider || 'N/A', // Default to N/A if not provided
  };
};

/**
 * Map bureau selection to provider abbreviation
 * @param bureau - The bureau selection ('equifax', 'transunion', 'experian', or 'all')
 * @returns Provider abbreviation ('EFX', 'TU', 'EXP') or null for 'all'
 */
export const getProviderFromBureau = (
  bureau: 'equifax' | 'transunion' | 'experian' | 'all',
): string | null => {
  switch (bureau) {
    case 'equifax':
      return 'EFX';
    case 'transunion':
      return 'TU';
    case 'experian':
      return 'EXP';
    case 'all':
      return null; // null means show all
    default:
      return null;
  }
};

/**
 * Filter and map alerts based on selected bureau
 * @param alerts - Array of backend alerts
 * @param selectedBureau - Selected bureau filter
 * @param theme - Theme object for mapping
 * @returns Filtered and mapped UI alerts
 */
export const filterAndMapAlerts = (
  alerts: any[],
  selectedBureau: 'equifax' | 'transunion' | 'experian' | 'all',
  theme: {
    colors: {
      error: string;
      warning: string;
      success: string;
      accent: string;
      text: {secondary: string};
    };
  },
): UIAlert[] => {
  const targetProvider = getProviderFromBureau(selectedBureau);

  return Array.isArray(alerts)
    ? alerts
        .filter(
          (alert): alert is BackendAlert =>
            alert &&
            typeof alert === 'object' &&
            'id' in alert &&
            'type' in alert &&
            'dateReported' in alert &&
            (targetProvider === null || alert.provider === targetProvider),
        )
        .map(alert => mapAlertToUI(alert, theme))
    : [];
};
