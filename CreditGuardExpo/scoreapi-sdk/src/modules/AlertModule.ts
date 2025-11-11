/**
 * Alert Module
 * Handles credit monitoring alerts
 */

import { HttpClient } from '../client';
import {
  AlertsResponse,
  Alert,
} from '../types/alert';

export class AlertModule {
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  /**
   * Get all user alerts
   */
  async getAlerts(): Promise<AlertsResponse> {
    const alerts = await this.http.get<Alert[]>('/users/efx-alerts');

    // Calculate unread count
    const unreadCount = Array.isArray(alerts)
      ? alerts.filter(a => !a.read).length
      : 0;

    return {
      alerts: Array.isArray(alerts) ? alerts : [],
      unreadCount,
      totalCount: Array.isArray(alerts) ? alerts.length : 0,
    };
  }
}
