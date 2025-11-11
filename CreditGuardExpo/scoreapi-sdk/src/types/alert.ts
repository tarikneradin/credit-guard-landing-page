/**
 * Credit monitoring alert types
 */

export interface Alert {
  alertId: string;
  userId: string;
  type: string;
  category: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  read: boolean;
  createdAt: string;
  readAt?: string;
  metadata?: any;
}

export interface AlertsResponse {
  alerts: Alert[];
  unreadCount: number;
  totalCount: number;
}

export interface MarkAlertReadRequest {
  alertId: string;
}

export interface MarkAlertReadResponse {
  success: boolean;
  alertId: string;
}
